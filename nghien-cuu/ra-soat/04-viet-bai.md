# 04 – Rà soát cách viết bài luận (6 hệ + Tổng hợp + Vận hạn)

Người rà: chuyên gia content-creator · 16/11/2026 · Chỉ rà soát và đề xuất, không sửa mã.
Cách làm: đọc trực tiếp kho văn trong mã nguồn (`DeHieu.gs`, `TuViHeThong.gs`, `TuViTrinhTu.gs`, `TongHop.gs`, `LuanGiai.gs`, `BatTuLuan.gs`, `ThanSoHoc.gs`, `HoiTu.gs`, `VanSau.gs`). Phiên này **không chạy được lệnh**, nên không có ảnh chụp hay số đếm chữ thật. Độ dài ghi bên dưới là ước lượng từ kho văn. Vài chỗ cần chụp màn hình để chắc chắn (đánh dấu "cần xác minh").

## Tóm tắt 5 dòng
1. **Tầng dễ hiểu của Tử Vi còn rất nhiều tên sao và thuật ngữ.** Nhiều câu mở đầu bằng "Có Hóa Kỵ —", "Có Kình Dương hoặc Đà La —", "cung Phu Thê VCD", "kẹp bằng sát tinh". Mục "Yếu tố đặc biệt" in nguyên tên sao vòng Tràng Sinh/Thái Tuế. Đây là lỗi nặng nhất so với quy tắc chủ dự án đã chốt.
2. **Vẫn còn câu nặng, không kèm hướng khắc phục:** "gặp mất mát đột ngột", "dễ có tin buồn", "đề phòng bạn bè phản trắc", "đề phòng hỏa hoạn", "Mũi tên Uất giận / Hỗn loạn", "mất mát ở hai lĩnh vực"… Có cả lời khuyên tài chính cụ thể không nên đưa ("Mua nhà sớm nhất có thể", "đầu tư đất nền chờ tăng giá").
3. **Hai tầng dễ mâu thuẫn:** đoạn "Tóm tắt" mỗi cung Tử Vi được chọn theo *tên chính tinh*, bỏ qua sao sáng hay tối và các sao xấu đi kèm. Vì vậy cung bị chấm 3/10 vẫn có thể mở đầu bằng "bạn giỏi kiếm và giữ tiền", trong khi tab Tổng hợp lại ghi "tiền bạc dễ vào ra thất thường".
4. **Lặp ý và văn "ai đọc cũng đúng":** câu "giữ nếp sinh hoạt điều độ, khám định kỳ" xuất hiện khoảng 10 nơi, "cẩn trọng giấy tờ, hợp đồng" hơn 10 nơi, "con cái là chuyện cần thời gian và sự vun đắp" 4 nơi. Nhiều mục "Lời khuyên" cố định, mọi lá số đều ra giống nhau.
5. **Mạch bài thiếu ba thứ:** phần tóm tắt cả hệ ở đầu bài (Tử Vi vào thẳng cung Mệnh), phần kết, và cầu nối sang phần trả phí. Văn Tử Vi dài gấp 5–8 lần các hệ khác, đọc trên điện thoại rất mệt. Giọng nhiều chỗ còn kiểu "thầy phán" và mặc định người đọc đã có gia đình, nhà đất; chưa hợp người 22–40 tuổi.

---

## A. Vấn đề và đề xuất theo mức

### MỨC CAO

**C1. Tên sao và thuật ngữ trong tầng dễ hiểu Tử Vi**
- Chỗ:
  - `TuViHeThong.gs`: kho câu phụ tinh từng cung, dòng 511–531 (Tài Bạch), 688–714 (Quan Lộc), 1049–1066 (Điền Trạch), 1548–1563 (Nô Bộc), 1588–1599 (Phụ Mẫu).
  - `TuViHeThong.gs`: dòng 1421–1424 (Tứ Hóa tại Thiên Di), 1436–1450 (Cảnh báo khi ra ngoài), 2605 (câu Tứ Hóa chung), 2788–2811 (giáp cung), 197–244 (ba vòng sao).
