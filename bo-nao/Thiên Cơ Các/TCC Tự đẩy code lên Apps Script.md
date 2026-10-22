# TCC Tự đẩy code lên Apps Script

Liên quan: [[Lần dán lên Apps Script]] · [[TCC Kiểm thử]] · [[Việc chờ chủ dự án]]

Nhóm: Thiên Cơ Các · Tạo 22/10/2026

## Mục đích
Chủ dự án yêu cầu (22/10) "tạo file cài đặt clasp để tự đẩy code từ github lên script", để khỏi phải dán tay từng file.

## Thành phần
- `.github/workflows/day-len-apps-script.yml`:
  - Chạy khi push lên `claude/happy-brown-lttkz3` có đổi `tuvi-app/*.gs`, `*.html` hoặc `appsscript.json`; chạy tay được bằng Run workflow.
  - Trước khi đẩy chạy `node tests/cai-dat.js`; trượt thì dừng.
  - Không chạy theo PR từ fork. Quyền `contents: read`.
- `tuvi-app/tools/day-len-apps-script.sh` (clasp 2.4.2):
  1. `clasp pull` bản đang chạy về thư mục tạm.
  2. Gom `*.gs`, `*.html` của repo. **Giữ** file chỉ có trên Apps Script, không để clasp xóa. Manifest lấy theo bản đang chạy, nếu không có thì dùng `appsscript.json` của repo.
  3. `clasp push -f`.
  4. Có `DEPLOYMENT_ID` thì chạy `clasp deploy -i` để tạo phiên bản mới và cập nhật triển khai; link web giữ nguyên.
  - `fileExtension: gs` để pull/push dùng đuôi `.gs`.
  - Đã chạy thử với clasp giả: đúng thứ tự, giữ được file riêng, đủ 36 file.
- `tuvi-app/HUONG-DAN-CLASP.md`: hướng dẫn chủ dự án cài từng bước (bật API, `clasp login`, lấy Script ID / Deployment ID, thêm secret, chạy thử, tắt, xử lý lỗi).

## Secret (chỉ chủ dự án nhập trên GitHub, không qua chat)
- `CLASPRC_JSON`: nội dung `~/.clasprc.json` sau `clasp login`.
- `SCRIPT_ID`.
- `DEPLOYMENT_ID` (tùy chọn).

## Lưu ý
- Khi đã bật, sửa trực tiếp trên Apps Script sẽ bị lần đẩy sau ghi đè. Chủ dự án gửi file để gộp 3 chiều như cũ.
- Mỗi push đổi mã lên nhánh = lên web thật, nên chỉ push sau khi kiểm thử đạt.
- Tình trạng 22/10: chưa cài secret.
