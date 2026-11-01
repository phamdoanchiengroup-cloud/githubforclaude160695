# KPI Quy trình sản xuất

Nhóm: KPI · Cập nhật 31/10/2026
Liên quan: [[KPI Kỹ năng]] · [[KPI Phân tích định mức]] · [[Quyết định của chủ dự án]] · [[Việc chờ chủ dự án]] · [[Liên kết và công cụ]]

Trạng thái: **bản đầu đã làm 31/10** (chưa dán lên web thật).

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
- Bộ 13 câu hỏi làm rõ ngày 25/10 (xem [[Việc chờ chủ dự án]]) **chưa được trả lời từng câu**. Chủ dự án gửi trước 3 file dữ liệu (dưới đây) để Claude rút thông tin.

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

## Dữ liệu từ 3 file chủ dự án gửi (31/10)
File gốc chỉ để ở scratchpad phiên (`scratchpad/qt/`), **không commit**: có tên khách và tên người. Phiên sau cần thì nhờ chủ dự án gửi lại, hoặc lấy trên Drive nếu đã có.

### 1. "Carbon Billiards – Danh mục từng tab" (danh mục mã hàng, ~9.600 mã)
- 13 nhóm, mỗi mã có STT / Mã / Tên:
  - Ngọn cơ 2.676 · Linh kiện – Phụ kiện 2.154 · Chuôi cơ 1.873 · Sản phẩm khác 803
  - Cơ Lỗ (Pool) 768 · Carom 610 · Gậy CLB 282 · Khúc nối 273 · Bao – Hộp 72
  - Cơ Nhảy 59 · Phá 55 · Phá-Nhảy 18 · Libre 10
- **Tiền tố mã cho biết BTP đang ở chặng nào.** Đây là chìa khóa của luồng giữa các xưởng:

| Tiền tố | Nghĩa (chủ dự án **xác nhận đúng 31/10**) | Xưởng làm ra | Ví dụ |
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

### 3. "THÔNG SỐ GẬY.xlsx" (31/10, trên Drive, id `1wM3DydKenFuPo4PWTirgr2WzE15yBNqB`)
- File 36 MB, vượt giới hạn tải lên Claude (30 MB) nên chủ dự án đưa lên Drive. Phần nặng là ảnh.
- Công cụ `download_file_content` chỉ tải được file dưới 10 MB. **`read_file_content` đọc được phần chữ.** Ảnh không đọc được, và nội dung có thể bị cắt nếu file quá dài.
- **Nội dung:** bảng "thông số kỹ thuật" theo dòng gậy. Mỗi mã gậy ghi **thông số phôi ngọn** và **loại phôi chuôi**, kèm ghi chú trọng lượng. Đây là **BOM cấp BTP** (gậy cần những bán thành phẩm nào).
- **Các sheet / nhóm:**
  - Rhino 2024: VF, Nhảy Never, Nebula, Komet, Rhino EVO, Đánh / Phá / Nhảy Mỹ, Retro, GMK, GW, Nối.
  - EVO: EVO1 / 2 / 4 / 5, Phá X, Nhảy PEG (3 khúc) / IG (2 khúc), Phá-Nhảy VAL, Nối EVO.
  - Rhino 2025, Rhino-New: Nebula, Retro, Luminax, Voyager, Komet, Việt Nam, Carom, Parkour, Eclipse II, Beer, IRC.
  - Omega (ren Uniloc), Raptor, Cuebots (Z-Pure / Z-SP / Z-Luk / ZW / CHS / CHL / CG).
  - Khách OEM / sỉ: X-Billiards / Allin, Dragon + Aileex, HSG, Aplus.
- **Quy tắc BOM rút ra** (chủ dự án **xác nhận đúng cả 5 điểm 31/10**):
  - Gậy 2 khúc = **1 phôi ngọn + 1 phôi chuôi**. Nối 4/6/8 inch là món riêng, có mã riêng, đi kèm một số dòng (EVO, Retro, Legend).
  - Gậy nhảy "3 khúc" (PEG): chuôi chia 280-150 → 1 ngọn + chuôi 2 đoạn.
  - Phá-nhảy 350-385, nhảy 330-130 / 300-120 / 305-205: chuôi 2 đoạn.
  - **"1480/2", "1450 chặt đôi"**: 1 phôi glassfiber 1480 / 1450 chặt ra 2 đoạn (ngọn và chuôi) → hệ số 1 phôi = 1 gậy.
  - "Chặt từ chuôi GF 736": nhảy Allin Pro dùng lại phôi chuôi 736.
  - Gậy 1 khúc (GMK 1450 / 1480) = 1 phôi.
- **Thông số phôi:**
  - Chiều dài: 707 / 725 / 736 / 747 / 750, 29" / 30".
  - Đường kính đầu: 10.5–13.9.
  - Vật liệu: full carbon T700 / mix / GF lõi carbon / GF vỏ carbon.
  - Chỉ foam / full foam, có đạn hay không.
  - Ren: 3/8-8, 3/8-10, 5/16-18, Uniloc, Radial.
  - Típ: Time 3, 9 xanh 1 đen, đen 7 lớp, bakelite, Kamui, Nishiki.
  - Phíp: mika 5/7, bakelite.
  - Chuôi: khuôn 21.3/30.8 (Rhino) hoặc 21.3/31.3 (chuôi cũ + OEM), vách 2.0 / 2.5, lót bạc / trắng / Camay, hạ khấc / đánh phá.
  - Tay da: sport vân carbon 1.4, vân rắn 1.6.
- **Ghi chú quan trọng:**
  - Ngọn 11.8 / 12.5 CYCO dùng cho Rhino và Z; 11.8 / 12.5 COCO chỉ dùng cho dòng Must.
  - Trọng lượng hoàn thiện 18.5–19.5 oz tùy dòng.
