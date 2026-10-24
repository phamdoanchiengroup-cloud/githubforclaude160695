# Hồ sơ truy nguồn & chuẩn hóa Bát Tự / Hà Lạc — Thiên Cơ Các

Ngày lập: 2026-10-24  
Trạng thái: **Rà soát sơ bộ mã nguồn; chưa phải chứng nhận nghiên cứu văn bản hoàn tất.**

## Phạm vi và giới hạn bằng chứng

Hồ sơ này phân biệt (1) tác phẩm nền tảng cần đối chiếu, (2) quy tắc đang được mã hóa, (3) giả thuyết/heuristic riêng của phần mềm và (4) việc cần xác minh trước khi gọi thuật toán là chuẩn. Trong lượt này không có công cụ tra cứu web trực tiếp để xác nhận bản số hóa, ấn bản, chương/trang hay đối chiếu văn bản nguyên văn. Vì vậy các tác phẩm dưới đây là **danh mục nguồn nghiên cứu cần kiểm chứng**, không được hiểu là tôi đã đọc/đối chiếu toàn bộ nguyên văn trong lượt này. Không gán số trang hoặc trích dẫn nguyên văn khi chưa xác minh.

## Bước 1 — Truy nguồn quy tắc

### Bát Tự / Tử Bình

| Nguồn nền tảng cần đối chiếu | Phần cần đối chiếu | Trạng thái nguồn trong hồ sơ |
|---|---|---|
| 《渊海子平》 Uyên Hải Tử Bình | Tứ trụ, thập thần, cách cục và phép luận mệnh cơ bản | Tác phẩm tham chiếu; chưa xác minh ấn bản/chương/trang |
| 《三命通会》 Tam Mệnh Thông Hội | Can chi, cách cục, thần sát, trường hợp luận mệnh | Tác phẩm tham chiếu; chưa xác minh ấn bản/chương/trang |
| 《滴天髓》 Tích Thiên Tủy | Khí thế toàn cục, sinh khắc, vượng suy | Tác phẩm tham chiếu; chưa xác minh ấn bản/chương/trang |
| 《子平真诠》 Tử Bình Chân Thuyên | Nguyệt lệnh, chính cách, thành cách/phá cách, cứu ứng | Tác phẩm tham chiếu; chưa xác minh ấn bản/chương/trang |
| 《穷通宝鉴》 Cùng Thông Bảo Giám | Điều hậu theo mùa sinh và khí hậu ngũ hành | Tác phẩm tham chiếu; chưa xác minh ấn bản/chương/trang |
| 《神峰通考》 Thần Phong Thông Khảo | Các phép luận cách cục và quan điểm cần so sánh | Tác phẩm tham chiếu; chưa xác minh ấn bản/chương/trang |

Không mặc định các sách trên đồng thuận. Quy tắc cách cục, điều hậu, cân bằng ngũ hành và ngoại cách phải được giữ thành các nhánh có điều kiện; không trộn kết luận mà không lưu dấu nguồn.

### Hà Lạc

| Nguồn/nhánh cần đối chiếu | Phần cần đối chiếu | Trạng thái nguồn trong hồ sơ |
|---|---|---|
| Tài liệu chuyên biệt về 河洛理数 (Hà Lạc lý số) | Bảng số can/chi, phép cộng thiên/địa số, quy tắc quy nguyên và ký cung | Chưa xác định được bản văn/ấn bản đủ tin cậy để xác nhận thuật toán hiện tại |
| 《皇极经世》 Hoàng Cực Kinh Thế | Tư tưởng tượng số và quan hệ số–thời | Nguồn liên quan cần khảo sát; không mặc định toàn bộ thuật toán Hà Lạc xuất phát trực tiếp từ tác phẩm này |
| 《周易》 Chu Dịch / Kinh Dịch | Cấu trúc quẻ, thứ tự sáu hào, tượng quái và hào từ | Nguồn nền tảng cho Dịch học; không tự xác nhận quy tắc lập số Hà Lạc riêng của ứng dụng |

**Không được** gọi các phép chấm điểm tự đặt trong ứng dụng là quy tắc cổ thư nếu chưa tìm được nguồn xác nhận.

## Bước 2 — Đối chiếu trường phái

### Bát Tự: các nhánh phải tách biệt

