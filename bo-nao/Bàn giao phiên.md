# Bàn giao phiên

Nhóm: Chung · Cập nhật 02/11/2026
Liên quan: [[00 Mục lục]] · [[Liên kết và công cụ]] · [[Việc chờ chủ dự án]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]] · [[KPI Kiểm thử]]

## 17/11 – 4 VIỆC TIẾP THEO ĐƠN HÀNG: XONG + đã push (chờ 2-CAP-NHAT.bat)
- Làm: (1) ngày dự kiến xong cho Bán hàng (+2 ngày làm việc), (2) báo "đang xem đơn này", (3) thanh Hoàn tác 10 giây sau hủy / bớt, (4) giai đoạn 2 khóa cột Sheet đơn (cảnh báo trước, khóa sau), + bảng đơn nhà máy 4 cột trong tab Đơn bán hàng. Bỏ qua việc 5 (CN thai sản C454, C451) theo chủ dự án.
- Chi tiết: [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] mục "17/11 – ĐÃ LÀM". Kiểm thử: du-kien.js 44, huy-don.js 93, don-ban.js 65, don-ban-web.js 26, don-hang.js 142, tab10.js 19.
- Thêm sau: thống kê theo kênh + "nhà máy kín lịch đến …" (+6 ngày làm việc) ở đầu Bảng đơn nhà máy.
- Thêm sau nữa: **TẠM DỪNG SẢN XUẤT** (mã / cả đơn, chạy lại, nhắc, Sheet vàng nhạt) – mục "TẠM DỪNG SẢN XUẤT (17/11)" trong ghi chú thiết kế.
- 17/11 tối: Sheet đơn giữ nguyên khi hủy / bớt / tạm dừng; tab ĐẾN HẠN 10 NGÀY sang file riêng "Đơn đến hạn 10 ngày (web)".
- 17/11 tối: đổi thứ tự bậc – Dealer → trễ + ★ + hàng ưu tiên → còn lại.
- Kế tiếp (chưa được yêu cầu): chủ dự án bật cảnh báo → 14 ngày → khóa hẳn; giai đoạn 3 (chuyển đơn cũ vào CSDL mới).

## 16/11 KHUYA (3) – GIAI ĐOẠN 1 TRANG BÁN HÀNG NHẬP ĐƠN: XONG + đã push (chờ 2-CAP-NHAT.bat)
- Chi tiết: [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] mục "GIAI ĐOẠN 1 – ĐÃ LÀM". Kế tiếp (nếu chủ dự án muốn): ngày dự kiến xong cho Bán hàng, giai đoạn 2 (hủy / bớt / đổi hạn chỉ qua web).

## 16/11 KHUYA (2) → PHIÊN MỚI: LÀM GIAI ĐOẠN 1 – TRANG BÁN HÀNG NHẬP ĐƠN (ĐÃ XONG)
- Chủ dự án đã chốt 4 điểm (tài khoản, cách nhập, duyệt, Bán hàng xem gì) – đọc [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] mục "GIAI ĐOẠN 1 – Chủ dự án chốt". Không hỏi lại.
- Giai đoạn 0 đã push (commit 581ce27 + sửa "3/5" vào ô Mã đơn, không cột STT). Chủ dự án chưa bấm 2-CAP-NHAT.bat.
- Dữ liệu thử: tải lại Sheet CSDL KPI (xlsx) qua Drive → `csdl-tu-drive.py` (scratchpad mất khi đổi phiên). Kiểm thử mẫu: `tests/huy-don.js` (máy chủ giả + Chromium).

## 16/11 khuya – GIAI ĐOẠN 0 HỦY / BỚT MÃ: XONG + đã push (chờ chủ dự án bấm 2-CAP-NHAT.bat)
- Chi tiết + tên hàm: [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] mục "GIAI ĐOẠN 0 – ĐÃ LÀM". Kiểm thử `tests/huy-don.js` 89/89.
- Kế tiếp (khi chủ dự án gửi danh sách): giai đoạn 1 – vai trò Bán hàng + trang tạo đơn. Còn treo: 2 CN thai sản C454, C451.

## 16/11 KHUYA → PHIÊN MỚI: LÀM GIAI ĐOẠN 0 HỦY / BỚT MÃ (ĐÃ XONG 16/11 khuya)
- Chủ dự án đã chốt mọi câu hỏi – đặc tả đầy đủ ở [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] (mục "Chủ dự án trả lời" + "Đặc tả giai đoạn 0"). Không hỏi lại.
- Tóm tắt: web tự tạo Sheet CSDL riêng (lớp phủ hủy/bớt + sổ sự kiện + thông báo), Sheet cũ chỉ bị tô xám dòng hủy; quyền C019/C056/C067; chỉ ghi lý do; mục "Đơn đã hủy" + thông báo cho mọi người xem bảng đơn; chuyển "mã 5/11" sang cột STT đầu bảng; không làm bảng rối hơn.
- Còn treo: 2 CN thai sản C454, C451 (chủ dự án chưa trả lời có cho nghỉ không). Danh sách tài khoản Bán hàng: chủ dự án gửi sau (giai đoạn 1).

