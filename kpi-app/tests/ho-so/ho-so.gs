/* =====================================================================
   HỒ SƠ BẮT BUỘC (22/10, chủ dự án): đăng nhập mà hồ sơ còn thiếu thì phải điền đủ mới dùng tiếp.
   - Áp cho MỌI vai trò dưới ban điều hành (trưởng / phó phòng, trợ lý BĐH, nhân sự, công nhân, tổ trưởng, chuyên viên
     kỹ thuật…); chỉ chủ sở hữu và ban điều hành không bắt buộc (chủ dự án 22/10). Tài khoản Đang dùng có mã nhân viên,
     hồ sơ NhanSu "Đang làm".
   - 6 mục: SĐT, CCCD, địa chỉ, SĐT khẩn cấp, năm sinh, ngày vào làm. Chỉ hỏi mục đang TRỐNG / SAI định dạng;
     điền vào mục trống thì ghi thẳng NhanSu (không cần duyệt – không đè dữ liệu cũ). Sửa mục đã có vẫn qua "Hồ sơ của tôi" (duyệt).
   ===================================================================== */
var HS_KHONG_BAT_BUOC = ['OWNER', 'ADMIN'];             // chủ sở hữu, ban điều hành: không bắt buộc điền hồ sơ
function hsVaiTroPhai_(vt) { vt = String(vt || '').trim(); return !!vt && HS_KHONG_BAT_BUOC.indexOf(vt) < 0; }
var HS_MUC = [
  { k: 'DienThoai',  ten: 'Số điện thoại' },
  { k: 'SoCCCD',     ten: 'Số CCCD' },
  { k: 'DiaChi',     ten: 'Địa chỉ' },
  { k: 'SdtKhanCap', ten: 'SĐT người thân (khẩn cấp)' },
  { k: 'NamSinh',    ten: 'Năm sinh' },
  { k: 'NgayVaoLam', ten: 'Ngày vào làm' }
];
function hsSo_(v) { return String(v == null ? '' : v).replace(/\D/g, ''); }
/* Chuẩn hóa + kiểm tra 1 mục. Trả '' nếu không hợp lệ. coCu = giá trị đang có trong sheet (dễ dãi hơn: SĐT mất số 0 đầu) */
function hsChuan_(k, v, coCu) {
  var s = String(v == null ? '' : v).trim();
  if (v instanceof Date) s = ngayVN_(v);
  if (k === 'DienThoai' || k === 'SdtKhanCap') {
    var d = hsSo_(s);
    if (coCu && /^[1-9]\d{8}$/.test(d)) d = '0' + d;   // số lưu dạng số trong sheet bị mất số 0 đầu
    return /^0\d{9}$/.test(d) ? d : '';
  }
  if (k === 'SoCCCD') {
    var c = hsSo_(s);
    if (coCu && /^\d{11}$/.test(c)) c = '0' + c;
    return /^\d{12}$/.test(c) ? c : '';
  }
  if (k === 'DiaChi') return s.length >= 5 ? s : '';
  if (k === 'NamSinh') {
    var m = s.match(/(19|20)\d\d/), y = m ? Number(m[0]) : 0, nay = Number(homNayVN_().slice(0, 4));
    return (y >= 1950 && y <= nay - 15) ? String(y) : '';
  }
  if (k === 'NgayVaoLam') {
    var n = ngayVN_(s);
    return (/^\d{4}-\d{2}-\d{2}$/.test(n) && n >= '2000-01-01' && n <= homNayVN_()) ? n : '';
  }
  return s;
}
function hsCanDien_(nv) {                                   // hồ sơ này có phải điền không
  return !!nv && String(nv.TrangThai || '').trim() === 'Đang làm';
}
function hoSoThieu_(nv) {
  if (!hsCanDien_(nv)) return [];
  return HS_MUC.filter(function(m) { return !hsChuan_(m.k, nv[m.k], true); }).map(function(m) { return m.k; });
}
function hsCuaToi_(me) {
  if (!me || !me.maNV) return null;
  return doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(me.maNV).trim(); })[0] || null;
}

/* Gọi từ web: lưu các mục còn thiếu của chính mình */
function luuHoSoThieu(token, o) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  khoa_();
  var nv = hsCuaToi_(me);
  if (!nv) return sach_({ ok: false, msg: 'Không tìm thấy hồ sơ của bạn.' });
  if (!hsVaiTroPhai_(me.vaiTroGoc || me.vaiTro)) return sach_({ ok: true, msg: 'Tài khoản của bạn không bắt buộc bổ sung hồ sơ.', thieu: [] });
  var thieu = hoSoThieu_(nv), loi = [], ghi = {};
  o = o || {};
  thieu.forEach(function(k) {
    var v = hsChuan_(k, o[k], false);
    if (!v) loi.push(k); else ghi[k] = v;
  });
  if (ghi.DienThoai && ghi.SdtKhanCap && ghi.DienThoai === ghi.SdtKhanCap) loi.push('SdtKhanCap');
  if (loi.length) {
    var ten = {}; HS_MUC.forEach(function(m) { ten[m.k] = m.ten; });
    return sach_({ ok: false, loi: loi, msg: 'Chưa đúng: ' + loi.map(function(k) { return ten[k]; }).join(', ') + '.' });
  }
  Object.keys(ghi).forEach(function(k) {
    if (k === 'DienThoai' || k === 'SoCCCD' || k === 'SdtKhanCap') suaOText_('NhanSu', nv._row, k, ghi[k]);
    else suaO_('NhanSu', nv._row, k, k === 'NamSinh' ? Number(ghi[k]) : ghi[k]);
  });
  ghiLog_(me, 'Tự điền hồ sơ còn thiếu', me.maNV + ' — ' + Object.keys(ghi).join(', '));
  xong_();
  return sach_({ ok: true, msg: 'Đã lưu hồ sơ. Cảm ơn bạn!', thieu: [] });
}

/* Ban điều hành / nhân sự (cả nhà máy), trưởng / phó phòng (xưởng mình): ai còn thiếu hồ sơ */
function thongKeHoSoThieu(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  var toanBo = xemCaNhaMay_(me) || me.vaiTro === 'HR';
  if (!toanBo && me.vaiTro !== 'TP') return sach_({ ok: false, msg: 'Không có quyền.' });
  var coTK = {};
  doc_('TaiKhoan').forEach(function(t) { if (String(t.TrangThai).trim() === 'Đang dùng' && t.MaNV && hsVaiTroPhai_(t.VaiTro)) coTK[String(t.MaNV).trim()] = 1; });
  var ds = [], theoMuc = {};
  HS_MUC.forEach(function(m) { theoMuc[m.k] = 0; });
  var soXet = 0;
  doc_('NhanSu').forEach(function(x) {
    if (!coTK[String(x.MaNV).trim()] || !hsCanDien_(x)) return;
    if (!toanBo && x.MaXuong !== me.xuong) return;
    soXet++;
    var t = hoSoThieu_(x);
    if (!t.length) return;
    t.forEach(function(k) { theoMuc[k]++; });
    ds.push({ MaNV: x.MaNV, HoTen: x.HoTen, MaXuong: x.MaXuong, thieu: t });
  });
  return sach_({ ok: true, soXet: soXet, soThieu: ds.length, theoMuc: theoMuc, muc: HS_MUC, ds: ds });
}