1. **Vượng suy / cân bằng toàn cục:** Nhật chủ, nguyệt lệnh, căn khí, sinh trợ, khắc tiết hao. Điểm số nội bộ chỉ là chỉ báo heuristic, không phải đại lượng vật lý hay xác suất.
2. **Cách cục Tử Bình:** xác định nguyệt lệnh và điều kiện thành cách, phá cách, cứu ứng theo một bộ quy tắc có phiên bản.
3. **Điều hậu:** xem mùa sinh và nhu cầu điều hậu như một nhánh riêng; phải nêu khi nào được ưu tiên và khi nào không.
4. **Ngoại cách:** phải có điều kiện loại trừ và kiểm tra phá cách; không chấp nhận ngoại cách chỉ vì điểm số cực đoan.
5. **Thập thần, hợp/xung/hình/hại, thần sát:** là lớp cấu trúc/bổ trợ; tránh đếm một quan hệ nhiều lần như các bằng chứng độc lập.
6. **Đại vận/lưu niên:** là lớp thời gian chồng lên mệnh cục; quy tắc chiều vận, thời điểm khởi vận và tiết khí phải có test riêng.

### Hà Lạc: cần xác minh trước khi chọn một quy tắc chuẩn

1. Bảng số của 10 thiên can và 12 địa chi.
2. Quy tắc tách thiên số/địa số (bao gồm cách xử lý số lẻ/chẵn).
3. Quy tắc quy số về quái, ngưỡng trừ và trường hợp số 5/ký cung.
4. Quy tắc chọn thượng quái/hạ quái theo âm dương năm và giới tính.
5. Thuật toán hào nguyên đường, gồm quy tắc hai lượt/ký cung.
6. Quy tắc lập hậu thiên, quẻ hỗ, quẻ biến, nạp giáp/lục hào và cách tính vận theo hào.

Chỉ sau khi tìm được nguồn trực tiếp và ví dụ giải mẫu mới được đánh dấu từng quy tắc là “đã xác minh”. Chưa đủ chứng cứ thì giữ thành phiên bản thử nghiệm và không tự động thay kết quả đang dùng.

## Bước 3 — Kiểm tra phép tính và phát hiện rủi ro trong mã hiện tại

### Bát Tự — phát hiện từ đọc mã, chưa phải phán quyết đúng/sai của trường phái

- `BatTu.gs / batTuLap`: năm đổi quanh Lập Xuân dựa vào kinh độ Mặt Trời; cần kiểm tra các thời điểm ngay trước/sau 315° và múi giờ.
- Trụ tháng dùng chia góc kinh độ Mặt Trời theo các cung 30°; cần kiểm tra chính xác các ranh giới 12 tiết và sai số số học ở sát ranh giới.
- Trụ ngày/giờ dùng `t.jd`, `t.hour` và phép chia giờ đôi; phải xác minh `t.jd` đã xử lý ngày đổi trụ lúc 23:00 hay 00:00 theo trường phái cấu hình, và giờ Tý có bị xử lý khác nhau giữa các mô-đun không.
- Ngũ hành được chấm bằng hệ số cố định (ví dụ hệ số trụ tháng và trọng số tàng can). Đây là mô hình điểm số phần mềm; chưa có nguồn văn bản/hiệu chuẩn thực nghiệm chứng minh các hệ số ấy là chuẩn chung.
- `BatTuChiTiet.gs` và `BatTuLuan.gs` có quy tắc suy luận dạng điều kiện và trọng số riêng. Cần đối chiếu từng quy tắc với bộ quy tắc Tử Bình đã chọn, đồng thời kiểm tra kết luận không bị tính trùng từ nhiều lớp.
- `BatTu.gs` gọi bộ phân tích 9 bước nếu có `btPhanTich_`; cần kiểm tra các mô-đun khác có dùng cùng một phiên bản kết quả hay vẫn dùng logic dự phòng khác nhau.

### Hà Lạc — phát hiện từ đọc mã

- `HL_CAN_SO`, `HL_CHI_SO`, `hlRutGon_`, `hlSo5_` và lựa chọn thượng/hạ quái là các điểm quyết định cấu trúc lá số. Chưa có nguồn đã xác minh đi kèm trong mã để chứng minh các bảng/quy tắc này tương ứng với một ấn bản cụ thể.
- `hlRutGon_` có phép trừ ngưỡng rồi rút số tiếp; phải tạo bảng ca kiểm thử cho mọi tổng hợp lệ và so với ví dụ nguồn trước khi sửa hoặc giữ.
- `hlNguyenDuong_` hiện có ví dụ đối chiếu được ghi trong chú thích mã. Cần kiểm tra độc lập các ví dụ đó với nguồn gốc, không xem chú thích tự thân là bằng chứng.
- `hlDiemHao_` dùng các cộng/trừ số cố định để xếp điểm hào. Chưa thấy nguồn trích dẫn trong mã cho các hệ số này; phải đánh dấu là heuristic nội bộ, không diễn đạt như quy tắc cổ truyền đã xác minh.
- Mô-đun dựng vận theo hào và số năm 6/9 cần đối chiếu nguyên văn nguồn và các lá số mẫu; chưa nên dùng làm căn cứ dự báo có độ tin cậy đã được xác lập.

