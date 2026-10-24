# Ma trận nguồn và đối chiếu thuật toán Bát Tự / Hà Lạc — Thiên Cơ Các

Ngày rà soát: 2026-10-24
Nhánh: `claude/happy-brown-lttkz3`
Phạm vi: truy tìm nguồn công khai, đối chiếu mô hình thuật toán thứ cấp và thiết lập cổng kiểm thử. Đây không phải chứng nhận dự đoán đúng.

## 1. Phân tầng bằng chứng

- **A — Nguồn sơ cấp đã định vị:** trang văn bản/ảnh bản cổ cụ thể; vẫn cần đối chiếu đúng chương, câu và bản.
- **B — Bản dữ liệu đã biên tập, có provenance:** hữu ích để tìm quy tắc và dị bản; không thay thế bản sơ cấp.
- **C — Triển khai thứ cấp:** dùng phát hiện các biến thể và tạo ca kiểm thử đối chiếu; không dùng tự thân để chứng minh cổ pháp.
- **H — Heuristic nội bộ:** hệ số, điểm số hoặc suy luận của phần mềm chưa truy được về nguồn cụ thể.
- **U — Chưa đủ bằng chứng:** chưa xác nhận nguồn, bản, vị trí và ví dụ tái lập.

Không nâng quy tắc lên `VERIFIED_SOURCE` chỉ vì một thư viện khác cũng triển khai cùng cách. Cần có nguồn sơ cấp và ví dụ có thể tái lập.

## 2. Bát Tự: nguồn sơ cấp và kho đối chiếu

