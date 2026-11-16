# 02 – Rà soát bố cục và thao tác (UX, kiến trúc thông tin)

Người rà: ArchitectUX · Ngày 16/11/2026 · Bản giao diện `2026.11.1.5` · Không sửa mã.
Cách làm: dựng `tools/preview-trong.html` (NOAUTO=1) và `tools/preview.html`, chạy Playwright với máy chủ giả lập ở 390×844 (điện thoại) và 1366×900 (máy tính), đo bằng script (chiều cao trang, số chữ, cỡ chữ, kích thước nút, số chỗ khóa). Ảnh nằm trong `anh/ux-dt-*` (điện thoại) và `anh/ux-mt-*` (máy tính); số đo thô nằm trong `anh/ux-do-*.json`.
Giới hạn: ảnh tranh nặng tải qua jsDelivr nên có thể trống trong bản xem trước (ô ảnh poster ở `ux-dt-trang-dau-full.png`). Thời gian đo được là của máy giả lập, không có độ trễ mạng của Apps Script thật.

## Tóm tắt 5 dòng
1. **Màn đầu không bán ước mơ mà bán xu.** Trên điện thoại, cả màn đầu tiên và 1,3 màn sau khi lập lá số đều là poster "Tạo tài khoản – nhận ngay 50 xu" với 3 gói giá. Form nhập ngày sinh nằm ở **2.601px**, tức màn thứ 4. Như vậy là trái quyết định của chủ dự án: không nhắc tiền/xu ở lời mời đầu.
2. **Trang quá dài, chưa phân tầng.** Sau khi lập lá số, tab Bát Tự dài **50.821px**, khoảng 60 màn điện thoại với hơn 10.000 chữ. Chiêm tinh dài 41.372px. Hà Lạc, Thần số và Human Design mỗi tab từ 21.000 đến 26.000px. Người đọc không có đường tắt tới phần "tóm lại tôi là ai".
3. **13 tab ngang trên điện thoại,** mỗi lần chỉ thấy khoảng 2,5 tab (thanh rộng 265px nhưng nội dung 1.450px). Tab mở mặc định sau khi lập là "Tổng Quan 6 Hệ 🔒", tức người mới vào thẳng một tab bị khóa. 6 hệ, sản phẩm trả phí và tiện ích đang nằm chung một hàng.
4. **Điểm chạm và cỡ chữ:** tab và nút chính đạt 44px, tốt. Nhưng lá số Tử Vi trên điện thoại bị thu nhỏ còn khoảng 4–5px chữ thực, không đọc được. Ô chọn (select) cỡ 13,3px khiến iPhone tự phóng to khi bấm vào. Thanh mời mua dán đáy che khoảng 110px, tức 13% màn hình, trên mọi tab.
5. **Đề xuất:** đi theo luồng "1 màn nhập, tóm lược miễn phí, lưu lá số (tài khoản miễn phí), rồi mới mở phần sâu". Điều hướng dưới đáy 4 mục (Lá số · Vận hạn · Hợp đôi · Tôi). 6 hệ thành thanh chip dính. Mỗi hệ có 3 tầng: Tóm lược, Luận theo chủ đề, Căn cứ chuyên môn (thu gọn).

---

## A. Số đo chính

| Hạng mục | Điện thoại 390 | Máy tính 1366 |
|---|---|---|
| Trang đầu (chưa lập), chiều cao | 4.558px (5,4 màn) | – |
| Vị trí đầu form nhập | **2.601px** (màn thứ 4) | cột phải, thấy ngay |
| Vị trí nút "Lập Lá Số" | 3.460px | gần đáy màn đầu |
| Sau khi lập: poster 50 xu đứng trên kết quả | 1.123px | khoảng 630px (cả màn đầu) |
| Tab mở mặc định | `tong` (🔒) | `tong` (🔒) |
| Số tab người thường thấy | 13 | 13 (cột trái) |
| Phần tử DOM sau khi lập | 16.355 | – |
| Font web tải | 6 họ (Be Vietnam Pro, Chakra Petch, Noto Sans Symbols 2, Cormorant Garamond, Ma Shan Zheng, Noto Serif) | |

Chiều cao và số chữ từng tab (điện thoại / máy tính):

