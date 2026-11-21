# Kỳ Môn Độn Giáp – đề xuất sản phẩm "Hỏi một việc" và "Chọn giờ, chọn hướng" (21/11/2026, chờ chủ dự án duyệt)

Người soạn: chuyên gia Product Manager (Agency Agents). **Chưa viết mã, chưa commit.** Căn cứ: `nghien-cuu/ra-soat/07-ban-le-9-19.md`, `bo-nao/Quyết định của chủ dự án.md`, `tuvi-app/README.md` (Lunar.gs, BatTu.gs, TienIch.gs). Tài liệu tham khảo bên ngoài chỉ để học cấu trúc, không chép mã hay chữ (một bộ kỹ năng Kỳ Môn không có giấy phép đã đọc ở scratchpad, nên chỉ học cách chia bước).

## Tóm tắt 6 dòng
1. Kỳ Môn không xem cả đời. Nó trả lời **một việc cụ thể tại một thời điểm**: việc này nên tiến hay chờ, đi giờ nào, đi hướng nào.
2. Đề xuất 2 phần lẻ: **"Hỏi một việc" 9 xu** và **"Giờ tốt – hướng tốt 7 ngày tới" 19 xu** (hoặc 9 xu nếu chỉ một loại việc). Miễn phí: bàn 9 cung, một câu kết luận, 1 khung giờ tốt mỗi ngày.
3. Cách tính: **Thời gia Kỳ Môn, chuyển bàn, định cục theo phép Sách Bổ (còn gọi Trích Bổ)**. Đây là cách phổ biến nhất, có 3 thư viện giấy phép MIT để đối chiếu. Dùng lại tiết khí và can chi có sẵn trong `Lunar.gs` / `BatTu.gs`, giờ Việt Nam (GMT+7).
4. Kiểm chứng: đối chiếu tự động với thư viện **3meta** và **bigfishmarquis-qimen** (cả hai MIT, viết bằng JavaScript/TypeScript), cộng 3 ví dụ có nguồn và dò tay trên 2 trang tiếng Việt.
5. Văn luận 3 tầng: **Kết luận → Căn cứ → Việc nên làm**. Phần dễ hiểu không nêu tên sao, tên cửa; không nói "chắc chắn hỏng"; luôn có hướng khắc phục.
6. Công sức tổng khoảng **L** (nặng nhất là văn luận). Rủi ro chính: câu hỏi nhạy cảm (sức khỏe, kiện tụng, tiền đầu tư) và pháp lý về "bói toán". Có 9 câu hỏi cần chủ dự án quyết (mục 7).

---

## 1. Kỳ Môn là gì, khác 6 hệ đang có ở đâu

Nói đơn giản: người xưa chia mặt đất làm **9 ô theo 8 hướng và ô giữa**. Cứ mỗi 2 tiếng (một giờ âm lịch), "khí thế" ở mỗi ô thay đổi. Kỳ Môn chồng 4 lớp lên 9 ô đó:
- lớp Đất (đứng yên),
- lớp Trời (9 sao),
- lớp Người (8 cửa),
- lớp Thần (8 vị thần).

Ô nào đang có "cửa mở, sao sáng, thần giúp" thì hướng đó, giờ đó thuận cho việc tương ứng. Kỳ Môn vốn dùng để bày binh, chọn thời cơ, nên hợp với câu hỏi kiểu "**làm thế nào cho lợi**" hơn là "**tôi là người thế nào**".

| | 6 hệ đang có (Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số, HD) | Kỳ Môn |
|---|---|---|
| Đầu vào | Ngày giờ sinh | **Thời điểm đặt câu hỏi** (hoặc thời điểm định làm việc) + loại việc |
| Trả lời | Con người, đường đời, vận 10 năm / năm / tháng | **Một việc**: nên tiến hay chờ, điểm mạnh và điểm vướng, giờ và hướng thuận |
| Hạn dùng | Cả đời | Vài giờ đến vài ngày (đổi giờ là đổi bàn) |
| Cần lá số? | Có | **Không** (khách mới chưa nhập ngày sinh cũng dùng được) |

Hệ quả cho bán hàng: Kỳ Môn là **lý do quay lại thường xuyên** (mỗi lần có việc cần quyết), bổ sung cho các phần "khi nào" đã bán theo năm, tháng. Nó cũng là cửa vào cho người chưa muốn nhập ngày sinh.

Lưu ý trùng lặp: Tiện ích hiện có "gieo quẻ hỏi việc" (Mai hoa) và "chọn ngày tốt theo việc" đang **miễn phí** (`TienIch.gs`, `TT_MIEN_PHI`). Kỳ Môn phải khác rõ: trả lời có **hướng**, có **giờ cụ thể**, có **bàn 9 cung** và văn dài hơn (xem câu hỏi 2, mục 7).

