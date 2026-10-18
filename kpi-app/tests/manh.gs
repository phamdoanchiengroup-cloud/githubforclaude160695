/* ================== PHẦN GIAO DIỆN TẢI SAU (12/10) ==================
   Tách khỏi Index.html cho trang nhẹ (mọi người, kể cả công nhân trên điện thoại, không phải tải phần mình không dùng).
   Mỗi phần là 1 file HTML riêng trong dự án Apps Script, chỉ gửi về trình duyệt khi cần:
   - SoDo:    tab "Sơ đồ nhà máy" (mặt bằng 2D + bản 3D) – chỉ các vai trò có tab này.
   - HoatAnh: dữ liệu hoạt ảnh Lottie – tải nền sau khi đăng nhập.
   Trình duyệt nhớ bản đã tải (localStorage, theo mã phiên bản) nên lần sau không tải lại. */
var MANH_GD = { SoDo: ['ADMIN', 'TP', 'TL', 'HR'], HoatAnh: null };
function layManhGiaoDien(token, ten) {
  var me = docPhien_(token);
  if (!me) return sach_({ ok: false, hetHan: true, msg: 'Phiên đăng nhập đã hết hạn.' });
  if (!Object.prototype.hasOwnProperty.call(MANH_GD, ten)) return sach_({ ok: false, msg: 'Không có phần giao diện này.' });
  var vt = MANH_GD[ten];
  if (vt && vt.indexOf(me.vaiTro) < 0 && vt.indexOf(me.vaiTroGoc) < 0) return sach_({ ok: false, msg: 'Tài khoản không xem được phần này.' });
  // Đọc nội dung thô (không kiểm tra cú pháp HTML – bản 3D rất dài, kiểm tra có thể báo lỗi dù file có thật); không được mới thử cách cũ
  var loi = '';
  try { return sach_({ ok: true, ten: ten, noiDung: HtmlService.createTemplateFromFile(ten).getRawContent() }); } catch (e) { loi = String(e && e.message || e); }
  try { return sach_({ ok: true, ten: ten, noiDung: HtmlService.createHtmlOutputFromFile(ten).getContent() }); } catch (e2) { loi = loi || String(e2 && e2.message || e2); }
  return sach_({ ok: false, msg: 'Không đọc được file ' + ten + ' trong Apps Script. Kiểm tra: tên file đúng "' + ten + '" (Apps Script tự thêm .html), đã Triển khai phiên bản mới sau khi thêm file. Lỗi Google báo: ' + loi });
}
