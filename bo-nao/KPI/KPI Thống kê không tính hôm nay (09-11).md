# KPI Thống kê không tính hôm nay (09-11)

Liên quan: [[KPI Quy trình sản xuất]] · [[KPI Điều phối sản xuất (08-11)]] · [[KPI Tổng quan chủ sở hữu và tab Nhân sự (08-11)]] · [[KPI Kiểm thử]] · [[00 Mục lục]]

## Yêu cầu (09/11)
- Chủ dự án: mọi số thống kê (KPI xưởng, KPI cá nhân, tab Thống kê, biểu đồ, lưu đồ…) **không tính ngày đang làm việc** vì làm sai lệch. Chọn: **tính tới hết hôm qua**; phạm vi: tab Thống kê + biểu đồ, KPI (xưởng + cá nhân), Tổng quan + Điều phối + Lưu đồ. **Không** chọn báo cáo / email (nhưng báo cáo dùng chung số đóng gói theo ngày nên cũng tới hết hôm qua).
- Giữ nguyên vận hành trong ngày: điểm danh, nhập / duyệt sản lượng, cơm, sĩ số hôm nay, việc cần làm.
- Kèm: Thống kê › Sản lượng từng xưởng – **bấm ô / biểu đồ cột của xưởng → cửa sổ nổi to** (`dhPhongXuong`, biểu đồ khổ lớn + số từng ngày, Esc / ✕ / bấm nền để đóng).

## Đã sửa
- Máy chủ `tests/bo-hom-nay/va-bo-hom-nay.py` (cuối va-code.py): `kpiThang_` bỏ ngày ≥ hôm nay (ngày công + vi phạm) → Bảng KPI, KPI tất cả xưởng, KPI cá nhân, KPI máy; `tkNgayLam_` tới hết hôm qua; `layThongKe` bỏ chấm công / KCS / nhật ký / nhập trễ / vi phạm hôm nay, khóa nhớ tạm `TK_v2_<tháng>_<ngày>`; `layDongGoiNgay` + `layQuyTrinh`: `den` = hôm qua. Điều phối (`dpTinh_`) vốn đã tính tới hôm qua.
- Web: Index mục 43 (`tests/bo-hom-nay/va-bo-hom-nay-web.py`) – `kpiThangNay_` bỏ hôm nay, ghi chú "tới hết hôm qua" ở Bảng KPI; QuyTrinh (nguồn `tests/quy-trinh/quy-trinh-web.html`): `dhNgayLamGanNhat` mặc định tới hôm qua, `dhDGThang` ngày làm đã qua = trước hôm nay, báo cáo tháng `kd < hôm nay`, ghi chú Thống kê + tiêu đề Sản lượng từng xưởng "tới hết dd/mm, không tính hôm nay".

## Kiểm thử
- `tests/bo-hom-nay.js` 7/7 (thêm 30 dòng nhật ký hôm nay 99.999 sp → KPI, Thống kê, sản lượng xưởng, lưu đồ không đổi; thêm số 07/11 → đổi).
- `tests/bo-hom-nay-web.js` 14/14 (máy tính + điện thoại: tới hết hôm qua, cửa sổ nổi, Esc / ✕, KPI tạm tính trình duyệt).
- quy-trinh-web: 5 lỗi **có sẵn từ trước** (chạy bản b5371b2 cũng y hệt) – mục tiêu % theo cài đặt đã lưu, "chưa tải giao diện", "quy trình còn nháp".

## 15/11 – chủ dự án nhắc lại (sót Tổng quan TP/PP + ban điều hành)
- Rà lại: Thống kê, KPI (Bảng KPI, KPI tạm tính trình duyệt `kpi()` → `kpiThangNay_`), lưu đồ, Điều phối, Tổng quan chủ sở hữu (`tqNgayLam` = ngày làm trước) đã tới hết hôm qua từ 09/11.
- **Còn sót**: `vDash` gốc (Tổng quan TP/PP, ADMIN) – ô Hiệu suất / Tỷ lệ đạt / Sản lượng, So sánh hiệu suất xưởng, Xu hướng hiệu suất dùng cả nhật ký hôm nay. Sửa trong mục 43 (`va-bo-hom-nay-web.py`): `var NK = D.nhatky` lọc `Ngay < today()`, ghi chú "tính tới hết hôm qua". Khối "chưa nhập sản lượng hôm nay" giữ nguyên (vận hành trong ngày).