| Tab | Cao (px) đt | Màn đt | Số chữ | Số `<details>` | Chỗ khóa |
|---|---|---|---|---|---|
| Tổng Quan 6 Hệ | 11.471 | 13,6 | 1.644 | 9 | 16 (đầu tiên ở 3.640px) |
| Tử Vi | 6.769 | 8 | 1.405 (phần lớn nằm trong 83 khối thu gọn) | 83 | 0 |
| Bát Tự | **50.821** | **60** | **10.009** | 39 | 3 (ở cuối, 49.580px) |
| Hà Lạc | 25.102 | 30 | 5.359 | 25 | 0 |
| Chiêm tinh | 41.372 | 49 | 8.854 | 11 | 0 |
| Thần số | 21.771 | 26 | 4.156 | 3 | 0 |
| Human Design | 25.700 | 30 | 5.224 | 3 | 0 |
| Vận hạn | 9.909 | 12 | 1.624 | 14 | **54** |
| Cặp đôi | 1.204 | 1,4 | 627 | 0 | 0 |
| Gia đình (khách) | 362 | 0,4 | 50 (chỉ nút "Đăng nhập") | 0 | 0 |
| Tiện ích / Lịch sử / Tham khảo | 2.584 / 241 / 6.795 | | | | |

Thời gian đo trên máy giả lập: mở trang đầu khoảng 4,5 giây (kể cả font), lập lá số mẫu tự động khoảng 1,9 giây. Trên Apps Script thật sẽ chậm hơn vì mỗi lần gọi máy chủ mất thêm 1–3 giây.

---

## B. Vấn đề và đề xuất

### Mức CAO

**C1. Màn đầu là bảng giá xu, form ở màn thứ 4 (điện thoại)**
- Chỗ: `Index.html:55-57` `#qcTop > #posterQua` (dựng bởi `vePosterQua` trong Script.html). `.form-panel` đứng sau `qc-top`.
- Bằng chứng: `ux-dt-trang-dau-man1.png` và `ux-dt-trang-dau-full.png`. Màn đầu gồm "50 XU", "Tạo tài khoản – nhận ngay 50 xu" và 3 gói giá có giá gạch ngang (149 → 49 xu…). Sau poster là ô ảnh lớn (hero), rồi 6 gạch đầu dòng, rồi mới đến form ở 2.601px. Trên máy tính, `ux-mt-trang-dau-man1.png` cho thấy poster chiếm giữa màn hình, form bị đẩy sang cột phải.
- Trái quy tắc: "Chủ dự án không thích nhắc tiền/xu ở lời mời đầu". Người dùng 22–40 tuổi dùng điện thoại đến để xem lá số, nhưng việc đầu tiên họ thấy là bảng giá.
- Đề xuất: màn đầu chỉ có **một câu hứa và form rút gọn** (xem phần D). Poster quà chuyển ra **sau khi người đọc đã xem xong phần tóm lược**, và đổi lời thành "Lưu lá số – tạo tài khoản miễn phí". Số xu chỉ hiện trong hộp đăng ký hoặc sau khi đã đăng ký. Công sức: M.

**C2. Sau khi lập lá số, kết quả bị poster đè lên trên**
- Chỗ: `#qcTop` vẫn hiện khi đã có `state.result`. Sau khi lập trang tự cuộn tới 2.173px, nhưng nếu người dùng cuộn lên thì lại gặp poster.
- Bằng chứng: `ux-dt-lap-xong-man1.png`, `ux-mt-lap-xong-man1.png`. Ở máy tính, tên "Nguyễn Văn An" nằm ở 690px, dưới poster. Toast "Đã lập lá số ✦" còn đè lên nút CTA.
- Đề xuất: khi đã có kết quả thì ẩn hẳn `qc-top`. Đầu trang lúc này là thẻ hồ sơ (tên, ngày sinh, nút Sửa thông tin), giống `ux-dt-tab-tong.png`. Công sức: S.

**C3. Tab mặc định sau khi lập là tab bị khóa ("Tổng Quan 6 Hệ 🔒")**
- Chỗ: `Script.html:2136` `showTab('tong')`. Tab đứng đầu tiên trong `Index.html:218`.
- Bằng chứng: `ux-do-*-day.json` ghi `activeTab: "tong"`. Tab này có 16 chỗ khóa, mục lục có 4/6 mục mang 🔒 (`ux-mt-lap-xong-man1.png`, cột trái).
- Vấn đề: người mới vừa nhập xong ngày sinh, chưa nhận được giá trị gì đã thấy ổ khóa. Điều này đi ngược câu đã viết trên trang: "Đọc miễn phí luận giải đủ 6 hệ".
- Đề xuất: mở mặc định trang **"Tóm lược"** miễn phí, dài 1–2 màn và ghép từ 6 hệ (phần D2). Tổng hợp 6 hệ có khóa chuyển thành một mục riêng ("Bản luận đầy đủ"), có nhãn giá trị rõ. Công sức: M.

