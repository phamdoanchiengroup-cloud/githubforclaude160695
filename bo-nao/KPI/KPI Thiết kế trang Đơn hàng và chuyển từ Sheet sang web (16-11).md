# KPI Thiết kế trang Đơn hàng và chuyển từ Sheet sang web (16-11)

Nhóm: KPI · Tạo 16/11/2026 · TRẠNG THÁI: đề xuất, chờ chủ dự án duyệt (chưa code)
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

## Chờ chủ dự án trả lời
Danh sách câu hỏi: xem mục tương ứng trong [[Việc chờ chủ dự án]].
