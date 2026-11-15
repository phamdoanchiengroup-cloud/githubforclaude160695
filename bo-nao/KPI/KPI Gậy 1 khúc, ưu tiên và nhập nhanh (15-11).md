# KPI Gậy 1 khúc, ưu tiên và nhập nhanh (15-11)

Nhóm: KPI · Cập nhật 15/11/2026
Liên quan: [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]] · [[KPI Học hỏi ERPNext (16-11)]] · [[KPI Cấu hình gậy – bản vẽ kỹ thuật (08-11)]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

Ghi chú: các mục ghi "16/11" ở phiên trước thực ra làm ngày 15/11 (sáng); phần này làm chiều 15/11.

## 1. Thống kê + dự báo (commit 3451104)
- Cột SVG web 4.0 tô gradient (`dhTo`, `dhG4Defs`, cờ `g4` trong `dhMau4`); PDF / ảnh xuất (`dhMau(true)`) vẫn tô đặc.
- I-MR Đóng gói rộng hết khung (`dhRongKhung`: bề rộng vùng nội dung 760–1600); nhãn MT không đè TB.
- **Phần 3 ERPNext – Dự báo đơn tháng tới** (`dbDuLieu`, `dbVe`, cuối Thống kê → Sản xuất & đơn hàng, chỉ chủ sở hữu): đơn mở + tab HT theo tháng đặt (ngày trong mã đơn), bỏ PK/nối, mã đã ở HT bỏ dòng tab kênh; trung bình trượt 20/30/50%; khoảng thấp–cao = ± sai số thử dự báo lại 3 tháng; < 6 tháng = "tin cậy thấp"; nhóm kênh (Đại lý/OEM/B2B · Đơn lẻ · Kho · Chưa rõ) có tổng; bảng chuẩn bị phôi (loại SP, khúc chuôi / ngọn theo FC → MIX → GF); tải tháng tới và tải tới hết tháng tới (> 85% vàng, > 100% đỏ). Máy chủ `layDonHoanThien` gửi thêm `ngayDat, loai, vlC, vlN`.
- Kiểm thử: `du-bao-web.js` 18/18.

## 2. Gậy 1 khúc (commit 2feaf4f)
- Chủ dự án: tên có **"1 KHÚC", "ONE PIECE", "GMK"**; glassfiber nguyên cây 1450 / 1480 mm, **không ren**, có tip **12.5 / 12.2**; luồng **Phôi → Sơn → UV → Hoàn thiện → Làm đầu → Đóng gói**; thống kê **nhóm riêng**; có bản vẽ kỹ thuật.
- Máy chủ `don-hang.gs`: loại `GAY1K`, dòng `GAY1K` (PL_DONG), phôi `GF1K` (chất liệu GF), `DH_BTP_CD.GAY1K`; `dhBPSau_` (Làm đầu → Đóng gói, không trả HT); `dhHanChuan_` 1 luồng `['TIP','HT','UV','SON','PHOI_C']`; `luuCauHinhSP` nhận loại GAY1K (ngọn / ren = KHONG).
- Web: `DH_TUYEN` (Phôi Thô, Sơn, UV, Ngọn Tip, CNC tip, HT, ĐG), `DH_CHUOI_CHANG.mot`, `dhSimDong` (`DH_SIM_1K`, `dhLa1K`), `dhBSau`, nhóm "Gậy 1 khúc" (`dhKhoiSKU`, `dhKhoiChuoi`), `dhMucTieuXuong` (`t.mot`), dự báo `DB_LOAI`, form Cấu hình sản phẩm.
- Cấu hình gậy: mẫu `t.mot` (`cgMau1K`: 1480 mặc định, tên có 1450 → 1450; 12.2 nếu tên ghi), `CG_TRUONG_1K` 26 ô, `cgKiemTra1K`, `cgVe1K` (cả cây nằm ngang), `cgCT1K` (A đầu, D đuôi), `cgBangTS1K`, `cgBangCT1K`, PDF; `CG_KHOA` thêm 22 khóa `mot.*` (script dựng kiểm khớp).
- Kiểm thử: `mot-khuc.js` 20/20 (cần DATA).

## 3. Bậc ưu tiên + gợi ý hẹn + nhập nhanh (commit acae9e8) – góp ý `quan-ly-van-hanh`
- **Bậc 1** Web lẻ thường / custom + POD (đơn đặt trước làm trước); **bậc 2** trễ + ưu tiên; **bậc 3** Dealer, OEM, A Đông, Kho (Kho = kho Amazon / bán lẻ nước ngoài, kênh chủ chốt nên KHÔNG để bậc 4 như chuyên gia đề xuất ban đầu). Bằng hạn → đơn gần xong trước (`tien` trong `dhSimDong`).
- **Gắn ưu tiên cả đơn**: `luuUuTienDon` – chỉ mã NV `DH_UU_NV = C019, C056, C077, C067` (Giám đốc, chủ sở hữu, PGĐ Lê Công Hiếu, chị Kim Loan – **chờ chủ dự án xác nhận PGĐ SX thứ 2**); lưu sheet ẩn `DonUuTien` (file KPI); nút ★ trong form dòng đơn (`dhUuNut`, `dhUuGan`); danh sách ★ Đơn ưu tiên cộng thêm đơn gắn web.
- **Làn đơn lẻ** `dhLanLe`: sp lẻ + POD đặt 4 tuần gần nhất ÷ ngày làm × 1,25 ÷ công suất, giới hạn **10–13%** (chủ dự án: thực tế 10–13% của 310).
- **Gợi ý ngày hẹn** `dhGoiYHen`: mô phỏng đơn mới xếp cuối bậc 3 + 20% dự phòng; Thử nhận đơn để trống deadline → gợi ý; deadline sớm hơn → chỉ cảnh báo (vàng / đỏ khi sớm > 20%) – `dhSoHen`.
- **Đơn lẻ / POD quá 10 ngày** từ ngày đặt (`dhHanLe`, `dhLe10Ds`): dòng đỏ dưới 3 ô trạng thái + tab "Lẻ / POD quá 10 ngày".
- **Nhập nhanh trong Đến hạn 10 ngày** (`dhVeNhapNhanh`, `dhNNLuu`): TP/PP nhập SL cộng dồn + hẹn giao của bộ phận mình, ghi bằng `luuDonGiaoNhan` (chỉ gửi phần đổi); chủ sở hữu chọn bộ phận; Phôi gậy 2 khúc → nút Mở form đầy đủ; điện thoại dạng thẻ. Deadline đơn do ban điều hành ghi.
- Kiểm thử: `uu-tien-web.js` 20/20 (cần DATA).

## 15/11 tối – theo trả lời chủ dự án
- C056 (chủ dự án) là Phó GĐ SX thứ 2 → `DH_UU_NV` giữ C019, C056, C077, C067; `DH_NOTE_NV` thêm C077.
- **Sửa deadline đơn** (`luuDeadlineDon`, web `dhDlForm` / `dhDlLuu` trong form dòng đơn): 4 tài khoản, mặc định áp cả đơn; ghi chữ `'dd/mm/yyyy` vào ô Hạn mới (nếu dòng đang có) hoặc cột DEADLINE; kiểm tên hàng + deadline cũ (xung đột → hỏi ghi đè). `meta.hanMoi` thêm vào `dhDocTab_`.
- Gậy 1 khúc: 1480 → đầu 12.2, 1450 → 12.5 (`plPhanLoai0_`, `cgMau1K`, pro taper dịch theo đầu).
- Kiểm thử: `uu-tien-web.js` 24/24, `mot-khuc.js` 20/20.

## 15/11 khuya – tab "ĐẾN HẠN 10 NGÀY" trong Sheet đơn (chủ dự án: chỉ giới hạn quyền trên web, Sheet để mở; sau này sẽ khóa Sheet) – góp ý `quan-ly-van-hanh`
- `dhTab10Tao_` (7h + nút Làm mới ngay cho 4 tài khoản, `lamMoiTab10`): ĐỒNG BỘ TRƯỚC rồi dựng lại tab – dòng còn thiếu có hạn (deadline / hạn mới / hạn ngầm lẻ) hôm nay → +10 ngày, cột KÊNH; cột xám chỉ xem; cột sửa: DEADLINE, HẠN MỚI, NOTE, SL + HẸN 7 bộ phận (chép đúng ô tab kênh).
- Tìm dòng gốc bằng cột **MÃ DÒNG WEB** (cuối tab kênh, web tự cấp `W…`) – chèn / xóa dòng không chép nhầm.
- `dhTab10DongBo_`: so 3 chiều với bản gốc (sheet ẩn `DonHang10Goc`): chỉ tab 10 đổi → chép về tab kênh; chỉ tab kênh / web đổi → cập nhật tab 10; cả hai đổi → giữ tab kênh, tô đỏ + ghi chú ô; SL giảm → tô vàng; mất dòng gốc → tô đỏ ô đầu dòng.
- Trigger: `DH_TAB10_SUA` (onEdit của Sheet đơn, chỉ chạy khi sửa tab 10), `DH_TAB10_DONG_BO` (10 phút, 6h–22h), `DH_TAB10_TAO` (7h) – tự cài khi mở tab Đơn hàng (`dhCaiTab10_`, cờ `DH10_CAI`). Mọi lần ghi Sheet dùng chung LockService.
- `DH_TAB_LOAI` thêm tên tab để không đọc như tab kênh. Web: dòng trạng thái `dhTab10Dong` ở Đến hạn 10 ngày.
- Kiểm thử `tab10.js` 14/14 (giả lập: openById có insertSheet, clearContents xóa tại chỗ). bao-mat.js / com-trua.js lỗi có từ trước (dữ liệu cũ).

## 15/11 khuya – sửa hiểu nhầm (chủ dự án)
- "Đến hạn 10 ngày tới" thành **1 mục trong bảng đơn** (`@han10`, `dhHan10Ds`, cạnh ★ Đơn ưu tiên / Đơn trễ hẹn) **thay** mục "Lẻ / POD quá 10 ngày" (mục này bỏ – chủ dự án không yêu cầu). Bỏ mục đứng riêng "Đến hạn 10 ngày" + bảng Nhập nhanh khỏi giao diện (hàm `dhVeNhapNhanh` còn trong mã, không gọi); ô "Đến hạn 10 ngày tới" mở thẳng mục trong bảng (`dhChon('han10')`). Dòng trạng thái tab Sheet hiện trong mục mới.
- (sau, chủ dự án) Ô đầu trang "Đến hạn 10 ngày tới" đổi thành **"Lẻ / POD quá 10 ngày"** – bấm mở danh sách trong bảng đơn (`dhChon('le10')` → `@le10`, không có nút tab riêng); bỏ dòng cảnh báo đỏ.
- Lưu đồ nhà máy làm lại (3 làn NHÁNH CHUÔI / NHÁNH NGỌN / CẤP LINH KIỆN, Tip dưới Hoàn thiện, nhãn LÀM ĐẦU / TRẢ HT; bỏ đường ngọn lẻ Tip → Đóng gói – `QT_XUONG_BO`, còn 13 mũi tên): chủ dự án duyệt ảnh, đã gộp vào nhánh chính. `quy-trinh.js` 76/76.
- Kiểm thử `uu-tien-web.js` 28/28.

## 15/11 đêm – cột còn lại của Sheet trong bảng đơn (chủ dự án)
- Cột thật (tab DEALER, đọc qua Sheet cầu nối): 7 "TỔNG SP CÓ THỂ GIAO: Của Tuyết Anh" · 8 "Hàng Còn lại trong kho và đóng gói, có thể giao" · 9 "HÀNG ĐI- ĐÃ TRẢ KHÁCH" · 10 "CHÚ THÍCH CÁC BỘ PHẬN" · "Hỏng cần làm bù" sau Sơn / Taro / Làm đầu / UV / HT / Đóng gói (**Phôi không có**) · dòng "TỔNG SL CÒN THIẾU" cuối mỗi đơn.
- Máy chủ: `dhDocTab_` thêm `cKho` → `o.kho`, `meta.hong/giao/kho/tra/ct` (gửi web qua `cot`); **sửa lỗi cũ**: hỏng của Phôi lấy nhầm cột hỏng của Sơn (đếm trùng). `luuCotPhuDon`: hỏng = TP/PP bộ phận đó; giao / kho / tra = chỉ TP/PP Đóng gói; chú thích = mọi TP/PP + 4 tài khoản; ô công thức thì bỏ qua + báo; kiểm xung đột. `DH_DON_KHOA` v14.
- Web: 3 cột Có thể giao / Trong kho + ĐG / Đã trả khách sau cột Hạn; cột Chú thích các bộ phận; "hỏng N" đỏ dưới ô Đã giao; dòng **TỔNG SL CÒN THIẾU trên cùng mỗi đơn nhiều mã** (`dhTongDon`); form `dhCPForm` / `dhCPLuu` ("Các cột khác trong Sheet").
- (sau, chủ dự án) Cột Chú thích chuyển lên **trước các cột bộ phận** (thứ tự như Sheet) và sửa **ngay trong ô kiểu Note** (`dhCTO`, `dhCTLuu`, nền xanh 💬), bỏ khỏi bảng nổi.
- Kiểm thử `cot-phu.js` 10/10; ảnh thử bằng bản xem thử số thật (`DH=` từ CSV cầu nối).
- **Rà soát toàn bộ (4 chuyên gia) dang dở**: vận hành đã có kết quả (5 chỉ số tính lệch: trễ hạn, số ngày tồn, giao đúng hạn, tải, công suất; mục trùng: dhLichGiao, ô xưởng vs bullet, Đóng gói 3 lần, còn thiếu theo kênh; code chết dhVeSQDCP, dhVeVRT…); giao diện / bảo mật / logic bị ngắt do hết lưu lượng – chạy lại ở phiên mới, trình chủ dự án duyệt trước khi bỏ.

## Còn bàn
- Tab "Đến hạn 10 ngày" thẳng trong Sheet Trạng thái đơn hàng (mỗi đơn ghi kênh): web (Apps Script) ghi được Sheet đó; cần bàn: tab tự làm mới lúc nào, chỉ đọc hay nhập ở đó rồi chép về tab kênh, ai sửa.
- "Lưu tất cả" (lưu nhiều dòng một lần) – chưa làm, chủ dự án chưa rõ ý nghĩa.