## 16/11 – RÀ SOÁT TOÀN BỘ XONG (đã push) – đọc [[KPI Rà soát toàn bộ (16-11)]]
- Hỏi 3 chuyên gia + dùng kết quả vận hành; chủ dự án cho "sửa theo ý bạn", góp ý sau khi dán. Đã sửa bảo mật, năm 12→1, tab 10 chép nhầm dòng, chữ lỗi thời, code chết, CSS điện thoại.
- Chủ dự án cần chạy `2-CAP-NHAT.bat` (gồm cả đợt 15–16/11). Tab ĐẾN HẠN 10 NGÀY có thêm cột MÃ DÒNG WEB sau lần làm mới 7h kế tiếp (hoặc bấm Làm mới).
- Dữ liệu thử lấy lại: Drive CSDL KPI (xlsx) + Sheet cầu nối (CSV, khối 61 cột bắt đầu ở ô `#TAB`, data bắt đầu ngay cột đó).
- Chờ chủ dự án: có muốn đổi cách xếp để đơn gần xong (vd. Seybert còn 30/177) được ưu tiên không.

## 16/11 rạng sáng – làm thêm trước khi chuyển phiên (đã push)
- **Sửa thẳng trong bảng đơn, 1 nút "Lưu vào Sheet"** (thanh dưới đáy, ô đã sửa tô vàng): SL đặt + deadline (4 tài khoản C019 / C056 / C077 / C067 + chủ sở hữu); Hỏng làm bù của Đóng gói (cột riêng "Hỏng làm bù" dưới Đóng gói) + Có thể giao + Trong kho + ĐG + Đã trả khách (TP/PP Đóng gói + 4 tài khoản). Đổi deadline 1 dòng → các dòng cùng đơn cùng hạn cũ đổi theo. Máy chủ `luuBangDon` (1 khóa, bỏ qua ô công thức, hỏi ghi đè khi Sheet vừa đổi). Hỏng của BP khác vẫn nhập ở bảng nổi (chủ dự án chốt). Bỏ form deadline trong bảng nổi (`dhDlForm`/`dhDlLuu` đã xóa). `luuCotPhuDon` nới quyền ĐG cho 4 tài khoản.
- **Bỏ nút "Tất cả kênh"**: mặc định tab kênh đầu (`dhBTabMD`); đang tìm mã / ngày thì tìm mọi kênh (chip "Kết quả tìm ở mọi kênh").
- **Bỏ dính đầu trang ở tab Đơn hàng** (menu chính + thanh Bảng đơn/Thống kê), chỉ dính tiêu đề cột; khung bảng cao gần hết màn hình; tiêu đề cột 2 dòng, cột Mã SP 210px, chú thích 140–190px; cột trái dính nền đặc.
- **Lỗi "Đang tải…" mãi ở Nhân sự › Bộ phận ngoài SX**: cờ `NSNTai` kẹt khi kết quả về lúc đã sang tab khác / lỗi máy chủ → callback `__luonGoi` + tự thử lại sau 60 giây; máy chủ bọc try/catch (`nsNgoaiDs_`). Máy chủ + file Drive vẫn đúng (86 người).
- Kiểm thử: cot-phu 21 (thêm 11 cho luuBangDon), don-hang 141, uu-tien-web 28, tab10 14, nhan-su-ngoai 10, quy-trinh 76, ho-so 28 – đạt. Giao diện kính (`html.rs`) ép nền ô trong suốt → thêm luật nền đặc cho cột trái dính + tiêu đề cột.

## BÀN GIAO 15/11 ĐÊM → PHIÊN MỚI: RÀ SOÁT TOÀN BỘ (đọc phần này trước)
**Mọi việc đã commit + push** lên `claude/beautiful-ptolemy-f2j7za` (commit cuối 980ecd6). Chủ dự án **chưa chạy `2-CAP-NHAT.bat`** cho các đợt 15/11 (một lần là đủ). Chi tiết mọi việc 15/11: [[KPI Gậy 1 khúc, ưu tiên và nhập nhanh (15-11)]].

**Đã làm 15/11 (tóm tắt):** Thống kê (cột gradient, I-MR rộng, Dự báo đơn tháng tới) · gậy 1 khúc + bản vẽ · bậc ưu tiên mới + ★ gắn ưu tiên (C019, C056, C077, C067) + làn lẻ 10–13% + gợi ý ngày hẹn · 4 tài khoản sửa deadline lưu về Sheet · tab ĐẾN HẠN 10 NGÀY trong Sheet đơn (đồng bộ 2 chiều theo MÃ DÒNG WEB) · bảng đơn: mục "Đến hạn 10 ngày tới", ô đầu trang "Lẻ / POD quá 10 ngày", dòng TỔNG SL CÒN THIẾU trên cùng mỗi đơn, 3 cột Đóng gói, cột Chú thích (kiểu Note, trước các bộ phận), Hỏng cần làm bù · lưu đồ nhà máy 3 làn (bỏ ngọn lẻ Tip → Đóng gói) · 6 bộ kiểm thử cũ đạt lại.

