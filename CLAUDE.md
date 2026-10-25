# Web KPI sản xuất – bối cảnh cho phiên Claude Code mới

File này được Claude Code tự đọc khi mở repo. Nó giữ **quy tắc bắt buộc** và chỉ đường vào **bộ não thứ hai** `bo-nao/`, nơi chứa toàn bộ "trí nhớ" chi tiết của các phiên trước. Đọc hết file này, rồi đọc `bo-nao/00 Mục lục.md` trước khi làm việc.

## Nhánh này chỉ chứa web KPI
- **Web KPI sản xuất** (`kpi-app/`, Google Apps Script) của Carbon Billiards (thương hiệu RHINO), công ty của chủ dự án.
- **Mỗi dự án một nhánh** (chủ dự án chốt 21/10). Commit và push việc KPI lên **`claude/beautiful-ptolemy-f2j7za`**. Không tạo PR nếu chủ dự án không yêu cầu.
- Dự án khác của chủ dự án, không liên quan, nằm ở nhánh riêng – đừng đưa vào nhánh này:
  - **Thiên Cơ Các** (`tuvi-app/`, web luận vận mệnh 6 hệ): nhánh `claude/happy-brown-lttkz3` (có bộ não riêng). Bản `tuvi-app/` cũ ở nhánh này đã gỡ 21/10 (bản 28/9, cũ hơn nhánh kia).
  - **Trợ lý KPI qua Zalo** (`tro-ly-kpi/`): nhánh `claude/awesome-heisenberg-iulbd6`.

## Chủ dự án – cách làm việc (bắt buộc)
- **Trả lời bằng tiếng Việt.**
  - Chủ dự án không phải dân IT, nên hướng dẫn từng bước theo dạng **"MỞ FILE X → xóa hết → dán bản mới"**.
  - Luôn nói rõ **file nào cần dán lại** vào Apps Script, kèm bước **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai**, rồi Ctrl+F5.
- **Luôn hỏi để làm rõ yêu cầu trước khi hành động** (chủ dự án yêu cầu 25/10): trước khi sửa code, dựng, gửi file hay đổi dữ liệu, hỏi lại chủ dự án những điểm còn chưa rõ (phạm vi, ai thấy, áp từ khi nào, giữ hay bỏ cái cũ…), chờ trả lời rồi mới làm.
- **Luôn dùng vai chuyên gia Agency Agents** (`.claude/agents/`, chủ dự án yêu cầu 25/10): mỗi việc đều hỏi ít nhất một chuyên gia phù hợp, vd. `quan-ly-van-hanh` (KPI, định mức, vận hành), `bao-mat-ung-dung` / `bao-mat-ma-ai` (bảo mật), `soat-giao-dien-cuoi` / `kiem-tra-de-dung` / `dong-vai-nguoi-dung` (giao diện), `hoi-nhap-nhan-su` / `thiet-ke-dao-tao` (nhân sự, kỹ năng), `nhac-nho-dong-vien` (Rhino, nhắc nhở). Báo chủ dự án đã hỏi chuyên gia nào và họ góp ý gì.
- Nhắc **sao lưu** (Tổng quan → Tạo bản sao dự án) trước khi dán thay đổi lớn.
- **Cái gì xong trước thì gửi trước** (chủ dự án nhắc 19/10): khi làm nhiều sản phẩm một lúc (vd. PPT + video), phần nào xong và đã kiểm tra thì gửi ngay, không chờ xong hết mới gửi.
- Chủ dự án hay gửi file đã tự sửa. Khi nhận:
  - **Gộp 3 chiều** với bản trong repo (`git merge-file`), không ghi đè mất thay đổi của họ.
  - Rồi rà lỗi.
- Trước khi đề xuất gì, xem `bo-nao/Quyết định của chủ dự án.md`: những gì đã nói "không cần" thì đừng đề xuất lại.