- Vấn đề: các câu này được ghép thẳng vào đoạn dễ hiểu qua chuỗi "Cụ thể: …", "Ngoài ra: …" (`sinhVanCungThienDi_` dòng 1470–1499, `sinhVanCungPhuThe_` dòng 3272–3308). Riêng mục "Yếu tố đặc biệt của cung này" (3308) và "Ảnh hưởng từ các cung xung quanh" (3298) chỉ gồm toàn câu kỹ thuật.
- Bằng chứng:
  - 2605: `'Sao ' + tenSao + ' Hóa Kỵ — đây là điểm cần đặc biệt lưu ý. Dễ gặp trở ngại, hiểu lầm, hoặc hao tổn ở lĩnh vực này.'`
  - 1450: "Sát tinh kẹp hai bên cung Thiên Di — ra ngoài bị kìm kẹp, khó phát huy."
  - 416: "nếu bạn đời là Thiên Lương…"; 388: "nếu bạn đời có Liêm Trinh…"; 429: "Vì cung Phu Thê VCD…"
  - 426, 601, 1014: "cung … không có chính tinh"
  - 243: "Điếu Khách (tin buồn, khoác lác): dễ có tin buồn"
  - 461, 638: "đây là tài tinh"; 466: "tiền hung hậu cát" (không giải nghĩa)
  - `TuViTrinhTu.gs` 29–34 (trường `de`, tức tầng dễ hiểu): "Thân ở cung Phúc", "Thân ở cung Quan", "cung Phối", không giải nghĩa. Tên nhóm bước ở dòng 12–13: "Ba vòng sao", "Các nhóm sao".
  - `TongHop.gs` 300 (kết luận Vóc dáng): "khí chất ' + tên chính tinh Mệnh", tức in tên sao ngay trong câu kết luận.
- Đề xuất:
  - (a) Mỗi câu phụ tinh tách thành hai trường: `de` (không tên sao) và `ky` (có tên sao). Đoạn dễ hiểu chỉ ghép `de`, còn `ky` đưa vào khối `<details class="chuyen-sau">`.
  - (b) Bỏ hẳn hai mục "Ảnh hưởng từ các cung xung quanh" và "Yếu tố đặc biệt" khỏi tầng dễ hiểu. Gộp nghĩa của chúng thành một câu "Điều hỗ trợ / điều cản trở bạn ở mặt này" (chỉ chọn câu có nghĩa đời thường).
  - (c) Thêm bộ lọc chặn ở máy chủ: nếu câu của tầng dễ hiểu còn chứa tên trong danh sách ~120 sao và các từ "VCD", "chính tinh", "sát tinh", "cát tinh", "Tuần", "Triệt", "Hóa Kỵ"… thì ghi lỗi vào kiểm thử. Mở rộng `dhBoTenSao_` (DeHieu.gs 475) thành hàm dùng chung cho mọi hệ.
  - (d) Viết lại 3 câu "Thân cư…" của TuViTrinhTu theo kiểu: "Nửa sau cuộc đời, bạn có xu hướng đặt trọng tâm vào…".
- Công sức: **L** (khoảng 250 câu cần thêm bản `de`), bộ lọc kiểm thử **S**.

**C2. Câu nặng, đoán xấu, thiếu hướng khắc phục**
- Bằng chứng (trích nguyên văn):
  - `TuViHeThong.gs`:
    - 144: "Cuộc đời bạn có những lúc thăng trầm, đôi khi gặp mất mát đột ngột."
    - 151: "hao tổn hoặc hụt hẫng không rõ lý do."
    - 225 và 1562: "tiểu nhân ngầm phá", "đề phòng bạn bè phản trắc".
    - 238, 243: "dễ có chuyện buồn thương", "dễ có tin buồn".
    - 338: "Hôn nhân có thể bùng nổ cãi vã — vợ chồng nóng nảy, dễ to tiếng." (không có hướng khắc phục)
    - 340: "dù bên nhau vẫn thấy cô đơn."
    - 402: "Hai người dễ cãi vã to tiếng."
    - 527: "thắng lớn hoặc thua đậm."
    - 1439: "dễ gặp hụt hẫng, mất mát. Cẩn thận bị lừa đảo…"
    - 1563, 1066: "có thể dẫn đến kiện tụng."
    - 1595: "chú ý sức khỏe cha mẹ, có thể có tin buồn."
    - 1061: "đề phòng hỏa hoạn."
  - `ThanSoHoc.gs`:
    - 23: số 7 có từ khóa "học qua mất mát".
    - 40: "Hai số 7: mất mát ở hai lĩnh vực."
    - 47–53: tên mũi tên trống "Uất giận", "Hỗn loạn", "Thụ động", "Trì hoãn", "Hoài nghi".
    - 34–35: "hay cô đơn", "rất nhạy cảm, dễ lo âu, cô đơn".
  - `DeHieu.gs`:
    - 144: Nô Bộc "được chăng hay chớ".
    - 145: "Con đường sự nghiệp gập ghềnh".
    - 376, 380: Human Design "bực bội kéo dài là dấu hiệu bạn đang làm sai việc", "đang ở sai môi trường". Giọng phán xét.
  - `HoiTu.gs` 21–23: tên chủ đề người dùng nhìn thấy: "Hao tài – rủi ro tiền bạc", "Biến động gia đạo – nhà cửa". Tên khối "Biến cố hội tụ" cũng dễ làm người đọc sợ.