**C4. Trang từng hệ quá dài, không có tầng tóm lược**
- Chỗ: tab Bát Tự, Chiêm tinh, Hà Lạc, Thần số, HD. Bố cục chốt ngày 25/10 là "bảng Hologram → Hồ sơ nhanh → mục lục → Phần 1 → Luận dễ hiểu → phần còn lại", và mọi bảng hiện sẵn.
- Bằng chứng: bảng A cho thấy Bát Tự 60 màn điện thoại, Chiêm tinh 49 màn. Ở Bát Tự, màn thứ 3 vẫn là bảng thuật ngữ (Hỷ thần, Dụng thần, Kỵ thần, "phe ta 77,3%"; `ux-dt-tab-battu-giua.png`). Phần dễ hiểu bị đẩy xuống dưới các bảng kỹ thuật.
- Đề xuất: mỗi hệ dùng cùng một khung 3 tầng (D3):
  - **Tầng 1**: thẻ tóm lược 1 màn, gồm 3 nét chính, 1 điểm mạnh, 1 điều cần lưu ý kèm hướng khắc phục.
  - **Tầng 2**: luận dễ hiểu theo 6 chủ đề cố định, dạng thẻ thu gọn. Mỗi lần chỉ mở một thẻ.
  - **Tầng 3**: "Căn cứ chuyên môn", gồm bảng Hologram, bảng sao, thần sát, thuật ngữ. Mặc định thu gọn.

  Hai tầng văn vẫn giữ nguyên, chỉ đổi thứ tự hiển thị. Mục tiêu là người mới đọc được ý chính trong 2 màn. Công sức: L (đổi khung chung trong Script.html, nội dung giữ nguyên).
- Lưu ý quyết định 25/10 ("bỏ khối Phần chuyên sâu thu gọn, mọi bảng hiện sẵn"): đề xuất này **đảo một phần** quyết định đó, nên cần chủ dự án duyệt. Để dung hòa: trên máy tính các bảng vẫn mở sẵn ở cột phải, còn trên điện thoại thì thu gọn.

**C5. 13 tab ngang trên điện thoại, trộn 3 loại nội dung**
- Chỗ: `Index.html:217-233` `#tabs`. Thứ tự hiện tại: Tổng quan, Tử Vi, Gia đình, Bát Tự, Hà Lạc, Chiêm tinh, Thần số, HD, Vận hạn, Cặp đôi, Tiện ích, Lịch sử, Tham khảo.
- Bằng chứng: `ux-dt-tab-*.png`. Thanh tab rộng 265px nhưng nội dung 1.450px, nên chỉ thấy khoảng 2,5 tab và không có dấu hiệu "còn nữa" rõ ràng. Tab "Gia đình" (chỉ có nút Đăng nhập với khách, `ux-dt-tab-gd.png`) lại chen giữa Tử Vi và Bát Tự, làm đứt chuỗi 6 hệ.
- Đề xuất: tách thành **điều hướng 2 cấp** (D1). Cấp 1 là thanh dưới đáy 4 mục. Cấp 2 là chip 6 hệ dính đầu trang. Lịch sử, Tiện ích, Tham khảo và Gia đình đưa vào mục "Tôi" hoặc "Thêm". Công sức: M.

**C6. Lá số Tử Vi trên điện thoại không đọc được**
- Chỗ: `#chartFrame` / `#chart` (lưới 4×4 bị thu nhỏ vừa 339px).
- Bằng chứng: `ux-dt-la-so-tu-vi-o.png`. Cỡ chữ khai báo 9,5–13,5px nhưng bị thu theo tỷ lệ, chữ thực còn khoảng 4–5px. Bảng Hologram Bát Tự cũng bị cắt mép phải (`ux-dt-tab-battu.png`).
- Đề xuất: trên điện thoại, lá số hiện dạng **ảnh xem trước có nút "Phóng to"** (mở toàn màn hình, cho chụm ngón để zoom). Kèm theo đó là danh sách 12 cung dạng thẻ dọc: mỗi cung 1 dòng gồm tên cung, mức "Tốt / Cần lưu ý" và chạm để đọc. Phần "Điểm 12 cung" đã có (`ux-dt-tab-chart-giua.png`) nhưng đang cuộn ngang, nên đổi thành lưới 3×4. Công sức: M.

