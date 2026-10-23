/* =====================================================================
   34. HOLOGRAM CHO CHỦ SỞ HỮU (23/10, chủ dự án: "chỉ áp dụng hologram vào giao diện của tài khoản chủ sở hữu")
   - Chỉ chạy khi ME.laOwner. Mọi tài khoản khác: giao diện giữ nguyên.
   - Lớp áo cho toàn web (html.holo): nền vũ trụ + sao (canvas cố định phía sau), khung kính viền xanh phát sáng, vạch vàng.
   - Tổng quan: thêm khối "Đài quan sát KPI" ở đầu trang – chòm sao KPI theo xưởng (số liệu thật: trung bình KPI tháng
     của người đang làm trong xưởng, lấy từ kpi() = số Bảng KPI của máy chủ), hôm nay đã khai bao nhiêu, người dưới 80%.
     Bấm 1 ngôi sao -> mở Bảng KPI lọc đúng xưởng đó.
   - Nút cuối menu: Hologram · chuyển động -> Hologram · tĩnh -> Tắt (mặc định: bật, có chuyển động – chủ dự án chọn 23/10).
     Nhớ trong máy (localStorage kpi_holo). Máy bật "giảm chuyển động" thì nền sao luôn tĩnh.
   ===================================================================== */
var HOLO_KHOA = 'kpi_holo';
function holoCheDo() { var v = null; try { v = localStorage.getItem(HOLO_KHOA); } catch (e) {} return v === 'tinh' || v === 'tat' ? v : 'dong'; }
function holoBat() { return !!(typeof ME !== 'undefined' && ME && ME.laOwner) && holoCheDo() !== 'tat'; }
function holoDong() { return holoCheDo() === 'dong' && !(typeof GIAM_CD === 'function' && GIAM_CD()); }

