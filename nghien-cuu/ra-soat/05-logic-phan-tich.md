# 05 – Rà soát LOGIC PHÂN TÍCH (16/11/2026)

Người rà: chuyên gia reality-checker. Chỉ đo và đề xuất, **không sửa mã**.
Dữ liệu: chạy giả lập (`tuvi-app/tools/gia-lap.js`) trên **10 lá số đặt tên** (nam và nữ, sinh 1970–2002, có 2 lá giờ Tý muộn 23h10 và 23h30, 1 lá 0h45) cộng **150 lá ngẫu nhiên** (sinh 1965–2006, giờ ngẫu nhiên), năm xem 2026. Riêng phần nghiệm chứng: 5 ngày sinh × 12 giờ và 40 lá ngẫu nhiên.
Script nháp nằm trong `nghien-cuu/ra-soat/anh/`: `logic-chay.js`, `logic-phan-tich.js`, `logic-tuvi-noibo.js`, `logic-nghiem-chung.js`. Chạy lại bằng `node <file>`. Các script đã được cập nhật theo tên hàm mới (`nghiemChungLap_`).

## Tóm tắt 5 dòng
1. **Vận hạn trong Tử Vi tự mâu thuẫn.** Bước 26 của "26 bước" chấm vận năm theo điểm *gốc* của cung, không theo điểm vận năm. Kết quả: 53% lá số có mức vận năm khác với mục Tiểu vận, và **19% lệch từ 2 bậc trở lên** (vd. "khá thuận" ở bước 26 nhưng "Cần thận trọng" ở mục Tiểu vận).
2. **Thang điểm từng hệ lệch về một phía, mỗi hệ một kiểu.** Tử Vi chấm 64% cung là "thuận" và 73% tháng là Khá trở lên. Chiêm tinh ngược lại: chỉ 11% "thuận", 33% "cần lưu ý". Vì vậy "đồng thuận giữa các hệ" phần lớn phản ánh độ lệch thang điểm, không phản ánh lá số.
3. **Tổng hợp "6 hệ" thật ra chỉ có 2–4 hệ chấm điểm.** Có 9,5% kết luận tự mâu thuẫn ngay trong câu, kiểu "Đây là một thế mạnh của bạn – 1/4 hệ có điểm cùng chiều thuận". Có 15,6% kết luận thuận/cần lưu ý trong khi có hệ chấm ngược chiều. Có 28,6% mục "vừa" thật ra là các hệ chia hai cực.
4. **Vận năm và tháng ít ăn khớp với đại vận.** Tương quan đại vận ↔ năm của Tử Vi chỉ r = 0,26. Bát Tự gần như không có quan hệ: r = 0,01. Năm xếp "Cần thận trọng" vẫn có 5–6 tháng "Tốt". Hai khối "Năm theo 6 hệ" và "Hồ sơ biến cố năm" kết luận ngược nhau ở 17% lá số.
5. **Nghiệm chứng phân biệt được giờ sinh ở phần câu chữ, nhưng ngưỡng chấm đang trái quy tắc chủ dự án và dễ dính hiệu ứng "đúng với ai cũng được".** 6/8 nhóm "đúng phần lớn" chỉ ra "Có thể đúng", dù quy tắc chốt là xác nhận. Người dễ đồng ý (mô phỏng) được "Xác nhận" hoặc "Có thể đúng" ở 94% lần chấm. Nhóm D, E, G có 71–86% câu là câu chung cho nhiều người. Văn dễ hiểu từng hệ có 16–29% câu giống hệt ở ≥80% lá số. Mức này chấp nhận được nhưng nên giảm. Giờ Tý muộn tính đúng.

---

## Kết quả đo chính (bằng chứng)