- Đề xuất: áp công thức 3 vế cho mọi câu "yếu": **xu hướng (nhẹ) + biểu hiện đời thường + một việc làm được ngay**. Ví dụ:
  - "Bạn có xu hướng gặp vài khoản chi bất ngờ; một quỹ dự phòng 3 tháng lương giúp bạn vững tâm."
  - Đổi tên mũi tên thành tên trung tính: "Mũi tên cần rèn: kế hoạch cảm xúc"…
  - Đổi "Biến cố hội tụ" thành "Những năm đáng chú ý"; "Hao tài" thành "Năm nên giữ tiền chắc tay"; "Biến động gia đạo" thành "Năm nên vun đắp gia đình".
  - Bỏ hẳn các câu đoán về người thân ("tin buồn", "sức khỏe cha mẹ").
- Công sức: **M**.

**C3. Lời khuyên tài chính / bất động sản cụ thể (rủi ro trách nhiệm)**
- Chỗ: `TuViHeThong.gs` 1085–1089, 1107, 1076–1078, 593–595.
- Bằng chứng: "Mua nhà sớm nhất có thể — giá bất động sản thường tăng", "mua trả góp hoặc vay ngân hàng", "đầu tư vào đất nền chờ tăng giá", "mua đi bán lại", "giữ tỷ lệ nợ dưới 50% thu nhập", "phong thủy tốt giúp tài lộc hanh thông".
- Vấn đề: đây là lời khuyên đầu tư thật, áp chung theo tên sao. Người 22–40 tuổi phần lớn chưa có nhà. Nếu họ làm theo mà thiệt hại thì uy tín của web bị ảnh hưởng.
- Đề xuất: chuyển sang lời khuyên về **thói quen và nguyên tắc** ("ưu tiên an cư rồi mới đầu tư", "đọc kỹ giấy tờ trước khi ký"). Bỏ hết con số, kênh đầu tư cụ thể và lời khuyên vay nợ.
- Công sức: **S**.

**C4. Hai tầng mâu thuẫn ở Tử Vi (Tóm tắt theo tên sao, điểm theo cả lá số)**
- Chỗ: `xacDinhNhomTaiBach_` (TuViHeThong.gs 3325–3333), `xacDinhNhomPhuThe_` (3189–3198), `xacDinhNhomThienDi_` (quanh 1400). Các nhóm Quan Lộc, Điền Trạch, Tật Ách làm tương tự.
- Vấn đề: nhóm văn A–F được chọn chỉ theo tên chính tinh. Sao tối (hãm) chỉ hạ fact xuống "trung", còn đoạn `tomTat` vẫn giữ giọng của nhóm. Hệ quả:
  - Cung Tài Bạch có chính tinh tối, gặp sao xấu, điểm khoảng 3/10, vẫn mở đầu bằng "bạn có tố chất làm kinh tế, giỏi kiếm và giữ tiền" (dòng 543).
  - Cùng lúc đó Tổng hợp 6 hệ lấy câu theo điểm: "Tiền bạc dễ vào ra thất thường" (DeHieu.gs 615). Người đọc thấy hai tab nói ngược nhau.
- Đề xuất: mỗi nhóm có 3 biến thể `tomTat` theo mức điểm cung (thuận / vừa / cần chăm chút), dùng chung ngưỡng `th6Huong_` (DeHieu.gs 626). Câu đầu của mỗi cung phải trùng hướng với điểm hiện cạnh tên cung.
- Thêm kiểm thử: với 200 lá số ngẫu nhiên, kiểm tra hướng của `tomTat` khớp hướng điểm.
- Công sức: **M** (khoảng 40 câu tóm tắt mới) + **S** kiểm thử.