var HOLO_CSS =
  'html.holo{--bg:#020617;--panel:rgba(6,18,43,.74);--panel2:rgba(10,30,64,.72);--line:rgba(125,211,252,.26);--ink:#e0f2fe;--ink2:#a9c7df;--ink3:#7ea6c8;' +
  '--cyan:#38bdf8;--cyan-d:#0284c7;--acc-rgb:56,189,248;--amber:#f5c86b;--red:#fb7185;--green:#5eead4;--on-acc:#03111f;' +
  '--nav-bg:rgba(2,8,23,.72);--head-bg:rgba(2,8,23,.78);--bot-bg:rgba(2,8,23,.9);--hover:rgba(56,189,248,.08);--row-line:rgba(125,211,252,.12);color-scheme:dark}' +
  'html.holo body{background:#020617 radial-gradient(ellipse at 50% 0%,#0b1f45 0%,#020617 65%) fixed}' +
  'html.holo #holoSao{position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none}' +
  'html.holo #app{position:relative;z-index:1}' +
  'html.holo .card{background:var(--panel)!important;border:1px solid rgba(125,211,252,.32)!important;box-shadow:0 0 18px rgba(56,189,248,.16),inset 0 0 22px rgba(56,189,248,.06)!important;backdrop-filter:blur(3px)!important;-webkit-backdrop-filter:blur(3px)!important}' +
  'html.holo header{background:var(--head-bg)!important;border-bottom:1px solid rgba(125,211,252,.35)!important;box-shadow:0 1px 18px rgba(56,189,248,.18);backdrop-filter:blur(6px)!important;-webkit-backdrop-filter:blur(6px)!important}' +
  'html.holo #nav{background:var(--nav-bg)!important;border-right:1px solid rgba(125,211,252,.25)!important;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}' +
  'html.holo #nav button.on{background:rgba(56,189,248,.14)!important;box-shadow:inset 3px 0 0 #f5c86b;color:#e0f2fe}' +
  'html.holo #botbar{background:var(--bot-bg)!important;border-top:1px solid rgba(125,211,252,.3)!important}' +
  'html.holo .ptitle{font-family:"Exo 2",var(--serif),sans-serif!important;letter-spacing:.04em;color:#bae6fd;text-shadow:0 0 14px rgba(56,189,248,.55)}' +
  'html.holo .card h3{color:#bae6fd}html.holo th{color:#f5c86b!important}' +
  'html.holo .btn.pri{box-shadow:0 0 14px rgba(56,189,248,.45)}' +
  'html.holo input,html.holo select,html.holo textarea{background:rgba(2,8,23,.6);border-color:rgba(125,211,252,.3)}' +
  /* khối Đài quan sát */
  '.hl-dai{position:relative;container-type:inline-size;border:1px solid rgba(125,211,252,.55);border-radius:18px;padding:14px;margin:6px 0 18px;color:#e0f2fe;' +
  'background:rgba(6,18,43,.62);box-shadow:0 0 24px rgba(56,189,248,.32),inset 0 0 30px rgba(56,189,248,.1);font-family:"Be Vietnam Pro",Inter,system-ui,sans-serif}' +
  '.hl-dai::before,.hl-dai::after{content:"";position:absolute;left:50%;width:96px;height:3px;margin-left:-48px;background:#f5c86b;border-radius:2px;box-shadow:0 0 12px #f5c86b}' +
  '.hl-dai::before{top:-2px}.hl-dai::after{bottom:-2px}' +
  '.hl-dau{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:0 4px 10px;border-bottom:1px solid rgba(125,211,252,.25);margin-bottom:12px}' +
  '.hl-dau h2{margin:0;font:600 17px "Exo 2",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7dd3fc;text-shadow:0 0 10px rgba(56,189,248,.7)}' +
  '.hl-dau span{font:500 12px var(--mono);color:#7ea6c8}' +
  '.hl-ba{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.5fr) minmax(0,.9fr);gap:12px;align-items:start}' +
  '@container (max-width:760px){.hl-ba{grid-template-columns:minmax(0,1fr)}.hl-ba .hl-giua{order:-1}}' +
  '.hl-o{border:1px solid rgba(125,211,252,.3);border-radius:10px;padding:10px 12px;background:rgba(2,6,23,.5);margin-bottom:10px}' +
  '.hl-o h3{margin:0 0 8px;font:600 11px "Exo 2",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#f5c86b}' +
  '.hl-dg{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 8px;font-size:13px;padding:4px 0;border-bottom:1px dashed rgba(125,211,252,.15);cursor:pointer;background:none;border-left:0;border-right:0;border-top:0;color:inherit;text-align:left;width:100%;font-family:inherit}' +
  '.hl-dg:last-child{border-bottom:0}.hl-dg:hover span{color:#fff}.hl-dg:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}' +
  '.hl-dg b{font:600 13px var(--mono);color:#7dd3fc;text-align:right}.hl-dg b.thap{color:#fb7185}.hl-dg b.cao{color:#f5c86b}' +
  '.hl-vach{grid-column:1/-1;height:3px;background:rgba(125,211,252,.12);border-radius:2px;overflow:hidden}' +
  '.hl-vach i{display:block;height:100%;background:linear-gradient(90deg,rgba(56,189,248,.3),#38bdf8);box-shadow:0 0 8px #38bdf8}.hl-vach i.thap{background:linear-gradient(90deg,rgba(251,113,133,.3),#fb7185)}' +
  '.hl-dai svg{display:block;width:100%;height:auto;overflow:visible}' +
  '.hl-dai svg .hl-sao{cursor:pointer}.hl-dai svg .hl-sao:focus{outline:none}.hl-dai svg .hl-sao:focus circle.vong,.hl-dai svg .hl-sao:hover circle.vong{stroke:#fff;stroke-width:1.5}' +
  '.hl-nho{font-size:12px;color:#7ea6c8}' +
  '.hl-bao{font-size:13px;display:grid;gap:4px}.hl-bao span{display:flex;justify-content:space-between;gap:8px}.hl-bao b{font:600 12.5px var(--mono);color:#fb7185}' +
  '.hl-chan{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:6px;padding:8px 4px 0;border-top:1px solid rgba(125,211,252,.25);font:500 11.5px var(--mono);color:#7ea6c8}.hl-chan b{color:#7dd3fc}' +
  '.hl-hang{display:flex;justify-content:center;gap:5px;margin-top:6px;flex-wrap:wrap}' +
  '.hl-hang span{font:600 12px "Exo 2",sans-serif;padding:2px 8px;border:1px solid rgba(125,211,252,.3);border-radius:20px;color:#7ea6c8}' +
  '.hl-hang span.bat{color:#06122b;background:#f5c86b;border-color:#f5c86b;box-shadow:0 0 12px #f5c86b}' +
  'html.holo #main .kpis.hl-an{display:none}' +
  '#nav button.holo-nav{margin-top:6px;border:1px solid var(--line)}#nav button.holo-nav small{display:block;font-size:12px;color:var(--ink3)}';

