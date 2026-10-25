# Liên kết và công cụ

Nhóm: Chung · Tạo 25/10/2026
Liên quan: [[00 Mục lục]] · [[Bàn giao phiên]] · [[Công cụ Claude]] · [[KPI Ảnh web qua jsDelivr]] · [[KPI Cập nhật bằng clasp]] · [[KPI Kiểm thử]]

Một chỗ gom mọi đường dẫn, mã file, kết nối và công cụ phiên trước đã dùng, để phiên sau không phải đi tìm. **Không ghi mật khẩu ở đây.**

## Repo GitHub
- https://github.com/phamdoanchiengroup-cloud/githubforclaude160695 (**công khai** – kiểm 25/10 bằng API `private=false`; chủ dự án chọn giữ công khai). Công cụ GitHub là MCP `mcp__github__*`, không có `gh` CLI.
- Mỗi dự án một nhánh:
  - **Web KPI**: `claude/beautiful-ptolemy-f2j7za` (nhánh này).
  - Thiên Cơ Các (`tuvi-app/`): `claude/happy-brown-lttkz3`.
  - Trợ lý KPI qua Zalo (`tro-ly-kpi/`): `claude/awesome-heisenberg-iulbd6`.
- Không tạo PR nếu chủ dự án không yêu cầu.

## Google Drive (kết nối Google Drive của tài khoản phamdoanchiengroup@gmail.com)
- **Sheet "CSDL KPI"** (dữ liệu thật của web): https://docs.google.com/spreadsheets/d/1znHlbc3ulMRQILePmLZbwNQx-mMXFxd9sm0PBG9lrF8
  - Lấy dữ liệu thử:
    1. Gọi `download_file_content` với `fileId` = mã trên, `exportMimeType` = `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
    2. Chạy `python3 -I kpi-app/tests/csdl-tu-drive.py <file kết quả công cụ> $S/dl/csdl.json`.
  - Có thông tin cá nhân: chỉ để ở scratchpad, **không commit**.
- **Ảnh web: lấy từ repo qua jsDelivr** (25/10), link `https://cdn.jsdelivr.net/gh/phamdoanchiengroup-cloud/githubforclaude160695@<commit>/kpi-app/<đường dẫn>` – cách làm ở [[KPI Ảnh web qua jsDelivr]]. Thư mục Drive "KPI – Ảnh web" (`1_CBq5LU4HZuBFaemZakQMV4mW1Ewl54O`) không còn dùng.
- Giới hạn công cụ Drive:
  - `share_file` chỉ chia sẻ cho từng email, không bật được "ai có link": chủ dự án tự bật.
  - `create_file` cần base64 trong lời gọi, nên không tải được ảnh vài trăm KB: gửi ảnh cho chủ dự án tự kéo vào.
- Thư mục Drive "Báo cáo KPI hằng tháng" do web tự tạo khi chốt tháng: xem [[KPI Báo cáo tháng]].

## Apps Script và clasp
- Cập nhật web: bộ cài `kpi-app/cai-dat-clasp/`. Gửi lại cho chủ dự án: `cd kpi-app && zip -qr $S/cai-dat-clasp-KPI.zip cai-dat-clasp`, rồi gửi file bằng công cụ gửi file.
- Mã dự án Apps Script (`scriptId`) và đăng nhập clasp chỉ nằm trên máy chủ dự án (`C:\Users\<tên>\KPI-AppsScript`), không có trong repo. Chi tiết: [[KPI Cập nhật bằng clasp]].
- Bộ cài chỉ đẩy 5 file cố định (`$CacFileHtml` trong `chung.ps1`): Code.gs, Index.html, SoDo.html, HoatAnh.html, AmThanh.html.

## Trang Artifact của chủ dự án (riêng tư)
- **Bộ não web KPI** (đăng lại sau mỗi việc): https://claude.ai/artifact/PXgStqzHKBtykmfvDch6GE
- Bốn kiểu giao diện KPI (demo 22/10): https://claude.ai/artifact/S35dXvGWZFSHA6UFSh4bb6
- Giới thiệu Nhà máy Carbon Billiards: https://claude.ai/artifact/63EC8tT6gTTMLfKccyjUEQ
- Nhà máy Carbon Billiards 3D: https://claude.ai/artifact/DDeNNhgicGzDcTmNgnEi5Y
- Âm thanh và giọng nói: https://claude.ai/artifact/ALKtCTRUzjSCtnWRMfACza
- Giao diện KPI Carbon (bản đầu, 27/08): https://claude.ai/artifact/EaecfHxMqfF4YKiCs7xeBZ
- Các artifact Thiên Cơ Các, bóng đá, banner thuộc dự án khác. Muốn xem đủ danh sách: dùng Artifact `action: "list"`.

## Kết nối (MCP) phiên trước đã dùng
- **Google Drive**: `search_files`, `download_file_content`, `create_file`, `get_file_permissions`.
- **GitHub**: `mcp__github__*`.
- **Claude Code Remote**: `create_session` (mở phiên mới), `send_later`, `read_documentation`.
- **Artifact**: đăng trang bản đồ, demo.
- Kết nối gắn với tài khoản claude.ai và có thể khác giữa các phiên. Thiếu cái nào thì tra `read_documentation` (connectors.add).

## Skill, vai chuyên gia, plugin (chi tiết ở [[Công cụ Claude]])
- Skill trong repo `.claude/skills/` (tự nạp): `impeccable`, `taste-skill`, `redesign-skill`, `minimalist-skill`, `brutalist-skill`, `soft-skill`.
- Vai chuyên gia `.claude/agents/` (Agency Agents): `bao-mat-ma-ai`, `bao-mat-ung-dung`, `quan-ly-van-hanh`, `kiem-tra-de-dung`, `dong-vai-nguoi-dung`, `soat-giao-dien-cuoi`, `nhac-nho-dong-vien`, `thiet-ke-dao-tao`, `hoi-nhap-nhan-su`. Ví dụ: ngày 22/10 dùng `hoi-nhap-nhan-su` + `thiet-ke-dao-tao` cho [[KPI Kỹ năng]].
- Plugin khai báo trong `.claude/settings.json`: ponytail, claude-mem, task-observer, claude-code-setup. Trên phiên đám mây thường không tải được.
- Skill có sẵn của Claude hay dùng: `artifact-design` (trước khi viết trang Artifact).

## Công cụ trong máy ảo (phiên đám mây)
- Playwright + Chromium có sẵn: `require('/opt/node22/lib/node_modules/playwright')`. Không chạy `playwright install`.
- 3D: `npm pack three@0.160.0` vào scratchpad, đặt `THREE=$S/three/package`; Chromium chạy `--use-gl=swiftshader` (chậm).
- Python: Pillow, numpy, openpyxl có sẵn; ffmpeg đủ codec lấy từ pip `imageio-ffmpeg`.
- Tải trang ngoài qua proxy: Chromium không tin CA của proxy, nên dùng `curl` hoặc Node `fetch` (NODE_USE_ENV_PROXY=1).
