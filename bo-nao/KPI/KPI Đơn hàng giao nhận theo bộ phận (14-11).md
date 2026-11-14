# KPI Đơn hàng giao nhận theo bộ phận (14-11)

Liên quan: [[KPI Quy trình sản xuất]] · [[KPI Điều phối sản xuất (08-11)]] · [[Quyết định của chủ dự án]] · [[Lần dán lên Apps Script]]

## Nguồn
- Chủ dự án tự làm bằng AI khác (13–14/11) rồi gửi Index/Code/QuyTrinh. Chọn **A: dùng bản đó, Claude sửa chỗ cần thiết** (không bê nguyên xi).
- Cách gộp: `diff -u` bản sinh ra ↔ bản chủ dự án, `patch` vào `tests/quy-trinh/don-hang.gs`; `quy-trinh-web.html` chép thẳng (bản gốc trùng QuyTrinh.html). Phần Index / MANH_GD ở mục vá mới **45** `tests/don-giao-nhan/` (`va-don-giao-nhan-web.py`, `va-don-giao-nhan-code.py`, `navy.css`).

## Chủ dự án chốt (14/11)
- Mở tab Đơn hàng cho **ban điều hành (ADMIN) + TP/PP**. TP/PP **xem tất cả**, chỉ ghi bộ phận mình; BĐH chỉ xem; chủ sở hữu ghi thay được (có nhật ký).
- **Ghi thẳng vào Sheet đơn** (đổi quyết định 31/10 "chỉ đọc"): SL lũy kế vào cột "PHÔI CỦA… / SƠN CỦA…", hẹn vào "NGÀY HẸN TRẢ …", thêm **10 cột phụ** cuối mỗi tab: ĐANG Ở BP, BP KẾ TIẾP, 7 × XN NHẬN <BP>, **XN HẸN**.
- Mỗi dòng Sheet = một mã sản phẩm, có cấu hình bán thành phẩm riêng (sheet `BTPTheoSKU`, chỉ chủ sở hữu sửa; mặc định theo loại: chuôi Phôi→Sơn→UV→HT→ĐG, ngọn Phôi→Taro→Làm đầu→ĐG, gậy đủ 7).
- **Bộ phận sau xác nhận ngày hẹn** của bộ phận trước: Đồng ý / Không kịp (bắt buộc lý do). Xác nhận gắn với đúng ngày lúc bấm – đổi hẹn thì tự về "chờ xác nhận" (● vàng; ✓ xanh; ✗ đỏ).
- Màu **Carbon Navy** cho toàn web khi nền tối (không áp web công nhân kiểu Apple – `:not(.cn-moi)`); bảng đơn phải **tương phản rõ** (chữ trắng, số đậm, dòng chẵn lẻ).

## Claude sửa thêm so với bản chủ dự án
- **Lỗi**: `dhThemCotTD_` đọc tiêu đề ở dòng 1 nhưng ghi ở dòng tiêu đề thật → tab có tiêu đề ở dòng 2 mỗi lần lưu lại thêm 9 cột. Đã đọc đúng dòng.
- **Không ghi đè ô công thức**: trước khi ghi, đọc `getFormulas()` của dòng; ô nào là công thức thì dừng, báo tên ô (vd `J3`).
- Xác nhận nhận hàng: khi đã chọn bộ phận kế tiếp thì chỉ bộ phận đó nhận được.
- Thêm `dhXnHenDoc_` / `dhXnHenGhi_` (ô XN HẸN đọc được bằng mắt: "Phôi: ✓ 20/11/2026 · Tên · 14/11 10:20"), `dhBPSau_`, `dhTenCot_`; web `dhBTruoc`, `dhBXnHen`, `dhBXnHenLuu`. Bộ nhớ tạm `DH_DON_v12`.

## Kiểm thử
- `don-hang.js` 135/146 (11 lỗi cũ có từ trước; 11 kiểm thử mới mục "14/11" đạt; sửa kỳ vọng: BĐH xem được, công suất 310). Giả lập thêm `getFormulas`, `SpreadsheetApp.flush`.
- `quy-trinh-web.js` còn 5 lỗi cũ (sửa kỳ vọng: mặc định bảng kiểu Sheet, BĐH + TP có tab Đơn hàng). `cn-apple-web.js` 30/30.