**VIỆC PHIÊN MỚI: rà soát toàn bộ code + giao diện, hỏi chuyên gia, tìm mục trùng / thừa** (chủ dự án yêu cầu 15/11). Phiên cũ đã giao 4 chuyên gia, chỉ `quan-ly-van-hanh` xong (3 người kia bị ngắt do hết lưu lượng – chạy lại):
- `soat-giao-dien-cuoi`: mục / thẻ / nút trùng hoặc thừa, chữ lỗi thời (còn nhắc "30%", "Dealer bậc 1"?), code chết (`dhVeHan10`, `dhVeNhapNhanh`, `dhLe10Ds` chỉ còn dùng cho ô đầu trang), điện thoại 390px.
- `bao-mat-ung-dung`: quyền các hàm mới `luuUuTienDon`, `luuDeadlineDon`, `luuCotPhuDon`, `lamMoiTab10`; **3 hàm trigger `DH_TAB10_TAO` / `DH_TAB10_DONG_BO` / `DH_TAB10_SUA` không có "_" nên trình duyệt gọi được** (cần chặn hoặc kiểm); ghi Sheet chặn công thức.
- `general-purpose` (logic): tính sai, năm 12 → 1, chia 0, code chết, hàm trùng.
- **Kết quả `quan-ly-van-hanh` (chưa xử lý, chờ chủ dự án duyệt):**
  - A. 5 chỉ số cùng tên khác công thức: (1) "Trễ hạn" 3 cách (ô Thống kê theo dòng, `dhCSTinh` theo đơn + tách `leQua`, `dhVeKenh`/báo cáo `dhSt` gồm cả PK) → gộp 1 hàm theo `dhCSTinh`; (2) "Số ngày tồn" (`tong/cs`) vs `K.ngayCan` (`ceil`) → giữ `K.ngayCan`; (3) "Giao đúng hạn" ô 4 tuần (`C.kenh` chưa qua `dhChayLoc`) vs biểu đồ `dhVeOTD` (đã lọc) vs fill rate tab Sản lượng → gộp, dùng số đã lọc (gốc ở `dhDongChay_` máy chủ); (4) "Tải" 3 số (`ky.tl` Công suất, `tai1`, `tai2` Dự báo) → giữ `ky.tl`, Dự báo đổi tên "Nhu cầu tháng tới ÷ công suất", bỏ `tai2`; (5) "Công suất" 4 nguồn → bảng Ngày dự kiến xong giữ 1 cột theo ⚙, thực đo chỉ ghi chú.
  - B. Trùng: `dhLichGiao` 14 ngày (bỏ, trùng tải 12 tuần; còn dùng `new Date()`) · ô từng xưởng `dhVeXuong` vs Bullet + Bản đồ nhiệt (gộp) · Đóng gói hiện 3 lần (giữ I-MR + ô tháng, bỏ cột 40 ngày `dhVeSanLuong`) · "Còn thiếu theo kênh" mục 7 `dhVeThongKe` vs `dhVeKenh` vs báo cáo (gộp vào `dhVeKenh`) · `dhVeTreBP` + `dhVeHanChuan` (gộp 1 bảng 2 cột) · giữ ô Vào / Ra 7 ngày, giữ aging web + 3 nhóm tuổi PDF.
  - C. Ít giá trị / code chết: ô "Dòng đơn đang thiếu" (bỏ) · "Hỏng cần làm bù" ẩn khi tổng 0 · OTD tuần tạm ẩn khi < 20 ngày chụp · code chết `dhVeSQDCP`/`dhSQDCP`, `dhVeVRT`, biến `P`/`pk` mục Pareto, nhánh `DHV==='thongke'` trong `dhTrangVe`.
- Cách làm: gom 4 kết quả thành 1 danh sách Bỏ / Gộp / Giữ / Sửa → **trình chủ dự án duyệt trước khi xóa**; lỗi bảo mật / tính sai rõ ràng thì đề xuất sửa ngay. Rà xong: chạy kiểm thử (dưới), chụp ảnh bản xem thử gửi chủ dự án.

