# Cập nhật web KPI không cần chép – dán (máy tính Windows)

Bộ này dùng **clasp**, công cụ chính thức của Google, để đẩy mã từ GitHub thẳng lên Apps Script. Cài một lần; về sau mỗi lần có bản mới chỉ cần bấm đúp một file.

## Cần chuẩn bị
- Máy tính Windows 10/11, có mạng, đăng nhập được tài khoản Google **đang sở hữu dự án Apps Script của web KPI**.
- Tải thư mục này về máy: mở https://github.com/phamdoanchiengroup-cloud/githubforclaude160695/tree/claude/beautiful-ptolemy-f2j7za → nút xanh **Code** → **Download ZIP** → giải nén → mở thư mục `kpi-app\cai-dat-clasp`. (Hoặc dùng file ZIP Claude gửi trong cuộc trò chuyện.)
- **Phải giải nén trước** (chuột phải file ZIP → **Giải nén tất cả** → **Giải nén**). Bấm đúp file .bat ngay trong ZIP thì máy không thấy các file đi kèm và báo "CHUA GIAI NEN THU MUC".

## Cài đặt (một lần, khoảng 10–15 phút)
1. Bấm đúp **1-CAI-DAT.bat**. Nếu Windows hiện "Windows đã bảo vệ PC của bạn" → bấm **Thông tin thêm** → **Vẫn chạy**.
2. Máy tự cài Node.js (có thể hỏi quyền quản trị → bấm **Có**) và clasp.
3. Trình duyệt mở trang cài đặt Apps Script → gạt **Google Apps Script API** sang **Bật** → quay lại cửa sổ đen, bấm Enter.
4. Trình duyệt mở trang đăng nhập Google → chọn **đúng tài khoản** sở hữu web KPI → bấm **Cho phép**.
5. Cửa sổ đen hỏi **Mã tập lệnh**: mở dự án Apps Script của web KPI → bánh răng **Cài đặt dự án** (cột trái) → chép dòng **Mã tập lệnh** → dán vào cửa sổ đen (chuột phải để dán) → Enter.
6. Nếu dự án có nhiều bản triển khai, cửa sổ hỏi chọn bản nào là web đang dùng → gõ số → Enter.
7. Thấy **CÀI ĐẶT XONG** là xong. Bản mã đang chạy được sao lưu vào `C:\Users\<tên bạn>\KPI-AppsScript\sao-luu\`.

## Mỗi lần có bản mới
- Bấm đúp **2-CAP-NHAT.bat**. Máy tự: sao lưu bản đang chạy → tải 5 file mới (Code, Index, SoDo, HoatAnh, AmThanh) → đẩy lên Apps Script → triển khai phiên bản mới, **giữ nguyên đường link web**. Xong mở web bấm Ctrl+F5.
- Các hàm "chạy một lần" (nếu bản mới có) vẫn chạy trong Apps Script như cũ – Claude sẽ ghi rõ.
- Nếu lúc cài đặt máy báo không tự triển khai được, sau khi chạy 2-CAP-NHAT.bat bạn vẫn bấm **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai** như trước.

## Khi bản mới có vấn đề
- Bấm đúp **3-KHOI-PHUC.bat** → chọn **1** (bản ngay trước lần cập nhật) → web quay về bản cũ.

## Lưu ý quan trọng
- Mỗi lần cập nhật, toàn bộ file Code / Index / SoDo / HoatAnh / AmThanh trên Apps Script được **thay bằng bản trên GitHub**. Nếu bạn tự sửa trực tiếp trong Apps Script, hãy báo Claude trước để gộp vào, nếu không phần sửa sẽ bị thay (vẫn còn trong thư mục sao lưu).
- File khác bạn tự thêm vào dự án (nếu có) được giữ nguyên.
- Không chia sẻ thư mục `KPI-AppsScript` và file `.clasprc.json` trong thư mục người dùng – đó là chìa khóa đăng nhập Google của clasp.