### A. Phân bố điểm và nhãn (160 lá số)
| Nguồn | Thuận | Vừa | Cần lưu ý |
|---|---|---|---|
| Tử Vi 12 cung (nhãn chi tiết) | Rất tốt 16,6 · Tốt 34,6 · Khá 22,8 = **74%** | Trung bình 15,6% | Kém + Cần thận trọng **10,4%** |
| Tử Vi cung khi đưa vào Tổng hợp (ngưỡng 6,2/4,3) | **63,8%** | 22,2% | 14,0% |
| Bát Tự 12 lĩnh vực | 35,5% | 47,2% | 17,3% |
| Chiêm tinh 8 lĩnh vực (×1,8 rồi quy về thang 10) | **11,2%** | 56,3% | **32,5%** |
| Hà Lạc lục thân (×1,5) | 23,1% | 41,3% | 35,5% |
| **Tổng hợp 6 hệ (9 lĩnh vực)** | 41,6% | 44,5% | 13,9% |
| Tử Vi 12 nguyệt vận | Rất tốt 29,5 · Tốt 24,6 · Khá 18,8 = **72,9%** | 14,8% | 12,4% |
| Tử Vi tiểu vận 2026 | 64,4% (Khá trở lên) | 18,8% | 16,9% |

- Điểm Tổng hợp trung bình là 5,78/10 (trung vị 5,7, p25 5,2, p75 6,3, nằm trong khoảng 3,5–8,3). Có 67,5% lá số có đủ 3 "thế mạnh nổi bật", và 27,5% lá số không có lĩnh vực "cần chăm chút" nào.
- Lệch theo lĩnh vực, do cấu tạo chứ không do lá số:
  - "Bạn bè – quý nhân" thuận ở 66% lá số, "Đời sống tinh thần" thuận ở 69%. Hai mục này chỉ có Tử Vi và Bát Tự chấm, mà hai hệ này đều nghiêng thuận.
  - "Bạn bè – quý nhân" chỉ 3% là "cần lưu ý".
  - "Sức khỏe" có 25% "cần lưu ý", vì Chiêm tinh và Hà Lạc nghiêng khó.
- **Kết luận:** chưa đến mức "ai cũng tốt", nhưng có lệch thuận rõ ở Tử Vi và lệch khó ở Chiêm tinh. Hai thang không được hiệu chuẩn cùng gốc, trong khi hệ số nhân 1,8 và 1,5 trong `DeHieu.gs:652,654` là con số đặt tay.

### B. Mâu thuẫn trong cùng một hệ
| Kiểm tra | Tỷ lệ lệch | Ví dụ |
|---|---|---|
| Tử Vi: bước 26 "Vận năm … ở mức X" ↔ mục Tiểu vận năm (cùng 4 bậc, cùng ngưỡng 7/5,5/4) | **80/150 = 53%** khác bậc; **28/150 = 18,7% lệch ≥2 bậc** | R14: "khá thuận" / Tiểu vận "Cần thận trọng (-4,4)"; R8: "thuận lợi rõ rệt" / "Trung bình" |
| Tử Vi: bước 26 "Đại vận … ở mức X" ↔ danh sách Đại vận | 67/150 = 44,7% khác bậc; 10% lệch ≥2 bậc; 6% ngược chiều | R61: "trung bình, có lúc lên xuống" / "Rất tốt (7,6)"; R20: "trung bình" / "Cần thận trọng (-4)" |
| Tử Vi: điểm cung trên bảng sao / 26 bước (`palace.diem10`) ↔ 12 cung chi tiết (`chiTiet.cung`) | Lệch trung bình 0,9 điểm, p90 2,0, có ca 4,8 điểm; **4,3% ngược chiều** | R4 Tài Bạch: 4,1 ở bảng sao / 7,9 "Tốt" ở mục chi tiết |
| Tử Vi: bước 6 "Chính tinh thủ Mệnh" ↔ nhãn cung Mệnh | 1,3% | Lá A: bước 6 viết "năng lực được phát huy, dễ được công nhận", cung Mệnh "Kém", Tổng hợp viết "phải tự nỗ lực nhiều hơn người khác" |
| Tử Vi: bước 19–24 ↔ nhãn cung | 1,4% | R4: "Tiền tài – lúc thiếu hụt" là xấu, nhưng Tài Bạch "Tốt" |
| Tử Vi: nhãn cung chi tiết ↔ câu Tử Vi trong Tổng hợp | 3,5% (do ngưỡng 4,3 khác 4,0) | A Phu Thê "Trung bình (4,2)" lại thành câu "cần nhiều thấu hiểu" |
| Bát Tự: nhãn lĩnh vực ↔ "Kết luận (x/10)" | 0% | nhất quán |

