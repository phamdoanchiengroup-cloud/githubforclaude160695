# KPI Quy trình sản xuất

Nhóm: KPI · Cập nhật 31/10/2026
Liên quan: [[KPI Kỹ năng]] · [[KPI Phân tích định mức]] · [[Quyết định của chủ dự án]] · [[Việc chờ chủ dự án]] · [[Liên kết và công cụ]]

Trạng thái: **đang thiết kế, chưa viết code**.

## Chủ dự án yêu cầu (25/10)
- Thêm tab "Quy trình sản xuất" và gộp tab Kỹ năng vào đó.
- Trưởng / phó phòng (TP/PP) nối các công đoạn thành quy trình. Công đoạn có thể đi tuần tự, rẽ nhánh hoặc quy tụ.
- Từ quy trình và định mức, dùng Lean Six Sigma để:
  - cân bằng các khâu;
  - tính số công nhân hợp lý mỗi công đoạn và mỗi xưởng;
  - biết bán thành phẩm (BTP) xưởng nào giao cho xưởng nào;
  - tìm nút thắt và cách xử lý.

## Đã chốt (31/10)
- **Làm theo phương án C**:
  - Giai đoạn 1: phân tích cân bằng ở cấp 9 xưởng trước. Claude soạn sẵn quy trình nháp cho 195 công đoạn, TP/PP chỉ xem và sửa.
  - Giai đoạn 2: đi sâu cấp công đoạn ở các xưởng nút thắt, gắn kỹ năng ILUO.
  - Giai đoạn 3: kế hoạch sản lượng và tồn BTP.
- **Tab chỉ mở cho tài khoản chủ sở hữu**, vì còn phải chỉnh nhiều mới chính xác.
- Bộ 13 câu hỏi làm rõ ngày 25/10 (xem [[Việc chờ chủ dự án]]) **chưa được trả lời từng câu**. Chủ dự án gửi trước 2 file dữ liệu (dưới đây) để Claude rút thông tin.

## Góp ý chuyên gia (25/10)
- **`quan-ly-van-hanh`**
  - Quy trình đi **theo dòng sản phẩm**, xuyên các xưởng. Không đặt quy trình bên trong kỹ năng.
  - Quy đổi mọi đơn vị về "1 gậy thành phẩm", tính ngược từ khâu đóng gói.
  - **Số CN cần = Nhu cầu × q ÷ (định mức × giờ hiệu dụng × hệ số đạt)**. Trong đó q là số đơn vị của khâu cần cho 1 gậy (đã tính hệ số khúc và tỷ lệ đạt).
  - Định mức đang ở mức P75, nên hệ số đạt chỉ khoảng 0,8–0,85.
  - **Tải = cần ÷ có**. Khâu tải lớn nhất là nút thắt.
  - Chỉ số cân bằng chuyền (LBR) dưới 85% là lệch.
  - Khâu chạy máy hoặc theo mẻ (sơn, sấy, CNC, in UV, cuốn / nung phôi): năng lực là số nhỏ hơn giữa năng lực người và năng lực máy.
  - Công đoạn hỗ trợ (hỗ trợ tổ khác, vệ sinh buồng sơn) tính thành % phụ cấp của xưởng, không phải một nút trên quy trình.
  - Xử lý nút thắt theo 5 bước TOC.
- **`thiet-ke-dao-tao`**
  - Mỗi công đoạn có **1 kỹ năng chính**.
  - Độ phủ = số người đạt cấp 2 trở lên ÷ số người cần.
  - Quy tắc 3 người: đỏ khi chỉ 1 người làm được, vàng khi có 2.
  - Ma trận kỹ năng **không dùng để trừ KPI**.
  - Một tab, hai khung nhìn: "Dòng chảy" và "Con người".
