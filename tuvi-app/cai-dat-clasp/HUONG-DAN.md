# Cập nhật Thiên Cơ Các không cần chép – dán (máy tính Windows)

Bộ này dùng **clasp**, công cụ chính thức của Google, để đẩy mã từ GitHub thẳng lên Apps Script. Cài một lần; về sau mỗi lần có bản mới chỉ cần bấm đúp một file.

Bộ này giống bộ của web KPI nhưng **dùng riêng cho Thiên Cơ Các**:
- Thư mục trên máy riêng: `ThienCoCac-AppsScript`.
- Tải đủ toàn bộ file của Thiên Cơ Các.
- Tự chặn nếu dán nhầm Mã tập lệnh của web KPI.

## Cần chuẩn bị
- Máy tính Windows 10/11, có mạng, đăng nhập được tài khoản Google **đang sở hữu dự án Apps Script của Thiên Cơ Các**.
- Tải thư mục này về máy, một trong hai cách:
  - Dùng file `cai-dat-clasp-thien-co-cac.zip` Claude gửi trong cuộc trò chuyện.
  - Hoặc mở https://github.com/phamdoanchiengroup-cloud/githubforclaude160695/tree/claude/happy-brown-lttkz3 → nút xanh **Code** → **Download ZIP** → giải nén → mở thư mục `tuvi-app\cai-dat-clasp`.
- **Phải giải nén trước:** chuột phải file ZIP → **Giải nén tất cả** → **Giải nén**. Nếu bấm đúp file .bat ngay trong ZIP, máy không thấy các file đi kèm và báo "CHUA GIAI NEN THU MUC".

## Cài đặt (một lần, khoảng 10 phút)
1. Bấm đúp **1-CAI-DAT.bat**. Nếu Windows hiện "Windows đã bảo vệ PC của bạn": bấm **Thông tin thêm** → **Vẫn chạy**.
2. Máy tự cài Node.js và clasp. Nếu máy hỏi quyền quản trị, bấm **Có**. Máy đã cài từ bộ web KPI thì bước này tự bỏ qua.
3. Trình duyệt mở trang cài đặt Apps Script. Gạt **Google Apps Script API** sang **Bật**, rồi quay lại cửa sổ đen bấm Enter.
4. Đăng nhập Google:
   - Nếu máy đã đăng nhập clasp từ bộ web KPI, cửa sổ sẽ hỏi có dùng luôn không. **Cùng tài khoản Google với Thiên Cơ Các** thì gõ `C` → Enter. Khác tài khoản thì chỉ bấm Enter để đăng nhập lại.
   - Khi trình duyệt mở trang đăng nhập: chọn **đúng tài khoản** sở hữu Thiên Cơ Các → bấm **Cho phép**.
5. Cửa sổ đen hỏi **Mã tập lệnh**. Mở dự án Apps Script của Thiên Cơ Các → bánh răng **Cài đặt dự án** (cột trái) → chép dòng **Mã tập lệnh** → dán vào cửa sổ đen (chuột phải để dán) → Enter.
6. Nếu dự án có nhiều bản triển khai, cửa sổ hỏi chọn bản nào là web đang dùng. Gõ số → Enter.
7. Thấy **CÀI ĐẶT XONG** là xong. Bản mã đang chạy được sao lưu vào `C:\Users\<tên bạn>\ThienCoCac-AppsScript\sao-luu\`.

## Mỗi lần có bản mới
- Bấm đúp **2-CAP-NHAT.bat**. Máy tự làm theo thứ tự:
  1. Sao lưu bản đang chạy.
  2. Tải toàn bộ file mới nhất từ GitHub và kiểm tra: đủ dung lượng từng file, đủ hàm chính, 3 mã phiên bản giao diện khớp nhau.
  3. Đẩy lên Apps Script.
  4. Triển khai phiên bản mới, **giữ nguyên đường link web**.
- Xong thì mở web, bấm **Ctrl+F5**.
- Các hàm "chạy một lần" (nếu bản mới có, ví dụ bật email hằng ngày) vẫn chạy trong Apps Script như cũ. Claude sẽ ghi rõ.
- Nếu lúc cài đặt máy báo không tự triển khai được: sau khi chạy 2-CAP-NHAT.bat, bạn vẫn bấm **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai** như trước.

## Khi bản mới có vấn đề
- Bấm đúp **3-KHOI-PHUC.bat** → chọn **1** (bản ngay trước lần cập nhật). Web quay về bản cũ.

## Lưu ý quan trọng
- Mỗi lần cập nhật, các file Thiên Cơ Các trên Apps Script được **thay bằng bản trên GitHub**:
  - Nếu bạn tự sửa trực tiếp trong Apps Script, hãy báo Claude trước để gộp vào. Nếu không, phần sửa sẽ bị thay (vẫn còn trong thư mục sao lưu).
  - File **Anh** (ảnh của bạn) đang có trên Apps Script được **giữ nguyên**, không bị thay.
  - File khác bạn tự thêm vào dự án cũng được giữ nguyên.
- Không chia sẻ thư mục `ThienCoCac-AppsScript` và file `.clasprc.json` trong thư mục người dùng. Đó là chìa khóa đăng nhập Google của clasp.
- Nếu web KPI và Thiên Cơ Các nằm ở **hai tài khoản Google khác nhau**, clasp chỉ nhớ một tài khoản tại một thời điểm. Khi chuyển sang cập nhật dự án kia, chạy lại file 1-CAI-DAT.bat của dự án đó để đăng nhập lại.
