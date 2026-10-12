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
  try { return sach_({ ok: true, ten: ten, noiDung: HtmlService.createHtmlOutputFromFile(ten).getContent() }); }
  catch (e) { return sach_({ ok: false, msg: 'Chưa có file ' + ten + '.html trong Apps Script – dán thêm file này theo hướng dẫn.' }); }
}