**Kiểm thử / dữ liệu (scratchpad mất khi đổi phiên – lấy lại):**
- DATA: Drive `download_file_content` Sheet CSDL KPI (xlsx) → `python3 -I kpi-app/tests/csdl-tu-drive.py <file> $S/dl/csdl.json`.
- Đơn thật: Sheet cầu nối `1lZ1AS0-DiWD4uX_9mpqHN2PJKsgDhMGuEqTD5G3tffk` (`text/csv`) → tách khối 61 cột theo ô `#TAB <tên>` dòng 1 → `{tab: rows}` JSON → `DH=` cho `tao-ban-xem-thu.js` (`GIO=2026-11-16T09:30:00+07:00 BO_HO_SO=1`). Tài khoản thử: `chienpham`, `tpdg` (TP Đóng gói), mật khẩu bản thử `demo`.
- Bộ cần DATA: don-hang 141, quy-trinh 76, ho-so 28, luu-tru 15, cau-hinh-gay 50, mot-khuc 20, uu-tien-web 28, tab10 14, cot-phu 10. Không cần DATA: du-bao-web 18, hai-lan-web 11, han-chuan 27. Lỗi cũ có sẵn (dữ liệu cũ): bao-mat.js, com-trua.js.
- Repo clone nông → `git fetch --unshallow origin claude/beautiful-ptolemy-f2j7za` trước khi dựng (link ảnh jsDelivr).

## 15/11 chiều – XONG + đã push (3 commit): đọc [[KPI Gậy 1 khúc, ưu tiên và nhập nhanh (15-11)]]
- Thống kê: cột gradient, I-MR rộng; **Dự báo đơn tháng tới** (phần 3 ERPNext). Gậy 1 khúc đủ các phần + bản vẽ. Bậc ưu tiên mới (Dealer ra bậc 3), nút ★ ưu tiên cho 4 tài khoản, làn đơn lẻ 10–13%, gợi ý ngày hẹn, cảnh báo đơn lẻ quá 10 ngày, TP nhập nhanh trong Đến hạn 10 ngày.
- 6 bộ kiểm thử cũ đã đạt hết (don-hang 141, quy-trinh 76, ho-so 28, luu-tru 15, cau-hinh-gay 50): kiểm thử nay **xóa trống các sheet do web tự ghi** trong bộ nhớ trước khi chạy. Lấy DATA: Google Drive tải Sheet CSDL KPI (xlsx) → `csdl-tu-drive.py` → scratchpad.
- Còn chờ: xác nhận PGĐ SX thứ 2 (đang để C056), bàn tab Đến hạn 10 ngày trong Sheet, BOM (chưa có dữ liệu), phần 1 báo cáo hỏng (đủ ~1 tháng DonHangHong, khoảng giữa tháng 12).

## Phiên mới – nghiên cứu qcadoo + BOM ERPNext + chỉ số xưởng xong
- Kết quả: [[KPI Nghiên cứu MES, BOM và chỉ số xưởng (14-11)]]. Phần 2 **hạn chuẩn bộ phận đã làm + push** (chờ chủ dự án chạy 2-CAP-NHAT.bat). Kế tiếp: phần 1 báo cáo hỏng (khi DonHangHong đủ ~1 tháng), phần 3 dự báo, BOM chờ dữ liệu.

## 16/11 (tối) – XONG: làm lại tab Thống kê (commit 18b7a97)
- Chủ dự án chọn **phong cách 1 "Phòng điều khiển 4.0"** (demo https://claude.ai/artifact/6Hd1jtUMd8tnEqM86Vtjd2) và cho đẩy lên luôn. Thống kê vẫn **chỉ chủ sở hữu** thấy.
- Đã làm trong `kpi-app/tests/quy-trinh/quy-trinh-web.html`: bỏ mục `tq` khỏi `TK_TAB` (mặc định `TKV='sx'`), `tkVe` nhánh `sx` tải số liệu tháng rồi chèn `tkVeTQ(D)` (6 ô) lên đầu; bỏ `dhVeSQDCP()` khỏi `dhVeThongKe` (PDF lãnh đạo vẫn có SQDCP); `dhMau()` nền tối → `dhMau4()` (nét sáng, lưới trắng mờ, màu nhấn lấy `--g-accent/--g-warn/--g-bad` của tông kính); khối CSS "Biểu đồ 4.0" (ánh sáng nhẹ cho SVG, số JetBrains Mono, ô kính, cột gradient). Nền sáng + PDF (`dhMau(true)`) giữ màu cũ.
- Kiểm thử: tong-quan-web 26/26, cn-apple-web 30/30, tang-toc-3-web 24/24, bo-hom-nay-web 14/14, holo-web đạt; quy-trinh-web / ho-so / don-hang / luu-tru có lỗi **giống hệt bản trước khi sửa** (dữ liệu mẫu cũ, không do lần này).
- Chưa làm (để sau nếu chủ dự án muốn): cột trong biểu đồ SVG xưởng vẫn tô đặc (chưa gradient từng cột).

## 16/11 – ĐANG LÀM: 3 phần học từ ERPNext (đọc [[KPI Học hỏi ERPNext (16-11)]] trước)
- Đã xong bước 0 (lưu hỏng hằng ngày vào bản chụp → DonHangHong). Kế tiếp: phần 2 hạn chuẩn (chờ chủ dự án duyệt bảng số ngày chuẩn + đệm), rồi phần 1, phần 3. BOM chờ dữ liệu vật tư.

## 16/11 – Phôi 2 nhánh có 2 ô "Giao tiếp cho bộ phận" (đã push, chờ 2-CAP-NHAT.bat)
- Chủ dự án trả lời: C019/C056/C067 đã có vai trò; Sheet không có công thức cộng cột Phôi. Plugin Manufacturing + Design: ListPlugins vẫn trống (chưa bật) – nhắc bật trong Customize rồi mở phiên mới. Sheet thật quá lớn để tải qua Drive (cần cách khác nếu muốn thử số thật). – [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]]

