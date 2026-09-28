# Hướng dẫn cập nhật web app KPI (bản 29/09/2026)

> **Bạn đã làm bản 28/09 rồi?** Chỉ cần: Bước 0 (sao lưu) → Bước 1 (Code.gs) → Bước 2 (Index.html) → **Bước 3b** (bật Sheets API) → chạy `CAI_LAI_TAT_CA_TRIGGER` rồi `KIEM_TRA_SHEETS_API` (Bước 4, dòng 1 và 9) → Bước 5 (triển khai). Xem phần mới ở mục **"Bản 29/09: nhanh hơn và giao diện mới"** cuối file.

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

## Bước 3b — Bật dịch vụ Google Sheets API (để tải trang nhanh hơn)

1. Trong trình soạn thảo Apps Script, ở cột trái tìm mục **Dịch vụ**, bấm dấu **+**.
2. Tìm **Google Sheets API**, bấm vào, giữ nguyên tên `Sheets`, bấm **Thêm**.
3. Sau đó chạy hàm `KIEM_TRA_SHEETS_API` (Bước 4, dòng 9). Hàm so **từng ô** giữa cách đọc cũ và cách đọc mới; khớp hết mới bật. Nếu báo lệch thì web vẫn chạy cách cũ, không ảnh hưởng gì.

Không bật bước này thì web vẫn chạy bình thường, chỉ mở trang chậm hơn một chút.

## Bước 4 — Chạy các hàm một lần

Cách chạy: ở thanh trên cùng, chọn tên hàm trong ô danh sách, bấm **▶ Chạy**, rồi xem kết quả ở **Nhật ký thực thi** phía dưới. Lần đầu Google có thể hỏi cấp quyền: bấm **Xem lại quyền**, chọn tài khoản, rồi **Cho phép**.

Chạy lần lượt:

| # | Hàm | Việc hàm làm |
|---|---|---|
| 1 | `CAI_LAI_TAT_CA_TRIGGER` | Cài lại 6 trigger tự động theo giờ VN. Chốt tháng giờ chạy vào **ngày làm việc thứ 3 của tháng sau**. Trigger mới: lưu trữ nhật ký cũ lúc 2h sáng ngày 5 hằng tháng |
| 2 | `TAO_SHEET_NGAY_LE` | Tạo sheet **NgayLe** (đã điền sẵn 1–2/9/2026 và 1/1/2027). Sau đó bạn tự thêm Tết Âm lịch, Giỗ Tổ, 30/4–1/5… theo lịch nghỉ của công ty |
| 3 | `NGUNG_TK_NGHI_VIEC` | Ngừng tài khoản của 9 người đã nghỉ việc |
| 4 | `BO_SUNG_MA_GHI_VIPHAM` | Thêm mã cho 95 vi phạm "nhập trễ" cũ, để xóa lẻ được trên giao diện |
| 5 | `DON_PHAT_NHAP_TRE_TP_PP` | Xóa 11 lượt phạt oan của phó phòng C160 (hàm này có sẵn từ trước) |
| 6 | `BAT_BUOC_DOI_MAT_KHAU_MAC_DINH` | Bật "phải đổi mật khẩu" cho **mọi** tài khoản còn dùng 123456, kể cả giamdoc, phogd2, nhansu, kcs. Lần đăng nhập tới họ sẽ bị buộc đặt mật khẩu mới. Nên **báo trước** cho mọi người |
| 7 | `SUA_NGAY_NHAT_KY` | Xem mục "Sửa ngày sai" ngay dưới đây |
| 8 | `KIEM_TRA_SAU_CAP_NHAT` | Kiểm tra lại toàn bộ (chỉ đọc, không sửa gì). Dòng nào có chữ "->" là việc còn phải làm |
| 9 | `KIEM_TRA_SHEETS_API` | Chạy sau Bước 3b. Báo "KHỚP toàn bộ… ĐÃ BẬT" là xong. Muốn tắt lại thì chạy `TAT_SHEETS_API` |