## 14/11 tối – giao diện theo góp ý chủ dự án (ảnh mẫu Ventaro + ảnh Đơn hàng)
- Phối màu **60/30/10**: Midnight Carbon `#070b12` (nền) · Ivory Cream `#f4ecda` (chữ, số, thẻ "Sắp tới hạn") · Electric Azure `#1EA7FF` (nhấn). Biến `:root` ở `va-don-giao-nhan-web.py`, CSS ở `navy.css`.
- **Menu trái ẩn** trên máy tính (chừa mép 8px viền Azure), rê chuột / Tab vào mới hiện; nội dung dùng hết bề ngang (mọi vai trò trừ web công nhân kiểu Apple).
- **Bảng đơn nền Ivory sáng, chữ đen** (chủ dự án chọn), tiêu đề xanh đêm chữ Ivory, **mỗi đơn một dải màu** xen kẽ kem / xanh nhạt + vạch đầu đơn (`tr.dh-d0/dh-d1`, `dh-dmoi` – không dùng `dh-dau` vì trùng lớp tiêu đề trang, từng làm dòng thành flex vỡ bảng).
- Cột **Mã sản phẩm** chỉ tên + "mã a/b"; cột **📐** (`dhCfgO`, rộng 34px) – chủ dự án chốt chỉ để nút bản vẽ, bỏ chữ cấu hình; cột chỉ hiện với 4 mã có quyền (`dhCoBV`); nút **📐 Bản vẽ** chỉ hiện cho 4 mã có quyền (`ME.cg`), chỉ gậy/chuôi/ngọn → `dhCgXem` tải mảnh CauHinhGay rồi `layCauHinhGay` (máy chủ vẫn kiểm quyền) vẽ ngọn + chuôi + chi tiết A/C/K/D phóng to. Bỏ dòng đường đi qua các xưởng.
- **Nhập theo bộ phận ở bảng nổi** (`dhBNoi`, Esc / ✕ / bấm ngoài để đóng), vẫn nhập **theo từng mã sản phẩm**.
- **Tiêu đề bảng đứng yên**: khung bảng cao vừa màn hình dưới thanh lọc dính (`--dhnav` đo bằng JS), tiêu đề 2 tầng cao cố định 36px.
- Kiểm thử: `quy-trinh-web.js` còn 5 lỗi cũ, `cn-apple-web.js` 30/30; TP không thấy nút bản vẽ.

## 14/11 khuya – gọn bảng nổi + màu đơn + đổi tên (chủ dự án)
- Tên mục **"Trạng thái đơn hàng"** (thay "Bảng đơn như Sheet"); **bỏ mục "Chi tiết từng dòng"** khỏi menu (hàm `dhVeChiTiet` còn, kiểm thử còn gọi).
- **Bảng nổi gọn** (`dhBForm` viết lại): tên mã SP, dòng tiến độ từng bộ phận `Phôi 30/30 · Sơn 15/30 (hẹn …)`, ô **đã giao (cộng dồn) / đặt** + **hẹn ngày giao đủ** + nút Lưu; xác nhận hẹn của bộ phận trước (`dhBSau`, Làm đầu → trả Hoàn thiện); cấu hình BTP của mã gập trong `<details>` chỉ chủ sở hữu. Bỏ: chọn bộ phận kế tiếp, xác nhận nhận hàng, bảng công đoạn.
- Ô bảng **Đã giao** hiện `15/30` (xanh khi đủ). Mỗi đơn **1 màu xoay vòng trắng / be / vàng nhạt / xanh nhạt** (`dh-d0..3`), chữ đen; bảng sáng dùng chung **cả nền tối lẫn nền sáng** (`navy.css` đổi `html[data-gd="toi"]` → `html:not(.cn-moi)` cho khối bảng).
- Kiểm thử: `don-hang.js` 135/146 (11 cũ), `quy-trinh-web.js` 3 lỗi cũ, `quy-trinh.js` 71/76 (5 cũ), `dieu-phoi.js` 27/27, `cn-apple-web.js` 30/30.
- 14/11 khuya (chủ dự án): **giữ ô "Giao tiếp cho bộ phận"** trong bảng nổi, gợi ý sẵn theo luồng (`dhBSau` web / `dhBPSau_` máy chủ dùng chung bảng kế tiếp: Phôi → Sơn/Taro, Sơn → UV → HT, Taro → HT, HT → Làm đầu khi ngọn chưa làm đầu xong rồi → ĐG, Làm đầu → trả HT). Chỉ bộ phận đang giữ hàng (hoặc chủ sở hữu) đổi được.

