# Lần dán lên Apps Script

Nhóm: Chung · Cập nhật 21/10/2026
Liên quan: [[Việc chờ chủ dự án]] · [[KPI Tổng quan và cách dựng]] · [[00 Mục lục]]

## Web KPI – đã dán (theo sheet thật đọc ngày 21/10)
- Bản 18/10 đã lên: sheet thật có LichSuDinhMuc, HoiNhap, BoTriMay. Tên đăng nhập trùng, tài khoản người nghỉ việc, MaGhi thiếu đã được dọn.
- Lần dán chung 18/10: chủ dự án đã nhận đủ 5 file + hướng dẫn (HUONG-DAN-CAP-NHAT.md mục "LẦN DÁN CHUNG 18/10"). – [[KPI Bảo mật và vận hành]], [[KPI Âm thanh và giọng Rhino]]

## Web KPI – chưa dán
- **Bản sửa 21/10** (4 lỗi chủ dự án báo + rà soát đợt 2): chỉ `Code.gs` + `Index.html`; hướng dẫn ở HUONG-DAN-CAP-NHAT.md mục "BẢN SỬA 21/10". Sau khi dán, có thể chạy tay `KIEM_TRA_DU_LIEU` để soát sheet. – [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]
- **Sơ đồ 3D 21/10** (tầng 4 tòa điều hành, nút Toàn màn hình, Ẩn/Hiện chi tiết, mặc định chế độ Nhẹ): dán `SoDo` **kèm** `Index.html` – mã phiên bản của phần tải sau nằm trong Index.html, chỉ dán SoDo thì vẫn thấy bản cũ. Tên file trong Apps Script phải đúng "SoDo". – [[KPI Sơ đồ nhà máy 3D]], [[KPI Phần giao diện tải sau]]
- Hàm cần chạy một lần sau lần dán bảo mật (nếu chưa chạy): `KIEM_TRA_SAU_CAP_NHAT` (cấp quyền email), `BAT_BUOC_DOI_MAT_KHAU_MAC_DINH`. – [[KPI Bảo mật và vận hành]]


## Nhắc khi gửi file cho chủ dự án
- Nói rõ file nào cần dán, theo dạng "MỞ FILE X → xóa hết → dán bản mới", rồi Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai, Ctrl+F5.
- Nhắc sao lưu (Tổng quan → Tạo bản sao dự án) trước thay đổi lớn.