/* ---------- nền sao ---------- */
var HOLO_SAO = { raf: 0, sao: null, w: 0, h: 0 };
function holoVeSao(t) {
  var cv = document.getElementById('holoSao'); if (!cv) return;
  var w = innerWidth, h = innerHeight, d = Math.min(2, window.devicePixelRatio || 1);
  if (HOLO_SAO.w !== w || HOLO_SAO.h !== h || !HOLO_SAO.sao) {
    HOLO_SAO.w = w; HOLO_SAO.h = h; cv.width = w * d; cv.height = h * d;
    var s = 7919, r = function () { s = (s * 16807) % 2147483647; return s / 2147483647; }, ds = [];
    for (var i = 0; i < Math.min(420, Math.round(w * h / 2600)); i++) ds.push({ x: r(), y: r(), z: r() < .08 ? 1.5 + r() : .4 + r() * .9, p: r() * 6.28, v: .6 + r() * 1.6, m: r() < .15 ? '#f5c86b' : '#cfe8ff' });
    HOLO_SAO.sao = ds;
  }
  var g = cv.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, w, h);
  HOLO_SAO.sao.forEach(function (o) {
    var a = .45 + .55 * Math.abs(Math.sin(o.p + (t || 0) * o.v / 1000)), x = o.x * w, y = o.y * h;
    g.globalAlpha = a; g.fillStyle = o.m; g.beginPath(); g.arc(x, y, o.z, 0, 6.28); g.fill();
    if (o.z > 1.5) { g.globalAlpha = a * .25; g.beginPath(); g.arc(x, y, o.z * 3, 0, 6.28); g.fill(); }
  });
  [[[.06, .18], [.13, .12], [.19, .2], [.15, .3], [.09, .27]], [[.84, .1], [.9, .16], [.95, .12], [.92, .26], [.86, .22]]].forEach(function (c) {
    g.globalAlpha = .45; g.strokeStyle = '#7dd3fc'; g.lineWidth = .8; g.beginPath();
    c.forEach(function (p, i) { i ? g.lineTo(p[0] * w, p[1] * h) : g.moveTo(p[0] * w, p[1] * h); }); g.stroke();
    g.globalAlpha = .85; g.fillStyle = '#e0f2fe'; c.forEach(function (p) { g.beginPath(); g.arc(p[0] * w, p[1] * h, 1.7, 0, 6.28); g.fill(); });
  });
  [[.92 * w, .82 * h, Math.max(16, w * .025), '#7dd3fc', '#1e3a8a'], [.04 * w, .9 * h, Math.max(8, w * .012), '#fde68a', '#78350f']].forEach(function (p) {
    g.globalAlpha = .55; var gr = g.createRadialGradient(p[0] - p[2] * .4, p[1] - p[2] * .4, p[2] * .1, p[0], p[1], p[2]);
    gr.addColorStop(0, p[3]); gr.addColorStop(1, p[4]); g.fillStyle = gr; g.beginPath(); g.arc(p[0], p[1], p[2], 0, 6.28); g.fill();
  });
  g.globalAlpha = 1;
}
function holoChay() {
  cancelAnimationFrame(HOLO_SAO.raf); HOLO_SAO.raf = 0;
  if (!document.documentElement.classList.contains('holo')) return;
  holoVeSao(0);
  if (!holoDong()) return;
  var t0 = 0;
  (function lap(t) { if (!document.hidden && t - t0 > 66) { holoVeSao(t); t0 = t; } HOLO_SAO.raf = requestAnimationFrame(lap); })(0);
}
window.addEventListener('resize', function () { if (document.documentElement.classList.contains('holo')) { HOLO_SAO.sao = null; holoVeSao(0); } });

