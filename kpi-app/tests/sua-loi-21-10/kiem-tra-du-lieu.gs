
/* ===== SOÁT DỮ LIỆU SHEET (21/10) – CHẠY TAY TRONG TRÌNH SOẠN THẢO =====
   Ghi kết quả vào sheet "KiemTraDuLieu" (xóa và ghi lại mỗi lần chạy): Nhóm | Chi tiết | Dòng sheet | Cách sửa.
   Chỉ ĐỌC dữ liệu, không sửa gì. */
function KIEM_TRA_DU_LIEU() {
  if (!noiBo_(arguments[0])) return chanWeb_('KIEM_TRA_DU_LIEU');
  var L = [], them = function(nhom, ct, dong, sua) { L.push([nhom, ct, dong || '', sua || '']); };
  var hn = homNayVN_(), coNgay = function(v) { var s = ngayVN_(v); return /^\d{4}-\d{2}-\d{2}$/.test(s) && s >= NGAY_MO_HE_THONG && s <= hn; };
  var ns = {}; doc_('NhanSu').forEach(function(x) { ns[String(x.MaNV).trim()] = x; });
  var cd = {}; doc_('CongDoan').forEach(function(x) { cd[String(x.MaCD).trim()] = x; });
  var dm = {}; doc_('DinhMuc').forEach(function(x) { dm[String(x.MaCD).trim()] = soVN_(x.DinhMucGio); });
  var maQL = mapQuanLy_();

  // 1. Ngày sai trong nhật ký / điểm danh (sản lượng ngày sai không vào KPI)
  doc_('NhatKySanXuat').forEach(function(r) {
    if (!coNgay(r.Ngay)) them('Nhật ký: ngày không hợp lệ', r.MaNV + ' · ' + r.MaCD + ' · SL ' + r.SoLuongLamRa + ' · ngày "' + ngayVN_(r.Ngay) + '" · ' + r.TrangThai, 'NhatKySanXuat ' + r._row, 'Sửa ô Ngay đúng ngày làm (yyyy-mm-dd), hoặc xóa dòng nếu nhập nhầm');
  });
  ['DiemDanhNghi', 'XacNhanDiemDanh'].forEach(function(t) {
    docAnToan_(t).forEach(function(r) { if (!coNgay(r.Ngay)) them(t + ': ngày không hợp lệ', (r.MaNV || r.MaXuong) + ' · "' + ngayVN_(r.Ngay) + '"', t + ' ' + r._row, 'Sửa ngày hoặc xóa dòng'); });
  });
  // 2. Tài khoản
  var tkDem = {};
  doc_('TaiKhoan').forEach(function(t) {
    var k = String(t.TenDangNhap).trim().toLowerCase(), vt = String(t.VaiTro).trim(), m = String(t.MaNV || '').trim();
    if (tkDem[k]) them('Tài khoản trùng tên đăng nhập', k + ' (trùng dòng ' + tkDem[k] + ')', 'TaiKhoan ' + t._row, 'Xóa dòng trùng (hệ thống chỉ dùng dòng trên cùng)'); else tkDem[k] = t._row;
    if (String(t.TrangThai).trim() !== 'Đang dùng') return;
    if (m && ns[m] && String(ns[m].TrangThai).trim() === 'Nghỉ việc') them('Tài khoản còn "Đang dùng" của người đã nghỉ việc', k, 'TaiKhoan ' + t._row, 'Đổi TrangThai thành Ngừng');
    if (vt === 'CN' && maQL[m]) them('Vai trò CN nhưng hồ sơ là trưởng/phó phòng (không bị nhắc/phạt, không vào bảng KPI)', k + ' · ' + (ns[m] ? ns[m].ChucDanh : ''), 'TaiKhoan ' + t._row, 'Sửa chức danh hoặc đổi tài khoản này sang Ngừng nếu đã có tài khoản TP/PP');
    if ((vt === 'CN' || vt === 'TP' || vt === 'PP') && m && !ns[m]) them('Tài khoản gắn mã NV không có trong NhanSu', k + ' → ' + m, 'TaiKhoan ' + t._row, 'Sửa ô MaNV');
  });
  // 3. Nhân sự / công đoạn
  Object.keys(ns).forEach(function(m) {
    var x = ns[m]; if (String(x.TrangThai).trim() === 'Nghỉ việc') return;
    if (!ngayVN_(x.NgayVaoLam)) them('Nhân sự thiếu ngày vào làm (không tính được học việc tháng đầu)', m + ' · ' + x.HoTen, 'NhanSu ' + x._row, 'Điền NgayVaoLam');
    String(x.CongDoanLamDuoc || '').split(',').map(function(s) { return s.trim(); }).filter(String).forEach(function(c) {
      if (!cd[c]) them('Công đoạn làm được không tồn tại', m + ' → ' + c, 'NhanSu ' + x._row, 'Bỏ mã này ở ô CongDoanLamDuoc');
      else if (String(cd[c].TrangThai).trim() === 'Ngừng') them('Công đoạn làm được đã Ngừng', m + ' → ' + c, 'NhanSu ' + x._row, 'Bỏ mã này hoặc gán công đoạn mới');
    });
  });
  Object.keys(cd).forEach(function(c) {
    if (String(cd[c].TrangThai).trim() !== 'Ngừng' && !(dm[c] > 0)) them('Công đoạn đang dùng chưa có định mức (hiệu suất tính 0)', c + ' · ' + cd[c].TenCD, 'CongDoan ' + cd[c]._row, 'Đặt định mức ở tab Công đoạn');
  });
  // 4. Sản lượng bất thường
  var cc = {}; docAnToan_('DiemDanhNghi').forEach(function(r) { cc[r.MaNV + '|' + ngayVN_(r.Ngay)] = khTuBanGhi_(r); });
  doc_('NhatKySanXuat').forEach(function(r) {
    if (String(r.TrangThai).trim() === 'Từ chối' || !coNgay(r.Ngay)) return;
    var ng = ngayVN_(r.Ngay), kh = cc[r.MaNV + '|' + ng], d = dm[String(r.MaCD).trim()], sl = Number(r.SoLuongLamRa);
    if (kh && gioCoMat_(kh) <= 0) them('Có sản lượng vào ngày chấm nghỉ cả ngày (sản lượng không vào hiệu suất)', r.MaNV + ' · ' + ng + ' · ' + kh + ' · ' + r.MaCD + ' SL ' + sl, 'NhatKySanXuat ' + r._row, 'Kiểm tra lại chấm công ngày đó');
    if (d > 0 && sl > d * 8 * 3) them('Sản lượng > 300% định mức 8 giờ (gõ thừa số 0? định mức sai?)', r.MaNV + ' · ' + ng + ' · ' + r.MaCD + ' · SL ' + sl + ' / định mức ' + d + '/giờ', 'NhatKySanXuat ' + r._row, 'Kiểm tra số lượng hoặc định mức');
    if (!(sl > 0)) them('Sản lượng bằng 0', r.MaNV + ' · ' + ng + ' · ' + r.MaCD, 'NhatKySanXuat ' + r._row, 'Xóa dòng hoặc sửa số');
  });
  // Ghi ra sheet
  var sh = ss_().getSheetByName('KiemTraDuLieu') || ss_().insertSheet('KiemTraDuLieu');
  sh.clear();
  var bang = [['Nhóm', 'Chi tiết', 'Dòng sheet', 'Cách sửa']].concat(L.length ? L : [['Không thấy vấn đề', '', '', '']]);
  sh.getRange(1, 1, bang.length, 4).setValues(bang.map(function(r) { return r.map(function(v) { return chuAnToan_(String(v)); }); }));
  sh.getRange(1, 1, 1, 4).setFontWeight('bold'); sh.setFrozenRows(1);
  Logger.log('Soát dữ liệu: ' + L.length + ' mục – xem sheet KiemTraDuLieu.');
  return L.length;
}
