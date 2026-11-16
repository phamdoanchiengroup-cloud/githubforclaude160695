# KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)

Nhóm: KPI · Tạo 16/11/2026 · TRẠNG THÁI: chủ dự án ĐÃ DUYỆT giai đoạn 0 (16/11 khuya) – chưa code, làm ở phiên mới
Liên quan: [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]] · [[KPI Rà soát toàn bộ (16-11)]] · [[Quyết định của chủ dự án]] · [[Việc chờ chủ dự án]]

## Câu hỏi chủ dự án (16/11 tối)
- Xóa mã SP / hủy đơn trên web, có tự sửa Sheet không? → hiện CHƯA có; phải xóa dòng trong Sheet "Trạng thái đơn hàng".
- Vấn đề khi chuyển hẳn từ Sheet sang web; nhận / sửa / hủy / bớt mã / tạo đơn trên web; trang Đơn hàng riêng cho Bán hàng (nhập → ban điều hành duyệt + hẹn deadline / trả về sửa → vào bảng trạng thái).

## Chuyên gia đã hỏi
- `quan-ly-van-hanh`: vòng đời 8 trạng thái, quy tắc hủy / bớt khi đã làm dở (giữ cho đơn khác / nhập kho BTP / phế), tăng SL = dòng mới, deadline cam kết không ghi đè, lộ trình 4 giai đoạn, 5 rủi ro.
- `bao-mat-ung-dung`: CSDL Đơn hàng mới (DonHang, DonHangDong, DonHangSuKien, DonHangAnh) với ID bất biến; 1 cửa ghi `dhThucHien_`; xóa mềm; khóa lạc quan theo PhienBan + lenhID chống bấm 2 lần; bảng quyền QUYEN_DON + vai trò BH; 1 dự án Apps Script, trang `?trang=don` → DonHang.html; mỗi cột chỉ 1 nơi được ghi, khóa vùng Sheet; không dùng onEdit đồng bộ 2 chiều.
- `dong-vai-nguoi-dung`: dán từ Excel + kiểm lỗi tô màu, nháp tự lưu, thẻ duyệt trên điện thoại có hạn gợi ý + hoàn tác 10 giây, tin báo nói rõ việc phải làm + bảng trước/sau + nút "Đã nhận", 10 nguyên tắc.

## Vòng đời đơn
NHÁP (Bán hàng) → CHỜ DUYỆT → [TRẢ VỀ (lý do) → NHÁP v2] | TỪ CHỐI | ĐÃ DUYỆT (ban điều hành chốt deadline cam kết + bậc; sinh mã dòng) → ĐANG SX (tự động) → XONG; TẠM DỪNG; HỦY (cả đơn / 1 phần, Bán hàng đề nghị → ban điều hành duyệt).

## Lộ trình (đề xuất)
- GĐ 0: gắn MÃ DÒNG cố định mọi dòng 8 tab kênh; mọi lần ghi theo mã (không theo số dòng); hủy / bớt mã trên web = XÓA MỀM (đánh dấu HỦY + lý do + sổ sự kiện, tô xám dòng Sheet), không xóa dòng.
- GĐ 1: trang Đơn hàng cho Bán hàng (CSDL mới), đơn duyệt xong web chép sang tab kênh. Sheet vẫn là nguồn chính cho đơn cũ.
- GĐ 2: hủy / bớt / đổi hạn / SL chỉ qua web; khóa cột đó trên Sheet (cần chủ Sheet cho quyền).
- GĐ 3: chuyển đơn cũ vào CSDL mới (đối chiếu số dòng + tổng SL), Sheet thành bản chỉ đọc do web sinh.
- Điều kiện qua giai đoạn: 2 tuần đối chiếu lệch = 0.

