# 00 Mục lục

Bộ não thứ hai của **Thiên Cơ Các** (nhánh `claude/happy-brown-lttkz3`). Web KPI sản xuất có bộ não riêng trên nhánh `claude/beautiful-ptolemy-f2j7za`. Mỗi ghi chú một chủ đề, nối với nhau bằng `[[liên kết]]`. Mở thư mục `bo-nao/` bằng Obsidian để xem dạng đồ thị, hoặc mở trang bản đồ https://claude.ai/artifact/ATmkGiUrZzEGjhRTxjyFjW (bản trong repo: `bo-nao/ban-do.html`).

## Bắt đầu từ đây
- [[Bàn giao phiên]]: trạng thái mới nhất và việc dở – đọc đầu tiên khi mở phiên mới.
- [[Tài nguyên và công cụ]]: liên kết web, Artifact, repo, jsDelivr, công cụ, plugin/skill/kết nối.
- [[Việc chờ chủ dự án]]: việc còn ngỏ, câu hỏi chờ trả lời.
- [[Lần dán lên Apps Script]]: bản nào đã dán, bản nào chưa.
- [[Quyết định của chủ dự án]]: những gì đã chốt – đừng đề xuất ngược lại.
- Quy tắc làm việc, văn luận giải, nghiệm chứng, bảo mật: nằm ở `CLAUDE.md` (ô "CLAUDE.md" trên bản đồ).

## Thiên Cơ Các (`tuvi-app/`)
- Nền tảng: [[TCC Tổng quan]] · [[TCC Tiến trình]] · [[TCC Kiểm thử]] · [[TCC Lịch sử lá số]] · [[TCC Tự đẩy code lên Apps Script]] · [[TCC Chuyên gia Agency Agents]]
- Lõi luận giải: [[TCC Lập lá số và bốn tầng luận]] · [[TCC Sáu hệ]] · [[TCC Văn dễ hiểu và Tổng hợp 6 hệ]] · [[TCC Nghiệm chứng]] · [[TCC Vận hạn chuyên sâu và biến cố]] · [[TCC Tử Vi đối chiếu các phái]] · [[TCC Tứ Hóa Phi Tinh]] · [[TCC Bát Tự Hà Lạc và Tứ Trụ đối chiếu nguồn]] · [[TCC Thần sát Bát Tự]] · [[TCC Chiêm tinh Thần số HD nâng cấp chuyên sâu]]
- Giao diện: [[TCC Giao diện]] · [[TCC Lá số 3D]] · [[TCC PDF]]
- Kinh doanh: [[TCC Bán hàng]] · [[TCC Tiện ích bán lẻ]] · [[TCC Báo cáo ngày]] · [[TCC Luận giải hằng ngày qua email]]

## Cách giữ bộ não sống (cho phiên Claude)
1. Đầu phiên: đọc `CLAUDE.md`, ghi chú này, rồi [[Việc chờ chủ dự án]] và các ghi chú của chủ đề sắp làm.
2. Làm xong một việc: sửa ghi chú chủ đề đó (thêm ngày, việc đã làm, tên hàm/file, kiểm thử), cập nhật [[Việc chờ chủ dự án]], [[Lần dán lên Apps Script]] và [[Quyết định của chủ dự án]] nếu có thay đổi. Chủ đề mới thì tạo ghi chú mới trong `Thiên Cơ Các/`, dòng 3 ghi `Liên quan: [[...]]`, và thêm vào mục lục này.
3. Dựng lại bản đồ: `python3 bo-nao/tao-ban-do.py` rồi đăng lại `bo-nao/ban-do.html` lên đúng link Artifact ghi trong `CLAUDE.md`.