## BÀN GIAO 15/11 (phiên dài → phiên mới) – ĐỌC PHẦN NÀY TRƯỚC
**Mọi việc đã commit + push** lên `claude/beautiful-ptolemy-f2j7za`. Chủ dự án **chưa chạy `2-CAP-NHAT.bat`** cho các đợt 14/11 khuya → 15/11 (một lần cập nhật là đủ). Chi tiết từng việc: [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]] (các mục 14/11 khuya, 15/11), [[KPI Thống kê không tính hôm nay (09-11)]].

**Đã làm 14–15/11 (tab Đơn hàng)**
- Menu: Đơn hàng đầu nhóm Sản xuất, nút to Azure (mục vá 46 `tests/don-giao-nhan/va-don-noi-bat-web.py`). Tổng quan TP/PP: bảng gọn Trạng thái đơn hàng dưới thông báo (`dhTQVe`, `dhTQGan`).
- Tab Đơn hàng 2 mục: **Trạng thái đơn hàng** (Tất cả đơn – 2 nút đầu ★ Đơn ưu tiên / Đơn trễ hẹn; Đến hạn 10 ngày; Công suất & deadline – Thử nhận đơn / Thử đẩy ưu tiên / Ngày dự kiến xong lên đầu) và **Số liệu sản xuất**. Bỏ Theo dõi, Gom theo đơn, Chi tiết từng dòng; vạch % cả đơn ở cột Mã đơn; bảng Trễ hẹn ở bộ phận.
- **Bậc ưu tiên 3 bậc**: 1 = DEALER + Web lẻ thường + Web lẻ custom + mọi tab POD; 2 = trễ hạn (quá deadline hoặc có trong tab TRỄ HẠN) + ưu tiên; 3 = còn lại; trong bậc deadline sớm trước (`dhBacDong`).
- **Note mã hàng** = cột LOẠI PHÔI (C019, C056, C067 + chủ sở hữu sửa; mọi người xem) – `luuGhiChuDon`.
- **Phôi gậy 2 khúc tách 2 nhánh** (chuôi → Sơn, ngọn → Ngọn Taro), Sheet ghi chung 1 ô 2 dòng; Sơn / Taro xác nhận hẹn đúng nhánh (`dhP2Gan_`, `p.phoi2`, `PHOI_C`/`PHOI_N`).
- **Deadline mới**: cột "Hạn mới HT đơn cũ" thay deadline ở cả máy chủ (`o.dl`, giữ `o.dlGoc`), bảng hiện "gốc dd/mm" gạch ngang.
- Tổng quan TP/PP + ban điều hành tính tới hết hôm qua (mục 43).

**Cách làm việc mới (chủ dự án chốt 15/11)**
- **Chia việc với Qoder** – `kpi-app/HUONG-DAN-QODER.md` (Qoder việc nhỏ, Claude việc lớn + gộp). Phiên đám mây không điều khiển trực tiếp được Qoder; Remote Control chưa có trên máy chủ dự án.
- Chủ dự án vừa thêm plugin **Claude for Manufacturing** (và có thể **Design** của Anthropic / Knowledge Work) – phiên mới kiểm tra bằng ListPlugins / danh sách skill, báo chủ dự án skill nào dùng được cho web KPI.

**Kiểm thử**: không có dữ liệu Sheet thật (scratchpad cũ mất). Khung thử dữ liệu giả ở scratchpad phiên cũ (sẽ mất) – nếu cần dựng lại: trang thử nạp `QuyTrinh.html` + giả `call()` trả `layDonHangXuong`. `quy-trinh-web.js` đã sửa kỳ vọng nhưng chưa chạy (thiếu DATA). Lỗi cũ có sẵn: don-hang.js 11, quy-trinh-web 3–5, quy-trinh 5.

**Còn chờ chủ dự án**: chạy 2-CAP-NHAT.bat rồi xem thử; tài khoản C019/C056/C067 có vai trò ADMIN/TP chưa (tab Đơn hàng chỉ mở ADMIN + TP); Sheet có công thức cộng cột Phôi không (ô Phôi gậy thành chữ 2 dòng).

## 15/11 – Đơn hàng sắp xếp lại xong (đã commit, chờ chủ dự án chạy 2-CAP-NHAT.bat)
- Xong mục 1–5 (đã duyệt bỏ/giữ), Ưu tiên/Trễ hẹn thành nút trong Tất cả đơn, Công suất & deadline sang Trạng thái đơn hàng. – [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]]

