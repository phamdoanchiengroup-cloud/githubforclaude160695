# KPI Bảng KPI tất cả xưởng

Nhóm: KPI · Cập nhật 24/10/2026
Liên quan: [[KPI Tăng tốc đợt 2 (21-10)]] · [[KPI Chia đôi màn hình]] · [[KPI Kiểm thử]] · [[KPI Hologram chủ sở hữu]]

## Chủ dự án yêu cầu 24/10
- Tab Bảng KPI của ban điều hành và chủ sở hữu: mặc định tải KPI tất cả các xưởng, không phải chọn xưởng.
- Không chờ tải hết mới hiện: xưởng nào xong trước thì hiện bảng xưởng đó luôn.

## Làm (Index mục 35: `kpi-app/tests/kpi-tat-ca/kpi-tat-ca.js` + `va-kpi-tat-ca.py`, trước mục 27)
- Ô Xưởng: "— Tất cả xưởng —" thay cho "— Chọn xưởng —".
- `taiKPIKy` được bọc lại. Khi ADMIN chưa chọn xưởng:
  - Tạo mỗi xưởng một ô `.kpi-tc` và gọi `layKPIKy` riêng từng xưởng, tối đa 3 lượt cùng lúc (đỡ dồn Apps Script).
  - Mỗi xưởng vẽ bằng `veBangKPI` gốc vào ô riêng: đổi tạm id `kpi_bang`.
  - `window.__kpiR` gộp số các xưởng đã tải, để khung chia đôi tra chi tiết theo mã NV.
- Bỏ kết quả cũ khi đổi kỳ / xưởng / tab (biến đếm `KPI_TC.luot`). Mỗi xưởng chờ tối đa 45 giây thì báo lỗi riêng ô đó.
- Chọn 1 xưởng cụ thể thì như cũ. Trưởng phòng không đổi.

## Kiểm thử
- `tests/kpi-tat-ca-web.js`: 17.
  - chienpham và giamdoc: 9 ô; xưởng đầu tiên hiện khi 8 ô còn chờ.
  - Số người gộp = số dòng; Chi tiết mở được; chọn 1 xưởng còn 1 bảng.
  - Bấm sao hologram ra đúng 1 bảng; trưởng phòng không đổi.
