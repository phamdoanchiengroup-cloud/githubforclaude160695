# KPI Bóng đá

Nhóm: KPI · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[Quyết định của chủ dự án]] · [[00 Mục lục]]

- **Dải thông báo giải bóng đá (13/10)** = va-index.py **mục 20** `tests/bong-da/va-bong-da.{py,css,js}` + máy chủ `tests/bong-da.gs` (nối cuối Code.gs). Chủ dự án: KHÔNG làm tab riêng, chỉ vài thông tin hưởng ứng. `layBongDa(token)` đọc sheet web giải `BD_SHEET_ID` ("Web đá bóng 2026" trên Drive chủ dự án) – chỉ TEN_GIAI trong CauHinh (sheet đó có mật khẩu BTC dạng chữ thường, đã khuyên chủ dự án đổi), Doi, TranDau; nhớ tạm 10 phút (`bd_v2`; `link` luôn lấy mới từ `BD_LINK`, không theo bản nhớ tạm). `#bdbar` dưới `#combar`, mọi tài khoản: hiện từ 7 ngày trước trận (`BD_TRUOC`, chủ dự án 13/10; chỉ các trận của ngày thi đấu gần nhất, kèm "còn N ngày") hoặc kết quả hôm nay/hôm qua; × ẩn tới trận sau (`kpi_bd_tat` = giờ trận); `BD.gio` để giả lập giờ; `BD_LINK` = link web giải (chủ dự án gửi 13/10). Kiểm thử `tests/bong-da.js` (19, `DATA=` + `F=`).