**C5. Mặc định người đọc đã có gia đình, nhà cửa; giọng "thầy phán"**
- Bằng chứng:
  - Phu Thê dùng tiêu đề "Kiểu hôn nhân bạn sẽ có" (3277) và các câu "Hôn nhân của bạn có nhiều sóng gió" (402).
  - "nên kết hôn muộn" lặp ở dòng 270, 309, 342.
  - Tật Ách nhóm E (1004–1010) nhắc "rượu bia" ba lần và chữ "quan hệ".
  - Điền Trạch: "gần chùa hoặc đình làng" (1095).
  - DH_BT_LV Tử Tức mức 4 (DeHieu.gs 140): "chủ động chăm sóc sức khỏe hai vợ chồng", ngầm gợi ý chuyện khó có con.
- Đề xuất:
  - Viết Phu Thê theo hai trạng thái: "Nếu bạn đang tìm hiểu…" / "Nếu bạn đã có đôi…". Đổi tiêu đề thành "Kiểu gắn bó hợp với bạn".
  - Bỏ "kết hôn muộn", thay bằng "bạn hợp với mối quan hệ được tìm hiểu đủ lâu".
  - Bỏ các câu gợi ý chuyện khó có con.
- Công sức: **M**.

### MỨC VỪA

**V1. Lặp ý giữa các hệ và trong cùng một hệ**
- "giữ nếp sinh hoạt điều độ… khám định kỳ" xuất hiện ở:
  - DeHieu.gs 142 (cả 5 mức), 495, 619
  - TuViHeThong.gs 223, 347, 403, 1003–1021
  - TuViTrinhTu.gs 49
  - TongHop.gs 252
- "cẩn trọng giấy tờ, hợp đồng" xuất hiện ở:
  - TuViHeThong.gs 226, 237, 241, 485, 531, 705, 1424
  - LuanGiai.gs 79, 83
- "Con cái là chuyện cần thời gian và sự vun đắp" xuất hiện ở: DeHieu.gs 140 (hai mức), 275, 618.
- Trong Tử Vi có tới 4 lớp cùng nói 12 lĩnh vực: 12 cung dễ hiểu (TuViHeThong), 26 bước (TuViTrinhTu, có 7 chủ đề đời sống), luận chuyên sâu 12 cung (LuanGiai), đối chiếu các phái (TuViTamPhap).
- Đề xuất:
  - Mỗi chủ đề chỉ có **một câu chủ** ở một nơi; nơi khác dẫn về chỗ đó.
  - Gom văn sức khỏe của mọi hệ thành một khối "Nhịp sống hợp với bạn", nằm ở Tổng hợp.
  - Chuyển 26 bước TuViTrinhTu vào khối chuyên sâu (mặc định đóng), không đặt song song với 12 cung.
  - Thêm bộ đếm lặp trong kiểm thử: một cụm 6 chữ trở lên xuất hiện quá 2 lần trong cùng một bài thì cảnh báo.
- Công sức: **M**.

**V2. Văn chung chung, lá số nào cũng ra giống nhau**
- Chỗ:
  - `DeHieu.gs` 490–498: lời khuyên của 9 nhóm tổng hợp cố định, ví dụ "Dành thời gian tĩnh lặng mỗi ngày", "Làm việc thiện nhỏ đều đặn".
  - `DeHieu.gs` 305: lời khuyên tình yêu Chiêm tinh cố định.
  - `DeHieu.gs` 314: lời khuyên sự nghiệp Chiêm tinh cố định.
  - `DeHieu.gs` 205: câu "Tổng quan" của 12 lĩnh vực Bát Tự chỉ giải thích phương pháp.
  - `DeHieu.gs` 446: phần "Tóm tắt" của Hà Lạc giải thích phương pháp, không nói gì về người đọc.
- Vấn đề: người 22–40 tuổi hay chụp màn hình gửi bạn bè so sánh. Khi thấy hai người nhận cùng câu, họ mất niềm tin vào kết quả.
- Đề xuất:
  - Mỗi lời khuyên phải gắn với **một dữ kiện riêng của lá số** (hành, điểm, nhóm), viết theo mẫu "Vì [điều riêng của bạn], hãy [việc cụ thể]".
  - Mỗi bài có ít nhất 3 câu "chỉ bạn mới có", ví dụ kết hợp nhật chủ với dụng thần, hay Mặt Trời với cung Mọc.
  - Câu giải thích phương pháp chuyển xuống khối chuyên sâu.
