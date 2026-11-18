# Nhật ký thay đổi

Liên quan: [[00 Mục lục]] · [[Quyết định của chủ dự án]] · [[Bài học của Claude]] · [[Bàn giao phiên]] · [[Lần dán lên Apps Script]]

Mỗi lần sửa web / dữ liệu / quy tắc: **ngày · sửa gì · VÌ SAO sửa (ai yêu cầu, lỗi gì, số liệu nào) · file / hàm · kiểm thử · commit**. Mới nhất ở trên. Chủ dự án yêu cầu 18/11: "khi chúng ta sửa gì, tại sao phải sửa, cũng phải ghi vào bộ nhớ; công việc lớn cũng phải ghi lại". Chi tiết kỹ thuật dài để ở ghi chú chủ đề, ở đây chỉ 3–6 dòng mỗi mục.

## 18/11
- **Quy tắc: câu hỏi có số liệu → tải số thật trước** (CLAUDE.md). Vì sao: Claude trả lời "không có dữ liệu sống" trong khi đã có Sheet cầu nối + kết nối Google Drive; chủ dự án nhắc. Xem [[Bài học của Claude]].
- **Lập ghi chú này + [[Bài học của Claude]]**. Vì sao: chủ dự án muốn mọi thay đổi có lý do được nhớ qua các phiên.
- Giải thích (không sửa code): đơn Kho trễ 20–35 ngày là đúng toán – deadline Kho ~7.670 sp trước 10/12 trong khi làn Kho 50% ≈ 150 sp/ngày; còn nghi #16/10 (hạn sớm hơn #04/11 mà xong muộn hơn) do xếp theo dòng – chưa kiểm.

## 17/11 khuya (việc lớn)
- **Chủ sở hữu tự chia 5 làn ở ⚙ Công suất** (% · thứ tự phần dư · kênh → làn · Xem trước · nhật ký). Vì sao: chủ dự án muốn chỉnh tỷ lệ theo thực tế xưởng thay vì nhờ sửa code. Commit `3fe5b5b`. Chi tiết: [[KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)]] mục "17/11 KHUYA (2)".
- **Bán hàng "Thử trước khi đặt" + gửi / xử lý đề nghị ưu tiên**. Vì sao: Bán hàng hẹn khách bằng cảm giác, xin ưu tiên bằng miệng không ai thấy đơn khác lùi bao nhiêu. Đề nghị bắt tick "đã xem đơn bị lùi" (góp ý quan-ly-van-hanh). Commit `27b96da`.
- **Bộ slide họp Sản xuất – Bán hàng** (17 slide, số 16/11): https://claude.ai/artifact/UqiDkrJZfvUo7zSYyaaKhB. Vì sao: chủ dự án họp thống nhất cách hẹn khách.

## 17/11 tối (việc lớn)
- **5 làn công suất 10·20·50·5·15 + phần dư Dealer → Kho → OEM → A Đông → Lẻ**. Vì sao: Kho và Dealer tranh nhau một hàng; chủ dự án muốn Dealer có làn riêng (thống kê Dealer đặt/tháng).
- **Thử nhận đơn: chọn kênh, hẹn khách an toàn = cuối làn + 6 ngày làm** (bỏ +20%). Vì sao: chủ dự án thấy 2 ngày hẹn khó hiểu (29/12 và 27/01).
- **Tạm dừng sản xuất (mã / cả đơn)**, Sheet đơn không đổi màu; tab Đến hạn 10 ngày sang file riêng. Vì sao: chủ dự án không muốn web làm thay đổi Sheet.
- **Ngày dự kiến cho Bán hàng = mô phỏng + 2 ngày làm; kín lịch + 6 ngày làm; bảng đơn nhà máy 4 cột; khóa cột Sheet 2 bước**. Vì sao: Bán hàng cần ngày chắc chắn để hứa khách.

Mục cũ hơn: xem từng ghi chú chủ đề trong [[00 Mục lục]] (đã ghi ngày + việc), và [[Quyết định của chủ dự án]].
