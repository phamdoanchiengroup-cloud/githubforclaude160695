# KPI Báo cáo tháng

Nhóm: KPI · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[KPI Cơm trưa]] · [[KPI Bảo mật và vận hành]] · [[00 Mục lục]]

- **Báo cáo tháng (05/10):** `tests/bao-cao.gs` (nối vào Code.gs bởi va-code.py) tạo PDF toàn nhà máy + từng xưởng, tự gửi sau chốt tháng (Drive + email theo sheet `NguoiNhanBaoCao`); web: khung "Báo cáo tháng" trên trang Bảng KPI (`khoiBaoCaoThang`, `taiBaoCaoUI` trong va-index.py; `call()` tự thêm TOKEN, đừng truyền lại). Kiểm thử `tests/bao-cao.js`. HTML báo cáo chỉ dùng bảng/màu nền (Apps Script đổi PDF không hỗ trợ flex/grid/SVG). Chủ dự án cần chạy `TAO_SHEET_NGUOI_NHAN_BAO_CAO` rồi `GUI_BAO_CAO_THANG_TRUOC` một lần để cấp quyền Drive/Gmail (HUONG-DAN Phần F).

## Báo cáo Phó Tổng Giám đốc – bản rút gọn (09/11)
- Chủ dự án: báo cáo lãnh đạo (PDF) đang dùng gửi **Giám đốc sản xuất**; cần thêm bản ngắn gửi **Phó Tổng Giám đốc** gồm các mục như file `bao-cao-2026-11.pdf` (7 mục + Định nghĩa) nhưng: (1) bỏ "Quyết định cần lãnh đạo duyệt", (2) thêm Nhân sự như bảng Thống kê › Nhân sự, (3) bỏ "Hàng đang chờ theo công đoạn". Chốt: nút riêng, giữ báo cáo cũ; ô ký đưa xuống cuối; Nhân sự ngay sau Tóm tắt điều hành.
- Làm (tests/quy-trinh/quy-trinh-web.html → QuyTrinh.html): nút **"📄 Báo cáo Phó TGĐ (rút gọn)"** cạnh "Mở bản PDF" (Đơn hàng › Báo cáo lãnh đạo). `dhBCPDF(1)` chốt số như cũ + gọi `layThongKe(tháng báo cáo)` → `dhBCPDFVe(w,{ptgd:1,ns})`. Số mục đánh tự động (`muc()`); bản PTGĐ: dòng "BẢN GỬI PHÓ TỔNG GIÁM ĐỐC", mục 2 **Nhân sự sản xuất** (`dhBCNhanSu`: Xưởng · Đang làm · TB đi làm / ngày (tháng) · Công nhân · Tổ trưởng · TP + PP · (CN + tổ trưởng) / quản lý · Tạm nghỉ + dòng Tổng), bỏ quyết định, bỏ sản lượng từng xưởng + Thống kê sản xuất + hàng chờ theo công đoạn, ô ký ở cuối. Bản cũ (Giám đốc sản xuất) không đổi.
- Thử trên bản xem thử: bản PTGĐ 5 trang (8 mục + Định nghĩa), bản cũ 11 trang. quy-trinh-web.js: 5 lỗi có sẵn từ trước, không lỗi mới.