## Chủ dự án trả lời (16/11 khuya) – ĐÃ CHỐT
1. **Làm giai đoạn 0 luôn**, nhưng **bảng đơn không được rối mắt hơn**. Kèm việc gọn: chữ "mã 5/11" (thứ tự mã trong đơn, đang nằm cạnh tên ở cột Mã sản phẩm – `dem[sk]`/`vt` trong `dhVeBang…` quanh dòng 2617 `quy-trinh-web.html`) **chuyển sang cột đầu tiên** (cột STT mới, trước Mã đơn). Nút hủy / bớt để trong bảng nổi của dòng (`dhBMo`), không thêm cột nút vào bảng.
2. Vai trò Bán hàng: **cần có phần tạo tài khoản** (đã có danh sách nhân sự Marketing / Bán hàng / Kinh doanh – dễ); chủ dự án có thể gửi danh sách sau. Thuộc giai đoạn 1.
3. **Nơi lưu = cách C**: web **tự tạo Sheet CSDL riêng** "CSDL Đơn hàng (web)" (SpreadsheetApp.create lần đầu, lưu id vào ScriptProperties – chủ dự án không phải làm gì), **chép một chiều** từ Sheet "Trạng thái đơn hàng" mỗi lần đọc / 5 phút; hủy / bớt / sổ sự kiện **chỉ ghi vào Sheet riêng**; trên Sheet cũ **chỉ tô xám nền dòng đã hủy** (không đổi chữ, số). Web tính = dữ liệu Sheet cũ + lớp phủ từ Sheet riêng (dòng HỦY bỏ khỏi mọi phép tính; BỚT → SL mới thay SL đặt khi tính).
4. **Người duyệt / thao tác hủy: C019, C056, C067** (C077 KHÔNG có quyền này). Giai đoạn 0 chưa có Bán hàng → 3 người này thao tác trực tiếp (không cần duyệt thêm), có hoàn tác.
5. **Thông báo trên web** + **mục "Đơn đã hủy"** để xem lại thông tin. **Mọi người xem bảng đơn đều thấy** mục này và thông báo; bộ phận đang giữ hàng của mã đó thấy nổi bật.
6. Hàng đã làm dở khi hủy / bớt: **chỉ ghi lý do** (bắt buộc), KHÔNG bắt chọn hướng xử lý hàng dở. Web vẫn lưu ảnh chụp số đã giao từng bộ phận lúc hủy để xem lại.

## Đặc tả giai đoạn 0 (cho phiên làm)
- Sheet riêng, tab: `DongHuy` (mã dòng, tab, mã đơn, tên SP, loại HUY/BOT, SL cũ, SL mới, lý do, ai, lúc, ảnh chụp tiến độ JSON, trạng thái HIEU_LUC/HOAN_TAC), `SuKien` (sổ mọi thao tác), `ThongBao` (ai đã xem). Ghi qua `chuAnToan_`, khóa `khoa_`, kiểm quyền C019/C056/C067 + owner bằng mã NV gắn đúng 1 tài khoản (như `dhCoUu_`).
- Khớp dòng Sheet cũ ↔ lớp phủ: theo **tab + mã đơn + tên SP (+ thứ tự nếu trùng)**, không theo số dòng; Sheet cũ đổi tên / xóa dòng → lớp phủ "mồ côi" hiện cảnh báo trong mục Đơn đã hủy, không áp sai dòng khác.
- Hủy cả đơn = hủy mọi dòng cùng tab + mã đơn. Tô xám: `setBackground` dòng trên Sheet cũ (chỉ màu); hoàn tác → trả màu cũ (lưu màu cũ).
- Web: bảng nổi dòng → nút "Bớt SL" / "Hủy mã này" / "Hủy cả đơn" (chỉ 3 người); dòng hủy biến khỏi bảng chính + mô phỏng ETA + thống kê + tab ĐẾN HẠN 10 NGÀY; mục chip "Đơn đã hủy (n)" cạnh các mục @tre/@uu; chuông thông báo (chưa xem) cho mọi người xem bảng đơn.
- Kiểm thử mới: `tests/huy-don.js` (quyền, khớp dòng, mồ côi, hoàn tác, loại khỏi tính toán, không cộng 2 lần).
- Tham khảo chuyên gia giao diện (`soat-giao-dien-cuoi`) cho chỗ đặt nút + chuông, vì chủ dự án không muốn rối mắt.

