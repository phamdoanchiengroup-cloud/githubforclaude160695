# Thái Ất Thần Kinh – đề xuất mục mới "Thái Ất" cho 4 phạm vi (21/11/2026, chờ chủ dự án duyệt)

Người soạn: Claude (phiên nghiên cứu). **Chưa viết mã, chưa commit.** Căn cứ trong repo: `nghien-cuu/ky-mon/00-de-xuat.md` (mẫu cách viết), `nghien-cuu/ra-soat/07-ban-le-9-19.md` (chuẩn 9/19 xu), `tuvi-app/KyMon.gs` (`kmKinhDoMatTroi_`, `kmTietKhiNam_`), `Lunar.gs` (`solarToLunar`, `jdFromDate`), `BatTu.gs` (`batTuLap_`, can chi ngày giờ). Nguồn ngoài chỉ dùng để học thuật toán. Thư viện chính (kintaiyi) có giấy phép MIT. Các repo không có giấy phép thì chỉ đọc mô tả, không đọc mã.

## Tóm tắt 6 dòng
1. Thái Ất là môn lớn nhất trong "tam thức" (Thái Ất, Kỳ Môn, Lục Nhâm). Nó vốn xem **thời cuộc theo năm**: khí thế chung, bên chủ động hay bên giữ thế có lợi. Mệnh pháp cá nhân và Thời kế (xem theo giờ) là hai nhánh phụ.
2. Nguồn chính là **kintaiyi** (Python, **MIT**, có đủ Tuế/Nguyệt/Nhật/Thời/Phân kế và mệnh pháp). Đối chiếu với **Thái Ất Kim Kính Thức Kinh** (sách đời Đường, phạm vi công cộng, có trên Wikisource) và trang tóm tắt tianyugong.com.
3. Chọn trường phái **Thái Ất Thống Tông**: tích niên = **10.153.917 + năm dương lịch**. Với Tuế kế, phép Kim Kính (1.936.557 + năm) cho **cùng cục số** (hai hằng số chênh nhau đúng bội của 360). Hai phép chỉ khác ở Ngũ Phúc và Đại Du.
4. Tôi tự viết lại quy tắc bằng một đoạn mã kiểm tra riêng (ở scratchpad, không đưa vào repo). Mã này dựng lại các bảng 72 cục của kintaiyi: **421/432 giá trị Chủ/Khách/Định toán khớp** và 70/72 giá trị Thủy Kích khớp. Chỗ lệch đều là lỗi gõ trong bảng của kintaiyi (mục 4c). Vậy nên **tính theo quy tắc, không chép bảng**.
5. Bán: miễn phí "bàn + 1 câu" cho cả 4 phạm vi; 9 xu cho "một câu hỏi nhỏ"; 19 xu cho "cả năm/cả đời". Riêng thời cuộc chung nên để **miễn phí, giọng thận trọng**, vì có rủi ro pháp lý khi nói về quốc gia, thiên tai, chiến tranh.
6. Công sức khoảng **L**: tính toán cỡ M, văn luận cỡ L. Có **12 điểm cần chủ dự án quyết** (mục 8). Lớn nhất là nên bán Thái Ất thành mục riêng hay gộp làm "góc nhìn thứ 7" trong các phần năm đang bán.

---

## 1. Thái Ất là gì, khác 6 hệ và Kỳ Môn ở đâu

Nói đơn giản: người xưa vẽ một vòng **16 ô quanh 1 ô giữa**. 16 ô gồm 12 hướng chi (Tý, Sửu…) và 4 góc (Càn, Khôn, Cấn, Tốn). Một vị thần chủ là **Thái Ất** đi chậm qua 8 cung, mỗi cung 3 năm, không vào cung giữa. Quanh Thái Ất có hai "con mắt":
- **Văn Xương** là mắt của phía Chủ (bên giữ thế, bên ở nhà);
- **Thủy Kích** là mắt của phía Khách (bên chủ động, bên đến).

Từ vị trí hai con mắt tới Thái Ất, ta cộng số các cung đi qua, được **Chủ toán** và **Khách toán**. Từ hai số đó ra các "tướng". Cuối cùng xét các thế đè, ép, vây, đối mặt giữa tướng và Thái Ất để biết bên nào thuận.

| | Tử Vi, Bát Tự… (6 hệ) | Kỳ Môn (đã đề xuất) | Thái Ất |
|---|---|---|---|
| Câu hỏi gốc | "Tôi là người thế nào, đời tôi ra sao" | "Việc này làm giờ nào, hướng nào" | "**Thời thế đang nghiêng về ai**: bên chủ động hay bên giữ thế; năm/tháng/giờ này êm hay động" |
| Đơn vị thời gian | Đời, 10 năm, năm, tháng | Giờ | **Năm** (gốc), tháng, ngày, giờ |
| Đầu vào | Ngày giờ sinh | Thời điểm hỏi | Thời điểm (thời cuộc, hỏi việc) **hoặc** ngày giờ sinh (mệnh pháp) |
| Điểm bán | Tự hiểu mình | Quyết định nhanh | **Bức tranh lớn**: năm 2027 là năm "nên tiến" hay "nên giữ"; tôi nên đóng vai chủ động hay phòng thủ |

Hệ quả cho sản phẩm: Thái Ất **không nên** cạnh tranh với Tử Vi ở phần "tính cách". Thế mạnh riêng của nó là **chiến lược**, tức "năm nay nên tấn hay thủ". Đó là góc mà 6 hệ đang có chưa nói.

## 2. Nguồn, giấy phép và trường phái

### 2a. Mã nguồn tìm được (tìm trên GitHub các từ khóa `kintaiyi`, `taiyi`, `taiyishenshu` và tên chữ Hán của môn)