### Mức VỪA

**V1. Thanh mời mua dán đáy luôn hiện, lại trùng với lời mời trong mục lục**
- Chỗ: `#ctaBar` (`Index.html:337`). Lời mời thứ hai nằm trong hộp mục lục.
- Bằng chứng: `ux-dt-tab-chart.png`, `ux-dt-muc-luc.png`. Thanh cao khoảng 110px, che 13% màn hình. Nội dung "Đăng ký miễn phí – tặng 50 xu – … đủ mở cả gói Trọn đời (49 xu, giá gốc 149 xu)". Khi mở mục lục thì cùng một lời mời xuất hiện 2 lần trên một màn. Nút "🔍" và "↑" nổi cũng chồng lên thanh này.
- Đề xuất:
  - Thanh đáy chỉ hiện **sau khi người đọc cuộn hết phần tóm lược** hoặc sau 60 giây. Thu nhỏ còn 56px (một dòng và một nút). Lời thanh không nhắc xu: "Lưu lá số & nhận luận giải hằng ngày – miễn phí".
  - Đóng thanh thì không hiện lại trong cả phiên.
  - Bỏ lời mời trong mục lục.
  - Công sức: S.

**V2. Mục lục bị lặp cấp**
- Bằng chứng: `ux-dt-muc-luc.png`. "CHÂN DUNG LÁ SỐ" ngay bên dưới lại có "Chân dung lá số", "LUẬN THEO TRÌNH TỰ 26 BƯỚC" có "Luận theo trình tự". Trên máy tính, ảnh chân dung nổi ở góc dưới trái đè lên mục lục (`ux-mt-tab-chart.png`, `ux-mt-lap-xong-man1.png`).
- Đề xuất: mục cấp 2 trùng tên với cấp 1 thì bỏ. Mục lục trên điện thoại nên là danh sách mở từ đáy màn hình lên, có ô "đang đọc" được tô sáng. Ảnh nổi đặt cách xa cột mục lục, hoặc ẩn khi mục lục mở. Công sức: S.

**V3. Hộp đăng ký 6 ô, có "Mã giới thiệu", nằm đè lên nền poster**
- Bằng chứng: `ux-dt-dang-ky.png`. Có Tên đăng nhập, Tên hiển thị, SĐT/email, Mật khẩu, Nhập lại, Mã giới thiệu. Trên điện thoại hai ô mật khẩu đặt cạnh nhau, nhãn dài làm hai ô lệch chiều cao. Nền mờ không đủ đậm nên chữ poster lộ qua.
- Đề xuất:
  - Rút còn **3 ô**: SĐT/email, mật khẩu (có nút hiện/ẩn, bỏ ô nhập lại), tên gọi.
  - Tên đăng nhập lấy luôn từ SĐT/email. Mã giới thiệu tự điền từ đường link mời, còn không thì để trong mục "Có mã giới thiệu?" thu gọn.
  - Trên điện thoại các ô xếp một cột. Nền phủ đậm hơn (khoảng 85%).
  - Câu quà trong hộp được phép nhắc xu vì người dùng đã chủ động bấm đăng ký.
  - Công sức: M (đụng `TaiKhoan.gs` nếu đổi tên đăng nhập, nên phối hợp với 01-mã nguồn).

**V4. Form chính dài, các tùy chọn chuyên môn chen vào luồng của người mới**
- Chỗ: `Index.html:92-212`. Form có 7 trường, "Tùy chọn nâng cao" có 8 mục kỹ thuật (Tứ Hóa năm Canh, Hoàng đạo theo tiết…), "Sự kiện đã biết" nằm ngay trên nút Lập.
- Có sẵn chế độ "Nhập từng bước" làm rất tốt (`ux-dt-form-tung-buoc.png`: một câu hỏi mỗi bước, nút Tiếp to), nhưng chỉ là một nút phụ.
- Đề xuất:
  - Trên điện thoại, **chế độ từng bước thành mặc định** (4 bước: Tên & giới tính, Ngày sinh, Giờ sinh có lựa chọn "Không rõ giờ", Nơi sinh).
  - Thêm "Không rõ giờ sinh". Với lựa chọn này, hệ thống vẫn lập lá số các hệ không cần giờ và mời "Dò giờ sinh".
  - Chuyển "Sự kiện đã biết" sang sau khi lập, cạnh nút Nghiệm chứng.
  - Công sức: M.

