# Công thức bổ sung cho Tử Vi Phi Tinh: các mục kho còn ghi "chưa xác định"

Tìm trên web ngày 01/11/2026. Ghi chú này bổ sung cho `tong-quan.md`, `quy-tac.json` và khóa `dinhNghia` trong `tong-hop/catalog.json`.

**Quy ước.**
- Chi được đánh số Tý = 0, Sửu = 1, …, Hợi = 11. Can được đánh số Giáp = 0, …, Quý = 9. `mod12(x) = ((x % 12) + 12) % 12`.
- Thứ tự cung theo tên là Mệnh(0), Huynh(1), Phu(2), Tử(3), Tài(4), Tật(5), Di(6), Nô(7), Quan(8), Điền(9), Phúc(10), Phụ(11). Trên bàn, cung tên k nằm ở chi `mod12(chiMenh − k)`.
- **Mức chắc chắn.** *Cao*: có ít nhất 2 nguồn độc lập khớp nhau. *Trung bình*: có 1 nguồn rõ ràng. *Thấp*: suy luận hoặc nguồn chỉ đọc được qua đoạn trích của máy tìm kiếm.
- Nội dung bên dưới tóm ý bằng lời của tôi, không chép nguyên văn. Đoạn chữ Hán chỉ là cụm ngắn để tra lại.

---

## 1. Mệnh tháng (lưu nguyệt) theo Đẩu quân

### (a) Công thức

**Bước 1: an Đẩu quân (cung tháng Giêng của năm xem).** Khẩu quyết trong *Toàn thư* (bài 安斗君訣) có ý như sau:
1. Lấy cung Thái Tuế của năm xem, tức cung mang chi của năm lưu niên, gọi là tháng Giêng.
2. Đếm nghịch đến tháng sinh.
3. Tại cung vừa dừng, gọi là giờ Tý rồi đếm thuận đến giờ sinh.
4. Cung dừng cuối cùng là Đẩu quân.

Công thức lập trình:
```
dauQuan = mod12( chiNamXem − (thangSinh − 1) + gioSinh )
// thangSinh: 1..12 (tháng âm); gioSinh: Tý=0 … Hợi=11
```
- Tháng sinh nhuận thường tính theo tháng chính. Các nguồn không bàn kỹ điểm này, nên nó là một thiết lập của app.
- Ví dụ trong nguồn (bose131): năm Hợi, sinh tháng 6, giờ Mão. Tính 11 − 5 + 3 = 9, ra Dậu, khớp với kết quả nguồn ghi.
- "Tử niên Đẩu quân" (子年斗君) là cùng phép tính ấy cho năm Tý, sau đó mỗi năm đi thuận một cung. Kết quả trùng với công thức trên.

**Bước 2: cung Mệnh của tháng âm n.**
```
menhThang(n) = mod12( dauQuan + (n − 1) )   // đi thuận mỗi tháng một cung
```
Mười hai cung của tháng xếp theo thứ tự tên cung tính từ menhThang(n), giống cách xếp của bàn gốc.

**Bước 3: can của cung tháng dùng để phi Tứ Hóa tháng.** Các nguồn chia ba biến thể:

| Mã | Cách lấy can | Ai dùng |
|---|---|---|
| A | **Can cung nguyên cục** (Ngũ Hổ Độn theo can năm sinh) của cung menhThang(n), và các cung tháng khác cũng dùng can nguyên cục. | bose131 (2008 và 2018) nói "phái Tứ Hóa vẫn dùng can cung"; bài 2018 nêu ví dụ năm Giáp thì cung Hợi mang can Ất. Mô tả app 紫微四化飛星 (App Store) ghi "đại hạn, lưu niên, lưu nguyệt… đều dùng can cung". |
| B | **Ngũ Hổ Độn lại theo can năm xem** cho chi của cung tháng: `canCung = mod10(canDan(canNamXem) + mod12(chi − 2))`, với `canDan = [2,4,6,8,0][canNam % 5]` (Giáp/Kỷ → Bính Dần). | ginowu001: năm Tân Mão, Đẩu quân ở Ngọ thì cung Đẩu quân là Giáp Ngọ, "không phải can chi gốc, cũng không phải can chi năm". bose131 (2008) gọi đây là cách của Tam hợp phái (Nam phái). |
| C | **Can tháng thực** (Ngũ Hổ Độn tháng): tháng n của năm xem mang can `mod10(canDan(canNamXem) + n − 1)`. Can này phi Tứ Hóa trên bàn tháng. | Chỉ thấy qua đoạn trích của máy tìm kiếm (laiboyee.com trả lỗi 403): "lấy Mệnh lưu niên… đếm nghịch tháng sinh, thuận giờ sinh, an tháng Giêng, rồi dùng Ngũ Hổ Độn tháng xếp can tháng Giêng để khởi Tứ Hóa". |