## 14/11 khuya – sắp xếp lại tab Đơn hàng (chủ dự án 5 yêu cầu)
- Chủ dự án chốt: "Theo dõi" gộp vào tab mới; bảng trên Tổng quan TP/PP là **bản gọn** (chỉ đơn có việc ở bộ phận mình) + nút "Xem tất cả"; **Đơn trễ hẹn = quá deadline giao khách**, trễ hẹn bộ phận có thống kê + nhắc riêng; **Đến hạn 10 ngày không gồm đơn trễ**; menu Đơn hàng nút to màu nhấn.
- `DH_NHOM` còn 2 mục: **Trạng thái đơn hàng** (Đơn ưu tiên · Đơn trễ hẹn `dhVeTre` · Đến hạn 10 ngày `dhVeHan10` · Tất cả đơn (như Sheet) – tab "Trạng thái đơn hàng" cũ, đổi tên vì trùng tên mục) và **Số liệu sản xuất** (Việc theo xưởng · Công đoạn · Sản lượng · Công suất · Thay đổi hôm nay · Thống kê theo kênh · Thống kê ↗). Bỏ `dhVeGom`; tên xem cũ đổi qua `DH_CU` (chuy→tre, thoihan→han10, gom→bang). Link mã đơn cũ → `dhMoDon` (bảng đơn lọc đúng mã). Ô "Sắp tới hạn" thành "Đến hạn 10 ngày tới" (`DH_HAN=10`, cùng số với tab).
- Bảng nhóm `dhBangNhom` (trễ 1–7 / 8–30 / >30; đến hạn 0–3 / 4–7 / 8–10, có tổng nhóm, bấm mã đơn mở dòng SP xếp gậy→ngọn→chuôi, FC→MIX→GF). **Trễ hẹn bộ phận** `dhTreBP` / `dhVeTreBP` (cuối tab Trễ hẹn): mã còn thiếu, BP trong cấu hình BTP, qua ngày `hen[bp]`, `qua[bp] < sl`; bảng 7 BP + tổng, bấm BP ra danh sách theo khối.
- Vạch % cả đơn `dhThanhMa` ở dòng đầu mỗi đơn trong bảng đơn (soat-giao-dien-cuoi: vạch 3px, % ghi cạnh kênh).
- Tổng quan TP/PP: mục vá **46** `tests/don-giao-nhan/va-don-noi-bat-web.py` (menu `dh` đầu nhóm Sản xuất + CSS `#navDH`; bọc `vDash` → `dhTQGan` chèn `#tqDH` sau ô số + các thông báo) → `dhTQVe` (3 tab, ≤ 8 đơn, cột Còn ở BP mình / Hẹn BP mình, nhắc "x mã trễ hẹn trả ở BP"). `dhTai` vẽ lại cả khi đang ở `dash`.
- Kiểm thử: không có dữ liệu thật → khung thử dữ liệu giả ở scratchpad (`thu/harness.js`) 26/26 (máy tính + điện thoại). Sửa kỳ vọng `quy-trinh-web.js` (2 mục, 5 thẻ con, tre/han10 thay chuy/gom) – chưa chạy được vì thiếu DATA.
- **Chờ duyệt (mục 5)** – đề xuất bỏ: dải 5 số (giữ "đơn" + "sp thiếu"), 2 ô Quá hạn/Tới hạn trong tổng Ưu tiên, chú thích thanh % lặp ở 5 chỗ, dòng ghi chú cuối trang (vào ⋯), nhóm "Nguy cơ trễ" (60 sp/ngày cố định), code chết `dhVeChuY`/`dhVeThoiHan`/`dhQuaHanTuoi`, cột "Dòng đã ghi số"/"Hẹn trả gần nhất" ở Công đoạn, bớt cột bảng từng lần chụp ở Sản lượng; chuyển bảng "Quá ngày hẹn trả" ở Công đoạn sang bảng trễ hẹn bộ phận.

