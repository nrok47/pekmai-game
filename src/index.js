import { DurableObject } from "cloudflare:workers";

// การ์ดทั้งหมดในสำรับ (ชื่อ/กติกาอยู่ฝั่งหน้าเว็บ public/app.js) · R = หายาก
const IDS = [];
for (let i = 1; i <= 25; i++) IDS.push(String(i));
IDS.push("R1", "R2");
const MAX_PER_CARD = 8;
const MAX_SEATS = 12;
// การ์ดที่ให้สถานะติดตัวคนจั่วจนถึงรอบหน้า / ของที่เก็บไว้ใช้ / กฎที่ใช้ทั้งเกม
const STATUS_CARDS = new Set(["11", "13", "14", "15", "16", "17", "22", "23", "24"]);
const HOLD_CARDS = new Set(["8", "10", "19", "R1"]);
const RULE_CARDS = new Set(["12", "18"]);

const defaults = () => Object.fromEntries(IDS.map((id) => [id, id.startsWith("R") ? 1 : 2]));
const sig = (counts) => IDS.map((id) => counts[id] || 0).join(",");
const fresh = () => ({
  counts: defaults(), built: "", deck: [], drawn: [], cur: null, by: "", dir: 1, seq: 0, started: false,
  seats: [], turnId: null, stat: {}, rules: [],
});
const cleanName = (s) => String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 16);
const cleanId = (s) => String(s || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);

