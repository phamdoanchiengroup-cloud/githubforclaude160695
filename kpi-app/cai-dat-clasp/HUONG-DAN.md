# Cập nhật web KPI không cần chép – dán (máy tính Windows)

Bộ này dùng **clasp**, công cụ chính thức của Google, để đẩy mã từ GitHub thẳng lên Apps Script. Cài một lần; về sau mỗi lần có bản mới chỉ cần bấm đúp một file.

## Cần chuẩn bị
- Máy tính Windows 10/11, có mạng, đăng nhập được tài khoản Google **đang sở hữu dự án Apps Script của web KPI**.
- Tải thư mục này về máy: dùng file ZIP Claude gửi trong cuộc trò chuyện (repo GitHub để riêng tư từ 23/11 – muốn tải ZIP từ GitHub thì phải đăng nhập GitHub trước).
- **Phải giải nén trước** (chuột phải file ZIP → **Giải nén tất cả** → **Giải nén**). Bấm đúp file .bat ngay trong ZIP thì máy không thấy các file đi kèm và báo "CHUA GIAI NEN THU MUC".

## Cài đặt (một lần, khoảng 10–15 phút)
1. Bấm đúp **1-CAI-DAT.bat**. Nếu Windows hiện "Windows đã bảo vệ PC của bạn" → bấm **Thông tin thêm** → **Vẫn chạy**.
2. Máy tự cài Node.js (có thể hỏi quyền quản trị → bấm **Có**) và clasp.
3. Trình duyệt mở trang cài đặt Apps Script → gạt **Google Apps Script API** sang **Bật** → quay lại cửa sổ đen, bấm Enter.
4. Trình duyệt mở trang đăng nhập Google → chọn **đúng tài khoản** sở hữu web KPI → bấm **Cho phép**.
5. Cửa sổ đen hỏi **Mã tập lệnh**: mở **đúng dự án đang chạy web công ty** (không phải bản sao "Bản sao của …" – kiểm tra: Triển khai → Quản lý triển khai phải thấy đúng link công nhân đang dùng) của web KPI → bánh răng **Cài đặt dự án** (cột trái) → chép dòng **Mã tập lệnh** → dán vào cửa sổ đen (chuột phải để dán) → Enter.
6. Nếu dự án có nhiều bản triển khai, cửa sổ hỏi chọn bản nào là web đang dùng → gõ số → Enter.
7. Thấy **CÀI ĐẶT XONG** là xong. Bản mã đang chạy được sao lưu vào `C:\Users\<tên bạn>\KPI-AppsScript\sao-luu\`.

## Repo GitHub để riêng tư – nhập mã truy cập (23/11, mỗi máy một lần)
Từ 23/11 repo GitHub chuyển sang **riêng tư**, nên máy phải có mã truy cập mới tải được bản mới. Cùng một mã dùng cho cả máy ở nhà và máy văn phòng.
1. **Tạo mã (làm một lần):** đăng nhập GitHub → mở https://github.com/settings/personal-access-tokens/new
   - Token name: `KPI cap nhat` · Expiration: **1 năm** (hoặc lâu hơn)
   - Repository access: **Only select repositories** → chọn `githubforclaude160695`
   - Permissions → Repository permissions → **Contents: Read-only** (để nguyên các mục khác)
   - Bấm **Generate token** → chép dòng `github_pat_...` (chỉ hiện một lần; lưu tạm vào ghi chú điện thoại, KHÔNG gửi cho ai, KHÔNG gửi Claude).
2. **Trên mỗi máy:** bấm đúp **4-NHAP-MA-GITHUB.bat** → chuột phải để dán mã (chữ không hiện ra – vẫn dán được) → Enter → thấy **XONG** là được. Máy thử tải luôn để chắc mã đúng; mã được lưu mã hóa, chỉ đúng tài khoản Windows trên máy đó đọc được.
3. Hết hạn hoặc lỡ lộ mã: vào https://github.com/settings/personal-access-tokens xóa mã cũ, tạo mã mới, chạy lại bước 2 trên mỗi máy.

## Mỗi lần có bản mới
- Bấm đúp **2-CAP-NHAT.bat**. Máy tự: sao lưu bản đang chạy → tải các file mới (Code và các file HTML ghi trong `danh-sach-file.txt` trên GitHub – hiện là Index, SoDo, HoatAnh, AmThanh, QuyTrinh; web thêm file mới thì máy tự biết, không phải cài lại) → đẩy lên Apps Script → triển khai phiên bản mới, **giữ nguyên đường link web**. Xong mở web bấm Ctrl+F5.
- Các hàm "chạy một lần" (nếu bản mới có) vẫn chạy trong Apps Script như cũ – Claude sẽ ghi rõ.
- Nếu lúc cài đặt máy báo không tự triển khai được, sau khi chạy 2-CAP-NHAT.bat bạn vẫn bấm **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai** như trước.

## Khi bản mới có vấn đề
- Bấm đúp **3-KHOI-PHUC.bat** → chọn **1** (bản ngay trước lần cập nhật) → web quay về bản cũ.

## Lưu ý quan trọng
- Mỗi lần cập nhật, toàn bộ file Code và các file HTML trong danh sách trên Apps Script được **thay bằng bản trên GitHub**. Nếu bạn tự sửa trực tiếp trong Apps Script, hãy báo Claude trước để gộp vào, nếu không phần sửa sẽ bị thay (vẫn còn trong thư mục sao lưu).
- File khác bạn tự thêm vào dự án (nếu có) được giữ nguyên.
- Không chia sẻ thư mục `KPI-AppsScript` và file `.clasprc.json` trong thư mục người dùng – đó là chìa khóa đăng nhập Google của clasp.