- Công sức: **M**.

**V3. Cấu trúc bài: thiếu tóm tắt cả hệ, thiếu phần kết, mỗi đoạn quá dài**
- Tử Vi:
  - Không có "bức tranh chung" ở đầu bài; mỗi cung tự có "Tóm tắt" riêng.
  - Mỗi cung 6–8 đoạn. Các đoạn bị ghép thêm "Cụ thể: …" (1470), "Các yếu tố hỗ trợ: …" (1483), "Ngoài ra: …" (3285) nên dễ thành khối 120–200 chữ.
  - Ước lượng cả 12 cung khoảng 7.000–9.000 chữ. Bát Tự dễ hiểu khoảng 900–1.200 chữ, Hà Lạc khoảng 600–900 chữ.
- Không hệ nào có đoạn kết ("3 điều mang theo") hay cầu nối sang Tổng hợp hoặc vận năm.
- Đề xuất: dùng chung khung bài ở mục B. Trên điện thoại, mỗi đoạn không quá 60 chữ, mỗi danh sách không quá 3 ý. Cắt chuỗi "Cụ thể:" xuống tối đa 1 câu.
- Công sức: **M** (đa phần là sắp lại thứ tự khối trong `DeHieu.gs` và các hàm `sinhVanCung*`).

**V4. Thuật ngữ chưa giải nghĩa ở các hệ khác**
- `DeHieu.gs` 411: "Hồ sơ 4/6:" in con số trần, người đọc không hiểu.
- `DeHieu.gs` 46–110: "Bạn sinh vào ngày Giáp…" dùng tên can. Tạm chấp nhận được vì có hình tượng đi kèm.
- `DeHieu.gs` 515: "Cung Tài Bạch (tiền bạc) được chấm…" trong Tổng hợp. Nên đổi thành "Mặt tiền bạc (Tử Vi)".
- `TongHop.gs` 165–166, 249: "Niên trụ", "Nhật chủ", "Thân nhược" xuất hiện ở phần nguồn. Phần này chấp nhận được nếu nằm trong khối chuyên sâu (cần xác minh trên giao diện).
- `LuanGiai.gs` 59–83 (tầng chuyên sâu): các thành ngữ cổ "Nhật chiếu lôi môn", "Thủy trừng quế ngạc", "Tài dữ tù cừu", "quan phong tam đại" chưa được dịch nghĩa. Quy tắc yêu cầu giải nghĩa cả ở tầng chuyên sâu.
- Đề xuất: thêm ngoặc giải nghĩa ngắn, hoặc chú thích bấm chạm để xem nghĩa. Bỏ số Hồ sơ khỏi tầng dễ hiểu.
- Công sức: **S–M**.

**V5. Thần số học: câu "Thiếu 9" đánh trúng nhóm khách chính**
- Chỗ: `ThanSoHoc.gs` 42: "Thiếu 9: ít tham vọng xã hội (hiếm gặp với người sinh thế kỷ 20)".
- Vấn đề: người sinh từ năm 2000 (hiện 22–26 tuổi) rất thường thiếu số 9. Họ là nhóm khách chính, vậy mà nhận câu chê "ít tham vọng", kèm ghi chú "hiếm gặp" sai với thế hệ của họ.
- Đề xuất: "Thiếu 9: bạn có xu hướng đặt mục tiêu gần, thực tế trước; lý tưởng lớn sẽ đến khi bạn tìm được việc mình thấy ý nghĩa." Bỏ phần "hiếm gặp…".
- Công sức: **S**.

**V6. Tổng hợp: mục "Cơ thể" chỉ là lời từ chối, chiếm chỗ vô ích**
- Chỗ: `TongHop.gs` 309–327 (`thCoThe_`).
- Vấn đề: cả mục chỉ có 3 đoạn giải thích rằng hệ thống không nói gì về cơ thể. Mục này nằm trong phần trả phí, người mua sẽ thấy hụt.
- Đề xuất: bỏ mục khỏi bài. Một câu lưu ý ngắn trong dòng `.tcc-luu-y` là đủ.
- Công sức: **S**.