- **`soat-giao-dien-cuoi`**
  - Nhập bằng **danh sách công đoạn có ô "Công đoạn trước"** (tự điền sẵn công đoạn ngay phía trên). Web tự vẽ sơ đồ dọc và chặn vòng lặp.
  - Không làm kéo-thả.
  - Nút thắt: viền đỏ kèm chữ "NÚT THẮT", có một câu kết luận ở đầu.
  - Luồng giữa các xưởng hiện bằng danh sách mũi tên.

## Dữ liệu từ 2 file chủ dự án gửi (31/10)
File gốc chỉ để ở scratchpad phiên (`scratchpad/qt/`), **không commit**: có tên khách và tên người. Phiên sau cần thì nhờ chủ dự án gửi lại, hoặc lấy trên Drive nếu đã có.

### 1. "Carbon Billiards – Danh mục từng tab" (danh mục mã hàng, ~9.600 mã)
- 13 nhóm, mỗi mã có STT / Mã / Tên:
  - Ngọn cơ 2.676 · Linh kiện – Phụ kiện 2.154 · Chuôi cơ 1.873 · Sản phẩm khác 803
  - Cơ Lỗ (Pool) 768 · Carom 610 · Gậy CLB 282 · Khúc nối 273 · Bao – Hộp 72
  - Cơ Nhảy 59 · Phá 55 · Phá-Nhảy 18 · Libre 10
- **Tiền tố mã cho biết BTP đang ở chặng nào.** Đây là chìa khóa của luồng giữa các xưởng:

| Tiền tố | Nghĩa (Claude suy ra, **chờ chủ dự án xác nhận**) | Xưởng làm ra | Ví dụ |
|---|---|---|---|
| `60…` | Phôi / BTP thô (bộ phận phôi "BP60") | PHOICB / PHOITHO | `60CGF736_21.5_3/8-8 Đánh phá_1E1P` = chuôi glassfiber 736, ren 3/8-8, 1 EX 1 POM |
| `S…` | Đã sơn (có màu) | SON | `SCGF100+390…/Bạc` |
| `UV…` | Đã in UV (có mẫu in) | INUV | `UVCGF…/Bạc/TK-PRO màu Đen` |
| `HT…` | Đã hoàn thiện | HT | `HTCGF…`, `HTNCB747…` |
| `Ngọn…` | Ngọn đã taro ren | NGONTARO | `NgọnNCB707_12.0…/3/8-8-Timeblue-C` |
| `CNCTip…`, `CNCPhip…`, `CNCLet…` | Típ / phíp / lết gia công CNC | CNC | `CNCTip_Black_0.9/10/1Đ1T` |
| `ETip…` | Phôi típ | NGONTIP? | `ETip_Black_0.9/7` |
| Mã thương hiệu (`RHI…`, `EVO…`, `MIT…`, `ALLIN…`) | Thành phẩm bán ra | DG đóng gói | `EVO1/BEA2/GREEN/LW-BLACK/C/388/12.5` |

- Luồng đọc được từ mã:
  - **Chuôi:** 60 → S → UV → HT → thành phẩm.
  - **Ngọn:** 60NCB → Ngọn (taro) → HT.
  - **Khúc nối, gậy 1 khúc:** 60 → S → UV → HT.
- Ý nghĩa trong mã:
  - Loại vật liệu: CB = carbon, GF = glassfiber, CG / GC = mix, NCB = ngọn carbon, NCG = ngọn GF vỏ carbon.
  - Thông số: chiều dài–đường kính, ren, POM / EX.
- Một gậy 2 khúc = 1 chuôi + 1 ngọn (+ típ, phíp, nối). Khi chủ dự án xác nhận, đây sẽ là hệ số quy tụ cho quy trình.

### 2. "Trạng thái đơn hàng" (bảng theo dõi đơn của văn phòng)
- **Các sheet theo kênh:** Kho, Dealer, Web lẻ Custom, Web lẻ thường, OEM, 1 khách sỉ lớn, POD (2 sheet). Ngoài ra:
  - "Đơn hàng HT": lưu trữ ~15.000 dòng từ 03/2025.
  - "_SNAPSHOT": ảnh chụp trạng thái mỗi ngày tháng 10/2026, dạng JSON có các trường maDon / tenSP / kenh / sl / thieu / giao / dl / st (sanSang, dangSX, treHan, daGiao).
