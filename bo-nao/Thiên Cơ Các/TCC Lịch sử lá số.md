# TCC Lịch sử lá số

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Kiểm thử]] · [[00 Mục lục]]

- **Lịch sử lá số (Code.gs):** trùng = cùng tài khoản + họ tên (bỏ hoa/thường, khoảng trắng) + giới tính + ngày dương + giờ + phút (`lsKhoa_`). `luuLichSu_` xóa bản cũ trùng trong 400 dòng gần nhất rồi ghi bản mới; `getLichSu` ẩn trùng; `donLichSu(token)` (nút "🧹 Dọn lá số trùng") xóa trùng cũ trong Sheet.
- `google.script.run` **không trả được Date**, ra null. Vì vậy lịch sử dùng `getDisplayValues` và ghi ngày có tiền tố `'`.