## GIAI ĐOẠN 0 – ĐÃ LÀM (16/11 khuya) · chờ chủ dự án bấm `2-CAP-NHAT.bat`
- **Máy chủ** `kpi-app/tests/quy-trinh/huy-don.gs` (nối sau don-hang.gs bởi `va-don-hang.py`):
  - `dhhSS_(tao)` tự tạo Sheet **"CSDL Đơn hàng (web)"** lần hủy đầu tiên (id ở ScriptProperties `DH_CSDL_ID`; file hỏng thì báo lỗi, không tạo file mới). Tab `DongHuy`, `SuKien`, `ThongBao`. Chỉ chủ sở hữu thấy file.
  - `dhDocDonGoc_` = bản đọc Sheet cũ (đổi tên từ dhDocDon_); `dhDocDon_` mới = gốc + lớp phủ (`dhApPhu_`): HỦY bỏ khỏi mọi chỗ (bảng, ETA, thống kê, bản chụp, email, tab ĐƠN ƯU TIÊN / TRỄ HẠN hiển thị); BỚT → `sl` = SL mới, `thieu` giảm phần bớt, `qua` không vượt SL mới; giữ `slGoc`, `quaGoc`, `p2Goc` để web nhập số so đúng ô Sheet.
  - Khớp dòng theo khóa `dhKhoaDs_` (mã đơn | tên | tab, #n nếu trùng). Lớp phủ không khớp = mồ côi (cảnh báo, không áp sang dòng khác).
  - `huyBotDon(token,p)` (HUY / BOT / HUY_DON ≤ 50 mã), `hoanTacHuyDon(token,{id|nhom,lyDo})`, `xemThongBaoHuy(token)`. Quyền `dhCoHuy_` = `DH_HUY_NV` C019/C056/C067 (mã NV gắn đúng 1 tài khoản) + chủ sở hữu; C077 không. Lý do 5–200 ký tự (cả khi hoàn tác). Mã yêu cầu `lenh` chống bấm 2 lần, ≤ 30 thao tác/giờ/người. Kiểm lại tên + SL dòng trong Sheet trước khi tô.
  - Sheet cũ: dòng HỦY tô `#d9d9d9` (lưu màu cũ nén), hoàn tác trả màu cũ nếu dòng còn xám, đã bị đổi màu thì giữ + báo.
  - Tab ĐẾN HẠN 10 NGÀY: hủy / bớt đặt cờ `DH10_CAN_TAO` → lượt `DH_TAB10_DONG_BO` 10 phút kế tiếp dựng lại tab.
  - Sản lượng ngày: bản chụp thêm cột 9 = SL đã bớt; `dhTinhSanLuong_` coi phần thiếu giảm do bớt là "mất", không phải sản lượng ra.
  - `layDonHangXuong` trả thêm `huy: {ds, quyen, xem}` (300 bản ghi mới nhất, cờ `moi` chưa xem, `giu` = bộ phận đang giữ hàng).
- **Web** (`quy-trinh-web.html`): thứ tự mã trong đơn "3/5" nằm **ngay ô Mã đơn** (`.dh-stt`, chủ dự án đổi ý 16/11 khuya: không thêm cột STT), bỏ chữ "mã x/y" cạnh tên; chip **Đơn đã hủy (n)** viền đứt (`@huy` → `dhVeHuy`, thẻ `.dh-hcard` nhóm theo đơn, hiệu lực trước, mồ côi có nhãn "Sheet đã đổi"); chuông 🔔 cạnh tiêu đề (`dhChuong`, mở = đã xem; số cam nếu bộ phận mình đang giữ hàng); khối **Điều chỉnh đơn** cuối bảng nổi (`dhHuyKhoi`: Bớt SL · Hủy mã này · Hủy cả đơn → ô lý do + tóm tắt hậu quả, nút khóa đến khi đủ lý do); ô SL đặt dòng bớt ghi "bớt từ 50" và không sửa thẳng được.
- **Chuyên gia**: `soat-giao-dien-cuoi` (nút trong bảng nổi theo bậc nhẹ → nặng, không confirm(), chuông cạnh tiêu đề, chip xám viền đứt, STT dính trái 40px, nhãn cam cho bộ phận giữ hàng); `bao-mat-ung-dung` (hằng quyền riêng, kiểm dòng trong khóa, lý do giới hạn, chống bấm 2 lần, giới hạn/giờ, hoàn tác cần lý do + kiểm màu, không tự tạo file mới khi id hỏng). Chưa làm: nút "Hoàn tác" trong thông báo 10 giây (hoàn tác ở mục Đơn đã hủy).
- **Kiểm thử** `tests/huy-don.js` 89/89 (quyền, Sheet riêng, tô xám / trả màu, khớp dòng, mồ côi, bớt không trừ 2 lần, hủy cả đơn, thông báo, hoàn tác, bản chụp, giới hạn giờ, web 1300px + 390px). `gia-lap-kpi.js` thêm màu nền + mở lại bảng tính tự tạo.

## GIAI ĐOẠN 1 – Chủ dự án chốt (16/11 khuya) – CHƯA LÀM, phiên mới làm luôn, không hỏi lại
1. **Tài khoản Bán hàng**: Claude tự tạo từ danh sách nhân sự Marketing / Bán hàng / Kinh doanh đã có trên web (tab Nhân sự › Bộ phận ngoài SX), vai trò mới **BH** (chỉ thấy trang nhập đơn + đơn của mình), mật khẩu tạm đổi lần đầu. **Chủ sở hữu toàn quyền** với các tài khoản này (thêm / bớt / khóa / đặt lại mật khẩu / đổi vai trò) – trình danh sách cho chủ dự án xem lại trước khi bật.
2. **Cách nhập**: cả 2 – nhập từng dòng (mã đơn, kênh, tên SP chọn từ danh mục, SL, deadline mong muốn, ghi chú) + dán nhiều dòng từ Excel; web tô đỏ dòng lỗi, tự lưu nháp.
3. **Duyệt**: C019 / C056 / C067 (+ chủ sở hữu) duyệt: chốt deadline cam kết + bậc ưu tiên, hoặc trả về kèm lý do. Duyệt xong web **tự chép đơn vào đúng tab kênh** của Sheet "Trạng thái đơn hàng" (dòng trống cuối tab) → bảng đơn + sản xuất thấy ngay. Lưu đơn ở Sheet "CSDL Đơn hàng (web)" (thêm tab DonHang / DonHangDong, ID bất biến, sổ SuKien) theo góp ý bao-mat-ung-dung 16/11.
4. **Bán hàng xem**: chỉ đơn của mình + trạng thái (nháp / chờ duyệt / trả về / đang SX với % xong, dự kiến xong, đã hủy / bớt). Không thấy KPI, nhân sự, đơn người khác.
- Là tính năng lớn: hỏi chuyên gia (bao-mat-ung-dung cho vai trò BH + chép Sheet; soat-giao-dien-cuoi / dong-vai-nguoi-dung cho trang nhập trên điện thoại).

## GIAI ĐOẠN 1 – ĐÃ LÀM (16/11 khuya) · chờ chủ dự án bấm `2-CAP-NHAT.bat`
- **Máy chủ** `kpi-app/tests/don-ban/don-ban.gs` (vá bởi `don-ban/va-don-ban.py`, exec cuối `va-code.py`):
  - Vai trò **BH**. **Chặn mặc định** (bao-mat-ung-dung): `docPhien_` trả null cho BH trừ hàm đặt `__CHO_BH = true` (napDuLieu/napPhan, dangXuat, doiMatKhau, layManhGiaoDien, layDonBan, luuDonBan, xoaDonBan). napDuLieu trả gói rỗng như bếp. BH không bắt buộc hồ sơ. Mảnh `DonBan` cho BH + ADMIN. `me.dbDuyet` = `dhCoHuy_` (C019 / C056 / C067 + chủ sở hữu).
  - Tab **DonBan** trong Sheet "CSDL Đơn hàng (web)" (`DHH_COT.DonBan`), dòng SP là JSON. Trạng thái CHO_DUYET / TRA_VE / DA_DUYET / TU_CHOI / DA_XOA, `PhienBan` chống duyệt bản cũ, `lenh` chống bấm 2 lần, ≤ 40 thao tác/giờ, ≤ 50 mã/đơn, SL nguyên 1–100.000 ("1.000" = 1000), tên SP / mã đơn không bắt đầu = + - @, chặn trùng mã đơn (web + Sheet).
  - `layDonBan` (BH chỉ đơn của mình; người duyệt mọi đơn + tổng hàng xưởng còn thiếu), `luuDonBan`, `xoaDonBan`, `duyetDonBan` (DUYET / TRA_VE / TU_CHOI, lý do bắt buộc khi trả về / từ chối), `demDonBanCho` (Việc hôm nay + Tổng quan), `dsUngVienBH` + `taoTaiKhoanBH` (chỉ chủ sở hữu; tên đăng nhập = mã NV chữ thường, mật khẩu tạm 48 giờ, đổi lần đầu; gợi ý tick Kinh doanh + Sàn TMĐT / CSKH / Website).
  - Duyệt → `dbGhiSheet_`: ghi cuối tab kênh (mã đơn mỗi dòng, tên, SL, deadline 'dd/mm/yyyy, Note = ghi chú dòng + "Đơn: …"), chép công thức R1C1 của dòng cuối sang cột không ghi (vd SX CÒN THIẾU), lỗi giữa chừng thì xóa phần vừa ghi. ★ ưu tiên ghi `DonUuTien` như nút ★. Đặt cờ dựng lại tab 10 ngày.
  - Tiến độ cho BH: % xong, còn thiếu, mã bị hủy / bớt (lớp phủ giai đoạn 0).
- **Web** mảnh `DonBan.html` (nguồn `tests/don-ban/don-ban-web.html`, vá Index mục 50 `va-don-ban-web.py`; hàm tiền tố `bn…` – **tránh trùng `dbVe` của QuyTrinh.html**): tab "Đơn hàng của tôi" (BH, duy nhất) / "Đơn bán hàng" (người duyệt, sau Đơn hàng). Form: kênh dạng nút → mã đơn → deadline → thẻ sản phẩm (gợi ý tên, −/+ SL, chép dòng) → Dán từ Excel (báo đúng / mã mới / lỗi) → ghi chú; thanh Gửi dính đáy (trên menu điện thoại); nháp lưu trên máy. Thẻ duyệt: nhãn "mã mới", cảnh báo deadline không kịp (300 sp/ngày), deadline chốt + ★, Duyệt / Trả về / Từ chối (lý do mẫu). Chủ sở hữu: mục "Tài khoản Bán hàng" (tick → tạo, mật khẩu tạm hiện 1 lần).
- **Sửa thêm**: `dhVeLai` (QuyTrinh) không còn vẽ đè trang Quy trình lên tab khác khi dữ liệu đơn tải xong ở nền.
- Chuyên gia: bao-mat-ung-dung (chặn mặc định BH, IDOR, trùng mã, duyệt 2 lần, giới hạn), dong-vai-nguoi-dung (bố cục điện thoại, thông điệp trạng thái, duyệt 30 giây). Chưa làm: ngày dự kiến xong theo mô phỏng cho Bán hàng; khóa "C077 đang xem".
- Kiểm thử: `tests/don-ban.js` 65/65 (máy chủ), `tests/don-ban-web.js` 18/18 (đầu–cuối trên bản xem thử: BH đăng nhập, gửi, dán Excel, trả về, sửa, duyệt, bảng đơn đọc lại). Bản xem thử (`tao-ban-xem-thu.js`) thêm mảnh DonBan + giả lập tạo Sheet / màu nền / công thức.

