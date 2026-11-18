# Từ điển nhà máy

Liên quan: [[00 Mục lục]] · [[KPI Quy trình sản xuất]] · [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] · [[Quyết định của chủ dự án]]

Tên gọi trong xưởng / trên web để phiên sau hiểu đúng câu chủ dự án hỏi. Thêm từ mới khi gặp.

## Người và quyền
- **Chủ dự án = `chienpham`, C056, Phó GĐ sản xuất** (chủ sở hữu web). Ban điều hành: **C019** Giám đốc · **C056**, **C077** Phó GĐ sản xuất · **C067** chị Kim Loan.
- **Người duyệt đơn / hủy / tạm dừng**: C019, C056, C067 (+ chủ sở hữu). **Chỉ chủ sở hữu**: ⚙ Cài đặt, chia làn, Báo cáo lãnh đạo, khóa cột Sheet.
- **BH** = tài khoản Bán hàng (Kinh doanh / Marketing), tên đăng nhập = mã NV; chỉ thấy tab Đơn hàng của tôi.
- **TP / PP** = trưởng / phó phòng (xưởng), **CN** = công nhân, **TBP** = trưởng bộ phận ngoài SX.

## Đơn hàng
- **Sheet đơn / "Trạng thái đơn hàng"**: mỗi kênh một tab. **Kênh**: DEALER · KHO · OEM · A ĐÔNG · WEB LẺ ĐƠN THƯỜNG · WEB LẺ CUSTOM · POD-A.BÁCH · POD-ECOMSTONE.
- **ĐƠN ƯU TIÊN** = bản chép mã ưu tiên của tab KHO – KHÔNG cộng lần 2. **Hàng ưu tiên** chỉ là mã trong tab này.
- **TRỄ HẠN** = tab tên hàng đang trễ (dòng khớp tên → bậc 1). **HT-2026** = đơn đã hoàn thiện (đã giao đủ).
- **Còn thiếu** = cột SX CÒN THIẾU – mọi ngày dự kiến tính trên số này.
- **Hạn mới** = deadline đặt lại khi đơn trễ; trễ > 30 ngày chưa có hạn mới thì không xếp lịch.
- **Hạn ngầm** đơn lẻ = ngày đặt (trong mã đơn) + 7 ngày làm (thường) / 10 (POD) / 15 (custom).
- **★ ưu tiên** = gắn trên web (cả đơn); **đề nghị ưu tiên** = Bán hàng xin, ban điều hành duyệt.
- **Hủy / bớt / tạm dừng** = lớp trên web (Sheet "CSDL Đơn hàng (web)"), Sheet đơn không đổi.
- **5 làn**: Lẻ + POD · Dealer · Kho · OEM · A Đông (mặc định 10·20·50·5·15, chủ sở hữu chỉnh ở ⚙).
- **Kín lịch** = ngày nhà máy xong hết hàng hiện có + 6 ngày làm; **Hẹn khách an toàn** = xong khi xếp cuối làn + 6 ngày làm; **Dự kiến xong (Bán hàng)** = + 2 ngày làm.
- **Ngày làm** = thứ 2 – thứ 7, trừ chủ nhật và ngày lễ / nghỉ ở ⚙ (có "làm bù").

## Sản xuất
- **Bộ phận / công đoạn** (mã trên web): Phôi chuôi `PHOI_C` · Phôi ngọn `PHOI_N` · Sơn `SON` · Taro `TARO` · UV `UV` · Hoàn thiện `HT` · Làm đầu `TIP` · Đóng gói `DG`.
- **Luồng**: chuôi = Phôi chuôi → Sơn → UV → Hoàn thiện; ngọn = Phôi ngọn → Taro → Hoàn thiện → Làm đầu → Hoàn thiện; rồi Đóng gói. **Gậy 1 khúc**: Phôi → Sơn → UV → Hoàn thiện → Làm đầu.
- **BTP** = bán thành phẩm (hàng đã qua một số bộ phận). **Hàng nối** (`NOI`) và **phụ kiện** (`PK`) không tính vào công suất đơn.
- **Công suất** chung 300 sp/ngày (⚙); công suất từng bộ phận dùng cho **hạn chuẩn** (Phôi chuôi 250, Phôi ngọn 350, còn lại 310).
- Nhóm sản phẩm khi sắp bảng: gậy đánh / nhảy / phá; chuôi / chuôi nhảy / ngọn; full carbon → mix → glassfiber.

## Công cụ
- **2-CAP-NHAT.bat** = cập nhật web bằng clasp trên máy chủ dự án. **Qoder** = AI trên máy chủ dự án làm việc nhỏ.
- **Sheet cầu nối** = bản IMPORTRANGE chỉ đọc để Claude lấy số thật ([[Liên kết và công cụ]]).