## 15/11 – chủ dự án duyệt mục 5 + đổi tiếp
- Duyệt bỏ 1, 2, 4–8; mục 3: chú thích vạch % chỉ để ở Tất cả đơn (cột Mã đơn). Đã làm: dải số còn "đơn" + "sp còn thiếu"; ghi chú cuối trang vào menu ⋯ (`dh-menughi`); bỏ nhóm "nguy cơ" trong `dhChuY`; xóa `dhVeChuY`, `dhVeThoiHan`, `dhQuaHanTuoi`, `dhVeUuTien`, `dhVeTre`; Công đoạn bỏ cột "Dòng đã ghi số" / "Hẹn trả gần nhất", bảng quá hẹn thay bằng `dhVeTreBP`; Sản lượng (bảng từng lần chụp) bỏ cột kênh, Đơn mới, Điều chỉnh, Mất.
- **Bỏ tab Đơn ưu tiên / Đơn trễ hẹn** → 2 nút đầu tiên trong **Tất cả đơn** (`DHB.tab` = `@uu` / `@tre`): `@uu` = tab Sheet "ĐƠN ƯU TIÊN" (bản chép, chỉ xem, ẩn nút trùng ở cuối) nếu có, không thì dòng ghi "ưu tiên"; `@tre` = mọi dòng của đơn quá deadline giao khách (`dhTreDs`, trễ lâu nhất trên), bảng trễ hẹn bộ phận ở dưới. Tên cũ `tre`/`uutien`/`chuy` chuyển qua `dhCu`.
- **Công suất & deadline** chuyển sang Trạng thái đơn hàng (mục: Tất cả đơn · Đến hạn 10 ngày · Công suất & deadline); trong đó **Thử nhận đơn mới, Thử đẩy một đơn lên ưu tiên, Ngày dự kiến xong từng đơn lên đầu** (cắt chuỗi `h` theo mốc P1/P2/P3 trong `dhVeCongSuat`).
- Kiểm thử: khung dữ liệu giả 30/30 (máy tính + điện thoại); `quy-trinh-web.js` sửa kỳ vọng (3 thẻ con, bỏ ca dhVeChuY / nguy cơ) – chưa chạy vì thiếu DATA.

## 15/11 – bậc ưu tiên mới (3 bậc, thay 5 bậc 13/11)
- Chủ dự án chốt: **1** = WEB LẺ ĐƠN THƯỜNG + WEB LẺ CUSTOM + **mọi tab POD** (`/^POD/`); **2** = đơn trễ hạn (dòng đã qua deadline **hoặc** tên hàng trong tab TRỄ HẠN) + đơn ưu tiên (ghi "ưu tiên" / tên trong tab ĐƠN ƯU TIÊN, dòng Kho); **3** = còn lại. Trong mỗi bậc **deadline sớm trước** (bậc 2 trộn trễ + ưu tiên).
- Sửa `dhBacDong` / `dhBac` (mặc định 3), `DH_SO_BAC=3`; `dhMoPhong` không đổi → áp cho Ngày dự kiến xong, Thử nhận đơn, Thử đẩy ưu tiên, Thống kê theo kênh (hạn đề xuất, bảng "Thứ tự làm – 3 bậc", Bậc 1 quá hạn), chữ giải thích.
- Kiểm thử: `thu/bac.js` (dữ liệu giả) – 9 ca phân bậc + mô phỏng thứ tự A2, A1 (bậc 1 theo deadline) → B1, B2 → C1; khung thử 30/30.

## 15/11 – Note cho từng mã hàng (cột LOẠI PHÔI)
- Chủ dự án chốt: dùng luôn cột **LOẠI PHÔI** của Sheet đơn (C067 vốn ghi chú ở đây), hiện cả ghi chú có sẵn; **mọi người xem tab Đơn hàng đều thấy**; **một Note mỗi mã, sửa được**; chỉ **C019, C056, C067** (+ chủ sở hữu) tạo / sửa / xóa.
- Máy chủ (`don-hang.gs`): `o.phoi` giữ 500 ký tự; `meta.phoi`; `DH_NOTE_NV`, `dhCoNote_` (mã NV gắn đúng 1 tài khoản đang dùng, như Cấu hình gậy) → `q.note`; `luuGhiChuDon(token,{tab,dong,ten,cu,note,boQua})` – khóa, kiểm tên hàng (dòng lệch), xung đột khi người khác vừa sửa, không ghi đè công thức, nhật ký "Note mã hàng", xóa nhớ tạm.
- Web: `dhNoteO` dưới tên ở cột Mã sản phẩm (ô vàng 📝; "+ Note" / bấm để sửa, textarea + Lưu / Hủy), `dhNoteLuu`. Bản chép (tab ĐƠN ƯU TIÊN / TRỄ HẠN) chỉ xem.
- Lưu ý: chữ trong LOẠI PHÔI cũng dùng khi phân loại SKU (vd "CHỈ ĐẶT NỐI") – đã có từ trước. Tab Đơn hàng chỉ mở cho ADMIN + TP: nếu C019/C056/C067 là vai trò khác thì chưa vào được tab.
- Kiểm thử: `thu/note.js` (máy chủ, giả lập) 7/7; `thu/noteweb.js` 10/10 (máy tính + điện thoại); khung thử 30/30.