Nguyên nhân bước 26 (`TuViTrinhTu.gs:204–208`): `DH = byChi[I.daiHanNow]`, `TH = byChi[I.tieuHanNow]`, sau đó `muc(DH.diem10)` và `muc(TH.diem10)`. Tức là bước 26 lấy **điểm gốc của cung** mà đại hạn/tiểu hạn rơi vào, chứ không lấy điểm vận (có lưu tinh, Tứ Hóa vận) mà mục Đại vận/Tiểu vận dùng. Khách sẽ đọc hai mức khác nhau cho cùng một năm, cùng một hệ.

Hệ quả thứ hai: hai bộ điểm cung song song (`palace.diem10` ở TuVi.gs/TuViHeThong và `chiTiet.cung.diem` ở LuanGiai) cùng được hiện ra ("Điểm cung Mệnh: x/10" ở 26 bước, "Tốt/Kém" ở 12 cung).

### C. Tổng hợp 6 hệ (`DeHieu.gs › th6Lap_`, 1.440 lĩnh vực)
- **Số hệ chấm điểm:** 4 hệ ở 66,7% lĩnh vực, 3 hệ ở 11,1%, **chỉ 2 hệ ở 22,2%** (Bạn bè, Tinh thần). Thần số và Human Design không bao giờ bỏ phiếu. Tên "6 hệ" và câu "Đồng thuận 6 hệ" (`Script.html:1896`) vì vậy nói quá.
- **Câu kết luận tự mâu thuẫn:** có **137/1.440 = 9,5%** kết luận thuận hoặc cần lưu ý mà chưa đến nửa số hệ cùng chiều. Ví dụ: "Đây là một thế mạnh của bạn – **1/4 hệ** có điểm cùng chiều thuận" (lá A, Sức khỏe), "… 1/3 hệ …" (A, Con cái). Khi kết luận là "thuận", phân bố số hệ cùng chiều như sau: 1/4 chiếm 63 ca, 2/4 chiếm 158 ca, 3/4 chiếm 67 ca, 4/4 chỉ 9 ca. Nguyên nhân: điểm chung là trung bình có trọng số, nên một hệ điểm rất cao kéo cả lĩnh vực lên dù các hệ khác "vừa".
- **Kết luận có hệ ngược chiều:** 225/1.440 = 15,6%. Ví dụ B Con cái là "thuận 6,1" trong khi Hà Lạc chấm 3,0 ("cần lưu ý"); F Con cái là "cần lưu ý" trong khi Hà Lạc chấm 6,6 ("thuận").
- **"Vừa" che hai cực:** 412/1.440 = 28,6% mục "vừa" có ít nhất 1 hệ thuận và 1 hệ cần lưu ý (A Công danh: Tử Vi 4,2 · Bát Tự 7 · Hà Lạc 2,6 · Chiêm tinh 6,6). Lúc này `dong` đếm số hệ "vừa", nên "đồng thuận" gần như vô nghĩa.
- **Cùng một hệ ở cả "điểm sáng" lẫn "cần lưu ý":** 8,3%, chủ yếu ở Gia đạo. Gia đạo gộp Phụ Mẫu và Huynh Đệ. Mỗi nguồn ra một câu, nên cùng hệ Tử Vi vừa khen vừa chê.
- **Hai bộ tổng hợp song song:** bộ cũ `dh.tongHop` vẫn được tính và vẫn dùng làm dự phòng ở `Script.html:3915, 5918`. Bộ này ngược chiều với th6 ở 3,1% lĩnh vực (A Tính cách: cũ 6,2 thuận, mới 4,8 cần lưu ý) và viết "Có N trên 6 hệ".
- **Ngưỡng ghi cho khách không khớp ngưỡng mã:** báo cáo (`Script.html:5900`) và trang hướng dẫn (`Script.html:6581`) viết "từ 6,5 là thuận, từ 4 trở xuống là cần lưu ý". Mã th6 lại dùng 6,0/4,8 cho điểm chung và 6,2/4,3 cho điểm từng hệ (`DeHieu.gs:626–628`).
- **Còn hiện %:** `tomTat` có câu "Mức đồng thuận trung bình giữa các hệ: X%" (`DeHieu.gs:711`), ô đếm hiện "X% Đồng thuận 6 hệ", báo cáo hiện "Độ tin cậy … X%". Điều này trái quy tắc "bỏ %/xác suất". `doTin` nằm trong khoảng 40–60% ở 92% lá số, nên con số này không phân biệt được ai với ai.

