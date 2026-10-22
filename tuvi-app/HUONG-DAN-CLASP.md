# Tự đẩy code từ GitHub lên Apps Script (clasp)

Sau khi cài xong một lần, mỗi khi Claude đẩy code mới lên nhánh `claude/happy-brown-lttkz3`, GitHub sẽ **tự dán toàn bộ file vào Apps Script và tự triển khai phiên bản mới**. Bạn chỉ cần mở web và bấm **Ctrl+F5**.

Bộ cài gồm:
- `.github/workflows/day-len-apps-script.yml`: lệnh tự chạy trên GitHub.
- `tuvi-app/tools/day-len-apps-script.sh`: đoạn mã đẩy file.

Cách chạy:
- Trước khi đẩy, nó tự kiểm tra đủ file, đủ hàm, mã giao diện khớp. Có lỗi thì **không đẩy**.
- File nào bạn tự thêm trên Apps Script mà GitHub không có thì **được giữ nguyên**, không bị xóa.

> ⚠️ **Lưu ý quan trọng:** sau khi bật tự đẩy, **đừng sửa code trực tiếp trên Apps Script nữa**. Lần đẩy sau sẽ ghi đè mất phần sửa đó.
> - Muốn sửa gì thì gửi file cho Claude, Claude gộp vào GitHub.
> - Hoặc tắt tự đẩy (mục 6).

Bạn cần làm 5 bước dưới đây, mất khoảng 15 phút. Cần dùng **máy tính** (Windows hoặc Mac), không làm trên điện thoại.

---

## Bước 1. Bật "Google Apps Script API"
1. Mở trang https://script.google.com/home/usersettings. Đăng nhập **đúng tài khoản Google đang chứa dự án Thiên Cơ Các**.
2. Gạt **Google Apps Script API** sang **Bật (On)**.

## Bước 2. Lấy "chìa khóa đăng nhập" clasp (file `.clasprc.json`)
Chìa khóa này cho phép GitHub thay bạn dán code. **Giữ kín, không gửi vào chat, không dán vào code.**

1. Cài **Node.js**: vào https://nodejs.org → tải bản **LTS** → cài, cứ bấm Next đến hết.
2. Mở cửa sổ lệnh:
   - Windows: bấm phím Windows → gõ `cmd` → Enter.
   - Mac: mở **Terminal**.
3. Dán lệnh sau rồi Enter:
   ```
   npx -y @google/clasp@2.4.2 login
   ```
4. Trình duyệt tự mở. Chọn **đúng tài khoản Google** ở bước 1 → **Cho phép (Allow)**. Thấy dòng "Logged in" là xong.
5. Mở file chìa khóa:
   - Windows: dán lệnh `notepad %USERPROFILE%\.clasprc.json` → Enter.
   - Mac: dán lệnh `open -e ~/.clasprc.json` → Enter.
6. Trong cửa sổ Notepad vừa mở: **Ctrl+A → Ctrl+C** để chép toàn bộ nội dung. Nội dung bắt đầu bằng `{"token":` hoặc `{"access_token":`. Để đó, dùng ở bước 4.

## Bước 3. Lấy 2 mã của dự án
1. **Mã tập lệnh (Script ID):** mở dự án Apps Script → biểu tượng **⚙ Cài đặt dự án** (cột trái) → mục **Mã tập lệnh** → **Sao chép**.
2. **Mã triển khai (Deployment ID):**
   - **Triển khai → Quản lý triển khai** → chọn bản **Ứng dụng web** đang dùng → **Sao chép Mã triển khai**.
   - Có mã này thì GitHub tự làm luôn bước "Phiên bản mới → Triển khai", link web giữ nguyên.

## Bước 4. Cất 3 mã vào GitHub (Secrets)
1. Mở https://github.com/phamdoanchiengroup-cloud/githubforclaude160695 → **Settings** → **Secrets and variables** → **Actions**.
2. Bấm **New repository secret** 3 lần, mỗi lần một mã:

| Name (gõ đúng y hệt) | Secret (dán vào) |
|---|---|
| `CLASPRC_JSON` | toàn bộ nội dung file `.clasprc.json` ở bước 2 |
| `SCRIPT_ID` | Mã tập lệnh ở bước 3 |
| `DEPLOYMENT_ID` | Mã triển khai ở bước 3 |

Secret được GitHub mã hóa. Người xem repo, kể cả khi repo công khai, **không đọc được**.

## Bước 5. Chạy thử lần đầu
1. **Sao lưu dự án trước:** Apps Script → Tổng quan → Tạo bản sao dự án.
2. Trên GitHub: tab **Actions** → chọn **Đẩy lên Apps Script** → **Run workflow** → chọn nhánh `claude/happy-brown-lttkz3` → **Run workflow**.
3. Chờ 1–2 phút:
   - **dấu ✓ xanh**: xong. Mở web, bấm Ctrl+F5.
   - **dấu ✗ đỏ**: bấm vào xem dòng báo lỗi, chụp màn hình gửi Claude.

Từ giờ mỗi lần Claude đẩy code thay đổi file `.gs` hoặc `.html`, việc dán sẽ tự chạy. Ghi chép trong `bo-nao` không kích hoạt.

---

## 6. Tắt hoặc gỡ
- **Tạm tắt:** GitHub → Actions → **Đẩy lên Apps Script** → nút **···** → **Disable workflow**.
- **Thu hồi quyền hoàn toàn:** vào https://myaccount.google.com/permissions → tìm **clasp** → **Xóa quyền truy cập**, rồi xóa secret `CLASPRC_JSON`.

## Lỗi thường gặp
| Báo lỗi | Cách xử lý |
|---|---|
| `Chưa cài secret CLASPRC_JSON hoặc SCRIPT_ID` | Làm lại bước 4, kiểm tra tên secret gõ đúng chữ hoa. |
| `User has not enabled the Apps Script API` | Làm lại bước 1, chờ vài phút rồi chạy lại. |
| `invalid_grant` / `Could not read API credentials` | Chìa khóa hết hạn, ví dụ sau khi đổi mật khẩu Google. Làm lại bước 2 rồi cập nhật secret `CLASPRC_JSON`. |
| `Kiểm tra cài đặt` báo thiếu | Code trên GitHub có lỗi nên chưa được đẩy. Báo Claude sửa. |