## Bàn giao 14/11 khuya → phiên mới (việc ĐANG CHỜ làm)
- Đã xong + đã push: luồng ngọn mới (Taro → HT → Tip → trả HT → ĐG) áp mọi chỗ; Trạng thái đơn hàng (bảng nổi gọn: đã giao/đặt + hẹn + giao tiếp cho bộ phận, màu xoay vòng theo đơn, bỏ Chi tiết từng dòng); bộ cài clasp tự gỡ file lạ `_qt_check`. – [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]], [[KPI Cập nhật bằng clasp]]
- **Yêu cầu chủ dự án (đã làm 1–4, xem mục trên)**:
  1. Menu: "Đơn hàng" lên **đầu mục Sản xuất**, chữ to + nổi bật hơn mục khác.
  2. TP/PP: trang Tổng quan, **ngay dưới các thông báo**, hiện luôn bảng Trạng thái đơn hàng.
  3. Bảng Trạng thái đơn hàng: tab **Đơn ưu tiên** và **Đơn trễ hẹn** lên đầu; thêm tab **Đến hạn trong 10 ngày tới** (Claude tự lọc theo deadline). **Bỏ mục "Theo dõi"** – tab Đơn hàng chỉ còn 2 mục: **"Trạng thái đơn hàng"** và **"Số liệu sản xuất"**.
  4. **Bỏ "Gom theo đơn"**, nhưng thêm **thanh % hoàn thành ở cột Mã đơn** trong bảng.
  5. Rà soát + **hỏi chuyên gia** (quan-ly-van-hanh, soat-giao-dien-cuoi…) phần trùng lặp có thể bỏ; số liệu thống kê có ý nghĩa thì giữ, không quan trọng thì bỏ – trình chủ dự án duyệt danh sách bỏ trước khi xóa.

## Bàn giao 14/11 (phiên dài – mở phiên mới cho việc tiếp theo)
- Xong: Đơn hàng giao nhận theo bộ phận + màu Navy (commit 14/11), CLAUDE.md đã nới quy tắc tiết kiệm token. Chờ chủ dự án dán 3 file. – [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]]
- Còn mở: 48 SKU chưa khớp dòng gậy, Ø bảng ngọn gậy đánh – [[KPI Cấu hình gậy – bản vẽ kỹ thuật (08-11)]]. 11 lỗi cũ don-hang.js + 5 lỗi cũ quy-trinh-web.js chưa sửa.
- Dựng thử: `DATA=$S/that/csdl.json DH=$S/that/dh-that.json` (scratchpad cũ có thể đã mất – nếu mất thì xin chủ dự án JSON xuất Sheet).

Ghi chú này để phiên Claude Code mới nắm bối cảnh ngay. Đọc `CLAUDE.md`, rồi ghi chú này, rồi [[Liên kết và công cụ]] (mọi link Drive, repo, artifact, công cụ), rồi [[00 Mục lục]].

## PHIÊN 02/11 (tiếp) – 6 yêu cầu đã xong
- 03/11: mở tab Quy trình cho trưởng / phó phòng (chỉ xưởng mình, gửi đề xuất → chủ sở hữu duyệt) – [[KPI Quy trình sản xuất]] mục "Đợt 7".
- Thêm sau đó: Cấu hình sản phẩm trên web + báo sản phẩm mới ở Việc hôm nay + tự đọc tab kênh mới; PDF hướng dẫn 2 tab đã gửi (nguồn `kpi-app/tests/huong-dan/`). Chi tiết: [[KPI Quy trình sản xuất]] mục "Đợt 6".
- Đã làm + commit + push cả 6 yêu cầu (chi tiết: [[KPI Quy trình sản xuất]] mục "Đợt 5"). Chưa dán: Code.gs + Index.html + QuyTrinh.html (2-CAP-NHAT.bat).
- Chờ: chất liệu các mã chuôi nhảy / phá nhảy / Vũ trụ / Eclipse / Carom; file Excel cấu hình gậy + quy trình nháp; câu tip; họp trưởng phòng; Sơn hệ số lớp.
- Mẹo: repo clone **nông** làm link jsDelivr ghim sai commit khi dựng (SoDo.html đổi) → chạy `git fetch --unshallow origin claude/beautiful-ptolemy-f2j7za` trước khi dựng. Sheet đơn hàng quá lớn để tải qua Drive → dùng bộ đơn giả (`scratchpad/gen/tao-dh.js`) hoặc nhờ chủ dự án tải file lên.

## BÀN GIAO 02/11 (đọc phần này trước)
Phiên 31/10–02/11 rất dài, chủ dự án yêu cầu chuyển phiên mới. **Mọi việc đã commit + push** lên `claude/beautiful-ptolemy-f2j7za`, bộ não + bản đồ artifact đã cập nhật (bản 57). Chưa biết chủ dự án đã dán các đợt 31/10–02/11 lên web chưa (cách dán: bấm đúp `2-CAP-NHAT.bat`, bộ cài đã thay 31/10).

