# Chia việc giữa Claude và Qoder (chủ dự án chốt 15/11)

Mục đích: tiết kiệm token. **Qoder làm việc nhỏ, Claude làm việc lớn.**

| Qoder (trên máy anh/chị) | Claude |
|---|---|
| Sửa chữ, câu chữ, chính tả | Tính năng mới |
| Màu, cỡ chữ, khoảng cách, ẩn/hiện, đổi chỗ nút / cột | Công thức KPI, định mức, xếp loại, bậc ưu tiên đơn hàng, ngày dự kiến |
| Sửa lỗi hiển thị nhỏ (tràn chữ, lệch ô) | Ghi / đọc Google Sheet, quyền tài khoản, bảo mật |
| | Gộp phần Qoder sửa vào code gốc, kiểm thử, đẩy lên GitHub, cập nhật bộ não |

## Các bước cho mỗi việc nhỏ
1. Bấm đúp `2-CAP-NHAT.bat` trước (để thư mục có bản mới nhất).
2. Mở Qoder với thư mục **`C:\Users\<tên>\KPI-AppsScript\ma`** (file ở đây luôn là bản đang chạy trên web).
3. Dán **lời dặn bên dưới** + việc cần sửa vào Qoder.
4. Qoder sửa xong → **gửi Claude đúng file đã sửa** (thường là `Index.html`, `QuyTrinh.html` hoặc `Code.gs`), kèm 1 câu "đã sửa gì".
   **Đừng bấm `2-CAP-NHAT.bat` trước khi gửi** – bộ cài tải bản trên GitHub về và **ghi đè** phần Qoder vừa sửa.
5. Claude gộp vào code gốc, kiểm thử, đẩy lên → anh/chị bấm `2-CAP-NHAT.bat` → Ctrl+F5.

(Lý do phải gửi Claude: `Index.html`, `QuyTrinh.html`, `Code.gs` là file **sinh ra** từ mã gốc trong repo. Sửa thẳng mà không chuyển vào mã gốc thì lần cập nhật sau sẽ mất.)

## Lời dặn dán vào Qoder (chép nguyên khung này)
```
Đây là web KPI sản xuất (Google Apps Script): Code.gs (máy chủ), Index.html, QuyTrinh.html và các file .html khác (giao diện).
Quy tắc:
1. Chỉ sửa ĐÚNG việc tôi yêu cầu, sửa ít dòng nhất có thể. Không đổi tên hàm, tên biến, không sắp xếp lại / định dạng lại code, không xóa chú thích.
2. Không đụng: công thức tính (KPI, định mức, điểm, bậc ưu tiên, ngày dự kiến), phần đọc/ghi Google Sheet, kiểm tra quyền tài khoản, mật khẩu.
3. Mỗi chỗ sửa thêm chú thích ngắn ngay đó:  /* QODER dd/mm: <sửa gì> */  (trong HTML dùng <!-- QODER dd/mm: ... -->)
4. Giao diện phải xem tốt trên điện thoại (bề ngang 390px, không tràn ngang) và cả nền tối lẫn nền sáng.
5. Xong thì liệt kê: file nào, khoảng dòng nào, sửa gì.
Việc cần làm: <ghi việc ở đây>
```