### D. Vận hạn: năm, tháng và đại vận
| Cặp so | Pearson r (n=160) | Nhận xét |
|---|---|---|
| Tử Vi đại vận ↔ tiểu vận năm | **0,26** | Mục Tiểu vận có ghi "đại hạn là nền, tiểu hạn là ngọn", nhưng điểm năm chỉ phụ thuộc yếu vào đại vận |
| Tử Vi tiểu vận ↔ trung bình 12 nguyệt vận | **0,29** | Tháng trung bình 3,11 (thô), năm 1,63, nên tháng thuận hơn năm một cách hệ thống |
| Bát Tự đại vận ↔ Bát Tự lưu niên | **0,01** | Điểm lưu niên Bát Tự không xét đại vận |
| Tử Vi đại vận ↔ Bát Tự đại vận | 0,02 | Hai hệ độc lập. Chấp nhận được, nhưng nên nói rõ khi ghép |
| Tử Vi tiểu vận ↔ Bát Tự lưu niên | 0,44 | |
| "Năm theo 6 hệ" ↔ Tử Vi tiểu vận | 0,51 | |

- **Năm xấu mà tháng vẫn đẹp.** Năm "Cần thận trọng" có 5 tháng Tốt+ và 3 tháng Kém ở 4/8 ca. Năm "Kém" thường có 6–8 tháng Tốt+. Biên độ trong một năm trung vị 6,1 điểm/10, nghĩa là tháng nhảy từ rất xấu sang rất tốt.
- **Hai khối năm ngược nhau ở 27/160 = 16,9%.** Ví dụ R9: khối "Năm theo 6 hệ" ghi "Năm thuận lợi (7,4/10; **5/5 hệ cùng chiều**)", còn khối "Hồ sơ biến cố năm" ghi "**3/5 hệ nghiêng thử thách**, 1 hệ nghiêng thuận – năm nên chắc…". Hai khối dùng hai cách phân loại hệ khác nhau trên cùng dữ liệu.
- Tử Vi tiểu vận "Tốt" trong khi Tổng hợp năm "thử thách": 3,8%.

### E. Văn có thay đổi theo lá số không (30 lá, câu giống hệt sau khi thay số bằng #)
| Phần | Câu/lá | Jaccard TB 2 lá | Câu có ở ≥80% lá | Câu chỉ riêng 1 lá |
|---|---|---|---|---|
| Bát Tự dễ hiểu | 44 | 22,5% | 18,0% | 2,9% |
| Chiêm tinh dễ hiểu | 59 | 24,7% | 26,9% | 13,3% |
| Thần số dễ hiểu | 40 | 20,9% | 20,1% | 10,7% |
| Human Design dễ hiểu | 35 | **34,7%** | **28,6%** | 6,0% |
| Hà Lạc dễ hiểu | 44 | 24,2% | 15,9% | 7,9% |
| Tổng hợp 6 hệ | 60 | 19,5% | 8,0% | 7,8% |
| Tử Vi 12 cung chi tiết | 289 | 15,0% | 19,9% | 35,4% |
| Tử Vi 26 bước | 77 | 17,7% | 14,7% | 26,6% |
| Bát Tự 12 lĩnh vực | 142 | 16,3% | 6,6% | 18,7% |
| **Hồ sơ biến cố năm** | 107 | **46,5%** | **57,4%** | 13,1% |
| **Hồ sơ 12 tháng** | 179 | **36,2%** | **38,2%** | 12,6% |

Lưu ý: số đo có tính cả tiêu đề mục, nên cột "≥80%" cao hơn thực tế vài điểm.

- **Hồ sơ biến cố năm** là phần bán (vận năm) nhưng có hơn một nửa câu giống nhau giữa mọi người, ví dụ "Không có việc nổi bật – khía cạnh này khá yên trong năm.", "Thăng tiến, được giao việc lớn…". Mỗi tháng của Hồ sơ 12 tháng cũng lặp câu chung, ví dụ "dễ chậm trễ, nhầm lẫn giấy tờ…" ở 30/30 lá.
- Bát Tự dễ hiểu chỉ có 2,9% câu riêng của từng người. Văn ghép từ kho 10 nhật chủ × vài mức, nên hai người cùng nhật chủ đọc gần như giống hệt.
- Trong Tổng hợp, câu mở kết luận lặp 30/30 ("Lĩnh vực này có cả thuận lẫn khó – kết quả phụ thuộc nhiều vào cách bạn lựa chọn và thời điểm.").