- **Dùng cho tab:**
  - Mỗi dòng gậy biết cần 1 ngọn (qua Phôi → Taro → Tip / CNC phíp → HT) và 1 chuôi (qua Phôi → Sơn → UV → HT). Đây là điểm **quy tụ** ở khâu Hoàn thiện / Đóng gói.
  - Biết phôi nào dùng chung giữa các dòng (vd. chuôi 736 hạ khấc bạc dùng cho nhiều dòng), nên gom nhu cầu phôi được.

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

## Giờ ca, máy, quyền sửa (31/10)
- Chủ dự án thấy câu hỏi "giờ ca / số máy / ai sửa" khó trả lời. Claude tự lo:
  - **Số máy:** lấy từ sheet MayMoc. Có 154 máy "Hoạt động", ghi theo xưởng và chủng loại, vd. INUV 19 máy in UV, PHOITHO 20 máy tiện, CNC 12 CNC bàn, PHOICB 6 máy cuốn + 3 lò nướng, SON 1 buồng sơn.
  - Nhật ký sản xuất hầu như không ghi mã máy (98/15.597 dòng), nên chưa đo được năng lực máy từ nhật ký.
  - **Giờ ca:** dùng một ô "giờ hiệu dụng/ngày" có số mặc định, chủ sở hữu tự chỉnh trên màn hình.
  - **Quyền sửa:** giai đoạn đầu chỉ chủ sở hữu, nên chưa cần quyết định.

## Kiến trúc (tư vấn 31/10, chờ chủ dự án chọn)
- Hỏi chuyên gia `bao-mat-ung-dung`, khuyến nghị **B**: làm **mảnh tải sau `QuyTrinh.html`** trong web hiện tại, giống SoDo.
  - Index giữ ~824 KB; chỉ tài khoản được quyền mới tải thêm ~100–150 KB.
- Đã loại 2 cách:
  - **A. Web riêng:** phải làm đăng nhập thứ hai, hai bộ quyền dễ lệch nhau, phải chép trùng code định mức.
  - **C. Nhét thẳng vào Index:** Index lên ~975 KB, mọi người kể cả công nhân đều phải tải.
- Phải làm đúng về bảo mật:
  - Mọi hàm máy chủ của quy trình tự kiểm token và quyền ngay dòng đầu; quyền lấy theo phiên, không tin trình duyệt.
  - Mảnh chỉ chứa giao diện, không chứa số liệu.
  - Lưu có kiểm từng ô, chặn công thức (ô bắt đầu bằng `=`), dùng `LockService`, ghi nhật ký.
- Bộ cài clasp đẩy danh sách file cố định (`chung.ps1` nằm trên máy chủ dự án). Thêm file mới thì phải gửi lại bộ cài **một lần**. Định sửa để bộ cài tự đọc danh sách file từ repo, sau này thêm file không phải gửi lại.

## Đã làm 31/10: bản đầu (chủ dự án chọn B + "do your best")
- **Kiến trúc:** mảnh tải sau `kpi-app/QuyTrinh.html`, nguồn ở `tests/quy-trinh/quy-trinh-web.html`, được chép ra bởi `tests/quy-trinh/va-quy-trinh-web.py` (mục 36 của va-index).
  - Index chỉ thêm tab `qt` (nhóm Sản xuất, nằm trong `tabChiOwner`), hàm `vQT()`, `MANH_VER.QuyTrinh`. Index ~825 KB, tăng ~1 KB.
  - Mảnh `QuyTrinh.html` ~30 KB, chỉ tải khi chủ sở hữu mở tab.
- **Máy chủ** `tests/quy-trinh/quy-trinh.gs` (nối bằng `va-quy-trinh.py`, kèm `MANH_GD.QuyTrinh = ['OWNER']`):
  - `layQuyTrinh(token, soNgay)` trả về:
    - quy trình (đã lưu hoặc nháp `QT_NHAP`), luồng xưởng (`QT_XUONG_NHAP`), cài đặt;
    - thống kê nhật ký trong kỳ (sản lượng + người làm cho từng công đoạn, bỏ dòng "Từ chối");
    - nhân sự đang làm (không gửi CCCD / điện thoại), máy theo xưởng, kỹ năng cấp ≥ 2 còn hạn.
  - `luuQuyTrinh(token, o)`: khóa ghi, kiểm từng ô, chặn công đoạn trước khác xưởng, chặn vòng lặp (`qtCoVong_`), chặn công thức (`dongAnToan_`). Ghi đè sheet `QuyTrinh` (tự tạo, cột Loai CD / XUONG / CAIDAT) và ghi nhật ký thao tác.
  - `qtCanh_`: suy công đoạn trước từ nhánh + bước. Trình duyệt dùng bản giống hệt `qtCanh`. Mọi hàm kiểm `me.laOwner`.
- **Nhánh:** Chung, Ngọn, Chuôi, Gậy 1 khúc, Nối, Típ, Phíp, POM, Phụ kiện, Đơn lẻ, Làm lại / sửa, Hỗ trợ, Chưa xếp.
  - Ngọn / Chuôi / Gậy 1 khúc tách ra từ "Chung" và gộp lại ở bước "Chung" sau.
  - Làm lại và Hỗ trợ không nằm trên dòng chảy nhưng vẫn tính tải.
- **Công thức (trình duyệt `qtTinh`):**
  - Giờ chuẩn = sản lượng ÷ định mức (quy mọi đơn vị về giờ-người).
  - CN cần = giờ chuẩn/ngày × mục tiêu ÷ (giờ có mặt 8 × hiệu suất 85%).
  - CN có = nhân sự Đang làm, trừ Trưởng / Phó phòng (tổ trưởng vẫn tính).
  - Tải = cần ÷ có. Làm tối đa = mục tiêu ÷ tải. LBR = Σ tải ÷ (số xưởng × tải max).
  - Công đoạn: tải = cần ÷ số người biết làm (đã làm trong kỳ hoặc có kỹ năng cấp 2+). Có cờ "1 người" / "2 người".
  - Dùng cơ cấu hàng thực tế nên **không cần khai hệ số khúc / gậy**.
