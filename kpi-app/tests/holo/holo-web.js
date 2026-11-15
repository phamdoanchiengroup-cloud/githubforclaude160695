/* =====================================================================
   34. GIAO DIỆN CHỦ SỞ HỮU – KÍNH "PREMIUM GLASS" (16/11, chủ dự án: "áp dụng cho giao diện chủ sở hữu, bỏ hoàn toàn giao diện hologram")
   - Hologram (nền vũ trụ, sao nhấp nháy, viền xanh phát sáng, font Exo 2) đã BỎ HẲN 16/11.
   - Chỉ chạy khi ME.laOwner. Mọi tài khoản khác: giao diện giữ nguyên.
   - Lớp áo: hệ thống vật liệu kính trong tests/rung-suong/rung-suong.css + .js (html.rs, tông rs-xanh / rs-do / rs-tim, rs-nhe).
   - Tổng quan: GIỮ "Đài quan sát KPI" (chòm sao KPI theo xưởng, bấm sao mở Bảng KPI đúng xưởng), đổi màu sang kính, không chuyển động liên tục.
   - Nút cuối menu: "Giao diện kính" Đầy đủ -> Nhẹ (không làm mờ, cho máy yếu) -> Tắt; "Tông màu" Xanh rừng -> Đỏ lá phong -> Tím oải hương.
     Nhớ trong máy (localStorage kpi_kinh, kpi_kinh_tong). Chọn nền sáng (nút mặt trời) thì kính tự tắt.
   ===================================================================== */
var HOLO_KHOA = 'kpi_kinh', HOLO_TONG = 'kpi_kinh_tong', HOLO_TONG_TEN = { xanh: 'Xanh rừng sương', do: 'Đỏ lá phong', tim: 'Tím oải hương' };
function holoCheDo() { var v = null; try { v = localStorage.getItem(HOLO_KHOA); } catch (e) {} return v === 'nhe' || v === 'tat' ? v : 'day'; }
function holoTong() { var v = null; try { v = localStorage.getItem(HOLO_TONG); } catch (e) {} return HOLO_TONG_TEN[v] ? v : 'xanh'; }
function holoSang() { return document.documentElement.getAttribute('data-gd') === 'sang'; }
function holoChu() { return !!(typeof ME !== 'undefined' && ME && ME.laOwner); }
function holoBat() { return holoChu() && holoCheDo() !== 'tat' && !holoSang(); }
function holoDong() { return false; }   // 16/11: không chuyển động liên tục (yêu cầu hiệu năng)

