/* ===== SƠ ĐỒ NHÀ MÁY (mục 15, gắn 10/10) =====
   Tab "sodo" cho ADMIN + TP: mặt bằng 2D 3 tầng (lấy từ bản 3D của chủ dự án) tô màu theo KPI tháng này / sĩ số hôm nay,
   bản 3D mở bằng nút "Xem 3D" trên máy tính. Số liệu thật:
   - KPI: sản lượng ĐÃ CHỐT từ đầu tháng (D.nhatky), tính như "So sánh hiệu suất giữa các xưởng" ở Tổng quan.
   - Sĩ số: siSoTatCaXuong(hôm nay) – TP chỉ thấy xưởng mình.
   - Chờ duyệt: D.choDuyet theo xưởng của công đoạn; máy bảo trì: D.maymoc TinhTrang 'Bảo trì' (chưa có vị trí trên bản vẽ).
   - Ghép khu ↔ xưởng: SS.GHEP (mặc định trong mã), ADMIN chỉnh được, lưu ở trình duyệt (kpi_sodo_ghep). */
{{SS}}
var SD_DATA = {{DATA}};
var SD = { tang: 0, loc: '', chon: null, siso: null, sisoNgay: '' };
var SD_TANG = ['Tầng 1', 'Tầng 2', 'Tầng 3'], SD_W = 44.75, SD_D = 34.25, SD_NS = 'http://www.w3.org/2000/svg';
SS.nhanKPI = 'Hiệu suất KPI tháng này';
SS.ghiChu = 'KPI tính từ sản lượng đã chốt từ đầu tháng; sĩ số theo điểm danh hôm nay.';
SS.BAO_TRI = {};
(function () { try { var g = JSON.parse(localStorage.getItem('kpi_sodo_ghep') || 'null'); if (g) Object.keys(g).forEach(function (k) { if (g[k]) SS.GHEP[k] = g[k]; else delete SS.GHEP[k]; }); } catch (e) {} })();

