/* =====================================================================
   HỒ SƠ BẮT BUỘC (22/10, chủ dự án): đăng nhập mà hồ sơ còn thiếu thì phải điền đủ mới dùng tiếp.
   - Áp cho MỌI tài khoản trừ admin (chủ sở hữu, ban điều hành) – chủ dự án 22/10. Có mã nhân viên: hồ sơ NhanSu
     "Đang làm"; không gắn mã nhân viên (trợ lý BĐH, nhân sự, bếp, nhóm báo cơm…): sheet HoSoVanPhong.
   - 6 mục: SĐT, CCCD, địa chỉ, SĐT khẩn cấp, năm sinh, ngày vào làm. Chỉ hỏi mục đang TRỐNG / SAI định dạng;
     điền vào mục trống thì ghi thẳng NhanSu (không cần duyệt – không đè dữ liệu cũ). Sửa mục đã có vẫn qua "Hồ sơ của tôi" (duyệt).
   ===================================================================== */
var HS_KHONG_BAT_BUOC = ['OWNER', 'ADMIN', 'NHOM'];     // chủ sở hữu, ban điều hành, tài khoản nhóm báo cơm (dùng chung): không bắt buộc
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
  if (!me) return null;
  if (me.maNV) return doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(me.maNV).trim(); })[0] || null;
  return vpHoSo_(me.tk, me.vaiTroGoc || me.vaiTro, me.ten);   // ban điều hành / trợ lý / nhân sự: không có trong NhanSu
}

/* ----- HỒ SƠ VĂN PHÒNG (22/10): ban điều hành, trợ lý BĐH, hành chính nhân sự chỉ có tài khoản, không có dòng NhanSu
   (thêm vào NhanSu thì lọt vào Bảng KPI công nhân) -> lưu hồ sơ ở sheet riêng HoSoVanPhong, khóa = TenDangNhap. ----- */
var VP_SHEET = 'HoSoVanPhong', VP_VAI_TRO = ['OWNER', 'ADMIN', 'TL', 'HR'];
var VP_COT = ['TenDangNhap', 'HoTen', 'VaiTro', 'DienThoai', 'SoCCCD', 'DiaChi', 'SdtKhanCap', 'NamSinh', 'NgayVaoLam', 'CapNhat'];
function vpLa_(vt) { return VP_VAI_TRO.indexOf(String(vt || '').trim()) >= 0; }
function vpSheet_() {
  var sh = ss_().getSheetByName(VP_SHEET);
  if (!sh) {
    sh = ss_().insertSheet(VP_SHEET);
    sh.getRange(1, 1, 1, VP_COT.length).setValues([VP_COT]).setFontWeight('bold');
    sh.setFrozenRows(1);
    [4, 5, 7].forEach(function(c) { sh.getRange(2, c, sh.getMaxRows() - 1, 1).setNumberFormat('@'); });   // SĐT, CCCD giữ số 0 đầu
  }
  return sh;
}
/* Hồ sơ văn phòng của 1 tài khoản KHÔNG gắn mã nhân viên (ban điều hành, trợ lý, nhân sự, bếp, nhóm báo cơm…);
   chưa có dòng thì trả bản trống (_vp, _moi) để biết còn thiếu gì */
