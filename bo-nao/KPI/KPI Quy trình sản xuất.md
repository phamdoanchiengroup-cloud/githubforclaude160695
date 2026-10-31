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
- **Số liệu thật 25/9–24/10:**
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
- **Kiểm thử:** `tests/quy-trinh.js` 45 (cần `DATA=`), `tests/quy-trinh-web.js` 31 (`F=` bản xem thử; `CHUP=` để chụp ảnh). `tao-ban-xem-thu.js` đã nạp thêm QuyTrinh.html.

## Việc tiếp theo
- Chủ dự án xem bản thật, chỉnh nháp (thứ tự, nhánh) rồi Lưu.
- Giai đoạn 2: gắn máy với công đoạn để tính giới hạn máy; theo dõi tồn bán thành phẩm; mở cho TP/PP xem / sửa xưởng mình (hỏi lại quyền).
