
/* ===== 16/11 tối (chủ dự án): CHO NGHỈ VIỆC HÀNG LOẠT (đợt cắt giảm nhân sự) – chỉ chủ sở hữu =====
   Mỗi mã NV: NhanSu.TrangThai -> "Nghỉ việc" + mọi tài khoản đăng nhập của người đó -> "Ngừng" (như khi sửa từng người, ngungTKTheoMaNV_).
   Lịch sử sản lượng / KPI giữ nguyên. Bước 1 xem trước (xemNghiViecHangLoat), bước 2 xác nhận (luuNghiViecHangLoat). */
function nvHLMa_(ds) {
  var a = Array.isArray(ds) ? ds : String(ds || '').split(/[\s,;]+/), out = [], co = {};
  a.slice(0, 500).forEach(function(x) { var m = String(x || '').trim().toUpperCase(); if (/^[A-Z]{0,3}\d{1,6}$/.test(m) && !co[m]) { co[m] = 1; out.push(m); } });
  return out;
}
function nvHLQuyen_(token) {
  var me = docPhien_(token);
  if (!me) return { loi: sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' }) };
  if (!me.laOwner) return { loi: sach_({ ok: false, msg: 'Chỉ tài khoản chủ sở hữu được cho nghỉ việc hàng loạt.' }) };
  return { me: me };
}
function xemNghiViecHangLoat(token, ds) {
  var q = nvHLQuyen_(token); if (q.loi) return q.loi;
  var ma = nvHLMa_(ds), ns = {}, tk = {}, tenX = {};
  doc_('NhanSu').forEach(function(x) { ns[String(x.MaNV || '').trim().toUpperCase()] = x; });
  doc_('TaiKhoan').forEach(function(t) { var m = String(t.MaNV || '').trim().toUpperCase(); if (m) (tk[m] = tk[m] || []).push(t); });
  docAnToan_('PhongBan').forEach(function(p) { tenX[p.MaXuong] = p.TenXuong; });
  var dong = ma.map(function(m) {
    var x = ns[m], t = tk[m] || [];
    return { ma: m, co: !!x, ten: x ? x.HoTen : '', xuong: x ? (tenX[x.MaXuong] || x.MaXuong || '') : '', chucDanh: x ? (x.ChucDanh || '') : '', tt: x ? String(x.TrangThai || '').trim() : '',
      tkDung: t.filter(function(a) { return String(a.TrangThai).trim() === 'Đang dùng'; }).map(function(a) { return a.TenDangNhap + ' (' + a.VaiTro + ')'; }) };
  });
  return sach_({ ok: true, dong: dong, doi: dong.filter(function(d) { return d.co && (d.tt !== 'Nghỉ việc' || d.tkDung.length); }).length });
}
function luuNghiViecHangLoat(token, ds) {
  var q = nvHLQuyen_(token); if (q.loi) return q.loi;
  khoa_();
  var ma = nvHLMa_(ds), nNV = 0, nTK = 0, khong = [], ds2 = [];
  var ns = {}; doc_('NhanSu').forEach(function(x) { ns[String(x.MaNV || '').trim().toUpperCase()] = x; });
  ma.forEach(function(m) {
    var x = ns[m]; if (!x) { khong.push(m); return; }
    if (String(x.TrangThai).trim() !== 'Nghỉ việc') { suaO_('NhanSu', x._row, 'TrangThai', 'Nghỉ việc'); nNV++; ds2.push(m); }
    nTK += ngungTKTheoMaNV_(x.MaNV);
  });
  try { xoaCache_('NhanSu'); xoaCache_('TaiKhoan'); } catch (e) {}
  ghiLog_(q.me, 'Cho nghỉ việc hàng loạt', nNV + ' người · ngừng ' + nTK + ' tài khoản', '', ds2.join(', ').slice(0, 450));
  return sach_({ ok: true, nNV: nNV, nTK: nTK, khong: khong, msg: 'Đã chuyển ' + nNV + ' người sang "Nghỉ việc" và ngừng ' + nTK + ' tài khoản đăng nhập.' + (khong.length ? ' Không thấy mã: ' + khong.join(', ') + '.' : '') });
}