- **Phát hiện:** cột GioLam trong nhật ký không phải giờ thật (chỉ Phôi Thô ghi ~8 giờ/người-ngày; các xưởng khác ~1,4–2,3). Vì vậy tính theo giờ chuẩn, không theo giờ ghi.
- **Số liệu thật 25/9–24/10 (bản đầu, mục tiêu 100%, CN có = danh sách – đã thay, xem mục rà soát):**
  - Tải các xưởng 62–86%. Sơn cao nhất (86%), Phôi Carbon 81%, Ngọn Tip 81%.
  - Theo định mức, nhà máy làm được tối đa ~116% sản lượng hiện nay; cân bằng giữa xưởng ~86%.
  - Kết luận: **không xưởng nào thiếu người theo định mức**. Hàng còn thiếu tăng do máy / mẻ, chờ bán thành phẩm, làm lại, hoặc giờ không ghi nhật ký, chứ không do thiếu người.
- **Giao diện:** 4 khung nhìn.
  - **Toàn nhà máy:** câu kết luận, luồng bán thành phẩm, bảng cân bằng.
  - **Từng xưởng:** sơ đồ SVG dọc tự xếp tầng (viền đỏ = nút thắt hoặc chỉ 1 người biết) và bảng công đoạn.
  - **Con người:** quy tắc 3 người, kèm tên người biết làm.
  - **Sửa quy trình:** chọn nhánh / bước, "Chọn tay" công đoạn trước, chặn vòng lặp; sửa luồng giữa xưởng; thanh Lưu dính đáy, trên điện thoại nằm trên thanh menu.
  - Ô cài đặt: kỳ 14/30/60/90 ngày, mục tiêu %, giờ, hiệu suất.
- **Tab Kỹ năng vẫn giữ** cho các vai trò khác. Phần "gộp" giai đoạn này = khung nhìn "Con người" đọc dữ liệu kỹ năng. Gộp hẳn khi mở tab cho TP/PP.
- **Bộ cài clasp:** `cap-nhat.ps1` đọc `kpi-app/danh-sach-file.txt` trên GitHub (lỗi thì dùng danh sách trong `chung.ps1`, đã thêm QuyTrinh). Phải gửi zip mới **một lần** (đã gửi 31/10).
- **Kiểm thử:** `tests/quy-trinh.js` (cần `DATA=`), `tests/quy-trinh-web.js` (`F=` bản xem thử; `CHUP=` để chụp ảnh). `tao-ban-xem-thu.js` đã nạp thêm QuyTrinh.html.

## Rà soát chuyên gia 31/10 (sau bản đầu) – đã sửa
- **`quan-ly-van-hanh`:** kết luận "không thiếu người" chưa đủ căn cứ, vì mục tiêu 100% so với chính sản lượng đã bị nút thắt kìm lại. Đã sửa:
  - **Mục tiêu mặc định 137%** = nhu cầu theo đơn tháng 10 (đóng gói ~250/ngày + hàng thiếu tăng ~92/ngày). Lưu ở `QT_CAI_DAT.mucTieu`; 100% = giữ nhịp hiện nay.
  - **CN có = người có mặt thực**: ngày-người có dòng nhật ký ÷ số ngày SX (`ngayCong` từ máy chủ). Danh sách chỉ để tham khảo ("/ N").
  - **Năng suất thực** = giờ chuẩn ÷ (có mặt × 8). Câu kết luận nêu xưởng "chạy gần hết sức" (năng suất ≥ hiệu suất − 2%).
  - **Tải công đoạn chia thời gian từng người** theo phần giờ chuẩn họ làm × tỷ lệ có mặt (cột "Đang làm (quy đổi)"). Không đếm 1 người đủ ở mọi công đoạn; "biết làm" vẫn đếm đủ cho cờ 1 người.
- **Số liệu thật sau sửa (mục tiêu 137%):**
  - 154 người trong danh sách, có mặt TB 123/ngày. Làm tối đa ~98% sản lượng hiện nay ở hiệu suất 85%, tức **chưa đủ cho 137%**.
  - Mọi xưởng tải 111–139%. Phôi Thô 139% (thiếu ~7), Phôi Carbon 138% (~10), Sơn 135% (~6), Ngọn Tip 134%.
  - Chạy gần hết sức: Phôi Thô 86%, Phôi Carbon 86%, Sơn 83%, Ngọn Tip 83% định mức. Các xưởng khác 69–81%, còn dư thời gian.
- **`bao-mat-ung-dung`:** không có lỗi nặng; 3 lỗi thấp đã sửa:
  1. Lưu: ghi trước rồi mới xóa dòng thừa, thêm dòng khi sheet thiếu (không mất bản cũ nếu ghi lỗi).
  2. Kiểm tên bằng `qtCo_` (hasOwnProperty), chặn `__proto__`.
  3. Kiểm độ dài / kiểu (Truoc ≤ 20, ghi chú ≤ 400…) **trước** khi giữ khóa.
- **Kiểm thử:** `quy-trinh.js` 50, `quy-trinh-web.js` 33.
- **Chuyên gia đề xuất 3 ưu tiên giai đoạn 2:**
  1. Đếm hàng chờ (WIP) trước mỗi xưởng mỗi sáng; ghép với dòng đơn trễ hạn.
  2. Đo năng lực máy / mẻ ở Sơn (sấy), CNC, In UV.
  3. Làm sạch đo lường: tỷ lệ đạt / làm lại, chuẩn hóa ghi giờ (Phôi Thô làm mẫu), bấm giờ lại định mức 2–3 xưởng tải cao.

## So sánh với app Qoder của chủ dự án (31/10)
- Chủ dự án tự làm **app riêng bằng Qoder**: Apps Script riêng, sheet riêng gồm 17 sheet `QT_*` và `QT_TaiKhoan`, đăng nhập riêng (chủ + `tp.<xưởng>`), bản v8. Gồm 5 file Code / Index / App (~160 KB) / HuongDan / Seed (~116 KB, dữ liệu mẫu 30/10).
  - File gửi vào phiên, **không commit**: có hash mật khẩu chủ và tên 181 nhân sự.
