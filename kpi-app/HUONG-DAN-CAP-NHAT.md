# Hướng dẫn cập nhật web app KPI (bản 28/09/2026)

Làm **trước 23h ngày 30/9**: bản cũ sẽ tự chốt KPI tháng 9 vào giờ đó và chốt sai.

Cần dán lại **2 file**: `Code.gs` và `Index.html` (lấy trong thư mục `kpi-app/` của repo).

---

## Bước 0 — Sao lưu (bắt buộc)

1. Mở dự án Apps Script của web app KPI.
2. Bấm **Tổng quan** (biểu tượng ⓘ bên trái), chọn **Tạo bản sao**. Có bản sao thì lỡ lỗi vẫn quay lại được.

## Bước 1 — Dán Code.gs

1. MỞ file **Code.gs** trong Apps Script.
2. Bấm vào trong file, nhấn **Ctrl+A** rồi **Delete** để xóa hết.
3. Mở file `kpi-app/Code.gs` trong repo, chép toàn bộ và dán vào.
4. Nhấn **Ctrl+S** để lưu.

## Bước 2 — Dán Index.html

Làm giống bước 1: MỞ file **Index.html**, xóa hết, dán nội dung `kpi-app/Index.html`, rồi **Ctrl+S**.

## Bước 3 — Đặt múi giờ dự án

1. Bấm **Cài đặt dự án** (bánh răng ⚙ bên trái).
2. Ở mục **Múi giờ**, chọn **(GMT+07:00) Giờ Đông Dương – Hồ Chí Minh**.

## Bước 4 — Chạy các hàm một lần

Cách chạy: ở thanh trên cùng, chọn tên hàm trong ô danh sách, bấm **▶ Chạy**, rồi xem kết quả ở **Nhật ký thực thi** phía dưới. Lần đầu Google có thể hỏi cấp quyền: bấm **Xem lại quyền**, chọn tài khoản, rồi **Cho phép**.

Chạy lần lượt:

| # | Hàm | Việc hàm làm |
|---|---|---|
| 1 | `CAI_LAI_TAT_CA_TRIGGER` | Cài lại 5 trigger tự động theo giờ VN. Chốt tháng giờ chạy vào **ngày làm việc thứ 3 của tháng sau** |
| 2 | `TAO_SHEET_NGAY_LE` | Tạo sheet **NgayLe** (đã điền sẵn 1–2/9/2026 và 1/1/2027). Sau đó bạn tự thêm Tết Âm lịch, Giỗ Tổ, 30/4–1/5… theo lịch nghỉ của công ty |
| 3 | `NGUNG_TK_NGHI_VIEC` | Ngừng tài khoản của 9 người đã nghỉ việc |
| 4 | `BO_SUNG_MA_GHI_VIPHAM` | Thêm mã cho 95 vi phạm "nhập trễ" cũ, để xóa lẻ được trên giao diện |
| 5 | `DON_PHAT_NHAP_TRE_TP_PP` | Xóa 11 lượt phạt oan của phó phòng C160 (hàm này có sẵn từ trước) |
| 6 | `BAT_BUOC_DOI_MAT_KHAU_MAC_DINH` | Bật "phải đổi mật khẩu" cho **mọi** tài khoản còn dùng 123456, kể cả giamdoc, phogd2, nhansu, kcs. Lần đăng nhập tới họ sẽ bị buộc đặt mật khẩu mới. Nên **báo trước** cho mọi người |
| 7 | `SUA_NGAY_NHAT_KY` | Xem mục "Sửa ngày sai" ngay dưới đây |
| 8 | `KIEM_TRA_SAU_CAP_NHAT` | Kiểm tra lại toàn bộ (chỉ đọc, không sửa gì). Dòng nào có chữ "->" là việc còn phải làm |

### Sửa ngày sai trong nhật ký (hàm số 7)