**V7. Vận hạn: lý do kỹ thuật lẫn vào lời đời thường**
- Chỗ: `VanSau.gs` 91–117, `HoiTu.gs` 61–79.
- Vấn đề: chuỗi `ly` ("Hóa Kỵ tháng (…) nhập Tật Ách của tháng", "tuế vận tịnh lâm – năm biến động lớn") cần được giữ trong khối căn cứ. Cần chụp màn hình để kiểm tra tab Vận hạn có hiện câu này ở tầng dễ hiểu hay không.
- Thêm: nhãn "năm biến động lớn" (HoiTu.gs 73) nên đổi thành "năm có nhiều chuyển động".
- Đề xuất: mỗi tháng chỉ hiện 1 câu chủ đề + 1 việc nên làm + 1 việc nên tránh; phần lý do nằm trong ô "Vì sao".
- Công sức: **M**.

### MỨC THẤP

- **T1.** Lỗi câu khi ghép chủ ngữ: "Nhà cửa của bạn thuộc mẫu người…" (TuViHeThong.gs 1031, 1041), "Bạn bè… thuộc mẫu người" lặp liên tục. Nên đổi thành "Không gian sống bạn thích là…". Công sức **S**.
- **T2.** Câu mở "Bạn thuộc mẫu người…" lặp ở đầu gần mọi đoạn. Nên xoay vòng 4–5 kiểu mở: "Bạn có xu hướng…", "Người như bạn thường…", "Điểm dễ nhận ra ở bạn là…". Công sức **S**.
- **T3.** Dấu "—" và "–" dùng lẫn lộn giữa các file. Thống nhất dùng "–". Công sức **S**.
- **T4.** Chiêm tinh tầng dễ hiểu có nêu "Mặt Trời / Mặt Trăng / cung Mọc" (DeHieu.gs 287, 292–293). Có thể giữ, vì đây là "ba điểm chính" người dùng chờ đọc. Nhưng cần thống nhất với ghi chú "văn không nêu tên hành tinh" ở dòng 319: chỉ cho phép 3 tên này, kèm giải nghĩa, và không dùng tên hành tinh nào khác.
- **T5.** Bát Tự "Cán cân ngũ hành" có in % (DeHieu.gs 181). Chủ dự án cho phép giữ, nhưng trên điện thoại nên vẽ thanh màu thay cho con số.

---

## B. Khung bài chuẩn đề xuất

### Nguyên tắc chung cho mọi hệ (áp vào hàm sinh khối của `DeHieu.gs`)
1. **Mở đầu bằng "Chân dung 3 dòng"** trong khoảng 40–60 chữ. Dòng 1 gọi tên hình tượng ("Bạn là ngọn nến…"). Dòng 2 nêu một điểm mạnh riêng. Dòng 3 nêu một điều đang chờ bạn (năm nay, giai đoạn này). Đây là đoạn giữ người đọc, nên đặt trước mọi điểm số.
2. **Thân bài** gồm 3–5 khối, mỗi khối mở bằng câu chủ in đậm. Mỗi khối có tối đa 3 đoạn, mỗi đoạn không quá 60 chữ. Câu khó luôn đi theo công thức 3 vế (xem C2).
3. **Kết bài** "3 điều mang theo" (3 dòng, mỗi dòng một hành động).
4. **Cầu nối tự nhiên** sang phần trả phí: một câu gợi mở, *không nhắc xu/tiền* ở lời mời đầu (theo quyết định của chủ dự án). Ví dụ: "Hệ này cho thấy bạn hợp làm việc độc lập. Năm 2027 có phải lúc để bắt đầu không? Phần **Vận năm** trả lời điều đó." Giá chỉ hiện khi bấm nút.
5. **Khối "Căn cứ chuyên môn"** đặt cuối, mặc định đóng. Mọi tên sao, quẻ, trụ đều nằm ở đây.
6. Độ dài tầng dễ hiểu: **600–1.200 chữ mỗi hệ** (đọc 3–5 phút trên điện thoại). Riêng Tử Vi tối đa 2.000 chữ.

### Tử Vi (miễn phí)
- Mục lục:
  - (1) Chân dung 3 dòng
  - (2) Bảng 12 mặt đời sống: mỗi mặt một dòng gồm điểm và câu chủ, bấm vào để mở chi tiết
  - (3) Ba mặt mạnh nhất, mỗi mặt 2 đoạn
  - (4) Hai mặt nên chăm chút, mỗi mặt 2 đoạn kèm cách làm
  - (5) Các mặt còn lại, thu gọn
  - (6) 3 điều mang theo
  - (7) Cầu nối
  - (8) Căn cứ (gồm 26 bước và luận chuyên sâu)
