# Thiên Cơ Các – bối cảnh cho phiên Claude Code mới

File này được Claude Code tự đọc khi mở repo. Nó giữ **quy tắc bắt buộc** và chỉ đường vào **bộ não thứ hai** `bo-nao/`, nơi chứa toàn bộ "trí nhớ" chi tiết của các phiên trước. Đọc hết file này, rồi đọc `bo-nao/Bàn giao phiên.md` (trạng thái mới nhất), `bo-nao/Tài nguyên và công cụ.md` (liên kết web/Artifact, repo, jsDelivr, công cụ, plugin) và `bo-nao/00 Mục lục.md` trước khi làm việc.

## Dự án
- Web app **Google Apps Script** luận vận mệnh 6 hệ: Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học, Human Design. Có bán nội dung bằng **xu**. Mã trong `tuvi-app/` (bảng vai trò từng file: `tuvi-app/README.md`; hướng dẫn cài đặt: `tuvi-app/HUONG-DAN-CAI-DAT.md`). Chi tiết: `bo-nao/Thiên Cơ Các/`.
- **Mỗi dự án một nhánh** (chủ dự án chốt 21/10). Nhánh này chỉ chứa Thiên Cơ Các: commit và push lên **`claude/happy-brown-lttkz3`**. Không tạo PR nếu chủ dự án không yêu cầu.
- Dự án khác của chủ dự án, không liên quan, nằm ở nhánh riêng – đừng đưa vào nhánh này: **web KPI sản xuất** (`kpi-app/`) ở `claude/beautiful-ptolemy-f2j7za`; **Trợ lý KPI qua Zalo** (`tro-ly-kpi/`) ở `claude/awesome-heisenberg-iulbd6`.

## Chủ dự án – cách làm việc (bắt buộc)
- **Trả lời bằng tiếng Việt.**
  - Chủ dự án không phải dân IT, nên hướng dẫn từng bước theo dạng **"MỞ FILE X → xóa hết → dán bản mới"**.
  - Luôn nói rõ **file nào cần dán lại** vào Apps Script, kèm bước **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai**, rồi Ctrl+F5.
- Nhắc **sao lưu** (Tổng quan → Tạo bản sao dự án) trước khi dán thay đổi lớn.
- **Cái gì xong trước thì gửi trước** (chủ dự án nhắc 19/10): làm nhiều sản phẩm một lúc thì phần nào xong và đã kiểm tra gửi ngay.
- Trước khi đề xuất gì, xem `bo-nao/Quyết định của chủ dự án.md`.
- Chủ dự án hay gửi file đã tự sửa. Khi nhận:
  - **Gộp 3 chiều** với bản trong repo (`git merge-file`), không ghi đè mất thay đổi của họ.
  - Rồi rà lỗi.
- **Văn luận giải cho người đọc:**
  - Ngôn ngữ đời thường. **Không nêu tên sao** trong phần "dễ hiểu". Thuật ngữ cổ phải giải nghĩa. Không dùng chữ Hán trong văn (chỉ giữ tên Hán-Việt).
  - **Tầng 1:** "Bạn thuộc mẫu người… / có xu hướng…".
  - **Tầng 2:** giọng nhẹ nhàng, không phán xét, luôn kèm hướng khắc phục.
  - Hai tầng không được mâu thuẫn nhau.
- **Nghiệm chứng:** từ 6/8 nhóm "đúng cao" trở lên là xác nhận, 4–5 nhóm là có thể đúng. Mã hiện quy ra tỷ lệ kèm ngưỡng %.
- **Bảo mật:**
  - Mật khẩu chủ sở hữu (`chienpham`) chỉ lưu dạng muối + băm (`TK_CHU_SEED` trong `TaiKhoan.gs`). **Không bao giờ ghi mật khẩu thật vào repo hay commit.**
  - Khóa payOS được nhập qua giao diện quản trị vào Script Properties, không đưa vào mã hay chat.

## Quy tắc kỹ thuật không được quên
- Thêm file `.gs` mới: thêm vào `HAM_CAN_CO` trong Code.gs (hàm `kiemTraCaiDat`) và cập nhật số file trong `tuvi-app/HUONG-DAN-CAI-DAT.md`. `BAN_MOI_CAN_CO` phải trỏ đúng hàm chứa lời gọi.
- Mỗi đợt sửa giao diện tăng cả 3 mã phiên bản (`tcc-ban` trong Index.html, `--tcc-ban` trong Styles.html, `BAN_GIAO_DIEN` trong Script.html).
- **Cập nhật bằng bộ bấm đúp** (`tuvi-app/cai-dat-clasp/`, clasp chạy trên máy Windows của chủ dự án): `2-CAP-NHAT.bat` tải mã mới nhất trên nhánh này rồi đẩy lên Apps Script, nên chỉ push mã đã qua kiểm thử; thêm/sửa file .gs/.html thì chạy `python3 tuvi-app/tools/tao-ds-file.py` (danh sách dự phòng `cai-dat-clasp/ds-file.txt`). Không dùng GitHub Actions (chủ dự án tắt 22/10). Xem `bo-nao/Thiên Cơ Các/TCC Tự đẩy code lên Apps Script.md`.
- `LaSo3D.gs` là bản sinh ra (`node tools/demo-3d.js`), không sửa tay.
- Chạy kiểm thử liên quan trước khi commit: `bo-nao/Thiên Cơ Các/TCC Kiểm thử.md`.
- 25 chuyên gia (subagent, từ repo agency-agents) ở `.claude/agents/` – danh sách và cách gọi: `bo-nao/Thiên Cơ Các/TCC Chuyên gia Agency Agents.md`.

## Bộ não thứ hai `bo-nao/` (kiểu Obsidian)
- Mỗi ghi chú một chủ đề, tên file = tiêu đề, thư mục `Thiên Cơ Các/`; file ở gốc là ghi chú tổng hợp: [[00 Mục lục]], [[Việc chờ chủ dự án]], [[Lần dán lên Apps Script]], [[Quyết định của chủ dự án]]. Liên kết bằng `[[Tên ghi chú]]`, dòng 3 mỗi ghi chú ghi `Liên quan: [[...]]`.
- **Cuối mỗi việc, cập nhật bộ não** (không dồn chi tiết vào CLAUDE.md):
  1. Sửa ghi chú chủ đề: ngày, việc đã làm, tên hàm/file, số kiểm thử. Chủ đề mới → ghi chú mới + thêm vào `00 Mục lục.md`.
  2. Cập nhật `Việc chờ chủ dự án.md`, `Lần dán lên Apps Script.md`, `Quyết định của chủ dự án.md` nếu có thay đổi.
  3. `python3 bo-nao/tao-ban-do.py` (báo lỗi nếu có liên kết hỏng) → dựng `bo-nao/ban-do.html`.
  4. Đăng lại trang bản đồ lên cùng link Artifact dưới đây (Artifact publish với `url` = link đó, `file_path` = `bo-nao/ban-do.html`; đọc artifact trước nếu phiên này chưa đọc).
- **Trang bản đồ bộ não Thiên Cơ Các (Artifact riêng tư của chủ dự án):** https://claude.ai/artifact/ATmkGiUrZzEGjhRTxjyFjW

## Môi trường phiên đám mây
- Không chạy `playwright install`; Chromium có sẵn (`PW=/opt/node22/lib/node_modules/playwright`).
- WebFetch bị chặn với một số trang tiếng Việt (vd. lasobattu.com, 4thuman.com); WebSearch dùng được.