**Đã xong trong phiên** (chi tiết: [[KPI Quy trình sản xuất]], [[KPI Gộp công đoạn và tiến độ BTP]]):
- Tab **Quy trình sản xuất** (chỉ chủ sở hữu): cân bằng tải theo **sp/tháng** (9.000, 26 ngày; nhịp hiện nay đo từ đóng gói ~368/ngày – chủ dự án xác nhận "khá sát"), bảng thiếu/thừa người; **lưu đồ nhà máy** (thẻ kính, đường cong phát sáng, CNC→Ngọn Tip, CNC→Sơn "đầu gậy lết", CNC→Đóng gói "tip bán lẻ", POM Ngọn Taro→Phôi Thô); **lưu đồ từng xưởng kiểu nhà máy** (nhóm công đoạn chỉ để vẽ); điện thoại ẩn lưu đồ; **cách A** bước xuất mỗi xưởng → ra/ngày.
- Tab **Đơn hàng** riêng (chỉ chủ sở hữu): như web app đơn hàng + thống kê + Việc theo xưởng + Kiểm phân loại; bản chụp đơn 9h hằng ngày (sheet ẩn `DonHangChup`).
- Phân loại SKU 4 thông số + kiểu (đánh/nhảy/phá/phá nhảy) + chất liệu; 370/390 tên chắc chắn.
- File **Cau-hinh-gay-va-quy-trinh-nhap.xlsx** đã gửi chủ dự án (chỉ ở scratchpad, không commit; dựng lại bằng `kpi-app/tests/quy-trinh/xuat-cauhinh.js` (cần csdl.json + dh.json lấy lại từ Drive) rồi `tao-excel-cauhinh.py`).

**Chờ chủ dự án:**
- Gửi lại file Excel: 22 tên hàng vàng, sửa cấu hình dòng gậy, **chỗ sai trong sheet "Quy trình nháp"** (quy trình từng xưởng là bản nháp Claude tự soạn – chủ dự án thấy vài chỗ sai). Nhận file → gộp vào `PL_DONG` / `QT_NHAP` (+ sửa tay của chủ dự án trong sheet `PhanLoaiSKU`, `QuyTrinh`).
- Họp trưởng phòng về **gộp công đoạn có định mức khác nhau** – KHÔNG tự gộp danh mục KPI.
- Trả lời 02/11: **Sơn và In UV không làm ngọn** (so sánh với ~346 chuôi/ngày); **Sơn có ghi mỗi lớp sơn thành 1 lần riêng** → số ra/ngày của bước xuất Sơn (Sơn máy + súng ≈ 729) đang gồm nhiều lớp, nên cân nhắc hệ số chia hoặc chọn bước 1 lần/chiếc; câu "tip" chủ dự án chưa rõ – hỏi lại đơn giản: CNC ra ~1.200 tip + phíp/ngày trong khi cần ~350 ngọn/ngày, vậy 1 ngọn dùng mấy tip/phíp, có làm tip bán lẻ / để kho không?

**YÊU CẦU MỚI 02/11 (phiên mới làm ngay, hỏi rõ trước khi sửa code theo CLAUDE.md):**
1. Tab Đơn hàng → "Đơn cần chú ý": hiện thêm các đơn **quá hạn hơn 30 ngày** trong **1 thẻ riêng bên dưới** (hiện `DH_TRE_MAX=30` đang bỏ hẳn các đơn này – `dhChuY`, `dhVeChuY` trong `tests/quy-trinh/quy-trinh-web.html`).
2. Nhãn chất liệu của SKU phải có **2 nhãn: chuôi và ngọn** (hiện `plKieu_` chỉ có 1 `vl`; `dhVlChip`). Tách `vlChuoi` / `vlNgon` (bảng `PL_VL_CHUOI`, `PL_VL_NGON` trong `don-hang.gs`).
3. Thống kê tab Đơn hàng "nhóm hàng × chất liệu" chưa đúng với gậy 2 khúc (chuôi và ngọn có thể khác chất liệu) → thống kê riêng chuôi × chất liệu và ngọn × chất liệu (hoặc ma trận chuôi × ngọn).
4. Hỏi chuyên gia (`quan-ly-van-hanh`…) theo **Lean Six Sigma** để đưa ra các thống kê có giá trị thực tiễn cho tab Đơn hàng.
5. "Việc theo xưởng": **nhãn chất liệu nhiều dòng còn sai** → rà lại cách gán chất liệu theo từng xưởng (xưởng chuôi dùng chất liệu chuôi, xưởng ngọn dùng chất liệu ngọn, SKU dùng cả 2).
6. Tab Quy trình → "Sửa quy trình" **rất khó dùng**, chủ dự án đọc không hiểu → đề xuất 2–3 phương án sửa quy trình dễ hơn (vd. kéo thả thẻ trên lưu đồ xưởng, sửa theo nhóm, nhập từ Excel "Quy trình nháp"), có so sánh + khuyến nghị, hỏi chủ dự án chọn rồi làm.

