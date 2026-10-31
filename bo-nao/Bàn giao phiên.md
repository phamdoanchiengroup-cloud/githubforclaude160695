# Bàn giao phiên

Nhóm: Chung · Cập nhật 31/10/2026
Liên quan: [[00 Mục lục]] · [[Liên kết và công cụ]] · [[Việc chờ chủ dự án]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]] · [[KPI Kiểm thử]]

Ghi chú này để phiên Claude Code mới nắm bối cảnh ngay. Đọc `CLAUDE.md`, rồi ghi chú này, rồi [[Liên kết và công cụ]] (mọi link Drive, repo, artifact, công cụ), rồi [[00 Mục lục]].

## Trạng thái nhánh (25/10)
- Mọi việc đã commit và push lên `claude/beautiful-ptolemy-f2j7za`. Commit cuối: "ảnh web lấy từ repo qua jsDelivr" (25/10).
- Nhánh tạm `claude/beautiful-ptolemy-f2j7za-dang-lam` đã gộp hết vào nhánh chính, không còn dùng.
- Chủ dự án cập nhật web bằng bộ cài clasp: bấm đúp `2-CAP-NHAT.bat` rồi Ctrl+F5. Bộ cài nằm ở `kpi-app/cai-dat-clasp/`; lần gần nhất đã gửi lại bản zip ngày 24/10. Chưa biết chủ dự án đã cập nhật các đợt 24–25/10 lên web hay chưa.

## Việc đã làm 22–25/10 (chi tiết ở từng ghi chú)
- [[KPI Kỹ năng]]: tab mới, ma trận 4 cấp.
- [[KPI Hologram chủ sở hữu]]: giao diện riêng cho chủ sở hữu. Ngày 25/10 sửa lỗi menu điện thoại bị lớp nền tối che.
- [[KPI Bảng KPI tất cả xưởng]], [[KPI Phân tích định mức]] (tự chạy tháng hiện tại), [[KPI Cơm trưa]] (nhắc TP/PP số người chưa báo).
- [[KPI Sơ đồ nhà máy 3D]]:
  - Bỏ KPI / sĩ số ở cả 2D và 3D.
  - 2D dùng 3 ảnh mặt bằng chủ dự án gửi (đã nắn), thêm nút "Tách tầng" có chú thích xưởng, có đèn ban đêm.
  - Bản dọc đã thử rồi bỏ: chủ dự án muốn giữ bản ngang.
- [[KPI Màn đăng nhập Khắc laser]]: nền ảnh nhà máy ban đêm, thẻ nhân viên vân carbon được laser khắc mã và tên.
- [[KPI Ảnh web qua jsDelivr]]: 25/10 ảnh nền đăng nhập + mặt bằng sơ đồ lấy từ repo (công khai) qua jsDelivr, ghim commit; Claude tự làm, không cần Drive.

## Đang làm (31/10)
- [[KPI Quy trình sản xuất]]: tab mới gộp Kỹ năng.
  - Đã chốt phương án C, chỉ chủ sở hữu xem.
  - Đã đọc 2 file chủ dự án gửi (danh mục mã hàng, trạng thái đơn hàng). Tiền tố mã cho biết chặng BTP; hàng còn thiếu ~12.000, giao ~250/ngày.
  - Chưa code. Chờ chủ dự án xác nhận bảng tiền tố và các con số còn thiếu.

## Còn chờ / gợi ý
- 25/10: chủ dự án trả lời 4 câu (xem [[Quyết định của chủ dự án]] mục "KPI và định mức (25/10)"); đã sửa khoản "không nhắc" (chỉ Code.gs, chưa dán). Còn chờ: chủ dự án tự sửa Cân Phôi về 180 trên web; nội dung video giới thiệu.
- Hỏi chủ dự án: có cho chú tê giác Rhino và khung lời chào tự ẩn khi mở menu trên điện thoại không (hiện chúng đè lên cuối menu)? Chưa trả lời.
- Sơ đồ 3D đẹp như ảnh mẫu: chưa chọn. Xem [[Việc chờ chủ dự án]].
- Lỗi kiểm thử có từ trước, không phải do các lần sửa gần đây:
  - `mai-web.js` 31/32 (mục "lúc 10:05").
  - `com-trua-web.js` (viết cho dữ liệu ngày 12/10).
- Phần 3D của `so-do-web.js` chạy chậm (khoảng 10 phút với swiftshader). Phần 2D chạy được riêng, không cần `THREE=`.

## Mẹo môi trường
- Bản xem thử:
  - Dựng: `DATA=$S/dl4/csdl.json OUT=$S/xt-v.html GIO=2026-10-22T17:00:00+07:00 BO_HO_SO=1 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js`.
  - `$S` là scratchpad. Phiên mới tự lấy lại `csdl.json` từ Sheet CSDL KPI qua kết nối Google Drive (cách làm ở [[Liên kết và công cụ]]). Dữ liệu này **không commit**.
- Chromium trong sandbox không tin CA của proxy nên ảnh ngoài (jsDelivr) không hiện khi chụp thử: thay link bằng ảnh nhúng nếu cần chụp.
- Đừng chạy `pkill -f <tên>` trong cùng lệnh có chứa tên đó: nó tự giết chính shell của lệnh.