| Repo | Giấy phép | Phạm vi | Ghi chú dùng được không |
|---|---|---|---|
| [kentang2017/kintaiyi](https://github.com/kentang2017/kintaiyi) (PyPI [kintaiyi 0.2.3](https://pypi.org/project/kintaiyi/)) | **MIT** (©2023–2026 kentang2017) | Tuế, Nguyệt, Nhật, Thời, Phân kế + mệnh pháp. 4 phép tích niên: Thống Tông, Kim Kính, Đào Kim Ca, Thái Ất Cục | **Dùng được** để học và đối chiếu. Nếu chép mã hay bảng thì phải ghi bản quyền MIT. Đã đọc `src/kintaiyi/kintaiyi.py` và `config.py`. **Không** mở `data.pkl` (file pickle chạy được mã, không an toàn, cũng không cần). |
| [zolagz/kintaiyi](https://github.com/zolagz/kintaiyi) | không có | chỉ Thời kế | Bản sao cũ. Không dùng. |
| [vortexheinz/kintaiyi](https://github.com/vortexheinz/kintaiyi), `kintaiyi-master` | không có | – | Bản sao. Không dùng. |
| [hackninety/python-taiyi](https://github.com/hackninety/python-taiyi) | không có | API bọc kintaiyi | Không dùng (cũng chỉ là kintaiyi). |
| [wlhyl/taiyipython](https://github.com/wlhyl/taiyipython) | không có | lập bàn | Không có giấy phép, **không đọc mã**. |
| [hhszzzz/taibu](https://github.com/hhszzzz/taibu) | NOASSERTION (giấy phép riêng) | nhiều môn, có Thái Ất | Không đọc. |
| [heimu177/TaiYiShenShu-with-Bazi](https://github.com/heimu177/TaiYiShenShu-with-Bazi) | GPL-3.0 | HTML | Giấy phép "lây" sang mã của ta. **Tránh.** |
| [mood39/Taiyishenshu](https://github.com/mood39/Taiyishenshu) | không có | HTML | Không dùng. |

Không tìm thấy thư viện JavaScript nào có giấy phép rõ ràng. Muốn đối chiếu tự động thì phải chạy kintaiyi (Python) để sinh file ca kiểm thử JSON. Việc này làm trên máy kiểm thử, không đưa vào Apps Script (mục 4).

### 2b. Sách và trang tham khảo
- **Thái Ất Kim Kính Thức Kinh** (Vương Hy Minh, đời Đường, năm 724). Bản Tứ khố toàn thư trên Wikisource, phạm vi công cộng: [quyển 1](https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B9%99%E9%87%91%E9%8F%A1%E5%BC%8F%E7%B6%93_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B701), [quyển 2](https://zh.wikisource.org/zh-hant/%E5%A4%AA%E4%B9%99%E9%87%91%E9%8F%A1%E5%BC%8F%E7%B6%93_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B702). Đã xác nhận từ sách:
  - tích niên đến năm 724 là 1.937.281;
  - Thái Ất "dương độn khởi cung 1 đi thuận, âm độn khởi cung 9 đi nghịch, không vào cung giữa";
  - Văn Xương (sách gọi Thiên Mục) "khởi Vũ Đức, đi thuận 16 thần, gặp Âm Đức và Đại Vũ thì dừng thêm một bước";
  - Kế Thần "khởi cung Dần đi nghịch 12 chi";
  - Thủy Kích "đặt Kế Thần lên cung Hòa Đức, xem Văn Xương rơi vào đâu";
  - cách cộng toán có ví dụ "Thái Ất ở cung 9, Văn Xương ở Đại Nghĩa: 1 + 8 + 3 + 4 = 16";
  - "toán được 10 thì lấy 1";
  - cung 1 là Càn, 4 là Chấn, 6 là Đoài, 9 là Tốn.
- **Thái Ất Thống Tông Bảo Giám** (đời Nguyên–Minh), cũng phạm vi công cộng. Tôi chưa đọc trực tiếp; kintaiyi dẫn lại từ bản quét chữ của sách này. Hằng số 10.153.917 khớp với ví dụ năm 658 của kintaiyi (10.154.575 − 658). Một bài trên smxs.com (chỉ đọc được qua kết quả tìm kiếm, trang không tải được) cũng ghi "tích niên = 10153917 + năm dương lịch".
- [tianyugong.com/taiyi](https://tianyugong.com/taiyi/): tóm tắt quy tắc Quân/Thần/Dân Cơ, Ngũ Phúc, Đại Du, Tiểu Du, Tứ Thần, Thiên Ất, Địa Ất, Trực Phù, cách tính toán và tướng. Đây là nguồn thứ hai cho chu kỳ, điểm khởi và cách tính tướng.
- [Wikipedia: Taiyi shenshu](https://en.wikipedia.org/wiki/Taiyi_shenshu): bối cảnh chung.
- Sách tiếng Việt: *Thái Ất thần kinh* (NXB Văn hóa dân tộc, 2001, [hồ sơ thư mục](https://dc2.philarchive.org/rec/NGUTAT); tương truyền của Trạng Trình) và *Thái Ất dị giản lục* ([thư viện ĐH Hải Phòng](https://lib.hpu.edu.vn/handle/123456789/11545)). Đây là bản dịch còn bản quyền, tôi không đọc nội dung. Nếu chủ dự án có sách giấy thì nên dò tay 2–3 ca ở mục 5 (câu hỏi 8.10).

### 2c. So sánh trường phái và lựa chọn

| Trường phái (theo kintaiyi) | Hằng số tích niên (cộng năm dương lịch) | Tuế kế | Thời kế | Nhận xét |
|---|---|---|---|---|
| **Thống Tông** | 10.153.917 | cục = tích % 72 | tích giờ nối liên tục: ngày Giáp Tý giờ Tý = cục 1, mỗi giờ +1 cục | Phổ biến nhất (kintaiyi, smxs, tianyugong cùng dùng). Quy tắc đều, dễ lập trình, dễ kiểm. |
| Kim Kính | 1.936.557 | **cùng cục với Thống Tông** (chênh 8.217.360 = 360 × 22.826) | đổi riêng: cục = tích giờ % 60 − 30, Thái Ất "3 giờ dời 1 cung" | Sách gốc cổ nhất. Thời kế của nó lạ, ít người dùng. Ngũ Phúc, Đại Du lệch với Thống Tông vì các chu kỳ 225 và 288 không chia hết số chênh. |
| Đào Kim Ca | 10.154.193 | lệch Thống Tông 276 năm (cục khác hẳn) | – | Ít nguồn. |
| Thái Ất Cục | 10.153.917 | như Thống Tông | tính cục từ can chi ngày | Biến thể. |

**Chọn: Thống Tông** cho cả 4 kế, vì:
1. Có ít nhất 2 nguồn cho hằng số và quy tắc (kintaiyi, bài smxs, tianyugong).
2. Tuế kế trùng hẳn với Kim Kính (sách gốc), nên phần quan trọng nhất (năm) không phụ thuộc lựa chọn.
3. Thời kế là một chuỗi đều mỗi giờ +1 cục. Kiểm thử dễ và không cần bảng phụ.

Ngũ Phúc và Đại Du thì hiện theo Thống Tông, có ghi chú "phái khác cho kết quả khác" (câu hỏi 8.3).

## 3. Thuật toán từng bước (cho người lập trình; file mới đề xuất `ThaiAt.gs`)

### 3a. Quy ước chung
- **Vòng 16 ô**, đi thuận theo thứ tự: Tý, Sửu, Cấn, Dần, Mão, Thìn, Tốn, Tỵ, Ngọ, Mùi, Khôn, Thân, Dậu, Tuất, Càn, Hợi (chỉ số 0–15).
- **8 cung chính** và số của cung theo Thái Ất (không phải số Lạc Thư): Càn 1, Ly (ô Ngọ) 2, Cấn 3, Chấn (ô Mão) 4, Trung 5, Đoài (ô Dậu) 6, Khôn 7, Khảm (ô Tý) 8, Tốn 9.
- **8 ô xen giữa (gọi là gian thần)**: Sửu, Dần, Thìn, Tỵ, Mùi, Thân, Tuất, Hợi. Khi xét "cùng cung" cho cách cục, mỗi gian thần thuộc cung **đứng ngay sau nó** theo chiều thuận: Hợi→Khảm, Sửu→Cấn, Dần→Chấn, Thìn→Tốn, Tỵ→Ly, Mùi→Khôn, Thân→Đoài, Tuất→Càn. Đây là bảng `gong2` của kintaiyi; chưa có nguồn thứ hai.
- **Tên 16 thần** (dùng khi hiện "Văn Xương ở thần nào"): Tý Địa Chủ, Sửu Dương Đức, Cấn Hòa Đức, Dần Lữ Thân, Mão Cao Tùng, Thìn Thái Dương, Tốn Đại Quýnh, Tỵ Đại Thần, Ngọ Đại Uy, Mùi Thiên Đạo, Khôn Đại Vũ, Thân Vũ Đức, Dậu Thái Thốc, Tuất Âm Chủ, Càn Âm Đức, Hợi Đại Nghĩa. Khớp hai nguồn: ví dụ cộng toán trong sách Kim Kính và bảng của kintaiyi.
- Các phép "chia lấy dư" dưới đây dùng **dư 1-gốc**: `r1(x, m) = x % m`, nếu bằng 0 thì lấy `m`. Cách này khớp với các bảng của kintaiyi và cách đếm "toán ngoại" (đếm luôn ô khởi) của sách cổ.

### 3b. Tích số cho từng kế (theo Thống Tông)
`Y` = năm âm lịch, tức năm chứa ngày cần xem sau Tết (kintaiyi dùng năm âm; có phái dùng Lập xuân, xem câu hỏi 8.4).

| Kế | Tích số | Âm/dương độn | "Thái tuế" của kế |
|---|---|---|---|
| Tuế kế (năm) | `T = 10153917 + Y` | luôn **dương** | chi năm |
| Nguyệt kế (tháng) | `T = (10153917 + Y − 1) × 12 + 2 + m`, trong đó `m` là tháng âm 1–12 (+2 vì kỷ nguyên bắt đầu từ tháng Tý) | luôn dương | chi tháng (tháng 1 = Dần) |
| Nhật kế (ngày) | `T` = số ngày tính từ kỷ nguyên, chỉnh cho `T % 60` bằng thứ tự can chi ngày (1 = Giáp Tý). Kintaiyi lấy mốc 19/6/1900 với hằng số 708.011.105 − 185, rồi cộng phần chỉnh mod 60 | kintaiyi để dương; nhiều sách chia theo Đông chí/Hạ chí | chi ngày |
| Thời kế (giờ) | `T = (D − 1) × 12 + g`, với `D` là số ngày tích (đồng dư với thứ tự can chi ngày 1–60) và `g` là thứ tự giờ (Tý 1 … Hợi 12). Kintaiyi: `D = 708011105 + số ngày từ 21/12/1900`. Ngày 21/12/1900 là ngày Mậu Thìn, và 708011105 % 60 = 5, nên khớp thứ tự can chi. | **Từ Đông chí đến trước Hạ chí: dương; từ Hạ chí đến trước Đông chí: âm** (lấy theo `kmTietKhiNam_`) | chi giờ |

Rút gọn cho Thời kế (tương đương, đã thử 5 ca): **`cục = r1((thứ tự can chi ngày, 0–59) × 12 + (thứ tự chi giờ, 0–11) + 1, 72)`**. Ngày Giáp Tý giờ Tý là cục 1; cứ 6 ngày hết một vòng 72 cục. Giờ Tý muộn (23–24h) tính sang ngày hôm sau, giống `batTuLap_` (quyết định 1/11).

Nhật kế không thuộc 4 phạm vi chủ dự án chọn. Làm sau, vì cách chỉnh mod 60 của kintaiyi chưa có nguồn thứ hai.

### 3c. Cục số và "nguyên, kỷ"
- **`cục = r1(T, 72)`** cho mọi kế, ghi kèm "dương độn"/"âm độn". Có 72 cục dương và 72 cục âm.
- Ba "tầng" của cục (lý thiên, lý địa, lý nhân) xoay vòng 1-2-3 theo cục. Kỷ (1–6) = phần nguyên của `(T % 360) / 60` cộng 1; nguyên (5 nguyên Giáp Tý, Bính Tý…) = vị trí trong vòng 360 chia 72. Chỉ để hiện thông tin, không ảnh hưởng tính toán.

### 3d. Thái Ất
- Mỗi cung 3 cục (3 năm), 8 cung, không vào cung 5, một vòng 24.
- `q = floor((r1(cục, 24) − 1) / 3)` (0–7).
  - Dương độn: cung = `[1, 2, 3, 4, 6, 7, 8, 9][q]` (bắt đầu Càn).
  - Âm độn: cung = `[9, 8, 7, 6, 4, 3, 2, 1][q]` (bắt đầu Tốn, đi nghịch).
- Số năm đã ở cung = `r1(cục, 3)` (1, 2, 3). Hiện thêm câu "Thái Ất vào cung này năm thứ 2/3".
- Nguồn: sách Kim Kính quyển 1, tianyugong, kintaiyi (3 nguồn khớp).

### 3e. Văn Xương (Thiên Mục, mắt phía Chủ)
- Vòng 18 bước. Khởi Vũ Đức (Thân) đi thuận 16 ô, **dừng 2 lần ở Càn và Khôn**:
  - Dương: `Thân Dậu Tuất Càn Càn Hợi Tý Sửu Cấn Dần Mão Thìn Tốn Tỵ Ngọ Mùi Khôn Khôn`
  - Âm (khởi Lữ Thân ở ô Dần, dừng 2 lần ở Tốn và Cấn): `Dần Mão Thìn Tốn Tốn Tỵ Ngọ Mùi Khôn Thân Dậu Tuất Càn Hợi Tý Sửu Cấn Cấn`
- Văn Xương = phần tử thứ `r1(cục, 18)` của dãy.
- Nguồn: Kim Kính quyển 1 cho phần dương; tianyugong và kintaiyi cho cả hai.

### 3f. Kế Thần, Hợp Thần, Thái tuế
- Thái tuế = chi của kế (bảng 3b). Kiểm tra: với cục `k`, chi phải bằng chi thứ `r1(k, 12)` tính từ Tý. Cả 4 kế đều thỏa (đã thử).
- **Kế Thần**: dương độn khởi Dần đi nghịch 12 chi theo Thái tuế, nên `Kế = chi[(2 − tuế) mod 12]` (Tý→Dần, Sửu→Sửu, Dần→Tý, Mão→Hợi…). Âm độn khởi Thân: `Kế = chi[(8 − tuế) mod 12]`. Phần dương có sách Kim Kính và tianyugong; phần âm chỉ có kintaiyi, cần dò thêm.
- **Hợp Thần** = chi lục hợp của Thái tuế: `chi[(1 − tuế) mod 12]` (Tý↔Sửu, Dần↔Hợi, Mão↔Tuất, Thìn↔Dậu, Tỵ↔Thân, Ngọ↔Mùi). Có sách Kim Kính, kintaiyi.

### 3g. Thủy Kích (mắt phía Khách)
- **Thủy Kích = Văn Xương dời đi một khoảng bằng (Cấn − Kế Thần) trên vòng 16 ô.** Tức là xoay vòng sao cho Kế Thần đè lên Cấn (Hòa Đức), rồi xem Văn Xương rơi vào ô nào.
- Công thức: `idx(TK) = (idx(VX) + idx(Cấn) − idx(Kế)) mod 16`.
- Nguồn: Kim Kính quyển 2, tianyugong; khớp bảng kintaiyi 70/72 cục.

### 3h. Định mục (dùng cho Định toán)
- **Định mục = Văn Xương dời đi một khoảng bằng (Thái tuế − Hợp Thần) trên vòng 16 ô.** Nghĩa là đặt Hợp Thần lên ô Thái tuế, xem Văn Xương rơi vào đâu.
- Nguồn: tianyugong ("năm kế đưa Hợp Thần về Thái tuế, tháng về nguyệt kiến, giờ về chi giờ"), kintaiyi. Khớp bảng.

### 3i. Chủ toán, Khách toán, Định toán
Hàm `toan(ô khởi, cung Thái Ất)`:
1. Nếu ô khởi là cung chính và **chính là cung Thái Ất**: toán = số cung Thái Ất.
2. Nếu ô khởi là gian thần: bắt đầu với 1, rồi bước sang ô kế tiếp.
3. Đi thuận vòng 16 ô. Gặp cung chính thì cộng số cung, gặp gian thần thì bỏ qua. **Dừng khi tới cung Thái Ất (không cộng cung này).**
4. Nếu kết quả bằng 0 thì lấy 1.

Từ đó: **Chủ toán** = `toan(Văn Xương)`, **Khách toán** = `toan(Thủy Kích)`, **Định toán** = `toan(Định mục)`. Số lớn nhất là 40, tức 1 + 8 + 3 + 4 + 9 + 2 + 7 + 6.
- Ví dụ trong sách Kim Kính: Thái Ất cung 9, Văn Xương ở Hợi → 1 + Khảm 8 + Cấn 3 + Chấn 4 = 16. Quy tắc trên cho đúng 16.
- Đối chiếu bảng `yangcal`/`yingcal` của kintaiyi: khớp **421/432** (mục 4c).

### 3j. Đại tướng và tham tướng
- **Đại tướng** = chữ số hàng đơn vị của toán. Nếu toán là 10, 20, 30 hay 40 thì **lấy 1** (sách Kim Kính: "toán được 10 thì lấy 1").
  - Có 2 phái khác: tianyugong lấy toán chia 9 lấy dư, nên 20→2, 30→3, 40→4; kintaiyi lấy 1 cho chủ nhưng 5 cho khách (không nhất quán).
  - Chọn: 10→1; 20/30/40 cần chủ dự án quyết (câu hỏi 8.5), đề xuất cũng lấy 1 theo sách gốc.
- **Tham tướng** = (đại tướng × 3) lấy hàng đơn vị; nếu ra 0 thì lấy 5. Ba nguồn khớp.
- Tướng = 5 nghĩa là ở **cung giữa**. Có phái nói tướng ở giữa thì "không xuất trận" (không hành động). Ghi nhãn "tướng ở giữa: giữ, chưa ra tay".
- Có 6 tướng: Chủ đại/tham, Khách đại/tham, Định đại/tham. Kế Thần đôi khi được gọi là tướng thứ 7.

### 3k. Các thần khác (năm kế; nguyệt và thời kế dùng cùng công thức với `T` của kế đó)

| Thần | Công thức | Nguồn khớp |
|---|---|---|
| **Quân Cơ** (vua, việc lớn) | `q = floor((r1(T+250, 360) − 1) / 30)`, chi = Ngọ + q (đi thuận 12 chi, 30 năm một chi) | tianyugong, kintaiyi (kintaiyi viết `//30 or 1` nên lệch 1 bước; xem 4c) |
| **Thần Cơ** (quan, người điều hành) | `q = floor((r1(T+250, 36) − 1) / 3)`, chi = Ngọ + q (3 năm một chi) | tianyugong, kintaiyi khớp |
| **Dân Cơ** (dân, người thường) | chi = Tuất + (r1(T+250, 12) − 1) (1 năm một chi) | tianyugong, kintaiyi khớp |
| **Ngũ Phúc** (phúc lớn) | `q = floor((r1(T+250, 225) − 1) / 45)`, cung = `[Càn, Cấn, Tốn, Khôn, Trung][q]` (45 năm một cung) | tianyugong, kintaiyi (lệch ở biên chia hết cho 45). Thống Tông và Kim Kính cho kết quả khác. |
| **Đại Du** (biến động lớn, xấu) | `q = floor((r1(T+34, 288) − 1) / 36)`, cung = `[7, 8, 9, 1, 2, 3, 4, 6][q]` (36 năm một cung, khởi Khôn) | tianyugong (trang ghi nhầm 388), kintaiyi (hàm `bigyo` lẫn lộn chỉ số). Cần dò thêm. |
| **Tiểu Du** | bằng Thái Ất của Tuế kế (khởi cung 1, 3 năm một cung) | tianyugong |
| **Tứ Thần, Thiên Ất, Địa Ất, Trực Phù** (bốn thần gây trở ngại) | cùng một vòng 12 vị trí, 3 năm một vị trí: `Càn, Ly, Cấn, Chấn, Trung, Đoài, Khôn, Khảm, Tốn, Tỵ, Thân, Dần`. `q = floor((r1(T, 36) − 1) / 3)`. Tứ Thần khởi Càn, Thiên Ất khởi Đoài, Địa Ất khởi Tốn, Trực Phù khởi Trung, rồi cùng tiến q bước. | kintaiyi (bảng `four_god`, `sky_yi`, `earth_yi`, `zhi_fu`). tianyugong cùng điểm khởi, cùng chu kỳ, nhưng viết vòng bằng 12 chi (Hợi thay Càn, Thìn thay Trung…). **Cần chủ dự án chọn** (câu hỏi 8.6). |

### 3l. Cách cục (xét trên 8 cung; ô gian thần quy về cung theo 3a)

| Cách | Điều kiện | Ý nghĩa cổ | Nói cho người đọc |
|---|---|---|---|
| **Yểm** (đè) | Thủy Kích cùng cung Thái Ất | bề dưới lấn bề trên, phía chủ yếu | "Năm/giờ có sức ép từ bên ngoài đè lên; người giữ thế dễ bị động" |
| **Tù** (giam) | Văn Xương, hoặc một tướng (trừ tướng 5), cùng cung Thái Ất | bị trói tay, khó làm chủ | "Có cảm giác bị kẹt, việc chính chưa xoay được" |
| **Bách** (ép sát) | Văn Xương, Thủy Kích, Định mục hoặc tướng ở **cung kề** Thái Ất (cung bách, chậm và nhẹ) hoặc **ô kề** (thần bách, nhanh và nặng); phía trước là ngoại, phía sau là nội | áp lực, tai họa đến gần | "Áp lực đến từ người ngoài/người trong nhà; nên chuẩn bị trước" |
| **Kích** (đánh) | Thủy Kích ở cung/ô kề Thái Ất (phía trước là ngoại kích, phía sau là nội kích) | bị công kích | "Dễ gặp chỉ trích, cạnh tranh trực diện" |
| **Cách** (ngăn) | Thủy Kích hoặc tướng khách ở **cung đối diện** Thái Ất (1↔9, 2↔8, 3↔7, 4↔6) | trên dưới không thông | "Ý hai bên không gặp nhau; cần người trung gian" |
| **Đối** (đối mặt) | Văn Xương ở cung đối diện Thái Ất | người thân tín hai lòng | "Cẩn thận với cam kết miệng; nên ghi rõ" |
| **Quan** (khóa) | hai tướng chủ và khách cùng một cung (trừ 5) | hai bên giằng co | "Thế giằng co, chưa ai thắng; đừng ép kết quả" |
| **Đề hiệp** (kẹp) | Văn Xương và Thủy Kích ở hai bên Thái Ất | quyền rơi vào tay người giữa | "Bạn bị kẹp giữa hai phía; giữ vị trí trung lập" |
| **Tứ quách cố** (bốn bề bị vây chặt) | Văn Xương tù Thái Ất **và** chủ đại tướng, chủ tham tướng cùng cung; hoặc Thủy Kích yểm **và** tướng khách cùng cung với tướng chủ | phải cố thủ, không nên làm gì | "Thời điểm để giữ, không phải để mở rộng" |
| **Tứ quách đỗ** (bốn bề bị chắn) | tương tự cố, nhưng tướng chủ và tướng khách ở thế đối nhau (kintaiyi chưa cài; sách Kim Kính chỗ này bị mất chữ) | bị bịt lối ra | "Lối ra tạm đóng; chờ thời" |

Kintaiyi tính "cung kề" theo thứ tự đi của Thái Ất (1→2→3→4→6…). Thứ tự này không phải kề nhau trên bàn, ví dụ cung 1 Càn và cung 2 Ly ở hai phía đối nhau. Đề xuất dùng **kề thật trên bàn**: hai cung chính liền nhau trên vòng 16 ô. Cách này khớp với nhãn cách cục của kintaiyi cho các cục 53, 54, 55 (mục 5). Cần chủ dự án duyệt (câu hỏi 8.7).

Khi không có cách xấu nào, bàn được gọi là **"âm dương hòa thuận"**, tức thế tốt (sách Kim Kính quyển 1).

### 3m. Ý nghĩa con số toán

| Loại | Điều kiện | Nghĩa | Nói đời thường |
|---|---|---|---|
| **Đoản toán** (toán ngắn), **vô thiên** (thiếu trời) | toán < 10 | sức yếu, trời không giúp | "Đà ngắn, làm nhanh gọn, đừng kéo dài" |
| **Vô địa** (thiếu đất) | hàng đơn vị < 5 | nền móng yếu | "Cần chuẩn bị nền (tiền, người, giấy tờ) trước" |
| **Vô nhân** (thiếu người) | hàng đơn vị = 0 | thiếu người hợp tác | "Thiếu người đồng hành; tìm đồng minh" |
| **Tam tài túc số** (đủ trời, đất, người) | toán > 10 và hàng đơn vị > 5 | đủ cả ba | "Đủ điều kiện; có thể tiến" |
| **Trường toán** (toán dài) | toán ≥ 10 (chưa có nguồn thứ hai cho ranh giới này) | đà dài | "Việc có sức bền" |
| Đơn dương / đơn âm (toán 1 chữ số) | lẻ 1, 3, 7, 9 / chẵn 2, 4, 6, 8 | dương lẻ: bất lợi cho bên đó | – |
| Trùng dương / trùng âm (toán 2 chữ số) | hai chữ số cùng lẻ / cùng chẵn | lệch, "không hòa" (Kim Kính quyển 2: toán dương được số lẻ là trùng dương, toán âm được số chẵn là trùng âm) | "Quá cứng / quá mềm; cần cân lại" |
| Thượng hòa, thứ hòa, hạ hòa | bảng `numdict` của kintaiyi (14, 18 là thượng hòa; 23, 29, 32 là thứ hòa; 12, 16, 27, 34, 38 là hạ hòa) | hòa hợp từ cao xuống thấp | "Thuận" |

**So chủ và khách** (lõi để luận):
- toán dài và đủ "tam tài" thì mạnh hơn;
- "khách lấy toán ít đi đánh toán nhiều thì chủ thắng" (kintaiyi, hàm "suy nhiều ít để đoán thắng thua");
- bên nào có tướng bị tù, bị bách, bị yểm thì yếu đi;
- tướng ở cung 5 thì bên đó "chưa ra tay".

Đề xuất chấm điểm rõ ràng như sau. Mỗi bên có 4 yếu tố: độ dài toán, tam tài, hòa/không hòa, tướng bị phạm. Mỗi yếu tố cho +1, 0 hoặc −1. Bên nào hơn ≥ 2 điểm thì "nghiêng rõ"; hơn 1 điểm thì "hơi nghiêng"; bằng nhau thì "giằng co".

### 3n. Mệnh pháp cá nhân (Thái Ất nhân đạo mệnh pháp, Thống Tông quyển 20 qua kintaiyi)
1. Lấy can chi năm, tháng (theo tiết), ngày, giờ sinh từ `batTuLap_`.
2. **Cung Mệnh**: đặt chi tháng sinh lên ô chi năm sinh (vòng 12 chi). Nam năm dương và nữ năm âm thì thiên bàn đi thuận; nam năm âm và nữ năm dương thì đi nghịch. Ô đất nằm dưới chi giờ sinh là cung Mệnh; ô dưới chi ngày sinh là **cung Thân**. Từ cung Mệnh xếp 12 cung (Mệnh, Huynh đệ, Thê thiếp, Tử tôn, Tài bạch, Điền trạch, Quan lộc, Nô bộc, Tật ách, Phúc đức, Tướng mạo, Phụ mẫu) theo cùng chiều. Hàm `life_body_palaces` của kintaiyi, chưa có nguồn thứ hai.
3. **Đặt các thần**: lấy bàn Tuế kế của năm sinh (cục, Thái Ất, Văn Xương, Thủy Kích, toán, tướng, Quân/Thần/Dân Cơ, Ngũ Phúc…). Mặc định kintaiyi lấy thêm bàn của giờ/phút sinh để đặt thần lên 12 cung. Đề xuất dùng **bàn Thời kế giờ sinh** cho 12 cung (câu hỏi 8.8). 4 ô góc quy về 12 chi; kintaiyi có hai cách quy khác nhau, phải chọn một.
4. **Hạn 10 năm (Dương cửu và Bách lục hành hạn)**:
   - Dương cửu khởi theo can tháng sinh;
   - Bách lục khởi theo "thụ khí": tổng số của can chi ngày, can chi giờ và số nạp âm, cộng 55, chia 60 lấy dư, rồi lùi từ ngày sinh;
   - mỗi hạn 10 năm đi qua một chi; nam đi thuận, nữ đi nghịch.
5. **Luận**:
   - cung Mệnh và cung Thân có thần lành hay không: Ngũ Phúc, Quân/Thần/Dân Cơ, Văn Xương;
   - có thần gây trở ngại hay không: Đại Du, Tứ Thần, Thiên Ất, Địa Ất, Trực Phù, Thủy Kích;
   - Chủ toán của năm sinh (thế bẩm sinh: thiên về giữ hay về tiến);
   - cách cục của năm sinh;
   - hạn 10 năm hiện tại rơi vào cung nào, có thần nào.
   Độ tin cậy thấp nhất trong 4 phạm vi: chỉ có một nguồn mã, sách gốc chưa đọc.

### 3o. Vận năm cá nhân (vd. 2027)
Thái Ất cổ không có "vận năm của một người". Đề xuất ghép theo 3 bước:
1. bàn Tuế kế của năm cần xem (thời thế chung);
2. so với bàn mệnh pháp: thần lành hay dữ của năm rơi vào cung nào trong 12 cung của người đó (vd. Ngũ Phúc năm 2027 rơi vào cung Quan lộc thì công việc có phúc);
3. hạn 10 năm đang chạy và tuổi.
Phải ghi rõ trong văn: "**cách ghép của Thiên Cơ Các**, không phải phép cổ nguyên bản" (câu hỏi 8.9).

## 4. Kiểm chứng

### 4a. Bộ ca kiểm thử
- Viết `tuvi-app/tools/thai-at-ca-kiem.py`. File này chạy `pip install kintaiyi==0.2.3` **trên máy kiểm thử** (không trong Apps Script, không commit thư viện), sinh JSON khoảng 300 ca:
  - 72 cục dương và 72 cục âm của Tuế kế và Thời kế;
  - các năm 1900–2100;
  - 50 giờ ngẫu nhiên.
- `ThaiAt.gs` so từng trường. Trường nào lệch thì đối chiếu danh sách lỗi đã biết của kintaiyi ở 4c.
- Việc cài gói kintaiyi cần chủ dự án đồng ý, vì phiên này không được cài gói.

### 4b. Đã thử (bằng mã kiểm tra tự viết, không đưa vào repo)
- Quy tắc 3d–3j dựng lại bảng 72 × 2 cục của kintaiyi:
  - Thủy Kích khớp **70/72**;
  - Chủ/Khách/Định toán khớp **421/432**.
- Ví dụ trong README của kintaiyi (năm 658, dương độn cục 55, bàn giống năm 2026) khớp **16 trường**: Thái Ất, Văn Xương, Thủy Kích, Kế, Hợp, Định mục, Chủ toán, Chủ đại tướng, Chủ tham tướng, Định toán, Thiên Ất, Địa Ất, Tứ Thần, Trực Phù, Thần Cơ, Dân Cơ. Quân Cơ cũng khớp (Thìn), sau khi đã sửa lệch 1 bước như ở 3k.

### 4c. Lỗi trong dữ liệu kintaiyi (không được chép bảng)
- **Thủy Kích**, cục 31 và 67 (bảng dùng chung cho dương và âm): kintaiyi ghi Dậu và Càn cho hai cục có cùng đầu vào. Quy tắc cho Tuất. Khách toán trong chính bảng của kintaiyi (cục 31 = 10) cũng chỉ đúng khi Thủy Kích ở Tuất.
- **Bảng toán**, theo dạng [chủ, khách, định], quy tắc / kintaiyi:
  - dương: cục 6 định 32/12; cục 44 chủ 33/23; cục 57 định 1/10; cục 58 định 37/27;
  - âm: cục 6 định 30/10; cục 10 khách 34/24; cục 13 định 13/12; cục 27 định 16/26; cục 39 chủ 37/27; cục 60 định 23/25; cục 61 khách 12/22.
  - Phần lớn là gõ nhầm một chữ số.
- `kingbase` (Quân Cơ) viết `//30 or 1`, nên không bao giờ ra chi Tỵ.
- `bigyo` (Đại Du) đảo bảng chỉ số; `smyo` (Tiểu Du) rối.
- Bảng nhãn cách cục âm độn dài 73 phần tử, trong khi phải là 72, nên bị lệch.
- Đại tướng khi toán chia hết cho 10: chủ lấy 1, khách lấy 5, không nhất quán.

## 5. Bảng ca đối chiếu mẫu (để lập trình)

Ký hiệu nguồn:
- **Q** = tính theo quy tắc mục 3;
- **B** = khớp bảng 72 cục của kintaiyi;
- **R** = khớp ví dụ README kintaiyi;
- **N** = nhãn cách cục của kintaiyi.

"≥2 nguồn" = Q cộng ít nhất một trong B, R, N, cộng quy tắc được sách Kim Kính hoặc tianyugong xác nhận. **Chưa tìm thấy trang nào công bố sẵn bàn của 2024–2027 hay của một giờ cụ thể**: tìm bằng cả tiếng Trung lẫn tiếng Việt đều không ra. Cần chủ dự án dò tay với sách hoặc phần mềm quen dùng (câu hỏi 8.10).

### 5a. Tuế kế 2024–2027 (Thống Tông; Kim Kính chỉ khác ở Ngũ Phúc và Đại Du)

| Năm | Tích niên (Thống Tông / Kim Kính) | Cục | Thái Ất | Văn Xương | Thái tuế, Kế, Hợp | Thủy Kích | Định mục | Chủ toán (đại, tham) | Khách toán (đại, tham) | Định toán (đại, tham) | Cách nổi bật | Nguồn |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2024 Giáp Thìn | 10.155.941 / 1.938.581 | dương 53 | 2 Ly | Khôn | Thìn, Tuất, Dậu | Hợi | Dần | 38 (8, 4) | 25 (5, 5) | 14 (4, 2) | Văn Xương cung bách (Khôn kề Ly) | Q+B+N, **≥2** |
| 2025 Ất Tỵ | 10.155.942 / 1.938.582 | dương 54 | 2 Ly | Khôn | Tỵ, Dậu, Thân | Tý | Tốn | 38 (8, 4) | 24 (4, 2) | 9 (9, 7) | Văn Xương cung bách | Q+B+N, **≥2** |
| 2026 Bính Ngọ | 10.155.943 / 1.938.583 | dương 55 | 3 Cấn | Thân | Ngọ, Thân, Mùi | Cấn | Khôn | 16 (6, 8) | 3 (3, 9) | 22 (2, 6) | **Thủy Kích yểm Thái Ất**; khách đại tướng ở cung Thái Ất (tù); khách toán ngắn, thiếu trời, thiếu đất | Q+B+R+N, **≥2** (README năm 658 cùng cục) |
| 2027 Đinh Mùi | 10.155.944 / 1.938.584 | dương 56 | 3 Cấn | Dậu | Mùi, Mùi, Ngọ | Thìn | Tuất | 15 (5, 5: tướng chủ ở giữa) | 34 (4, 2) | 10 (1, 3; thiếu người) | khách đại tướng ở cung 4, kề Cấn (bách) | Q+B, **≥2** cho toán; cách cục chỉ Q |

Các thần khác (Q; khớp tianyugong về chu kỳ):

| Năm | Quân Cơ | Thần Cơ | Dân Cơ | Ngũ Phúc (Thống Tông / Kim Kính) | Đại Du (Thống Tông / Kim Kính) | Tứ Thần | Thiên Ất | Địa Ất | Trực Phù |
|---|---|---|---|---|---|---|---|---|---|
| 2024 | Sửu | Tuất | Tý | Khôn / Càn | Chấn / Tốn | Đoài | Thân | Ly | Tỵ |
| 2025 | Sửu | Hợi | Sửu | Khôn / Càn | Chấn / Tốn | Đoài | Thân | Ly | Tỵ |
| 2026 | Sửu | Hợi | Dần | Khôn / Càn | Chấn / Tốn | Khôn | Dần | Cấn | Thân |
| 2027 | Sửu | Hợi | Mão | Khôn / Càn | Chấn / Tốn | Khôn | Dần | Cấn | Thân |

Ca nhanh khác: năm 1552 phải ra dương 13 (README kintaiyi); năm 658 phải ra dương 55 với tích 10.154.575.

### 5b. Nguyệt kế (Q; chi tháng khớp chi theo cục, tự kiểm được)

| Tháng âm | Tích nguyệt | Cục | Thái Ất | Văn Xương | Thủy Kích | Chủ / Khách / Định toán |
|---|---|---|---|---|---|---|
| tháng 10/2026 (Hợi) | 121.871.316 | dương 12 | 4 Chấn | Thìn | Dần | 37 / 1 / 4 |
| tháng 11/2026 (Tý) | 121.871.317 | dương 13 | 6 Đoài | Tốn | Thìn | 18 / 19 / 19 |
| tháng 1/2027 (Dần) | 121.871.319 | dương 15 | 6 Đoài | Ngọ | Khôn | 9 / 7 / 6 |
| tháng 6/2027 (Mùi) | 121.871.324 | dương 20 | 8 Khảm | Dậu | Thìn | 7 / 26 / 2 |

### 5c. Thời kế (giờ Việt Nam; Q tính theo cả công thức kintaiyi lẫn công thức rút gọn ở 3b, hai cách cho cùng cục)

| Thời điểm | Ngày, giờ | Cục | Thái Ất | Văn Xương | Kế, Hợp | Thủy Kích | Định mục | Chủ (đại, tham) | Khách (đại, tham) | Định | Ghi chú |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01/01/2024 00:30 | Giáp Tý, giờ Tý | dương 1 | 1 Càn | Thân | Dần, Sửu | Khôn | Khôn | 7 (7, 1) | 13 (3, 9) | 13 | ca gốc của chuỗi; B khớp |
| 15/03/2025 10:00 | Quý Mùi, giờ Tỵ | dương 18 | 7 Khôn | Khôn | Dậu, Thân | Tý | Tốn | 7 (7, 1) | 26 (6, 8) | 11 | Văn Xương tù Thái Ất; N ghi "tù", **≥2** |
| 15/08/2025 15:00 | Bính Thìn, giờ Thân | âm 57 | 7 Khôn | Thìn | Tý, Tỵ | Tỵ | Mùi | 12 (2, 6) | 3 (3, 9) | 1 | âm độn (sau Hạ chí); B khớp toán |
| 21/11/2026 20:00 | Kỷ Hợi, giờ Tuất | âm 71 | 1 Càn | Cấn | Tuất, Mão | Tỵ | Thân | 31 (1, 3) | 16 (6, 8) | 7 | chủ đại tướng ở cung Thái Ất (tù) |
| 06/02/2027 08:00 | Bính Thìn, giờ Thìn | dương 53 | 2 Ly | Khôn | Tuất, Dậu | Hợi | Dần | 38 (8, 4) | 25 (5, 5) | 14 | cùng bàn với Tuế kế 2024 (tự kiểm) |

Âm độn của Thời kế chỉ có kintaiyi làm nguồn mã. Các ca âm ở trên cần ít nhất một lần dò tay.

## 6. Cách luận cho người đọc và chia phần bán

### 6a. Nguyên tắc văn
- Trong phần "dễ hiểu", không nêu tên thần, không nêu số toán. Ví dụ "Thủy Kích yểm Thái Ất" phải viết thành "có một sức ép từ bên ngoài đè lên người đang giữ thế".
- Thuật ngữ chỉ hiện ở phần "Căn cứ" (gập lại), và luôn kèm giải nghĩa: "Chủ toán (sức của phía giữ thế)".
- Ba tầng như Kỳ Môn: **Kết luận → Căn cứ → Việc nên làm**.
  - Tầng 1: "Bạn đang ở thế…".
  - Tầng 2: nhẹ nhàng, luôn có hướng khắc phục.
- Chủ và Khách đổi ra đời thường: **Chủ = phía giữ, phía đang có sẵn vị trí** (người đang làm, chủ nhà, bên được đề nghị); **Khách = phía chủ động, phía mở lời** (người đi xin việc, bên chào hàng, người tỏ tình). Mỗi lần luận, người dùng chọn "tôi là người chủ động" hay "tôi là người đang giữ". Không chọn thì mặc định: hỏi việc → Khách; vận năm → Chủ.
- Không bao giờ nói "thua", "hỏng", "tai họa". Thay bằng "thế chưa thuận, nên…".

### 6b. Bốn phạm vi: miễn phí / 9 xu / 19 xu

| Phạm vi | Miễn phí (hé lộ) | 9 xu | 19 xu | Mã đề xuất |
|---|---|---|---|---|
| (1) Mệnh pháp cá nhân | Bàn Thái Ất năm sinh (hình 16 ô) + 1 câu: "Bạn thuộc mẫu người hợp **giữ và xây** hơn là **xông pha**" | **"Thế bẩm sinh của bạn"**: 5 đoạn (thế chủ/khách, điểm mạnh, điểm vướng, kiểu người nên đi cùng, 3 việc nên làm) | **"Bản đồ đời theo Thái Ất"**: 12 cung + các hạn 10 năm (đã qua để tự kiểm chứng, hiện tại, sắp tới) + kế hoạch; ≥ 10 đoạn | `ta_menh`, `ta_menh_full` |
| (2) Vận năm của bạn (vd. 2027) | 1 dòng: "2027 với bạn: **nên tiến có chọn lọc**" + màu thuận/giằng co/nên giữ | **"2027: nên tiến hay nên giữ"** (5 đoạn, 3 việc, 2 mốc tháng) | **"2027 theo Thái Ất, 12 tháng"**: năm + 12 Nguyệt kế ghép với mệnh; ≥ 10 đoạn. Nếu chủ dự án muốn thì gộp làm "góc nhìn thứ 7" trong `nam_chung` | `ta_nam:<năm>`, `ta_nam12:<năm>` |
| (3) Thời cuộc chung năm/tháng | **Miễn phí hoàn toàn**: "Khí thế năm 2027" (3–4 đoạn, giọng xã hội đời thường: "năm hợp củng cố hơn mở rộng") + 12 dòng tháng. Kéo khách, chia sẻ được | (tùy chọn) "Tháng này cho người làm kinh doanh / người đi làm" | – | trang công khai, không cần mã |
| (4) Hỏi việc theo giờ (Thời kế) | Bàn giờ + 1 câu "Giờ này nghiêng về **người chủ động**" | **"Hỏi một việc theo Thái Ất"**: chọn loại việc + vai chủ động/giữ → 5 đoạn | **"7 ngày tới: giờ nào hợp chủ động, giờ nào nên chờ"** (84 bàn, xếp hạng). Trùng Kỳ Môn, xem câu hỏi 8.2 | `ta_hoi:<yyyymmddhh>:<loại>:<vai>`, `ta_7ngay` |

Danh sách loại việc và lời từ chối (sức khỏe, kiện tụng, đầu tư, sống chết, xổ số…) **dùng chung** với Kỳ Môn (`nghien-cuu/ky-mon/00-de-xuat.md` mục 2a) cho nhất quán.

### 6c. Hai đoạn mẫu (vận năm 2027, người chọn vai "đang giữ")
- **Dễ hiểu (Tầng 1):** "Bạn đang ở thế người giữ thành trong một năm nhiều người muốn chen vào. Năm 2027 không thiếu cơ hội, nhưng phía mở lời, phía đến đề nghị thường có sức hơn. Bạn có xu hướng phải tự hỏi: giữ cái đang có, hay mở thêm?"
- **Nhẹ nhàng (Tầng 2):** "Đây không phải năm xấu. Đây là năm để **củng cố**: chọn một hai việc chính và làm thật chắc. Với đề nghị mới, hãy hỏi kỹ điều kiện và ghi rõ trên giấy. Khoảng tháng 6 âm thế xoay về phía bạn hơn, đó là lúc hợp để chủ động."
- Căn cứ (gập lại): tướng chủ ở cung giữa (đứng yên), Khách toán dài hơn Chủ toán, tướng khách ép sát cung Thái Ất. Tháng 6 âm (Nguyệt kế cục 20): Khách toán 26, Chủ toán 7… Lưu ý: "ép sát" vẫn phải nói ra thành "có người chen vào", không dùng chữ "tai họa".

## 7. Công sức, rủi ro, độ tin cậy

### 7a. Ước lượng
| Việc | Cỡ |
|---|---|
| `ThaiAt.gs`: 4 kế + cách cục + thần + mệnh pháp (dùng lại `kmTietKhiNam_`, `solarToLunar`, `batTuLap_`) | M |
| Bộ ca kiểm thử từ kintaiyi + kiểm thử Node | S–M |
| Giao diện bàn 16 ô (SVG) + hiện các thần | M |
| Văn luận: 4 phạm vi × 3 mức, khoảng 60 khối văn (content-creator viết, reality-checker rà) | **L** |
| Thanh toán: thêm mã vào `TT_PHAN_MAC_DINH`, thêm vào `HAM_CAN_CO` | S |

Lưu ý quy tắc repo: file `.gs` mới phải vào `HAM_CAN_CO` và được đếm trong `HUONG-DAN-CAI-DAT.md`; chạy `tools/tao-ds-file.py`; tăng 3 mã phiên bản giao diện.

### 7b. Độ tin cậy từng phần
| Phần | Độ tin cậy | Lý do |
|---|---|---|
| Tích niên, cục, Thái Ất, Văn Xương, Kế, Hợp, Thủy Kích, toán (dương độn) | **Cao** | sách Kim Kính + tianyugong + kintaiyi; dựng lại bảng khớp 97% (chỗ lệch là lỗi gõ) |
| Âm độn (Thời kế): Văn Xương, Kế Thần | Trung bình | chỉ kintaiyi + tianyugong (Văn Xương); Kế Thần âm chỉ có kintaiyi |
| Đại tướng khi toán 20/30/40 | Trung bình | 3 phái khác nhau |
| Quân, Thần, Dân Cơ | Cao | 2 nguồn khớp |
| Ngũ Phúc, Đại Du | Thấp–trung bình | lệch giữa phái và giữa các phiên bản kintaiyi |
| Tứ Thần, Thiên Ất, Địa Ất, Trực Phù | Trung bình | cùng chu kỳ, khác cách ghi vòng |
| Cách cục | Trung bình | định nghĩa có ở sách; cách tính "kề" phải chọn |
| Mệnh pháp, vận năm cá nhân | **Thấp** | 1 nguồn mã; vận năm cá nhân là cách ghép của ta |

### 7c. Rủi ro
- **Pháp lý và chính trị**: Thái Ất cổ đoán chiến tranh, thiên tai, vận nước. Phần thời cuộc phải tránh:
  - nêu tên quốc gia, lãnh đạo, đảng phái;
  - dự đoán thiên tai, dịch bệnh, chiến sự.
  Chỉ nói "nhịp chung của năm" cho đời sống và kinh doanh. Thêm lời lưu ý "để tham khảo, không phải dự báo".
- **Trùng lặp với Kỳ Môn**: cả hai đều có "hỏi việc theo giờ". Phải khác rõ: Thái Ất trả lời "**chủ động hay chờ**", Kỳ Môn trả lời "**giờ nào, hướng nào**".
- **Người đọc đối chiếu với trang khác**: trang Trung Quốc dùng giờ Bắc Kinh, có thể theo phái Kim Kính cho Thời kế, hoặc dùng Lập xuân làm ranh năm. Cần ghi "Thiên Cơ Các theo phép Thống Tông, giờ Việt Nam".
- **Giá trị cảm nhận thấp nếu văn chung chung**: Thái Ất năm giống nhau cho mọi người. Phần trả phí bắt buộc phải ghép với lá số (mệnh pháp, 12 cung) mới đáng tiền.

## 8. Câu hỏi chủ dự án cần quyết
1. **Mục riêng hay gộp?** Thái Ất làm mục thứ 7 riêng (mã `ta_*`), hay chỉ thêm "góc nhìn Thái Ất" vào các phần đang bán (năm chung, đại vận) và giữ miễn phí phần thời cuộc? Đề xuất: mục riêng cho (1) và (4); gộp (2) vào `nam_chung`; (3) miễn phí.
2. **Phạm vi (4) và Kỳ Môn**: bán "Hỏi một việc theo Thái Ất" riêng, hay bán **combo "Hỏi việc 2 môn"** (Kỳ Môn + Thái Ất) 19 xu?
3. **Ngũ Phúc và Đại Du**: hiện theo Thống Tông (đề xuất), hay hiện cả hai phái?
4. **Ranh năm** của Tuế kế: Tết âm lịch (kintaiyi) hay Lập xuân (như Bát Tự)? Ranh tháng của Nguyệt kế: tháng âm (kintaiyi) hay tháng theo tiết?
5. **Đại tướng khi toán 20/30/40**: lấy 1 (sách Kim Kính, đề xuất) hay chia 9 lấy dư (tianyugong)?
6. **Vòng 12 vị trí** của Tứ Thần, Thiên Ất, Địa Ất, Trực Phù: theo kintaiyi (có cung giữa) hay theo tianyugong (12 chi)?
7. **"Cung kề"** trong cách bách và kích: kề thật trên bàn (đề xuất) hay theo thứ tự đi của Thái Ất (kintaiyi)?
8. **Mệnh pháp**: đặt thần lên 12 cung bằng bàn Thời kế của giờ sinh (đề xuất) hay bàn Phân kế (kintaiyi)? Có làm Dương cửu và Bách lục hành hạn ở bản đầu không? Đề xuất làm ở đợt 2.
9. Đồng ý ghi rõ "vận năm cá nhân là cách ghép của Thiên Cơ Các" trong văn không?
10. Chủ dự án có sách *Thái Ất thần kinh* hay phần mềm quen dùng để dò tay 4 ca năm và 2 ca giờ ở mục 5 không?
11. Cho phép cài kintaiyi (MIT) **trên máy kiểm thử** để sinh ca đối chiếu không? Chỉ trong `tools/`, không đưa lên Apps Script.
12. Giá: giữ khung 9/19 như bảng 6b, hay để Thái Ất miễn phí một thời gian để thử phản ứng?

## Nguồn
- kintaiyi (MIT): https://github.com/kentang2017/kintaiyi; PyPI: https://pypi.org/project/kintaiyi/. Đã đọc `src/kintaiyi/kintaiyi.py` (các hàm `accnum`, `kook`, `ty`, `skyeyes`, `jigod`, `hegod`, `sf`, `se`, `home_cal`, `home_general`, `kingbase`, `taiyi_life`, `life_body_palaces`, `shi_geju`) và `src/kintaiyi/config.py` (`find_cal`, `sf_list`, `skyeyes_dict`, `four_god`, `sky_yi`, `earth_yi`, `zhi_fu`, `officer_base`, `wufu`, `bigyo`, `cal_des`, `numdict`).
- Thái Ất Kim Kính Thức Kinh (phạm vi công cộng), Wikisource: [quyển 1](https://zh.wikisource.org/wiki/%E5%A4%AA%E4%B9%99%E9%87%91%E9%8F%A1%E5%BC%8F%E7%B6%93_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B701), [quyển 2](https://zh.wikisource.org/zh-hant/%E5%A4%AA%E4%B9%99%E9%87%91%E9%8F%A1%E5%BC%8F%E7%B6%93_(%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC)/%E5%8D%B702).
- Tóm tắt quy tắc: https://tianyugong.com/taiyi/
- Bài smxs.com về công thức tích niên (chỉ thấy qua kết quả tìm kiếm, trang không tải được): https://m.smxs.com/mingli/bzzs_bzsm/107306.html
- Wikipedia: https://en.wikipedia.org/wiki/Taiyi_shenshu
- Sách tiếng Việt (chưa đọc, còn bản quyền): https://dc2.philarchive.org/rec/NGUTAT ; https://lib.hpu.edu.vn/handle/123456789/11545
- Repo khác (giấy phép như bảng 2a): zolagz/kintaiyi, vortexheinz/kintaiyi, hackninety/python-taiyi, wlhyl/taiyipython, hhszzzz/taibu, heimu177/TaiYiShenShu-with-Bazi, mood39/Taiyishenshu.