**Hai hàm dùng khi cần (không phải chạy bây giờ):**
- `XOA_BO_NHO_TAM`: web nhớ kết quả tính (bảng KPI, KPI quản lý, chấm công tháng…) trong **10 phút** cho nhanh. Ai lưu gì trên web thì tự tính lại ngay. Nhưng nếu bạn **sửa tay trực tiếp trong Google Sheet**, chạy hàm này để web thấy số mới ngay (không thì đợi tối đa 10 phút).
- `LUU_TRU_NHAT_KY`: chuyển nhật ký sản xuất của những tháng **đã chốt chính thức và cũ hơn 3 tháng** sang trang tính `NhatKySanXuat_LuuTru`, để sheet chính nhẹ. Trigger tự chạy hằng tháng; bạn không cần bấm. Dữ liệu không mất, lịch sử KPI và KPI quản lý vẫn đọc được tháng cũ.

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
- Bố cục chia đôi theo phong cách thương hiệu cao cấp. Bên trái là khung ảnh sản phẩm trên nền đen obsidian: viên bi cái có logo "CB", đầu cơ cận cảnh với ngọn cơ là ảnh chụp thật (ngọn carbon xám, khâu trắng – đen – trắng, tip xanh; ảnh ở kpi-app/anh/ngon-carbon.png, đã nhúng sẵn trong Index.html), các đường dựng hình kỹ thuật (Ø 57.2 mm, góc 26.6°), khẩu hiệu *"Chính xác trong từng công đoạn."* và dải 5 công đoạn sản xuất. Bên phải là biểu mẫu nền trắng ngà.
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

## Bản 29/09: nhanh hơn và giao diện mới

**Hết treo khi lưu**
- Trước: bấm lưu là cả màn hình tối lại, chờ máy chủ ghi **từng ô một** rồi tải lại **toàn bộ** dữ liệu (~2,9 MB).
- Nay: máy chủ gom các ô cần sửa và ghi một lần. VD duyệt sản lượng 1 người: từ 38 lần ghi còn 3.
- Sau khi lưu, web chỉ tải lại **phần vừa đổi** (VD ghi vi phạm thì chỉ tải lại danh sách vi phạm).
- Không còn lớp phủ che màn hình: chỉ có một vạch vàng chạy trên cùng, và nút vừa bấm hiện vòng xoay (không bấm 2 lần được). Đang tải mà chuyển tab thì kết quả cũ không vẽ đè lên tab mới.
- Bảng KPI, KPI quản lý, chấm công tháng, phân tích định mức, lịch sử KPI: lần mở thứ hai trong 10 phút lấy từ bộ nhớ tạm, gần như tức thì.
- Tab Tổng quan vẽ nhanh gấp khoảng 8 lần. Bỏ hiệu ứng nền chuyển động (đốm sáng, hạt bay), vốn làm máy yếu bị giật khi cuộn.

**Giao diện**
- Cùng tông với màn đăng nhập: nền đen, chữ trắng ngà, điểm nhấn vàng đồng.
- Máy tính: menu dọc bên trái, chia nhóm **Hôm nay · Sản xuất · KPI · Định mức · Danh mục · Hệ thống**, có số đếm việc chờ (chấm đỏ/vàng).
- Điện thoại: thanh dưới có 4 mục hay dùng nhất theo vai trò, cộng nút **Menu** mở toàn bộ danh sách.
- **Việc hôm nay** (trang mở đầu của ban điều hành và trưởng/phó phòng) gom mọi nhắc việc vào một chỗ: chưa điểm danh, chờ duyệt sản lượng, công nhân chưa nhập, đề xuất định mức, yêu cầu sửa hồ sơ, thông báo từ ban điều hành. Mỗi việc có nút đi thẳng tới chỗ xử lý. Ban điều hành xem thêm xưởng nào đã/chưa điểm danh hôm nay.
- **Hướng dẫn** chuyển thành nút **?** trên đầu trang.
- Bảng dài: dòng tiêu đề cột dính trên cùng khi cuộn.
- Công nhân vẫn mở thẳng vào "Nhập sản lượng của tôi" như cũ.

**Bảo mật**
- Trước đây công nhân nhận về máy **CCCD, số điện thoại, địa chỉ, lương của cả xưởng** (không hiện trên màn hình nhưng xem được bằng công cụ trình duyệt). Nay công nhân chỉ nhận tên, xưởng, công đoạn của đồng nghiệp; hồ sơ đầy đủ chỉ của chính mình. Trưởng phòng không nhận CCCD và lương.

## Nếu có lỗi

Mở bản sao đã tạo ở Bước 0, hoặc dán lại file trong `kpi-app/goc/` (bản cũ của bạn), rồi Triển khai phiên bản mới.