- **Lần 1:** chạy `SUA_NGAY_NHAT_KY` luôn. Hàm chỉ **liệt kê**, chưa sửa gì.
- **Lần 2:** trong file Code.gs, tìm dòng `var CHE_DO = 'XEM';` và đổi thành `var CHE_DO = 'SUA';`. Lưu, rồi chạy lại. Hàm sẽ tự sửa 21 dòng của C049 bị đảo ngày/tháng (VD 2026-01-08 thành 2026-08-01).
- Sửa xong, đổi lại thành `'XEM'` và lưu.
- **Các dòng còn lại phải sửa tay** trong sheet NhatKySanXuat, theo số dòng mà hàm in ra:
  - 5 dòng C049 có ô ngày lỗi `#VALUE!`. Nhiều khả năng là 04/08: C049 nhập các ngày 1, 3, 5, 6… tháng 8, còn thiếu đúng ngày 4.
  - 9 dòng xưởng DG nhập ngày 03/09 nhưng lại ghi các ngày 27, 28, 29/9 (lúc nhập các ngày này chưa tới). Nhiều khả năng là 27–29/8. Cần hỏi TP xưởng DG.
  - 4 dòng DG nhập 03/09 ghi ngày 07/09 (cũng chưa tới lúc nhập). Hàm gợi ý 07/08, nhưng có thể là ngày khác. Cần hỏi TP xưởng DG.
  - 1 dòng C631 nhập 26/08 ghi ngày 21/09. Dòng này đã bị từ chối nên không ảnh hưởng KPI, sửa hay không cũng được.
  - 6 dòng C668 năm 1483: đổi thành 2026-09-15.
  - Các dòng ô ngày trống và dòng 2026-10-10: hỏi trưởng phòng rồi điền.
- Nếu sửa dòng thuộc tháng 8 (tháng đã chốt), vào **Bảng KPI → chọn tháng 8 → Chốt bù** để bảng tính lại.

## Bước 5 — Triển khai phiên bản mới

1. Bấm **Triển khai → Quản lý triển khai**.
2. Bấm biểu tượng **✏️** (chỉnh sửa).
3. Ở mục **Phiên bản**, chọn **Phiên bản mới**.
4. Bấm **Triển khai**.

Mở lại web app, nhấn **Ctrl+F5** để tải bản mới.

## Bước 6 — Việc của bạn trên giao diện

- Đăng nhập **chienpham**, vào tab **Tài khoản**, bấm **Cấp lại mật khẩu** cho `giamdoc` và `phogd2`. Máy sẽ hiện một **mật khẩu tạm 6 số ngẫu nhiên**. Báo riêng cho từng người; họ sẽ phải đổi ngay khi đăng nhập.
- Đặt định mức cho công đoạn `XPT-VSR-VSP` và `SON-MAY-TU-DONG-1`. Hiện 80 dòng sản lượng của 2 công đoạn này không được tính vào KPI.

---

## Những gì đã thay đổi

**Chốt tháng**
- Tháng trước được chốt chính thức lúc 23h **ngày làm việc thứ 3** của tháng sau, thay vì 23h ngày cuối tháng như trước. Nhờ vậy sản lượng duyệt muộn mấy ngày cuối tháng vẫn được tính.
- Trước khi chốt chính thức, bảng KPI tháng đó vẫn tính trực tiếp.
- Bảng KPI công nhân **không còn trưởng/phó phòng** (trước đây họ lọt vào với 30 điểm). Các bản chốt cũ cũng tự lọc ra khi hiển thị.
- Snapshot 9h sáng chỉ là **bản tạm**, không bị coi là đã chốt.

**Bảo mật**
- Người dùng bị **buộc đổi mật khẩu** lần đầu và sau khi được cấp lại. Không đặt được 123456, 888888, tên đăng nhập hay mã nhân viên.
- Nhập sai mật khẩu 5 lần thì khóa 15 phút. Chủ sở hữu cấp lại mật khẩu là mở khóa ngay.
- "Cấp lại mật khẩu" tạo mật khẩu tạm ngẫu nhiên, không còn đặt về 123456.
- Người có hồ sơ **Nghỉ việc** không đăng nhập được. Chuyển ai sang Nghỉ việc thì tài khoản của họ tự ngừng.
- Công nhân chỉ xem được hồ sơ của chính mình. Chi tiết KPI chỉ xem được của người cùng xưởng. Kiểm soát chất lượng không xem hồ sơ.
- Trưởng/phó phòng không đổi được chức danh sang cấp quản lý, để tránh tự nâng quyền tài khoản.
- Ô đăng nhập không còn gợi ý sẵn chữ "giamdoc".