function sdMayBT(ma) {
  return (D.maymoc || []).filter(function (x) { return x.MaXuong === ma && String(x.TinhTrang || '').trim() === 'Bảo trì'; });
}
SS.them = function (ma) {
  var ds = sdMayBT(ma); if (!ds.length) return '';
  return '<div class="ss-bt"><b style="color:#f47272">⚠ ' + ds.length + ' máy đang bảo trì</b><ul>' +
    ds.map(function (x) { return '<li><span class="mono">' + esc(x.MaMay) + '</span> – ' + esc(x.TenMay) + '</li>'; }).join('') + '</ul></div>';
};
/* Tính số liệu từng xưởng vào SS.SO */
function sdTinh() {
  var dauThang = today().slice(0, 8) + '01', laTP = ME.vaiTro === 'TP';
  var pb = (D.phongban || []).filter(function (p) { return !laTP || p.MaXuong === ME.xuong; });
  SS.datXuong(pb.map(function (p) { return [p.MaXuong, esc(p.TenXuong)]; }));
  var xcd = {}; (D.congdoan || []).forEach(function (c) { xcd[c.MaCD] = c.MaXuong; });
  var SO = {}; pb.forEach(function (p) { SO[p.MaXuong] = { kpi: null, coMat: 0, dinhBien: 0, cho: 0, bt: sdMayBT(p.MaXuong).length, a: 0, ms: 0 }; });
  var pn = {};
  (D.nhatky || []).forEach(function (r) {
    var nd = ngay(r.Ngay), mx = xcd[r.MaCD]; if (nd < dauThang || !SO[mx]) return;
    var k = mx + '|' + r.MaNV + '|' + nd; (pn[k] = pn[k] || []).push(r);
  });
  Object.keys(pn).forEach(function (k) {
    var p = k.split('|'), g = gioCoMatNgay(p[1], p[2]); if (g <= 0) return;
    var s = SO[p[0]]; s.ms += g;
    pn[k].forEach(function (r) { var d = dm(r.MaCD); if (d > 0) s.a += (Number(r.SoLuongLamRa) - ngLoi(r)) / d; });
  });
  Object.keys(SO).forEach(function (m) { var s = SO[m]; if (s.ms > 0) s.kpi = Math.round(s.a / s.ms * 100); });
  (D.choDuyet || []).forEach(function (r) { var mx = cd(r.MaCD).MaXuong; if (SO[mx]) SO[mx].cho++; });
  if (SD.siso && SD.sisoNgay === today()) SD.siso.forEach(function (x) {
    var s = SO[x.MaXuong]; if (s && x.daDiemDanh) { s.coMat = x.diLam; s.dinhBien = x.tong; }
  });
  SS.SO = SO;
}
function sdEl(t, at, cha) { var e = document.createElementNS(SD_NS, t); for (var k in at) e.setAttribute(k, at[k]); if (cha) cha.appendChild(e); return e; }
function sdRc(r) { return { x0: Math.min(r[0], r[2]), x1: Math.max(r[0], r[2]), y0: Math.min(r[1], r[3]), y1: Math.max(r[1], r[3]) }; }
function sdNen(R) { return R.c === 'hl' ? '#2b3035' : R.c === 'thang' || R.c === 'wc' || R.c === 'ky' ? '#24292d' : R.c === 'vp' ? '#3a3f38' : R.c === 'kho' ? '#33383d' : '#8b9196'; }
function sdChu(hex) { var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#0c0d0f' : '#eef2f4'; }

function sdVe() {
  var svg = document.getElementById('sdMb'); if (!svg) return;
  var tang = SD.tang, loc = SD.loc, chon = SD.chon, D2 = SD_D;
  svg.innerHTML = ''; svg.classList.toggle('loc', !!loc);
  svg.setAttribute('aria-label', 'Mặt bằng ' + SD_TANG[tang]);
  sdEl('rect', { x: 0, y: 0, width: SD_W, height: D2, fill: '#181b1f', stroke: '#3e464e', 'stroke-width': .2 }, svg);
  var F = SD_DATA[tang], lp = sdEl('g', {}, svg), lm = sdEl('g', {}, svg), lt = sdEl('g', { 'aria-hidden': 'true' }, svg);
  F.rooms.forEach(function (R, ri) {
    var ma = SS.xuong(tang, R), mau = SS.mau(tang, R) || sdNen(R);
    var g = sdEl('g', { 'class': 'phong' + (loc && ma === loc ? ' sang' : '') + (chon && chon.ri === ri ? ' chon' : ''), tabindex: 0, role: 'button' }, lp);
    g.setAttribute('aria-label', R.n + (ma && SS.SO[ma] ? ', xưởng ' + SS.TEN[ma] + ', ' + (SS.cheDo === 'siso' ? 'có mặt ' : 'KPI ') + SS.chuSo(ma) : ''));
    R.r.forEach(function (r) { var a = sdRc(r); sdEl('rect', { x: a.x0, y: D2 - a.y1, width: a.x1 - a.x0, height: a.y1 - a.y0, fill: mau }, g); });
    var big = R.r.map(sdRc).sort(function (p, q) { return (q.x1 - q.x0) * (q.y1 - q.y0) - (p.x1 - p.x0) * (p.y1 - p.y0); })[0];
    var w = big.x1 - big.x0, h = big.y1 - big.y0, cx = (big.x0 + big.x1) / 2, cy = D2 - (big.y0 + big.y1) / 2;
    if (w * h > 8 && R.c !== 'hl') {
      // chữ vừa khung: phòng hẹp mà cao thì xoay dọc; vẫn không vừa thì cắt bớt chữ
      var doc = h > w * 1.3 && w < 6, dai = (doc ? h : w) - .7, cao = doc ? w : h, ten = R.n, mc = sdChu(mau), so = ma ? SS.chuSo(ma) : '';
      var co = Math.min(1, dai / (ten.length * .56), cao * .32);
      if (co < .55) { co = .55; var n = Math.max(3, Math.floor(dai / (.55 * .56)) - 1); if (ten.length > n) ten = ten.slice(0, n) + '…'; }
      var gt = sdEl('g', { 'class': 'nhan' + (loc && ma === loc ? ' sang' : ''), transform: doc ? 'rotate(-90 ' + cx + ' ' + cy + ')' : '' }, lt);
      var coSo = Math.min(co * 1.45, cao * .42, dai / (so.length * .62 || 1)), coSoTen = so && cao > co + coSo + .4;
      var t = sdEl('text', { x: cx, y: cy + (coSoTen ? -coSo * .25 : co * .35), 'font-size': co, fill: mc, 'font-weight': 600 }, gt); t.textContent = ten;
      if (coSoTen) { var t2 = sdEl('text', { x: cx, y: cy + co * .3 + coSo * .85, 'font-size': coSo, fill: mc, 'font-weight': 800, 'font-family': 'JetBrains Mono,monospace' }, gt); t2.textContent = so; }
    }
    g.addEventListener('click', function () { sdChonPhong(ri); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sdChonPhong(ri); } });
  });
  F.mc.forEach(function (Mc) {
    var a = sdRc(Mc.r);
    sdEl('rect', { x: a.x0, y: D2 - a.y1, width: Math.max(.25, a.x1 - a.x0), height: Math.max(.25, a.y1 - a.y0), 'class': 'may', rx: .08 }, lm);
  });
  document.getElementById('sdCgiai').innerHTML = SS.chuGiai();
}
function sdVeCT() {
  var c = document.getElementById('sdCt'); if (!c) return;
  if (!SD.chon) { c.innerHTML = '<h3>Chi tiết</h3><p class="goi">Chạm vào một khu trên sơ đồ để xem KPI, sĩ số, dòng chờ duyệt và máy đang bảo trì của xưởng đó.</p>'; return; }
  var F = SD_DATA[SD.tang], R = F.rooms[SD.chon.ri], eq = {};
  F.mc.forEach(function (Mc) {
    var a = sdRc(Mc.r), x = (a.x0 + a.x1) / 2, y = (a.y0 + a.y1) / 2;
    if (R.r.some(function (r) { var b = sdRc(r); return x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1; })) { var k = Mc.l.replace(/\s*\d+$/, ''); eq[k] = (eq[k] || 0) + 1; }
  });
  var ma = SS.xuong(SD.tang, R), s = SS.SO[ma];
  c.innerHTML = '<div class="tang">' + SD_TANG[SD.tang] + (R.a ? ' · ' + String(R.a).replace('.', ',') + ' m²' : '') + (R.p ? ' · bản vẽ ghi ' + R.p + ' người' : '') + '</div><h4>' + esc(R.n) + '</h4>' + SS.the(SD.tang, R) +
    (Object.keys(eq).length ? '<div class="eq">' + Object.keys(eq).map(function (k) { return '<span>' + esc(k) + ' × ' + eq[k] + '</span>'; }).join('') + '</div>' : '') +
    (s ? '<button class="btn pri" type="button" onclick="go(\'kpi\')">Mở Bảng KPI</button>' + (s.bt ? '<button class="btn" type="button" onclick="go(\'mm\')">Mở trang Máy móc</button>' : '') : '');
}
function sdChonPhong(ri) {
  SD.chon = { ri: ri }; sdVe(); sdVeCT();
  if (matchMedia('(max-width:1080px)').matches) document.getElementById('sdCt').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function sdDatTang(f) {
  SD.tang = f; SD.chon = null;
  [].forEach.call(document.querySelectorAll('#sdTang button'), function (b) { b.setAttribute('aria-pressed', String(+b.dataset.f === f)); });
  sdVe(); sdVeCT();
}
function sdVeXs() {
  var ul = document.getElementById('sdXs'); if (!ul) return;
  if (!SS.XUONG.length) { ul.innerHTML = '<li class="ss-trong">Chưa có xưởng.</li>'; return; }
  ul.innerHTML = SS.XUONG.map(function (x) {
    var s = SS.SO[x[0]], v = SS.cheDo === 'siso' ? SS.tyLe(s) : (s.kpi || 0), mau = SS.mauXuong(x[0]);
    return '<li><button type="button" data-x="' + esc(x[0]) + '" aria-pressed="' + (SD.loc === x[0]) + '"><b>' + x[1] + (s.bt ? '<span class="bt">⚠ ' + s.bt + ' máy BT</span>' : '') + '</b>' +
      '<span class="so" style="color:' + mau + '">' + SS.chuSo(x[0]) + '</span>' +
      '<span class="thanh"><i style="width:' + Math.min(100, v / (SS.cheDo === 'siso' ? 100 : 120) * 100) + '%;background:' + mau + '"></i></span></button></li>';
  }).join('');
  [].forEach.call(ul.querySelectorAll('button'), function (b) {
    b.onclick = function () {
      var x = b.dataset.x; SD.loc = (SD.loc === x) ? '' : x;
      if (SD.loc) {
        var dem = [0, 0, 0]; SD_DATA.forEach(function (F, fi) { F.rooms.forEach(function (R) { if (SS.xuong(fi, R) === SD.loc) dem[fi]++; }); });
        var f = dem.indexOf(Math.max.apply(null, dem));
        if (!dem[SD.tang] && dem[f]) sdDatTang(f); else sdVe();
        if (!dem[0] && !dem[1] && !dem[2]) toast('Xưởng này chưa ghép với khu nào trên sơ đồ');
      } else sdVe();
      sdVeXs();
    };
  });
}
function sdVeBg() {
  var box = document.getElementById('sdBg'); if (!box) return;
  var h = '';
  SD_DATA.forEach(function (F, fi) {
    F.rooms.forEach(function (R, ri) {
      if (!(R.c === 'sx' || R.c === 'son' || R.c === 'kho')) return;
      var ma = SS.xuong(fi, R);
      h += '<label><span>' + esc(R.n) + '<small>' + SD_TANG[fi] + '</small></span><select data-fi="' + fi + '" data-ri="' + ri + '" aria-label="Xưởng của ' + esc(R.n) + '"><option value="">— chưa ghép —</option>' +
        SS.XUONG.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (x[0] === ma ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></label>';
    });
  });
  box.innerHTML = h;
  [].forEach.call(box.querySelectorAll('select'), function (sl) {
    sl.onchange = function () {
      var fi = +sl.dataset.fi, R = SD_DATA[fi].rooms[+sl.dataset.ri];
      SS.doi(fi, R, sl.value);
      try { var g = JSON.parse(localStorage.getItem('kpi_sodo_ghep') || '{}'); g[SS.khoa(fi, R)] = sl.value; localStorage.setItem('kpi_sodo_ghep', JSON.stringify(g)); } catch (e) {}
      if (fi !== SD.tang) sdDatTang(fi);
      toast('Đã ghép lại – sơ đồ đổi màu ngay (lưu trên máy này)');
    };
  });
}
function sdLaMayTinh() { return matchMedia('(min-width:900px)').matches; }
function vSoDo() {
  sdTinh();
  var ad = ME.vaiTro === 'ADMIN';
  var h = '<div class="ptitle">Sơ đồ nhà máy</div>' +
    '<div class="pdesc">' + (ad ? 'Toàn nhà máy' : esc(ME.tenXuong || '')) + ' · mỗi khu tô màu theo KPI tháng này hoặc sĩ số hôm nay của xưởng làm việc ở đó. Chạm vào khu để xem chi tiết.</div>' +
    '<div class="sd-luoi"><div class="card">' +
    '<div class="sd-cong"><div class="sd-seg" id="sdTang" role="group" aria-label="Chọn tầng">' + SD_TANG.map(function (t, i) { return '<button type="button" data-f="' + i + '" aria-pressed="' + (i === SD.tang) + '">' + t + '</button>'; }).join('') + '</div>' +
    '<div class="sd-seg" id="sdMau" role="group" aria-label="Tô màu theo"><button type="button" data-c="kpi" aria-pressed="' + (SS.cheDo === 'kpi') + '">KPI tháng này</button><button type="button" data-c="siso" aria-pressed="' + (SS.cheDo === 'siso') + '">Sĩ số hôm nay</button></div>' +
    '<button class="btn' + (sdLaMayTinh() ? '' : ' hide') + '" type="button" id="sdNut3d">Xem 3D</button></div>' +
    '<div class="sd-khung"><svg id="sdMb" viewBox="-0.5 -0.5 45.75 35.25" role="img" aria-label="Mặt bằng tầng"></svg></div>' +
    '<div class="sd-huong">↓ Phía dưới sơ đồ là mặt tiền, cổng chính</div><div class="sd-cgiai" id="sdCgiai"></div></div>' +
    '<div class="sd-ben"><div class="card" id="sdCt" aria-live="polite"></div>' +
    '<div class="card"><h3>Theo xưởng<span>bấm để soi trên sơ đồ</span></h3><ul class="sd-xs" id="sdXs"></ul><div id="sdSiSoGhi" class="sd-huong"></div></div>' +
    (ad ? '<div class="card"><details class="sd-ghep"><summary>Bảng ghép khu ↔ xưởng</summary><p>Ghép tạm theo tên khu trên bản vẽ. Chỗ nào chưa đúng anh/chị chọn lại – sơ đồ (cả 3D) đổi màu ngay. Lựa chọn được lưu trên trình duyệt của máy này.</p><div class="sd-bg" id="sdBg"></div></details></div>' : '') +
    '</div></div>';
  $('main').innerHTML = h;
  document.getElementById('sdTang').onclick = function (e) { var b = e.target.closest('button'); if (b) sdDatTang(+b.dataset.f); };
  document.getElementById('sdMau').onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return;
    [].forEach.call(this.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    SS.datCheDo(b.dataset.c);
  };
  document.getElementById('sdNut3d').onclick = sdMo3D;
  sdDatTang(SD.tang); sdVeXs(); sdVeBg(); sdGhiSiSo();
  if (SD.sisoNgay !== today()) sdTaiSiSo();
}
function sdGhiSiSo() {
  var g = document.getElementById('sdSiSoGhi'); if (!g) return;
  g.textContent = laChuNhat(today()) ? 'Hôm nay Chủ nhật – không có sĩ số.' : (SD.sisoNgay === today() ? 'Sĩ số chỉ tính xưởng đã điểm danh hôm nay.' : 'Đang tải sĩ số hôm nay…');
}
function sdTaiSiSo() {
  if (laChuNhat(today())) return;
  call('siSoTatCaXuong', [today()], function (r) {
    if (!r || !r.ok) return;
    var xs = r.xuong || [];
    if (ME.vaiTro === 'TP') xs = xs.filter(function (x) { return x.MaXuong === ME.xuong; });
    // chỉ giữ số đếm, không giữ danh sách / lý do nghỉ
    SD.siso = xs.map(function (x) { return { MaXuong: x.MaXuong, tong: x.tong, diLam: x.diLam, daDiemDanh: x.daDiemDanh }; });
    SD.sisoNgay = today();
    if (tabHienTai !== 'sodo') return;
    sdTinh(); SS.bao(); sdGhiSiSo();
  });
}
SS.nghe.push(function () { if (tabHienTai !== 'sodo' || !document.getElementById('sdMb')) return; sdVe(); sdVeCT(); sdVeXs(); });

/* Bản 3D: lớp phủ toàn màn hình, iframe dựng từ nguồn trong #sdNguon3d (chỉ tải khi bấm) */
function sdMo3D() {
  if (document.getElementById('sd3d')) return;
  var k = document.createElement('div'); k.id = 'sd3d'; k.setAttribute('role', 'dialog'); k.setAttribute('aria-label', 'Mô hình 3D nhà máy');
  k.innerHTML = '<div class="sd3d-dau"><b>Mô hình 3D nhà máy</b><span style="color:#9ca8b0;font-size:12.5px">Cùng màu KPI / sĩ số với sơ đồ</span><button class="btn" type="button" id="sd3dDong">✕ Đóng</button></div>' +
    '<div class="cho3d">Đang tải mô hình 3D… (cần mạng để tải thư viện Three.js)</div>';
  var f = document.createElement('iframe'); f.title = 'Mô hình 3D nhà máy'; f.srcdoc = document.getElementById('sdNguon3d').value;
  f.onload = function () { var c = k.querySelector('.cho3d'); if (c) c.remove(); };
  k.appendChild(f); document.body.appendChild(k);
  SD.nghe0 = SS.nghe.length;   // bản 3D tự đăng ký nghe SS.nghe – bỏ đi khi đóng
  document.getElementById('sd3dDong').onclick = sdDong3D;
  document.addEventListener('keydown', sdEsc3D);
  document.getElementById('sd3dDong').focus();
}
function sdEsc3D(e) { if (e.key === 'Escape') sdDong3D(); }
function sdDong3D() {
  var k = document.getElementById('sd3d'); if (k) k.remove();
  if (SD.nghe0 !== undefined) { SS.nghe.length = SD.nghe0; delete SD.nghe0; }
  document.removeEventListener('keydown', sdEsc3D);
  var n = document.getElementById('sdNut3d'); if (n) n.focus();
}