/* ---------- bật / tắt lớp áo ---------- */
function holoApDung() {
  var bat = holoBat(), html = document.documentElement;
  html.classList.toggle('holo', bat);
  if (bat) {
    if (!document.getElementById('holoCss')) { var st = document.createElement('style'); st.id = 'holoCss'; st.textContent = HOLO_CSS; document.head.appendChild(st); }
    if (!document.getElementById('holoFont')) { var l = document.createElement('link'); l.id = 'holoFont'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@500;600;700&display=swap'; document.head.appendChild(l); }
    if (!document.getElementById('holoSao')) { var c = document.createElement('canvas'); c.id = 'holoSao'; c.setAttribute('aria-hidden', 'true'); document.body.insertBefore(c, document.body.firstChild); }
  } else { var cv = document.getElementById('holoSao'); if (cv) cv.remove(); }
  holoChay(); holoNut();
}
function holoNut() {
  var b = document.getElementById('btnHolo');
  if (!b) return;
  var m = holoCheDo();
  b.innerHTML = '🌌 Hologram<small>' + (m === 'dong' ? 'Bật · có chuyển động' : m === 'tinh' ? 'Bật · nền tĩnh' : 'Đang tắt') + ' – bấm để đổi</small>';
}
function holoDoi() {
  var m = holoCheDo(), moi = m === 'dong' ? 'tinh' : m === 'tinh' ? 'tat' : 'dong';
  try { localStorage.setItem(HOLO_KHOA, moi); } catch (e) {}
  holoApDung();
  try { if (tabHienTai) go(tabHienTai); } catch (e) {}
  toast(moi === 'dong' ? 'Đã bật hologram (có chuyển động)' : moi === 'tinh' ? 'Hologram: nền tĩnh, nhẹ máy hơn' : 'Đã tắt hologram – về giao diện thường', true);
}

/* ---------- Đài quan sát KPI (đầu màn Tổng quan) ---------- */
var HOLO_THANG = [[95, 'S'], [90, 'A+'], [85, 'A'], [80, 'B'], [70, 'C'], [0, 'D']];
function holoLoai(v) { for (var i = 0; i < HOLO_THANG.length; i++) if (v >= HOLO_THANG[i][0]) return HOLO_THANG[i][1]; }
function holoKeTiep(v) { for (var i = HOLO_THANG.length - 1; i >= 0; i--) if (HOLO_THANG[i][0] > v) return HOLO_THANG[i]; return null; }
function holoSo(v, d) { return Number(v).toLocaleString('vi-VN', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
function holoSoLieu() {
  var dangLam = (D.nhansu || []).filter(function (x) { return String(x.TrangThai).trim() === 'Đang làm' && String(x.laTP).toUpperCase() !== 'TRUE'; });
  var tatCa = [], duoi = [], xs = [];
  (D.phongban || []).forEach(function (p) {
    var ds = [];
    dangLam.forEach(function (x) {
      if (x.MaXuong !== p.MaXuong) return;
      var k = null; try { k = kpi(x.MaNV); } catch (e) {}
      if (!k || !(Number(k.tong) > 0)) return;            // chưa có sản lượng tháng này: không tính
      ds.push(k.tong); tatCa.push(k.tong);
      if (k.tong < 80) duoi.push({ ten: x.HoTen, x: p.TenXuong, v: k.tong });
    });
    if (ds.length) xs.push({ ma: p.MaXuong, t: p.TenXuong, k: ds.reduce(function (a, b) { return a + b; }, 0) / ds.length, n: ds.length });
  });
  duoi.sort(function (a, b) { return a.v - b.v; });
  var hn = today(), daKhai = {}, slHn = 0;
  (D.nhatky || []).forEach(function (r) { if (ngay(r.Ngay) === hn) { daKhai[r.MaNV] = 1; slHn += Number(r.SoLuongLamRa) || 0; } });
  var soKhai = dangLam.filter(function (x) { return daKhai[x.MaNV]; }).length;
  return { xs: xs, tb: tatCa.length ? tatCa.reduce(function (a, b) { return a + b; }, 0) / tatCa.length : 0, soNguoi: tatCa.length, duoi: duoi,
    soKhai: soKhai, soLam: dangLam.length, slHn: slHn, choSL: (D.choDuyet || []).length, choDM: (typeof cho === 'function' ? cho() : 0) };
}
function holoChomSao(sl) {
  var C = 200, n = sl.xs.length, rk = function (k) { return 48 + (Math.max(60, Math.min(100, k)) - 60) / 40 * 122; };
  var s = '<svg viewBox="-34 -12 468 428" role="img" aria-label="Chòm sao KPI theo xưởng"><style>.hl-tri{pointer-events:none}</style><defs><filter id="hlSang" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<radialGradient id="hlLoi"><stop offset="0" stop-color="#e0f2fe"/><stop offset=".35" stop-color="#38bdf8"/><stop offset="1" stop-color="#38bdf8" stop-opacity="0"/></radialGradient></defs>';
  s += '<circle cx="200" cy="200" r="196" fill="none" stroke="rgba(125,211,252,.55)" stroke-width="1.5" filter="url(#hlSang)"/><circle cx="200" cy="200" r="178" fill="rgba(2,6,23,.35)" stroke="rgba(125,211,252,.35)"/>';
  for (var t = 0; t < 72; t++) { var a0 = t * 5 * Math.PI / 180, l = t % 2 ? 5 : 10; s += '<line x1="' + (C + 178 * Math.cos(a0)).toFixed(1) + '" y1="' + (C + 178 * Math.sin(a0)).toFixed(1) + '" x2="' + (C + (178 + l) * Math.cos(a0)).toFixed(1) + '" y2="' + (C + (178 + l) * Math.sin(a0)).toFixed(1) + '" stroke="rgba(125,211,252,.5)"/>'; }
  var aNhan = (-90 + 180 / Math.max(1, n)) * Math.PI / 180;   // chữ hạng đặt ở khe giữa 2 ngôi sao đầu, không đè sao
  [[70, 'C'], [80, 'B'], [85, 'A'], [90, 'A+'], [95, 'S']].forEach(function (m) {
    var r = rk(m[0]);
    s += '<circle class="hl-tri" cx="200" cy="200" r="' + r.toFixed(1) + '" fill="none" stroke="' + (m[0] === 80 ? 'rgba(251,113,133,.5)' : 'rgba(125,211,252,.22)') + '" stroke-dasharray="' + (m[0] === 80 ? '4 4' : '2 5') + '"/>' +
      '<text class="hl-tri" x="' + (C + r * Math.cos(aNhan)).toFixed(1) + '" y="' + (C + r * Math.sin(aNhan) + 3.5).toFixed(1) + '" fill="#f5c86b" font-size="10" font-family="Exo 2,sans-serif" text-anchor="middle">' + m[1] + '</text>';
  });
  if (!n) return s + '<text x="200" y="205" fill="#7ea6c8" font-size="13" text-anchor="middle">Chưa có sản lượng tháng này</text></svg>';
  var pts = sl.xs.map(function (x, i) { var a = (-90 + i * 360 / n) * Math.PI / 180, r = rk(x.k); return { x: C + r * Math.cos(a), y: C + r * Math.sin(a), a: a, o: x }; });
  if (n > 2) s += '<polygon points="' + pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') + '" class="hl-tri" fill="rgba(56,189,248,.08)" stroke="#7dd3fc" stroke-width="1" opacity=".8"/>';
  pts.forEach(function (p) { s += '<line class="hl-tri" x1="200" y1="200" x2="' + (C + 178 * Math.cos(p.a)).toFixed(1) + '" y2="' + (C + 178 * Math.sin(p.a)).toFixed(1) + '" stroke="rgba(125,211,252,.12)"/>'; });
  pts.forEach(function (p) {
    var k = p.o.k, m = k < 80 ? '#fb7185' : k >= 90 ? '#f5c86b' : '#e0f2fe', rr = 3 + Math.min(4, p.o.n / 6);
    var lx = C + 204 * Math.cos(p.a), ly = C + 204 * Math.sin(p.a) + 4, an = Math.abs(Math.cos(p.a)) < .3 ? 'middle' : Math.cos(p.a) > 0 ? 'start' : 'end';
    s += '<g class="hl-sao" tabindex="0" role="button" data-x="' + esc(p.o.ma) + '" aria-label="' + esc(p.o.t) + ' ' + holoSo(k, 1) + '% – mở Bảng KPI xưởng này">' +
      '<circle class="vong" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (rr + 7).toFixed(1) + '" fill="transparent" stroke="transparent"/>' +
      '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + rr.toFixed(1) + '" fill="' + m + '" filter="url(#hlSang)"/>' +
      '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" fill="#cfe8ff" font-size="11.5" text-anchor="' + an + '">' + esc(String(p.o.t).replace(/^Xưởng\s+/i, '')) + '</text>' +
      '<text x="' + lx.toFixed(1) + '" y="' + (ly + 13).toFixed(1) + '" fill="' + m + '" font-size="11" font-family="JetBrains Mono,monospace" text-anchor="' + an + '">' + holoSo(k, 1) + '</text></g>';
  });
  s += '<circle cx="200" cy="200" r="40" fill="url(#hlLoi)" opacity=".55"/><circle cx="200" cy="200" r="30" fill="#06122b" stroke="#7dd3fc" stroke-width="1.5" filter="url(#hlSang)"/>' +
    '<text x="200" y="204" fill="#fff" font-size="17" font-weight="700" font-family="Exo 2,sans-serif" text-anchor="middle">' + holoSo(sl.tb, 1) + '</text>' +
    '<text x="200" y="218" fill="#f5c86b" font-size="9.5" font-family="Exo 2,sans-serif" text-anchor="middle">' + holoLoai(sl.tb) + ' · NHÀ MÁY</text>';
  return s + '</svg>';
}
function holoVong(p, nhan, giua) {
  p = Math.max(0, Math.min(100, p));
  return '<svg viewBox="0 0 120 120" style="max-width:124px;margin:0 auto" role="img" aria-label="' + esc(nhan) + '"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(125,211,252,.4)"/><circle cx="60" cy="60" r="44" fill="none" stroke="rgba(125,211,252,.12)" stroke-width="7"/>' +
    '<circle cx="60" cy="60" r="44" fill="none" stroke="#f5c86b" stroke-width="7" stroke-linecap="round" pathLength="100" stroke-dasharray="' + p.toFixed(1) + ' 100" transform="rotate(-90 60 60)"/>' +
    '<circle cx="60" cy="60" r="30" fill="none" stroke="rgba(125,211,252,.35)" stroke-dasharray="2 4"/><text x="60" y="63" fill="#fff" font-size="17" font-weight="700" font-family="Exo 2,sans-serif" text-anchor="middle">' + giua + '</text>' +
    '<text x="60" y="78" fill="#7ea6c8" font-size="8.5" font-family="JetBrains Mono,monospace" text-anchor="middle">' + esc(nhan) + '</text></svg>';
}
function holoDaiQuanSat() {
  var sl = holoSoLieu(), ds = sl.xs.slice().sort(function (a, b) { return b.k - a.k; }), kt = holoKeTiep(sl.tb);
  var gio = new Date(), hh = ('0' + gio.getHours()).slice(-2) + ':' + ('0' + gio.getMinutes()).slice(-2);
  var h = '<section class="hl-dai" id="hlDai" aria-label="Đài quan sát KPI"><div class="hl-dau"><h2>Đài quan sát KPI</h2><span>' + today().split('-').reverse().join('/') + ' · ' + hh + ' · tháng ' + (+today().slice(5, 7)) + '</span></div><div class="hl-ba">';
  h += '<div><div class="hl-o"><h3>KPI tháng · theo xưởng</h3>' + (ds.length ? ds.map(function (x) {
    return '<button type="button" class="hl-dg" data-x="' + esc(x.ma) + '" title="Mở Bảng KPI ' + esc(x.t) + '"><span>' + esc(x.t) + ' <span class="hl-nho">· ' + x.n + ' người</span></span><b class="' + (x.k < 80 ? 'thap' : x.k >= 90 ? 'cao' : '') + '">' + holoSo(x.k, 1) + '</b>' +
      '<span class="hl-vach"><i class="' + (x.k < 80 ? 'thap' : '') + '" style="width:' + Math.max(0, Math.min(100, (x.k - 60) / 40 * 100)).toFixed(1) + '%"></i></span></button>';
  }).join('') : '<div class="hl-nho">Chưa có sản lượng tháng này.</div>') + '</div></div>';
  h += '<div class="hl-giua">' + holoChomSao(sl) + '<div class="hl-hang">' + ['D', 'C', 'B', 'A', 'A+', 'S'].map(function (l) { return '<span' + (sl.soNguoi && l === holoLoai(sl.tb) ? ' class="bat"' : '') + '>' + l + '</span>'; }).join('') + '</div>' +
    '<p class="hl-nho" style="text-align:center;margin:6px 0 0">Mỗi ngôi sao là một xưởng, càng xa tâm KPI càng cao. Vòng đỏ đứt = 80%. Sao vàng ≥ 90, sao hồng &lt; 80.' + (sl.soNguoi && kt ? ' Nhà máy còn ' + holoSo(kt[0] - sl.tb, 1) + ' điểm lên ' + kt[1] + '.' : '') + ' Bấm vào sao để mở Bảng KPI xưởng đó.</p></div>';
  h += '<div><div class="hl-o"><h3>Hôm nay đã khai sản lượng</h3>' + holoVong(sl.soLam ? sl.soKhai / sl.soLam * 100 : 0, sl.soKhai + ' / ' + sl.soLam + ' NGƯỜI', holoSo(sl.soLam ? sl.soKhai / sl.soLam * 100 : 0) + '%') +
    '<p class="hl-nho" style="text-align:center;margin:4px 0 0">' + holoSo(sl.slHn) + ' sản phẩm đã nhập hôm nay</p></div>' +
    '<div class="hl-o"><h3>Dưới 80% · ' + sl.duoi.length + ' người</h3><div class="hl-bao">' + (sl.duoi.length ? sl.duoi.slice(0, 6).map(function (p) { return '<span><span>' + esc(p.ten) + ' · ' + esc(String(p.x).replace(/^Xưởng\s+/i, '')) + '</span><b>' + holoSo(p.v, 1) + '</b></span>'; }).join('') + (sl.duoi.length > 6 ? '<span class="hl-nho">… và ' + (sl.duoi.length - 6) + ' người nữa (xem bên dưới)</span>' : '') : '<span class="hl-nho">Không ai dưới 80%.</span>') + '</div></div></div>';
  h += '</div><div class="hl-chan"><span>SẢN LƯỢNG CHỜ DUYỆT <b>' + sl.choSL + '</b></span><span>ĐỀ XUẤT ĐỊNH MỨC CHỜ <b>' + sl.choDM + '</b></span><span>XƯỞNG ĐẠT A TRỞ LÊN <b>' + sl.xs.filter(function (x) { return x.k >= 85; }).length + '/' + sl.xs.length + '</b></span><span>NGƯỜI CÓ KPI THÁNG NÀY <b>' + sl.soNguoi + '</b></span></div></section>';
  return h;
}
function holoMoXuong(ma) { try { xuongLoc = ma || ''; } catch (e) {} go('kpi'); }
function holoGanDai() {
  if (!holoBat() || tabHienTai !== 'dash') return;
  var m = document.getElementById('main'); if (!m || document.getElementById('hlDai')) return;
  var w = document.createElement('div'); w.innerHTML = holoDaiQuanSat();
  var moc = m.querySelector('.pdesc') || m.querySelector('.ptitle');
  if (moc && moc.parentNode === m) moc.insertAdjacentElement('afterend', w.firstChild); else m.insertBefore(w.firstChild, m.firstChild);
  var kp = m.querySelector('.kpis'); if (kp) kp.classList.add('hl-an');     // ô Hiệu suất / Tỷ lệ đạt cũ: đã có trong Đài quan sát
  var dai = document.getElementById('hlDai');
  dai.addEventListener('click', function (ev) { var t = ev.target.closest('[data-x]'); if (t) holoMoXuong(t.getAttribute('data-x')); });
  dai.addEventListener('keydown', function (ev) { if (ev.key !== 'Enter' && ev.key !== ' ') return; var t = ev.target.closest('.hl-sao'); if (t) { ev.preventDefault(); holoMoXuong(t.getAttribute('data-x')); } });
}

/* ---------- gắn vào web ---------- */
(function () {
  var dashCu = window.vDash;
  window.vDash = function () { var r = dashCu.apply(this, arguments); try { holoGanDai(); } catch (e) {} return r; };
  var navCu = window.veNav;
  window.veNav = function () {
    var r = navCu.apply(this, arguments);
    try {
      var nav = document.getElementById('nav');
      if (nav && ME && ME.laOwner && !document.getElementById('btnHolo')) {
        var b = document.createElement('button'); b.type = 'button'; b.id = 'btnHolo'; b.className = 'holo-nav'; b.onclick = holoDoi;
        nav.insertBefore(b, nav.querySelector('.nav-chan') || null);
      }
      holoApDung();
    } catch (e) {}
    return r;
  };
})();
