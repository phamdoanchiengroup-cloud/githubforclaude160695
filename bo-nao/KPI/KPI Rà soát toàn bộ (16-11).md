# KPI Rà soát toàn bộ (16-11)

Nhóm: KPI · Cập nhật 16/11/2026
Liên quan: [[KPI Gậy 1 khúc, ưu tiên và nhập nhanh (15-11)]] · [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]] · [[KPI Kiểm thử]] · [[Bàn giao phiên]]

## Chuyên gia đã hỏi
- `quan-ly-van-hanh` (15/11): 5 chỉ số trùng tên khác công thức, mục trùng, ô ít giá trị.
- `bao-mat-ung-dung`: Note lọt công thức (Cao), 3 hàm trigger tab 10 gọi được từ web (TB), tab ghi không giới hạn, ngày không có thật, `dhCoUu_` thiếu kiểm 1 tài khoản.
- `general-purpose` (logic): năm 12 → 1 sai, tab 10 chép nhầm dòng khi sắp xếp / trùng mã / Sheet tự đổi chữ thành ngày, xung đột mãi, tốn hạn mức chạy.
- `soat-giao-dien-cuoi`: lỗi han10 mở màn hình cũ, chữ lỗi thời (Dealer bậc 1, 5 bậc, 30/70), ~15 hàm chết + CSS chết, thanh Lưu bị che ở 641–900px.

## Đã sửa (chủ dự án cho "sửa theo ý bạn" 16/11)
- Máy chủ `tests/quy-trinh/don-hang.gs`:
  - `dhNgay_` + `dhNamGan_`: ngày không ghi năm → năm gần hôm nay nhất (±6 tháng); ô ghi rõ năm giữ năm; tab HT-<năm> dùng năm của tab (`DH_NAM_CD_`); `dhP2Ngay_` cũng vậy.
  - Bảo mật: `luuGhiChuDon` qua `chuAnToan_`; `DH_TAB10_*` kiểm `noiBo_(e)`; `dhTabGhi_` (không ghi tab ĐẾN HẠN 10 NGÀY / HT); `dhNgayThat_`; `dhCoUu_` kiểm đúng 1 tài khoản đang dùng.
  - Tab 10: thêm cột MÃ DÒNG WEB cuối tab 10, đồng bộ tra theo mã (sắp xếp / lọc vẫn đúng); mã trùng → không chép, làm mới cấp mã mới; ô chữ giữ dạng chữ (`setNumberFormats`); đọc tab kênh 1 lần; đồng bộ lỗi thì không dựng lại tab; chép về tab kênh qua `chuAnToan_`.
  - `luuBangDon`: không báo xung đột mãi khi web giới hạn số ≤ SL đặt.
  - Bỏ hàm chết: `luuDeadlineDon`, `dhTienNgayLam_`, `tkThangTruoc_`.
- Web `tests/quy-trinh/quy-trinh-web.html`:
  - `DH_CU` han10/le10 → mục trong bảng; bỏ nhánh chitiet / thongke / han10; bỏ lịch giao 14 ngày.
  - Bỏ hàm chết: dhVeHan10, dhVeNhapNhanh, dhNNLuu, dhBangNhom, dhVeHT, dhHTDon, dhHTTong, dhVeVRT, dhVeSQDCP, dhBRouteTxt, dhBTruoc, dhVeChiTiet, qtSoDo, qtNutNhom, dhLichGiao, DH_LAN1, nhánh chết dhCPForm; 24 dòng CSS chết.
  - Chữ: bậc 1 = Web lẻ + POD (Dealer bậc 3), "3 bậc", "2 làn – làn lẻ x%" (bảng kênh + PDF + Excel).
  - Ô Ưu tiên đầu trang đếm theo ĐƠN (như nút ★). Thống kê: tiêu đề "Đơn hàng", bỏ ô "Dòng đơn đang thiếu", Giao đúng hạn 4 tuần "–" khi < 20 ngày chụp, ẩn thẻ Hỏng khi 0, bỏ thẻ "Còn thiếu theo kênh" (link sang Thống kê theo kênh); Dự báo: "Nhu cầu tháng ÷ công suất", bỏ ô tải thứ 2.
  - `dhHomNay` / `dhHan` theo giờ VN. CSS: thanh Lưu ở ≤900px nằm trên thanh 5 nút, khung bảng chừa 150px, dải ô 2 cột ≤640px, biểu đồ rộng cuộn ngang.
