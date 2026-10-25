# Tài nguyên và công cụ

Nhóm: Bắt đầu · Cập nhật 25/10/2026
Liên quan: [[Bàn giao phiên]] · [[00 Mục lục]] · [[TCC Tự đẩy code lên Apps Script]] · [[TCC Chuyên gia Agency Agents]] · [[TCC Kiểm thử]]

Mọi liên kết, kho mã, công cụ, plugin và skill mà các phiên trước đã dùng. **Không ghi mật khẩu, khóa, token hay dữ liệu lá số của chủ dự án vào đây** (repo công khai).

## Web và Apps Script
- Web app đang chạy (bản triển khai của chủ dự án): https://script.google.com/macros/s/AKfycbzhLTszBOsqraljnznusXU28rIRmJBXiQOjv7h33Yitwc_pl4XDqI4GsB8rjjttzOhB/exec
  - Phiên đám mây mở được để xem, nhưng lập lá số thật trên đó thường bị chờ quá lâu (Playwright hết 90 giây). Muốn thử giao diện thì dùng bản xem trước cục bộ (mục Công cụ bên dưới).
- Cập nhật code lên Apps Script bằng bộ bấm đúp `tuvi-app/cai-dat-clasp/` (clasp chạy trên máy Windows của chủ dự án): `1-CAI-DAT.bat` (lần đầu), `2-CAP-NHAT.bat` (tải mã mới nhất trên nhánh rồi đẩy lên), `3-KHOI-PHUC.bat`. Danh sách file dự phòng `ds-file.txt` dựng bằng `python3 tuvi-app/tools/tao-ds-file.py`. Chi tiết: [[TCC Tự đẩy code lên Apps Script]].
- Thuộc tính tập lệnh (Script Properties), chỉ ghi **tên**, giá trị do chủ dự án tự nhập: `SHEET_ID`, `BAO_CAO_EMAIL`, `TT_BANG_GIA`, `TT_CAU_HINH`, `ZALO_TOKEN`, `ZALO_CHAT_ID`, khóa payOS (nhập qua trang Quản trị).

## Kho mã GitHub
- Repo: `phamdoanchiengroup-cloud/githubforclaude160695` (công khai). Mỗi dự án một nhánh:
  - Thiên Cơ Các: `claude/happy-brown-lttkz3` (nhánh này, không tạo PR).
  - Web KPI sản xuất `kpi-app/`: `claude/beautiful-ptolemy-f2j7za`.
  - Trợ lý KPI qua Zalo `tro-ly-kpi/`: `claude/awesome-heisenberg-iulbd6`.
  - Thư mục `webbongda/` trên nhánh này là web bóng đá chủ dự án tự đưa lên – để nguyên.
- Nguồn 25 chuyên gia: https://github.com/msitarzewski/agency-agents → đã chép vào `.claude/agents/`. Xem [[TCC Chuyên gia Agency Agents]].
- Phiên đám mây không có `gh`; thao tác GitHub qua công cụ MCP `mcp__github__*` (nạp bằng ToolSearch khi cần).

## Ảnh và dữ liệu qua jsDelivr (thay cho Google Drive)
- Chủ dự án từng hỏi về Google Drive. Kết luận 24/10: **không dùng Drive**, vì ảnh trên Drive không chụp được vào PDF (bị chặn CORS). Dùng jsDelivr, ghim theo mã commit (tên nhánh có dấu "/" nên không dùng được tên nhánh).
- Mẫu đường dẫn: `https://cdn.jsdelivr.net/gh/phamdoanchiengroup-cloud/githubforclaude160695@<SHA>/tuvi-app/...`
  - Ảnh (`tuvi-app/anh/*.webp`: tranh Hologram, poster, bìa và nền PDF): SHA `87e4618d1f02c73e96908754d03858f52c54d941` – biến `TCC_CDN` trong Holo.html, `PDF_ANH_BIA` và `NEN_ANH` trong Script.html.
  - Dữ liệu 64 quẻ `tuvi-app/kinh-dich/kd64.json`: SHA `c23cec1236ca96712781973bf6f35308f513d205` – biến `KD_URL` trong Script.html (có dự phòng raw.githubusercontent).
  - Ảnh ngũ hành, 12 con giáp, bìa PDF mới (25/10): SHA `19203fbd20433f395336269a411f8aebcf990086` – biến `TCC_ANH_CDN` trong Script.html.
  - Thêm hoặc đổi ảnh: commit ảnh → lấy SHA mới → sửa các biến trên.

## Trang Artifact trên Claude (riêng tư của chủ dự án)
- Bản đồ bộ não (cập nhật cuối mỗi việc): https://claude.ai/artifact/ATmkGiUrZzEGjhRTxjyFjW
- Lá số và luận giải riêng của chủ dự án – **không chép dữ liệu này vào repo**: https://claude.ai/artifact/CE5huyxM4U34dEt4AS7o3N
- Bản demo giao diện dùng lá số chủ dự án: https://claude.ai/artifact/PBz32Cc5qPqNCoesKaJxCK
- Mẫu giao diện đã duyệt: "Vũ Trụ Vàng" https://claude.ai/artifact/GarfMYuDq6bsT7biUfxBMZ · "Hologram" https://claude.ai/artifact/C6SGBGqAMKYHSFaXhE5KoM · "Lá Số Hologram" https://claude.ai/artifact/DpFkFghKhTBxgip1xMxzGh

## Công cụ trong phiên đám mây
- Có sẵn: Node 22, Python 3, Chromium + Playwright (`/opt/node22/lib/node_modules/playwright`; **không** chạy `playwright install`), `pdftoppm`.
- Mã giả lập máy chủ: `tuvi-app/tools/gia-lap.js` (xuất `ctx` gọi được mọi hàm .gs).
- Xem trước giao diện: `python3 tuvi-app/tools/xem-truoc.py` → `tools/preview.html`. Chạy bằng Playwright với `page.exposeFunction('srv', …)` gọi `ctx`. Khi chụp ảnh, thêm CSS `.cho-hien{opacity:1!important}`, nếu không các khối hiện trống.
- Xuất PDF thử: `TYPE=demo|full PW=/opt/node22/lib/node_modules/playwright node tuvi-app/tools/xuat-pdf.js out.pdf`.
- Kiểm thử: `tuvi-app/tests/*.js` – danh sách và số kiểm thử ở [[TCC Kiểm thử]].
- WebSearch dùng được. WebFetch bị chặn với một số trang tiếng Việt (lasobattu.com, 4thuman.com).

## Plugin, skill, kết nối của tài khoản (không phải của repo)
- Đây là các kết nối của tài khoản claude.ai của chủ dự án, tự xuất hiện trong mỗi phiên, không lưu trong repo. Phiên mới kiểm tra bằng ToolSearch nếu cần.
- Đã dùng cho dự án:
  - **Artifact** – đăng bản đồ bộ não và các bản demo.
  - **claude-code-remote** – `create_session` (chuyển phiên mới), `send_later` (hẹn giờ quay lại).
  - **github** (MCP) – thao tác với GitHub.
  - Subagent `content-creator`, `ui-designer`, `pdf-engine-architect`… lấy từ `.claude/agents/`.
- Có trong tài khoản nhưng **chưa dùng** cho dự án: Google Drive, Gmail, Google Calendar, Canva, Figma, Adobe, HubSpot, Lovable… Không tự ý dùng nếu chủ dự án không yêu cầu.
- Skill sẵn có (gọi bằng công cụ Skill): `artifact-design`, `anthropic-skills:pdf`, `dataviz`, `code-review`… Dự án hiện không có skill riêng trong repo.