### F. Nghiệm chứng (`NghiemChung.gs`)
- **Phân biệt giờ sinh, cùng một ngày, 12 giờ:** văn 8 nhóm đổi theo giờ. Nhóm A, F, G, H có 12/12 bản khác nhau. Câu chung giữa 2 giờ kề nhau: A 5%, H 15%, F 21%, D 25%, E 39%, C 40%, B 44%, G 59%. Như vậy về câu chữ có phân biệt được giờ, trừ G (con cái) và B (tính cách) phân biệt kém.
- **Câu chung cho nhiều người (40 lá):** câu gặp ở ≥25% số người chiếm A 10%, B 31%, C 52%, H 57%, **E 71%, D 79%, G 86%** số dòng. Ví dụ:
  - E: "giai đoạn …–… tuổi từng vất vả hơn các chặng khác…" xuất hiện ở 32/40 người. Ai cũng có một chặng đời kém nhất, nên câu này gần như luôn "đúng".
  - G: "Trai – gái: cổ học có cách luận nghiêng về trai hay gái…" xuất hiện ở **40/40** người. Câu không chứa thông tin gì, lại chạm đúng chủ đề chủ dự án đã bỏ (tỷ lệ trai–gái).
  - D: "gia đình tình cảm nhưng có khoảng cách thế hệ…" xuất hiện ở 20/40 người.
- **Ngưỡng trái quy tắc chủ dự án.** Quy tắc chốt: từ 6/8 nhóm "đúng cao" là xác nhận. Mã (`NghiemChung.gs:72`) lại đòi thêm `pct >= 70`. Ca 6/8 "đúng phần lớn" + 2 "đúng một nửa" cho pct 69%, nên chỉ ra **CO_THE_DUNG**. Ngược lại, ca chỉ chấm 4 nhóm (3 đúng cao + 1 sai hoàn toàn) vẫn ra CO_THE_DUNG. Ca chấm 4 nhóm ngẫu nhiên ra XAC_NHAN 10%, so với 3% khi chấm đủ 8 nhóm. Ít nhóm thì dễ "xác nhận" hơn.
- **Mô phỏng cách chấm:**
  - Chọn ngẫu nhiên đều: XAC_NHAN 3% · CO_THE_DUNG 27% · CO_THE_SAI 70%. Kết quả này hợp lý.
  - Người dễ đồng ý (Barnum: 70% chọn "đúng hết/đúng phần lớn"): **XAC_NHAN 48% · CO_THE_DUNG 46%**. Do nhiều câu chung cho mọi người, công cụ dễ "xác nhận" sai giờ.
- **Vẫn hiện %:** nhãn "75% đồng thuận", "83% đồng thuận" (`ncDong_`, `NghiemChung.gs:95`) và thanh "độ tin X%" (`Script.html:7276`).

### G. Giờ Tý muộn: ĐẠT
4 ca (3/11/1985, 19/1/2000, 31/12/1999 qua năm mới, 3/2/1992 qua Tết). Lúc 23h30, ngày âm, Mệnh, Cục, trụ ngày và trụ giờ đều chuyển sang hôm sau, giống hệt lúc 0h30 hôm sau. Trong khi đó Thần số học vẫn dùng ngày dương thật (giống 22h50), Chiêm tinh/HD dùng thời điểm thật. Ghi chú hiện đúng ("Sinh giờ Tý muộn…"). Ca 3/2/1992 đổi Cục (Mộc Tam → Kim Tứ) và mùng 1 Tết. Nên có một dòng nhắc khách rằng giờ 23h làm đổi ngày âm. Hiện đã có ghi chú.

---

## Danh sách vấn đề và đề xuất

### Mức CAO
1. **Bước 26 Tử Vi mâu thuẫn với mục Đại vận/Tiểu vận.** Chỗ: `TuViTrinhTu.gs:204–208`.
   - Bằng chứng: 53% khác bậc, 18,7% lệch ≥2 bậc (mục B).
   - Đề xuất: bước 26 lấy điểm từ `chiTiet.daiVan` (bản đang chạy) và `chiTiet.tieuVan` thay cho `byChi[...].diem10`, rồi in đúng nhãn của mục đó. Thêm kiểm thử "bước 26 = nhãn Tiểu vận".
   - Công sức: S.
