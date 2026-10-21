# KPI Báo cáo tháng

Nhóm: KPI · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[KPI Cơm trưa]] · [[KPI Bảo mật và vận hành]] · [[00 Mục lục]]

- **Báo cáo tháng (05/10):** `tests/bao-cao.gs` (nối vào Code.gs bởi va-code.py) tạo PDF toàn nhà máy + từng xưởng, tự gửi sau chốt tháng (Drive + email theo sheet `NguoiNhanBaoCao`); web: khung "Báo cáo tháng" trên trang Bảng KPI (`khoiBaoCaoThang`, `taiBaoCaoUI` trong va-index.py; `call()` tự thêm TOKEN, đừng truyền lại). Kiểm thử `tests/bao-cao.js`. HTML báo cáo chỉ dùng bảng/màu nền (Apps Script đổi PDF không hỗ trợ flex/grid/SVG). Chủ dự án cần chạy `TAO_SHEET_NGUOI_NHAN_BAO_CAO` rồi `GUI_BAO_CAO_THANG_TRUOC` một lần để cấp quyền Drive/Gmail (HUONG-DAN Phần F).
