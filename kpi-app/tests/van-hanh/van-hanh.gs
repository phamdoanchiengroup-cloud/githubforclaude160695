
/* ================== VẬN HÀNH – NHẮC HẠN, SOÁT DUYỆT, ĐỊNH MỨC LỆCH, HỘI NHẬP, KỸ NĂNG (tư vấn 18/10) ==================
   Nguồn: kpi-app/tests/van-hanh/van-hanh.gs (nối vào Code.gs bởi tests/van-hanh/va-van-hanh.py). Danh sách: kpi-app/TU-VAN-VAN-HANH.md. */

/* ----- Ngày còn thiếu sản lượng, CHƯA quá hạn (cùng điều kiện với chayPhatNhapTre) -----
   Trả { MaNV: [{ngay, han}] } – han = ngày làm việc thứ 3 (hạn 17:00). */
function thieuNhap_(dsNV, homNay) {
  var gioNay = gioVN_(), maQL = mapQuanLy_();
  var xuongDD = {}, daNhap = {}, cc = {}, ndh = {}, daPhat = {};
  docAnToan_('XacNhanDiemDanh').forEach(function(r){ xuongDD[r.MaXuong + '|' + ngayVN_(r.Ngay)] = 1; });
  doc_('NhatKySanXuat').forEach(function(r){ daNhap[r.MaNV + '|' + ngayVN_(r.Ngay)] = 1; });
  docAnToan_('DiemDanhNghi').forEach(function(r){ cc[r.MaNV + '|' + ngayVN_(r.Ngay)] = khTuBanGhi_(r); });
  docAnToan_('NghiDaiHan').forEach(function(r){ (ndh[r.MaNV] = ndh[r.MaNV] || []).push({ tu: ngayVN_(r.TuNgay), den: ngayVN_(r.DenNgay) }); });
  docAnToan_('PhatNhapTre').forEach(function(p){ daPhat[p.MaNV + '|' + ngayVN_(p.Ngay)] = 1; });
  var ngays = [];
  for (var b = 0; b <= 14; b++) { var n0 = congNgay_(homNay, -b); if (thuCua_(n0) !== 0) ngays.push(n0); }
  var out = {};
  dsNV.forEach(function(nv){
    if (!nv || String(nv.TrangThai).trim() === 'Nghỉ việc' || maQL[String(nv.MaNV).trim()]) return;
    ngays.forEach(function(ng){
      var k = nv.MaNV + '|' + ng;
      if (daNhap[k] || daPhat[k] || !xuongDD[nv.MaXuong + '|' + ng] || laNgayLe_(ng, nv.MaXuong)) return;
      var d = ndh[nv.MaNV] || [];
      for (var i = 0; i < d.length; i++) if (d[i].tu <= ng && ng <= d[i].den) return;
      if (cc[k] && gioCoMat_(cc[k]) <= 0) return;
      var han = themNgayLamViec_(ng, 2);
      if (homNay > han || (homNay === han && gioNay >= 17)) return;      // đã quá hạn -> việc của chayPhatNhapTre
      (out[nv.MaNV] = out[nv.MaNV] || []).push({ ngay: ng, han: han });
    });
  });
  Object.keys(out).forEach(function(m){ out[m].sort(function(a, b){ return a.han < b.han ? -1 : a.han > b.han ? 1 : (a.ngay < b.ngay ? -1 : 1); }); });
  return out;
}