- **Cách tính của Qoder là theo kế hoạch / BOM:**
  - 7 kiểu đơn có kế hoạch tháng: G2K 13.000, G1K 800, GTN 1.300, Ngọn lẻ 10.000, Chuôi lẻ 250, Nối lẻ 700, Tip lẻ 4.000.
  - Mỗi kiểu đơn có thành phần NGON / CHUOI / NOI / TIP / P1K.
  - 393 dòng hàng (tổng 20.557, khớp với số đặt đang mở trong file đơn) được gán vào 31 cấu hình bằng 28 luật regex.
  - Mỗi linh kiện có luồng riêng với trọng số w nhập tay.
  - Giờ có sẵn = 26 × 8 × (1 − 12%), **không có hiệu suất**.
  - Nhân lực xưởng nhập tay, cố định.
- **Phần mạnh của Qoder:**
  - Trình dựng quy trình cho trưởng phòng: kéo-thả, có điểm vào từ xưởng khác, xuôi / ngược, nối chuỗi, khung kiểm tra lỗi.
  - Tab Tuyến sản phẩm.
  - Sổ tay hướng dẫn trưởng phòng, có bản in PDF.
  - Hộp hướng dẫn lần đầu.
- **`quan-ly-van-hanh`:**
  - Bản web KPI (dựa trên thực tế) đáng tin hơn cho câu hỏi "cần bao nhiêu người, nút thắt ở đâu".
  - Qoder mạnh ở mô phỏng khi cơ cấu đơn đổi, nhưng nhân 4–5 giả định chưa kiểm.
  - Khuyến nghị lấy web KPI làm gốc và đưa 3 phần của Qoder vào: (1) nhu cầu theo cơ cấu sản phẩm (đơn → kiểu → thành phần) thay hệ số 137% chung; (2) luồng có w nhưng **w đo từ nhật ký**, kèm đối chiếu lệch quá 15%; (3) trình dựng quy trình cho trưởng phòng + sổ tay.
  - Không nên chạy hai app song song.
- **`bao-mat-ung-dung` rà app Qoder** (Claude đã kiểm chứng các lỗi chính):
  - **Cao:**
    1. `saveAll` của trưởng phòng tin danh sách `kn` do trình duyệt gửi, nên ghi được bước mang mã khối của xưởng khác.
    2. XSS lưu trữ qua id bước: `onclick="moSua('${b.id}')"`, và `esc` không thoát dấu `'`. Có thể lấy token chủ sở hữu.
    3. Ô bắt đầu bằng `=` có thể thành công thức, đọc được ô tài khoản.
  - **Trung bình:**
    - `nangCap` / `include` / `chanDoan` gọi được mà không cần đăng nhập.
    - SHA-256 một vòng, hash của chủ ghi cứng trong code.
    - Khóa tài khoản không hủy phiên cũ.
    - Không có `LockService`; ghi bằng `clear` rồi mới ghi lại.
- **Chờ chủ dự án:**
  - Chọn: gộp vào web KPI, hay giữ app Qoder (phải vá 3 lỗi cao trước khi giao tài khoản trưởng phòng).
  - Nguồn số kế hoạch 13.000 / tháng.
  - 20.557 là tồn đơn hay đơn 1 tháng.
  - Ai nhập w.

## Phân loại cấu hình gậy cho SKU (31/10, đang làm rõ)
- **Chủ dự án chốt:** app Qoder chỉ làm tạm khi Claude hết token, **không sửa gì trên đó**. Lấy phần tốt nhất đưa vào web KPI, ưu tiên **phân loại cấu hình gậy cho SKU**.
- **Ý tưởng của chủ dự án:**
  - Phôi Carbon, Phôi Thô, Sơn, CNC, Ngọn Taro, Ngọn Tip làm việc trên **mã bán thành phẩm**.
  - In UV, Hoàn thiện, Đóng gói làm việc trên **SKU**.
  - Phân loại cấu hình → khi nhận đơn thì chia việc về từng xưởng.
- **Sản lượng thật ~9.000 sản phẩm/tháng** (không tính tay nối). Kế hoạch 30.000/tháng của Qoder là sai.
- **Sheet "Trạng thái đơn hàng"** (của tài khoản khác, đã chia sẻ cho chủ dự án, có quyền sửa): id `1FKrF_wyQcl0SpDhvoRBg7VoaBzgzhSJ7zZ5U2A5ReMU`.
  - Script theo dõi đơn gắn với Sheet này (project `19Do2R…`): đọc 7 tab, chụp `_SNAPSHOT` lúc 4h, gửi email 8h. Chủ dự án đã gửi mã nguồn.