## Bảo mật (bắt buộc)
- **Không bao giờ ghi mật khẩu thật vào repo hay commit.**
- Dữ liệu JSON xuất từ Sheet (có thông tin cá nhân) chỉ để ở scratchpad, **không commit**.

## Quy tắc kỹ thuật không được quên
- **Web KPI:** `kpi-app/Code.gs`, `kpi-app/Index.html` (và `SoDo.html`, `HoatAnh.html`, `AmThanh.html`) là bản **sinh ra** từ `kpi-app/goc/` bằng `tests/va-code.py` và `tests/va-index.py` (mỗi tính năng là một "mục" vá). Sửa thì sửa script vá rồi dựng lại, đừng sửa tay bản sinh ra. Đổi `SoDo` thì phải gửi kèm `Index.html`. Hướng dẫn cho chủ dự án: `kpi-app/HUONG-DAN-CAP-NHAT.md`. Chi tiết: `bo-nao/KPI/`.
- Chạy kiểm thử liên quan trước khi commit: `bo-nao/KPI/KPI Kiểm thử.md`.
- **Sau MỖI lần sửa, luôn rà soát lại toàn bộ** (chủ dự án yêu cầu 22/10):
  - logic code (máy chủ + web);
  - logic hiển thị trên web (đúng quyền, đúng số, đúng trạng thái, điện thoại không tràn);
  - các công thức (KPI, định mức, xếp loại, điểm…).
  
  Rà xong mới commit. Báo cho chủ dự án biết đã rà những gì và tìm ra gì.

## Bộ não thứ hai `bo-nao/` (kiểu Obsidian)
- Mỗi ghi chú một chủ đề, tên file = tiêu đề, thư mục = nhóm (`KPI/`, `Chung/`; file ở gốc là ghi chú tổng hợp). Liên kết bằng `[[Tên ghi chú]]`, dòng 3 mỗi ghi chú ghi `Liên quan: [[...]]`.
- Ghi chú tổng hợp: [[00 Mục lục]], [[Bàn giao phiên]], [[Liên kết và công cụ]] (repo, link Drive, artifact, kết nối, skill, plugin), [[Việc chờ chủ dự án]], [[Lần dán lên Apps Script]], [[Quyết định của chủ dự án]] (file `.md` cùng tên ở gốc `bo-nao/`).
- **Cuối mỗi việc, cập nhật bộ não** (không dồn chi tiết vào CLAUDE.md):
  1. Sửa ghi chú chủ đề: ngày, việc đã làm, tên hàm/file, số kiểm thử. Chủ đề mới → ghi chú mới + thêm vào `00 Mục lục.md`.
  2. Cập nhật `Việc chờ chủ dự án.md`, `Lần dán lên Apps Script.md`, `Quyết định của chủ dự án.md`, `Liên kết và công cụ.md` (link / mã file / công cụ mới) nếu có thay đổi.
  3. `python3 bo-nao/tao-ban-do.py` (báo lỗi nếu có liên kết hỏng) → dựng `bo-nao/ban-do.html`.
  4. Đăng lại trang bản đồ lên cùng link Artifact: Artifact publish với `url` = link dưới đây, `file_path` = `bo-nao/ban-do.html` (đọc artifact trước nếu phiên này chưa đọc).
- **Trang bản đồ bộ não web KPI (Artifact riêng tư của chủ dự án):** https://claude.ai/artifact/PXgStqzHKBtykmfvDch6GE
- Chủ dự án xem bằng trình duyệt (cả điện thoại) qua link trên, hoặc mở thư mục `bo-nao/` bằng Obsidian.

## Môi trường phiên đám mây
- Plugin khai báo trong `.claude/settings.json` có thể không tải được trên phiên đám mây; phiên đám mây chặn tự sửa `.claude/settings.json` ở chế độ Auto. Xem `bo-nao/Chung/Công cụ Claude.md`.
- Không chạy `playwright install`; Chromium có sẵn (`PW=/opt/node22/lib/node_modules/playwright`).
