# Trợ lý KPI – hướng dẫn cài đặt (khoảng 10 phút)

Trợ lý chạy thành **một dự án Apps Script riêng**. Nó chỉ **đọc** file "CSDL KPI", không sửa web app KPI đang dùng.
Nó không đọc ra hay gửi đi số CCCD, điện thoại, địa chỉ, lương.

## Bước 1. Tạo dự án mới
1. Mở https://script.google.com → **Dự án mới**.
2. Bấm vào chữ "Dự án không có tiêu đề" ở góc trên trái, đổi tên thành **Trợ lý KPI**.
3. Mở file `Mã.gs` → **xóa hết** → dán toàn bộ nội dung file `TroLyKPI.gs` → bấm 💾 Lưu.

## Bước 2. Nhập token Zalo (không gửi token cho ai, kể cả Claude)
1. Bấm ⚙️ **Cài đặt dự án** (thanh bên trái).
2. Kéo xuống **Thuộc tính tập lệnh** → **Thêm thuộc tính tập lệnh**.
   - Thuộc tính: `ZALO_TOKEN`
   - Giá trị: dán token bot Zalo
3. Bấm **Lưu thuộc tính tập lệnh**.

## Bước 3. Triển khai thành ứng dụng web (để Zalo gửi tin nhắn vào được)
1. Bấm **Triển khai** → **Tùy chọn triển khai mới**.
2. Bấm ⚙️ cạnh "Chọn loại" → chọn **Ứng dụng web**.
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**. Đừng lo: chỉ Zalo mới có mã khóa bí mật, và bot chỉ trả lời Zalo của bạn.
3. Bấm **Triển khai** → **Cấp quyền truy cập** → chọn tài khoản Google của bạn.
   - Nếu hiện "Google chưa xác minh ứng dụng này": bấm **Nâng cao** → **Đi tới Trợ lý KPI** → **Cho phép**.
4. **Sao chép URL ứng dụng web** (đuôi `/exec`).
5. Quay lại ⚙️ **Cài đặt dự án** → thêm thuộc tính `WEBAPP_URL`, giá trị là URL vừa chép → Lưu.

## Bước 4. Chạy cài đặt
1. Quay lại trang mã (biểu tượng `< >`).
2. Trên thanh công cụ, ô chọn hàm → chọn **caiDat** → bấm ▶ **Chạy**.
3. Xem **Nhật ký thực thi** ở dưới. Sẽ có dòng: `👉 Mở Zalo, nhắn cho bot đúng dòng này: ketnoi 123456`.
4. Mở Zalo → vào **Bot Trợ lý KPI** → nhắn đúng `ketnoi 123456` (số của bạn).
5. Bot trả lời "✅ Đã kết nối!" là xong.

## Dùng hằng ngày
- **7 giờ sáng** bot tự gửi bản tin ngày làm việc gần nhất. Chủ nhật không gửi lặp lại bản tin thứ Bảy.
- Nhắn cho bot:
  - `bc` → bản tin ngày gần nhất
  - `bc 10/10` → bản tin ngày 10/10
  - `tuần` → tổng kết 7 ngày
  - `giúp` → hướng dẫn
- Muốn thử ngay: trong trình soạn thảo, chọn hàm **thuGuiBanTin** → ▶ Chạy.

## Khi cập nhật bản mới
1. Mở file mã → xóa hết → dán bản mới → 💾 Lưu.
2. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.** URL giữ nguyên, không cần chạy lại `caiDat`.

## Cách tính
- Chỉ tính các dòng `NhatKySanXuat` có TrangThai = **Đã duyệt**. Dòng "Từ chối" bị bỏ. Các trạng thái khác được đếm là "chờ duyệt".
  - Muốn xem các trạng thái đang có: chạy hàm **xemTrangThai**.
- **% đạt định mức** = giờ chuẩn ÷ giờ làm. Giờ chuẩn = số lượng ÷ định mức/giờ của công đoạn, lấy định mức đang hiệu lực vào ngày đó.
  - Công đoạn chưa có định mức không tính vào %, nhưng vẫn tính giờ làm.
- ▲▼ là chênh lệch so với trung bình 14 ngày trước đó (bản tin ngày), hoặc so với 7 ngày trước đó (bản tin tuần).
- Cách tính này **có thể khác một chút** với điểm KPI tháng của web app (`KPIThang` còn tính chất lượng, tuân thủ, an toàn). Nếu thấy lệch nhiều, báo Claude để chỉnh.

## Gỡ lỗi
- Bot không trả lời:
  - Kiểm tra Bước 3 đã chọn **Bất kỳ ai**.
  - Kiểm tra `WEBAPP_URL` có đuôi `/exec`.
  - Chạy lại **caiDat**.
- Nếu lỡ để lộ token: vào Zalo Bot Creator (https://zalo.me/s/botcreator/) tạo token mới → sửa `ZALO_TOKEN` → chạy lại **caiDat**.
- Kiểm thử trên máy (dành cho Claude): `node tests/tro-ly.js`.