**Đề xuất cho app Phi Tinh: mặc định biến thể A**, vì đây là cách nhất quán với đại vận và lưu niên của phái Tứ Hóa. Nên cho phép đổi sang B hoặc C trong cài đặt.
- Lưu ý về cách hiện có: `VanSau.gs` đang khởi tháng Giêng từ **cung tiểu hạn** (theo sách Việt) và dùng can tháng (biến thể C). Các nguồn Trung văn ở đây đều khởi từ **cung Thái Tuế (chi năm)**.
- Hai cách khởi cho ra cung tháng Giêng khác nhau khi tiểu hạn khác cung chi năm.
- Có một phái thứ ba, "Thái Tuế phái": tháng Giêng luôn ở Dần, can theo Ngũ Hổ Độn năm xem. Theo bose131, phái này dùng để xem "đại môi trường", không phải vận cá nhân.

### (b) Nguồn
- 安斗君訣, *Tử Vi Đẩu Số Toàn thư* quyển 2 (bản trên guwendao.net): https://www.guwendao.net/guwen/bookv_9f9dc89ef3a4.aspx
- bose131, "流月" (2018): https://bose131.blogspot.com/2018/12/blog-post_28.html (có ví dụ số, phân biệt Đẩu quân phái và Thái Tuế phái, dùng can cung)
- ginowu001, "細談斗君的論法": https://ginowu001.pixnet.net/blog/posts/9230712716 (cùng khẩu quyết, ví dụ Giáp Ngọ)
- bose131, "四化淺談(二)" (2008): https://bose131.blogspot.com/2008/04/blog-post_25.html
- Mô tả app 紫微四化飛星: https://apps.apple.com/us/app/id527052359

Số nguồn đồng ý:
- Cách an Đẩu quân: **3 nguồn độc lập khớp** (Toàn thư, bose131, ginowu001), cộng một đoạn trích trên Baidu Zhidao cũng nêu khẩu quyết "流年歲建起正月，逆逢生月順回程…".
- Can tháng: A có 2 nguồn (bose131, mô tả app); B có 2 nguồn (ginowu001, bose131 gọi là cách Nam phái); C có 1 đoạn trích chưa kiểm.

### (c) Mức chắc chắn
- Công thức Đẩu quân: **cao**.
- Mệnh tháng n = Đẩu quân + (n − 1): **cao** (bose131, ginowu001).
- Can tháng: **trung bình**, vì các phái khác nhau. Biến thể A là cách của phái Tứ Hóa.

### (d) Biến thể
- Điểm khởi: cung chi năm xem (Trung văn) hoặc cung tiểu hạn (sách Việt, cách app đang dùng).
- Thái Tuế phái cố định tháng Giêng ở Dần.
- Can: A, B hoặc C như bảng trên.

---

## 2. Thuận thủy Kỵ và Nghịch thủy Kỵ (順水忌 / 逆水忌)

### (a) Quy tắc

**Nghịch thủy Kỵ (逆水忌).** Định nghĩa đã thống nhất, trùng với `quy-tac.json`:
```
A ∈ {Mệnh, Tài, Quan}
Kỵ(canCung[A]) nằm ở doi(A)
doi(A) có Kỵ năm sinh
doi(A) KHÔNG có tự hóa (Lộc, Quyền, Khoa hay Kỵ đều tính)
```
- Kỵ năm sinh ở cung đối giống một con đập, chặn Kỵ phi sang và dội nó về A.
- Nếu doi(A) có tự hóa thì gọi là Thủy tiết Kỵ (水洩忌).
- Nếu cung đối không có Kỵ năm sinh, hoặc có tự hóa, thì vocus gọi là "Thủy mệnh Kỵ" (水命忌).
- Không có khái niệm "thuận/nghịch theo chiều 12 cung". Chữ "nghịch" ở đây là **dòng Kỵ bị dội ngược**, không liên quan đến chiều kim đồng hồ.

**Thuận thủy Kỵ (順水忌).** Không tìm thấy định nghĩa riêng trong nguồn Trung văn nào đọc được.
- Các bài 忌星棋譜 (ziweicn 3760, qqqtseng, chinazwds) chỉ có Lưu xuất Kỵ, Xạ xuất Kỵ, Lưu thủy Kỵ và Nghịch thủy Kỵ.
- Vì vậy "Thuận thủy Kỵ" của cohoc và S15 là **tên khác của Lưu thủy Kỵ (流水忌)**: cung A phi Kỵ vào một cung B không phải A và không phải đối cung của A. Đây đúng là cách kho đang dùng.
- Cách hiểu thứ hai chỉ có ở một đoạn trích của máy tìm kiếm, nên **mức thấp**: Kỵ phi sang đối cung mà đối cung *không* có Kỵ năm sinh chặn lại nên "chảy xuôi". Trường hợp này đã có tên Lưu xuất / Thủy mệnh Kỵ.

