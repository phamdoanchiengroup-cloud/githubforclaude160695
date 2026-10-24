# 00 Mục lục

Bộ não thứ hai của **web KPI sản xuất** (nhánh `claude/beautiful-ptolemy-f2j7za`). Thiên Cơ Các có bộ não riêng trên nhánh `claude/happy-brown-lttkz3`. Mỗi ghi chú một chủ đề, nối với nhau bằng `[[liên kết]]`. Mở thư mục `bo-nao/` bằng Obsidian để xem dạng đồ thị, hoặc mở trang bản đồ https://claude.ai/artifact/PXgStqzHKBtykmfvDch6GE (bản trong repo: `bo-nao/ban-do.html`).

## Bắt đầu từ đây
- [[Việc chờ chủ dự án]]: demo chờ góp ý, câu hỏi chờ trả lời, dữ liệu cần sửa tay.
- [[Lần dán lên Apps Script]]: bản nào đã dán, bản nào chưa, dán kèm file gì.
- [[Quyết định của chủ dự án]]: những gì đã chốt hoặc đã nói "không cần" – đừng đề xuất lại.
- Quy tắc làm việc với chủ dự án: nằm ở `CLAUDE.md` (ô "CLAUDE.md" trên bản đồ).

## Web KPI sản xuất (`kpi-app/`)
- Nền tảng: [[KPI Tổng quan và cách dựng]] · [[KPI Kiểm thử]] · [[KPI Cập nhật bằng clasp]] · [[KPI Phần giao diện tải sau]] · [[KPI Tăng tốc và giao diện 29-09]] · [[KPI Tăng tốc đợt 2 (21-10)]]
- Chức năng: [[KPI Cơm trưa]] · [[KPI Báo cáo tháng]] · [[KPI Sơ đồ nhà máy 3D]] · [[KPI Bóng đá]] · [[KPI Phân tích định mức]] · [[KPI Thang xếp loại]] · [[KPI Soát đổi định mức 22-10]] · [[KPI Hồ sơ bắt buộc]] · [[KPI Kỹ năng]] · [[KPI Hologram chủ sở hữu]] · [[KPI Bảng KPI tất cả xưởng]] · [[KPI Ảnh trên Google Drive]] · [[KPI Sửa nhỏ trên web]]
- An toàn và vận hành: [[KPI Bảo mật và vận hành]] · [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]
- Giao diện và nhân vật: [[KPI Màn đăng nhập Khắc laser]] · [[KPI Màn đăng nhập demo chờ duyệt]] · [[KPI Thao tác và hiệu ứng bên trong]] · [[KPI Chia đôi màn hình]] · [[KPI Rhino]] · [[KPI Mai]] · [[KPI Âm thanh và giọng Rhino]] · [[KPI Lottie]] · [[KPI Demo giao diện]] · [[KPI Sửa lỗi giao diện]] · [[KPI Demo đã bỏ]]


## Chung
- [[Công cụ Claude]]: skill thiết kế, vai chuyên gia, plugin.

## Cách giữ bộ não sống (cho phiên Claude)
1. Đầu phiên: đọc `CLAUDE.md`, ghi chú này, rồi [[Việc chờ chủ dự án]] và các ghi chú của chủ đề sắp làm.
2. Làm xong một việc: sửa ghi chú chủ đề đó (thêm ngày, việc đã làm, tên hàm/file, kiểm thử), cập nhật [[Việc chờ chủ dự án]], [[Lần dán lên Apps Script]] và [[Quyết định của chủ dự án]] nếu có thay đổi. Chủ đề mới thì tạo ghi chú mới trong đúng thư mục, dòng 3 ghi `Liên quan: [[...]]`, và thêm vào mục lục này.
3. Dựng lại bản đồ: `python3 bo-nao/tao-ban-do.py` rồi đăng lại `bo-nao/ban-do.html` lên đúng link Artifact ghi trong `CLAUDE.md`.
4. Ghi chú viết ngắn, theo gạch đầu dòng; chi tiết kỹ thuật dài để trong ghi chú chủ đề, không dồn vào `CLAUDE.md`.