2. **Câu kết luận Tổng hợp tự mâu thuẫn.** Ví dụ "thế mạnh – 1/4 hệ" (9,5%), có hệ ngược chiều (15,6%). Chỗ: `DeHieu.gs:666–684`.
   - Đề xuất: kết luận "thuận"/"cần lưu ý" chỉ khi điểm chung qua ngưỡng **và** ≥ nửa số hệ cùng chiều **và** không có hệ ngược chiều mạnh. Nếu không đạt thì gắn nhãn "có cả thuận lẫn khó" và nêu rõ hệ nào thuận, hệ nào khó. Khi chỉ có 2 hệ chấm, viết "2 hệ có chấm điểm", không gọi là "thế mạnh".
   - Công sức: S–M.
3. **Thang điểm các hệ chưa hiệu chuẩn.** Tử Vi lệch thuận (64–74%), Chiêm tinh lệch khó (11% thuận).
   - Đề xuất: chuẩn hóa mỗi hệ theo phân vị trên mẫu khoảng 1.000 lá số. Ví dụ quy điểm từng hệ về hạng phần trăm (thuận = 30% cao nhất, khó = 20% thấp nhất), thay cho hệ số đặt tay ×1,8/×1,5. Lưu bảng phân vị thành hằng số, kèm kiểm thử phân bố (đã có khung trong `tests/tong-hop.js`).
   - Công sức: M.
4. **Ngưỡng nghiệm chứng trái quy tắc chủ dự án và dễ "xác nhận" khi chấm ít nhóm.** Chỗ: `NghiemChung.gs:72–74`.
   - Đề xuất: XAC_NHAN khi ≥6 nhóm "đúng cao" (đếm tuyệt đối) và ≤1 nhóm sai. CO_THE_DUNG khi 4–5 nhóm. Bỏ điều kiện pct ở bậc xác nhận. Nếu số nhóm được chấm < 6 thì chỉ cho tối đa CO_THE_DUNG, kèm ghi chú "chưa đủ nhóm để xác nhận". Hỏi lại chủ dự án trước khi đổi, vì đây là quy tắc đã chốt.
   - Công sức: S.
5. **Hai khối năm (Năm theo 6 hệ ↔ Hồ sơ biến cố năm) ngược nhau ở 17% lá số.** Chỗ: `TongHop.gs` (`namNay`) và `HoiTu.gs` (`htHoSoNam_`).
   - Đề xuất: dùng một bộ phiếu hệ chung cho năm (một hàm), cả hai khối đọc cùng kết quả.
   - Công sức: M.

### Mức VỪA
6. **Còn hiện %.** Chỗ: `DeHieu.gs:711` (tomTat), `Script.html:1896` ("% Đồng thuận 6 hệ"), `Script.html:5900` (báo cáo), `NghiemChung.gs:95` và `Script.html:7276` (nghiệm chứng).
   - Đề xuất: thay bằng "x/y hệ cùng chiều" hoặc chữ (cao / vừa / thấp). Bỏ `doTin` khỏi phần khách xem, vì 92% lá số nằm trong 40–60% nên con số không mang thông tin.
   - Công sức: S.
7. **Gọi "6 hệ" nhưng chỉ 2–4 hệ chấm điểm.**
   - Đề xuất: ghi "x/y hệ có chấm điểm". Với 2 lĩnh vực chỉ có 2 hệ (Bạn bè, Tinh thần), cho Chiêm tinh (nhà 11/12) hoặc Hà Lạc góp phiếu, hoặc đánh dấu "ít căn cứ".
   - Công sức: M.
8. **Ngưỡng ghi cho khách sai.** "từ 6,5 là thuận, từ 4 là cần lưu ý" (`Script.html:5900, 6581`) khác ngưỡng mã (6,0/4,8).
   - Đề xuất: ghi ngưỡng từ một hằng số chung.
   - Công sức: S.