- Mở đầu bằng: tính cách cung Mệnh nói bằng hình tượng, cộng điểm mạnh nhất trong 12 mặt.
- Độ dài: 1.500–2.000 chữ khi mở hết; khoảng 400 chữ nếu chỉ đọc phần mở sẵn.
- Chỗ đặt phần trả phí: ngay sau mục (3), câu "Mặt mạnh này nở rộ vào giai đoạn nào? → 12 đại vận". Sau mục (4): "Năm nay mặt này ra sao? → Vận năm".

### Bát Tự (miễn phí)
- Mục lục:
  - (1) Chân dung theo hình tượng nhật chủ (giữ `tomTat` hiện có, đang tốt)
  - (2) Năng lượng mạnh và mặt trái
  - (3) "Vị thuốc" cân bằng: hành cần bổ sung, gồm màu, hướng, thói quen
  - (4) 12 lĩnh vực dạng bảng, chỉ mở 3 lĩnh vực cao nhất và 2 thấp nhất
  - (5) 3 điều mang theo
  - (6) Cầu nối
  - (7) Căn cứ
- Mở đầu bằng: hình tượng tự nhiên ("cây đại thụ", "ngọn nến"). Đây là phần dễ chia sẻ nhất, nên đặt khung ảnh để chụp gửi bạn bè.
- Độ dài: 800–1.100 chữ.
- Chỗ đặt phần trả phí: sau mục (3), "Năm nào hành này đến với bạn mạnh nhất? → Đại vận Bát Tự / Vận năm".

### Hà Lạc (miễn phí)
- Mục lục:
  - (1) Chân dung 3 dòng: tên quẻ đời *dịch ra nghĩa đời thường* trước, tên quẻ để sau
  - (2) Hai nửa cuộc đời: "tiền khó – hậu thuận"…
  - (3) Giai đoạn bạn đang đi qua
  - (4) 6 mặt đời sống theo 6 hào, mỗi mặt 1–2 câu
  - (5) 3 điều mang theo
  - (6) Cầu nối
  - (7) Căn cứ
- Mở đầu bằng: nhịp đời ("càng về sau càng vững"). Bỏ câu giải thích phương pháp ở `DeHieu.gs` 446.
- Độ dài: 600–800 chữ.
- Chỗ đặt phần trả phí: sau mục (3), "Quẻ năm 2027 của bạn → Vận năm".

### Chiêm tinh (miễn phí)
- Mục lục:
  - (1) Ba điểm chính: bản chất, cảm xúc, ấn tượng đầu (giữ nguyên, đang tốt)
  - (2) Cách bạn yêu và người bạn dễ bị thu hút
  - (3) Nghề, may mắn, bài học lớn
  - (4) 8 mặt đời sống thu gọn
  - (5) Năm nay: chỉ nêu chủ đề năm, ẩn danh sách tháng
  - (6) 3 điều mang theo
  - (7) Cầu nối
  - (8) Căn cứ
- Mở đầu bằng: "Lúc bạn chào đời…" (đang tốt), rồi chân dung 3 dòng.
- Độ dài: 900–1.200 chữ.
- Chỗ đặt phần trả phí: mục (5). Hiện đang lộ cả "tháng thuận / tháng nên thận trọng" miễn phí (DeHieu.gs 330). Đề xuất chỉ lộ chủ đề năm, còn tháng cụ thể chuyển sang Vận năm.

### Thần số học (miễn phí)
- Mục lục:
  - (1) Con số chủ đạo kèm biệt danh ("Người tiên phong")
  - (2) Điểm mạnh và điều cần rèn: đổi tên mũi tên trống sang tên trung tính
  - (3) Năng khiếu bẩm sinh
  - (4) Nghề hợp
  - (5) Năm cá nhân hiện tại: 1 đoạn
  - (6) 3 điều mang theo
  - (7) Cầu nối
  - (8) Căn cứ (biểu đồ, mũi tên)
- Mở đầu bằng: biệt danh con số. Người trẻ quen dạng này qua mạng xã hội.
- Độ dài: 700–1.000 chữ.
- Chỗ đặt phần trả phí: sau mục (5), "12 tháng cá nhân của năm nay → Vận năm".

### Human Design (miễn phí)
- Mục lục:
  - (1) Bạn thuộc nhóm… (đang tốt)
  - (2) Cách ra quyết định đúng với bạn
  - (3) Vai trò trong cuộc đời: dịch Hồ sơ thành chữ, không in số
  - (4) Nơi bạn dễ bị người khác ảnh hưởng: tối đa 3 vùng
  - (5) Sống hợp thiết kế: môi trường, nhịp nghỉ
  - (6) 3 điều mang theo
  - (7) Cầu nối
  - (8) Căn cứ
