# Lần dán lên Apps Script

Nhóm: Chung · Cập nhật 21/10/2026
Liên quan: [[Việc chờ chủ dự án]] · [[KPI Tổng quan và cách dựng]] · [[00 Mục lục]]

## Web KPI – đã dán (theo sheet thật đọc ngày 21/10)
- Bản 18/10 đã lên: sheet thật có LichSuDinhMuc, HoiNhap, BoTriMay. Tên đăng nhập trùng, tài khoản người nghỉ việc, MaGhi thiếu đã được dọn.
- Lần dán chung 18/10: chủ dự án đã nhận đủ 5 file + hướng dẫn (HUONG-DAN-CAP-NHAT.md mục "LẦN DÁN CHUNG 18/10"). – [[KPI Bảo mật và vận hành]], [[KPI Âm thanh và giọng Rhino]]

## Web KPI – chưa dán
- **Bản sửa 21/10** (4 lỗi chủ dự án báo + rà soát đợt 2): chỉ `Code.gs` + `Index.html`; hướng dẫn ở HUONG-DAN-CAP-NHAT.md mục "BẢN SỬA 21/10". Sau khi dán, có thể chạy tay `KIEM_TRA_DU_LIEU` để soát sheet. – [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]
- **Tăng tốc 21/10** (đăng nhập nhẹ một nửa, bảng KPI / KPI quản lý giữ bộ nhớ tạm + làm nóng): cùng `Code.gs` + `Index.html` của bản sửa 21/10; sau khi dán chạy một lần `CAI_TRIGGER_LAM_NONG_KPI`, và `KIEM_TRA_SHEETS_API` nếu chưa bật Sheets API. Hướng dẫn: HUONG-DAN-CAP-NHAT.md mục "TĂNG TỐC 21/10". – [[KPI Tăng tốc đợt 2 (21-10)]]
- **Phân tích định mức 21/10** (gợi ý nâng định mức lỏng về 85%, không hạ, đổi định mức áp cả tháng kể cả tháng đã chốt): `Code.gs` + `Index.html` bản mới nhất; sau khi dán chạy một lần `AP_DINH_MUC_CA_THANG`. Hướng dẫn: HUONG-DAN-CAP-NHAT.md mục "PHÂN TÍCH ĐỊNH MỨC 21/10". – [[KPI Phân tích định mức]]
- **Hồ sơ bắt buộc (22/10)**: Code.gs + Index.html (clasp). – [[KPI Hồ sơ bắt buộc]]
- **Mốc định mức người khá = 90% (22/10 tối)**: Code.gs + Index.html (clasp). – [[KPI Phân tích định mức]]
- **Trung vị bỏ người học việc 22/10**: Code.gs + Index.html (clasp). – [[KPI Phân tích định mức]]
- **Đèn xưởng ban đêm trong sơ đồ 3D 23/10**: SoDo.html + Index.html (clasp, đẩy cùng lúc). – [[KPI Sơ đồ nhà máy 3D]]
- **Hologram cho chủ sở hữu 23/10**: chỉ Index.html (clasp). – [[KPI Hologram chủ sở hữu]]
- **Kỹ năng 22/10** (tab mới, đợt 1: danh mục + duyệt, ma trận 4 cấp, Kỹ năng của tôi): Code.gs + Index.html (clasp). – [[KPI Kỹ năng]]
- **Sửa KPI trình duyệt + bỏ nhắc Chốt bù 22/10**: Code.gs + Index.html (clasp: `2-CAP-NHAT.bat`). – [[KPI Soát đổi định mức 22-10]]
- **Thang xếp loại 22/10** (S/A+/A/B/C/D): đổi cả 5 file (Code, Index, SoDo, AmThanh; HoatAnh không đổi) – chủ dự án đã có clasp nên chỉ cần bấm `2-CAP-NHAT.bat`. – [[KPI Thang xếp loại]]
- **Chia đôi màn hình 21/10** (Bảng KPI, Nhân sự, KPI quản lý): chỉ `Index.html` bản mới nhất. – [[KPI Chia đôi màn hình]]
- **Sơ đồ 3D 21/10** (tầng 4 tòa điều hành, nút Toàn màn hình, Ẩn/Hiện chi tiết, mặc định chế độ Nhẹ): dán `SoDo` **kèm** `Index.html` – mã phiên bản của phần tải sau nằm trong Index.html, chỉ dán SoDo thì vẫn thấy bản cũ. Tên file trong Apps Script phải đúng "SoDo". – [[KPI Sơ đồ nhà máy 3D]], [[KPI Phần giao diện tải sau]]
- Hàm cần chạy một lần sau lần dán bảo mật (nếu chưa chạy): `KIEM_TRA_SAU_CAP_NHAT` (cấp quyền email), `BAT_BUOC_DOI_MAT_KHAU_MAC_DINH`. – [[KPI Bảo mật và vận hành]]


## Cách dán
- **22/10 chủ dự án đã cài xong clasp** (lần đầu bấm .bat ngay trong ZIP → lỗi "-File không tồn tại"; đã thêm kiểm tra vào .bat). Từ nay cập nhật = bấm đúp `2-CAP-NHAT.bat`, nhớ push lên nhánh trước.
- Từ 21/10 có bộ cài clasp (`kpi-app/cai-dat-clasp/`): cài xong thì mỗi lần cập nhật chỉ bấm đúp `2-CAP-NHAT.bat` (tự sao lưu, tự đẩy 5 file, tự triển khai giữ link). Chưa biết chủ dự án đã cài chưa. – [[KPI Cập nhật bằng clasp]]

## Nhắc khi gửi file cho chủ dự án
- Nói rõ file nào cần dán, theo dạng "MỞ FILE X → xóa hết → dán bản mới", rồi Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai, Ctrl+F5.
- Nhắc sao lưu (Tổng quan → Tạo bản sao dự án) trước thay đổi lớn.