/* Tỷ lệ nhập đúng hạn của một xưởng trong 7 ngày làm việc gần nhất đã qua hạn (để khen cả xưởng, C6) */
function tyLeDungHan_(maXuong, homNay) {
  var ngays = [], d = homNay;
  for (var i = 0; i < 40 && ngays.length < 7; i++) {
    d = congNgay_(d, -1);
    if (thuCua_(d) === 0) continue;
    var han = themNgayLamViec_(d, 2);
    if (han < homNay) ngays.push(d);
  }
  var coDD = {}; docAnToan_('XacNhanDiemDanh').forEach(function(r){ if (r.MaXuong === maXuong) coDD[ngayVN_(r.Ngay)] = 1; });
  ngays = ngays.filter(function(n){ return coDD[n] && !laNgayLe_(n, maXuong); });
  if (!ngays.length) return null;
  var maQL = mapQuanLy_();
  var ns = doc_('NhanSu').filter(function(x){ return x.MaXuong === maXuong && String(x.TrangThai).trim() !== 'Nghỉ việc' && !maQL[String(x.MaNV).trim()]; });
  if (!ns.length) return null;
  var tre = 0, ngaySet = {};
  ngays.forEach(function(n){ ngaySet[n] = 1; });
  docAnToan_('PhatNhapTre').forEach(function(p){ if (p.MaXuong === maXuong && ngaySet[ngayVN_(p.Ngay)]) tre++; });
  var tong = ns.length * ngays.length;
  return { tyLe: Math.round(Math.max(0, tong - tre) / tong * 100), soNgay: ngays.length };
}

/* C1: công nhân xem ngày còn thiếu sản lượng của mình (chỉ những ngày chưa quá hạn) */
function hanNhapCuaToi(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'CN' || !me.maNV) return sach_({ ok: true, ds: [] });
  var homNay = homNayVN_();
  var nv = nhanSuGomTP_().filter(function(x){ return x.MaNV === me.maNV; })[0];
  var ds = nv ? (thieuNhap_([nv], homNay)[me.maNV] || []) : [];
  var tl = me.xuong ? tyLeDungHan_(me.xuong, homNay) : null;
  return sach_({ ok: true, ds: ds, homNay: homNay, hocViec: dangHocViec_(me.maNV, homNay), hetHocViec: hetHocViec_(me.maNV),
    xuong: tl ? { ten: tenXuong_(me.xuong), tyLe: tl.tyLe, soNgay: tl.soNgay } : null });
}

/* C2: trưởng/phó phòng xem người trong xưởng còn thiếu sản lượng, hạn tới trong 1 ngày làm việc tới */
function canNhacXuong(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'TP' || !me.xuong) return sach_({ ok: true, ds: [] });
  var homNay = homNayVN_(), moc = themNgayLamViec_(homNay, 1);
  var ns = nhanSuGomTP_().filter(function(x){ return x.MaXuong === me.xuong; });
  var thieu = thieuNhap_(ns, homNay), ten = {};
  ns.forEach(function(x){ ten[x.MaNV] = x.HoTen; });
  var ds = [];
  Object.keys(thieu).forEach(function(m){
    var gan = thieu[m].filter(function(t){ return t.han <= moc; });
    if (gan.length) ds.push({ MaNV: m, HoTen: ten[m] || m, ngay: gan.map(function(t){ return t.ngay; }), han: gan[0].han, hocViec: dangHocViec_(m, homNay) });
  });
  ds.sort(function(a, b){ return a.han < b.han ? -1 : a.han > b.han ? 1 : String(a.HoTen).localeCompare(String(b.HoTen)); });
  var tl = tyLeDungHan_(me.xuong, homNay);
  return sach_({ ok: true, ds: ds, homNay: homNay, xuong: tl ? { ten: tenXuong_(me.xuong), tyLe: tl.tyLe, soNgay: tl.soNgay } : null });
}

