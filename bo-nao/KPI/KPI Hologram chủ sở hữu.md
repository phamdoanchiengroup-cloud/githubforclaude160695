# KPI Hologram chủ sở hữu

> **16/11: HOLOGRAM ĐÃ BỎ HẲN** – chủ sở hữu dùng giao diện kính "Premium Glass" (xem mục 16/11 cuối ghi chú). Phần dưới là lịch sử.

Nhóm: KPI · Cập nhật 03/11/2026
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
- **24/10 sửa:** bấm sao mở Bảng KPI trước đây chỉ đặt `xuongLoc`, nhưng Bảng KPI lọc theo `kpiXuong`, nên không lọc đúng xưởng. Nay đặt cả hai. Kiểm thử nay kiểm `kpiXuong` và chỉ còn 1 bảng.

## Sửa lỗi 25/10 – menu điện thoại không bấm được tab
- Chủ dự án báo: trên điện thoại, chế độ hologram, bấm nút menu thì menu hiện ra nhưng không chọn được tab.
- Nguyên nhân: `html.holo #app{position:relative;z-index:1}` biến #app thành một lớp riêng (để nằm trên nền sao). Menu `#nav` (z-index 160) nằm trong lớp đó, nên lớp nền tối `body.mo-nav::after` (z-index 155, ngoài #app) che lên menu.
- Sửa trong `holo-web.js` (HOLO_CSS):
  - `html.holo body.mo-nav #app{z-index:156}`;
  - `::after` trong suốt;
  - phần tối làm bằng bóng của menu (`box-shadow:0 0 0 100vmax`);
  - nền menu đặc hơn (.97) để chữ phía sau không lẫn vào.
- Kiểm thử `holo-web.js` 20 (thêm: mở menu, bấm Bảng KPI → sang tab và menu đóng; bấm ra ngoài thì đóng).

## 03/11: chỉ dùng ở nền tối
- Chủ dự án báo giao diện sáng thiếu tương phản. Hologram (nền vũ trụ tối) trộn với giao diện sáng làm chữ / thẻ không đọc được → `holoSang()`; ở nền sáng hologram tự tắt, nút ghi "Chỉ dùng ở nền tối…", bấm nút thì chuyển sang nền tối + bật hologram. `gdDat` gọi lại `holoApDung()` + `holoNut()`. Chi tiết: [[KPI Quy trình sản xuất]] (Đợt 8).

## 16/11 – Bỏ hologram, chủ sở hữu dùng giao diện kính (chủ dự án chốt)
- Chủ dự án: "Áp dụng [giao diện kính] cho giao diện chủ sở hữu, bỏ hoàn toàn giao diện hologram". Hỏi gộp: **cho tự đổi 3 tông** (xanh rừng sương / đỏ lá phong / tím oải hương); **giữ Đài quan sát KPI, đổi sang kính**; **có nút + chế độ nhẹ**.
- Nguồn: `tests/rung-suong/rung-suong.css` (hệ thống vật liệu kính bằng CSS variables: Primary / Secondary / Deep / Light / Control / Highlight / Border; chỉ có hiệu lực khi `html.rs`), `rung-suong.js` (vẽ nền rừng bằng canvas → `--rs-nen`, tự nhận thẻ → `.rs-the` / `.rs-the2` / `.rs-sang` / `.rs-vien`, `rsBat(tông|'0')`; phần nút demo chỉ khi `window.RS_DEMO`). `va-holo-web.py` chèn cả 2 vào Index (mục 34) trước `holo-web.js`.
- `holo-web.js` viết lại: bỏ nền sao (`holoVeSao`, `HOLO_SAO`), lớp `html.holo`, font Exo 2, màu neon (đổi trắng kính). Khóa mới `kpi_kinh` (day / nhe / tat) + `kpi_kinh_tong` (xanh / do / tim). Nút cuối menu `#btnHolo` "🪟 Giao diện kính" Đầy đủ → Nhẹ → Tắt; `#btnTong` "🎨 Tông màu". Nền sáng (nút mặt trời) thì kính tự tắt. Đài quan sát luôn có cho chủ sở hữu (`holoChu()`), **tĩnh** (`holoDong()` = false, không quét radar liên tục).
- Góp ý `soat-giao-dien-cuoi` (lần 1 chưa đạt 4 điểm → đã sửa: hộp nổi đủ đặc, không blur chồng, không đổi bố cục, chữ phụ đậm hơn).
- Lỗi đã sửa khi làm: quy tắc `.rs-nhe` thua độ ưu tiên (chế độ nhẹ vẫn blur); mảnh CSS hologram sót làm `HOLO_CSS` bị ASI cắt → Đài quan sát mất `container-type` (điện thoại 3 cột chật).
- Kiểm thử: `tests/holo-web.js` viết lại 23/23; `tong-quan-web.js` 26/26 (đổi kỳ vọng: Đài quan sát tĩnh); `cn-apple-web.js` 30/30.
- Demo trước đó (chỉ để xem): `kpi-app/demo-rung-suong.html`; `tests/rung-suong/tao-demo.py` (phủ kính lên mọi vai trò cho bản xem thử).

## 16/11 (sau) – Ảnh nền thật, viền kính dày phản quang, tông Sương sáng
- Chủ dự án so với ảnh mẫu, chọn mục 1 (ảnh thật, **cách A**: ảnh miễn phí bản quyền), 2 (viền dày – "chú ý viền kính dày phản quang"), 3 (tông sáng).
- Ảnh Pexels (Unsplash chặn tải tự động): `kpi-app/anh/web/kinh-{xanh,suong,do,tim}{,-dt}.jpg` (1600px máy tính / 900px điện thoại, làm mềm sẵn 1,4–2,2px như hậu cảnh nhòe), nguồn ghi ở `anh/web/NGUON-ANH-KINH.md`. `va-holo-web.py` chèn `window.KINH_ANH` (link jsDelivr ghim commit, `anh_cdn`); `rung-suong.js` `veAnh()` tải ảnh, lỗi thì tự vẽ nền. Bản xem thử Artifact phải nhúng ảnh base64 (CSP chặn jsDelivr).
- Viền: `--gb-w:2px` vành gradient sáng (::before), màu 4 cạnh sáng hơn (cạnh dưới cũng phản quang), `--gb-inner` gờ trong 3px + mép trên/dưới/hai bên + vành ngoài 1px + quầng nhẹ (box-shadow, không đổi kích thước), ánh lóe góc trên trái + góc dưới phải (`--gh-spec`, `--gh-bounce`). Lớp phủ ảnh nền `--g-scrim1/2`.
- Tông mới **Sương sáng** (`rs-suong`, không dùng `rs-sang` vì trùng lớp "thẻ nền sáng"); thứ tự nút Tông màu: Xanh → Sương sáng → Đỏ → Tím.
- Sửa lỗi: ánh lóe góc làm `sangNen` nhận nhầm thẻ kính là "thẻ nền sáng" (tắt blur) → chỉ tính nền đặc (alpha ≥ .8).
- Kiểm thử: holo-web 23/23, tong-quan 26/26.
- 16/11 (sau nữa): chủ dự án khen ảnh Xanh, chê 3 ảnh còn lại → thay: Sương sáng = rừng thông sương sáng (Pexels 4500037), Đỏ = hàng phong đỏ (708932), Tím = đồng oải hương trời hồng (1166209). Sương sáng tăng lớp phủ (`--g-scrim1/2` .40/.56, kính pha xanh) để chữ trắng đọc rõ.