- **Cột của mỗi dòng đơn:**
  - Mã đơn · Loại hàng · Loại phôi · Số lượng đặt · SX còn thiếu · Deadline · Có thể giao · Đã trả khách.
  - Rồi **mỗi bộ phận một cột số lượng đã làm, cột "hỏng cần làm bù" và cột "ngày hẹn trả"**, theo thứ tự: Phôi (BP60) → Sơn → Taro → Làm đầu / Tip → UV → Hoàn thiện → Đóng gói.
  - Cuối cùng là các cột ngày "Ngày nhận hàng": số lượng đóng gói nhận mỗi ngày.
- **Số liệu tháng 10/2026, từ _SNAPSHOT:**
  - Hàng còn thiếu tăng từ 9.290 (01/10) lên **11.877 (30/10)**.
  - Số dòng đơn tăng 451 → 795.
  - Dòng trễ hạn: 24 → 91 (cao nhất 116 ngày 29/10).
  - Tổng đặt ~20.600; có thể giao ~8.750.
- **Sản lượng đóng gói nhận tháng 10** (cộng cột "Ngày nhận hàng" các sheet đang mở): ~6.060 trong 24 ngày có số, **trung bình ~250/ngày**.
  - Từ 9/10 mức ổn định là 250–500/ngày.
  - Đơn vị lẫn lộn: gậy, ngọn, chuôi chưa tách riêng.
- **Thứ tự bộ phận trong bảng khớp với luồng tiền tố mã ở trên.** Văn phòng đang theo dõi WIP bằng tay theo đúng luồng này.

### Dùng được gì cho tab Quy trình sản xuất
1. **Khung luồng giữa các xưởng (giai đoạn 1):** Phôi → (Sơn, Taro ngọn, Tip/CNC song song) → UV → HT → ĐG. Lấy theo cột bảng đơn và tiền tố mã, nên không cần TP vẽ từ đầu.
2. **Nhu cầu sản lượng:**
   - Dùng hàng còn thiếu (~12.000) và tốc độ giao thực tế (~250/ngày). Riêng phần còn thiếu đã cần khoảng 48 ngày làm việc nếu giữ nhịp hiện nay.
   - Đơn mới vào nhanh hơn tốc độ làm ra, vì hàng còn thiếu tăng ~2.600 trong tháng 10.
   - Đây là bằng chứng có nút thắt, và là con số "nhu cầu" cho phép tính takt.
3. **Tỷ lệ hỏng làm bù từng bộ phận:** có cột riêng, nhưng nhiều ô nhập lẫn chữ / ngày, cần lọc.
4. **Danh mục mã** giúp quy đổi đơn vị: mã 60 = 1 chuôi hoặc 1 ngọn phôi; thành phẩm = 1 gậy / ngọn / nối.

**Hạn chế:**
- Bảng nhập tay nên nhiều ô sai kiểu: ngày lẫn vào cột số, cột Đóng gói có số rác hàng tỷ, cột ngày đảo ngày/tháng.
- Các sheet bố trí cột không giống nhau.
- Mã đơn không khớp mã trong danh mục (đơn ghi tên tự do).
- Bảng đơn **không ghi theo công đoạn**, chỉ theo bộ phận lớn. Muốn xuống cấp công đoạn thì vẫn dùng nhật ký sản xuất trên web.

## Việc tiếp theo
- Chờ chủ dự án xác nhận bảng tiền tố, và trả lời các câu hỏi còn lại: hệ số khúc, giờ ca, số máy, ai sửa quy trình.
- Sau đó Claude soạn quy trình nháp, rồi bản xem thử tab (chỉ tài khoản chủ sở hữu).
