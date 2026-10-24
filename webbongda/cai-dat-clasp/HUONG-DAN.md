# Cập nhật web bóng đá không cần chép – dán (máy tính Windows)

Bộ này dùng **clasp**, công cụ chính thức của Google, để đẩy mã từ GitHub thẳng lên Apps Script của **web Giải Bóng Đá Rhino Billiards 2026**. Cài một lần; về sau mỗi lần có bản mới chỉ cần bấm đúp một file.

Bộ này giống bộ của web KPI và Thiên Cơ Các nhưng **dùng riêng cho web bóng đá**:
- Thư mục trên máy riêng: `WebBongDa-AppsScript`.
- Tải 2 file của web bóng đá: `Code.gs` và `Index.html` (thư mục `webbongda` trên GitHub).
- Tự chặn nếu dán nhầm Mã tập lệnh của web KPI hoặc Thiên Cơ Các.

## Cần chuẩn bị
- Máy tính Windows 10/11, có mạng, đăng nhập được tài khoản Google **đang sở hữu dự án Apps Script của web bóng đá** (dự án gắn với sheet "Web đá bóng 2026").
- Tải thư mục này về máy, một trong hai cách:
  - Dùng file `cai-dat-clasp-web-bong-da.zip` Claude gửi trong cuộc trò chuyện.
  - Hoặc mở https://github.com/phamdoanchiengroup-cloud/githubforclaude160695/tree/claude/happy-brown-lttkz3 → nút xanh **Code** → **Download ZIP** → giải nén → mở thư mục `webbongda\cai-dat-clasp`.
- **Phải giải nén trước:** chuột phải file ZIP → **Giải nén tất cả** → **Giải nén**. Nếu bấm đúp file .bat ngay trong ZIP, máy không thấy các file đi kèm và báo "CHUA GIAI NEN THU MUC".

## Cài đặt (một lần, khoảng 10 phút)
1. Bấm đúp **1-CAI-DAT.bat**. Nếu Windows hiện "Windows đã bảo vệ PC của bạn": bấm **Thông tin thêm** → **Vẫn chạy**.
2. Máy tự cài Node.js và clasp. Nếu máy hỏi quyền quản trị, bấm **Có**. Máy đã cài từ bộ web KPI / Thiên Cơ Các thì bước này tự bỏ qua.
3. Trình duyệt mở trang cài đặt Apps Script. Gạt **Google Apps Script API** sang **Bật**, rồi quay lại cửa sổ đen bấm Enter.
4. Đăng nhập Google:
   - Nếu máy đã đăng nhập clasp từ bộ khác, cửa sổ sẽ hỏi có dùng luôn không. **Cùng tài khoản Google với web bóng đá** thì gõ `C` → Enter. Khác tài khoản thì chỉ bấm Enter để đăng nhập lại.
   - Khi trình duyệt mở trang đăng nhập: chọn **đúng tài khoản** sở hữu web bóng đá → bấm **Cho phép**.
5. Cửa sổ đen hỏi **Mã tập lệnh**. Mở dự án Apps Script của web bóng đá (từ sheet: **Tiện ích mở rộng → Apps Script**) → bánh răng **Cài đặt dự án** (cột trái) → chép dòng **Mã tập lệnh** → dán vào cửa sổ đen (chuột phải để dán) → Enter.
6. Nếu dự án có nhiều bản triển khai, cửa sổ hỏi chọn bản nào là web đang dùng. Gõ số → Enter.
7. Thấy **CÀI ĐẶT XONG** là xong. Bản mã đang chạy được sao lưu vào `C:\Users\<tên bạn>\WebBongDa-AppsScript\sao-luu\`.

## Mỗi lần có bản mới
- Bấm đúp **2-CAP-NHAT.bat**. Máy tự làm theo thứ tự:
  1. Sao lưu bản đang chạy.
  2. Tải `Code.gs` và `Index.html` mới nhất từ GitHub và kiểm tra: đủ dung lượng từng file, đủ hàm chính, `Index.html` không bị cụt.
  3. Đẩy lên Apps Script.
  4. Triển khai phiên bản mới, **giữ nguyên đường link web**.
- Xong thì mở web, bấm **Ctrl+F5**.
- Nếu lúc cài đặt máy báo không tự triển khai được: sau khi chạy 2-CAP-NHAT.bat, bạn vẫn bấm **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai** như trước.

## Khi bản mới có vấn đề
- Bấm đúp **3-KHOI-PHUC.bat** → chọn **1** (bản ngay trước lần cập nhật). Web quay về bản cũ.

## Lưu ý quan trọng
- Mỗi lần cập nhật, `Code.gs` và `Index.html` trên Apps Script được **thay bằng bản trên GitHub**:
  - Nếu bạn tự sửa trực tiếp trong Apps Script, hãy báo Claude trước để gộp vào GitHub. Nếu không, phần sửa sẽ bị thay (vẫn còn trong thư mục sao lưu).
  - File khác bạn tự thêm vào dự án được giữ nguyên.
- Dữ liệu giải (đội, cầu thủ, tỷ số, sự kiện…) nằm trong Google Sheet, **không bị ảnh hưởng** khi cập nhật mã.
- Không chia sẻ thư mục `WebBongDa-AppsScript` và file `.clasprc.json` trong thư mục người dùng. Đó là chìa khóa đăng nhập Google của clasp.
- Nếu web KPI / Thiên Cơ Các / web bóng đá nằm ở **các tài khoản Google khác nhau**, clasp chỉ nhớ một tài khoản tại một thời điểm. Khi chuyển sang cập nhật dự án khác, chạy lại file 1-CAI-DAT.bat của dự án đó để đăng nhập lại.

## Ghi chú cho Claude
- Mỗi lần đổi `webbongda/Code.gs` hoặc `webbongda/Index.html`, cập nhật dung lượng byte trong `ds-file.txt` (dùng khi máy không vào được api.github.com):
  `printf 'Code.gs\t%s\r\nIndex.html\t%s\r\n' $(stat -c %s Code.gs) $(stat -c %s Index.html) > cai-dat-clasp/ds-file.txt` (chạy trong `webbongda/`).
- Nhận diện dự án: web bóng đá có `function KHOI_TAO_GIAI`; chặn KPI (`function CAI_TRIGGER_CHOT_THANG`) và Thiên Cơ Các (`function lapLaSo`). Không dùng `napDuLieu` để chặn KPI vì web bóng đá cũng có hàm này.
