(function () {
  var COLORS = { red: '#B3261E', purple: '#6B46C1', green: '#2F7D32', blue: '#2B6CB0', black: '#1F1F1F', gold: '#F2C14E' };
  // f: friend = ดื่ม (เพื่อเพื่อน ได้เสมอ) · keep = เก็บไว้หน้าตัก · none = ไม่มีใครดื่ม
  var CARDS = [
    { id: '1', t: 'ดื่ม', l: 'คนเปิดดื่ม', k: 'red', f: 'friend' },
    { id: '2', t: 'ชี้', l: 'ชี้ใครก็ได้ 1 คน ดื่ม', k: 'red', f: 'friend' },
    { id: '3', t: 'ซ้าย', l: 'คนซ้ายมือดื่ม', k: 'red', f: 'friend' },
    { id: '4', t: 'ขวา', l: 'คนขวามือดื่ม', k: 'red', f: 'friend' },
    { id: '5', t: 'หมดวง', l: 'ทุกคนดื่ม', k: 'red', f: 'friend' },
    { id: '6', t: 'ลากเพื่อน', l: 'เลือก 2 คน ดื่มพร้อมคุณ', k: 'purple', f: 'friend' },
    { id: '7', t: 'บัดดี้', l: 'เลือก 1 คน คุณดื่มเมื่อไหร่ เขาดื่มด้วย จนมีบัดดี้ใบใหม่', k: 'purple', f: 'friend' },
    { id: '8', t: 'รอด', l: 'เก็บไว้ ยกเลิกการดื่มของตัวเอง 1 ครั้ง', k: 'green', f: 'keep' },
    { id: '9', t: 'หมวดหมู่', l: 'ตั้งหมวด วนพูดทีละคน คิดไม่ออกดื่ม', k: 'blue', f: 'friend' },
    { id: '10', t: 'แตะจมูก', l: 'เก็บไว้ แตะจมูกตอนไหนก็ได้ คนแตะตามช้าสุดดื่ม', k: 'blue', f: 'friend' },
    { id: '11', t: 'ห้ามคุย', l: 'ถึงตาคุณรอบหน้า ใครคุยกับคุณ ดื่ม', k: 'black', f: 'friend' },
    { id: '12', t: 'ตั้งกฎ', l: 'ตั้งกฎ 1 ข้อ ใช้จนจบเกม', k: 'black', f: 'friend' },
    { id: '13', t: 'ห้ามมีฟัน', l: 'ถึงรอบหน้า พูดโดยห้ามเห็นฟัน เห็นเมื่อไหร่ ดื่ม', k: 'black', f: 'friend' },
    { id: '14', t: 'สโลว์โมชั่น', l: 'ทำทุกอย่างช้าๆ จนถึงรอบถัดไป เผลอทำปกติ ดื่ม', k: 'black', f: 'friend' },
    { id: '15', t: 'รับบท', l: 'ถึงรอบหน้า ต้องพูดลงท้าย “เจ้าค่ะ/ขอรับ” หรืออังกฤษล้วน หรือทำท่าสัตว์ตอนพูด (เลือก 1) พลาด ดื่ม', k: 'black', f: 'friend' },
    { id: '16', t: 'กระซิบกระซาบ', l: 'ถึงรอบหน้า ห้ามพูดเสียงปกติ ต้องกระซิบใส่หูเพื่อนข้างๆ เท่านั้น เสียงดัง ดื่ม', k: 'black', f: 'friend' },
    { id: '17', t: 'ห้ามยกมือขวา', l: 'คนจั่ว (หรือทั้งวง) ใช้มือซ้ายทำทุกอย่าง ห้ามมือขวาแตะแก้วหรือโต๊ะ ฝ่าฝืน ดื่ม', k: 'black', f: 'friend' },
    { id: '18', t: 'คำลงท้าย', l: 'ตั้งคำลงท้าย เช่น “…นะจ๊ะ” “…จ๊อด” ต่อท้ายทุกประโยค ใครลืมพูด ดื่ม', k: 'black', f: 'friend' },
    { id: '19', t: 'ส่งต่อบทลงโทษ', l: 'เก็บไว้ ใช้ได้ 1 ครั้ง ตอนโดนสั่งดื่ม ส่งให้เพื่อนข้างๆ ดื่มแทน', k: 'green', f: 'keep' },
    { id: '20', t: 'ย้อนทิศ', l: 'กลับทิศการวนทันที จนกว่าจะมีใบย้อนทิศใบใหม่', k: 'black', f: 'none' },
    { id: '21', t: 'ข้ามตา', l: 'เลือก 1 คน ข้ามตาถัดไป ไม่ต้องเปิดการ์ด แต่ต้องดื่ม', k: 'purple', f: 'friend' },
    { id: 'R1', t: 'ผู้คุมเกม', l: 'เก็บไว้ ใช้ได้ 1 ครั้ง สั่งยกเลิกการ์ดที่เพิ่งเปิดใบไหนก็ได้', k: 'gold', f: 'keep', rare: true },
    { id: 'R2', t: 'ล้างกระดาน', l: 'ยกเลิกทุกกฎที่ใช้อยู่ ทั้งตั้งกฎ คำลงท้าย และข้อห้ามทุกอย่าง เริ่มใหม่ทันที', k: 'gold', f: 'none', rare: true }
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

  function cardHTML(c, pop) {
    var long = c.t.length > 8 ? ' long' : '';
    var foot = c.f === 'keep' ? 'เก็บไว้หน้าตัก · ใช้แล้วทิ้ง' : c.f === 'none' ? 'ไม่มีใครดื่ม' : '<span class="pip"></span>เพื่อเพื่อน ได้เสมอ';
    var top = c.rare
      ? '<div class="top"><div class="num" aria-hidden="true">★</div><span class="tag">หายาก</span></div>'
      : '<div class="num">' + esc(c.id) + '</div>';
    return '<div class="pcard' + (c.rare ? ' gold' : '') + (pop ? ' pop' : '') + '" style="' + (c.rare ? '' : 'background:' + COLORS[c.k]) + '">' +
      top + '<div class="mid"><div class="title' + long + '">' + esc(c.t) + '</div><div class="line">' + esc(c.l) + '</div></div>' +
      '<div class="foot">' + foot + '</div></div>';
  }
  var BACK = '<div class="pcard back"><svg viewBox="0 0 100 100" style="width:48cqw;height:48cqw" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#8DB63C"/><circle cx="50" cy="50" r="42" fill="#F3F8D6"/><circle cx="50" cy="50" r="38" fill="#B9DA5A"/><g stroke="#F3F8D6" stroke-width="3"><line x1="50" y1="50" x2="88" y2="50"/><line x1="50" y1="50" x2="76.9" y2="76.9"/><line x1="50" y1="50" x2="50" y2="88"/><line x1="50" y1="50" x2="23.1" y2="76.9"/><line x1="50" y1="50" x2="12" y2="50"/><line x1="50" y1="50" x2="23.1" y2="23.1"/><line x1="50" y1="50" x2="50" y2="12"/><line x1="50" y1="50" x2="76.9" y2="23.1"/></g><circle cx="50" cy="50" r="5" fill="#F3F8D6"/></svg><div class="big">เป้กไหม?</div><div class="sub">เหล้า หรือ มะนาว เลือกเอา</div></div>';

  var ws = null, room = '', state = null, players = [], lastSeq = -1, retry = 0, closing = false;

  function setNet(text, on) { $('nettxt').textContent = text; $('netdot').className = 'dot' + (on ? ' on' : ''); }
  function send(msg) {
    if (!ws || ws.readyState !== 1) { setNet('ยังไม่เชื่อมต่อ ลองใหม่อีกครั้ง', false); return; }
    msg.name = who(); ws.send(JSON.stringify(msg));
  }

  function render() {
    var s = state;
    var started = !!(s && s.started);
    var left = s ? s.deck.length : 0;
    var counts = s ? s.counts : defaults();

    $('face').innerHTML = s && s.cur ? cardHTML(BYID[s.cur], s.seq !== lastSeq) : BACK;
    lastSeq = s ? s.seq : -1;
    $('who-line').textContent = s && s.cur && s.by ? 'เปิดโดย ' + s.by : '';

    var d = $('draw');
    d.disabled = !s;
    d.textContent = !started ? 'เริ่มเกม สับสำรับ' : left === 0 ? 'หมดกอง · สับใหม่' : 'จั่ว';

    var st = $('status'); st.innerHTML = '';
    var chips = [];
    if (started) chips.push('เหลือ ' + left + ' ใบ', s.dir === -1 ? 'ทวนเข็มนาฬิกา' : 'ตามเข็มนาฬิกา');
    if (players.length) {
      var named = players.filter(Boolean);
      chips.push('ในห้อง ' + players.length + ' คน' + (named.length ? ' · ' + named.join(', ') : ''));
    }
    chips.forEach(function (t) { var c = document.createElement('span'); c.className = 'chip'; c.textContent = t; st.appendChild(c); });

    var h = $('hist'); h.innerHTML = '';
    var drawn = s ? s.drawn.slice().reverse().slice(0, 8) : [];
    $('hist-empty').hidden = drawn.length > 0;
    drawn.forEach(function (e) {
      var c = BYID[e.c]; if (!c) return;
      var li = document.createElement('li');
      var sw = document.createElement('span'); sw.className = 'sw'; sw.style.background = c.rare ? COLORS.gold : COLORS[c.k];
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = (c.rare ? '★ ' : c.id + ' ') + c.t;
      var by = document.createElement('span'); by.className = 'by'; by.textContent = e.by || '';
      li.appendChild(sw); li.appendChild(nm); li.appendChild(by); h.appendChild(li);
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
    room = code; state = null; players = []; lastSeq = -1; retry = 0;
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
      if (m.type === 'state' && mine === room) { state = m.s; players = m.players || []; render(); }
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
  $('rows').addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-step]'); if (!b) return;
    var p = b.getAttribute('data-step').split(':'); send({ type: 'count', id: p[0], delta: +p[1] });
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