function vpHoSo_(tenDN, vaiTro, hoTen) {
  if (!tenDN || !String(vaiTro || '').trim()) return null;
  var x = ss_().getSheetByName(VP_SHEET) ? docAnToan_(VP_SHEET).filter(function(r) {
    return String(r.TenDangNhap).toLowerCase() === String(tenDN).toLowerCase(); })[0] : null;
  var o = { TenDangNhap: tenDN, HoTen: hoTen, VaiTro: vaiTro, TrangThai: 'Đang làm', _vp: true };
  if (x) { for (var k in x) o[k] = x[k]; o.TrangThai = 'Đang làm'; o._vp = true; } else o._moi = true;
  return o;
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
  var bang = nv._vp ? VP_SHEET : 'NhanSu';
  if (nv._vp) {                                            // hồ sơ văn phòng: chưa có dòng thì thêm dòng
    vpSheet_();
    if (nv._moi) {
      them_(VP_SHEET, { TenDangNhap: me.tk, HoTen: me.ten, VaiTro: me.vaiTroGoc || me.vaiTro, CapNhat: new Date() });
      xaGhi_(VP_SHEET);
      nv._row = ss_().getSheetByName(VP_SHEET).getLastRow();
    } else suaO_(VP_SHEET, nv._row, 'CapNhat', new Date());
  }
  Object.keys(ghi).forEach(function(k) {
    if (k === 'DienThoai' || k === 'SoCCCD' || k === 'SdtKhanCap') suaOText_(bang, nv._row, k, ghi[k]);
    else suaO_(bang, nv._row, k, k === 'NamSinh' ? Number(ghi[k]) : ghi[k]);
  });
  ghiLog_(me, 'Tự điền hồ sơ còn thiếu', (me.maNV || me.tk) + ' — ' + Object.keys(ghi).join(', '));
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
  if (me.laOwner) {                                        // tài khoản không gắn mã NV (trợ lý BĐH, nhân sự, bếp…): chỉ chủ sở hữu thấy
    doc_('TaiKhoan').forEach(function(t) {
      var vt = String(t.VaiTro).trim();
      if (String(t.TrangThai).trim() !== 'Đang dùng' || t.MaNV || !hsVaiTroPhai_(vt)) return;   // mọi tài khoản không gắn mã NV, trừ admin
      soXet++;
      var tt = hoSoThieu_(vpHoSo_(t.TenDangNhap, vt, t.HoTen));
      if (!tt.length) return;
      tt.forEach(function(k) { theoMuc[k]++; });
      ds.push({ MaNV: t.TenDangNhap, HoTen: t.HoTen, MaXuong: 'VAN_PHONG', thieu: tt });
    });
  }
  return sach_({ ok: true, soXet: soXet, soThieu: ds.length, theoMuc: theoMuc, muc: HS_MUC, ds: ds });
}

/* CHỈ CHỦ SỞ HỮU: danh sách ban điều hành, trợ lý BĐH, hành chính nhân sự (tài khoản + hồ sơ văn phòng) */
function danhSachVanPhong(token) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!me.laOwner) return sach_({ ok: false, msg: 'Chỉ chủ sở hữu xem được.' });
  var ten = { OWNER: 'Chủ sở hữu', ADMIN: 'Ban điều hành', TL: 'Trợ lý ban điều hành', HR: 'Hành chính nhân sự' }, thuTu = { OWNER: 0, ADMIN: 1, TL: 2, HR: 3 };
  var ds = [];
  doc_('TaiKhoan').forEach(function(t) {
    var vt = String(t.VaiTro).trim();
    if (!vpLa_(vt) || String(t.TrangThai).trim() !== 'Đang dùng') return;
    var h = t.MaNV ? (doc_('NhanSu').filter(function(x) { return String(x.MaNV).trim() === String(t.MaNV).trim(); })[0] || {}) : vpHoSo_(t.TenDangNhap, vt, t.HoTen);
    var o = { tk: t.TenDangNhap, HoTen: t.HoTen, vaiTro: vt, tenVaiTro: ten[vt] || vt, batBuoc: hsVaiTroPhai_(vt),
      lanCuoi: t.LanDangNhapCuoi ? ngayVN_(t.LanDangNhapCuoi) : '', thieu: [] };
    var h2 = {}; for (var k in h) h2[k] = h[k]; h2.TrangThai = 'Đang làm'; o.thieu = hoSoThieu_(h2);
    HS_MUC.forEach(function(m) { var v = hsChuan_(m.k, h[m.k], true); o[m.k] = v || ''; });
    ds.push(o);
  });
  ds.sort(function(a, b) { return (thuTu[a.vaiTro] - thuTu[b.vaiTro]) || (a.HoTen < b.HoTen ? -1 : 1); });
  return sach_({ ok: true, ds: ds, muc: HS_MUC });
}