## 2. Sản phẩm đề xuất

### 2a. "Hỏi một việc" – 9 xu (mã mới `km_hoi:<yyyymmddhh>:<loại>`, mua theo tài khoản, không theo lá số)
Luồng: chọn loại việc → (tùy chọn) gõ một câu ngắn → chọn "ngay bây giờ" hoặc "giờ tôi định làm" → xem bàn và lời luận.

| Loại việc | Nhìn vào đâu trên bàn (dụng thần, xem mục 3d) | Giới hạn bắt buộc |
|---|---|---|
| Công việc, xin việc, thăng tiến | cửa Khai + vị trí của người hỏi | – |
| Tiền bạc, mua bán, hợp tác | cửa Sinh + can Mậu | **Không** nói mã cổ phiếu, coin, số tiền; không khuyên vay để đầu tư |
| Tình cảm (đang yêu, tái hợp, hẹn gặp) | can Ất / can Canh + thần Lục Hợp | Hỏi rõ giới tính người kia; đồng giới dùng thần Lục Hợp. Không phán "người ấy ngoại tình" |
| Đi xa, xuất hành, chuyển nhà | ô của hướng định đi + ngựa (dịch mã) | – |
| Thi cử, giấy tờ, hồ sơ | cửa Cảnh + sao Thiên Phụ + can Đinh | – |
| Sức khỏe và nhịp sống | sao Thiên Nhuế + cửa Tử (chỉ ở phần Căn cứ) | **Không chẩn đoán, không nói bệnh gì, không bảo bỏ thuốc.** Chỉ nói nhịp nghỉ, thời điểm thuận để đi khám, người nên hỏi ý kiến (quyết định 24/10) |
| Tranh chấp, kiện tụng, hợp đồng | cửa Khai, cửa Kinh + sao Thiên Tâm | Luôn kèm "nên hỏi luật sư"; không đoán thắng thua theo phần trăm |

Không nhận (hiện lời từ chối nhẹ, không trừ xu): hỏi sống chết, giới tính thai nhi, xổ số, cờ bạc, theo dõi người khác, tìm người mất tích (hướng dẫn báo công an).

Người dùng nhận được (tối thiểu theo chuẩn 9 xu ở rà soát 07):
- **5 đoạn**: kết luận "nên tiến / tiến có điều kiện / nên chờ"; điểm mạnh của bạn; điểm vướng; diễn biến dễ gặp; người hoặc yếu tố hỗ trợ.
- **3 việc nên làm**, mỗi việc kèm **1 khung giờ và 1 hướng** cụ thể trong 3 ngày tới.
- Bàn 9 cung Hologram có chú thích, cùng ô "Căn cứ" thu gọn cho ai muốn xem thuật ngữ.

**"Một việc không hỏi hai lần"** (lệ cổ, đồng thời là luật chống "hỏi lại cho tới khi ra kết quả đẹp"): cùng loại việc trong cùng một giờ âm lịch thì mở lại bản đã mua, không lập bàn mới, không trừ thêm xu. Lời nhắc: "Bàn của giờ này đã trả lời việc của bạn. Nếu tình hình thay đổi, bạn hỏi lại sau ít nhất một ngày."

### 2b. "Giờ tốt – hướng tốt 7 ngày tới"
- **19 xu**: cả 6 loại việc trong 7 ngày (84 bàn, mỗi giờ âm lịch một bàn). Với mỗi loại việc: 3–5 khung giờ tốt nhất kèm hướng; 2–3 khung nên tránh; một đoạn ngắn "vì sao giờ này hợp với việc này".
- **9 xu**: 1 loại việc (ví dụ "ký hợp đồng", "đi gặp đối tác", "khai trương"), 7 ngày.
- Mã mới `km_gio:<ngày bắt đầu>:<loại|all>`. Ai đã mua "Tháng" 9 xu thì có thể gợi ý thêm, nhưng **không gộp** vào Đồng hành năm (nguồn thu lặp lại; xem câu hỏi 4).
- Hiển thị như lịch 7 cột × 12 giờ, ô tốt sáng màu. Một thẻ "Hôm nay" ở đầu trang.