### (b) Nguồn
- Nghịch thủy Kỵ: vocus 64fdda09 (https://vocus.cc/article/64fdda09fd89780001c04f6a), destiny.to topic 118752 (https://destiny.to/ubbthreads/topic/118752), ziweicn 3760 (https://www.ziweicn.com/show/3760.html), cùng S13, S14, S15 đã có trong kho.
- Biến thể của Hứa Diệu Côn (許耀焜): blog.udn.com/88say/2362067.

Số nguồn: Nghịch thủy Kỵ có **≥ 4 nguồn độc lập khớp**. Thuận thủy Kỵ là tên riêng có **0 nguồn Trung văn**, chỉ có S15 (đã có trong kho) và cohoc.

### (c) Mức chắc chắn
- Nghịch thủy: **cao**.
- Thuận thủy = Lưu thủy: **trung bình**, vì chỉ dựa vào nguồn Việt và S15.

### (d) Biến thể của Nghịch thủy Kỵ
1. **Cung phát.**
   - Phần lớn nguồn giới hạn ở Mệnh, Tài, Quan.
   - destiny.to cho áp dụng mọi cung. vocus nói các cung khác là "khiếm trái Kỵ" (欠債忌).
2. **Hứa Diệu Côn.** Cấu trúc khác hẳn: Kỵ năm sinh phải nằm ở **ngã cung**, Lộc năm sinh cũng phải vào ngã cung, và cung có Kỵ năm sinh không được lẫn Lộc, Quyền hay Khoa năm sinh. Biến thể này chỉ có một nguồn và không nên làm mặc định.
3. **Cát hay hung.** Đa số coi là "tích lũy, phát". Một số tác giả (shenpowang, po168999, qua đoạn trích) cảnh báo rằng nếu đối cung lại tự hóa Kỵ thì "ba Kỵ" đụng nhau, rất xấu.

---

## 3. Tuyệt mệnh Kỵ, Phá thể, Dương phi nhập Âm

### 3a. Tuyệt mệnh Kỵ (絕命忌). Chỉ dùng nội bộ, `hienThi: false`

**(a) Quy tắc.** Có hai nguồn mới, với hai bộ điều kiện khác nhau. Đặt `nc` là nguyên cục và `dv` là đại vận.

**Biến thể V1 (vocus 6a632c3c, "Simon老師")**, thỏa một trong các điều kiện sau:
1. Kỵ năm sinh ở nc.Mệnh, và nc.Mệnh nhận Kỵ phi từ dv.Điền hoặc dv.Quan.
2. Kỵ năm sinh ở nc.Điền, và nc.Điền nhận Kỵ từ dv.Mệnh, dv.Điền hoặc dv.Quan.
3. Kỵ năm sinh ở nc.Quan, và nc.Quan nhận Kỵ từ Di hoặc Điền của đại vận hay lưu niên.
4. Không cần Kỵ năm sinh: Kỵ của dv.Di xung nc.Mệnh hoặc xung nc.Quan, tức Kỵ rơi vào nc.Di hoặc nc.Phu.
5. Không cần Kỵ năm sinh: Kỵ của dv.Điền xung nc.Mệnh.
6. Mức nặng nhất là "khóa kép": cả dv.Di và dv.Điền cùng phi Kỵ xung nc.Mệnh.

**Biến thể V2 (chiu2425.pixnet, bài đăng lại từ năm 2008):**
- **Khi Kỵ năm sinh ở nc.Mệnh:** chỉ cần dv.Mệnh phi Kỵ xung nc.Mệnh là đủ. Tương tự khi Kỵ năm sinh ở nc.Quan: chỉ cần dv.Quan phi Kỵ xung nc.Quan.
- **Khi Kỵ năm sinh không ở Mệnh hay Quan:** xét 12 tổ hợp. Cung phát là một trong {dv.Mệnh, dv.Di, dv.Quan, dv.Điền}; cung bị xung là một trong {nc.Mệnh, nc.Quan, nc.Điền}. Phải **có ít nhất 2 tổ hợp cùng thỏa** mới thành Tuyệt mệnh Kỵ.
- **Giải cứu (V2).**
  - Mạnh: Lộc của dv.Mệnh, Di, Quan hoặc Điền nhập một trong nc.Mệnh, Quan, Điền, Tật, Phúc. Cung nhận Lộc đó không được tự hóa Kỵ và không được bị Kỵ xung.
  - Yếu hơn: Lộc nhập dv.Mệnh, Quan, Điền, Tật hoặc Phúc.

**Đề xuất lập trình.** Hàm `tuyetMenh(dv)` trả về `{v1: bool, v2: bool, giaiCuu: 'manh'|'yeu'|null}`. Chỉ dùng để tăng mức "nên thận trọng" của chủ đề thuộc cung bị xung, đúng `luuYDaoDuc` của kho.

**(b) Nguồn.**
- V1: https://vocus.cc/article/6a632c3cfd897800012af4ae
- V2: https://chiu2425.pixnet.net/blog/post/213945550
- Cộng với S13, S14, S15, S26 đã có trong kho.
- **Tổng 6 nguồn, nhưng không có hai nguồn nào trùng nhau hoàn toàn.**
- Điểm chung có ở ít nhất 4 nguồn: Kỵ của đại vận phi vào hoặc xung **nc.Mệnh, nc.Quan hoặc nc.Điền**, và trường hợp có Kỵ năm sinh tại cung bị đánh thì nặng hơn.

**(c) Mức chắc chắn.** Phần lõi chung (cung đích ∈ {nc.Mệnh, nc.Quan, nc.Điền}) là **cao**. Từng điều kiện chi tiết chỉ ở mức **trung bình** hoặc **thấp**.

**(d) Biến thể:** V1, V2, S13/S14 (bắt buộc Mệnh có Kỵ năm sinh), S15, S26 (dv.Điền xung nc.Quan).

### 3b. Phá thể (破體位, "vị trí Hình Riêu củng xung")

**(a) Quy tắc.**
- Thiên Hình (Hỏa) và Thiên Riêu/天姚 (Thủy) luôn nằm trong cùng một bộ tam hợp. Theo cách an phổ thông, Hình khởi Dậu, Riêu khởi Sửu, cùng đi thuận theo tháng sinh, nên Riêu = Hình + 4.
- Cung **còn trống của bộ tam hợp đó** là cung "phá thể". Nguồn mô tả cùng vị trí này theo một cách khác là "cung thứ 9 tính từ Thiên Hình" (天刑前九宮).
```
hinh  = mod12(9 + thangSinh − 1)      // Dậu = 9
rieu  = mod12(1 + thangSinh − 1)      // Sửu = 1  (= hinh + 4)
phaThe = mod12(hinh + 8)              // = mod12(5 + thangSinh − 1): khởi Tị, thuận theo tháng sinh
```
Hai cách mô tả cho ra cùng một cung, nên công thức nhất quán.

**Cách dùng theo nguồn:**
- Đại vận hoặc lưu niên đi vào cung phá thể thì giai đoạn đó dễ có thị phi, không thuận.
- Tứ Hóa phi ra từ can của cung phá thể không nên rơi vào cung có Tứ Hóa năm sinh. Ví dụ: Lộc của cung phá thể gặp Kỵ năm sinh ở Tử Tức thì gọi là "xung phá Tử Tức".
- Ví dụ cụ thể trong nguồn: phá thể rơi vào Tử Tức. Một số trang hiểu nhầm thành "phá thể luôn là Tử Tức", nhưng đó chỉ là một lá số mẫu.

**(b) Nguồn.**
- 伯樂網 praxisluck.com, bài "破體位 刑姚拱沖之位 的解譯". Không vào được trang (lỗi DNS), chỉ đọc được qua đoạn trích của máy tìm kiếm.
- Bản đăng lại trên dashisuanming.cn (lỗi 503), cũng chỉ qua đoạn trích.
- Thực chất là **1 nguồn gốc**.
- Cách an Hình và Riêu (khởi Dậu, khởi Sửu, thuận tháng) là kiến thức an sao phổ thông, đã có sẵn trong app.

**(c) Mức chắc chắn:** **thấp–trung bình**. Hai câu mô tả trong nguồn khớp nhau về mặt số học, nhưng chỉ có một nguồn và không đọc được toàn văn.

**(d) Biến thể:** catalog hiện ghi "cung có Hình hoặc Riêu là phá thể". Nguồn mới cho thấy phá thể là **cung thứ ba của tam hợp Hình–Riêu**, không phải cung có hai sao đó.

### 3c. Dương phi nhập Âm (陽宮飛陰宮)

**(a) Quy tắc.** **Không tìm thấy** nguồn nào nói "dương phi vào âm thì cộng hưởng mạnh". Phần tìm được chỉ gồm:
- Định nghĩa cung dương và cung âm theo **thứ tự tên cung**, không theo địa chi. Lục dương cung là các cung lẻ khi đánh số Mệnh = 1: Mệnh, Phu, Tài, Di, Quan, Phúc. Lục âm cung là Huynh, Tử, Tật, Nô, Điền, Phụ.
  - Hóa năm sinh nhập cung dương thiên về "quý" (danh, vị). Nhập cung âm thiên về "phú" (tiền).
  - Kỵ năm sinh nhập cung dương làm tổn "quý khí". Nhập cung âm làm tổn "tài khí".
  - Quan hoặc Tài phi hóa vào cung âm: phải dựa vào danh nghĩa hay quan hệ của người khác.
- Một quy tắc chung không phân âm dương: Hóa năm sinh mạnh khi "nhập", phi hóa mạnh khi "chiếu" (生年四化以入為強，飛宮四化以照為強).

Lập trình được: `amDuongCung(k) = (k % 2 === 0) ? 'duong' : 'am'`, với k là chỉ số tên cung (Mệnh = 0).

**(b) Nguồn:** jordanwwj.pixnet (S16 đã có trong kho), mục 5, 9, 81 và 83. Có thêm một đoạn trích ghi là "講義 của 林明章" với nội dung giống.

**(c) Mức chắc chắn.**
- Định nghĩa cung âm dương theo thứ tự: **trung bình** (1 nguồn đọc được, 1 đoạn trích).
- "Dương phi Âm cộng hưởng mạnh": **không tìm thấy**. Vẫn chỉ có ví dụ duy nhất của cohoc.

**(d) Biến thể:** có thể cohoc xét âm dương theo **chi của cung** (Tý, Dần, Thìn… là dương). Không có nguồn xác nhận.

---

## 4. Hỉ, Kỵ, Nhàn, Dụng thần và "cung khí"

### (a) Quy tắc tìm được: Thiên Cơ phái (天機派, Hoàng Xuân Lâm 黃春霖)

Sách *紫微天機* (1992) công bố "Đẩu số hỉ kỵ thần và lý thuyết cung khí". Học quán Sơn Chu dịch lại, cuối bài ghi nguồn "(Phù Cừ Cổ Học)". Vì vậy đây rất có thể là gốc của phần "Hỉ Kỵ" mà cohoc dẫn.

**Bước 1: khí ngũ hành của lá số (星氣).** Cộng khí theo hành của các sao trong **cung Mệnh** (nguồn không nói rõ có tính tam phương hay không; cần thử).

| Hành | Sao (hệ số) |
|---|---|
| Hỏa | Thái Dương 1; Hỏa Tinh 2/3; Linh Tinh 2/3; Khôi, Việt, Thiên Không, Địa Kiếp mỗi sao 1/3 |
| Mộc | Tham Lang, Thiên Cơ, Liêm Trinh, Hóa Quyền mỗi sao 1 |
| Kim | Vũ Khúc, Thất Sát, Văn Xương mỗi sao 1; Kình Dương, Đà La mỗi sao 3/4 |
| Thổ | Tử Vi 2; Thiên Phủ 2; Thiên Lương, Lộc Tồn, Hóa Lộc mỗi sao 1; Tả Phụ 1/3 |
| Thủy | Cự Môn, Phá Quân, Thái Âm, Thiên Đồng, Thiên Tướng, Văn Khúc, Hóa Khoa, Hóa Kỵ mỗi sao 1; Hữu Bật 1/3 |

Cộng thêm:
- Mệnh và Thân **tam hợp** nhau: hành của cục tam hợp đó được thêm 1,5.
- Mệnh và Thân **tam hội** nhau: thêm 2. Các phương là Hợi Tý Sửu → Thủy; Dần Mão Thìn → Mộc; Tị Ngọ Mùi → Hỏa; Thân Dậu Tuất → Kim. Một bản ghi nhầm thành "Dần Mão Tuất".
- Cung Mệnh ở Hợi, Tý, Sửu, Tị hoặc Mùi (亥子丑巳未): thêm 1 cho hành của **cục** (Ngũ hành cục).

**Bước 2: xếp vai trò cho từng hành.**
- Hành nào có tổng khí **≥ 4** là **kỵ thần** (nguyên văn: 凡氣數為4(包括4)以上，則此五行為忌神).
- **Dụng thần** chọn theo thứ tự:
  1. **Điều hậu**: sinh tháng đông (Hợi, Tý, Sửu) dùng Hỏa, sinh tháng hạ (Tị, Ngọ, Mùi) dùng Thủy.
  2. **Thông quan**: khi hai hành mạnh khắc nhau, dùng hành ở giữa (ví dụ Kim khắc Mộc thì dùng Thủy).
  3. **Trung hòa**: dùng hành yếu để cân lại hành vượt ngưỡng.
- Nguồn **không định nghĩa "nhàn thần"**. Đề xuất (suy luận, mức thấp): hỉ = hành sinh dụng; nhàn = hành còn lại, không ≥ 4, không phải dụng hay hỉ.

**Bước 3: khí của cung khi xét vận và năm (運歲取用).** Với đại vận và lưu niên, hành của cung tính theo tỷ lệ **thiên can 20 %, địa chi 50 %, nạp âm 30 %**, và **không dùng khí sao**.

**Bước 4: chấm "cung khí" (suy luận, kiểm bằng dữ liệu cohoc trong catalog).** Lấy bộ trọng số 20/50/30 của bước 3 nhân với vai trò của hành: dụng = +2, hỉ = +1, nhàn = 0, kỵ = −1. Áp dụng cho 10 ví dụ cohoc đã ghi trong `catalog.dinhNghia["Cung khí"]` (hỉ Mộc và Thủy, kỵ Kim và Thổ, nhàn Hỏa), với **giả định Thủy là dụng (×2)**:

| Can chi | Can (20) | Chi (50) | Nạp âm (30) | Điểm | cohoc ghi |
|---|---|---|---|---|---|
| Nhâm Ngọ | Thủy +40 | Hỏa 0 | Mộc +30 | **+70** | đại cát ✓ |
| Giáp Thân | Mộc +20 | Kim −50 | Thủy +60 | **+30** | đại cát ✓ |
| Ất Dậu | Mộc +20 | Kim −50 | Thủy +60 | **+30** | đại cát ✓ |
| Quý Mùi | Thủy +40 | Thổ −50 | Mộc +30 | **+20** | đại cát ✓ |
| Mậu Dần | Thổ −20 | Mộc +50 | Thổ −30 | **0** | đan xen ✓ |
| Kỷ Mão | Thổ −20 | Mộc +50 | Thổ −30 | **0** | đan xen ✓ |
| Tân Tị | Kim −20 | Hỏa 0 | Kim −30 | **−50** | đại hung ✓ |
| Kỷ Sửu | Thổ −20 | Thổ −50 | Hỏa 0 | **−70** | đại hung ✓ |
| Bính Tuất | Hỏa 0 | Thổ −50 | Thổ −30 | **−80** | đại hung ✓ |
| Canh Thìn | Kim −20 | Thổ −50 | Kim −30 | **−100** | đại hung ✓ |

Kết quả **khớp 10/10**, thay cho 7/10 nếu chỉ xét nạp âm.
- Ngưỡng tạm đặt: điểm > 0 là cát (đại cát khi ≥ 20 trong mẫu này), 0 là đan xen, < 0 là hung.
- Chưa có mẫu cho "cát" hay "hung" mức nhẹ. Nếu cohoc có, thang 5 mức có thể là: ≥ +50 đại cát, +1..+49 cát, 0 đan xen, −1..−49 hung, ≤ −50 đại hung. **Cần kiểm thêm.**
- Nếu không cho Thủy hệ số dụng (chỉ để +1), các ví dụ Giáp Thân, Ất Dậu và Quý Mùi ra 0, lệch với cohoc. Vậy **trong lá số mẫu, Thủy rất có thể là dụng thần**. Cần đối chiếu với đoạn "Ngũ hành Hỉ Kỵ" của bài cohoc gốc.

### (b) Nguồn
- Học quán Sơn Chu, "Thiên cơ phái hỉ kị thần": https://sonchu.vn/2022/08/16/thien-co-phai-hi-ki-than/
- 周新春易學網, "天機派紫微斗數簡介": https://3g.d5168.com/ziweimingli/ziweidoushu/25536.html
- zgjm.wiki 202104/171818: https://www.zgjm.wiki/a/202104/171818.html
- Đoạn trích ziweimingli.com (trang trả lỗi 403): "Thiên Cơ phái truyền từ Hoàng Xuân Lâm, năm 1992 công bố đẩu số hỉ kỵ thần và cung khí"

**3 trang có cùng bảng số, nhưng gần như chắc chắn chép từ một văn bản gốc**, nên tính là 1 nguồn gốc có 3 bản chép khớp nhau.

### (c) Mức chắc chắn
- Bảng hệ số sao, ngưỡng ≥ 4, cách chọn dụng thần (điều hậu, thông quan) và tỷ lệ 20/50/30: **trung bình–cao** (3 bản khớp).
- Cách chấm cung khí bằng trọng số: **thấp–trung bình**. Đây là suy luận, khớp 10/10 ví dụ nhưng dựa trên giả định Thủy là dụng.
- Nhàn thần: **không tìm thấy**.

### (d) Biến thể
- Catalog hiện nói hỉ kỵ "tính theo hành cung Mệnh hoặc cục và tháng sinh (phù ức…)". Nguồn Thiên Cơ phái dùng **khí sao** (cộng hệ số), không dùng phù ức kiểu Bát Tự.
- Không rõ khí sao chỉ tính trong cung Mệnh hay cả tam phương tứ chính.

---

## 5. Thiên, Địa, Nhân của 10 thiên can (Ông Phúc Dụ 翁福裕, "Thất tinh định điểm")

### (a) Quy tắc

**Can Quý.**
- Một đoạn trích (từ máy tìm kiếm) của bài đăng lại "翁福裕老師的命例<五>" trên fengshui-168.com (trang trả lỗi 403) có ý: can cung **Quý là vị trí "thiên, địa, nhân đều không nương"**, là đất phá hao.
- Điều này **khớp với giả thuyết của kho**: Giáp đến Nhâm lấp đủ lưới 3 × 3 (tầng × đẳng), còn **Quý nằm ngoài lưới**, không thuộc tầng nào.
- Đề xuất: `canTDN[Quý] = {tang: null, dang: null, nhan: 'phaHao'}`. Trong điểm xí hoa, Quý nhận hệ số thấp nhất (≤ Nhân-hạ) hoặc mang dấu âm.

**Chín can còn lại.** Không tìm thấy bảng gốc. Giả thuyết vòng của kho (Giáp Thiên-thượng … Nhâm Nhân-hạ) **chưa có nguồn xác nhận và cũng không bị nguồn nào bác**.

**"Thất tinh định điểm" (七星定點).** Đã tìm được cách tính, có ví dụ kiểm:
```
// đếm tính cả cung xuất phát là 1
thangDiem = mod12( chiMenh − (thangSinh − 1) )   // nghịch theo tháng sinh  → "Thiên" (月定點)
ngayDiem  = mod12( thangDiem + (ngaySinh − 1) )  // thuận theo ngày sinh    → "Địa"  (日定點)
gioDiem   = mod12( ngayDiem − gioSinh )          // nghịch theo giờ (Tý=0) → "Nhân" (時定點) = "Thất tinh chung cực điểm"
```
- Ví dụ trong nguồn: gốc Tý, tháng 8, ngày 27, giờ Mùi. Tháng ra Tị, ngày ra Mùi, giờ ra Tý, khớp với công thức.
- Ý nghĩa: điểm tháng xem hướng lớn của đời, điểm ngày là khâu trung gian, điểm giờ là người và việc gắn bó nhất.
- Nguồn còn nêu một cách chia Thiên, Địa, Nhân theo **địa chi**: Tý Ngọ Mão Dậu = Thiên, Thìn Tuất Sửu Mùi = Địa, Dần Thân Tị Hợi = Nhân. **Không phải** theo thiên can.

**Hệ quả cho kho.** "Thiên, Địa, Nhân" trong "Thất tinh định điểm" có thể là **ba điểm tháng, ngày, giờ** chứ không phải tầng của can. Tầng của can (chữ "Thiên thời, Địa lợi, Nhân hòa" kèm "thượng, trung, hạ đẳng") có thể là **can cung tại ba điểm đó**. Đây là suy luận, cần đối chiếu lại câu chữ trong ví dụ cohoc.

### (b) Nguồn
- Cách an Thất tinh định điểm:
  - douban note 287580429 ("紫微斗数七星诀", xếp vào Khâm Thiên Vô Cực môn, truyền Lý Xán Dương → Ông Phúc Dụ): https://site.douban.com/183595/widget/notes/10897548/note/287580429/
  - Đoạn trích 伯樂網 "七星定點的推定方法" và "七星終極定點" (lỗi DNS khi tải).
  - Là 2 nguồn khớp nhau.
- Can Quý: 1 đoạn trích (fengshui-168, lỗi 403).

### (c) Mức chắc chắn
- Công thức Thất tinh định điểm: **cao** (2 nguồn, có ví dụ số khớp).
- Quý "không thuộc Thiên, Địa, Nhân": **thấp–trung bình** (1 đoạn trích, khớp với giả thuyết lưới 3 × 3).
- 9 can còn lại: **thấp** (chỉ là suy luận từ 4 ví dụ cohoc).

### (d) Biến thể
Theo nguồn của Thất tinh, "Thiên, Địa, Nhân" có thể là tam tài của **chi**, hoặc là ba điểm tháng, ngày, giờ, thay vì tầng của can.

---

## 6. Điểm "xí hoa"

**Không tìm thấy** nguồn nào (Việt, Trung hay Anh) cho cụm "điểm xí hoa" hay công thức chấm điểm theo sao hỉ, kỵ thần nhân hệ số.

Thành phần lập trình được, ghép từ mục 4 và 5 (**mức thấp**, chỉ là khung để thử ngược với số cohoc in):
```
diemCung(X) = Σ_sao∈X  heSoKhi(sao) × vaiTro(hanh(sao))        // vaiTro: dụng +2, hỉ +1, nhàn 0, kỵ −1 (mục 4)
            + k1 × diemCungKhi(X)                                // mục 4, bước 4 (chuẩn hóa /100)
            × heSoCan(canCung(X))                                // Thiên/Địa/Nhân × thượng/trung/hạ; Quý thấp nhất (mục 5)
diemLaSo   = Σ_X diemCung(X)
```
Hệ số `heSoKhi` lấy theo bảng Thiên Cơ phái. `k1` và `heSoCan` chưa có nguồn: cần hồi quy từ các điểm xí hoa cohoc đã in trong 4 bài mẫu (A–D).

Số nguồn: 0. Mức chắc chắn: không tìm thấy, công thức trên là đề xuất.

---

## 7. Tài thiên, Tài địa, Tài nhân; "cung khí số vị"

### 7a. Tài thiên / Tài địa / Tài nhân
**Không tìm thấy.** Đã tìm cả tiếng Trung ("財天" "財地" "財人") lẫn tiếng Việt và không có kết quả. Giữ nguyên ghi chú "chưa xác định" trong catalog.
- Gợi ý suy luận (**thấp**): theo mục 5, "thiên, địa, nhân" có thể là ba điểm tháng, ngày, giờ, hoặc ba tầng nguyên cục, đại vận, lưu niên (thiên bàn, địa bàn, nhân bàn trong `tong-quan.md` mục 2.8).
- Như vậy "Tài thiên" có thể là Lộc/Kỵ tháng trùng với Lộc/Kỵ ở **Tài bạch nguyên cục** (thiên bàn), "Tài địa" ứng **Tài đại vận**, "Tài nhân" ứng **Tài lưu niên**.
- Cách hiểu theo ba tầng này **khớp với khung "thiên bàn, địa bàn, nhân bàn" đã có nguồn S16, S20**, nhưng chưa có nguồn nào gọi tên như vậy.

### 7b. "Cung khí số vị" (氣數位) – Phương Ngoại Nhân 方外人 (Tăng Quốc Hùng 曾國雄), *開館人紫微斗數*

**(a) Quy tắc.**
- **Khí số vị của cung X là cung Quan lộc của X.** Lấy X làm 1 rồi đếm ngược theo chiều tên cung đến cung thứ 9; nguồn diễn đạt bằng hệ thức "cung gốc + khí số vị = 10".
```
khiSoVi(chiX) = mod12( chiX − 8 ) = mod12( chiX + 4 )
// theo chỉ số tên cung: khiSoViTen(k) = (k + 8) % 12
// Mệnh→Quan, Huynh→Điền, Phu→Phúc, Tử→Phụ, Tài→Mệnh, Tật→Huynh,
// Di→Phu, Nô→Tử, Quan→Tài, Điền→Tật, Phúc→Di, Phụ→Nô
```
- Kiểm tra: Mệnh(0) → 8 Quan; Quan(8) → 16 % 12 = 4 Tài; Tài(4) → 12 % 12 = 0 Mệnh. Khớp với nguồn.
- Phương Ngoại Nhân là người đặt ra các khái niệm "Nhất Lục cộng tông", "Thể Dụng", "khí số vị" và chủ thuyết **tuyến Phụ–Tật chủ "quang minh", tuyến Huynh–Nô chủ "thành tựu"**. Kho đã có khóa `tuyen|HuynhNo` và `tuyen|PhuTat` cho thuyết này.
- **Ứng dụng cho dòng cohoc "Hóa cát từ cung khí số vị của vận nhập tuyến Huynh–Nô / Phụ–Tật"** (suy luận, mức thấp): với chủ đề X của vận, cung phát là `khiSoVi(X)`, tức Quan lộc của X trên bàn vận đó; xét Hóa của can cung đó có rơi vào tuyến Huynh–Nô hay Phụ–Tật hay không.
  - Danh sách cung phát cohoc đã ghi gồm Mệnh, Quan, Tật, Điền, Nô, Tử, Phu. Danh sách này có thể là khí số vị của Tài, Mệnh, Phụ, Phúc, Huynh, Tật, Tử…
  - **Cần kiểm lại bằng các dòng cohoc gốc** trước khi đưa vào quy tắc.

**(b) Nguồn.**
- aaron411109.pixnet "論氣數位的源由" (河洛飛星工作坊): https://aaron411109.pixnet.net/blog/posts/10006154567
- Đoạn trích read01 "紫微斗數中常講的「氣數位」" (lỗi 403), có câu "官祿宮為命宮氣數位; các cung đều lấy Quan lộc của mình làm khí số vị".
- Đoạn trích 88say "斗數的氣數" và mijing08945.pixnet.
- Threads @starwallwatching: lai lịch Phương Ngoại Nhân, các tuyến Phụ–Tật và Huynh–Nô.
- Giới thiệu sách trên books.com.tw / gyfbook: "Quan lộc (khí số vị)".

Số nguồn: **≥ 3 nguồn độc lập khớp** về định nghĩa.

**(c) Mức chắc chắn.**
- Định nghĩa khí số vị = Quan lộc của cung: **cao**.
- Cách cohoc áp dụng vào tuyến thành tựu và quang minh: **thấp**.

**(d) Biến thể:** một cư dân mạng gọi khí số vị là "sinh tử vị". Ngoài ra không có định nghĩa nào khác.

---

## Trang không vào được (không vượt chặn)

| Trang | Lý do |
|---|---|
| www.360doc.cn | Bị chặn DNS trong phiên này; cần cho phép trong cài đặt mạng nếu muốn đọc |
| praxisluck.com (伯樂網) | Lỗi DNS. Chỉ dùng đoạn trích của máy tìm kiếm cho: 破體位, 七星定點, 宮干四化 |
| laiboyee.com, getit01.com, ziweimingli.com, fengshui-168.com, read01.com | HTTP 403 |
| fushantang.com, dashisuanming.cn | HTTP 503 |
| tuvi.cohoc.net | Không truy cập trong lần này |

## Tóm tắt việc nên làm trong mã (chưa làm, cần chủ dự án duyệt)

1. Thêm hàm `dauQuan(chiNamXem, thangSinh, gioSinh)` và `menhThang(n)`, kèm tùy chọn can tháng A, B hoặc C (mặc định A cho tầng Phi Tinh). Không đổi cách `VanSau.gs` đang dùng nếu chưa hỏi chủ dự án.
2. Sửa định nghĩa Phá thể trong catalog: là cung thứ ba của tam hợp Hình–Riêu, tức khởi Tị đi thuận theo tháng sinh.
3. Thêm `khiSoVi(k) = (k + 8) % 12` và `thatTinhDinhDiem(...)`.
4. Thêm module khí sao của Thiên Cơ phái (bảng mục 4) và hàm `cungKhi(canChi, vaiTroHanh)` dùng trọng số 20/50/30, sau đó kiểm với 4 bài mẫu cohoc.
5. Tuyệt mệnh Kỵ: lưu cả V1 và V2, `hienThi: false`.