**V5. Ô chọn (select) cỡ 13,3px làm iPhone tự phóng to khi bấm**
- Bằng chứng: số đo `inputFs` có 13,33px ở `#day`, `#month`, `#hour`, `#minute`, `#place`… Safari iOS tự zoom khi ô nhập có cỡ chữ dưới 16px. Các ô input khác là 15px, cũng dưới 16px.
- Đề xuất: mọi `input, select, textarea` đặt `font-size:16px` trên màn ≤ 600px. Công sức: S.

**V6. Lời quảng bá hứa "kèm %", trong khi trang hiện nhiều con số %**
- Chỗ: `Index.html:71` "năm sinh con kèm %". Thẻ "Đồng thuận 6 hệ 54%" (`Script.html:1896`, `ux-dt-sau-lap-man1.png`). Bát Tự có "phe ta 77,3%", "Mộc 5,8%".
- Quy tắc chủ dự án: "bỏ %/xác suất/số con". Dòng ở `Index.html:71` trái trực tiếp quy tắc này. Các % kỹ thuật (tỷ lệ ngũ hành) có thể giữ ở tầng Căn cứ, còn tầng dễ hiểu nên đổi thành chữ (cao / vừa / thấp).
- Chuyển cho chuyên gia văn (04) xác nhận. Công sức: S.

**V7. Tab "Gia đình" và "Lịch sử" hiện với khách nhưng gần như rỗng**
- Bằng chứng: `ux-dt-tab-gd.png` (chỉ có nút Đăng nhập), Lịch sử 241px. Về quyết định: ngày 1/11 có hai dòng mâu thuẫn ("mở cho mọi thành viên đăng nhập" và "chỉ chủ sở hữu (đã đổi)"), cần chủ dự án xác nhận lại.
- Đề xuất: khách chưa đăng nhập thì ẩn 2 tab này. Đưa chúng vào mục "Tôi". Công sức: S.

**V8. Khối "Nghiệm chứng" chen trước lá số**
- Bằng chứng: `ux-dt-tab-chart.png`. Màn đầu tab Tử Vi là thẻ "Lá số này có đúng giờ sinh…" và 3 hàng tùy chọn (Lưu tinh, Năm, Tiểu tinh, Tam hợp, chú giải ngũ hành, Tải ảnh/PDF/In). Lá số chỉ bắt đầu ở cuối màn.
- Đề xuất: nghiệm chứng là bước nên có, nhưng nên đặt thành **một dòng gợi ý gọn** dưới thẻ hồ sơ ("Không chắc giờ sinh? Kiểm chứng 2 phút →"). Các công tắc hiển thị gom vào nút "⚙ Hiển thị". Tải ảnh/PDF/In gom vào nút "⤓ Lưu / In". Công sức: S.

**V9. Mỗi lần lập lá số tạo khoảng 16.000 phần tử, kèm canvas hạt sáng và 6 họ font**
- Ảnh hưởng: điện thoại tầm trung cuộn giật, pin hao, mở trang đầu chậm (khoảng 4,5 giây ngay cả khi máy giả lập không có độ trễ mạng).
- Đề xuất:
  - Chỉ dựng nội dung tab khi người dùng mở tab đó (lazy render). Các khối `<details>` chỉ dựng ruột khi mở.
  - Tắt canvas `#bkHat` trên điện thoại hoặc khi đặt `prefers-reduced-motion`. Đã có quy tắc `reduced-motion`, cần kiểm tra quy tắc này có tắt canvas không.
  - Giảm còn 3 họ font. Ma Shan Zheng và Noto Sans Symbols 2 nên tải theo nhu cầu.
  - Màn chờ lập lá số nên hiện tiến trình theo hệ ("Đang lập Tử Vi… Bát Tự…") để thời gian chờ cảm giác ngắn hơn.
  - Công sức: M.

### Mức THẤP

