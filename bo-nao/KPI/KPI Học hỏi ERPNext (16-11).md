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