- Kiểm thử mới `tests/ra-soat-1611.js` (11) + tab10.js thêm 5 (19). uu-tien-web 25, quy-trinh-web không có lỗi mới (bớt 1 lỗi cũ).

## Đã sửa thêm 16/11 (sau trả lời chủ dự án)
- Phôi 2 nhánh: `dhP2Loai_` – chuôi lẻ / gậy 1 khúc chỉ tính nhánh chuôi, ngọn lẻ chỉ nhánh ngọn (gọi trong `themBTP` + email hạn chuẩn). Kiểm thử ra-soat-1611 (12).
- Ngày dự kiến xong: chủ dự án chọn **B – giữ cách tính hiện tại** (không tự đẩy đơn gần xong).
- **5 bậc mới** (`dhBacDong`, `DH_SO_BAC=5`, mô phỏng xếp theo bậc của dòng `dhSimDong` uu = bậc): xem [[Quyết định của chủ dự án]]. Làn lẻ cố định 10% (`DH_LAN_MAX=0.10`), hạn đơn lẻ 5 ngày (`DH_HAN_NGAM=5`, máy chủ `dhDlNgam_`).
- **Ưu tiên khớp theo mã đơn + tên** (`dhUuTen` / `dhLaUu`): trước khớp theo tên → 50 dòng Kho bị gắn ưu tiên, đúng 23. Số thật 16/11: tab có 33 dòng / 1.612 sp; Kho có 24 dòng ghi chữ "ưu tiên" (886 sp) không có trong tab – hỏi chủ dự án.
- Kết quả trên đơn thật 16/11: Seybert 03/12 → **23/11**; làn lẻ 31 sp/ngày, đơn lẻ vào ~14 sp/ngày nhưng tồn 351 sp → 300 đơn lẻ dự kiến quá hạn 5 ngày, hết tồn ~02/12 – báo chủ dự án.

## 16/11 tối (chủ dự án)
- `dhMoPhong` viết lại: chỉ theo công suất (`c.sp`, mặc định 300 – `DH_CS_MAC=300`, máy chủ đổi 310/350 đã lưu cũ → 300), 2 làn (lẻ 10% cố định), xếp bậc → deadline → gần xong; bỏ mô phỏng qua xưởng.
- Gộp bậc 4 + 5 (`DH_SO_BAC=4`). Bỏ `dhHCChip` trong bảng đơn + `dhVeHanChuan` ở mục Đơn trễ hẹn (giữ ở Công đoạn).
- Đơn thật 16/11: Seybert → **17/11**; bậc 1 (351 sp lẻ) hết ~30/11 – 300 đơn lẻ quá hạn 5 ngày (làn 30 sp/ngày).

## Chưa sửa (ghi lại)
- `luuBangDon` / `luuCotPhuDon` vẫn kiểm theo tên hàng (Sheet không có cột mã dòng cho mọi tab).
- A1/A2/A5 (trễ 3 cách, ngày tồn, công suất 4 nguồn), gộp `dhVeTreBP` + `dhVeHanChuan`, "Đến hạn 10 ngày" web theo đơn vs Sheet theo dòng; `tkNgayLam_` thiếu ngày lễ tự tính.

## Ngày dự kiến xong (giải thích cho chủ dự án 16/11, ví dụ Seybert)
- `dhMoPhong`: mô phỏng từng ngày làm, từng DÒNG đi qua các bộ phận (Phôi chuôi 250, Phôi ngọn 350, các bộ phận 310 sp/ngày), làn lẻ 10–13%; hàng xong bộ phận hôm nay mai bộ phận sau mới làm. Đơn xong = dòng xong CUỐI CÙNG.
- Thứ tự: thử đẩy → dòng ưu tiên / tên có trong tab TRỄ HẠN → còn lại theo hạn (đã trễ đứng đầu) → gần xong trước khi cùng hạn.
- Seybert (#CB26-SEYBERTS08, DEALER, 177 sp, còn 30 ở 14 dòng, hạn 14/11): nhà máy rỗng vẫn mất tới 21/11 (đa số dòng chưa qua Phôi), nhưng phải chờ ~2.343 sp ưu tiên / tab TRỄ HẠN + ~300 sp trễ sớm hơn → 03/12.