- Mở đầu bằng: tên nhóm và một câu "dấu hiệu bạn đang sống đúng mình". Đổi câu "dấu hiệu sai" sang dạng tích cực.
- Độ dài: 700–1.000 chữ.
- Chỗ đặt phần trả phí: sau mục (2), "Người hợp với cách quyết định của bạn → Cặp đôi".

### Tổng hợp 6 hệ (trả phí `co_ban`)
- Mục lục:
  - (1) **Bức chân dung chung** 5 dòng: điều 4/6 hệ trở lên cùng nói
  - (2) Bảng nhiệt 9 lĩnh vực (giữ nguyên)
  - (3) 3 thế mạnh, mỗi cái 1 đoạn kèm "hệ nào cùng thấy"
  - (4) 2 điều nên chăm chút, kèm cách làm
  - (5) Tình duyên và người phù hợp
  - (6) Đường đời và các chặng
  - (7) Năm nổi bật 5 năm tới
  - (8) 3 điều mang theo
  - (9) Cầu nối
- Bỏ mục "Cơ thể" (V6).
- Mở đầu bằng: câu "Cả 6 hệ cùng thấy ở bạn…", tức giá trị mà từng hệ riêng không cho được.
- Độ dài: 1.500–2.200 chữ.
- Bản miễn phí (`th6KhachHtml`): hiện mục (1) và lĩnh vực mạnh nhất, mục (7) hiện tên năm nhưng che nội dung.

### Vận hạn (trả phí theo giai đoạn)
- Mục lục năm:
  - (1) Năm nay trong một câu, kèm hình ảnh ("năm gieo hạt")
  - (2) 3 việc nên làm và 2 việc nên tránh
  - (3) 12 tháng: mỗi tháng 1 câu chủ đề kèm 1 gợi ý
  - (4) Mặt đời sống nổi bật trong năm
  - (5) Căn cứ từng hệ
- Mở đầu bằng: chủ đề năm và tháng tốt nhất (đã có, cũng là phần làm mồi).
- Độ dài: năm 800–1.200 chữ; tháng 300–500 chữ; đại vận 500–800 chữ.
- Bản miễn phí: hiện mục (1) và tên tháng tốt nhất; mục (2), (3) bị che.
- Nhãn: "Những năm đáng chú ý" thay cho "Biến cố hội tụ". Tên chủ đề theo C2.

---

## C. Đề xuất chia đợt sửa

| Đợt | Việc | File chính | Công sức |
|---|---|---|---|
| 1 (an toàn, làm ngay) | C3 bỏ lời khuyên đầu tư; C2 viết lại khoảng 40 câu nặng nhất; V5 câu "Thiếu 9"; V6 bỏ mục Cơ thể; đổi tên "Biến cố hội tụ" và tên các chủ đề xấu | TuViHeThong.gs, ThanSoHoc.gs, TongHop.gs, HoiTu.gs (chỉ nhãn) | S–M |
| 2 | C1 tách `de`/`ky` cho câu phụ tinh; bỏ hai mục kỹ thuật khỏi tầng dễ hiểu; thêm bộ lọc tên sao vào kiểm thử | TuViHeThong.gs, TuViTrinhTu.gs, DeHieu.gs, tests mới | L |
| 3 | C4 tóm tắt theo mức điểm cùng kiểm thử khớp hướng; C5 viết lại Phu Thê hai trạng thái | TuViHeThong.gs | M |
| 4 | Khung bài chuẩn (mục B): chân dung 3 dòng, kết "3 điều mang theo", cầu nối sang phần trả phí cho 6 hệ | DeHieu.gs, Script.html (thứ tự khối) | M |
| 5 | V1 gỡ lặp, V2 cá nhân hóa lời khuyên, V7 rút gọn Vận hạn, các mục Thấp | nhiều file | M |

Mỗi đợt cần chạy lại các kiểm thử văn và tổng hợp (theo `bo-nao/Thiên Cơ Các/TCC Kiểm thử.md`), chụp tab ở W=390 trước và sau khi sửa, rồi nhờ một chuyên gia `reality-checker` đọc lại 5 lá số mẫu trước khi đẩy mã.
