# KPI Hologram chủ sở hữu

Nhóm: KPI · Cập nhật 23/10/2026
Liên quan: [[KPI Demo giao diện]] · [[KPI Kiểm thử]] · [[Quyết định của chủ dự án]] · [[KPI Cập nhật bằng clasp]]

## Chủ dự án yêu cầu 23/10
- "Chỉ muốn áp dụng hologram vào giao diện của tài khoản chủ sở hữu" (sau khi xem kiểu 5 "Hologram vũ trụ" trong `kpi-app/demo-giao-dien-doc-dao.html`).
- Chốt qua câu hỏi: **cả web + Tổng quan**; chuyển động **mặc định bật, có nút tắt**. 5 ảnh vòng hoàng đạo / bát quái gửi kèm là **gửi nhầm, bỏ qua**.

## Làm (Index mục 34: `kpi-app/tests/holo/holo-web.js` + `va-holo-web.py`, trước mục 27)
- Chỉ chạy khi `ME.laOwner`. Mọi tài khoản khác giữ nguyên giao diện.
- **Lớp áo** `html.holo`:
  - Đổi biến màu: nền vũ trụ, `.card` kính viền xanh phát sáng. Phải dùng `!important` vì CSS gốc dòng 802–803 có `!important`.
  - Header và thanh menu mờ kính, mục đang chọn có vạch vàng, tiêu đề dùng font Exo 2 (chỉ tải font khi bật).
  - Canvas `#holoSao` cố định phía sau: sao nhấp nháy khoảng 15 hình/giây, dừng khi tab ẩn.
- **Đài quan sát KPI** chèn ở đầu Tổng quan, bằng cách bọc `window.vDash`. `kpiMayVeLai_` gọi `vDash` lúc vẽ lại nên vẫn qua lớp bọc.
  - KPI xưởng = trung bình `kpi(MaNV).tong` (số Bảng KPI máy chủ) của người "Đang làm", không tính TP/PP, chỉ người đã có KPI tháng này (tong > 0).
  - Tâm vòng = trung bình nhà máy. Vòng đồng tâm = ngưỡng C/B/A/A+/S; chữ hạng đặt ở khe giữa 2 sao đầu để không đè sao.
  - Bên phải: % người đã khai sản lượng hôm nay, người dưới 80%. Chân khung: sản lượng chờ duyệt, đề xuất định mức chờ, số xưởng đạt A.
  - Bấm sao hoặc dòng xưởng: `xuongLoc` = mã xưởng, rồi `go('kpi')`.
  - Ẩn ô Hiệu suất / Tỷ lệ đạt cũ (`.kpis.hl-an`).
  - Các nét trang trí trong SVG có `pointer-events:none` (`.hl-tri`), nếu không sẽ chặn cú bấm vào sao.
- **Nút cuối menu** `#btnHolo` (bọc `window.veNav`): mỗi lần bấm chuyển "Bật · có chuyển động" → "Bật · nền tĩnh" → "Đang tắt". Lựa chọn nhớ trong localStorage `kpi_holo` (dong / tinh / tat). Máy bật giảm chuyển động (`GIAM_CD`) thì nền luôn tĩnh.
- Không tách file riêng: bộ clasp trên máy chủ dự án ghi cứng `$CacFileHtml` (Index, SoDo, HoatAnh, AmThanh) trong `chung.ps1`, file mới sẽ không được đẩy. Index tăng khoảng 20 KB.

## Kiểm thử
- `tests/holo-web.js`: 19 lần kiểm (bản xem thử `BO_HO_SO=1`).
  - Chủ sở hữu: mặc định bật; số sao bằng số xưởng; tâm và từng xưởng khớp với cách tính lại.
  - Bấm sao mở Bảng KPI đúng xưởng.
  - Nút qua 3 chế độ đúng.
  - Không tràn ở 1360 và 390px.
  - giamdoc / tpphoicb / c360 không có hologram.