## Bước 4 — Chuẩn hóa thuật toán theo phiên bản và khả năng truy vết

Đề xuất trạng thái quy tắc thống nhất:

- `VERIFIED_SOURCE`: đã đối chiếu bản văn/ấn bản, có tham chiếu cụ thể và ví dụ tái lập.
- `TESTED_IMPLEMENTATION`: phép tính chạy đúng với bộ test đã xác định; trạng thái này không tự khẳng định lý thuyết dự đoán đúng.
- `TRADITIONAL_VARIANT`: một biến thể có nguồn riêng; không trộn tự động với biến thể khác.
- `HEURISTIC_UNVERIFIED`: trọng số/điểm số nội bộ chưa có nguồn xác minh.
- `NEEDS_REVIEW`: chưa đủ bằng chứng hoặc có mâu thuẫn chưa giải quyết.

Mỗi quy tắc khi được chuẩn hóa cần có: mã quy tắc, phiên bản, nguồn/chương/trang (khi đã xác minh), đầu vào, điều kiện áp dụng, phép tính trung gian, đầu ra, ngoại lệ, test mẫu và trạng thái bằng chứng. Không thay đổi công thức đang dùng chỉ dựa trên phỏng đoán; tạo phiên bản mới, so sánh kết quả và lưu khả năng quay lại.

## Bước 5 — Kiểm tra luận giải và giới hạn tuyên bố

- Mỗi câu luận cần lưu căn cứ máy đọc được (trụ/can/chi/thập thần/hào/quái/quy tắc kích hoạt).
- Câu luận phải nêu điều kiện và dấu hiệu trái chiều, không chỉ nêu phần ủng hộ.
- Không dùng nhãn “chính xác”, “đại cát” hoặc phần trăm như xác suất thực tế nếu chưa có nghiên cứu kiểm định độc lập.
- Các chủ đề sức khỏe, tuổi thọ, tài chính và quan hệ không được diễn đạt thành chẩn đoán hoặc bảo đảm sự kiện.
- Đánh giá mô hình dự báo cần bộ dữ liệu đã định trước, mốc thời gian, tiêu chí thành công/thất bại, cách tránh nhìn trước kết quả và đánh giá ngoài mẫu. Đồng thuận giữa các trường phái không tự chứng minh tính đúng.

## Kết luận kiểm toán sơ bộ

- Đã xác định được các lớp logic chính và các vị trí trong mã cần truy nguồn.
- Chưa có đủ bằng chứng để kết luận thuật toán Hà Lạc hiện tại là bản chuẩn của một trường phái cụ thể.
- Các trọng số ngũ hành, điểm hào và một số kết luận quy tắc trong Bát Tự/Hà Lạc hiện phải coi là **heuristic hoặc cần rà soát**, cho tới khi có tham chiếu trực tiếp.
- Chưa ghi nhận số trang, trích dẫn nguyên văn hoặc tuyên bố đã xác minh nguồn khi chưa thực hiện được bước tra cứu văn bản trực tiếp.
- Bước tiếp theo có giá trị cao nhất: lấy các bản văn/ấn bản có thể kiểm tra, tạo bộ ví dụ chuẩn cho từng quy tắc, rồi mới sửa công thức cốt lõi theo kết quả đối chiếu.

## Kết quả kiểm tra kỹ thuật trong lượt này

Kiểm tra tĩnh trên nội dung nhánh sau khi đọc mã:

- Cú pháp `Code.gs`, `BatTu.gs`, `BatTuChiTiet.gs`, `BatTuLuan.gs`, `HaLac.gs`: đạt.
- JavaScript nhúng trong `Script.html`: đạt.
- Các kiểm thử hàm thuần của Hà Lạc: `hlRutGon_` giữ số hợp lệ, 10 quy về 1 theo logic hiện có, `hlBien_` chỉ đảo đúng một hào, và `hlNguyenDuong_` trả vị trí 1–6 cho toàn bộ 64 mẫu quẻ × 2 loại giờ × 6 vị trí giờ: đạt.

