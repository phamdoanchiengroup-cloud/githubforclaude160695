# KPI Sửa lỗi giao diện

Nhóm: KPI · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[Công cụ Claude]] · [[KPI Demo giao diện]] · [[00 Mục lục]]

- **Sửa lỗi giao diện (11/10)** = va-index.py **mục 18** `tests/sua-loi/va-sua-loi.py` (chạy cuối, sửa thẳng chuỗi gốc qua `_thay18` – có assert số chỗ): cỡ chữ CSS 10/10,5 → 11px, 11 → 12px, 11,5 → 12,5px (cả `font:<đậm> Npx`); placeholder #gate #8c8c8c, `--chu3` #939393, `--red` tối #f77e7e, bỏ vạch trái `.kpi::before` / `.hn-viec::before` / `.cn-formula`, bỏ chữ tô dải màu `.cn-h` / `.vuot-chu`, `pulseDot` tắt. Kiểm `../.claude/skills/impeccable/scripts/impeccable detect --json Index.html` còn 6 mục cố ý giữ: hiệu ứng màn đăng nhập đã duyệt (lkGoi, nảy, rhChay, đèn LED), sọc băng keo, font Inter. Bộ kỹ năng thiết kế Impeccable + Taste nằm ở `.claude/skills/`.