- **Rà luật phân loại của Qoder** (28 regex → 31 cấu hình, chạy trên 393 dòng hàng):
  - 3 dòng không khớp luật nào; 170 dòng khớp nhiều luật, luật đứng trước thắng.
  - Gán sai:
    - Evo Luna "Malachite Eclipse" → Eclipse; đúng là EVO4.
    - Evo Meg → EVO1/2; đúng là EVO5. Evo Crown → EVO1/2; đúng là EVO2 (CRO).
    - "NGỌN NHẢY HORNET" (chỉ ngọn) → gậy nhảy đủ bộ.
    - RHI2-C30PT (ngọn carbon 30") → Carom.
    - Gậy TK (Aplus SAM TK-PRO) → EVO.
    - Ngọn lẻ bị gán cứng 12.5 ren 3/8-8.
    - Bia Hơi → RH-25; theo Thông số gậy thì cấu hình giống Retro.
- **Tư vấn `quan-ly-van-hanh`:** 3 lớp, lưu bằng bảng trong Sheet, không viết cứng trong code.
  - **A:** loại hàng (gậy / ngọn lẻ / chuôi lẻ / phụ kiện) + bảng bí danh dòng / mẫu. Bí danh dài nhất thắng; hòa thì vào hàng chờ duyệt.
  - **B:** thuộc tính đọc từ tên (ren, đầu, tay, vật liệu) ưu tiên hơn mặc định của dòng.
  - **C:** bung BOM ra mã bán thành phẩm theo Thông số gậy.
  - Độ tin cậy xanh / vàng / đỏ; hàng chờ duyệt; học từ lần duyệt; bộ kiểm thử 393 dòng.
  - Giai đoạn 1: chỉ đọc; báo cáo "còn thiếu theo xưởng × dòng gậy × tuần deadline".

## Tuyến bán thành phẩm theo chủ dự án (31/10)
- **Chuôi** đi qua Phôi Carbon → Phôi Thô → Sơn.
- **Ngọn** đi qua Phôi Carbon → Phôi Thô → Ngọn Taro → Ngọn Tip. CNC cấp típ / phíp cho Ngọn Tip.
- **In UV:** nhận phôi theo mã bán thành phẩm, giao sang Hoàn thiện theo **SKU**. Hoàn thiện và Đóng gói làm theo SKU.
- **Kết nối dữ liệu đơn:** Claude đề xuất web KPI **đọc thẳng Sheet "Trạng thái đơn hàng"** bằng `openById`, chỉ đọc.
  - Lý do: web KPI chạy dưới tài khoản chủ dự án, tài khoản này có quyền vào Sheet. Web app đơn hàng chạy theo tài khoản người xem nên không gọi được từ máy chủ.
  - Lưu tạm 5 phút, có nút "Làm mới".
  - Dò cột theo tên tiêu đề, như script đơn hàng đang làm.
  - Lần đầu chủ dự án phải bấm cấp quyền thêm một lần.
- **Đếm cấu hình BOM (ước lượng từ Thông số gậy + danh mục mã):**
  - ~110–120 dòng mẫu gậy trong file Thông số.
  - Khoảng 20 họ phôi ngọn và khoảng 25 họ phôi chuôi. Ghép lại được khoảng 45–55 cấu hình BOM ở cấp phôi.
  - Danh mục mã thật: phôi 60 có 107 mã chuôi + 90 mã ngọn; S… 105 mã chuôi; Ngọn (đã taro) 343 mã; UV… 513 mã; HT… 620 mã; CNCTip 119 mã, CNCPhip 98 mã.

## Đơn hàng → xưởng: đã làm 31/10
- **Chủ dự án chốt:**
  - Lấy dữ liệu theo cách A: đọc thẳng Sheet đơn, chỉ đọc.
  - Phân loại theo cách Claude cho là tốt nhất, chú trọng **4 thông số: loại chuôi, loại ngọn, loại tip, loại ren**.
  - **Ngọn bán lẻ đi thẳng Ngọn Tip → Đóng gói.**
- **Máy chủ** `tests/quy-trinh/don-hang.gs`, nối bằng `va-don-hang.py` sau `va-quy-trinh.py`:
  - `layDonHangXuong(token, lamMoi)`:
    - mở `SpreadsheetApp.openById(DH_SHEET_ID)` đọc 7 tab;
    - dò cột theo tiêu đề, chỉ đọc tới cột cần dùng;
    - đọc cột "đã qua" của 7 bộ phận (Phôi / Sơn / Taro / Làm đầu / UV / Hoàn thiện / Tổng ĐG) và cột "Hỏng cần làm bù" đứng ngay sau. **Ô trống = chưa ghi**, khác với số 0;
    - deadline dd/mm, sửa lại ngày Sheet bị đảo;
    - nhớ tạm 5 phút trong CacheService, chia mảnh 30.000 ký tự.
  - `luuPhanLoaiSKU(token, o)`: sửa tay, lưu vào sheet `PhanLoaiSKU`, khóa `K:<tên chuẩn>`. Có "Về tự động". Chỉ chủ sở hữu.
- **Bộ phân loại** `plPhanLoai_`:
  1. Loại hàng (gậy / ngọn lẻ / chuôi lẻ / nối / phụ kiện). Ghi chú "chỉ đặt nối", "chỉ gửi chuôi" được ưu tiên.
  2. Dòng gậy theo bảng `PL_DONG` (~50 dòng, lấy từ THÔNG SỐ GẬY). **Tên gọi dài nhất thắng**; hai dòng hòa nhau thì để đỏ.
  3. 4 thông số = mặc định của dòng + đọc từ tên và ghi chú đơn:
     - ren: `_Joint:`, /388/, /10/, /18/, /U/, Q-loc, Radial, PSJ, VQR…;
     - tip: Nishiki / Zan / Time / da lợn;
     - đầu (đường kính);
     - tay: sport → chuôi vách 2.5.
  - Độ tin cậy: xanh / vàng / đỏ.
  - **Kết quả trên 392 tên hàng thật:** 363 xanh, 29 vàng, 0 đỏ. Các ca Qoder gán sai đều đúng.
- **Giao diện:** tab con thứ 5 "Đơn hàng → xưởng" trong `QuyTrinh.html` (~47 KB). Index không đổi kích thước.
  - Thẻ 9 xưởng, mỗi thẻ có số còn làm và số quá hạn.
  - Bảng theo nhóm 4 thông số:
    - Phôi: chuôi / ngọn;
    - Sơn: chuôi × ren;
    - Taro: ngọn × ren;
    - Tip: ngọn × tip × đầu;
    - CNC: tip;
    - UV / HT / ĐG: dòng gậy (SKU).
  - Bấm vào nhóm để xem SKU trong nhóm.
  - "Kiểm phân loại": dòng đỏ / vàng lên đầu, sửa tay.
- **Cách tính còn làm** = (đặt − đã qua chặng đó **hoặc chặng sau**) giới hạn trong "còn thiếu", cộng hỏng làm bù. Chuỗi chặng:
  - chuôi: Phôi → Sơn → UV → HT → ĐG;
  - ngọn: Phôi → Taro → Tip → HT → ĐG;
  - ngọn lẻ: Phôi → Taro → Tip → ĐG.
- **Phát hiện:** với đơn đang mở, Sheet đơn **gần như không ghi số "đã qua" bộ phận** (Phôi 0/446 dòng, Taro 5/411, UV 55/344, Tip / HT / ĐG 0). Vì vậy "còn làm" ≈ "còn thiếu". Web có báo tỷ lệ dòng đơn có ghi số.
  - Còn thiếu 10.996 sản phẩm (không tính nối / phụ kiện), khoảng 1,2 tháng sản lượng (9.000/tháng).
- **Kiểm thử:**
  - `tests/don-hang.js` 43 (`DATA=`, thêm `DH=` để chạy trên toàn bộ đơn thật);
  - `quy-trinh-web.js` 39;
  - `tao-ban-xem-thu.js` nhận thêm `DH=`;
  - `gia-lap-kpi.js` có thêm `openById` (`ctx.__ngoai`).
- **`bao-mat-ung-dung`:** không có lỗi nặng. Đã sửa 3 lỗi nhỏ: gom tên theo tên chuẩn như máy chủ, khóa `K:`, mảnh cache 30.000 ký tự.

## Phần 1 + 2 (31/10, chủ dự án "Làm tiếp phần 1 phần 2")
- **Phần 1 – rà tên vàng** (`don-hang.gs`):
  - thêm dòng `NG-KOMET` (ngọn phá KOMET lẻ, FCPHA, tip BAK, R388) và thu `NG-BREAK` còn `BREAK SHAFT`;
  - thêm `CH-RETRO` (chuôi Retro lẻ, MIXCB) và thu `CH-RHINO` còn `MUST CUE BUTT`, `CUE BUTT`;
  - `PL_DAU_MD`: cỡ đầu mặc định theo dòng (ZW 12.5, KOMET 13.0…); thiếu cỡ đầu chỉ báo vàng khi ngọn không phải phá / nhảy.
  - Kết quả trên đơn thật: **370 xanh, 22 vàng, 0 đỏ** (trước 363/29/0).
  - 22 tên còn vàng **cần chủ dự án cho thông số**: dòng Must (14 tên, chưa rõ cấu hình chuôi), Must Cue Butt, ngọn Hornet, ngọn Crest, "Gậy Đánh Evo Lửa Việt", "Gậy phá nhảy chia 2 màu", "Gậy thuê 12.5 tip da lợn", 2 tên KOMET Break Shaft (ren lấy theo mặc định dòng).
- **Phần 2 – thẻ "Thời gian làm hết phần đơn còn lại"** (`quy-trinh-web.html`: `dhThoiGian`, `dhVeThoiGian`, `dhDoiNL`; `dhTinh` thêm `goc`):
  - P = sản lượng/tháng ÷ ngày làm/tháng (mặc định 9.000 ÷ 26, sửa được trên web, chỉ trong phiên);
  - f = đơn vị qua xưởng / 1 sản phẩm, từ cơ cấu "còn thiếu" của đơn mở (`goc`);
  - Ngày (nhịp nay) = còn làm ÷ (P × f); Ngày (năng lực xưởng) = nhịp nay × 100 ÷ `toiDa` của xưởng (= còn làm × giờ chuẩn/đơn vị ÷ (người có mặt × 8 × 85%));
  - Giờ chuẩn cần = nhịp nay × giờ chuẩn/ngày (nhật ký); Công = giờ ÷ (8 × 85%);
  - Nút thắt = xưởng có ngày năng lực lớn nhất; xưởng có < 50% dòng đơn ghi số "đã qua" → nhãn "ít số ghi".
  - Số thật (đơn 31/10, nhật ký 29 ngày): nút thắt **Ngọn Tip ~32 ngày nhịp nay / ~35 ngày năng lực**; Phôi Carbon / Phôi Thô ~24–25; Sơn ~17. Gần như mọi xưởng "ít số ghi" nên số ngày là trần trên.
- **Chuyên gia `quan-ly-van-hanh`:** cảnh báo f lấy từ cơ cấu đơn làm số ngày nhịp nay gần bằng nhau (chênh chủ yếu do số "đã qua"); khuyên dùng sản lượng thực từng xưởng (nhật ký không có số "đơn vị/xưởng" sạch vì mỗi xưởng nhiều công đoạn → chưa làm), tính giờ trực tiếp (cột năng lực đã tương đương), nói rõ xưởng sau không xong trước xưởng trước, và nhắc ghi cột "đã qua". Đã thêm 2 câu nhắc + nhãn "ít số ghi".
- **Bung mã BTP chính xác (60… / S… / Ngọn…): chưa làm** – chưa có bảng ánh xạ 4 thông số → mã BTP; hiện nhóm theo loại chuôi / ngọn / tip / ren. Chuyên gia đồng ý giữ.
- **Kiểm thử:** `don-hang.js` 46, `quy-trinh-web.js` 43 (tự tính lại công thức bảng, sửa sản lượng gấp đôi → ngày giảm nửa), `quy-trinh.js` 50, `manh-web.js` 8, `ky-nang.js` 49; `bao-mat.js` 2 lỗi cũ (ngày đã duyệt, không liên quan).

## Yêu cầu đợt 3 (01/11) – ĐÃ LÀM (xem mục "Đã làm đợt 3" bên dưới)
Chủ dự án giao (2 tin nhắn, muốn làm trong 1 lượt, **phân tích trước khi làm**):
1. **Tab Đơn hàng riêng** (dưới tab Quy trình), đọc thông tin **giống web app đơn hàng** đang hiển thị + thêm thống kê → phải sửa mã nguồn cho chủ dự án theo dõi được.
2. **Lưu đồ sản xuất khó nhìn** → tìm cách thể hiện khác; **thiếu lưu đồ toàn nhà máy**.
3. **Nhánh POM:** xưởng Ngọn Taro cấp vật liệu POM các loại cho xưởng Phôi Thô.
4. **Cân bằng tải** phải thể hiện **số nhân sự cần của mỗi xưởng** để đáp ứng tổng sản lượng yêu cầu.
5. **Rà toàn bộ công đoạn các xưởng, gộp nhóm công đoạn giống nhau** để lưu đồ dễ xem; **tư vấn gộp công đoạn** để bớt số công đoạn ở xưởng quá nhiều công đoạn.
6. **Việc theo xưởng:** khi phân phối, tổng hợp theo nhóm **chuôi / chuôi nhảy / ngọn**.
7. **Kiểm phân loại:** chia nhóm **gậy đánh / gậy nhảy / gậy phá**; ngọn lẻ cũng chia **đánh / nhảy / phá**; trong mỗi nhóm xếp **full carbon → mix carbon+glassfiber → glassfiber**.
8. **Quy tắc chung:** luôn rà logic để sắp xếp theo cách dễ nhìn, dễ theo dõi, dễ tổng hợp nhất (đã ghi vào CLAUDE.md + Quyết định).
9. **Sau khi xong 1–7 sẽ bàn:** cách thu thập dữ liệu các xưởng đã làm / đã xuất bán thành phẩm để theo dõi tiến độ Việc theo xưởng (đơn đang ở dạng BTP rải rác mọi xưởng, có hỏng hủy qua từng xưởng); phải cân nhắc độ phức tạp, thời gian nhập liệu lần đầu và hằng ngày. Claude suy nghĩ + hỏi chuyên gia rồi tư vấn.

## Đã làm đợt 3 (01/11)
- **Quyết định chủ dự án (4 câu hỏi):** tab Đơn hàng chỉ chủ sở hữu, có "Thay đổi hôm nay"; mục tiêu theo **sp/tháng** (9.000, 26 ngày, sửa được); gộp công đoạn **chỉ để xem + tư vấn**; **Phá nhảy là nhóm riêng**.
- **A. Kiểu gậy + chất liệu** (`don-hang.gs`: `plKieu_`, `PL_KIEU`, `PL_VL`, `PL_VL_NGON`, `PL_VL_CHUOI`; `plPhanLoai_` bọc `plPhanLoai0_`): kiểu Đánh / Nhảy / Phá / Phá nhảy (chuôi PHANHAY → phá nhảy; ngọn *PHA, chuôi GF736DP/MIXCBPHA → phá; ngọn/chuôi NHAY → nhảy); chất liệu FC / MIX / GF (GF vỏ carbon, G750 bọc carbon, nhảy 13.9 GF lõi vỏ carbon = MIX; chuôi lẻ theo chuôi). Đơn thật: gậy đánh FC 2.331 / MIX 1.527 / GF 3.419, nhảy 1.077, phá 773, phá nhảy 818.
  - Việc theo xưởng: nhóm cố định **Chuôi / Chuôi nhảy / Ngọn** (xưởng ngọn: Ngọn đánh/nhảy/phá/phá nhảy; HT/ĐG: Gậy đánh/…/Ngọn lẻ/Chuôi lẻ/Tay nối), trong nhóm FC → MIX → GF, dòng tổng nhóm (`DH_KHOI`, `dhKhoiSKU`, `dhKhoiChuoi`).
  - Kiểm phân loại: nhóm theo kiểu → chất liệu → chưa chắc lên đầu; nút "Chỉ xem tên chưa chắc".
- **B. Nhánh POM + ngọn lẻ** (`QT_XUONG_NHAP` thêm NGONTARO→PHOITHO "POM…", NGONTIP→DG; `QT_XUONG_THEM` tự bổ sung vào bản đã lưu; `qtLuongCap_`: luồng cấp vật liệu không tính vòng lặp).
- **Nhóm công đoạn** (`QT_NHOM` theo mẫu tên không dấu, `QT_NHOM_NHANH`, `qtNhomCD`, `qtGomNhom`): mọi công đoạn vào đúng 1 nhóm, không còn "Khác"; chỉ để xem.
- **F. Lưu đồ làm lại** (chủ dự án chê bản làn bơi đầu "quá xấu, khó nhìn"; chuyên gia `soat-giao-dien-cuoi` chỉ lỗi: ô trống, viền đỏ khắp nơi, thẻ cao rỗng, chữ gãy):
  - Toàn nhà máy (`qtVsm`, `qtOXuong`): lưới 6 cột – thân chung Phôi Carbon, Phôi Thô → rẽ chuôi (Sơn, In UV) / ngọn (Ngọn Taro, Ngọn Tip) → nhập lại Hoàn thiện, Đóng gói; CNC + POM là nút cấp phụ viền đứt; thẻ: tên, "có/cần người · −thiếu", huy hiệu tải. Điện thoại: thân chung → 2 cột Chuôi | Ngọn → nhập lại.
  - Từng xưởng (`qtLanBoi`, `qtHangNhom`): danh sách bước đánh số 1→n (cùng bước khác nhánh: dòng "└"), cột Nhánh / CĐ / Người (đang làm/cần) / Biết / Tải; bấm dòng mở công đoạn con; ngoài dòng chảy để cuối, mờ.
  - Quy tắc màu: viền trung tính, màu chỉ ở huy hiệu % (`qtBd`: ≤85 xám, 86–100 vàng, >100 đỏ), **chỉ nút thắt** có sọc cam + nhãn; "1 người biết" = chữ ⚠ vàng. Sơ đồ SVG kiểu cũ vẫn có trong mục gập.
- **Lưu đồ bản 3 – hiệu ứng** (01/11 tối; chủ dự án gửi ảnh mẫu 9 xưởng nhưng chọn **không dùng ảnh**, làm đẹp đường line + card, cả 2 lưu đồ, điện thoại bỏ lưu đồ):
  - Toàn nhà máy: thẻ kính (`qtOXuong`, biểu tượng SVG từng xưởng `QT_IC`, thanh tải 3px đáy thẻ, nút thắt viền cam sáng nhấp `qtNut`); đường nối cong **vẽ bằng SVG đo vị trí thật** (`qtVeDuong`, gọi trong `qtSauVe` sau mỗi lần vẽ + khi đổi cỡ cửa sổ): 8 đường xanh phát sáng có chấm chạy (`qtChay`), 2 đường cấp phụ cam đứt nét (CNC → Ngọn Tip "TIP, PHÍP"; Ngọn Taro → Phôi Thô "POM").
  - Từng xưởng: trục thời gian dọc (`.qt-tl`, đường sáng + đốm chạy `qtTroi`), số bước trong vòng tròn phát sáng, bước con chấm nhỏ, nút thắt vòng cam.
  - Điện thoại (≤ 640px): ẩn lưu đồ, hiện dòng "Lưu đồ chỉ hiện trên máy tính" + bảng số. Giảm chuyển động → tắt hiệu ứng. Giao diện sáng có màu riêng.
- **Sửa theo `bao-mat-ung-dung` (01/11):** không lỗi nặng; đã sửa: mảnh bản chụp có tiền tố `~` (không thành công thức), khóa dòng trùng đánh số `#2` (`dhKhoaDs_`), `qtLuongCap_` chỉ miễn đúng luồng NGONTARO→PHOITHO, `qtLuongCu_` chỉ bổ sung luồng mới cho bản lưu trước 01/11, `esc` trạng thái cũ, chia 0 ở xu hướng, thiếu cột "Còn thiếu" → đặt − đã trả, `qtThuTuX` bỏ luồng POM.
- **C. Cân bằng tải theo sp/tháng** (`qtMT`, `qtSlNay`, `qtSlNayDo`, `QT_CD_DONGGOI`): ô Sản lượng yêu cầu (sp/tháng), Ngày làm/tháng, Hiện nay làm (sp/ngày, để trống = tự đo theo đóng gói thành phẩm + đóng đơn lẻ, ~368/ngày ≈ 9.570/tháng kỳ 31/10). Mục tiêu % = (sp/tháng ÷ ngày) ÷ nhịp hiện nay. Lưu vào `QT_CAI_DAT` (slThang, ngayThang, slNay). Bảng thêm **Thiếu (+)/thừa (−)** và **Cần trong danh sách** (= cần có mặt ÷ tỷ lệ đi làm). Kết luận: "Để làm 9.000 sp/tháng cần ~N người có mặt – thiếu ~K".
- **D. Tab Đơn hàng riêng** (menu Sản xuất, dưới Quy trình; `vDH` trong Index mục 36, chung mảnh QuyTrinh.html; `dhTrangVe`):
  - 6 thẻ tổng (đơn theo mã, SL, đang SX, sẵn sàng/đã giao, trễ, còn thiếu); lọc mã/tên, kênh, trạng thái, ngày đặt; Xuất Excel (SheetJS), In / PDF (cửa sổ in).
  - Chế độ: **Đơn cần chú ý** (mặc định; trễ ≤30 ngày / sắp ≤3 ngày / nguy cơ = còn ngày < thiếu÷60+2, như web app đơn hàng), Chi tiết (bấm tiêu đề sắp xếp), Gom theo đơn, **Thay đổi hôm nay**, **Thống kê** (nhóm hàng × chất liệu, lịch giao 14 ngày, tuổi đơn, theo kênh, xu hướng còn thiếu), Việc theo xưởng (thẻ thời gian làm hết đơn dùng chung ô sp/tháng), Kiểm phân loại.
  - Máy chủ: `dhDocTab_` thêm cột Có thể giao, Đã trả khách, Loại phôi, Chú thích; `dhMaDon_` (người đặt + ngày đặt từ mã, deadline trước ngày đặt → năm sau); cache `DH_DON_v2`.
  - Bản chụp: sheet ẩn `DonHangChup` (Ngay | Phan | DuLieu, mảnh 40.000 ký tự, giữ 30 ngày) – `dhChup_`, `dhDocChup_`; chụp lúc 9h trong `snapshotKPIHangNgay` (vá ở `va-don-hang.py`, gọi `chupDonHangHangNgay_`) + lần đầu mở tab trong ngày. `layThayDoiDon` so với bản chụp gần nhất trước hôm nay: mới / còn thiếu giảm / tăng / trạng thái / deadline / SL / không còn; trả `lichSu` cho xu hướng.
  - Chưa có: tỷ lệ giao đúng hạn (Sheet đơn không có ngày giao thực tế).
- **Kiểm thử:** `don-hang.js` 62, `quy-trinh.js` 54, `quy-trinh-web.js` 63, `manh-web.js` 8, `ky-nang.js` 49; `bao-mat.js` 2 lỗi cũ (ngày đã duyệt). Giả lập thêm `getDisplayValues`, `hideSheet`.
- Kích thước: Index ~826 KB, QuyTrinh.html ~98 KB, Code.gs ~521 KB.

## Yêu cầu đợt 4 (01/11 khuya) – đang làm
1. Lưu đồ từng xưởng vẽ theo kiểu lưu đồ toàn nhà máy (thẻ kính + đường nối cong), nhóm công đoạn chỉ để vẽ.
2. Thêm luồng CNC → Sơn: "đầu gậy lết".
3. Gửi bảng Excel đầy đủ cấu hình gậy (dòng gậy, 4 thông số, tên gọi) + 22 tên vàng để chủ dự án điền.
4. Cách A: bước xuất mỗi xưởng (Claude chọn sẵn, sửa trên web) → sản lượng ra/ngày từ nhật ký KPI → ngày làm hết việc theo nhịp thực.
5. Trả lời: quy trình từng xưởng là bản nháp Claude tự soạn (nguồn: tên công đoạn, định mức, file chủ dự án gửi) – chủ dự án thấy vài chỗ sai → gửi bảng quy trình nháp để sửa.

## Việc tiếp theo
- Chủ dự án xem bản thật, chỉnh nháp (thứ tự, nhánh) rồi Lưu. Cho thông số 22 tên hàng vàng (hoặc sửa tay ở "Kiểm phân loại").
- Nếu chủ dự án gửi bảng ánh xạ → bung mã BTP 60… / S… / Ngọn…; đề xuất các bộ phận ghi số "đã qua" vào Sheet đơn (hoặc lấy từ nhật ký KPI).
- Giai đoạn 2: gắn máy với công đoạn để tính giới hạn máy; theo dõi tồn bán thành phẩm; mở cho TP/PP xem / sửa xưởng mình (hỏi lại quyền).
