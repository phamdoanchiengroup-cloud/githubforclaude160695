# KPI Nhân sự theo chấm công

Nhóm: KPI · Cập nhật 03/11/2026
Liên quan: [[KPI Quy trình sản xuất]] · [[Liên kết và công cụ]] · [[Quyết định của chủ dự án]] · [[Lần dán lên Apps Script]]

## Nguồn
- 03/11 chủ dự án đưa 12 ảnh bảng chấm công tháng 10/2026 lên Drive (thư mục `1sj-7VartwovgM1YMweWBc1DLxJBj9Irt`, "D:\KPI Carbon\chamcong" trên máy chủ dự án). Claude chép tay 246 người (mã, tên, bộ phận / nhóm, ngày onboard, tổng công, in đậm = quản lý) vào scratchpad `cc/cc1.tsv` (có thông tin cá nhân – **không commit**).
- Phiên đám mây không có kết nối Google Sheets (chỉ Drive) nên không sửa thẳng sheet được → hàm chạy một lần.

## Đối chiếu với NhanSu (bản xuất trong phiên)
- 9 xưởng: chấm công Phôi Carbon 38 / web 32, Phôi Thô 30 / 28, Hoàn thiện 24 / 23, Ngọn Tip 13 / 12 … (chênh do người nghỉ trong tháng và mã sai).
- **6 người sai mã** (web dùng mã tạm): C000→C020, C992→C732, C886→C733, C998→C744, C996→C745, C999→C747. **1 người thiếu**: C759 (HT).
- 11 người web ghi Nghỉ việc / Tạm nghỉ nhưng có công tháng 10 (nghỉ giữa tháng; C685 chuyển sang Kho) – chủ dự án bảo **bỏ qua**.
- 34 ngày vào làm sai / trống, 10 tên khác (dấu thuỳ/thùy, Khuyển/Khuyến, Hoai/Hoài…), 4 chức danh lệch in đậm – chức danh **bỏ qua**.
- 4 bộ phận chưa có trên web: Kho 10, Bếp + tạp vụ 14, Ban điều hành 8 (= chủ dự án + tài khoản admin + trợ lý BĐH), Xưởng May 22. C043: chấm công ở BĐH, web ở HT – 03/11 chủ dự án xác nhận là trưởng phòng Hoàn thiện, **giữ ở HT**; `layNhanSuNgoaiSX` bỏ người đang làm ở 9 xưởng khỏi danh sách ngoài SX (còn 53). Kho Hà Nội chỉ có 1 người (đúng).
- File gửi chủ dự án: `scratchpad/cc/Doi-chieu-cham-cong-T10.xlsx` (8 sheet).

## Sửa (chủ dự án chọn 03/11)
- Sửa: ngày vào làm, tên, mã nhân viên, người thiếu. Mã đổi → **tên đăng nhập đổi theo mã mới, giữ mật khẩu**.
- 2 file Drive (của chủ dự án, có dữ liệu cá nhân): "KPI - Sửa nhân sự theo chấm công T10" `1MwEdEj5XELPcjEhLd3BZz-3Tcs4rbQR01KD9hFnor3g` (Loai DOI_MA / TEN / NGAY_VAO / THEM), "KPI - Bộ phận ngoài sản xuất" `1KAbgfq0QMZNmFeyF7VWFcEwjWM-ADK4sRR8FghUAcgk`.
- Mã nguồn `kpi-app/tests/nhan-su/nhan-su-ngoai-sx.gs` (nối vào Code.gs bằng `va-code.py`): `SUA_NHAN_SU_THEO_CHAM_CONG` (chỉ chạy trong trình soạn thảo – `noiBo_`; đổi mã trước rồi tên / ngày / thêm; đổi mã ở mọi sheet có cột MaNV / TenDangNhap trừ NhatKyThaoTac; thêm người + tài khoản CN (không ghi mật khẩu – chủ dự án bấm "Cấp lại mật khẩu"); chặn mã trống / lạ, đổi nối chuỗi, mã mới đã có ở sheet khác; khóa khoa_; chạy lại không đổi gì thêm), `nhapNhanSuNgoaiSX_` (chép vào sheet **NhanSuNgoaiSX**), `layNhanSuNgoaiSX` (chỉ chủ sở hữu).
- Web (`tests/nhan-su/va-nhan-su-web.py`, mục 37): khối "Bộ phận ngoài sản xuất" cuối tab Nhân sự, chỉ chủ sở hữu; nhóm Ban điều hành → Kho → Bếp + tạp vụ → Xưởng May, có dòng tổng. Sheet riêng nên không vào KPI, điểm danh, cơm trưa, lưu đồ 9 xưởng.
- Kiểm thử `tests/nhan-su-cham-cong.js` 19/19 (chuyên gia `bao-mat-ung-dung` soát: 7 rủi ro, đã sửa) (cần SUA= NGOAI= csv ở scratchpad); giả lập thêm `getSheets`, `clearContents`.
