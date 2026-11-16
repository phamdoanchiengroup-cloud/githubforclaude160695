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

