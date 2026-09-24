# Hướng dẫn cài đặt Thiên Cơ Các từ đầu

Nên làm trên máy tính, dùng Chrome, đăng nhập bằng tài khoản Google sẽ sở hữu web.

## Phần A – Tạo dự án Apps Script

1. Vào **sheets.google.com** và tạo **Bảng tính trống**. Đặt tên, ví dụ `Thiên Cơ Các – Dữ liệu`.
   Bảng tính này lưu lịch sử lá số, ví xu, sổ cái, đơn nạp và các phần đã mở khóa.
2. Trên thanh menu của bảng tính, chọn **Tiện ích mở rộng → Apps Script**. Một tab mới mở ra, đây là trình soạn thảo.
3. Bấm vào tên `Dự án không có tiêu đề` ở góc trái và đổi thành `Thiên Cơ Các`.

## Phần B – Dán mã (19 file .gs + 4 file HTML)

Mã nằm trên GitHub, nhánh `claude/happy-brown-lttkz3`, thư mục `tuvi-app/`.
Với mỗi file: mở file trên GitHub → bấm nút **Raw** (hoặc biểu tượng 📋 *Copy raw file*) → **Ctrl+A**, **Ctrl+C**.

### B1. Các file Script (.gs)

- File `Mã.gs` có sẵn: bấm **⋮** cạnh tên → **Đổi tên** thành `Code`. Xóa hết nội dung cũ rồi dán `Code.gs`.
- Các file còn lại: bấm **＋** cạnh chữ *Tệp* → **Tập lệnh**. Gõ tên **không có đuôi .gs** rồi dán nội dung.

| # | Tên file | # | Tên file |
|---|---|---|---|
| 1 | `Code` | 10 | `HumanDesign` |
| 2 | `Lunar` | 11 | `ThanSoHoc` |
| 3 | `TuVi` | 12 | `TongHop` |
| 4 | `BatTu` | 13 | `TaiKhoan` |
| 5 | `LuanGiai` | 14 | `ThanhToan` |
| 6 | `BatTuChiTiet` | 15 | `BatTuLuan` |
| 7 | `DuDoan` | 16 | `HaLac` |
| 8 | `Astro` | 17 | `HoiTu` |
| 9 | `ChiemTinh` | 18 | `PhoiNgau` |
|  |  | 19 | `CapDoi` |

Thứ tự tạo file không quan trọng, chỉ cần **đúng tên, đúng chữ hoa/thường**.

### B2. Các file HTML

Bấm **＋ → HTML**, gõ tên **không có đuôi .html**:

| Tên file | Ghi chú |
|---|---|
| `Index` | Khung trang |
| `Styles` | Giao diện |
| `Script` | Mã chạy trên trình duyệt (file dài, chép bằng Raw cho đủ) |
| `Anh` | Ảnh quảng bá (khoảng 118 KB, là một dòng base64 rất dài). Không bắt buộc, thiếu file này web vẫn chạy |

### B3. File cấu hình (nên làm)

1. Bấm **⚙ Cài đặt dự án** ở thanh bên trái → tích **Hiển thị tệp kê khai "appsscript.json" trong trình chỉnh sửa**.
2. Quay lại **Trình chỉnh sửa**, mở `appsscript.json`, xóa hết rồi dán nội dung file `appsscript.json` trên GitHub.
   File này đặt múi giờ Việt Nam và quyền truy cập web cho mọi người.

Bấm **💾 Lưu** (Ctrl+S). Nếu có lỗi cú pháp, thường do chép thiếu cuối file: mở Raw và chép lại.

## Phần C – Chạy các hàm (chỉ làm một lần)

Ở thanh trên trình soạn thảo có ô chọn hàm, bên cạnh nút **▶ Chạy**. Chạy theo thứ tự sau:

| Bước | Mở file | Chọn hàm | Kết quả mong đợi trong *Nhật ký thực thi* |
|---|---|---|---|
| 1 | `Code` | `kiemTraCaiDat` | `✔ Cài đặt đúng: đủ 19 file .gs và 3 file HTML.` Nếu thấy dòng `✘`, sửa đúng file được nêu |
| 2 | `Code` | `testLapLaSo` | Lần đầu Google hỏi quyền (xem ghi chú bên dưới). Sau đó có kết quả lá số thử |
| 3 | `ThanhToan` | `capQuyenThanhToan` | `✔ Đã cấp quyền và tạo các trang tính Vi, SoCai, MoKhoa, DonHang.` |