var HOLO_CSS =
  /* khối Đài quan sát */
  '.hl-dai{position:relative;container-type:inline-size;border:1px solid rgba(255,255,255,.55);border-radius:18px;padding:14px;margin:6px 0 18px;color:#f4faf6;' +
  'background:rgba(0,0,0,.62);box-shadow:0 0 24px rgba(255,255,255,.32),inset 0 0 30px rgba(255,255,255,.1);font-family:"Be Vietnam Pro",Inter,system-ui,sans-serif}' +
  '.hl-dau{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:0 4px 10px;border-bottom:1px solid rgba(255,255,255,.25);margin-bottom:12px}' +
  '.hl-dau h2{margin:0;font:600 17px sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#eef7f2;text-shadow:0 0 10px rgba(255,255,255,.7)}' +
  '.hl-dau span{font:500 12px var(--mono);color:rgba(240,249,244,.72)}' +
  '.hl-ba{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.5fr) minmax(0,.9fr);gap:12px;align-items:start}' +
  '@container (max-width:760px){.hl-ba{grid-template-columns:minmax(0,1fr)}.hl-ba .hl-giua{order:-1}}' +
  '.hl-o{border:1px solid rgba(255,255,255,.3);border-radius:10px;padding:10px 12px;background:rgba(0,0,0,.5);margin-bottom:10px}' +
  '.hl-o h3{margin:0 0 8px;font:600 11px sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#f5c86b}' +
  '.hl-dg{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 8px;font-size:13px;padding:4px 0;border-bottom:1px dashed rgba(255,255,255,.15);cursor:pointer;background:none;border-left:0;border-right:0;border-top:0;color:inherit;text-align:left;width:100%;font-family:inherit}' +
  '.hl-dg:last-child{border-bottom:0}.hl-dg:hover span{color:#fff}.hl-dg:focus-visible{outline:2px solid #dcefe6;outline-offset:2px}' +
  '.hl-dg b{font:600 13px var(--mono);color:#eef7f2;text-align:right}.hl-dg b.thap{color:#fb7185}.hl-dg b.cao{color:#f5c86b}' +
  '.hl-vach{grid-column:1/-1;height:3px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden}' +
  '.hl-vach i{display:block;height:100%;background:linear-gradient(90deg,rgba(255,255,255,.3),#dcefe6);box-shadow:0 0 8px #dcefe6}.hl-vach i.thap{background:linear-gradient(90deg,rgba(251,113,133,.3),#fb7185)}' +
  '.hl-dai svg{display:block;width:100%;height:auto;overflow:visible}' +
  '.hl-dai svg .hl-sao{cursor:pointer}.hl-dai svg .hl-sao:focus{outline:none}.hl-dai svg .hl-sao:focus circle.vong,.hl-dai svg .hl-sao:hover circle.vong{stroke:#fff;stroke-width:1.5}' +
  '.hl-nho{font-size:12px;color:rgba(240,249,244,.72)}' +
  '.hl-bao{font-size:13px;display:grid;gap:4px}.hl-bao span{display:flex;justify-content:space-between;gap:8px}.hl-bao b{font:600 12.5px var(--mono);color:#fb7185}' +
  '.hl-chan{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:6px;padding:8px 4px 0;border-top:1px solid rgba(255,255,255,.25);font:500 11.5px var(--mono);color:rgba(240,249,244,.72)}.hl-chan b{color:#eef7f2}' +
  '.hl-hang{display:flex;justify-content:center;gap:5px;margin-top:6px;flex-wrap:wrap}' +
  '.hl-hang span{font:600 12px sans-serif;padding:2px 8px;border:1px solid rgba(255,255,255,.3);border-radius:20px;color:rgba(240,249,244,.72)}' +
  '.hl-hang span.bat{color:#06122b;background:#f5c86b;border-color:#f5c86b;box-shadow:0 0 12px #f5c86b}' +
  '#main .kpis.hl-an{display:none}' +
  /* 08/11: hiệu ứng Đài quan sát – chỉ khi .hl-dong */
  '.hl-dai{overflow:hidden}.hl-dai .hl-quet,.hl-dai .hl-xoay,.hl-dai .hl-quy,.hl-dai .hl-vongdut{transform-box:view-box;transform-origin:200px 200px}' +
  '.hl-dai .hl-quet{opacity:0}.hl-dai.hl-dong .hl-quet{opacity:1;animation:hlQuay 6s linear infinite}' +
  '.hl-dai.hl-dong .hl-xoay{animation:hlQuay 120s linear infinite}.hl-dai.hl-dong .hl-quy{animation:hlQuay 18s linear infinite}.hl-dai.hl-dong .hl-vongdut{animation:hlQuay 60s linear infinite reverse}' +
  '.hl-dai.hl-dong .hl-nhap{animation:hlNhap 2.8s ease-in-out infinite}' +
  '.hl-dai.hl-dong .hl-ve{stroke-dasharray:100;animation:hlVe 1.6s ease-out both}' +
  '.hl-dai.hl-dong .hl-tim{transform-box:fill-box;transform-origin:center;animation:hlTim 2.4s ease-out infinite}' +
  '.hl-dai.hl-dong .hl-cung{animation:hlCung 1.2s ease-out both}' +
  '.hl-dai.hl-dong .hl-vach i{animation:hlVach 1.2s ease-out both}' +
  '.hl-dai .hl-tia{position:absolute;left:0;right:0;top:-30%;height:30%;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,255,255,.07),transparent);opacity:0}' +
  '.hl-dai.hl-dong .hl-tia{opacity:1;animation:hlTia 7s linear infinite}' +
  '.hl-dai.hl-dong .hl-ba>div{animation:hlHien .7s ease-out both}.hl-dai.hl-dong .hl-ba>div:nth-child(2){animation-delay:.12s}.hl-dai.hl-dong .hl-ba>div:nth-child(3){animation-delay:.24s}' +
  '@keyframes hlQuay{to{transform:rotate(360deg)}}' +
  '@keyframes hlNhap{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(1.35)}}' +
  '@keyframes hlVe{from{stroke-dashoffset:100;fill-opacity:0}to{stroke-dashoffset:0}}' +
  '@keyframes hlTim{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.9);opacity:0}}' +
  '@keyframes hlCung{from{stroke-dasharray:0 100}}' +
  '@keyframes hlVach{from{width:0}}' +
  '@keyframes hlTia{from{top:-30%}to{top:100%}}' +
  '@keyframes hlHien{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
  '@media (prefers-reduced-motion:reduce){.hl-dai *,.hl-dai::before,.hl-dai::after{animation:none!important}}' +
  '#nav button.holo-nav{margin-top:6px;border:1px solid var(--line)}#nav button.holo-nav small{display:block;font-size:12px;color:var(--ink3)}';