function shuffled(counts) {
  const deck = [];
  for (const id of IDS) for (let i = 0; i < (counts[id] || 0); i++) deck.push(id);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.lastDraw = 0;
    ctx.blockConcurrencyWhile(async () => {
      const s = (await ctx.storage.get("s")) || fresh();
      // ห้องเก่าที่เซฟไว้ก่อนมีการ์ดใหม่/ลำดับตา
      for (const id of IDS) if (s.counts[id] == null) s.counts[id] = id.startsWith("R") ? 1 : 2;
      s.seats = s.seats || [];
      s.stat = s.stat || {};
      s.rules = s.rules || [];
      if (s.turnId === undefined) s.turnId = null;
      this.s = s;
    });
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("expected websocket", { status: 426 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id: "", name: "" });
    this.send(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  // รหัสผู้เล่นที่ต่อสดอยู่ตอนนี้
  onlineIds() {
    const ids = new Set();
    for (const w of this.ctx.getWebSockets()) {
      if (w.readyState !== 1) continue;
      const a = w.deserializeAttachment() || {};
      if (a.id) ids.add(a.id);
    }
    return [...ids];
  }

  payload() {
    return JSON.stringify({ type: "state", s: this.s, online: this.onlineIds() });
  }

  send(ws) {
    ws.send(this.payload());
  }

  broadcast() {
    const msg = this.payload();
    for (const w of this.ctx.getWebSockets()) {
      try { w.send(msg); } catch (e) { /* socket closing */ }
    }
  }

  save() {
    this.ctx.storage.put("s", this.s);
    this.broadcast();
  }

  statOf(id) {
    const st = (this.s.stat[id] = this.s.stat[id] || { drinks: 0, lemon: 0, status: [], hold: [] });
    return st;
  }

  // ตาเป็นของ id: สถานะ "ถึงรอบหน้า" ของคนนั้นหมดอายุ
  setTurn(id) {
    this.s.turnId = id;
    if (id && this.s.stat[id]) this.s.stat[id].status = [];
  }

  // เลื่อนตาไปคนถัดไปที่ออนไลน์ ตามทิศปัจจุบัน
  advanceTurn() {
    const s = this.s;
    const n = s.seats.length;
    if (!n) { s.turnId = null; return; }
    const online = new Set(this.onlineIds());
    let i = s.seats.findIndex((p) => p.id === s.turnId);
    if (i < 0) i = 0;
    for (let k = 1; k <= n; k++) {
      const j = (((i + k * s.dir) % n) + n) % n;
      if (online.has(s.seats[j].id)) { this.setTurn(s.seats[j].id); return; }
    }
  }

  // ตาที่ถือค้างอยู่กับคนที่ออฟไลน์ ให้ข้ามไปคนที่อยู่
  ensureTurn() {
    const s = this.s;
    if (!s.seats.length) { s.turnId = null; return; }
    const online = new Set(this.onlineIds());
    if (!s.seats.some((p) => p.id === s.turnId)) this.setTurn(s.seats[0].id);
    if (!online.has(s.turnId) && online.size) this.advanceTurn();
  }

  seat(id, name) {
    const s = this.s;
    let p = s.seats.find((x) => x.id === id);
    if (!p) {
      if (s.seats.length >= MAX_SEATS) return false;
      p = { id, name };
      s.seats.push(p);
    }
    if (name) p.name = name;
    if (!p.name) p.name = "ผู้เล่น " + (s.seats.indexOf(p) + 1);
    return true;
  }

  webSocketMessage(ws, raw) {
    if (typeof raw !== "string" || raw.length > 2000) return;
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }
    const id = cleanId(m.id);
    const name = cleanName(m.name);
    if (!id) return;
    ws.serializeAttachment({ id, name });
    const s = this.s;
    if (!this.seat(id, name)) return;
    const me = s.seats.find((p) => p.id === id);
    if (!s.turnId) this.setTurn(id);

    if (m.type === "hello") {
      this.ensureTurn();
      this.save();
    } else if (m.type === "count" && IDS.includes(m.card)) {
      const cid = m.card;
      const d = m.delta === -1 ? -1 : 1;
      s.counts[cid] = Math.max(0, Math.min(MAX_PER_CARD, (s.counts[cid] || 0) + d));
      this.save();
    } else if (m.type === "all") {
      if (m.v === "def") s.counts = defaults();
      else {
        const v = [1, 2, 3].includes(m.v) ? m.v : 2;
        s.counts = Object.fromEntries(IDS.map((cid) => [cid, cid.startsWith("R") ? Math.min(1, v) : v]));
      }
      this.save();
    } else if (m.type === "shuffle") {
      const deck = shuffled(s.counts);
      if (!deck.length) return;
      Object.assign(s, { deck, built: sig(s.counts), drawn: [], cur: null, by: "", dir: 1, started: true, seq: s.seq + 1, rules: [] });
      for (const k of Object.keys(s.stat)) { s.stat[k].status = []; s.stat[k].hold = []; }
      this.setTurn(id);
      this.save();
    } else if (m.type === "draw") {
      const now = Date.now();
      if (!s.started || !s.deck.length || now - this.lastDraw < 400) return;
      this.ensureTurn();
      if (s.turnId !== id) { this.broadcast(); return; } // ยังไม่ถึงตา
      this.lastDraw = now;
      const card = s.deck.shift();
      s.drawn.push({ c: card, by: me.name });
      if (s.drawn.length > 40) s.drawn = s.drawn.slice(-40);
      s.cur = card;
      s.by = me.name;
      s.seq += 1;
      if (card === "20") s.dir = s.dir === -1 ? 1 : -1;
      const st = this.statOf(id);
      if (STATUS_CARDS.has(card) && !st.status.includes(card)) st.status.push(card);
      if (HOLD_CARDS.has(card) && st.hold.length < 6) st.hold.push(card);
      if (RULE_CARDS.has(card) && !s.rules.includes(card)) s.rules.push(card);
      if (card === "R2") { s.rules = []; for (const k of Object.keys(s.stat)) s.stat[k].status = []; }
      this.advanceTurn();
      this.save();
    } else if (m.type === "drink") {
      const target = cleanId(m.target);
      if (s.seats.some((p) => p.id === target)) {
        const st = this.statOf(target);
        const key = m.kind === "lemon" ? "lemon" : "drinks";
        st[key] = Math.max(0, Math.min(99, st[key] + (m.delta === -1 ? -1 : 1)));
        this.save();
      }
    } else if (m.type === "use") {
      const st = this.statOf(id);
      const i = st.hold.indexOf(String(m.card));
      if (i >= 0) { st.hold.splice(i, 1); this.save(); }
    } else if (m.type === "resetstats") {
      for (const k of Object.keys(s.stat)) { s.stat[k].drinks = 0; s.stat[k].lemon = 0; }
      this.save();
    } else if (m.type === "skip") {
      // ข้ามตา: เจ้าของตา หรือใครก็ได้ถ้าเจ้าของตาไม่อยู่
      const online = new Set(this.onlineIds());
      if (s.turnId === id || !online.has(s.turnId)) { this.advanceTurn(); this.save(); }
    } else if (m.type === "remove") {
      const target = cleanId(m.target);
      const online = new Set(this.onlineIds());
      if (target && target !== id && !online.has(target)) {
        const wasTurn = s.turnId === target;
        if (wasTurn) this.advanceTurn();
        s.seats = s.seats.filter((p) => p.id !== target);
        delete s.stat[target];
        if (wasTurn && s.turnId === target) s.turnId = s.seats[0] ? s.seats[0].id : null;
        this.save();
      }
    }
  }

  webSocketClose(ws) {
    try { ws.close(); } catch (e) { /* already closed */ }
    this.ensureTurn();
    this.broadcast();
  }

  webSocketError() {
    this.broadcast();
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/ws\/([A-Za-z0-9]{2,12})$/);
    if (m) {
      const stub = env.ROOM.get(env.ROOM.idFromName(m[1].toUpperCase()));
      return stub.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
