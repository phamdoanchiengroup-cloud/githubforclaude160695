# Bối cảnh cho phiên Claude Code mới

File này được Claude Code tự đọc khi mở repo. Nó giữ **quy tắc bắt buộc** và chỉ đường vào **bộ não thứ hai** `bo-nao/`, nơi chứa toàn bộ "trí nhớ" chi tiết của các phiên trước. Đọc hết file này, rồi đọc `bo-nao/00 Mục lục.md` trước khi làm việc.

## Repo có hai dự án
- **Web KPI sản xuất** (`kpi-app/`, Google Apps Script) của Carbon Billiards (thương hiệu RHINO), công ty của chủ dự án. Đây là việc đang làm chủ yếu.
- **Thiên Cơ Các** (`tuvi-app/`, Google Apps Script): web luận vận mệnh 6 hệ, bán nội dung bằng xu.
- **Chỉ dùng một nhánh: `claude/beautiful-ptolemy-f2j7za`** cho mọi việc của cả hai dự án (chủ dự án chốt 21/10). Không tạo PR nếu chủ dự án không yêu cầu.

## Chủ dự án – cách làm việc (bắt buộc)
- **Trả lời bằng tiếng Việt.**
  - Chủ dự án không phải dân IT, nên hướng dẫn từng bước theo dạng **"MỞ FILE X → xóa hết → dán bản mới"**.
  - Luôn nói rõ **file nào cần dán lại** vào Apps Script, kèm bước **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai**, rồi Ctrl+F5.
- Nhắc **sao lưu** (Tổng quan → Tạo bản sao dự án) trước khi dán thay đổi lớn.
- **Cái gì xong trước thì gửi trước** (chủ dự án nhắc 19/10): khi làm nhiều sản phẩm một lúc (vd. PPT + video), phần nào xong và đã kiểm tra thì gửi ngay, không chờ xong hết mới gửi.
- Chủ dự án hay gửi file đã tự sửa. Khi nhận:
  - **Gộp 3 chiều** với bản trong repo (`git merge-file`), không ghi đè mất thay đổi của họ.
  - Rồi rà lỗi.
- Trước khi đề xuất gì, xem `bo-nao/Quyết định của chủ dự án.md`: những gì đã nói "không cần" thì đừng đề xuất lại.

## Bảo mật (bắt buộc)
- Thiên Cơ Các: mật khẩu chủ sở hữu (`chienpham`) chỉ lưu dạng muối + băm (`TK_CHU_SEED` trong `TaiKhoan.gs`). **Không bao giờ ghi mật khẩu thật vào repo hay commit.** Khóa payOS được nhập qua giao diện quản trị vào Script Properties, không đưa vào mã hay chat.
- Web KPI: dữ liệu JSON xuất từ Sheet (có thông tin cá nhân) chỉ để ở scratchpad, **không commit**.

## Quy tắc kỹ thuật không được quên
- **Web KPI:** `kpi-app/Code.gs`, `kpi-app/Index.html` (và `SoDo.html`, `HoatAnh.html`, `AmThanh.html`) là bản **sinh ra** từ `kpi-app/goc/` bằng `tests/va-code.py` và `tests/va-index.py` (mỗi tính năng là một "mục" vá). Sửa thì sửa script vá rồi dựng lại, đừng sửa tay bản sinh ra. Đổi `SoDo` thì phải gửi kèm `Index.html`. Hướng dẫn cho chủ dự án: `kpi-app/HUONG-DAN-CAP-NHAT.md`. Chi tiết: `bo-nao/KPI/`.
- **Thiên Cơ Các:** trước khi viết văn luận giải, đọc `bo-nao/Thiên Cơ Các/TCC Quy tắc văn luận giải.md` (không nêu tên sao trong phần dễ hiểu, hai tầng không mâu thuẫn). Thêm file `.gs` mới phải thêm vào `HAM_CAN_CO` và cập nhật số file trong `tuvi-app/HUONG-DAN-CAI-DAT.md`. Lệnh kiểm thử: `bo-nao/Thiên Cơ Các/TCC Kiểm thử.md`.
- Chạy kiểm thử liên quan trước khi commit (KPI: `bo-nao/KPI/KPI Kiểm thử.md`).

## Bộ não thứ hai `bo-nao/` (kiểu Obsidian)
- Mỗi ghi chú một chủ đề, tên file = tiêu đề, thư mục = nhóm (`KPI/`, `Thiên Cơ Các/`, `Chung/`; file ở gốc là ghi chú tổng hợp). Liên kết bằng `[[Tên ghi chú]]`, dòng 3 mỗi ghi chú ghi `Liên quan: [[...]]`.
- Ghi chú tổng hợp: [[00 Mục lục]], [[Việc chờ chủ dự án]], [[Lần dán lên Apps Script]], [[Quyết định của chủ dự án]] (file `.md` cùng tên ở gốc `bo-nao/`).
- **Cuối mỗi việc, cập nhật bộ não** (không dồn chi tiết vào CLAUDE.md):
  1. Sửa ghi chú chủ đề: ngày, việc đã làm, tên hàm/file, số kiểm thử. Chủ đề mới → ghi chú mới + thêm vào `00 Mục lục.md`.
  2. Cập nhật `Việc chờ chủ dự án.md`, `Lần dán lên Apps Script.md`, `Quyết định của chủ dự án.md` nếu có thay đổi.
  3. `python3 bo-nao/tao-ban-do.py` (báo lỗi nếu có liên kết hỏng) → dựng `bo-nao/ban-do.html`.
  4. Đăng lại trang bản đồ lên cùng link Artifact: Artifact publish với `url` = link dưới đây, `file_path` = `bo-nao/ban-do.html` (đọc artifact trước nếu phiên này chưa đọc).
- **Trang bản đồ bộ não (Artifact riêng tư của chủ dự án):** https://claude.ai/artifact/PXgStqzHKBtykmfvDch6GE
- Chủ dự án xem bằng trình duyệt (cả điện thoại) qua link trên, hoặc mở thư mục `bo-nao/` bằng Obsidian.

## Môi trường phiên đám mây
- Plugin khai báo trong `.claude/settings.json` có thể không tải được trên phiên đám mây; phiên đám mây chặn tự sửa `.claude/settings.json` ở chế độ Auto. Xem `bo-nao/Chung/Công cụ Claude.md`.
- Không chạy `playwright install`; Chromium có sẵn (`PW=/opt/node22/lib/node_modules/playwright`).
