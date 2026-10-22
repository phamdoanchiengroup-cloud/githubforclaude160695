# KPI Thang xếp loại

Nhóm: KPI · Cập nhật 22/10/2026
Liên quan: [[KPI Tổng quan và cách dựng]] · [[KPI Báo cáo tháng]] · [[KPI Âm thanh và giọng Rhino]] · [[Quyết định của chủ dự án]]

## Thang hiện hành (chủ dự án 22/10)
- **S ≥ 95 · A+ ≥ 90 · A ≥ 85 · B ≥ 80 · C ≥ 70 · D < 70** (mốc tính "từ … trở lên").
- Thang cũ: A+ ≥ 100, A ≥ 90, B ≥ 80, C ≥ 70, D < 70.

## Đã sửa (mục vá `kpi-app/tests/xep-loai/`)
- Máy chủ `va-xep-loai.py` (cuối va-code.py): `loaiKPI_`, báo cáo tháng `BC_LOAI` thêm S (màu `#5b3fa8`), "Tỷ lệ xếp loại S/A+/A" (`tlTot`), chú thích thang, thanh phân loại S → D.
- Web `va-xep-loai-web.py` (va-index.py mục 29, trước mục 27): `loai()`, `loaiFE()`, ô KPI cá nhân của TP, bảng "Thang xếp loại" trong hướng dẫn CN, chú thích KPI quản lý, lời Rhino theo hạng (A+ → "còn x% lên S"), thứ tự lên hạng (pháo giấy) có S, giọng `lS` "loại S.".
- Sơ đồ: `tests/so-do/so-do-chung.js` `o.hang` + chú giải màu (S / A+ ≥ 90, A / B 80–90).
- Giọng: `tests/am-thanh/tao-giong.py` thêm `lS`; thu riêng mảnh này (edge-tts cần `proxy=HTTPS_PROXY` trong sandbox) rồi gộp vào `giong-web.json` → `AmThanh.html` đổi.
- Tháng đã chốt giữ loại đã lưu trong `KPIThang` (thang cũ); muốn đổi thì Chốt bù tháng đó.

## Kiểm thử
- `tests/xep-loai.js` 10 (DATA=): mốc từng loại ở máy chủ / web / sơ đồ, bảng KPI tháng 10 khớp (158 người, 23 hạng S), AmThanh có `lS`.
