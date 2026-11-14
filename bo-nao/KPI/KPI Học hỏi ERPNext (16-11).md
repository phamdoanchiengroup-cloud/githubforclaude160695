# KPI Học hỏi ERPNext (16-11)

Liên quan: [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]] · [[KPI Phân tích định mức]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

Chủ dự án hỏi (16/11): nghiên cứu ERP (ERPNext, `frappe/erpnext`, 41k sao) xem phần nào áp dụng được cho web KPI. Claude đọc phân hệ sản xuất (`erpnext/manufacturing`: doctype + report).

## ERPNext có gì – web mình đã có tương đương
- Routing / Operation / BOM theo mã → Quy trình sản xuất, cấu hình bán thành phẩm từng mã, Cấu hình gậy.
- Work Order + Job Card (SL xong từng công đoạn, người làm, trạng thái) → tab Đơn hàng giao nhận theo bộ phận + nhật ký sản lượng công nhân.
- Corrective Job Card (làm lại) → cột "Hỏng cần làm bù".
- Production Plan / capacity → Công suất & deadline, Thử nhận đơn, Ngày dự kiến xong, bậc ưu tiên.
- Workstation + Plant Floor → Sơ đồ nhà máy, bảo trì máy. BOM operations time / variance → Phân tích định mức.

## Đề xuất học (chờ chủ dự án chọn)
1. **Báo cáo hàng hỏng + chi phí làm lại** (Process Loss Report + Cost of Poor Quality): từ cột Hỏng cần làm bù → tỷ lệ hỏng theo bộ phận / dòng gậy / vật liệu, quy ra giờ công làm lại theo định mức. Dữ liệu có sẵn.
2. **Hạn chuẩn từng bộ phận lùi từ deadline đơn** (Job Card expected start/end, scheduling): mỗi bộ phận có "hạn phải giao" gợi ý; hẹn trễ hơn → cảnh báo sớm. Cần số ngày chuẩn mỗi bộ phận (Claude ước từ dữ liệu, chủ dự án duyệt).
3. **Dự báo lượng đơn theo kênh** (Sales Forecast / Exponential Smoothing) → chuẩn bị công suất, phôi tháng tới.
4. (Sau) Nhu cầu phôi / vật tư theo đơn (MRP) – cần định mức vật tư từng mã.

## Không áp dụng
- Giờ dừng máy (Downtime Entry) – chủ dự án đã chốt **không làm A3** (18/10).
- Kiểm tra chất lượng KCS (Quality Inspection) – **chưa có KCS** (A5).
- Kế toán, kho nhiều vị trí, số lô / serial, đơn giá giờ máy: ngoài phạm vi web KPI.

## 16/11 – Chủ dự án chốt làm cả 3 phần + nghiên cứu BOM
- Trả lời: (1) làm cả 3; (2) báo cáo hỏng: TP/PP xem, mỗi người chỉ bộ phận mình, ban điều hành xem hết; (3) có email 8h báo bộ phận hẹn trễ hạn chuẩn; (4) đưa hỏng vào báo cáo tháng / PDF lãnh đạo; (5) nghiên cứu định mức nguyên vật liệu (BOM).
- Đã hỏi chuyên gia `quan-ly-van-hanh`. Góp ý chính:
  - Hỏng không có ngày → lưu hỏng vào bản chụp 9h, **hỏng phát sinh = max(0, nay − hôm trước)**, lưu lâu dài theo ngày. Giờ công làm lại = SL hỏng × Σ(8h ÷ định mức) các công đoạn từ đầu luồng tới bộ phận hỏng. Chỉ số: tỷ lệ hỏng = hỏng phát sinh ÷ SL giao; giờ công làm lại; Pareto bộ phận × dòng × vật liệu; xu hướng 3 tháng. Số hỏng do bộ phận tự khai → nên kiểm chéo.
  - Hạn chuẩn: lùi theo luồng từng mã, **ngày làm việc**; bảng số ngày chuẩn bộ phận × loại SKU do chủ duyệt (sau 2–3 tháng chỉnh theo thực tế); **một đệm chung trước Đóng gói** (1–2 ngày), không đệm từng bộ phận. Vàng = trễ hạn chuẩn trong đệm, đỏ = vượt đệm, đỏ đậm = trễ cả deadline; chưa hẹn mà còn ≤ 2 ngày tới hạn chuẩn cũng cảnh báo. Email chỉ dòng mới đỏ / vừa đổi, gom theo bộ phận.
  - Dự báo: trung bình trượt có trọng số 3 tháng (50/30/20) theo kênh, theo số SP từng loại SKU; khoảng thấp–cao; nhãn "tin cậy thấp" khi < 6 tháng; ghi sai số thực tế mỗi tháng. Tải = công cần (định mức) ÷ công có; > 85% vàng, > 100% đỏ.
  - BOM: chưa làm ngay; lộ trình: 5–8 vật tư chính, định mức tiêu hao theo nhóm SKU (loại × vật liệu) do tổ trưởng ước + kho kiểm, số xuất kho tháng; web tính nhu cầu (đơn mở + dự báo) và hao hụt.
  - Thứ tự: lưu hỏng vào bản chụp ngay → hạn chuẩn → báo cáo hỏng (khi có ~1 tháng số) → dự báo → BOM.
- **Đã làm (16/11)**: bản chụp 9h thêm cột 7 = 0 (dòng thường) + cột 8 = hỏng từng bộ phận; `dhChupMoi_`, `dhTinhHong_`, `dhGhiHong_` → sheet ẩn **DonHangHong** (Ngay, TuNgay, Khoa, BP, Moi, SL), chỉ tính khi cả 2 bản chụp là dạng mới. Kiểm thử giả lập 7/7.
- **Còn làm**: phần 2 (hạn chuẩn + email), phần 1 (báo cáo hỏng, quyền theo bộ phận, báo cáo tháng / PDF), phần 3 (dự báo), BOM (chờ dữ liệu vật tư).