**Dữ liệu**
- Có **khóa ghi**: khi nhiều người cùng lưu, máy xử lý lần lượt, không còn đè hay xóa nhầm dòng. Nếu bận quá 30 giây sẽ báo "Hệ thống đang bận, đợi vài giây rồi bấm lại".
- **Kiểm tra ngày**: không nhận ngày tương lai, ngày trước 1/7/2026 hay ngày không tồn tại. Công nhân nhập bù tối đa 31 ngày, trưởng phòng tối đa 62 ngày.
- **Lưu điểm danh ngày** không còn xóa mất các ô nửa ngày / đi muộn đã chấm ở Lịch tháng, và không xóa dữ liệu cũ của người đã nghỉ việc.
- Điểm danh mới luôn có **ký hiệu chấm công**. Lý do như "nghỉ bệnh", "cv gđ" được hiểu là nghỉ không lương, giống "ốm" và "việc gia đình".
- Vi phạm "nhập trễ" tự động có mã ghi, nên xóa lẻ được.

**Ngày lễ**
- Ngày trong sheet NgayLe (và sheet MienTruDiemDanh có sẵn) không bị trừ "quên điểm danh", không tính vào hạn duyệt / hạn nhập, và không hiện nhắc điểm danh.

**Trọng số KPI theo kỳ**
- Mỗi tháng dùng trọng số có "Kỳ áp dụng" gần nhất, tính đến tháng đó. Đổi trọng số tháng 10 không làm thay đổi KPI tháng 8, 9.

**KPI quản lý**
- Điểm trung bình xưởng chỉ tính công nhân. Trước đây tính cả KPI cá nhân của chính TP/PP (gần 0 vì họ không nhập sản lượng), kéo điểm xuống.
- Kết quả: KPI quản lý tháng 9 của cả 27 TP/PP **tăng từ 2,6 đến 10,9 điểm**. KPI công nhân tháng 9 giữ **y hệt** bản cũ (đã so 144 người).

**Tốc độ**
- Trình duyệt chỉ nhận dữ liệu từ đầu tháng trước. Muốn gửi hết như cũ, sửa `var SO_THANG_GUI_VE = 2;` thành `0`.
- Nhật ký thao tác chỉ đọc 80 dòng cuối.
- Bớt đọc lại tiêu đề cột mỗi lần ghi.
- Tính KPI quản lý nhanh hơn.

**Màn đăng nhập mới "Carbon Billiards — Precision"** (nằm trong Index.html)
- Bố cục chia đôi theo phong cách thương hiệu cao cấp. Bên trái là khung ảnh sản phẩm trên nền đen obsidian: viên bi cái có logo "CB", đầu cơ cận cảnh với ngọn carbon (vân sợi dệt chéo, có chữ "CARBON · CB"), các đường dựng hình kỹ thuật (Ø 57.2 mm, góc 26.6°), khẩu hiệu *"Chính xác trong từng công đoạn."* và dải 5 công đoạn sản xuất. Bên phải là biểu mẫu nền trắng ngà.
- Bảng màu: đen obsidian, trắng ngà, vàng đồng. Tiêu đề dùng chữ có chân Cormorant Garamond (hỗ trợ đủ dấu tiếng Việt), nội dung dùng Inter.
- Dòng chào đổi theo giờ trong ngày.
- Ô "Ghi nhớ mã nhân viên": máy chỉ nhớ mã, **không bao giờ lưu mật khẩu**.
- Nút "Quên mật khẩu?" hướng dẫn liên hệ trưởng phòng hoặc chủ sở hữu.
- Báo khi đang bật Caps Lock. Nút Hiện/Ẩn mật khẩu.
- Chuyển động nhẹ:
  - Rê chuột thì ánh sáng trên bi và các đường dựng hình nhích theo.
  - Bấm Đăng nhập thì đầu cơ lùi lại ngắm, nút hiện "Đang xác thực" kèm vạch chạy vàng đồng.
  - Đúng: cơ chạm bi, bi lăn ra khỏi khung, biểu mẫu chuyển thành "Chào mừng, [tên]." trong lúc tải dữ liệu.
  - Sai: ô mật khẩu viền đỏ, thẻ rung nhẹ, báo lỗi ngay dưới nút.
- Điện thoại: ảnh thu thành dải trên cùng, biểu mẫu trượt lên như một tấm thẻ.
- Máy đã bật "giảm chuyển động" thì bỏ hiệu ứng.

## Nếu có lỗi

Mở bản sao đã tạo ở Bước 0, hoặc dán lại file trong `kpi-app/goc/` (bản cũ của bạn), rồi Triển khai phiên bản mới.