- **T1. Trợ năng cho tab:** các nút `role="tab"` chưa có `aria-controls`, và không có `role="tabpanel"` (đếm được 0). Đề xuất bổ sung cả hai, thêm phím ←/→ để chuyển tab, và đặt tiêu đề trang `<h1>` riêng cho từng hệ. Công sức: S.
- **T2. Nút đóng nhỏ:** `.chao-x` 21×27px, `.cb-x` 27×30px, nút ‹ › năm lưu niên 38×38px. Ở form, checkbox thật chỉ 19–22px (nhãn bọc ngoài bù lại một phần). Đề xuất vùng chạm tối thiểu 44×44px. Công sức: S.
- **T3. Chữ Hán trang trí trong tiêu đề** (`<span class="han">命</span>`, 籍, 鑰…): trình đọc màn hình sẽ đọc to các chữ này. Đề xuất thêm `aria-hidden="true"`. Quy tắc "không dùng chữ Hán trong văn" áp cho văn, chưa áp cho trang trí, nên cần chủ dự án quyết. Công sức: S.
- **T4. Cỡ chữ nhỏ:** có văn bản 10–12px (`fs` 10:1, 11:4–5, 12:9 trên mỗi màn đo), chủ yếu là nhãn phụ và gợi ý. Đề xuất nền chữ thân 16px, chữ phụ tối thiểu 13px. Công sức: S.
- **T5. Liên kết "Đăng ký ngay"** trong hero chỉ cao 18px. Nút ảnh `poster-hotspot` không có chữ (đã có `aria-label`, đạt). Công sức: S.
- **T6. Giá trị mặc định trong form Nghiệm chứng:** `Index.html:509-514` điền sẵn ngày 16, tháng 6, năm 1995, giờ 4. Cần chủ dự án xác nhận đây **không phải ngày giờ sinh thật của ai** (quy tắc: không ghi ngày sinh chủ dự án vào repo). Nên để trống hoặc lấy theo lá số đang mở. Công sức: S.
- **T7. Chữ "MỚI" trên tab Vận hạn và thanh tiến trình đọc trên đầu trang** đều tốt, nên giữ.

---

## C. Đánh giá luồng người mới hiện tại

| Bước | Hiện tại (điện thoại) | Ma sát |
|---|---|---|
| 1. Vào trang | Gặp poster 50 xu và 3 gói giá | Cao: cảm giác "bị bán hàng" ngay từ đầu |
| 2. Tìm chỗ nhập | Cuộn 3 màn, qua poster, ô ảnh, danh sách lợi ích | Cao |
| 3. Nhập | 7 trường, các select bị zoom trên iPhone, chế độ từng bước bị giấu | Vừa |
| 4. Chờ | Vòng âm dương "Đang khởi quẻ, an sao…" | Thấp (chưa có tiến trình) |
| 5. Đọc kết quả | Vào tab có khóa. Poster vẫn ở trên. CTA dán đáy. 13 tab | Cao |
| 6. Đọc 1 hệ | 26–60 màn, bảng kỹ thuật trước, văn dễ hiểu sau | Cao |
| 7. Tạo tài khoản | Hộp 6 ô, ô mật khẩu đặt đôi | Vừa |
| 8. Mua | Vận hạn có 54 nút mở trên 12 màn. Tổng quan có 16 chỗ khóa. Nút "Mở xem" không ghi giá | Vừa: nhiều lựa chọn, khó so sánh |

Điểm tốt nên giữ: chế độ "Nhập từng bước", tab và nút chính 44px, thẻ hồ sơ Tổng quan (tên, tứ trụ, số chủ đạo; `ux-dt-tab-tong.png`), bảng điều khiển "Bản đồ con người bạn" (radar 12 cung), thẻ mở vận hạn có giá rõ và có nhãn "Tiết kiệm nhất" (`ux-dt-khoa-vh.png`), nút "Sửa thông tin / Lá số mới" và chế độ giảm chuyển động.

---

## D. Kiến trúc thông tin đề xuất

### D1. Sơ đồ điều hướng