9. **Tháng không bám năm, năm không bám đại vận** (r 0,29 / 0,26; Bát Tự 0,01). Tháng thuận hơn năm một cách hệ thống.
   - Đề xuất: điểm tháng = nền năm (khoảng 40%) + tín hiệu tháng (khoảng 60%). Điểm năm = nền đại vận (khoảng 30%) + tín hiệu năm. Bát Tự lưu niên cộng thêm hướng của đại vận đang chạy. Kiểm thử: r(đại vận, năm) ≥ 0,5 và năm "Cần thận trọng" có ≤3 tháng "Tốt".
   - Công sức: M.
10. **Hai bộ điểm cung song song** (`palace.diem10` và `chiTiet.cung.diem`): lệch trung bình 0,9 điểm, 4,3% ngược chiều, cả hai cùng hiện cho khách.
    - Đề xuất: chọn một bộ làm chuẩn (`chiTiet.cung`), bộ kia chỉ dùng nội bộ hoặc gán lại.
    - Công sức: M.
11. **Văn lặp ở phần bán.** Hồ sơ biến cố năm có 57% câu giống nhau ở ≥80% người. Hồ sơ 12 tháng 38%.
    - Đề xuất: ẩn khía cạnh "không có việc nổi bật" (gộp thành một dòng), viết câu sự kiện kèm căn cứ riêng (cung/quẻ/năm). Nhóm câu mốc tháng giấy tờ nên chỉ hiện khi có tín hiệu thật.
    - Công sức: M.
12. **Nghiệm chứng chứa câu "ai cũng đúng".** Câu "Trai – gái…" ở 40/40 người, câu "giai đoạn vất vả nhất" ở 32/40.
    - Đề xuất: bỏ câu trai–gái (chủ dự án đã bỏ chủ đề này). Câu chặng khó chỉ đưa vào khi chặng đó thấp hơn hẳn các chặng khác (chênh ≥2 điểm) và có ≥2 hệ cùng báo. Cuối mỗi nhóm thêm 1 câu "đối chứng" (câu sai cố ý) để phát hiện người bấm "đúng" theo quán tính.
    - Công sức: M.

### Mức THẤP
13. **Bỏ tổng hợp cũ `dh.tongHop`.** Bộ này vẫn tính và làm dự phòng, ngược th6 ở 3,1% lĩnh vực, ghi "N trên 6 hệ". Đề xuất: bỏ hoặc chỉ giữ khi th6 lỗi. Công sức: S.
14. **Gia đạo: cùng một hệ vừa khen vừa chê** (8,3%). Đề xuất: tách "Cha mẹ" và "Anh em" thành 2 dòng con. Công sức: S.
15. **Ngưỡng câu Tử Vi trong Tổng hợp (4,3) lệch ngưỡng nhãn cung (4,0)**, gây 3,5% lệch nhỏ. Đề xuất: dùng chung ngưỡng. Công sức: S.
16. **Văn dễ hiểu Bát Tự / Human Design ít cá nhân hóa** (câu riêng 3–6%). Đề xuất: chèn 1–2 câu ghép theo tổ hợp (nhật chủ × thân vượng/nhược × thập thần mạnh nhất; HD loại × hồ sơ × trung tâm mở). Phối hợp với chuyên gia văn. Công sức: M.

---

## Đề xuất chia đợt sửa
- **Đợt 1 (nhanh, công sức S, rủi ro thấp):** mục 1, 2, 6, 8, 13, 15. Toàn bộ là sửa điều kiện hoặc câu chữ, thêm kiểm thử nhất quán. Mục 4 làm sau khi chủ dự án trả lời.
- **Đợt 2 (logic vận):** mục 5 và 9 (một bộ phiếu năm dùng chung, điểm tháng/năm bám nền vận), mục 10 (một bộ điểm cung).
- **Đợt 3 (hiệu chuẩn và văn):** mục 3 (chuẩn hóa phân vị), mục 7, 11, 12, 14, 16.
- **Bộ kiểm thử nên thêm:** dựa trên script `anh/logic-*.js`, gồm 5 khẳng định: bước 26 = Tiểu vận; tỷ lệ kết luận tự mâu thuẫn = 0; phân bố thuận của mỗi hệ trong khoảng 25–45%; r(đại vận, năm) ≥ 0,5; nghiệm chứng với người dễ đồng ý ra XAC_NHAN ≤ 25%.