Các kiểm tra trên xác nhận cú pháp và một số bất biến của hàm, **không** xác nhận các bảng số hoặc quy tắc Hà Lạc trùng khớp cổ thư, không kiểm tra mọi ranh giới lịch Bát Tự, và không chứng minh khả năng dự đoán. Những việc đó cần bộ ví dụ tham chiếu độc lập có nguồn.


## Cập nhật triển khai sau kiểm toán — 2026-10-24

### Thay đổi mã nguồn
- `Code.gs`: phiên bản hồ sơ Bát Tự/Hà Lạc tăng lên `TCC-BAT-TU-METHOD-1.1` và `TCC-HA-LAC-METHOD-1.1`.
- Các lớp trong giao diện kiểm toán hiện dùng trạng thái **Cần đối chiếu thêm** cho tới khi có bằng chứng nguồn trực tiếp; không nâng trạng thái chỉ vì đối tượng dữ liệu hoặc hàm tính toán đang tồn tại.
- Thêm `nguonCanDoiChieu` để ghi rõ đầu mối tài liệu, phạm vi cần đối chiếu và trạng thái nguồn.
- Thêm hàm kiểm thử thủ công `tccKiemThuTrangThaiPhuongPhap_()`, kiểm tra phiên bản hồ sơ, trạng thái các lớp, danh mục nguồn và tuyên bố kiểm định.
- `HaLac.gs`: sửa phần đầu tệp để mô tả các quy tắc là cách triển khai hiện có; nguồn gốc, phép lập số, chu kỳ 6/9 năm và điểm cát-hung chưa được xác minh trực tiếp.

### Kết quả và giới hạn
Các thay đổi này cải thiện khả năng truy vết và ngăn giao diện hiểu nhầm “có dữ liệu” thành “đã xác minh”. Chúng **không** thay đổi công thức lập lá số cốt lõi và không xác nhận thuật toán là chính thống.

Danh mục Uyên Hải Tử Bình, Tam Mệnh Thông Hội, Tích Thiên Tủy, Tử Bình Chân Thuyên, Cùng Thông Bảo Giám, Chu Dịch và Hoàng Cực Kinh Thế hiện vẫn là **đầu mối nghiên cứu**. Trong lượt này chưa có bằng chứng đối chiếu bản văn/ấn bản, chương/trang và ví dụ độc lập; vì vậy không đánh dấu `VERIFIED_SOURCE`. Đặc biệt, nguồn chuyên biệt xác nhận bảng số và thuật toán Hà Lạc đang dùng vẫn là khoảng trống cần giải quyết trước khi thay đổi phép tính.


## Nghiên cứu bổ sung trong lượt tiếp theo

Đã lập thêm ma trận nguồn và dị bản tại `tuvi-app/NGUON_VA_DOI_CHIEU_BAT_TU_HA_LAC.md`. Ma trận này bổ sung các đường dẫn công khai đến văn bản 《穷通宝鉴》, 《子平真诠》, 《滴天髓》, 《三命通会》, 《神峰通考》 và kho dữ liệu có phân tầng provenance `zaoxu001/tianzhi-classics`. Kho đó phân biệt rõ dữ liệu trích xuất từ văn bản với dữ liệu kế thừa, dữ liệu suy ra từ hằng số và luật được mô hình hóa; các ngưỡng kỹ thuật do phần mềm đặt không được gán ngược thành quy tắc cổ thư.

Đối chiếu thêm triển khai Hà Lạc thứ cấp `Horace-Maxwell/Horosa-Web-App-comprehensively-improved-MacOS` đã phát hiện một dị bản cần rà soát: triển khai đó có xử lý riêng quẻ thuần Càn/Khôn cho hào nguyên đường theo giới tính và nửa năm tiết khí; mã Thiên Cơ Các hiện chưa có nhánh riêng tương ứng. Đây là **khác biệt triển khai**, chưa phải phán quyết bên nào đúng. Chưa thay công thức vì vẫn thiếu đối chiếu trực tiếp với nguồn Hà Lạc sơ cấp.

Đã thêm hàm `tccKiemThuBatTuHaLac_()` để kiểm thử bất biến cấu trúc (100 cặp thập thần, 120 tổ hợp trường sinh, 64 quẻ round-trip, 384 phép biến hào, 768 trường hợp nguyên đường và các điểm biên rút gọn số). Hàm mới chưa được chạy trong runtime Apps Script ở lượt này; kết quả thực thi vẫn cần ghi nhận riêng.