**Khi Google hỏi quyền:**
1. Bấm **Xem xét quyền** và chọn tài khoản Google của bạn.
2. Nếu hiện *Google chưa xác minh ứng dụng này*: bấm **Nâng cao** → **Chuyển tới Thiên Cơ Các (không an toàn)**.
   Đây là mã của chính bạn nên an toàn.
3. Bấm **Cho phép**.

Các quyền được xin: đọc/ghi bảng tính, gọi mạng (payOS), cài trình kích hoạt 5 phút, khóa đồng thời.
Quay lại bảng tính, bạn sẽ thấy các trang `Vi`, `SoCai`, `MoKhoa`, `DonHang`.

## Phần D – Triển khai web

### Lần đầu

1. Bấm **Triển khai → Bản triển khai mới**.
2. Bấm **⚙** cạnh *Chọn loại* → **Ứng dụng web**.
3. Điền:
   - Mô tả: `v1`
   - **Thực thi với tư cách: Tôi**
   - **Người có quyền truy cập: Bất kỳ ai**
4. Bấm **Triển khai**, rồi chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`). Đây là link bạn gửi cho khách.

### Khi cập nhật mã về sau

Đừng tạo bản triển khai mới, vì làm vậy sẽ đổi link.

Làm như sau: **Triển khai → Quản lý các lần triển khai → ✎ (Chỉnh sửa) → Phiên bản: Phiên bản mới → Triển khai**. Link giữ nguyên.

Nếu web báo "Cài đặt chưa đúng", đọc danh sách lỗi hiện trên trang, sửa file tương ứng, rồi cập nhật phiên bản như trên.

## Phần E – Đăng nhập chủ sở hữu

1. Mở link web → **🔑 Đăng nhập** bằng tài khoản `chienpham` và mật khẩu bạn đã đặt.
2. **Việc đầu tiên:** vào **Tài khoản → 🔒 Đổi mật khẩu** và đổi sang mật khẩu mới chỉ mình bạn biết.
3. Trong **Tài khoản** sẽ có nút **⚙ Quản trị**. Trang quản trị có 5 thẻ: Doanh thu & đơn, Tài khoản, Bảng giá, Khuyến mãi, Thanh toán.

## Phần F – Tài khoản ngân hàng nhận tiền

Có 2 cách. Nên bắt đầu bằng cách 1 để bán được ngay, sau đó chuyển sang cách 2 để hệ thống tự cộng xu.

### F1. Chuẩn bị tài khoản ngân hàng

- Dùng tài khoản đứng tên chính bạn. Có thể mở online trong 5–10 phút qua app ngân hàng: tải app → **Mở tài khoản** → chụp CCCD gắn chip → quay mặt (eKYC) → chọn số tài khoản.
- Nên mở một **tài khoản riêng cho kinh doanh**, không dùng chung với chi tiêu cá nhân, để dễ đối soát và kê khai thuế.
- Nếu định dùng payOS (cách 2), hãy chọn ngân hàng mà payOS hỗ trợ liên kết. Danh sách xem trong my.payos.vn → *Tài khoản ngân hàng*. Thường có MB Bank, ACB, KienlongBank, OCB… Danh sách có thể thay đổi nên kiểm tra trước khi mở.

Mã BIN của một số ngân hàng (điền ở trang quản trị):

| Ngân hàng | BIN | Ngân hàng | BIN |
|---|---|---|---|
| MB Bank | 970422 | Vietcombank | 970436 |
| ACB | 970416 | VietinBank | 970415 |
| Techcombank | 970407 | BIDV | 970418 |
| TPBank | 970423 | VPBank | 970432 |
| KienlongBank | 970452 | OCB | 970448 |

### F2. Cách 1 – Chuyển khoản thủ công (không cần đăng ký gì thêm)

1. Vào **⚙ Quản trị → Thanh toán**. Ở mục *Tài khoản nhận tiền*, điền:
   - Mã BIN (ví dụ `970422`)
   - Tên ngân hàng (ví dụ `MB Bank`)
   - Số tài khoản
   - Chủ tài khoản (viết in hoa, không dấu, đúng như trên thẻ)
2. Bấm **Lưu cài đặt**.
3. Cách hoạt động:
   - Khách chọn gói nạp và thấy mã QR (VietQR) có sẵn số tiền và nội dung `TCCxxxxxx`.
   - Khi nhận được tiền trong app ngân hàng, bạn vào **Quản trị → Doanh thu & đơn**, tìm đơn có nội dung khớp và bấm **✓ Đã nhận tiền**.
   - Hệ thống cộng xu cho khách, kèm thưởng nạp lần đầu và thưởng cho người giới thiệu nếu có.
4. Nếu khách chuyển sai nội dung, đối chiếu theo số tiền và giờ chuyển. Nếu không khớp được, vào **Quản trị → Tài khoản** và bấm **± Xu** để cộng tay.

### F3. Cách 2 – payOS (tự động cộng xu, khuyên dùng)

payOS là cổng nhận chuyển khoản VietQR. Tiền **về thẳng tài khoản ngân hàng của bạn**, payOS chỉ báo trạng thái đã thanh toán.

1. **Đăng ký:** vào **my.payos.vn** → *Đăng ký* bằng email hoặc số điện thoại → xác thực danh tính bằng CCCD.
   Có thể đăng ký với tư cách cá nhân hoặc hộ kinh doanh / doanh nghiệp. Làm theo hướng dẫn trên màn hình.
2. **Tạo tổ chức:** tạo *Tổ chức* với tên thương hiệu `Thiên Cơ Các`.
3. **Liên kết ngân hàng:** vào *Tài khoản ngân hàng* → *Thêm tài khoản* → chọn ngân hàng → nhập số tài khoản → xác nhận bằng OTP hoặc app ngân hàng.
4. **Tạo kênh thanh toán:** vào *Kênh thanh toán* → *Tạo kênh* → chọn tài khoản ngân hàng vừa liên kết.
   Mở kênh ra sẽ thấy 3 mã: **Client ID**, **API Key**, **Checksum Key**.
5. **Dán khóa vào web:** vào **⚙ Quản trị → Thanh toán**, điền 3 mã vào ô tương ứng → **Lưu cài đặt**.
   - Sau khi lưu, trang báo *"đã bật đối soát tự động mỗi 5 phút"*.
   - Bấm **Kiểm tra kết nối payOS**. Nếu thấy *"kết nối được (đơn thử #1 không tồn tại là bình thường)"* là xong.
   - Ô *Link quay về* để trống (mặc định là link web).
6. **Thử thật:** tạo một tài khoản khách khác, nạp gói nhỏ nhất (50.000đ) và chuyển khoản.
   Trong vòng vài giây đến 5 phút, đơn chuyển sang *Đã thanh toán* và xu được cộng. Tiền vào tài khoản ngân hàng của bạn.

**Bảo mật khóa:** 3 mã payOS chỉ nhập ở trang quản trị. Chúng được lưu trong *Script Properties* của dự án, không nằm trong mã và không hiện lại đầy đủ. **Không** gửi các mã này qua chat, email hay dán vào file.
Nếu nghi bị lộ, vào my.payos.vn tạo lại khóa, rồi nhập mã mới vào trang quản trị. Muốn xóa một mã, nhập `-` vào ô đó.

### F4. Lưu ý pháp lý và thuế

- Thu tiền dịch vụ online là hoạt động kinh doanh. Doanh thu vượt ngưỡng chịu thuế của cá nhân kinh doanh thì phải kê khai và nộp thuế. Hỏi cơ quan thuế hoặc kế toán về ngưỡng và mẫu kê khai hiện hành.
- Trên web đã ghi *"Kết quả mang tính tham khảo"*. Đừng quảng cáo theo hướng cam kết kết quả.

## Phần G – Kiểm tra cuối cùng

- [ ] Mở link ở cửa sổ ẩn danh: lập được lá số, thấy phần xem thử và nút mở khóa.
- [ ] Đăng ký một tài khoản thử → nạp → xu được cộng, kèm thưởng 100% cho lần nạp đầu.
- [ ] Mở khóa *Bản mở* (49 xu) → xem được đầy đủ → tải được PDF.
- [ ] Đăng nhập `chienpham`: xem toàn bộ, không bị trừ xu, vào được trang quản trị.
- [ ] Bảng tính có dữ liệu ở `DonHang`, `SoCai`, `MoKhoa`, `Vi`.