/* ---------- bật / tắt lớp kính ---------- */
function holoApDung() {
  var html = document.documentElement; html.classList.remove('holo');
  ['holoSao', 'holoFont'].forEach(function (id) { var e = document.getElementById(id); if (e) e.remove(); });   // dọn dấu vết hologram cũ
  if (holoChu() && !document.getElementById('holoCss')) { var st = document.createElement('style'); st.id = 'holoCss'; st.textContent = HOLO_CSS; document.head.appendChild(st); }
  if (typeof rsBat === 'function') { rsBat(holoBat() ? holoTong() : '0'); html.classList.toggle('rs-nhe', holoBat() && holoCheDo() === 'nhe'); }
  holoNut();
}
function holoNut() {
  var b = document.getElementById('btnHolo'), t = document.getElementById('btnTong'), m = holoCheDo();
  if (b) b.innerHTML = '🪟 Giao diện kính<small>' + (holoSang() && m !== 'tat' ? 'Chỉ dùng ở nền tối – bấm để bật nền tối' : (m === 'day' ? 'Đầy đủ' : m === 'nhe' ? 'Nhẹ (cho máy yếu)' : 'Đang tắt') + ' – bấm để đổi') + '</small>';
  if (t) { t.style.display = holoBat() ? '' : 'none'; t.innerHTML = '🎨 Tông màu<small>' + HOLO_TONG_TEN[holoTong()] + ' – bấm để đổi</small>'; }
}
function holoDoi() {
  var m = holoCheDo(), moi = m === 'day' ? 'nhe' : m === 'nhe' ? 'tat' : 'day';
  if (holoSang()) {   // đang nền sáng: bấm = chuyển sang nền tối và bật kính
    moi = m === 'tat' ? 'day' : m;
    try { localStorage.setItem(HOLO_KHOA, moi); localStorage.setItem(KHOA_GIAO_DIEN, 'toi'); } catch (e) {}
    gdDat('toi'); try { if (tabHienTai) go(tabHienTai); } catch (e) {}
    toast('Đã chuyển sang nền tối và bật giao diện kính', true); return;
  }
  try { localStorage.setItem(HOLO_KHOA, moi); } catch (e) {}
  holoApDung();
  toast(moi === 'day' ? 'Giao diện kính: đầy đủ' : moi === 'nhe' ? 'Giao diện kính: nhẹ – bỏ làm mờ, nhẹ máy hơn' : 'Đã tắt giao diện kính – về giao diện thường', true);
}
function holoDoiTong() {
  var ds = ['xanh', 'do', 'tim'], moi = ds[(ds.indexOf(holoTong()) + 1) % ds.length];
  try { localStorage.setItem(HOLO_TONG, moi); } catch (e) {}
  holoApDung(); toast('Tông màu: ' + HOLO_TONG_TEN[moi], true);
}