### 2c. Miễn phí để kéo người dùng
- Ai cũng dùng được (cả khách chưa đăng nhập): **bàn 9 cung** của giờ hiện tại, **1 câu kết luận** cho loại việc đã chọn ("Việc này đang ở thế thuận vừa – nên chuẩn bị kỹ rồi mới tiến"), tên 1 hướng thuận. Phần còn lại hiện mờ, kèm lời mời mở 9 xu (lời mời đầu không nhắc xu theo quyết định 16/11, chỉ hiện giá ở tấm xác nhận).
- Tài khoản: **1 khung giờ tốt mỗi ngày** cho việc chung (thẻ "Hôm nay" + có thể đưa vào lời nhắn mỗi sáng 19 xu đang bán).
- Bảng tra 8 cửa, 9 sao, 8 thần đặt trong tab "📚 Tham khảo" (miễn phí, giúp người dùng tin vào cách tính).
- Đối thủ tham khảo: kymonai.vn cho **1 quẻ miễn phí mỗi tuần**, sau đó **30.000đ/quẻ** hoặc 200.000đ/tháng cho 10 quẻ ([bảng giá](https://www.kymonai.vn/goi-cuoc)). Giá 9 xu của ta rẻ hơn khoảng 3 lần, nên không cần thêm lượt miễn phí hằng tuần; quà 39 xu đã đủ hỏi 4 việc.

### 2d. Lời lưu ý bắt buộc và cách nói
- Đầu mỗi kết quả (chữ nhỏ, 1 dòng): "Đây là góc nhìn theo cổ học về thời điểm và hướng đi, để bạn tham khảo và tự cân nhắc. Quyết định cuối cùng là của bạn."
- Với sức khỏe, kiện tụng, tiền bạc, thêm 1 dòng: "Với việc này, hãy hỏi thêm bác sĩ / luật sư / người có chuyên môn tài chính."
- Không dùng các chữ: "chắc chắn", "nhất định", "đại hung", "tai họa", "phá sản", "chết", "bỏ ngay". Thay bằng: "thuận", "cần chuẩn bị thêm", "nên chờ", "nên tránh lúc này".
- Không có số "%". Chỉ dùng 3 mức chữ: **thuận / thuận có điều kiện / nên chờ** (theo quyết định 24/10).
- Không nói "Gia Cát Lượng", không hứa "tiên đoán chính xác" (đối thủ đang quảng cáo như vậy, ta không làm theo).

## 3. Cách tính

### 3a. Chọn trường phái
- **Thời gia Kỳ Môn** (mỗi giờ âm lịch một bàn). Đây là cách được dùng nhiều nhất: trang thayungkhiem.vn đặt làm mặc định ([nguồn](https://thayungkhiem.vn/ky-mon-don-giap)).
- **Chuyển bàn** (sao, cửa, thần xoay vòng quanh 8 ô, ô giữa gửi vào ô Tây Nam). **Không làm phi bàn** ở bản đầu, vì phi bàn bay theo số Lạc Thư, ít sách công khai và các trang cho kết quả khác nhau ([ghi chép phân biệt chuyển bàn và phi bàn](https://www.douban.com/note/683360254); [qimen-2k2 cũng ghi phi bàn có quy tắc khác](https://qimen-2k2.pages.dev/en/guide/)).
- **Định cục Sách Bổ**: nguyên lấy theo "phù đầu", không cần xử lý tháng nhuận cục như phép Trí Nhuận. Phép này được gắn nhãn chuẩn ở thayungkhiem.vn, là phép của phái Trương Chí Xuân mà kymonai.vn dùng ([nguồn](https://www.kymonai.vn/)). Cả 3 thư viện MIT ở mục 4 đều có phép này. Trí Nhuận và Mao Sơn để sau.

### 3b. Dùng lại lịch có sẵn
- `Lunar.gs` đã có kinh độ Mặt Trời theo phút và 24 tiết khí; `BatTu.gs` đã có can chi ngày và giờ. **Không viết lịch mới.**
- Dùng **giờ Việt Nam GMT+7**, giống Bát Tự. Giờ Tý muộn (23–24h) tính sang ngày hôm sau, theo quyết định 1/11. Cách này đổi can ngày, nên đổi luôn phù đầu.
- Kỳ Môn cần **cả 24 tiết** (12 tiết + 12 khí). Bát Tự chỉ cần 12 tiết, nên phải thêm 1 hàm lấy "tiết khí gần nhất trước thời điểm" (chia kinh độ Mặt Trời cho 15°).
- Trong vòng 2 giờ quanh lúc giao tiết khí, kết quả hiện nhãn "giờ giao tiết, nên xem thêm giờ sau".
- Trang Trung Quốc tính theo giờ Bắc Kinh, nên sát giờ giao tiết sẽ lệch với ta. Đây là khác biệt có chủ đích, giống ghi chú đã có ở `README.md` cho Thập nhị trực.

### 3c. Các bước tính (để người lập trình làm sau; file mới đề xuất `KyMon.gs`)
1. **Đầu vào**: thời điểm (giờ Việt Nam). Từ đó lấy can chi ngày, can chi giờ, tiết khí hiện hành.
2. **Âm hay dương độn**: từ Đông chí đến trước Hạ chí là dương độn; từ Hạ chí đến trước Đông chí là âm độn.
3. **Nguyên (thượng, trung, hạ) theo phù đầu**: lùi từ ngày hiện tại về ngày Giáp hoặc Kỷ gần nhất (có thể là chính ngày đó). Đó là phù đầu. Chi của phù đầu là Tý, Ngọ, Mão, Dậu thì lấy thượng nguyên; Dần, Thân, Tỵ, Hợi thì trung nguyên; Thìn, Tuất, Sửu, Mùi thì hạ nguyên ([nguồn mô tả quy tắc](https://qimen-2k2.pages.dev/en/guide/)).
4. **Số cục**: tra bảng 24 tiết × 3 nguyên. Bảng này theo bài ca Yên Ba Điếu Tẩu; khi làm phải đối chiếu lại với thư viện.
   - Dương độn: Đông chí, Kinh trập 1-7-4; Tiểu hàn 2-8-5; Đại hàn, Xuân phân 3-9-6; Lập xuân 8-5-2; Vũ thủy 9-6-3; Thanh minh, Lập hạ 4-1-7; Cốc vũ, Tiểu mãn 5-2-8; Mang chủng 6-3-9.
   - Âm độn: Hạ chí, Bạch lộ 9-3-6; Tiểu thử 8-2-5; Đại thử, Thu phân 7-1-4; Lập thu 2-5-8; Xử thử 1-4-7; Sương giáng, Tiểu tuyết 5-8-2; Hàn lộ, Lập đông 6-9-3; Đại tuyết 4-7-1.
5. **Lớp Đất**: xếp 9 can Mậu, Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất. Bắt đầu từ ô có số bằng số cục, đi theo số Lạc Thư: dương độn đi 1→9, âm độn đi 9→1. Bốn ô theo hướng: 1 Bắc, 8 Đông Bắc, 3 Đông, 4 Đông Nam, 9 Nam, 2 Tây Nam, 7 Tây, 6 Tây Bắc, 5 giữa.
6. **Tuần thủ của giờ**: từ can chi giờ tìm tuần Giáp chứa nó. Giáp ẩn dưới một can: Giáp Tý ẩn Mậu, Giáp Tuất ẩn Kỷ, Giáp Thân ẩn Canh, Giáp Ngọ ẩn Tân, Giáp Thìn ẩn Nhâm, Giáp Dần ẩn Quý. Ô chứa can ẩn đó trên lớp Đất là **ô gốc**.
   - Sao gốc ở ô gốc là **Trực phù**, cửa gốc ở ô gốc là **Trực sử**.
   - Nếu ô gốc là ô giữa: sao gửi theo sao Thiên Nhuế, cửa lấy cửa Tử.
7. **Lớp Trời**: đưa Trực phù tới ô đang chứa can giờ trên lớp Đất (giờ Giáp thì dùng can ẩn). 8 sao xoay theo vòng 8 ô, giữ thứ tự. Mỗi sao mang can lớp Đất ở ô gốc của nó theo cùng (đó là can lớp Trời). Sao Thiên Cầm ở giữa đi chung với Thiên Nhuế, mang thêm can của ô giữa.
8. **Lớp Người**: Trực sử đi từ ô gốc. Giờ tuần thủ là bước 0, mỗi giờ sau đi 1 ô theo số Lạc Thư (dương thuận, âm nghịch). Rơi vào ô 5 thì gửi ô 2. 7 cửa còn lại xoay theo vòng, giữ thứ tự. Trực phù và Trực sử thường **không cùng ô**.
9. **Lớp Thần**: thần Trực Phù đặt cùng ô với sao Trực phù. Rồi xếp Đằng Xà, Thái Âm, Lục Hợp, Bạch Hổ, Huyền Vũ, Cửu Địa, Cửu Thiên: dương độn đi thuận chiều kim đồng hồ, âm độn đi ngược. Một số phái đổi Bạch Hổ, Huyền Vũ thành Câu Trần, Chu Tước khi âm độn; ta chọn **một** cách và ghi rõ.
10. **Phụ trợ**:
    - không vong của tuần giờ (và tuần ngày);
    - ngựa theo chi giờ: Thân Tý Thìn ở Dần, Dần Ngọ Tuất ở Thân, Hợi Mão Mùi ở Tỵ, Tỵ Dậu Sửu ở Hợi;
    - vượng, tướng, hưu, tù, tử của sao và cửa theo mùa;
    - cửa khắc ô (môn bức); phục ngâm, phản ngâm;
    - một danh sách cách cục ngắn (khoảng 20 cách hay gặp, chỉ lấy cách có ≥ 2 nguồn, giống luật thần sát Bát Tự 31/10).
11. **Dụng thần và chấm**: theo bảng ở 2a, tìm ô của dụng thần và ô của người hỏi. Người hỏi là can ngày của thời điểm hỏi; có thể thêm can năm sinh nếu đã có lá số. Chấm 5 yếu tố ra 3 mức chữ:
    - cửa tốt hay xấu, có bị khắc;
    - sao vượng hay suy;
    - thần giúp hay cản;
    - can trời và can đất sinh hay khắc nhau;
    - ô của dụng thần sinh hay khắc ô người hỏi; có không vong, có mộ.
12. **Chọn giờ, hướng**: lập 84 bàn (7 ngày × 12 giờ), chấm ô hợp với loại việc, xếp hạng. Hướng = hướng của ô đó. Apps Script chạy 84 bàn nhẹ, không cần lưu sẵn.

### 3d. Dụng thần (theo nguồn đã đọc)
Tài lộc xem can Mậu hoặc cửa Sinh; tình cảm xem can Canh (người nam) và can Ất (người nữ); cột ngày là người hỏi, cột giờ là sự việc ([Master Sean Chan, bài cho người mới](https://www.masterseanchan.com/vi/blog/cach-doc-ban-do-qi-men-dun-jia-huong-dan-tung-buoc-danh-cho-nguoi-moi-bat-dau/)). Một bài tiếng Trung trên 163.com xếp cửa Khai vào việc khai trương, nhậm chức, ký kết, xin việc. Kết quả tìm kiếm không cho biết chắc đó là bài nào, nên dòng này **chưa có nguồn đã kiểm**. Các dòng sức khỏe, kiện tụng, thi cử lấy theo cách các thư viện mục 4 đang dùng. **Trước khi viết văn, content-creator phải tìm thêm ít nhất 1 nguồn thứ hai** cho từng dòng.

## 4. Kiểm chứng đúng sai

### 4a. Thư viện mã nguồn mở để đối chiếu (chỉ cài trong `tests/`, không đưa vào Apps Script)
| Thư viện | Ngôn ngữ | Giấy phép | Có gì | Dùng thế nào |
|---|---|---|---|---|
| [3meta](https://github.com/3metaJun/3meta) (npm `3meta`, bản 2.6) | JavaScript | **MIT** | Lập bàn từ ngày giờ, 9 ô đủ sao, cửa, thần, can; tuần thủ, không vong, cách cục; có lệnh `qimen` xuất JSON | **Đối chiếu chính** (cùng ngôn ngữ với `tests/` hiện có) |
| [bigfishmarquis-qimen](https://github.com/perfhelf/bigfishmarquis-qimen) (npm, bản 1.0) | TypeScript | **MIT** (© 2026) | Sách Bổ, Mao Sơn, Trí Nhuận; 4 tầng giờ, ngày, tháng, năm; 81 cách cục; ô gửi | Đối chiếu thứ hai, nhất là khi ô giữa gửi ô Tây Nam ([trang gói](https://www.pkgstats.com/pkg:bigfishmarquis-qimen)) |
| [kinqimen](https://github.com/kentang2017/kinqimen) (PyPI) | Python | README ghi **MIT** (cần mở file LICENSE xác nhận) | Sách Bổ và Trí Nhuận, kèm Kỳ Môn ngày | Đối chiếu thứ ba, chạy bằng python3 khi 2 bộ trên lệch nhau |
| [qimendunjia-lite](https://www.pkgstats.com/pkg:qimendunjia-lite) | TypeScript | README ghi MIT, **link GitHub là link giả** | Bản nhẹ, có chọn cách tính giờ Tý muộn | Chỉ tham khảo, không dựa vào |

Cách làm giống iztro cho Tử Vi: viết `tests/ky-mon.js`, sinh **2.000 thời điểm ngẫu nhiên** từ 1950 đến 2050, so từng ô gồm 4 thứ:
- can lớp Đất và can lớp Trời;
- sao;
- cửa;
- thần.

So thêm số cục, âm/dương độn, Trực phù, Trực sử, không vong. Để so được với thư viện tính theo giờ Bắc Kinh: đưa vào **cùng giờ đồng hồ**, và loại các mẫu nằm trong ±2 giờ quanh lúc giao tiết khí (ghi riêng số mẫu bị loại). Mục tiêu: **100% khớp** ngoài vùng giao tiết. Chỗ nào lệch giữa các thư viện thì ghi vào bộ não, chọn theo sách và ghi lý do.

### 4b. Ví dụ có nguồn
1. **Độn Giáp Diễn Nghĩa** (Trình Đạo Sinh, đời Minh; [thư mục CiNii](https://ci.nii.ac.jp/ncid/BA65339246)), phần "Bát môn cửu tinh trục thời di cung":
   - dương độn cục 1, giờ Ất Sửu: sao Thiên Bồng ở ô 9, cửa Hưu ở ô 2;
   - giờ Bính Dần: Thiên Bồng ở ô 8, cửa Hưu ở ô 3.

   Ví dụ này kiểm đúng việc Trực phù và Trực sử đi riêng.
2. **Ngày 7/8/2022** (năm Nhâm Dần, tháng Mậu Thân, ngày Nhâm Thìn): sau giờ giao tiết Lập thu thì là hạ nguyên, **âm độn cục 8** ([bài trên gcores](https://www.gcores.com/articles/160638)). Lập thu năm đó giao vào tối 7/8 (khoảng 21 giờ 29 giờ Bắc Kinh, tức khoảng 20 giờ 29 giờ Việt Nam; cần đối chiếu lại bằng `Lunar.gs`). Trước giờ đó vẫn là Đại thử hạ nguyên, âm độn cục 4. Đây là ca kiểm thử **giờ giao tiết** rất tốt.
3. **Đông chí thượng nguyên là dương độn cục 1** ([Master Sean Chan – 18 cục](https://www.masterseanchan.com/qmdj-18-dun-periods/)).

Dò tay thêm 20 bàn trên các trang lập bàn miễn phí: [thayungkhiem.vn](https://thayungkhiem.vn/ky-mon-don-giap) (chọn Sách Bổ, chuyển bàn), [máy tính Master Sean Chan](https://www.masterseanchan.com/qi-men-dun-jia-calculator/), [qimen-2k2](https://qimen-2k2.pages.dev/en/guide/). Reality-checker đọc thử 3 câu hỏi mẫu cho mỗi loại việc trước khi bật bán (theo rủi ro R3, rà soát 07).

## 5. Khung văn luận và 2 đoạn mẫu

Mỗi lời luận gồm 3 tầng, cùng một kết luận, không mâu thuẫn:
1. **Kết luận** (dễ hiểu, giọng "Việc này có xu hướng… / Bạn đang ở thế…"): 1 trong 3 mức thuận, thuận có điều kiện, nên chờ. Không tên sao, tên cửa, tên thần.
2. **Căn cứ** (thu gọn, cho ai muốn biết): được nêu thuật ngữ, mỗi thuật ngữ kèm nghĩa trong ngoặc. Ví dụ: "cửa Sinh (cửa của sinh sôi, tiền vào)".
3. **Việc nên làm** (giọng nhẹ nhàng, không phán xét): 3 việc, mỗi việc có giờ và hướng. Nếu kết luận là "nên chờ" thì nói **chờ đến khi nào** và **chuẩn bị gì trong lúc chờ**.

Ghép văn từ khối: content-creator viết cho mỗi loại việc 3 mức kết luận, rồi 8 cửa × 2 trạng thái (đắc lực / bị khắc), 9 sao × 2, 8 thần, khoảng 20 cách cục. Mỗi khối 1–3 câu. Ước khoảng 300 khối.

**Mẫu 1 – Tiền bạc, mức "thuận có điều kiện"**
> **Kết luận.** Việc hợp tác bạn đang hỏi có xu hướng **mang lại lợi**, nhưng lợi đến chậm hơn bạn mong. Bạn đang ở thế người nắm phần chủ động. Chỗ vướng nằm ở giấy tờ và cách chia phần, chưa nằm ở con người.
> **Căn cứ.** Cửa Sinh (cửa của sinh sôi, tiền vào) ở ô Đông Nam, đang được mùa nâng đỡ. Can Mậu (đại diện cho vốn) nằm cùng phía với người hỏi. Ô của sự việc gặp thần Huyền Vũ (chủ sự mập mờ, dễ thiếu rõ ràng), nên cần xem kỹ điều khoản.
> **Việc nên làm.** (1) Trước khi ký, đề nghị ghi rõ tỷ lệ chia và thời hạn rút vốn bằng văn bản. (2) Hẹn gặp chốt vào giờ Tỵ (9–11h) thứ Năm, ngồi quay mặt về hướng Đông Nam. (3) Chưa nên dồn hết vốn một lần; chia làm hai đợt sẽ giúp bạn yên tâm hơn. Nếu là khoản lớn, hãy hỏi thêm người có chuyên môn tài chính.

**Mẫu 2 – Sức khỏe và nhịp sống, mức "nên chờ"**
> **Kết luận.** Giai đoạn này cơ thể bạn có xu hướng **cần được nghỉ nhiều hơn** là cố gắng thêm. Kế hoạch tập nặng hay thức khuya để kịp việc nên tạm lùi lại vài ngày.
> **Căn cứ.** Sao Thiên Nhuế (sao chỉ sự mệt mỏi, cần chăm sóc) đang mạnh và rơi đúng ô của người hỏi. Ô này lại gặp cửa Đỗ (cửa của sự bế tắc, cần dừng lại). Đây là tín hiệu về nhịp sinh hoạt, **không phải kết luận về bệnh**.
> **Việc nên làm.** (1) Ba ngày tới, đi ngủ trước 23 giờ và giảm cà phê buổi chiều. (2) Nếu có điều lo lắng, đặt lịch khám vào buổi sáng thứ Hai (giờ Thìn, 7–9h). Đây là khung giờ thuận để trao đổi kỹ với bác sĩ. (3) Một buổi đi bộ nhẹ về phía Đông vào sáng sớm sẽ giúp bạn lấy lại nhịp. Lời này chỉ để tham khảo, không thay lời khuyên của bác sĩ.

## 6. Công sức, rủi ro

### 6a. Ước lượng (S ≈ 1–2 ngày, M ≈ 3–5 ngày, L ≈ 1–2 tuần)
| Phần | Cỡ | Chuyên gia |
|---|---|---|
| `KyMon.gs`: lập bàn, 24 tiết, phù đầu, 4 lớp, không vong, ngựa, vượng suy | M | backend-architect |
| `tests/ky-mon.js` đối chiếu 3meta + bigfishmarquis (2.000 mẫu) + 3 ví dụ sách | S–M | code-reviewer |
| Dụng thần, chấm 3 mức, 20 cách cục, xếp hạng 84 bàn | M | backend-architect |
| Văn luận khoảng 300 khối, 7 loại việc, lời từ chối nhẹ | **L** | content-creator |
| Giao diện: form hỏi, bàn 9 cung Hologram, lịch 7 ngày, ô Căn cứ | M | ui-designer, frontend-developer |
| Bán hàng: mã `km_hoi`, `km_gio`, luật "một việc không hỏi hai lần", miễn phí 1 câu | S | – |
| Thủ tục:<br>• thêm `KyMon.gs` vào `HAM_CAN_CO`;<br>• cập nhật số file trong `HUONG-DAN-CAI-DAT.md`;<br>• chạy `tao-ds-file.py`;<br>• tăng 3 mã phiên bản giao diện;<br>• cập nhật bộ não | S | – |
| Rà trước khi bật: reality-checker đọc 21 câu hỏi mẫu | S | reality-checker |

Tổng: khoảng **3–5 tuần làm việc**. Nên chia 2 đợt:
- **Đợt 1**: "Hỏi một việc" + miễn phí 1 câu.
- **Đợt 2**: "Chọn giờ, chọn hướng 7 ngày".

### 6b. Rủi ro
- **Pháp lý.** Nghị định 38/2021/NĐ-CP (Điều 14, khoản 7, điểm đ) phạt 15–20 triệu đồng hành vi tổ chức hoạt động mê tín dị đoan như bói toán. Tái phạm có thể bị xử lý theo Điều 320 Bộ luật Hình sự ([LuatVietnam](https://luatvietnam.vn/linh-vuc-khac/to-chuc-xem-boi-co-vi-pham-phap-luat-khong-883-90440-article.html); [Thư viện pháp luật](https://thuvienphapluat.vn/phap-luat/hanh-nghe-boi-toan-me-tin-di-doan-de-lua-tien-co-bi-xu-phat-khong-muc-phat-bao-nhieu-672.html)).
  - Kỳ Môn mang tính "hỏi việc" nên gần với bói hơn 6 hệ hiện có.
  - Cách giảm rủi ro: gọi là "**góc nhìn cổ học về thời điểm và hướng đi**", không dùng chữ "bói", "tiên đoán", "giải hạn"; không bán lễ, bùa, vật phẩm; không hứa kết quả; luôn có lời lưu ý.
  - **Nên hỏi luật sư một lần** cho toàn web, không riêng Kỳ Môn.
- **Câu hỏi nhạy cảm**: sức khỏe, kiện tụng, tiền đầu tư, tình cảm người thứ ba. Phòng bằng 3 cách:
  - bảng giới hạn ở 2a;
  - danh sách không nhận;
  - ô gõ câu hỏi tự do chỉ để gợi ý văn, **không** để máy đoán theo chữ người dùng gõ.
- **Chất lượng.**
  - Kết quả 9 xu bị chê ngắn: giữ chuẩn 5 đoạn + 3 việc có giờ và hướng.
  - Kết quả mâu thuẫn với lời nhắn mỗi sáng hoặc lịch "chọn ngày tốt" miễn phí: ghi rõ mỗi hệ có cách chia thời gian riêng (quyết định "không luận hệ này theo hệ kia").
  - Thêm nút "Có ích / Chưa có ích".
- **Sai lịch ở giờ giao tiết, giờ Tý**: có nhãn cảnh báo và có kiểm thử riêng (mục 4b, ví dụ 2).
- **Trùng với tiện ích miễn phí** "gieo quẻ hỏi việc": xem câu hỏi 2.

## 7. Câu hỏi chủ dự án cần quyết
1. **Đặt ở đâu**: tab mới "Kỳ Môn" (hệ thứ 7) hay một mục trong Tiện ích? Đề xuất: **mục riêng trong Tiện ích**, có lối tắt ở trang chủ "Hỏi một việc". Lý do: Kỳ Môn không cần lá số và không thuộc Tổng hợp 6 hệ.
2. **Gieo quẻ Mai hoa miễn phí** giữ nguyên, hay chuyển thành phần "miễn phí 1 câu" của Kỳ Môn để khỏi có hai thứ "hỏi việc" na ná nhau?
3. **Giá**: Hỏi một việc 9 xu; Chọn giờ 7 ngày 19 xu (cả 6 việc) và 9 xu (1 việc). Đồng ý không?
4. **Có đưa vào combo không**? Đề xuất: **không** đưa vào Đồng hành năm 49 hay Trọn đời 89, để giữ nguồn thu lặp lại. Có thể bán sau gói "5 câu hỏi 39 xu".
5. **Khách chưa đăng nhập** có được xem bàn 9 cung và 1 câu kết luận không? Đề xuất: **có** (cửa vào cho người chưa muốn nhập ngày sinh).
6. **Người hỏi** lấy theo can ngày của lúc hỏi (chuẩn sách), hay thêm can năm sinh nếu đã có lá số? Đề xuất: **cả hai**, can ngày là chính.
7. **Giờ**: giờ đồng hồ Việt Nam (giống Bát Tự), hay cho chọn giờ mặt trời thực theo nơi đứng? Đề xuất: **giờ Việt Nam**, để giờ mặt trời thực sau.
8. Loại việc **sức khỏe** và **kiện tụng** có mở bán ở đợt 1 không, hay để đợt 2 sau khi có ý kiến luật sư?
9. Câu hỏi tự do người dùng gõ có **lưu vào Sheet** không? Đề xuất: **không lưu nội dung**, chỉ lưu loại việc và giờ, vì câu hỏi thường rất riêng tư.

Việc sau khi duyệt:
- content-creator tìm nguồn thứ hai cho bảng dụng thần và viết 300 khối văn;
- backend-architect viết `KyMon.gs` + `tests/ky-mon.js`;
- ui-designer vẽ bàn 9 cung và lịch 7 ngày;
- reality-checker đọc thử trước khi bật.

## Nguồn
- Cách lập bàn, phái:
  - [thayungkhiem.vn – Kỳ Môn online](https://thayungkhiem.vn/ky-mon-don-giap)
  - [qimen-2k2 – hướng dẫn](https://qimen-2k2.pages.dev/en/guide/)
  - [Master Sean Chan – cách đọc bàn (tiếng Việt)](https://www.masterseanchan.com/vi/blog/cach-doc-ban-do-qi-men-dun-jia-huong-dan-tung-buoc-danh-cho-nguoi-moi-bat-dau/)
  - [Master Sean Chan – 18 cục](https://www.masterseanchan.com/qmdj-18-dun-periods/)
  - [Douban – chuyển bàn và phi bàn](https://www.douban.com/note/683360254)
  - [gcores – định cục, ví dụ 2022](https://www.gcores.com/articles/160638)
  - [Wikipedia tiếng Trung – Kỳ Môn Độn Giáp](https://zh.wikipedia.org/wiki/奇門遁甲)
  - [CiNii – Độn Giáp Diễn Nghĩa](https://ci.nii.ac.jp/ncid/BA65339246)
- Thư viện:
  - [3meta](https://github.com/3metaJun/3meta)
  - [bigfishmarquis-qimen](https://github.com/perfhelf/bigfishmarquis-qimen)
  - [kinqimen](https://github.com/kentang2017/kinqimen)
  - [qimendunjia-lite](https://www.pkgstats.com/pkg:qimendunjia-lite)
- Thị trường Việt Nam:
  - [kymonai.vn](https://www.kymonai.vn/) và [bảng giá](https://www.kymonai.vn/goi-cuoc)
  - [thayungkhiem.vn](https://thayungkhiem.vn/ky-mon-don-giap)
  - [truyennghe.com – bài giờ tốt hướng đẹp hằng ngày theo Kỳ Môn](https://truyennghe.com/gio-tot-huong-dep-ky-ket-xuat-hanh-theo-ky-mon-don-giap-31-08-2026/)
- Pháp lý:
  - [LuatVietnam](https://luatvietnam.vn/linh-vuc-khac/to-chuc-xem-boi-co-vi-pham-phap-luat-khong-883-90440-article.html)
  - [Thư viện pháp luật](https://thuvienphapluat.vn/phap-luat/hanh-nghe-boi-toan-me-tin-di-doan-de-lua-tien-co-bi-xu-phat-khong-muc-phat-bao-nhieu-672.html)
