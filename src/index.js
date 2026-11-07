import { DurableObject } from "cloudflare:workers";

// การ์ดทั้งหมดในสำรับ (ชื่อ/กติกาอยู่ฝั่งหน้าเว็บ public/app.js) · R = หายาก
const IDS = [];
for (let i = 1; i <= 21; i++) IDS.push(String(i));
IDS.push("R1", "R2");
const MAX_PER_CARD = 8;

const defaults = () => Object.fromEntries(IDS.map((id) => [id, id.startsWith("R") ? 1 : 2]));
const sig = (counts) => IDS.map((id) => counts[id] || 0).join(",");
const fresh = () => ({ counts: defaults(), built: "", deck: [], drawn: [], cur: null, by: "", dir: 1, seq: 0, started: false });
const cleanName = (s) => String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 16);

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
      this.s = (await ctx.storage.get("s")) || fresh();
    });
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("expected websocket", { status: 426 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ name: "" });
    this.send(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  players() {
    return this.ctx
      .getWebSockets()
      .filter((w) => w.readyState === 1)
      .map((w) => (w.deserializeAttachment() || {}).name || "");
  }

  send(ws) {
    ws.send(JSON.stringify({ type: "state", s: this.s, players: this.players() }));
  }

  broadcast() {
    const msg = JSON.stringify({ type: "state", s: this.s, players: this.players() });
    for (const w of this.ctx.getWebSockets()) {
      try { w.send(msg); } catch (e) { /* socket closing */ }
    }
  }

  save() {
    this.ctx.storage.put("s", this.s);
    this.broadcast();
  }

  webSocketMessage(ws, raw) {
    if (typeof raw !== "string" || raw.length > 2000) return;
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }
    const name = cleanName(m.name);
    ws.serializeAttachment({ name });
    const s = this.s;

    if (m.type === "hello") {
      this.broadcast();
    } else if (m.type === "count" && IDS.includes(m.id)) {
      const d = m.delta === -1 ? -1 : 1;
      s.counts[m.id] = Math.max(0, Math.min(MAX_PER_CARD, (s.counts[m.id] || 0) + d));
      this.save();
    } else if (m.type === "all") {
      if (m.v === "def") s.counts = defaults();
      else {
        const v = [1, 2, 3].includes(m.v) ? m.v : 2;
        s.counts = Object.fromEntries(IDS.map((id) => [id, id.startsWith("R") ? Math.min(1, v) : v]));
      }
      this.save();
    } else if (m.type === "shuffle") {
      const deck = shuffled(s.counts);
      if (!deck.length) return;
      Object.assign(s, { deck, built: sig(s.counts), drawn: [], cur: null, by: "", dir: 1, started: true, seq: s.seq + 1 });
      this.save();
    } else if (m.type === "draw") {
      const now = Date.now();
      if (!s.started || !s.deck.length || now - this.lastDraw < 400) return;
      this.lastDraw = now;
      const id = s.deck.shift();
      s.drawn.push({ c: id, by: name });
      if (s.drawn.length > 40) s.drawn = s.drawn.slice(-40);
      s.cur = id;
      s.by = name;
      s.seq += 1;
      if (id === "20") s.dir = s.dir === -1 ? 1 : -1;
      this.save();
    }
  }

  webSocketClose(ws) {
    try { ws.close(); } catch (e) { /* already closed */ }
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