**Gợi ý việc tiếp theo:** (1) xử lý file Excel khi chủ dự án gửi lại; (2) Sơn: hệ số lớp sơn cho bước xuất; (3) giai đoạn 2 thu tiến độ BTP: kiểm kê 1 lần + phiếu giao nhận 3 điểm (cách B) khi chủ dự án muốn.

## Trạng thái nhánh (25/10)
- Mọi việc đã commit và push lên `claude/beautiful-ptolemy-f2j7za`. Commit cuối: "ảnh web lấy từ repo qua jsDelivr" (25/10).
- Nhánh tạm `claude/beautiful-ptolemy-f2j7za-dang-lam` đã gộp hết vào nhánh chính, không còn dùng.
- Chủ dự án cập nhật web bằng bộ cài clasp: bấm đúp `2-CAP-NHAT.bat` rồi Ctrl+F5. Bộ cài nằm ở `kpi-app/cai-dat-clasp/`; lần gần nhất đã gửi lại bản zip ngày 24/10. Chưa biết chủ dự án đã cập nhật các đợt 24–25/10 lên web hay chưa.

## Việc đã làm 22–25/10 (chi tiết ở từng ghi chú)
- [[KPI Kỹ năng]]: tab mới, ma trận 4 cấp.
- [[KPI Hologram chủ sở hữu]]: giao diện riêng cho chủ sở hữu. Ngày 25/10 sửa lỗi menu điện thoại bị lớp nền tối che.
- [[KPI Bảng KPI tất cả xưởng]], [[KPI Phân tích định mức]] (tự chạy tháng hiện tại), [[KPI Cơm trưa]] (nhắc TP/PP số người chưa báo).
- [[KPI Sơ đồ nhà máy 3D]]:
  - Bỏ KPI / sĩ số ở cả 2D và 3D.
  - 2D dùng 3 ảnh mặt bằng chủ dự án gửi (đã nắn), thêm nút "Tách tầng" có chú thích xưởng, có đèn ban đêm.
  - Bản dọc đã thử rồi bỏ: chủ dự án muốn giữ bản ngang.
- [[KPI Màn đăng nhập Khắc laser]]: nền ảnh nhà máy ban đêm, thẻ nhân viên vân carbon được laser khắc mã và tên.
- [[KPI Ảnh web qua jsDelivr]]: 25/10 ảnh nền đăng nhập + mặt bằng sơ đồ lấy từ repo (công khai) qua jsDelivr, ghim commit; Claude tự làm, không cần Drive.

## Đã làm 31/10 (lịch sử)
- [[KPI Quy trình sản xuất]]: tab mới gộp Kỹ năng.
  - Đã chốt phương án C, chỉ chủ sở hữu xem.
  - Đã đọc 2 file chủ dự án gửi (danh mục mã hàng, trạng thái đơn hàng). Tiền tố mã cho biết chặng BTP; hàng còn thiếu ~12.000, giao ~250/ngày.
  - 31/10 đã làm bản đầu (commit "Tab Quy trình sản xuất…"), chưa dán. Bộ cài clasp mới đọc `danh-sach-file.txt`, đã gửi zip.

## Còn chờ / gợi ý
- 25/10: chủ dự án trả lời 4 câu (xem [[Quyết định của chủ dự án]] mục "KPI và định mức (25/10)"); đã sửa khoản "không nhắc" (chỉ Code.gs, chưa dán). Còn chờ: chủ dự án tự sửa Cân Phôi về 180 trên web; nội dung video giới thiệu.
- Hỏi chủ dự án: có cho chú tê giác Rhino và khung lời chào tự ẩn khi mở menu trên điện thoại không (hiện chúng đè lên cuối menu)? Chưa trả lời.
- Sơ đồ 3D đẹp như ảnh mẫu: chưa chọn. Xem [[Việc chờ chủ dự án]].
- Lỗi kiểm thử có từ trước, không phải do các lần sửa gần đây:
  - `mai-web.js` 31/32 (mục "lúc 10:05").
  - `com-trua-web.js` (viết cho dữ liệu ngày 12/10).
- Phần 3D của `so-do-web.js` chạy chậm (khoảng 10 phút với swiftshader). Phần 2D chạy được riêng, không cần `THREE=`.

## Mẹo môi trường
- Bản xem thử:
  - Dựng: `DATA=$S/dl4/csdl.json OUT=$S/xt-v.html GIO=2026-10-22T17:00:00+07:00 BO_HO_SO=1 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js`.
  - `$S` là scratchpad. Phiên mới tự lấy lại `csdl.json` từ Sheet CSDL KPI qua kết nối Google Drive (cách làm ở [[Liên kết và công cụ]]). Dữ liệu này **không commit**.
- Chromium trong sandbox không tin CA của proxy nên ảnh ngoài (jsDelivr) không hiện khi chụp thử: thay link bằng ảnh nhúng nếu cần chụp.
- Đừng chạy `pkill -f <tên>` trong cùng lệnh có chứa tên đó: nó tự giết chính shell của lệnh.