```
Điện thoại: thanh dưới đáy (4 mục, cao 56px, chữ và biểu tượng)
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ ☯ Lá số      │ ⏳ Vận hạn    │ 💞 Hợp đôi    │ 👤 Tôi        │
└──────────────┴──────────────┴──────────────┴──────────────┘
Máy tính: cùng 4 mục ở thanh trên đầu. Cột trái là chip 6 hệ và mục lục của trang đang đọc.

☯ Lá số (miễn phí là chính)
  ├─ [chip dính đầu trang] Tóm lược · Tử Vi · Bát Tự · Chiêm tinh · Thần số · Human Design · Hà Lạc
  ├─ Tóm lược (MẶC ĐỊNH sau khi lập, 1–2 màn, miễn phí)
  │    Thẻ hồ sơ → "Bạn thuộc mẫu người…" (3 nét chung nhiều hệ cùng nói)
  │    → 1 điểm mạnh · 1 điều cần lưu ý + hướng khắc phục
  │    → 6 thẻ nhỏ "mỗi hệ nói gì về bạn" (chạm để vào hệ đó)
  │    → Lời mời: "Lưu lá số – tạo tài khoản miễn phí"
  │    → Thẻ giới thiệu "Bản luận đầy đủ 9 lĩnh vực" (🔒, ghi giá trị, chưa ghi giá)
  ├─ Mỗi hệ (khung chung 3 tầng, xem D3)
  └─ Bản luận đầy đủ 6 hệ (= Tổng hợp 9 lĩnh vực, chân dung, tình duyên, đường đời; trả phí)

⏳ Vận hạn (trả phí theo giai đoạn)
  ├─ Năm nay (thẻ miễn phí: nhịp năm 1 đoạn + 12 tháng dạng màu, chữ khóa)
  ├─ Đại vận 10 năm · Vận năm · Tháng · Đồng hành cả năm
  └─ Biến cố hội tụ 30 năm

💞 Hợp đôi
  ├─ Cặp đôi (form người thứ hai)
  └─ Gia đình (cần đăng nhập)

👤 Tôi
  ├─ Đăng nhập / Tạo tài khoản  ·  Ví xu & Nạp  ·  Mời bạn
  ├─ Lá số đã lưu (Lịch sử)  ·  Tải PDF
  ├─ Nghiệm chứng & dò giờ sinh  ·  Tiện ích  ·  Tham khảo (64 quẻ, nghề nghiệp, thư viện)
  └─ (chủ sở hữu) 👑 Lá số chủ sở hữu · ✶ Phi Tinh · ⚙ Quản trị
```

Cấp 1 giảm từ 13 tab xuống 4 mục. 6 hệ nằm liền nhau trên một thanh chip, thanh chip cuộn ngang được vì chip ngắn. Các mục ít dùng đưa vào "Tôi".

### D2. Luồng chuẩn cho người mới

1. **Vào trang, màn đầu duy nhất:** tiêu đề "Hiểu mình – để sống đúng với mình", một dòng phụ "6 hệ huyền học, đọc miễn phí", rồi form bước 1 (Tên & giới tính) và nút "Bắt đầu". Không có xu và giá.
2. **Nhập từng bước** (4 bước, có thanh tiến trình, có "Không rõ giờ sinh"). Nơi sinh mặc định là Hà Nội. Tùy chọn nâng cao đưa xuống "Tôi → Cài đặt lá số".
3. **Chờ khoảng 2–4 giây** với tiến trình theo hệ.
4. **Trang Tóm lược** (miễn phí, 1–2 màn). Cuối trang có 2 nút: "Đọc kỹ Tử Vi →" (nút chính) và "Lưu lá số – miễn phí" (nút phụ).
5. **Đọc từng hệ:** đọc hết tầng tóm lược của hệ thì gợi ý hệ kế tiếp ("Bát Tự nói gì thêm? →"). Đây là đường đi tuần tự qua 6 hệ, không bắt người dùng tự tìm tab.
6. **Tạo tài khoản** (3 ô) khi người dùng muốn lưu, nhận luận giải hằng ngày, hoặc chạm vào phần 🔒 lần đầu. Sau khi tạo xong mới báo "Bạn có 50 xu quà" và gợi ý 1 phần phù hợp nhất (ví dụ "Bản luận đầy đủ").
7. **Mua:** thẻ khóa luôn có 3 thứ: phần này nói về gì (1 câu mẫu đã che mờ), giá gốc và giá hiện tại, nút "Mở · 19 xu". Bảng 3 gói chỉ hiện trong "Ví xu & Nạp".

### D3. Khung chung cho mỗi hệ (áp cho cả 6 tab hệ)

```
[Tiêu đề hệ + 1 câu "hệ này đo gì"]                         (≤ 3 dòng)
1. Tóm lược của bạn  – 3 nét chính · 1 mạnh · 1 lưu ý       (≤ 1 màn, luôn mở)
2. Luận theo chủ đề (thẻ thu gọn, mở một thẻ một lần):
   Tính cách · Công việc · Tiền bạc · Tình cảm · Gia đình · Nếp sống & sức khỏe tinh thần
3. Vận trình của hệ này (đại vận/chu kỳ, phần khóa nằm ở đây)
4. Căn cứ chuyên môn (thu gọn): lá số/bảng Hologram, bảng sao, thần sát, thuật ngữ
→ "Hệ tiếp theo: …"
```