| Chủ đề | Nguồn / đường dẫn | Mức hiện tại | Cách dùng an toàn |
|---|---|---|---|
| Điều hậu theo ngày can × tháng sinh | [《穷通宝鉴》 — Wikisource](https://zh.wikisource.org/wiki/穷通宝鑑) | A: trang văn bản đã định vị; từng đoạn phải đối chiếu | Lập bảng 120 trường hợp, ghi nguyên văn/ngữ cảnh và thứ tự ưu tiên; không chỉ so danh sách hành |
| Cách cục, thuận dụng/nghịch dụng, tướng thần/kỵ thần | [《子平真诠》 — Wikisource](https://zh.wikisource.org/wiki/子平真詮) | A: trang văn bản đã định vị; chưa kiểm hết chương | Bắt đầu từ chương luận dụng thần và các chương cách cục; ghi rõ dị bản và điều kiện phá cách |
| Sinh khắc, khí thế, tòng/cách hóa/thông quan | [《滴天髓》 — Wikisource](https://zh.wikisource.org/wiki/滴天髓) | A: trang văn bản đã định vị; phải tách nguyên văn với chú giải | Không chuyển thẳng lời luận thành ngưỡng số nếu nguồn không quy định ngưỡng |
| Tàng can, thần sát và trường hợp luận mệnh | [《三命通会》 — Wikisource, quyển 3 bản Tứ Khố](https://zh.wikisource.org/wiki/三命通會_(四庫全書本)/卷03) | A: đã định vị một trang/quyển cụ thể, không đại diện toàn sách | Chỉ xác minh quy tắc trong đúng đoạn; không gán nguồn cho mọi thần sát |
| Các luận pháp bệnh-dược | [《神峰通考》 — Wikisource](https://zh.wikisource.org/wiki/神峰通考) | A: trang văn bản đã định vị; từng quy tắc cần kiểm | Giữ bệnh-dược thành nhánh riêng, không trộn tự động với vượng suy/cách cục |
| Bảng trích xuất và ghi nhận dị bản | [zaoxu001/tianzhi-classics](https://github.com/zaoxu001/tianzhi-classics) · [README nguồn](https://github.com/zaoxu001/tianzhi-classics/blob/main/README.md) · [catalog.json](https://github.com/zaoxu001/tianzhi-classics/blob/main/catalog.json) | B: kho thứ cấp có phân tầng provenance | README phân biệt `extracted`, `packaged`, `derived`, `modeled`; kho tự ghi nhận một số bảng có sai khác và ngưỡng do gói đặt. Dùng làm checklist đối chiếu, không nhập bảng vào ứng dụng mà chưa so bản |
| Mô hình hóa thuật toán và xử lý bất đồng | [zaoxu001/tianzhi-core](https://github.com/zaoxu001/tianzhi-core) | C: triển khai thứ cấp | Tham khảo cách tách lịch pháp / lập trụ / suy luận; tham số hóa các dị bản. Không coi trọng số của thư viện khác là chân lý |
| Bản văn có chú giải lẫn nguyên văn | [jiaotuke/ziping-shushu — SOURCE.md](https://github.com/jiaotuke/ziping-shushu/blob/ac1bcc9a1589e2e779b63e0a7affc047a1cc048f/data/source/SOURCE.md) | B: nguồn chuyển văn có cảnh báo phiên bản | Tài liệu ghi rõ một bản 《子平真诠评注》 có nguyên văn lẫn chú giải, và 《滴天髓阐微》 có chú giải; không được gán mọi câu cho tác giả nguyên tác |

### Quyết định chuẩn hóa Bát Tự

1. **Tầng lịch pháp**: xác minh riêng năm đổi Lập Xuân, ranh giới 12 tiết, múi giờ/kinh độ, ngày đổi trụ và giờ Tý. Cần fixture ở ngay trước/sau từng mốc, không chỉ lấy ngày giữa tháng.
2. **Tầng cấu trúc**: xác minh tàng can, thập thần, trường sinh và quan hệ can chi bằng bảng chuẩn độc lập. Phép tính đúng không tự xác nhận cách diễn giải.
3. **Tầng luận mệnh**: triển khai các nhánh độc lập: (a) nguyệt lệnh/cách cục Tử Bình; (b) vượng suy toàn cục; (c) điều hậu; (d) bệnh-dược; (e) ngoại cách. Ghi thứ tự ưu tiên như một cấu hình có phiên bản.
4. **Tầng phụ trợ**: thần sát, cung vị và hợp/xung/hình/hại chỉ được cộng vào luận sau khi đã xác định căn cứ, điều kiện áp dụng và tránh đếm trùng.
5. **Trọng số**: mọi hệ số như sức nặng nguyệt lệnh, tàng can và điểm ngũ hành được gắn `HEURISTIC_UNVERIFIED` trừ khi có nguồn định lượng trực tiếp. Không tự gọi các hệ số ấy là cổ pháp.

## 3. Hà Lạc: nguồn và đối chiếu hiện trạng

| Nguồn / đường dẫn | Mức | Kết luận có thể rút ra |
|---|---|---|
| [《周易》 — Wikisource](https://zh.wikisource.org/wiki/周易) | A: nguồn sơ cấp nền tảng cho quái/hào/tượng; không đủ xác nhận thuật toán Hà Lạc riêng | Dùng để kiểm cấu trúc 64 quẻ, thứ tự hào, hào từ; không dùng để tự suy ra bảng số can chi hay phép ký cung |
| [Horosa heluoLocal.js](https://github.com/Horace-Maxwell/Horosa-Web-App-comprehensively-improved-MacOS/blob/07df9799790e7ef1e05996abfb051e1542b12171/Horosa-Web/astrostudyui/src/utils/heluoLocal.js) | C: triển khai thứ cấp, có mô tả các ca mẫu và các điểm dị bản | Dùng làm đối chiếu độc lập cho bảng số, quy số, nguyên đường và biến quẻ; không phải chứng cứ cổ thư tự thân |
| [Horosa heluoTiaowen.json](https://github.com/Horace-Maxwell/Horosa-Web-App-comprehensively-improved-MacOS/blob/07df9799790e7ef1e05996abfb051e1542b12171/Horosa-Web/astrostudyui/src/utils/data/heluoTiaowen.json) | C: dữ liệu lời đoán/điều văn thứ cấp; quyền và nguồn từng phần phải kiểm trước khi tái sử dụng | Chỉ so cấu trúc trường dữ liệu và ca kiểm thử; không sao chép nội dung lời đoán vào Thiên Cơ Các |
| Tài liệu chuyên biệt 河洛理数 có bản/ấn bản xác định | U | Chưa xác nhận được bản văn trực tiếp đầy đủ cho toàn bộ bảng số và thuật toán đang dùng |

### Khác biệt thuật toán đã phát hiện cần xử lý có kiểm soát

**Hào nguyên đường của quẻ thuần Càn/Khôn:** mã Thiên Cơ Các hiện dùng cùng một phép liệt kê hào theo âm/dương giờ cho mọi quẻ. Triển khai Horosa có nhánh riêng cho quẻ thuần Càn/Khôn, phụ thuộc giới tính và nửa năm tiết khí, đồng thời ghi nhận một biến thể bản chép. Đây là khác biệt thực tế giữa hai triển khai, **không phải bằng chứng rằng một bên đúng**.

**Quẻ Hậu thiên và ba quẻ đặc biệt:** triển khai Horosa nêu các ngoại lệ “tam chí tôn” và các công tắc biến thể. Mã Thiên Cơ Các hiện có phép biến hào/đổi thượng-hạ quái theo quy tắc riêng; cần lập bảng so sánh 64 quẻ trước khi quyết định có ngoại lệ nào được nguồn sơ cấp hỗ trợ.

**Số 5/ký cung:** cả hai triển khai có cách xử lý theo năm/giới tính nhưng cấu hình và cách chia tam nguyên có thể khác. Không đồng nhất kết quả vì cùng có tên Hà Lạc; cần so từng trường hợp biên và tìm nguồn trực tiếp.

**Chu kỳ vận và lưu niên:** các cách chọn hào kế tiếp, đổi quẻ, số năm theo hào và xử lý quẻ Tiên/Hậu thiên cần fixture riêng. Không thay bằng cách của triển khai khác chỉ vì có nhiều ví dụ hơn.

## 4. Ma trận quyết định cho mỗi quy tắc

Mỗi quy tắc phải có đủ các trường:

- `rule_id`, `method_version`, `school_or_variant`
- `source_title`, `edition_or_witness`, `chapter_or_page`, URL/ảnh nguồn
- `source_quote_or_table` (trích đoạn ngắn cần thiết, kèm vị trí; tôn trọng giấy phép)
- `input`, `preconditions`, `intermediate_steps`, `expected_output`
- `counterexample_or_boundary_case`, `test_id`
- `evidence_status`: `VERIFIED_SOURCE`, `TESTED_IMPLEMENTATION`, `TRADITIONAL_VARIANT`, `HEURISTIC_UNVERIFIED`, `NEEDS_REVIEW`

Không gộp hai trạng thái:
- `TESTED_IMPLEMENTATION`: code vượt qua fixture đã xác định.
- `VERIFIED_SOURCE`: fixture đã được đối chiếu với nguồn sơ cấp cụ thể.
Một quy tắc có thể đạt trạng thái thứ nhất mà vẫn chưa đạt trạng thái thứ hai.

## 5. Kiểm thử đã được thêm vào mã ứng dụng

Hàm `tccKiemThuBatTuHaLac_()` trong `Code.gs` chạy thủ công trong Apps Script và kiểm tra:
- 100 cặp can cho miền kết quả thập thần;
- 120 tổ hợp thiên can/địa chi cho 12 trường sinh;
- 64 quẻ chuyển đổi hai chiều từ quẻ sang sáu hào rồi trở lại;
- 384 phép biến một hào duy nhất;
- 768 trường hợp hào nguyên đường trả về vị trí 1–6;
- các điểm biên của phép rút gọn số;
- hồi quy trạng thái hồ sơ phương pháp.

Đây là kiểm thử bất biến cấu trúc. Cần chạy hàm thực tế trên Apps Script và ghi kết quả trước khi tuyên bố đạt. Các test này không xác minh nguồn cổ thư và không kiểm định năng lực dự báo.

## 6. Giới hạn nghiên cứu trong lượt này

Đã tìm được các nguồn công khai có provenance cho nhiều nhánh Bát Tự và một triển khai Hà Lạc thứ cấp có ca mẫu/biến thể. Tuy vậy, chưa đối chiếu trực tiếp đầy đủ mọi quy tắc của Thiên Cơ Các với ảnh/bản văn Hà Lạc gốc, cũng chưa chạy kiểm thử trên runtime Apps Script. Vì vậy:
- Không đổi công thức lõi ở lượt này khi chưa đủ căn cứ sơ cấp.
- Không nhập/copy bảng hoặc lời đoán từ kho bên ngoài vào sản phẩm.
- Giữ các dị bản ở trạng thái `NEEDS_REVIEW`, tiếp tục với fixture có nguồn.
