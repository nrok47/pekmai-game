(function () {
  var COLORS = { red: '#B3261E', purple: '#6B46C1', green: '#2F7D32', blue: '#2B6CB0', black: '#1F1F1F', gold: '#F2C14E' };
  var CAT = { red: '#B3261E', purple: '#6B46C1', green: '#2F7D32', blue: '#2B6CB0', black: '#1F1F1F', gold: '#8A6410' };
  var D = 'เพื่อเพื่อน ได้เสมอ', K = 'เก็บไว้หน้าตัก · ใช้แล้วทิ้ง', N = 'ไม่มีใครดื่ม';
  var WIDE = { '14': 1, '15': 1, '16': 1, '17': 1, '18': 1, '19': 1 };
  var LINE_TOP = { '20': 111.3 }; // ใบ 20: ช่องข้อความถูกเลื่อนลง (หน่วย cqw จากขอบบน)
  var CARDS = [
    { id: '1', t: 'ดื่ม', l: 'คนเปิดดื่ม', k: 'red', f: D },
    { id: '2', t: 'ชี้', l: 'ชี้ใครก็ได้ 1 คน ดื่ม', k: 'red', f: D },
    { id: '3', t: 'ซ้าย', l: 'คนซ้ายมือดื่ม', k: 'red', f: D },
    { id: '4', t: 'ขวา', l: 'คนขวามือดื่ม', k: 'red', f: D },
    { id: '5', t: 'หมดวง', l: 'ทุกคนดื่ม', k: 'red', f: D },
    { id: '6', t: 'ลากเพื่อน', l: 'เลือก 2 คน ดื่มพร้อมคุณ', k: 'purple', f: D },
    { id: '7', t: 'บัดดี้', l: 'เลือก 1 คน คุณดื่มเมื่อไหร่ เขาดื่มด้วย จนมีบัดดี้ใบใหม่', k: 'purple', f: D },
    { id: '8', t: 'รอด', l: 'เก็บไว้ ยกเลิกการดื่มของตัวเอง 1 ครั้ง', k: 'green', f: K },
    { id: '9', t: 'หมวดหมู่', l: 'ตั้งหมวด วนพูดทีละคน คิดไม่ออกดื่ม', k: 'blue', f: D },
    { id: '10', t: 'แตะจมูก', l: 'เก็บไว้ แตะจมูกตอนไหนก็ได้ คนแตะตามช้าสุดดื่ม', k: 'blue', f: D },
    { id: '11', t: 'ห้ามคุย', l: 'ถึงตาคุณรอบหน้า ใครคุยกับคุณ ดื่ม', k: 'black', f: D },
    { id: '12', t: 'ตั้งกฎ', l: 'ตั้งกฎ 1 ข้อ ใช้จนจบเกม', k: 'black', f: D },
    { id: '13', t: 'ห้ามมีฟัน', l: 'ถึงรอบหน้า พูดโดยห้ามเห็นฟัน เห็นเมื่อไหร่ ดื่ม', k: 'black', f: D },
    { id: '14', t: 'สโลว์โมชั่น', l: 'ทำทุกอย่างช้าๆ จนถึงรอบถัดไป เผลอทำปกติ ดื่ม', k: 'black', f: D },
    { id: '15', t: 'รับบท', l: 'ถึงรอบหน้า ต้องพูดลงท้าย “เจ้าค่ะ/ขอรับ” หรืออังกฤษล้วน หรือทำท่าสัตว์ตอนพูด (เลือก 1) พลาด ดื่ม', k: 'black', f: D },
    { id: '16', t: 'กระซิบกระซาบ', l: 'ถึงรอบหน้า ห้ามพูดเสียงปกติ ต้องกระซิบใส่หูเพื่อนข้างๆ เท่านั้น เสียงดัง ดื่ม', k: 'black', f: D },
    { id: '17', t: 'ห้ามยกมือขวา', l: 'คนจั่ว (หรือทั้งวง) ใช้มือซ้ายทำทุกอย่าง ห้ามมือขวาแตะแก้วหรือโต๊ะ ฝ่าฝืน ดื่ม', k: 'black', f: D },
    { id: '18', t: 'คำลงท้าย', l: 'ตั้งคำลงท้าย เช่น “…นะจ๊ะ” “…จ๊อด” ต่อท้ายทุกประโยค ใครลืมพูด ดื่ม', k: 'black', f: D },
    { id: '19', t: 'ส่งต่อบทลงโทษ', l: 'เก็บไว้ ใช้ได้ 1 ครั้ง ตอนโดนสั่งดื่ม ส่งให้เพื่อนข้างๆ ดื่มแทน', k: 'green', f: K },
    { id: '20', t: 'ย้อนทิศ', l: 'กลับทิศการวนทันที จนกว่าจะมีใบย้อนทิศใบใหม่', k: 'black', f: N },
    { id: '21', t: 'ข้ามตา', l: 'เลือก 1 คน ข้ามตาถัดไป ไม่ต้องเปิดการ์ด แต่ต้องดื่ม', k: 'purple', f: D },
    { id: '22', t: 'ห้ามหัวเราะ', l: 'ถึงรอบหน้า ใครหัวเราะ ดื่ม', k: 'black', f: D },
    { id: '23', t: 'เสียงอีสาน', l: 'พูดสำเนียงอีสานจนถึงรอบหน้า หลุดดื่ม', k: 'black', f: D },
    { id: '24', t: 'ห้ามชี้', l: 'ถึงรอบหน้า ห้ามใช้นิ้วชี้ ชี้เมื่อไหร่ ดื่ม', k: 'black', f: D },
    { id: '25', t: 'เสียงสัตว์', l: 'วนทำเสียงสัตว์ ห้ามซ้ำ ซ้ำหรือคิดไม่ออกดื่ม', k: 'blue', f: D },
    { id: 'R1', t: 'ผู้คุมเกม', l: 'เก็บไว้ ใช้ได้ 1 ครั้ง สั่งยกเลิกการ์ดที่เพิ่งเปิดใบไหนก็ได้', k: 'gold', f: K, rare: true },
    { id: 'R2', t: 'ล้างกระดาน', l: 'ยกเลิกทุกกฎที่ใช้อยู่ ทั้งตั้งกฎ คำลงท้าย และข้อห้ามทุกอย่าง เริ่มใหม่ทันที', k: 'gold', f: N, rare: true }
  ];
  var BYID = {}; CARDS.forEach(function (c) { BYID[c.id] = c; });

  function defaults() { var o = {}; CARDS.forEach(function (c) { o[c.id] = c.rare ? 1 : 2; }); return o; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function $(id) { return document.getElementById(id); }
  function sig(counts) { return CARDS.map(function (c) { return counts[c.id] || 0; }).join(','); }
  function total(counts) { return CARDS.reduce(function (n, c) { return n + (counts[c.id] || 0); }, 0); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function cleanRoom(v) { return (v || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 12).toUpperCase(); }
  function who() { return ($('who').value || '').trim().slice(0, 16); }
  var AVATARS = ['#B3261E', '#2B6CB0', '#6B46C1', '#2F7D32', '#B26A00', '#00796B', '#AD1457', '#455A64'];
  function avatarColor(id) { var h = 0; for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return AVATARS[h % AVATARS.length]; }
  function vis(s) { return s.replace(/[ัิ-ฺ็-๎]/g, '').length; }

  // รหัสประจำเครื่อง ใช้แยกคนที่ชื่อซ้ำกัน และจำที่นั่งตอนต่อใหม่
  var MYID = store('pekmai.id');
  if (!MYID) { MYID = Math.random().toString(36).slice(2, 12) + Date.now().toString(36).slice(-4); store('pekmai.id', MYID); }
  MYID = MYID.replace(/[^A-Za-z0-9]/g, '').slice(0, 16);

  function cardHTML(c, pop) {
    var px = Math.min(38, 203 / (Math.max(vis(c.t), 1) * 0.82));
    var ls = c.l.length > 60 ? 13.5 : c.l.length > 40 ? 15 : 17;
    var pip = c.f === D ? '<span class="pip"></span>' : '';
    var lineStyle = 'font-size:' + (ls / 315 * 100).toFixed(2) + 'cqw' + (LINE_TOP[c.id] ? ';top:' + LINE_TOP[c.id] + 'cqw;bottom:auto' : '');
    return '<div class="pcard' + (c.rare ? ' gold' : '') + (WIDE[c.id] ? ' wide' : '') + (pop ? ' pop' : '') + '" style="--c:' + CAT[c.k] + '">' +
      '<img src="/cards/' + esc(c.id) + '.jpg" alt=""><div class="p-top"></div><div class="p-bot"></div>' +
      '<div class="p-stamp">' + (c.rare ? '★' : esc(c.id)) + '</div>' +
      '<div class="p-title" style="font-size:' + (px / 315 * 100).toFixed(2) + 'cqw">' + esc(c.t) + '</div>' +
      '<div class="p-line" style="' + lineStyle + '">' + esc(c.l) + '</div>' +
      '<div class="p-foot">' + pip + esc(c.f) + '</div></div>';
  }
  var BACK = '<div class="pcard"><img src="/cards/back.jpg" alt="หลังการ์ดเป้กไหม"></div>';


  // ---------- สรุปผลแต่ละใบ ----------
  function aggLines(lines) {
    var agg = {}, order = [];
    (lines || []).forEach(function (l) {
      if (!agg[l.id]) { agg[l.id] = { name: l.name, n: 0 }; order.push(l.id); }
      agg[l.id].n += l.n;
    });
    return order.map(function (k) { return agg[k]; }).filter(function (x) { return x.n !== 0; });
  }
  function aggLines2(lines) {
    var agg = {};
    (lines || []).forEach(function (l) { agg[l.id] = agg[l.id] || { id: l.id, n: 0 }; agg[l.id].n += l.n; });
    return Object.keys(agg).map(function (k) { return agg[k]; }).filter(function (x) { return x.n !== 0; });
  }
  function fmtLines(lines) {
    return aggLines(lines).map(function (x) { return x.name + ' ' + (x.n > 0 ? '+' : '') + x.n + ' เป้ก'; }).join(', ');
  }
  function seatName(id) { var p = state && state.seats.filter(function (q) { return q.id === id; })[0]; return p ? p.name : '?'; }
  var STATUS_IDS = { '11': 1, '13': 1, '14': 1, '15': 1, '16': 1, '17': 1, '22': 1, '23': 1, '24': 1 };
  function evSummary(ev, s) {
    var c = BYID[ev.c], t = c ? c.t : '';
    var f = fmtLines(ev.lines);
    if (ev.kind === 'manual') return 'แก้ตัวเลข: ' + f + ' (โดย ' + ev.by + ')';
    if (ev.kind === 'use') {
      if (ev.c === '8') return ev.by + ' ใช้ รอด → ' + (f || 'ไม่มีเป้กให้ลด');
      if (ev.c === '19') return ev.by + ' ส่งต่อบทลงโทษ → ' + (f || '-');
      if (ev.c === 'R1') return ev.by + ' ใช้ ผู้คุมเกม ยกเลิกใบ ' + (BYID[ev.targetCard] ? BYID[ev.targetCard].t : 'ล่าสุด') + (f ? ' (คืนเป้ก ' + f + ')' : '');
      return ev.by + ' ใช้ ' + t;
    }
    var txt;
    var pd = s && s.pending && s.pending.evId === ev.id ? s.pending : null;
    if (ev.c === '20') txt = 'กลับทิศการวนตา';
    else if (ev.c === 'R2') txt = 'ล้างกฎและสถานะทั้งหมด';
    else if (ev.c === '12') txt = ev.by + ' ตั้งกฎใหม่ (ใช้จนจบเกม)';
    else if (ev.c === '18') txt = ev.by + ' ตั้งคำลงท้าย (ใช้จนจบเกม)';
    else if (STATUS_IDS[ev.c]) txt = ev.by + ' ติด “' + t + '” ถึงรอบหน้า';
    else if (ev.c === '8' || ev.c === '10' || ev.c === '19' || ev.c === 'R1') txt = ev.by + ' เก็บ “' + t + '” ไว้ใช้';
    else if (ev.c === '9' || ev.c === '25') txt = 'ใครตอบไม่ได้/ผิด ดื่ม — กด + เป้ก ที่ชื่อคนนั้น';
    else if (ev.c === '7') txt = pd ? 'รอ ' + ev.by + ' เลือกบัดดี้' : ev.by + ' มีบัดดี้ ' + (ev.picks && ev.picks[0] ? ev.picks[0] : '-') + ' (ดื่มเมื่อไหร่ บัดดี้ดื่มด้วย)';
    else if (f) txt = 'ใครดื่ม: ' + f;
    else txt = '';
    if (ev.c === '21' && ev.picks && ev.picks[0]) txt = (f ? 'ใครดื่ม: ' + f : ev.picks[0]) + ' · ' + ev.picks[0] + ' ข้ามตาถัดไป';
    if ((ev.c === '2' || ev.c === '6' || ev.c === '21') && pd) txt = (f ? 'ใครดื่ม: ' + f + ' · ' : '') + 'รอ ' + ev.by + ' เลือกอีก ' + (pd.need - pd.picks.length) + ' คน';
    if (ev.cancelled) txt += ' (ถูกยกเลิกโดยผู้คุมเกม)';
    return txt;
  }
  var passMode = false;

  var ws = null, room = '', state = null, online = [], lastSeq = -1, retry = 0, closing = false;

  function setNet(text, on) { $('nettxt').textContent = text; $('netdot').className = 'dot' + (on ? ' on' : ''); }
  function send(msg) {
    if (!ws || ws.readyState !== 1) { setNet('ยังไม่เชื่อมต่อ ลองใหม่อีกครั้ง', false); return; }
    msg.id = MYID; msg.name = who(); ws.send(JSON.stringify(msg));
  }
  function seatOf(id) { return state && state.seats.filter(function (p) { return p.id === id; })[0]; }

  function render() {
    var s = state;
    var started = !!(s && s.started);
    var left = s ? s.deck.length : 0;
    var counts = s ? s.counts : defaults();
    var isOn = function (id) { return online.indexOf(id) >= 0; };
    var turnSeat = s ? seatOf(s.turnId) : null;
    var myTurn = !!(s && s.turnId === MYID);

    var pile = $('pile');
    pile.className = 'pile' + (started && left > 0 ? '' : ' empty');
    $('pilecnt').textContent = started && left > 0 ? left + ' ใบ' : '';
    $('face').innerHTML = s && s.cur ? cardHTML(BYID[s.cur], s.seq !== lastSeq) : BACK;
    lastSeq = s ? s.seq : -1;
    $('who-line').textContent = s && s.cur && s.by ? 'เปิดโดย ' + s.by : '';

    // ตาจั่ว
    var t = $('turn');
    t.className = 'turn' + (started && myTurn ? ' mine' : '');
    if (!started) t.textContent = 'ยังไม่เริ่มเกม กด "เริ่มเกม สับสำรับ"';
    else if (left === 0) t.textContent = 'หมดกองแล้ว สับใหม่ได้เลย';
    else if (myTurn) t.textContent = 'ถึงตาคุณจั่ว!';
    else if (turnSeat) t.textContent = 'ถึงตา ' + turnSeat.name + (isOn(turnSeat.id) ? '' : ' (ไม่อยู่)');
    else t.textContent = '—';

    var d = $('draw');
    d.disabled = !s;
    if (!started) d.textContent = 'เริ่มเกม สับสำรับ';
    else if (left === 0) d.textContent = 'หมดกอง · สับใหม่';
    else if (myTurn) d.textContent = 'จั่ว';
    else { d.textContent = turnSeat ? 'รอ ' + turnSeat.name + ' จั่ว' : 'รอจั่ว'; d.disabled = true; }

    var st = $('status'); st.innerHTML = '';
    var chips = [];
    if (started) chips.push('เหลือ ' + left + ' ใบ', s.dir === -1 ? 'ทวนเข็มนาฬิกา' : 'ตามเข็มนาฬิกา');
    chips.forEach(function (x) { var c = document.createElement('span'); c.className = 'chip'; c.textContent = x; st.appendChild(c); });

    // คนในห้อง
    var seatsEl = $('seats'); seatsEl.innerHTML = '';
    var seats = s ? s.seats : [];
    $('seatcount').textContent = online.length + '/' + seats.length + ' ออนไลน์';
    $('dir').textContent = started ? (s.dir === -1 ? 'ลำดับตา: ย้อนขึ้นไปด้านบน ↑' : 'ลำดับตา: ลงไปด้านล่าง ↓') : '';
    var pendMine = !!(s && s.pending && s.pending.by === MYID);
    var latest = s && s.events && s.events.length ? s.events[s.events.length - 1] : null;
    var hitMap = {};
    (latest ? aggLines2(latest.lines) : []).forEach(function (x) { hitMap[x.id] = x.n; });
    seats.forEach(function (p) {
      var st = (s && s.stat && s.stat[p.id]) || { drinks: 0, lemon: 0, status: [], hold: [] };
      var on = isOn(p.id);
      var isNow = !!(s && s.turnId === p.id && started);
      var mine = p.id === MYID;
      var el = document.createElement('div');
      el.className = 'seat' + (isNow ? ' now' : '') + (on ? '' : ' off') + (mine ? ' me' : '');
      var top = document.createElement('div'); top.className = 'srow';
      var av = document.createElement('span'); av.className = 'avatar'; av.style.background = avatarColor(p.id);
      av.appendChild(document.createTextNode((Array.from(p.name)[0] || '?').toUpperCase()));
      var dot = document.createElement('span'); dot.className = 'dot' + (on ? ' on' : ''); av.appendChild(dot);
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = p.name; nm.title = p.name;
      top.appendChild(av); top.appendChild(nm);
      if (isNow) { var tg = document.createElement('span'); tg.className = 'tag'; tg.textContent = 'ตานี้'; top.appendChild(tg); }
      if ((pendMine && !mine && on && s.pending.picks.indexOf(p.id) < 0) || (passMode && !mine && on)) {
        var pk = document.createElement('button'); pk.type = 'button'; pk.className = 'pick'; pk.textContent = 'เลือก';
        pk.setAttribute('data-pick', p.id); pk.setAttribute('aria-label', 'เลือก ' + p.name); top.appendChild(pk);
      }
      if (!on && !mine) {
        var x = document.createElement('button'); x.type = 'button'; x.className = 'x'; x.textContent = '×';
        x.setAttribute('aria-label', 'เอา ' + p.name + ' ออกจากห้อง'); x.setAttribute('data-remove', p.id); top.appendChild(x);
      }
      el.appendChild(top);
      var cnts = document.createElement('div'); cnts.className = 'cnts';
      var cb = document.createElement('span'); cb.className = 'cnt';
      var lab = document.createElement('span'); lab.className = 'lab'; lab.textContent = 'เป้ก';
      var num = document.createElement('b'); num.textContent = st.drinks || 0;
      var minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−';
      minus.setAttribute('data-drink', p.id + ':drink:-1'); minus.setAttribute('aria-label', 'ลดเป้ก ' + p.name);
      var plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+';
      plus.setAttribute('data-drink', p.id + ':drink:1'); plus.setAttribute('aria-label', 'เพิ่มเป้ก ' + p.name);
      cb.appendChild(lab); cb.appendChild(minus); cb.appendChild(num); cb.appendChild(plus); cnts.appendChild(cb);
      var hitN = hitMap[p.id];
      if (hitN) { var hit = document.createElement('span'); hit.className = 'hit' + (hitN < 0 ? ' neg' : ''); hit.textContent = (hitN > 0 ? '+' : '') + hitN + ' เป้ก'; cnts.appendChild(hit); }
      el.appendChild(cnts);
      var chips = document.createElement('div'); chips.className = 'chips';
      (st.status || []).forEach(function (cid) {
        var c = BYID[cid]; if (!c) return;
        var ch = document.createElement('span'); ch.className = 'sch'; ch.textContent = c.t; ch.title = c.l; chips.appendChild(ch);
      });
      (st.hold || []).forEach(function (cid) {
        var c = BYID[cid]; if (!c) return;
        var ch = document.createElement(mine ? 'button' : 'span'); ch.className = 'sch hold'; ch.title = c.l;
        ch.textContent = (mine ? 'ใช้ ' : 'ถือ ') + c.t;
        if (mine) { ch.type = 'button'; ch.setAttribute('data-use', cid); ch.setAttribute('aria-label', 'ใช้ ' + c.t + ' แล้วทิ้ง'); }
        chips.appendChild(ch);
      });
      if (chips.children.length) el.appendChild(chips);
      seatsEl.appendChild(el);
    });
    var rb = $('rulesbar'), rules = (s && s.rules) || [];
    rb.hidden = rules.length === 0;
    rb.textContent = rules.length ? 'กฎที่ใช้อยู่: ' + rules.map(function (cid) { return BYID[cid] ? BYID[cid].t : cid; }).join(' · ') : '';
    var sk = $('skip');
    var canSkip = !!(started && left > 0 && s.turnId && (myTurn || !isOn(s.turnId)));
    sk.hidden = !canSkip;
    sk.textContent = myTurn ? 'ข้ามตาฉัน' : 'ข้าม ' + (turnSeat ? turnSeat.name : '') + ' (ไม่อยู่)';

    var h = $('hist'); h.innerHTML = '';
    var evs = s && s.events ? s.events.slice().reverse().slice(0, 12) : [];
    $('hist-empty').hidden = evs.length > 0;
    evs.forEach(function (e) {
      var c = BYID[e.c];
      var li = document.createElement('li');
      var sw = document.createElement('span'); sw.className = 'sw'; sw.style.background = e.kind === 'manual' ? '#888' : (c ? (c.rare ? COLORS.gold : COLORS[c.k]) : '#888');
      var nm = document.createElement('span'); nm.className = 'nm';
      nm.textContent = e.kind === 'manual' ? 'แก้เป้ก' : e.kind === 'use' ? 'ใช้ ' + (c ? c.t : '') : (c ? (c.rare ? '★ ' : c.id + ' ') + c.t : '');
      var by = document.createElement('span'); by.className = 'by';
      by.textContent = (e.kind === 'draw' ? e.by + ' · ' : '') + evSummary(e, s);
      li.appendChild(sw); li.appendChild(nm); li.appendChild(by); h.appendChild(li);
    });

    // ผลของใบล่าสุด (กรอบใต้ไพ่)
    var rEl = $('result');
    var lastDraw = s && s.events ? s.events.slice().reverse().filter(function (e) { return e.kind === 'draw'; })[0] : null;
    var msgs = [];
    if (lastDraw) msgs.push(evSummary(lastDraw, s));
    if (pendMine) msgs.push('เลือก ' + (s.pending.need - s.pending.picks.length) + ' คน: กดปุ่ม "เลือก" ที่ชื่อผู้เล่นฝั่งซ้าย');
    if (passMode) msgs.push('เลือกเพื่อนที่จะรับบทลงโทษแทน: กดปุ่ม "เลือก" ที่ชื่อผู้เล่น');
    rEl.hidden = msgs.length === 0 || !lastDraw;
    rEl.innerHTML = '';
    if (lastDraw) {
      var h3 = document.createElement('div'); h3.className = 'rt';
      h3.textContent = (BYID[lastDraw.c] ? BYID[lastDraw.c].t : '') + ' · ผลใบนี้';
      rEl.appendChild(h3);
      msgs.forEach(function (m, i) { var d = document.createElement('div'); d.className = i ? 'rn' : 'rb'; d.textContent = m; rEl.appendChild(d); });
    }

    // ใครโดนเยอะ
    var bd = $('board'); bd.innerHTML = '';
    var ranked = seats.map(function (p) { return { p: p, n: ((s && s.stat && s.stat[p.id]) || {}).drinks || 0 }; }).sort(function (a, b) { return b.n - a.n; });
    var maxN = ranked.length ? ranked[0].n : 0;
    $('board-empty').hidden = maxN > 0;
    if (maxN > 0) ranked.forEach(function (r, i) {
      var row = document.createElement('div'); row.className = 'brow';
      var nmEl = document.createElement('span'); nmEl.className = 'bn'; nmEl.textContent = r.p.name + (i === 0 && r.n > 0 && ranked.filter(function (q) { return q.n === maxN; }).length === 1 ? ' · โดนเยอะสุด' : '');
      var bar = document.createElement('span'); bar.className = 'bar';
      var fill = document.createElement('span'); fill.className = 'fill'; fill.style.width = (maxN ? Math.round(r.n / maxN * 100) : 0) + '%'; fill.style.background = avatarColor(r.p.id);
      bar.appendChild(fill);
      var cn = document.createElement('b'); cn.textContent = r.n;
      row.appendChild(nmEl); row.appendChild(bar); row.appendChild(cn); bd.appendChild(row);
    });

    var rows = $('rows');
    var keep = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('data-step');
    rows.innerHTML = '';
    CARDS.forEach(function (c) {
      var li = document.createElement('li');
      var sw = document.createElement('span'); sw.className = 'sw'; sw.style.background = c.rare ? COLORS.gold : COLORS[c.k];
      var n = document.createElement('span'); n.className = 'n'; n.textContent = c.rare ? '★' : c.id;
      var nm = document.createElement('span'); nm.className = 'name'; nm.textContent = c.t;
      var step = document.createElement('span'); step.className = 'step';
      var m = document.createElement('button'); m.type = 'button'; m.textContent = '−'; m.setAttribute('aria-label', 'ลดจำนวน ' + c.t); m.setAttribute('data-step', c.id + ':-1');
      var o = document.createElement('output'); o.textContent = counts[c.id] || 0;
      var p = document.createElement('button'); p.type = 'button'; p.textContent = '+'; p.setAttribute('aria-label', 'เพิ่มจำนวน ' + c.t); p.setAttribute('data-step', c.id + ':1');
      step.appendChild(m); step.appendChild(o); step.appendChild(p);
      li.appendChild(sw); li.appendChild(n); li.appendChild(nm); li.appendChild(step); rows.appendChild(li);
    });
    if (keep) { var again = rows.querySelector('[data-step="' + keep + '"]'); if (again) again.focus(); }
    $('total').textContent = 'รวม ' + total(counts) + ' ใบ';
    $('stale').hidden = !(started && s.built !== sig(counts));
    $('shuffle').disabled = !s || total(counts) === 0;
    $('shuffle').textContent = started ? 'สับสำรับใหม่' : 'เริ่มเกม สับสำรับ';
    if (!started && !$('cfg').open && !$('cfg').dataset.touched) $('cfg').open = true;
  }

  function connect(code) {
    room = code; state = null; online = []; lastSeq = -1; retry = 0;
    $('room').value = code;
    try { history.replaceState(null, '', '#' + code); } catch (e) {}
    open();
    render();
  }
  function open() {
    if (ws) { closing = true; try { ws.close(); } catch (e) {} }
    closing = false;
    setNet('กำลังเชื่อมต่อ…', false);
    var mine = room;
    var sock = new WebSocket((location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host + '/ws/' + mine);
    ws = sock;
    sock.onopen = function () { retry = 0; setNet('ออนไลน์ · ห้อง ' + mine, true); send({ type: 'hello' }); };
    sock.onmessage = function (e) {
      var m; try { m = JSON.parse(e.data); } catch (x) { return; }
      if (m.type === 'state' && mine === room) { state = m.s; online = m.online || []; render(); }
    };
    sock.onclose = function () {
      if (sock !== ws || closing) return;
      setNet('หลุดการเชื่อมต่อ กำลังต่อใหม่…', false);
      retry = Math.min(retry + 1, 6);
      setTimeout(function () { if (sock === ws) open(); }, 800 * retry);
    };
  }

  $('draw').addEventListener('click', function () {
    var s = state;
    if (!s) return;
    send({ type: !s.started || s.deck.length === 0 ? 'shuffle' : 'draw' });
  });
  $('shuffle').addEventListener('click', function () { send({ type: 'shuffle' }); });
  $('skip').addEventListener('click', function () { send({ type: 'skip' }); });
  $('seats').addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-remove')) { send({ type: 'remove', target: t.getAttribute('data-remove') }); return; }
    if (t.hasAttribute('data-drink')) {
      var q = t.getAttribute('data-drink').split(':');
      send({ type: 'drink', target: q[0], kind: q[1], delta: +q[2] }); return;
    }
    if (t.hasAttribute('data-pick')) {
      var tg = t.getAttribute('data-pick');
      if (passMode) { passMode = false; send({ type: 'use', card: '19', target: tg }); }
      else send({ type: 'pick', target: tg });
      render(); return;
    }
    if (t.hasAttribute('data-use')) {
      var uc = t.getAttribute('data-use');
      if (uc === '19') { passMode = !passMode; render(); return; }
      send({ type: 'use', card: uc });
    }
  });
  var rs = $('resetstats'), rsT = null;
  rs.addEventListener('click', function () {
    if (rs.dataset.arm) { send({ type: 'resetstats' }); rs.dataset.arm = ''; rs.textContent = 'ล้างตัวเลขดื่ม'; clearTimeout(rsT); return; }
    rs.dataset.arm = '1'; rs.textContent = 'กดอีกครั้งเพื่อล้าง';
    rsT = setTimeout(function () { rs.dataset.arm = ''; rs.textContent = 'ล้างตัวเลขดื่ม'; }, 3000);
  });
  $('rows').addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-step]'); if (!b) return;
    var p = b.getAttribute('data-step').split(':'); send({ type: 'count', card: p[0], delta: +p[1] });
  });
  document.querySelector('.quick').addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-all]'); if (!b) return;
    var v = b.getAttribute('data-all'); send({ type: 'all', v: v === 'def' ? 'def' : +v });
  });
  $('cfg').addEventListener('toggle', function () { $('cfg').dataset.touched = '1'; });
  $('who').addEventListener('input', function () { store('pekmai.name', $('who').value); });
  $('who').addEventListener('change', function () { send({ type: 'hello' }); });
  function join() { var c = cleanRoom($('room').value); if (c.length >= 2) { store('pekmai.room', c); connect(c); } }
  $('join').addEventListener('click', join);
  $('room').addEventListener('keydown', function (e) { if (e.key === 'Enter') join(); });

  var inv = document.createElement('button');
  inv.type = 'button'; inv.className = 'btn'; inv.textContent = 'คัดลอกลิงก์ห้อง'; inv.style.alignSelf = 'flex-end';
  inv.addEventListener('click', function () {
    var url = location.origin + location.pathname + '#' + room;
    var done = function () { inv.textContent = 'คัดลอกแล้ว'; setTimeout(function () { inv.textContent = 'คัดลอกลิงก์ห้อง'; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('ลิงก์ห้อง', url); });
    else window.prompt('ลิงก์ห้อง', url);
  });
  document.querySelector('.box .row').appendChild(inv);
  window.addEventListener('hashchange', function () { var c = cleanRoom((location.hash || '').slice(1)); if (c.length >= 2 && c !== room) connect(c); });

  function randomCode() { var a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', s = ''; for (var i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)]; return s; }
  $('who').value = store('pekmai.name') || '';
  var start = cleanRoom((location.hash || '').slice(1));
  if (start.length < 2) start = randomCode();
  render();
  connect(start);
})();