Văn hai tầng vẫn giữ: tầng dễ hiểu nằm ở mục 1–3, tầng căn cứ nằm ở mục 4. Nội dung các mục 26 bước Tử Vi và 15 bước Bát Tự giữ nguyên, chỉ xếp lại vào các chủ đề. Ánh xạ cụ thể bước nào vào chủ đề nào giao cho content-creator.

### D4. Quy chuẩn thao tác (cho đội phát triển)

- Vùng chạm ≥ 44×44px. Ô nhập 16px trên điện thoại. Chữ thân 16px, dòng cao 1,6, chữ phụ ≥ 13px.
- Một trang có tối đa 1 lời mời đăng ký/mua đang hiện cùng lúc. Thanh đáy ≤ 56px và có nút đóng nhớ trong cả phiên.
- Mọi khối dài trên 2 màn phải có thẻ tóm lược ở đầu.
- Dựng nội dung tab khi mở (lazy). Trên điện thoại tắt hiệu ứng nền nặng.
- Phần tử nổi (🔍 cơ sở, ↑ lên đầu, ảnh chân dung) không được đè lên thanh đáy hay mục lục. Nên gom vào một nút "⋯".

---

## E. Đề xuất chia đợt sửa

| Đợt | Nội dung | Mục | Công sức |
|---|---|---|---|
| 1 – "Gỡ ma sát" (nhanh, ít rủi ro) | Ẩn poster khi đã có kết quả. Đổi lời mời đầu bỏ xu. Ô nhập 16px. Thu nhỏ thanh CTA, hiện trễ, nhớ khi đóng. Bỏ lời mời trong mục lục. Sửa "kèm %" (Index.html:71). Ẩn Gia đình/Lịch sử với khách. aria cho tab. Nút đóng 44px. Kiểm tra T6 | C2, V1, V2, V5, V6, V7, T1–T6 | S–M |
| 2 – "Luồng người mới" | Màn đầu một câu hứa + form từng bước mặc định + "Không rõ giờ". Trang Tóm lược làm tab mặc định. Hộp đăng ký 3 ô | C1, C3, V3, V4, V8 | M |
| 3 – "Kiến trúc mới" | Thanh đáy 4 mục và chip 6 hệ. Gom Tiện ích/Tham khảo/Lịch sử vào "Tôi". Lá số Tử Vi điện thoại dạng phóng to + danh sách cung | C5, C6, D1 | M–L |
| 4 – "Khung 3 tầng mỗi hệ" | Áp khung D3 cho 6 hệ (cần content-creator ánh xạ nội dung). Lazy render. Giảm font và hiệu ứng | C4, V9, D3 | L |

Đợt 1 có thể làm ngay sau khi chủ dự án duyệt. Đợt 2–4 cần chủ dự án chốt sơ đồ D1/D2 trước, nên có một bản mẫu tĩnh để duyệt. Đợt 4 đảo một phần quyết định 25/10 ("mọi bảng hiện sẵn"), cần hỏi chủ dự án.

## F. Danh mục ảnh (`anh/`)
- Trang đầu: `ux-dt-trang-dau-man1.png`, `ux-dt-trang-dau-full.png`, `ux-mt-trang-dau-man1.png`, `ux-mt-trang-dau-full.png`
- Form: `ux-dt-form.png`, `ux-dt-form-tung-buoc.png`, `ux-mt-form*.png`
- Đăng nhập/đăng ký: `ux-dt-dang-nhap.png`, `ux-dt-dang-ky.png`, `ux-mt-dang-*.png`, `ux-dt-bam-mua.png`, `ux-mt-bam-mua.png`
- Sau khi lập: `ux-*-sau-lap-man1.png`, `ux-*-lap-xong-man1.png`
- Từng tab: `ux-{dt,mt}-tab-<tab>.png` và `-giua.png` (tong, chart, gd, battu, halac, astro, so, hd, vh, capdoi, ti, hist, que64)
- Chỗ khóa: `ux-*-khoa-tong.png`, `ux-*-khoa-battu.png`, `ux-*-khoa-vh.png`
- Mục lục: `ux-dt-muc-luc.png`, `ux-mt-muc-luc-mt.png`
- Lá số Tử Vi cỡ điện thoại: `ux-dt-la-so-tu-vi-o.png`
- Số đo: `ux-do-dt-trong.json`, `ux-do-mt-trong.json`, `ux-do-dt-day.json`, `ux-do-mt-day.json`
