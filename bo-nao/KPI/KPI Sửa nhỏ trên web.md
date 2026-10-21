# KPI Sửa nhỏ trên web

Nhóm: KPI · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[KPI Tổng quan và cách dựng]] · [[00 Mục lục]]

- **Bỏ thẻ "KPI Quản lý (Trưởng/Phó phòng)" ở tab Bảng KPI của ban điều hành (13/10)** = va-index.py **mục 21** (`kpiql_khoi` + `napKPIQuanLyKhoi` chỉ còn cho TP ở tab "KPI phòng", vì TP không có tab KPI Quản lý riêng).
- **Cột Ngày trong thẻ "Chờ chốt" (09/10, đã vá vào Index.html):** va-index.py mục 13 sửa `renderDraft` – gom theo `MaNV|Ngay`, cột Ngày (dd/mm + thứ), ngày ≠ hôm nay tô `--amber` + "không phải hôm nay", nhiều ngày thì cảnh báo. Kiểm thử `tests/cho-chot-ngay.js` (16, `F=<bản xem thử>`). Dòng "Tổng" trong thẻ này vẫn hiện "–" cho SL/Lỗi như bản gốc (chưa hỏi chủ dự án có muốn cộng không).