/* ---------- Đài quan sát KPI (đầu màn Tổng quan) ---------- */
var HOLO_THANG = [[95, 'S'], [90, 'A+'], [85, 'A'], [80, 'B'], [70, 'C'], [0, 'D']];
function holoLoai(v) { for (var i = 0; i < HOLO_THANG.length; i++) if (v >= HOLO_THANG[i][0]) return HOLO_THANG[i][1]; }
function holoKeTiep(v) { for (var i = HOLO_THANG.length - 1; i >= 0; i--) if (HOLO_THANG[i][0] > v) return HOLO_THANG[i]; return null; }
function holoSo(v, d) { return Number(v).toLocaleString('vi-VN', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
function holoSoLieu() {
  var dangLam = (D.nhansu || []).filter(function (x) { return String(x.TrangThai).trim() === 'Đang làm' && String(x.laTP).toUpperCase() !== 'TRUE'; });
  var tatCa = [], xs = [];
  (D.phongban || []).forEach(function (p) {
    var ds = [];
    dangLam.forEach(function (x) {
      if (x.MaXuong !== p.MaXuong) return;
      var k = null; try { k = kpi(x.MaNV); } catch (e) {}
      if (!k || !(Number(k.tong) > 0)) return;            // chưa có sản lượng tháng này: không tính
      ds.push(k.tong); tatCa.push(k.tong);
    });
    if (ds.length) xs.push({ ma: p.MaXuong, t: p.TenXuong, k: ds.reduce(function (a, b) { return a + b; }, 0) / ds.length, n: ds.length });
  });
  /* 08/11 (chủ dự án): bỏ "dưới 80%" + "đã khai hôm nay"; thay bằng độ tin cậy số liệu ngày làm gần nhất (đã duyệt / đã nhập) */
  var nl = holoNgayLamTruoc(), daD = 0, choD = 0;
  (D.nhatky || []).forEach(function (r) { if (ngay(r.Ngay) !== nl) return; if (/chờ/i.test(String(r.TrangThai || ''))) choD++; else daD++; });
  (D.choDuyet || []).forEach(function (r) { if (ngay(r.Ngay) === nl && !(D.nhatky || []).some(function (x) { return x === r; })) choD++; });
  return { xs: xs, tb: tatCa.length ? tatCa.reduce(function (a, b) { return a + b; }, 0) / tatCa.length : 0, soNguoi: tatCa.length,
    nl: nl, daD: daD, choD: choD, soLam: dangLam.length, choSL: (D.choDuyet || []).length, choDM: (typeof cho === 'function' ? cho() : 0) };
}
function holoNgayLamTruoc() {   // ngày làm gần nhất trước hôm nay (bỏ chủ nhật + lễ toàn công ty)
  var d = new Date(today() + 'T12:00:00');
  for (var i = 0; i < 15; i++) { d.setDate(d.getDate() - 1); var k = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    var le = false; try { le = typeof laNgayLeKH === 'function' && laNgayLeKH(k, ''); } catch (e) {}
    if (d.getDay() !== 0 && !le) return k; }
  return today();
}
function holoDemSo(goc) {   // số chạy từ 0 lên (chỉ khi bật chuyển động)
  if (!holoDong()) return;
  Array.prototype.forEach.call((goc || document).querySelectorAll('[data-dem]'), function (e) {
    var dich = Number(e.getAttribute('data-dem')) || 0, so = Number(e.getAttribute('data-so') || 0), t0 = performance.now(), dai = 1100;
    var buoc = function (t) { var p = Math.min(1, (t - t0) / dai), v = dich * (1 - Math.pow(1 - p, 3)); e.textContent = holoSo(v, so); if (p < 1) requestAnimationFrame(buoc); };
    requestAnimationFrame(buoc);
  });
}
function holoChomSao(sl) {
  var C = 200, n = sl.xs.length, rk = function (k) { return 48 + (Math.max(60, Math.min(100, k)) - 60) / 40 * 122; };
  var s = '<svg viewBox="-34 -12 468 428" role="img" aria-label="Chòm sao KPI theo xưởng"><style>.hl-tri{pointer-events:none}</style><defs><filter id="hlSang" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<radialGradient id="hlLoi"><stop offset="0" stop-color="#f4faf6"/><stop offset=".35" stop-color="#dcefe6"/><stop offset="1" stop-color="#dcefe6" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="hlQuetG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#dcefe6" stop-opacity="0"/><stop offset="1" stop-color="#eef7f2" stop-opacity=".42"/></linearGradient>' +
    '<radialGradient id="hlNen" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(0,0,0,.35)" stop-opacity=".9"/><stop offset=".7" stop-color="#0a1f19b" stop-opacity=".55"/><stop offset="1" stop-color="#020617" stop-opacity=".2"/></radialGradient></defs>';
  s += '<circle cx="200" cy="200" r="196" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5" filter="url(#hlSang)"/><circle cx="200" cy="200" r="178" fill="url(#hlNen)" stroke="rgba(255,255,255,.35)"/>' +
    '<g class="hl-quet hl-tri"><path d="M200 200 L378 200 A178 178 0 0 0 325.9 74.1 Z" fill="url(#hlQuetG)"/><line x1="200" y1="200" x2="378" y2="200" stroke="#eef7f2" stroke-width="1.2" opacity=".75"/></g>' +
    '<g class="hl-quy hl-tri"><circle cx="200" cy="4" r="3" fill="#f5c86b" filter="url(#hlSang)"/><circle cx="396" cy="200" r="2" fill="#eef7f2"/></g>' +
    '<circle class="hl-tri hl-vongdut" cx="200" cy="200" r="188" fill="none" stroke="rgba(245,200,107,.35)" stroke-width="1" stroke-dasharray="1 9"/>';
  s += '<g class="hl-xoay hl-tri">';
  for (var t = 0; t < 72; t++) { var a0 = t * 5 * Math.PI / 180, l = t % 2 ? 5 : 10; s += '<line x1="' + (C + 178 * Math.cos(a0)).toFixed(1) + '" y1="' + (C + 178 * Math.sin(a0)).toFixed(1) + '" x2="' + (C + (178 + l) * Math.cos(a0)).toFixed(1) + '" y2="' + (C + (178 + l) * Math.sin(a0)).toFixed(1) + '" stroke="rgba(255,255,255,.5)"/>'; }
  s += '</g>';
  var aNhan = (-90 + 180 / Math.max(1, n)) * Math.PI / 180;   // chữ hạng đặt ở khe giữa 2 ngôi sao đầu, không đè sao
  [[70, 'C'], [80, 'B'], [85, 'A'], [90, 'A+'], [95, 'S']].forEach(function (m) {
    var r = rk(m[0]);
    s += '<circle class="hl-tri" cx="200" cy="200" r="' + r.toFixed(1) + '" fill="none" stroke="' + (m[0] === 80 ? 'rgba(251,113,133,.5)' : 'rgba(255,255,255,.22)') + '" stroke-dasharray="' + (m[0] === 80 ? '4 4' : '2 5') + '"/>' +
      '<text class="hl-tri" x="' + (C + r * Math.cos(aNhan)).toFixed(1) + '" y="' + (C + r * Math.sin(aNhan) + 3.5).toFixed(1) + '" fill="#f5c86b" font-size="10" font-family="Exo 2,sans-serif" text-anchor="middle">' + m[1] + '</text>';
  });
  if (!n) return s + '<text x="200" y="205" fill="rgba(240,249,244,.72)" font-size="13" text-anchor="middle">Chưa có sản lượng tháng này</text></svg>';
  var pts = sl.xs.map(function (x, i) { var a = (-90 + i * 360 / n) * Math.PI / 180, r = rk(x.k); return { x: C + r * Math.cos(a), y: C + r * Math.sin(a), a: a, o: x }; });
  if (n > 2) s += '<polygon points="' + pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') + '" class="hl-tri hl-ve" pathLength="100" fill="rgba(255,255,255,.1)" stroke="#eef7f2" stroke-width="1.2" opacity=".85"/>';
  pts.forEach(function (p) { s += '<line class="hl-tri" x1="200" y1="200" x2="' + (C + 178 * Math.cos(p.a)).toFixed(1) + '" y2="' + (C + 178 * Math.sin(p.a)).toFixed(1) + '" stroke="rgba(255,255,255,.12)"/>'; });
  pts.forEach(function (p) {
    var k = p.o.k, m = k < 80 ? '#fb7185' : k >= 90 ? '#f5c86b' : '#f4faf6', rr = 3 + Math.min(4, p.o.n / 6);
    var lx = C + 204 * Math.cos(p.a), ly = C + 204 * Math.sin(p.a) + 4, an = Math.abs(Math.cos(p.a)) < .3 ? 'middle' : Math.cos(p.a) > 0 ? 'start' : 'end';
    s += '<g class="hl-sao" tabindex="0" role="button" data-x="' + esc(p.o.ma) + '" aria-label="' + esc(p.o.t) + ' ' + holoSo(k, 1) + '% – mở Bảng KPI xưởng này">' +
      '<circle class="vong" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + (rr + 7).toFixed(1) + '" fill="transparent" stroke="transparent"/>' +
      '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + rr.toFixed(1) + '" fill="' + m + '" filter="url(#hlSang)" class="hl-nhap" style="animation-delay:' + (pts.indexOf(p) * 0.37).toFixed(2) + 's;transform-origin:' + p.x.toFixed(1) + 'px ' + p.y.toFixed(1) + 'px"/>' +
      '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" fill="#f4faf6" font-size="11.5" text-anchor="' + an + '">' + esc(String(p.o.t).replace(/^Xưởng\s+/i, '')) + '</text>' +
      '<text x="' + lx.toFixed(1) + '" y="' + (ly + 13).toFixed(1) + '" fill="' + m + '" font-size="11" font-family="JetBrains Mono,monospace" text-anchor="' + an + '">' + holoSo(k, 1) + '</text></g>';
  });
  s += '<circle cx="200" cy="200" r="40" fill="url(#hlLoi)" opacity=".55"/><circle cx="200" cy="200" r="30" fill="rgba(0,0,0,.45)" stroke="#eef7f2" stroke-width="1.5" filter="url(#hlSang)"/>' +
    '<circle class="hl-tri hl-tim" cx="200" cy="200" r="34" fill="none" stroke="#eef7f2" stroke-width="1"/>' +
    '<text x="200" y="204" fill="#fff" font-size="17" font-weight="700" font-family="Exo 2,sans-serif" text-anchor="middle" data-dem="' + sl.tb.toFixed(1) + '" data-so="1">' + holoSo(sl.tb, 1) + '</text>' +
    '<text x="200" y="218" fill="#f5c86b" font-size="9.5" font-family="Exo 2,sans-serif" text-anchor="middle">' + holoLoai(sl.tb) + ' · NHÀ MÁY</text>';
  return s + '</svg>';
}
function holoVong(p, nhan, giua) {
  p = Math.max(0, Math.min(100, p || 0));
  return '<svg viewBox="0 0 120 120" style="max-width:124px;margin:0 auto" role="img" aria-label="' + esc(nhan) + '"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.4)"/><circle cx="60" cy="60" r="44" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="7"/>' +
    '<circle class="hl-cung" cx="60" cy="60" r="44" fill="none" stroke="' + (p < 80 ? '#fb7185' : p < 95 ? '#f5c86b' : '#34d399') + '" stroke-width="7" stroke-linecap="round" pathLength="100" stroke-dasharray="' + p.toFixed(1) + ' 100" transform="rotate(-90 60 60)"/>' +
    '<circle cx="60" cy="60" r="30" fill="none" stroke="rgba(255,255,255,.35)" stroke-dasharray="2 4"/><text x="60" y="63" fill="#fff" font-size="17" font-weight="700" font-family="Exo 2,sans-serif" text-anchor="middle">' + giua + '</text>' +
    '<text x="60" y="78" fill="rgba(240,249,244,.72)" font-size="8.5" font-family="JetBrains Mono,monospace" text-anchor="middle">' + esc(nhan) + '</text></svg>';
}
function holoDaiQuanSat() {
  var sl = holoSoLieu(), ds = sl.xs.slice().sort(function (a, b) { return b.k - a.k; }), kt = holoKeTiep(sl.tb);
  var gio = new Date(), hh = ('0' + gio.getHours()).slice(-2) + ':' + ('0' + gio.getMinutes()).slice(-2);
  var h = '<section class="hl-dai" id="hlDai" aria-label="Đài quan sát KPI"><div class="hl-tia" aria-hidden="true"></div><div class="hl-dau"><h2>Đài quan sát KPI</h2><span>' + today().split('-').reverse().join('/') + ' · ' + hh + ' · tháng ' + (+today().slice(5, 7)) + '</span></div><div class="hl-ba">';
  h += '<div><div class="hl-o"><h3>KPI tháng · theo xưởng</h3>' + (ds.length ? ds.map(function (x) {
    return '<button type="button" class="hl-dg" data-x="' + esc(x.ma) + '" title="Mở Bảng KPI ' + esc(x.t) + '"><span>' + esc(x.t) + ' <span class="hl-nho">· ' + x.n + ' người</span></span><b class="' + (x.k < 80 ? 'thap' : x.k >= 90 ? 'cao' : '') + '" data-dem="' + x.k.toFixed(1) + '" data-so="1">' + holoSo(x.k, 1) + '</b>' +
      '<span class="hl-vach"><i class="' + (x.k < 80 ? 'thap' : '') + '" style="width:' + Math.max(0, Math.min(100, (x.k - 60) / 40 * 100)).toFixed(1) + '%"></i></span></button>';
  }).join('') : '<div class="hl-nho">Chưa có sản lượng tháng này.</div>') + '</div></div>';
  h += '<div class="hl-giua">' + holoChomSao(sl) + '<div class="hl-hang">' + ['D', 'C', 'B', 'A', 'A+', 'S'].map(function (l) { return '<span' + (sl.soNguoi && l === holoLoai(sl.tb) ? ' class="bat"' : '') + '>' + l + '</span>'; }).join('') + '</div>' +
    '<p class="hl-nho" style="text-align:center;margin:6px 0 0">Mỗi ngôi sao là một xưởng, càng xa tâm KPI càng cao. Vòng đỏ đứt = 80%. Sao vàng ≥ 90, sao hồng &lt; 80. Vệt sáng quét = radar đang theo dõi.' + (sl.soNguoi && kt ? ' Nhà máy còn ' + holoSo(kt[0] - sl.tb, 1) + ' điểm lên ' + kt[1] + '.' : '') + ' Bấm vào sao để mở Bảng KPI xưởng đó.</p></div>';
  var tc = sl.daD + sl.choD, pTc = tc ? sl.daD / tc * 100 : 0;
  h += '<div><div class="hl-o"><h3>Có mặt hôm nay</h3><div id="hlCM">' + holoCoMat(window.__tqSiSo) + '</div></div>' +
    '<div class="hl-o"><h3>Số liệu ' + dmy(sl.nl).slice(0, 5) + ' đã duyệt</h3>' + holoVong(pTc, tc ? sl.daD + ' / ' + tc + ' DÒNG' : 'CHƯA CÓ DÒNG', tc ? '<tspan data-dem="' + Math.round(pTc) + '">' + holoSo(pTc) + '</tspan>%' : '–') +
    '<p class="hl-nho" style="text-align:center;margin:4px 0 0">Độ tin cậy số sản lượng ngày làm gần nhất – dòng chờ duyệt còn có thể sửa.</p></div></div>';
  h += '</div><div class="hl-chan"><span>SẢN LƯỢNG CHỜ DUYỆT <b>' + sl.choSL + '</b></span><span>ĐỀ XUẤT ĐỊNH MỨC CHỜ <b>' + sl.choDM + '</b></span><span>XƯỞNG ĐẠT A TRỞ LÊN <b>' + sl.xs.filter(function (x) { return x.k >= 85; }).length + '/' + sl.xs.length + '</b></span><span>NGƯỜI CÓ KPI THÁNG NÀY <b>' + sl.soNguoi + '</b></span></div></section>';
  return h;
}
function holoCoMat(cm) {   // cm = kết quả siSoTatCaXuong (Tổng quan chủ sở hữu tải)
  if (laChuNhat(today())) return holoVong(0, 'CHỦ NHẬT', '–') + '<p class="hl-nho" style="text-align:center;margin:4px 0 0">Hôm nay nghỉ.</p>';
  if (!cm || !cm.ok) return holoVong(0, 'ĐANG TẢI…', '…');
  var t = 0, d = 0, chua = 0; (cm.xuong || []).forEach(function (x) { t += x.tong; d += x.diLam; if (!x.daDiemDanh) chua++; });
  var p = t ? d / t * 100 : 0;
  return holoVong(p, d + ' / ' + t + ' NGƯỜI', '<tspan data-dem="' + Math.round(p) + '">' + holoSo(p) + '</tspan>%') + '<p class="hl-nho" style="text-align:center;margin:4px 0 0">' + (t - d) + ' người nghỉ' + (chua ? ' · <b style="color:#fb7185">' + chua + ' xưởng chưa điểm danh</b>' : ' · các xưởng đã điểm danh') + '</p>';
}
function holoMoXuong(ma) { try { kpiXuong = ma || ''; xuongLoc = ma || ''; } catch (e) {} go('kpi'); }   // Bảng KPI lọc theo kpiXuong (24/10 sửa: trước chỉ đặt xuongLoc)
function holoGanDai() {
  if (!holoChu() || tabHienTai !== 'dash') return;   // 16/11: Đài quan sát luôn có cho chủ sở hữu (kể cả khi tắt kính)
  var m = document.getElementById('main'); if (!m || document.getElementById('hlDai')) return;
  var w = document.createElement('div'); w.innerHTML = holoDaiQuanSat();
  var moc = m.querySelector('.pdesc') || m.querySelector('.ptitle');
  if (moc && moc.parentNode === m) moc.insertAdjacentElement('afterend', w.firstChild); else m.insertBefore(w.firstChild, m.firstChild);
  var kp = m.querySelector('.kpis'); if (kp) kp.classList.add('hl-an');     // ô Hiệu suất / Tỷ lệ đạt cũ: đã có trong Đài quan sát
  var dai = document.getElementById('hlDai');
  if (holoDong()) dai.classList.add('hl-dong');   // 08/11: hiệu ứng (quét radar, sao nhấp nháy, số chạy) – tắt khi chọn "Hologram · tĩnh" / máy giảm chuyển động
  holoDemSo(dai);
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
        var t = document.createElement('button'); t.type = 'button'; t.id = 'btnTong'; t.className = 'holo-nav'; t.onclick = holoDoiTong;
        nav.insertBefore(t, nav.querySelector('.nav-chan') || null);
      }
      holoApDung();
    } catch (e) {}
    return r;
  };
})();
/* 02/11: đổi nền sáng / tối thì áp lại hologram (sáng → tắt, tối → bật lại nếu đang chọn bật) */
(function () { if (typeof gdDat !== 'function' || gdDat.__holo) return; var goc = gdDat; gdDat = function (v) { goc(v); try { holoApDung(); holoNut(); } catch (e) {} }; gdDat.__holo = true; })();