/* A4 + A6: bảng soát khâu duyệt + định mức lệch – ban điều hành, trợ lý */
function soatDuyet(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (me.vaiTro !== 'ADMIN' && me.vaiTro !== 'TL') return sach_({ ok: false, msg: 'Chỉ ban điều hành xem được.' });
  return nho_('soatDuyet', [], function() { return soatDuyetGoc_(); });
}
function soatDuyetGoc_() {
  var homNay = homNayVN_(), tu30 = congNgay_(homNay, -30), tu7 = congNgay_(homNay, -7), bayGio = new Date().getTime();
  var kyNay = homNay.slice(0, 7), ky = [kyTruoc_(kyNay)]; ky.unshift(kyTruoc_(ky[0])); ky.unshift(kyTruoc_(ky[0]));
  var dt = docDuLieuKPI_(canLuuTru_(ky));
  var cd = {}; doc_('CongDoan').forEach(function(c){ cd[c.MaCD] = c; });
  var ten = {}; nhanSuGomTP_().forEach(function(x){ ten[x.MaNV] = x.HoTen; });
  var X = {}, mau = [], hs = {};
  var x_ = function(mx){ return X[mx] || (X[mx] = { MaXuong: mx, TenXuong: tenXuong_(mx), cho: 0, choLau: 0, duyet: 0, sua: 0, chotCa: 0 }); };
  dt.nhatky.forEach(function(r){
    var c = cd[r.MaCD]; if (!c) return;
    var tt = String(r.TrangThai).trim(), ng = ngayVN_(r.Ngay);
    if (tt === 'Chờ duyệt') {
      var x = x_(c.MaXuong); x.cho++;
      var t = r.ThoiDiemNhap ? new Date(r.ThoiDiemNhap).getTime() : NaN;
      if ((!isNaN(t) && bayGio - t > 24 * 3600e3) || ng < congNgay_(homNay, -1)) x.choLau++;
      return;
    }
    if (tt !== 'Đã chốt') return;
    if (ng >= tu30) {
      var y = x_(c.MaXuong); y.duyet++;
      if (String(r.SLGoc || '').trim()) y.sua++;
      if (String(r.NguoiNhap || '').indexOf('→ duyệt') < 0) y.chotCa++;
      if (ng >= tu7) mau.push(r);
    }
    // A6: hiệu suất từng dòng theo định mức ngày đó, gom theo công đoạn + tháng
    var thg = ng.slice(0, 7), gio = soVN_(r.GioLam) || 0, d = dmNgay_(dt, r.MaCD, ng);
    if (ky.indexOf(thg) < 0 || !(gio > 0) || !(d > 0)) return;
    var sl = Number(r.SoLuongLamRa) || 0;
    ((hs[r.MaCD] = hs[r.MaCD] || {})[thg] = hs[r.MaCD][thg] || []).push(sl / (d * gio) * 100);
  });
  // 5 dòng ngẫu nhiên đã duyệt trong 7 ngày để ban điều hành đối chiếu
  var chon = [];
  for (var i = 0; i < 5 && mau.length; i++) chon.push(mau.splice(Math.floor(Math.random() * mau.length), 1)[0]);
  var trungVi = function(a){ a = a.slice().sort(function(p, q){ return p - q; }); var m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  var lech = [];
  Object.keys(hs).forEach(function(m){
    var tv = ky.map(function(k){ var a = hs[m][k] || []; return a.length >= 5 ? Math.round(trungVi(a)) : null; });
    if (tv.some(function(v){ return v === null; })) return;
    var cao = tv.every(function(v){ return v > 115; }), thap = tv.every(function(v){ return v < 80; });
    if (cao || thap) lech.push({ MaCD: m, TenCD: (cd[m] || {}).TenCD || m, MaXuong: (cd[m] || {}).MaXuong || '', TenXuong: tenXuong_((cd[m] || {}).MaXuong || ''),
      dm: dt.idxDM[m] || 0, ky: ky, trungVi: tv, huong: cao ? 'cao' : 'thap' });
  });
  lech.sort(function(a, b){ return Math.abs(b.trungVi[2] - 100) - Math.abs(a.trungVi[2] - 100); });
  return sach_({ ok: true, homNay: homNay,
    xuong: Object.keys(X).map(function(k){ return X[k]; }).sort(function(a, b){ return b.choLau - a.choLau || String(a.TenXuong).localeCompare(String(b.TenXuong)); }),
    mau: chon.map(function(r){ var c = cd[r.MaCD] || {}; var tl = tachLoi_(r.GhiChu);
      return { ngay: ngayVN_(r.Ngay), MaNV: r.MaNV, HoTen: ten[r.MaNV] || r.MaNV, TenXuong: tenXuong_(c.MaXuong || ''), TenCD: c.TenCD || r.MaCD,
        SL: Number(r.SoLuongLamRa) || 0, slGoc: String(r.SLGoc || ''), nguoi: String(r.NguoiNhap || '') }; }),
    lech: lech.slice(0, 15) });
}

/* ===== D4. ĐÓN NGƯỜI MỚI: danh sách việc cho nhân sự / trưởng phòng =====
   Mục tự động lấy từ dữ liệu; mục "tay" lưu ở sheet HoiNhap (MaNV, Muc, NguoiDanh, ThoiDiem). */
var HN_SHEET = 'HoiNhap', HN_COT = ['MaNV', 'Muc', 'NguoiDanh', 'ThoiDiem'], HN_SO_NGAY = 45;
var HN_MUC = [
  ['phieu', 'Đã giao phiếu tài khoản (mật khẩu tạm)', 'tay'],
  ['dangnhap', 'Đã đăng nhập lần đầu', 'tu'],
  ['doimk', 'Đã đổi mật khẩu riêng', 'tu'],
  ['congdoan', 'Đã giao công đoạn làm được', 'tu'],
  ['nhapdau', 'Lần nhập sản lượng đầu đã được duyệt', 'tu'],
  ['com', 'Đã đăng ký cơm trưa', 'tu'],
  ['kem', 'Có người kèm cặp 3 ngày đầu', 'tay'],
  ['ngay30', 'Trưởng phòng xác nhận đã tự nhập được (ngày 30)', 'tay']
];
function hnSheet_() {
  var sh = ss_().getSheetByName(HN_SHEET);
  if (!sh) { sh = ss_().insertSheet(HN_SHEET); sh.getRange(1, 1, 1, HN_COT.length).setValues([HN_COT]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function hnDuoc_(me) { return !!me && ['ADMIN', 'HR', 'TP', 'TL'].indexOf(me.vaiTro) >= 0; }
function layHoiNhap(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!hnDuoc_(me)) return sach_({ ok: true, ds: [] });
  var homNay = homNayVN_(), tu = congNgay_(homNay, -HN_SO_NGAY);
  var ns = doc_('NhanSu').filter(function(x){
    var v = x.NgayVaoLam ? ngayVN_(x.NgayVaoLam) : '';
    return v && v >= tu && v <= homNay && String(x.TrangThai).trim() !== 'Nghỉ việc' && (me.vaiTro !== 'TP' || x.MaXuong === me.xuong);
  });
  if (!ns.length) return sach_({ ok: true, ds: [], muc: HN_MUC });
  var tk = {}; doc_('TaiKhoan').forEach(function(t){ if (t.MaNV) tk[String(t.MaNV).toUpperCase()] = t; });
  var nk = {}; doc_('NhatKySanXuat').forEach(function(r){ if (String(r.TrangThai).trim() === 'Đã chốt') nk[r.MaNV] = 1; });
  var com = {}; docAnToan_('DangKyCom').forEach(function(r){ com[String(r.TenDangNhap).toLowerCase()] = 1; });
  var tay = {}; (ss_().getSheetByName(HN_SHEET) ? doc_(HN_SHEET) : []).forEach(function(r){ tay[r.MaNV + '|' + r.Muc] = { ai: r.NguoiDanh, luc: r.ThoiDiem }; });
  var ds = ns.map(function(x){
    var t = tk[String(x.MaNV).toUpperCase()];
    var tu_ = {
      dangnhap: !!(t && String(t.LanDangNhapCuoi || '').trim()),
      doimk: !!(t && String(t.DoiMatKhauLanDau).trim() === 'Không'),
      congdoan: !!String(x.CongDoanLamDuoc || '').trim(),
      nhapdau: !!nk[x.MaNV],
      com: !!(t && com[String(t.TenDangNhap).toLowerCase()])
    };
    var muc = HN_MUC.map(function(m){ var v = m[2] === 'tu' ? tu_[m[0]] : !!tay[x.MaNV + '|' + m[0]]; return { ma: m[0], xong: v, tay: m[2] === 'tay', ai: (tay[x.MaNV + '|' + m[0]] || {}).ai || '' }; });
    return { MaNV: x.MaNV, HoTen: x.HoTen, MaXuong: x.MaXuong, TenXuong: tenXuong_(x.MaXuong), NgayVaoLam: ngayVN_(x.NgayVaoLam),
      soNgay: Math.round((new Date(homNay).getTime() - new Date(ngayVN_(x.NgayVaoLam)).getTime()) / 864e5),
      muc: muc, xong: muc.filter(function(m){ return m.xong; }).length };
  }).sort(function(a, b){ return a.NgayVaoLam < b.NgayVaoLam ? 1 : -1; });
  return sach_({ ok: true, ds: ds, muc: HN_MUC, sua: me.vaiTro !== 'TL' });
}
function danhDauHoiNhap(token, maNV, muc, co) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (['ADMIN', 'HR', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });
  if (!HN_MUC.some(function(m){ return m[0] === muc && m[2] === 'tay'; })) return sach_({ ok: false, msg: 'Mục không đánh dấu tay được.' });
  var nv = doc_('NhanSu').filter(function(x){ return x.MaNV === maNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên.' });
  if (me.vaiTro === 'TP' && nv.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Nhân viên không thuộc xưởng của bạn.' });
  khoa_();
  var sh = hnSheet_();
  var cu = doc_(HN_SHEET).filter(function(r){ return r.MaNV === maNV && r.Muc === muc; });
  if (co && !cu.length) them_(HN_SHEET, { MaNV: maNV, Muc: muc, NguoiDanh: me.ten, ThoiDiem: new Date() });
  if (!co && cu.length) xoaNhieuDong_(HN_SHEET, cu.map(function(r){ return r._row; }));
  return sach_({ ok: true });
}

/* ===== D5. BẢNG KỸ NĂNG 3 MỨC: Đang học (có người kèm) / Làm được / Kèm được người khác =====
   CongDoanLamDuoc giữ nguyên cách lưu (danh sách mã công đoạn). Mức nằm ở cột mới MucKyNang = JSON {MaCD: 'hoc'|'kem'};
   không ghi = 'lam' (làm được). */
function luuMucKyNang(token, maNV, maCD, muc) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (['ADMIN', 'TP'].indexOf(me.vaiTro) < 0) return sach_({ ok: false, msg: 'Không có quyền.' });
  if (['hoc', 'lam', 'kem', ''].indexOf(muc) < 0) return sach_({ ok: false, msg: 'Mức không hợp lệ.' });
  khoa_();
  var nv = doc_('NhanSu').filter(function(x){ return x.MaNV === maNV; })[0];
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy nhân viên.' });
  if (me.vaiTro === 'TP' && nv.MaXuong !== me.xuong) return sach_({ ok: false, msg: 'Nhân viên không thuộc xưởng của bạn.' });
  var c = doc_('CongDoan').filter(function(x){ return x.MaCD === maCD; })[0];
  if (!c || c.MaXuong !== nv.MaXuong) return sach_({ ok: false, msg: 'Công đoạn không thuộc xưởng của nhân viên.' });
  var ds = String(nv.CongDoanLamDuoc || '').split(/[,;]\s*/).map(function(x){ return x.trim(); }).filter(Boolean);
  var mk = {}; try { mk = JSON.parse(nv.MucKyNang || '{}') || {}; } catch (e) { mk = {}; }
  var co = ds.indexOf(maCD) >= 0;
  if (muc === '') { ds = ds.filter(function(x){ return x !== maCD; }); delete mk[maCD]; }
  else { if (!co) ds.push(maCD); if (muc === 'lam') delete mk[maCD]; else mk[maCD] = muc; }
  suaO_('NhanSu', nv._row, 'CongDoanLamDuoc', ds.join(','));
  ghiCotNeuCo_('NhanSu', nv._row, 'MucKyNang', Object.keys(mk).length ? JSON.stringify(mk) : '');
  ghiLog_(me, 'Bảng kỹ năng', maNV + ' — ' + maCD + ': ' + ({ hoc: 'Đang học', lam: 'Làm được', kem: 'Kèm được', '': 'Bỏ' })[muc]);
  return sach_({ ok: true, CongDoanLamDuoc: ds.join(','), MucKyNang: mk });
}
