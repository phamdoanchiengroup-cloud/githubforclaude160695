# TCC Giao diện

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC PDF]] · [[TCC Lá số 3D]] · [[TCC Văn dễ hiểu và Tổng hợp 6 hệ]] · [[00 Mục lục]]

- **24/10 – Ảnh qua jsDelivr:** 17 tranh ở `tuvi-app/anh/*.webp`; Holo.html › `TCC_CDN` = `cdn.jsdelivr.net/gh/…@87e4618…/tuvi-app/anh/`, `anh()` tải ảnh từ CDN, lỗi thì `anhGas()` gọi `layAnhHolo`. Poster, `pdf-bia.webp`, `pdf-nen.webp` cũng qua CDN cùng mã. Đổi ảnh: đẩy ảnh mới → lấy mã lần lưu → sửa mã trong Holo.html/Script.html (link jsDelivr theo mã không bao giờ đổi nội dung).
- **24/10 – Tab 64 quẻ (`data-tab="que64"`, Script › `kdVeTab`, `kdLuoi`, `kdChiTiet`, `kdHinh`; CSS `.kd-*`):** dữ liệu `tuvi-app/kinh-dich/kd64.json` (364 KB: nội dung 4 nhóm biên soạn + cấu trúc tính bằng HaLac.gs: cung, thế/ứng, nạp giáp, lục thân, hỗ/thác/tống) tải qua jsDelivr `@c23cec1…`, dự phòng raw GitHub. Không cần lá số; có lá số thì hiện nút quẻ Tiên/Hậu thiên Hà Lạc của người xem.

- **24/10 – Bánh xe ngũ hành 9 lĩnh vực (thay vòm trời cũ, Script.html › `vuTruHtml`, `vtThe`, `vtChon`, `vtThapThan`, `napAnhHolo`; CSS `.vt-*`):** đĩa giữa là tranh `HoloAnhTongHop.html` (cắt từ tranh mẫu, nạp qua `layAnhHolo('TongHop')` khi khối hiện); vành trong vẽ đè ghi nhóm Thập Thần của từng hành so với Nhật chủ + % ngũ hành Bát Tự (viền xanh = dụng thần); 9 quả cầu lĩnh vực trên vòng r=430 (khung SVG -190..1190 × 0..1000), bấm → thẻ `vtThe` bên cạnh; điện thoại ẩn tên, chỉ hiện điểm.
- **24/10 – Rà Codex:** lấy lại Index/Styles/Script/Holo bản 39ec55a rồi gắn lại: nhật vận không nạp ngày cũ từ Lịch sử (`setForm` bỏ `viewDate`/`viewYear`), ô năm lưu niên `#chartViewYear` + nút `[data-nam-luu]` (chờ 650 ms rồi lập lại), Tuần/Triệt đặt giữa hai mép cung (`drawOverlay`), poster `poster-trang-chu.webp` (Anh.html trỏ raw GitHub) + `#posterHotspot` + ảnh góc `.tcc-goc-anh` (góc trái dưới, ẩn trên điện thoại), PDF lib `defer`. Chế độ xem Tử Vi chỉ còn Hologram / 2D.

- **Bố cục chuyên sâu thống nhất:** tab Tử Vi chia Phần 1–4 (`khoiPhan`, chân dung lá số gộp một khung; thẻ xem nhanh cung chỉ hiện khi bấm). Tab Hà Lạc (`renderHaLac`, Phần 1–5), Thần số (`renderThanSo`, Phần 1–8), Chiêm tinh (`renderAstro`, Phần 1–8) và Human Design (`renderHD`, Phần 1–11) tự dựng khung (`PHAN_HE` đều = null; `xepPhan` giữ lại cho tương thích). `veDeHieu` chèn văn dễ hiểu lên đầu mỗi tab rồi gom các khung chuyên sâu vào `details.chuyen-sau`.
- **Vòm trời 6 hệ (Script.html › `vuTruHtml`, `vtThe`, `vtChon`, CSS `.vt-*`):** bánh xe SVG 9 lĩnh vực × 4 vòng hệ (trong → ngoài: Hà Lạc, Chiêm tinh, Bát Tự, Tử Vi; màu `th6Mau`), vùng phát sáng khi ≥3/4 hệ cùng chiều, quỹ đạo hành tinh thật lúc sinh làm nền. Bấm/phím mũi tên để xoay (`--q`, đường ngắn nhất) và đổi thẻ luận giải; nút chip làm nổi 1 hệ; "Đọc đầy đủ" mở mục `details` tương ứng. Đặt trong `th6Html` (bảng nhiệt chuyển vào "Xem dạng bảng điểm") và `th6KhachHtml` (bản miễn phí: 1 vòng điểm chung, vùng khóa mời mua). PDF: `chuanHoa` cố định SVG 640px và đổi xoay CSS thành thuộc tính `transform`. Tôn trọng `prefers-reduced-motion`.
- **Dòng thời gian cuộc đời (Script.html › `dtHtml`, `dtThe`, `dtChon`, CSS `.dt-*`):** đầu tab Vận hạn (cả bản miễn phí). SVG 0–90 tuổi: dải đại vận (`chiTiet.daiVan` hoặc `moi.daiVan`), cột từng năm (`tieuVanNhieuNam`), chấm biến cố (`tongHop.hoiTu.chuDe`, thiếu thì lấy `th6.namToi/namQua`). Thanh trượt + ‹ › chọn năm → thẻ: tuổi mụ, can chi, đại vận, biến cố, nút mở năm (`nutNam`) / đại vận / `bien_co` / `co_ban`. Không in vào PDF.
- **Hành trình dẫn dắt (Script.html › `htMo`, `htToi`, `htKetQua`, `htLaBai`; modal `#htModal` trong Index.html):** nút "✦ Nhập từng bước" (form) và nút "Khám phá ngay" mở hộp 4 bước (tên → ngày → giờ → nơi sinh), ghi vào form chính bằng `setForm` rồi `submit()`; `HT.cho` báo `submit` gọi `htKetQua` → màn khởi quẻ → 8 lá hé lộ hiện sẵn nội dung, bấm "Lá tiếp" để chuyển (dữ liệu `res.teaser.*.lo` + lĩnh vực mạnh nhất `th6`, lọc tên sao bằng `htCau`). Lá cuối: bản miễn phí mời kiểm chứng / mở khóa; bản đầy đủ dẫn tới Vòm trời, Dòng thời gian, Lá số, Kiểm chứng. `showErr` trả hộp về bước cuối nếu lỗi.
- **Sinh động & gần gũi (Script.html › `veChao`, `chaoHtml`, `hieuUng`, `huDem`, `mungMo`, `huPhaoHoa`; CSS `.chao*`, `.cho-hien/.hien`, `.an-sao`, `.hu-*`):** lời chào theo giờ + tên + ngày/tháng/năm cá nhân (công thức giống `namCaNhan` ở ThanSoHoc.gs) + đếm ngược sinh nhật (ẩn được trong ngày, `sessionStorage`); khung hiện dần khi cuộn (IntersectionObserver, gắn trong `sauHienThi`), điểm số đếm lên và thanh điểm dâng khi hiện; lá số "an sao" 12 cung hiện lần lượt từ cung Mệnh (`renderChart`); con dấu "Đã mở khóa" + kim sa khi mua thành công (`muaGo`). Tắt hết khi `prefers-reduced-motion`; `.pdf-root` tắt mọi animation và buộc hiện đủ.
- **Giao diện chuyên nghiệp (khối cuối Styles.html "GIAO DIỆN CHUYÊN NGHIỆP" + Script.html › `veHoSo`, `moForm`, `dongForm`):** giữ bảng màu cũ; bỏ quả cầu/núi/góc trang trí/chữ chuyển màu; tiêu đề khung chữ không chân; `.tg-head` thành đầu mục có vạch vàng (không còn tấm băng); nút chính màu đặc; tab trái dạng danh sách có vạch sáng. Khi có kết quả: `body.co-ket-qua` ẩn ô nhập, bố cục 2 cột (tab | nội dung ≤1080px), thẻ hồ sơ `#hoSoTom` (✎ Sửa thông tin / ＋ Lá số mới) mở ô nhập dạng ngăn kéo phải (`body.mo-form`, nền `#formNen`, Esc để đóng; `submit` tự đóng). Dải quảng cáo sau khi có kết quả chỉ còn 1 dòng. Gợi ý kiểm chứng `#ncBanner.nc-goi` gọn (chi tiết trong `details`). Xóa khối CSS này là về giao diện cũ.
- **Bố cục trang (máy tính ≥1081px):** cột trái `#navCol` (tab xếp dọc + mục lục, JS chuyển vào lúc khởi động), giữa là kết quả, phải là form. Điện thoại: tab ngang như cũ. Lá số Tử Vi trên điện thoại được thu nhỏ vừa màn hình (`coLaSo`; `chupLaSo` bỏ thu nhỏ khi chụp PNG/PDF; `drawOverlay` quy toạ độ về kích thước gốc).
- **Tab (Index.html):** Lá số → Tổng quan 6 hệ → **Vận hạn** (`page-vh`, dựng bởi `veVanHan` trong Script.html; gom đại vận, năm, tháng, ngày, biến cố) → Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc → Cặp đôi → Lịch sử.
- **Khởi động trang:** gắn tab và Lịch sử **trước tiên**, mỗi bước bọc trong `buoc(...)`. Một bước lỗi (vd. Index.html cũ thiếu phần tử) không được làm chết cả trang.
- **Mã phiên bản giao diện:** `<meta name="tcc-ban">` (Index.html), `--tcc-ban` (đầu Styles.html) và `BAN_GIAO_DIEN` (Script.html) phải **trùng nhau** – mỗi đợt sửa giao diện hãy tăng cả 3. Bước khởi động "kiểm tra phiên bản" chỉ đích danh file cũ; mọi lỗi khởi động hiện trong khung `baoLoiKhoiDong` (ghi tên bước + thông điệp lỗi) để chủ dự án chụp gửi, thay cho câu báo chung chung trước đây.
- **Lớp phủ:** `.modal` z-index 120 (trên thanh CTA 85 và mục lục 90). `.toast` có `pointer-events: none`.
- **Giao diện tối sang trọng "Kim Sa Trầm" (21/10/2026, chủ dự án chọn kiểu Tian Qi, làm toàn bộ web):**
  - **Bảng màu:** nâu khói, vàng kim và son, viết lại ở token `:root` đầu Styles.html.
    - Bản in (`.theme-light`, `.chart-frame`) chuyển sang tông giấy ngà và nâu vàng.
    - Mọi màu xanh ngọc, xanh đêm viết thẳng trong Styles/Script đã đổi sang nâu – vàng.
    - Màu "tốt" là `#6f9f5e`.
  - **Khối cuối Styles.html "GIAO DIỆN TỐI SANG TRỌNG":**
    - tiêu đề khung và Phần dùng chữ có chân Cormorant, góc 3–6px, viền vàng mảnh;
    - nút chính vàng kim chữ nâu, nút phụ viền vàng;
    - tab vàng; thanh CTA và thanh tab điện thoại nâu.
  - **Ảnh nhân vật** (`Anh.html` = **ảnh của chủ dự án, bắt buộc giữ**) đặt trong khung vàng hai lớp ở trang chủ (`.wl-anh`).
  - **Bảng chỉ số đầu tab Bát Tự** (`renderBatTu` › `chiSo`, CSS `.bcs-*`; `veDeHieu` đưa `.bt-chiso` lên trên văn dễ hiểu):
    - can nhật chủ;
    - thanh vượng – nhược theo `diem.phe`;
    - 4 tiêu chí ✓/✗;
    - 5 chip Dụng / Hỷ / Kỵ / Nhàn thần.
  - PDF nền tối `#120d09`. Phiên bản giao diện 2026.10.14.
- **Demo giao diện "Hỏa Tinh" (21/10/2026, chờ chủ dự án duyệt):** chủ dự án chê cả 3 phương án Tinh Hà / Giấy Dó / Lục Bảo (`tuvi-app/demo/giao-dien/`) và yêu cầu làm lại cả bố cục.
  - **Màu hợp mệnh Sơn Đầu Hỏa:**
    - nền đỏ rượu vang thẫm `#140809` (tránh đen, vì đen thuộc Thủy khắc Hỏa);
    - dải lửa cam → hồng → tím (màu Hỏa);
    - xanh ngọc `#3fd69c` cho tín hiệu tốt (Mộc sinh Hỏa);
    - vàng kim `#f6c76c` chỉ điểm xuyết (Thổ).
  - **Kiểu chữ:** Cormorant Garamond (tiêu đề), Be Vietnam Pro (nội dung), Chakra Petch (số, nhãn).
  - **Bố cục mới:**
    - thanh kính dạng viên thuốc dính trên đầu trang;
    - hero: chân dung trong viền xoay phát sáng và quỹ đạo, tên lớn chữ dải lửa, tứ trụ, bộ đếm, 2 nút;
    - lưới bento 12 cột.
  - **Biểu đồ động** (vẽ tay bằng SVG, chạy khi cuộn tới):
    - radar 12 cung;
    - vòng ngũ hành có dụng thần;
    - đồng hồ vượng – nhược có kim;
    - 9 lĩnh vực: thanh lửa + chấm từng hệ;
    - đường vận 0–85 tuổi (tài lộc, quan lộc, rủi ro sức khỏe lấy từ `duDoan.chuDe.*.diem`): dải đại vận, ◆ năm nóng, rê chuột hoặc chạm để xem thẻ từng năm;
    - cột 12 tháng (`hoSoThang`);
    - vòng % 6 sự kiện (`hoSoNam`);
    - lá số 12 cung bấm được: tam hợp viền lửa, xung chiếu viền tím.
  - **Hiệu ứng:** tàn lửa bay (canvas), quầng sáng trôi, lưới mờ. Tắt khi `prefers-reduced-motion`.
  - **Bản demo** dùng lá số chủ dự án nên lưu riêng tư: https://claude.ai/artifact/PBz32Cc5qPqNCoesKaJxCK. Trình dựng nằm ngoài repo.
  - **Khi duyệt:** chuyển vào Styles/Script/Index (tab giữ nguyên dữ liệu; Tổng quan thành bảng bento), giữ `Anh.html`.
  - **Đổi màu theo góp ý "trông máu me quá" (21/10), bố cục giữ nguyên.** Bảng màu mới **"Tử Ngọc"**, vẫn hợp mệnh Hỏa vì tím và hồng là màu Hỏa:
    - nền tím mận `#120a1c`;
    - dải sâm panh `#ffd29a` → hồng phấn `#f0a6ca` → tím lan `#c084fc` → tím `#9d6bff`;
    - xanh ngọc `#46d9a4` cho tín hiệu tốt; vàng `#f3cf8a`;
    - màu hành Hỏa trong dữ liệu là `#ff9a6b`.
    - Đường rủi ro sức khỏe và viền xung chiếu dùng hồng phấn. Cùng link demo.

  - **Đổi màu lần 2 theo góp ý về ngũ hành của chủ dự án (21/10; chi tiết lá số chỉ ở artifact riêng), bố cục giữ nguyên.** Bảng màu **"Bạch Kim"** (cùng link demo, phiên bản 3):
    - Kim: bạch kim, bạc (`#f7f5f0`, `#eef0f2`, `#cfd3d8`); Thổ: sâm panh `#e8cf8f`, `#d9c3a0`; Hỏa: vàng hồng / đồng hồng `#e3a588`, `#b8806a`.
    - Nền than ấm `#14110e` / `#1c1814` (không dùng đen xanh của Thủy); bỏ xanh lá (Mộc), xanh lá chỉ còn để tô hành Mộc trong dữ liệu (`#7fc79a`); màu xấu `#e48a8a`.
    - Biểu đồ đời: tài lộc sâm panh, quan lộc vàng hồng, sức khỏe nét đứt bạc. Hạt sáng vàng + bạc.
    - Kim chỉ là màu nhấn, Hỏa – Thổ vẫn giữ vai trò chính.
- **22/10/2026 – chủ dự án "Duyệt màu" → áp Bạch Kim + bento vào app (mã giao diện `2026.10.22`):**
  - `Styles.html`: token `:root` đổi sang Bạch Kim (thêm `--bk-grad`, `--bk-bac`, `--bk-sam`, `--bk-hong`, `--bk-dong`, `--bk-xau`). Màu viết thẳng đổi hàng loạt: nền nâu → than ấm, vàng kim → sâm panh, son → đồng hồng; tín hiệu tốt xanh lá → bạc, xấu đỏ → hồng dịu. Không đổi: khối `.theme-light` (bản in), màu Tứ Hóa, màu ngũ hành trong dữ liệu. Khối cuối "BẠCH KIM – HIỆU ỨNG NỀN + BẢNG ĐIỀU KHIỂN BENTO" (`.bk-nen`, `.bk-hat`, `.bdk-*`); nút chính dùng dải `--bk-grad` chạy nhẹ; ẩn mây, núi cũ.
  - `Index.html`: thêm `.bk-nen` (khối sáng trôi + lưới) và canvas `#bkHat`; `<div id="bdk">` ở đầu `#page-chart`; thêm font Chakra Petch.
  - `Script.html`: `bkDuLieu`, `veBangDieuKhien` (gọi trong `render`, bọc try/catch; khách chưa đăng nhập thì ẩn), các biểu đồ `bkRadar`, `bkDonut`, `bkGauge`, `bkLv`, `bkDoi`, `bkThang`, `bkSk`; `bkHat` (hạt sáng, chạy ở `init`). Mọi biểu đồ chạy hiệu ứng khi cuộn tới (IntersectionObserver), tắt khi người dùng chọn giảm chuyển động.
  - **Bản khóa:** chưa mở Biến cố thì đường vận cả đời chỉ vẽ bậc thang điểm đại vận + khung khóa `data-mua="bien_co"`; chưa mở Vận năm thì chỉ hiện sự kiện mồi + khung khóa `data-mua="nam"`; chưa mở Tổng hợp thì 9 lĩnh vực lấy từ `res.th6` (không chấm từng hệ), bỏ nguyên mẫu và bộ đếm từ `tomLuoc`.
  - Ảnh nhân vật (`Anh.html`) vẫn ở trang chào; bảng điều khiển của khách hàng dùng vòng ấn chữ cái đầu tên, không dùng ảnh chủ dự án.
  - Đã chụp kiểm tra ở 1366px và 390px, cả chủ sở hữu lẫn tài khoản thường: không lỗi trang, không tràn ngang. Kiểm thử: cai-dat 74/74, tong-hop, ho-so-nam, van-sau, nghiem-chung, lich-su, tien-ich, bao-cao, giai-doan, tai-khoan, thanh-toan đều đạt.
- **23/10/2026 – sửa theo tư vấn 4 chuyên gia** (ui-designer, ux-architect, accessibility-auditor, growth-hacker; mã giao diện `2026.10.23.1`):
  - Thanh mời mua (`veCta`, `capNhatCuon`): chỉ hiện khi đã cuộn quá 1,5 màn hình **và** dải mời đầu trang đã khuất (hết cảnh 3 lời mời cùng lúc); khách chưa đăng nhập chỉ thấy 1 nút quà (bỏ nút Trọn đời cạnh nút miễn phí, cả ở `veQc`); điện thoại: thanh cách lề 12px, tối đa 2 dòng, chừa đáy trang.
  - Lời cũ "bản giới hạn" → "Luận giải 6 hệ đã mở miễn phí…" (`tinhTrangMua` nhánh khách, `moDangNhap`); tab Vận hạn: khách chưa đăng ký thấy "🎁 tặng 19 xu – đủ mở 10 năm bạn đang sống".
  - Biểu đồ bento vẽ sẵn giá trị cuối (`ve(1)` trước `bkKhiThay`, thanh 9 lĩnh vực có sẵn `width`) – không còn "0%" khi chưa cuộn tới/in/chụp.
  - Tab là `<button role="tab" aria-selected>` trong `#tabs[role=tablist]`; phím ←/→/Home/End chuyển tab; `showTab` đặt `body[data-tab]` và cuộn tab đang chọn vào giữa thanh tab điện thoại (mép phải mờ dần).
  - Khối CSS cuối Styles.html "TƯ VẤN CHUYÊN GIA 10/2026": viền focus rõ, placeholder sáng hơn, nút 3D/2D chữ tối, `.dh-diem` dùng màu giao diện tối, văn luận giải 16px/1.7 (tối đa 72 ký tự/dòng), vùng bấm ≥ 44px trên điện thoại, nút hồ sơ lưới 2×2, bớt khung lồng trên điện thoại, lời chào chỉ ở tab Lá số, in thì hiện đủ khung "hiện dần".
  - **Chưa làm – chờ chủ dự án duyệt** (đụng bố cục bento đã duyệt / thứ tự bán hàng): gom bớt khung bento trên điện thoại, gom 11 tab thành 4 nhóm, đưa dòng thời gian lên đầu tab Vận hạn và gom các gói thành một bảng, hé câu đầu kết luận của lĩnh vực khóa, gắn nguồn cho nút mua để đo, sửa màu khung lá số 3D (sửa trong `tools/demo-3d.js` rồi sinh lại `LaSo3D.gs`), điểm "Con cái" lệch nhau giữa bánh xe và thẻ.

## 23/10 – Demo phong cách "Vũ trụ vàng" (chưa áp vào app)
- Chủ dự án gửi 3 ảnh mẫu (nền xanh đêm có sao, quả cầu + vòng hoàng đạo, vàng kim; bảng thiết kế "ASTRA – 5 hệ 1 bản đồ"). Đã dựng trang demo riêng: https://claude.ai/artifact/GarfMYuDq6bsT7biUfxBMZ
- Bảng màu demo: nền #0B0F17, thẻ #1A2332, vàng #D4AF37 / #F7E7B5, nhấn tím #6B5BFF, thông tin #00D1C1; chữ Playfair Display (tiêu đề) / Inter (thân) / Montserrat (nút). Gồm: thanh menu, hero "6 Hệ thống – 1 Bản đồ Bản thân" với quả cầu sao xoay (canvas, tắt chuyển động nếu máy đặt giảm chuyển động), 6 thẻ hệ, ô nhập ngày/giờ/nơi sinh có 3 bước, bảng tổng quan mẫu (điểm tổng, 9 lĩnh vực, tab Luận giải / Vận 12 tháng). Dữ liệu lá số mẫu, không phải người thật.
- Bản 2 (23/10, sau khi chủ dự án chê bản 1 "rất xấu"): làm lại toàn bộ. Có thiên bàn xoay (vòng độ, 12 cung hoàng đạo, 12 địa chi, 8 quẻ tiên thiên, quả cầu sao có quỹ đạo), nền trời nhiều lớp sao kèm tinh vân và sao băng. Ô nhập nằm ngay đầu trang (dương/âm lịch). 6 thẻ hệ, mỗi thẻ có câu hỏi mà hệ đó trả lời; 3 bước; bảng tổng quan mẫu dạng cửa sổ app (vòng điểm, mạng nhện 9 lĩnh vực, mức đồng thuận 6 hệ, nhịp 12 tháng; tab Luận giải hai tầng + "Nên làm"; tab Vận 2027). Bảng giá theo giá thật (0 / 19 / 49 xu) và phần kết có đường chân trời hành tinh phát sáng.
- **Lưu ý:** nền xanh đêm + tím/xanh ngọc trái với quyết định Bạch Kim ("không dùng xanh lá, đen xanh, xanh dương để trang trí"). Chờ chủ dự án chọn: giữ Bạch Kim, chuyển hẳn sang Vũ trụ vàng, hay thêm làm chế độ giao diện thứ ba.

## 23/10 – Demo phong cách "Hologram" (chưa áp vào app)
- Chủ dự án gửi ảnh màn hình kính hologram viền neon xanh lơ nổi giữa không gian, kèm yêu cầu "dùng mọi cách thiết kế theo phong cách này". Trang demo: https://claude.ai/artifact/C6SGBGqAMKYHSFaXhE5KoM
- Thành phần:
  - Màn hình kính nghiêng 3D (nghiêng nhẹ theo chuột trên máy tính), có vạch quét và vệt sáng vàng ở mép.
  - Giữa màn hình: bản đồ sao xoay (12 cung hoàng đạo, 12 địa chi, chòm sao vàng, 3 hành tinh, lõi sáng, tia quét radar).
  - Cột trái: hồ sơ mẫu, 9 lĩnh vực. Cột phải: vòng đồng thuận 6 hệ, lời nhắn tháng, nhịp 12 tháng.
  - Hàng nút 7 hệ bấm được (đổi chú thích và lời nhắn theo từng hệ).
  - Nền: hành tinh, chòm sao, sàn phản chiếu vòng tròn đồng tâm.
  - Phần dưới: ô nhập giờ sinh, 6 mô-đun hệ, bảng giá 0/19/49 xu.
- Chữ: Chakra Petch (tiêu đề, nhãn kiểu máy), Be Vietnam Pro (thân bài). Màu: nền #02060F, xanh lơ #3FD8FF / #B4F1FF, điểm vàng #F5C66B.
- Lá số mẫu 15/08/1990: số chủ đạo 33/6 (tính đúng), năm Canh Ngọ, Mặt Trời Sư Tử.
- Cũng trái với quy tắc màu của Bạch Kim; chờ chủ dự án chọn giữa Bạch Kim / Vũ trụ vàng / Hologram.

## 23/10 – Hologram 3D + 2 tài liệu hướng dẫn của chủ dự án
- Bản demo Hologram (cùng link C6SGBGqAMKYHSFaXhE5KoM) nay có quả cầu 3D thật bằng three.js r128 (cdnjs). Gồm:
  - Lưới cầu và chòm sao vàng trên mặt cầu; vòng hoàng đạo nghiêng 23,4°, vòng 12 địa chi, 2 vòng kinh tuyến vàng; 3 hành tinh; bụi sao.
  - Đế chiếu có cột sáng (shader). Kéo ngang để xoay quả cầu.
  - Màn hình kính nghiêng tới 20° và dựng thẳng dần khi cuộn; các bảng nổi lên bằng translateZ; thẻ phía dưới nghiêng theo chuột.
  - Không có WebGL thì quay về bản vẽ 2D.
- Chủ dự án gửi 2 file docx + README_ASSETS ("Hologram Claude Code Visual Guide", "Interaction UX Guide"). Ý chính:
  - Chart phải vẽ từ dữ liệu thật, không dùng ảnh. Tử Vi giữ lưới 4×4. Hà Lạc là quẻ Dịch.
  - WebGL chỉ dùng cho hero. Hạt nền 25–45 (desktop) / 8–16 (mobile), dừng khi tab bị ẩn. Có giảm chuyển động.
  - Phải có đủ 4 trạng thái loading/empty/error/success. PDF dùng nền sáng.
  - Token màu: #060B16, #0A1426, cyan #5CEBFF, xanh #6D8CFF, tím #B38CFF, vàng champagne #E8C77A, chữ #EAF4FF / #A8B8CC.
  - Lộ trình: giai đoạn 0 khảo sát và báo kế hoạch, chờ duyệt rồi mới sửa.
- Ảnh tham khảo trong docx có **dữ liệu lá số thật của chủ dự án** (tên, ngày giờ sinh) → tuyệt đối không đưa vào repo hay demo; chỉ dùng lá số mẫu.
- Đã đề xuất thiết kế lại 3 sơ đồ (chờ chủ dự án chốt):
  - Tử Vi: lưới 4×4 kính, ô giữa là thông tin lá số; bấm cung thì hiện tam phương tứ chính.
  - Bát Tự: một bảng hợp nhất gồm thập thần, can, chi, tàng can + thập thần, nạp âm, trường sinh, thần sát, không vong, đường hợp/xung, có thể thêm cột đại vận/lưu niên.
  - Human Design: vẽ bodygraph chuẩn gồm 64 cổng có số, kênh nửa màu ý thức/vô thức (dữ liệu `gates[g]` = 'p'/'d' có sẵn), cột hành tinh Design | Personality.

## 23/10 – Demo 4 sơ đồ Hologram (chủ dự án chốt "thay hẳn" Bạch Kim)
- Trang demo: https://claude.ai/artifact/DpFkFghKhTBxgip1xMxzGh, vẽ từ **dữ liệu thật** của lá số mẫu Nguyễn Văn An 15/08/1990 10:30 Hà Nội. Dữ liệu được tính bằng `tools/gia-lap.js` → `ctx.lapLaSo`; script xuất dữ liệu ở scratchpad (`xuat.js`) chưa đưa vào repo.
- **Tử Vi:** lưới 4×4 (GRID giống Script.html) gồm ô kính, nút sáng ở giao điểm, hoa văn mây vàng ở góc ô, Hóa Lộc/Quyền/Khoa/Kỵ thành nhãn màu, vạch Tuần/Triệt, thanh điểm cung. Ô giữa là thái cực xoay + thông tin lá số. Bấm cung → đường tam hợp (vàng) + xung chiếu (xanh, nét đứt), chi tiết hiện ở cột phải.
- **Bát Tự một bảng:** cột Giờ | Ngày (nhật chủ) | Tháng | Năm | Đại vận | Năm xem; hàng thập thần, can, chi, tàng can + thập thần, nạp âm, trường sinh, tự tọa, thần sát theo trụ (`battuChiTiet.thanSat`), không vong. Đường cong hợp/xung giữa các trụ; 5 quả cầu ngũ hành quanh thái cực (kèm vai trò Dụng/Hỷ/Kỵ); thước sức mạnh nhật chủ; hàng thẻ đại vận 10 năm.
- **Chiêm tinh:** vòng sao SVG (ASC bên trái), 12 cung, nhà Placidus, hành tinh giãn khi trùng, góc chiếu theo loại; rê hành tinh để làm sáng góc chiếu; 4 thẻ nguyên tố.
- **Human Design:** bodygraph đặt **cổng theo vị trí chuẩn trên cạnh từng trung tâm** (bảng `GO`); kênh tô nửa theo cổng (ý thức / vô thức / cả hai); hai cột 13 hành tinh Thiết kế | Tính cách; bấm trung tâm để xem có định nghĩa hay mở.
- Nền sao ≤40 hạt (14 trên điện thoại), dừng khi tab bị ẩn; có giảm chuyển động.
- Chủ dự án gửi thêm khoảng 20 ảnh artwork:
  - Khung trống cho Tử Vi 4×4, HD, Chiêm tinh, Hà Lạc bát quái, Bát Tự (4 trụ + 5 cầu ngũ hành + 10 ô đại vận).
  - 4 thẻ nguyên tố, người trong bầu cầu, số 9, cổng vũ trụ.
  - 3 tranh tiên cảnh không chữ.
  - Một số ảnh có dấu ✦ của Gemini ở góc phải dưới, phải cắt bỏ trước khi dùng.
  - Ảnh nhúng vào app theo kiểu `Anh.html` (base64 WebP).

## 23/10 – Demo 6 lá số đặt trên tranh của chủ dự án (cùng link DpFkFghKhTBxgip1xMxzGh, bản 2)
- **Tử Vi:** ảnh lưới 4×4 (1312×1199). Đo khung bằng pixel: cột x = 135/396/655/916/1180, hàng y = 46/318/582/835/1106. Ô cung đặt đúng 12 khung; tên và thông tin lá số nằm trên và dưới vòng thái cực; đường tam hợp và xung chiếu bị kẹp trong vùng giữa.
- **Bát Tự:** ảnh 4 trụ + 5 cầu + 10 ô (1536×1024).
  - 4 khung trụ: can chi trong vòng tròn, thập thần, tàng can, nạp âm và trường sinh.
  - 5 quả cầu: % ngũ hành và vai trò; dụng thần có vòng sáng.
  - Bánh xe trái là đại vận, bánh xe phải là năm đang xem.
  - 10 ô đại vận: chặng hiện tại sáng vàng. Dữ liệu chỉ có 8 vận, nên 2 vận sau được nối thêm theo chiều thuận/nghịch.
  - Bảng chi tiết vẫn giữ bên dưới.
- **Hà Lạc:** ảnh bát quái (767×1024). 8 quẻ đơn: quẻ của tiên thiên sáng vàng, của hậu thiên sáng xanh. Hai quẻ kép có chấm đỏ ở hào nguyên đường; 2 bảng 5 dòng; kèm bảng lục hào bên cạnh.
- **Chiêm tinh:** ảnh vòng hoàng đạo (1254², Bạch Dương ở đỉnh, đi ngược chiều kim đồng hồ). Phủ đĩa tối r = 334, tâm (627, 580); hành tinh đặt đúng độ số; có 4 ô góc (Mặt Trời, Mặt Trăng, Cung Mọc, Nguyên tố).
- **Thần số:** ảnh 9 quả cầu (1024×1536).
  - Giữa là đường đời 33/6; 8 cầu quanh là các chỉ số chính.
  - Cột trái: năm/tháng cá nhân; cột phải: bài học, đam mê, mũi tên.
  - Hàng dưới: 4 đỉnh cao + thử thách.
- **HD:** ảnh bodygraph (1024×1536). Bodygraph SVG phủ lên hình người; 2 cột hành tinh đặt vào 2 khung ảnh.
- Ảnh lưu WebP (150–380 KB mỗi ảnh). Khi đưa vào app: nhúng base64 như `Anh.html`; một số ảnh có dấu ✦ Gemini cần cắt bỏ.

## 23/10 – ĐƯA HOLOGRAM VÀO APP THẬT (mã `2026.10.23.3`)
- Chủ dự án yêu cầu: sửa Hà Lạc (2 quẻ 6 hào nằm trong 2 khung dưới), rồi đưa tất cả lên web trong một lượt.
- **File mới `Holo.html`** (nạp bằng `includeTuyChon('Holo')` trong Index.html, đặt trước Script):
  - CSS các bảng + `window.TCCHolo = { ve, chonCung, veDuong, anh }`.
  - `ve(res, api)` dựng 6 bảng từ dữ liệu `res`:
    - `#holoTV`: chèn trong `#chartArea`, trước `.chart-scroll`.
    - Các bảng còn lại chèn đầu tab: `#holoBT` + bảng gộp tứ trụ, đại vận, năm xem (`page-battu`); `#holoHL` (`page-halac`); `#holoCT` (`page-astro`); `#holoTS` (`page-so`); `#holoHD` (`page-hd`, có class `co-holo` để ẩn `.hd-graph` cũ).
  - Tự tính thập thần, tàng can, nạp âm, trường sinh cho cột đại vận và năm (bảng `TANG`, `NAP` sao chép từ BatTu.gs và TuVi.gs). Đại vận nối thêm cho đủ 10 ô.
- **7 tranh `HoloAnh{TuVi,BatTu,HaLac,ChiemTinh,ThanSo,HD,Nen}.html`** (data:image/webp;base64, tổng ~1,6 MB):
  - Server trả từng tranh qua `layAnhHolo(ten)` trong Code.gs (danh sách trắng `HOLO_ANH_`).
  - Client tải chậm, nhớ trong `sessionStorage` (khóa `holo:<tên>`). Tranh `Nen` đặt ở `.sky #holoNen`.
- **Script.html:**
  - `render()` gọi `TCCHolo.ve` sau `veBangDieuKhien`; `selectPalace` gọi `TCCHolo.chonCung`.
  - Chế độ lá số thêm `holo`, là mặc định (khóa nhớ mới `tccCheDo2`). `datCheDo` đặt class `xem-holo`; ảnh PNG/PDF lá số tạm bỏ `xem-holo` để chụp bản 2D.
  - Index.html có thêm nút "✦ Hologram" trước "◈ 3D".
- **Styles.html:** khối cuối "GIAO DIỆN HOLOGRAM" đổi token màu sang navy/cyan/tím/vàng champagne, kèm sky, panel, tab, nút, `.bdk` (bento) và các nền nâu cũ. Bản in `.theme-light` giữ nguyên.
- **Công cụ:** `tools/gia-lap.js` có `HtmlService` + `layAnhHolo`; `tools/xem-truoc.py` nạp Holo.html.
- **Kiểm thử đạt hết:** cài đặt 83, Bát Tự 4008, Hà Lạc 8401, Chiêm tinh 1820, Thần số 2651, HD 2100, Tổng hợp 3098, Báo cáo 13, Luận ngày 1599. Xuất thử PDF không lỗi. Chụp 6 bảng ở 1366 và 390 px: không lỗi trang, không tràn ngang.
- **Còn có thể làm tiếp:**
  - Ô Tử Vi trên điện thoại còn chữ nhỏ (ẩn phụ tinh); các bảng Bát Tự cuộn ngang.
  - Phần luận giải bên dưới các tab vẫn theo khung cũ (đã đổi màu).
  - Trang chủ/đầu trang chưa có quả cầu 3D như demo.

## 23/10 (khuya) – Tử Vi: giữ nguyên lá số cũ, chỉ thay nền (mã `2026.10.23.5`)
- Chủ dự án báo bảng Tử Vi kiểu mới **sai, thiếu sao, trình bày sao không hợp lý**, yêu cầu giữ nguyên cấu trúc cũ và chỉ thay hình nền.
- Đã bỏ bảng `#holoTV` (Holo.html không gọi `veTuVi` nữa). Chế độ `holo` nay là **lá số 2D cũ** (`#chart`, đủ sao, phụ tinh, lưu tinh, vòng Bác Sĩ – Thái Tuế, Tuần/Triệt, đường tam hợp), chỉ đổi phần trình bày:
  - Nền `#chart` dùng tranh `HoloAnhTuVi`: `background-size: 125.55% 113.11%`, `background-position: 50.56% 33.1%`, để vùng lưới trong tranh (x 135–1180, y 46–1106) khớp đúng 4×4 ô.
  - Hàng đều nhau (`repeat(4, minmax(208px, 1fr))`); ô kính tối trong suốt; token màu tối riêng cho `.chart-frame`; ô giữa để lộ thái cực.
  - Ảnh PNG/PDF vẫn xuất bản nền sáng.
- **Bài học: không tự dựng lại lá số Tử Vi.** Giao diện mới chỉ được đổi nền và màu, giữ nguyên cách app xếp sao.

## 25/10 – Bố cục 5 hệ, bỏ ẩn phần chuyên sâu
- `veDeHieu` không còn gom các Phần vào `details.chuyen-sau`; chèn khối luận dễ hiểu ngay sau Phần 1, gọi `moChiTiet(pg)` (mở mọi `details` trừ `.coso` lý luận, `.qua-khu`, `.hsn-coso`) và `mucLucTab(pg)` (thanh `.muc-he` gồm nút `[data-nhay]` nhảy tới từng phần).
- Hàm mới `hoSoNhanh(tieuDe, [[nhãn, giá trị, ghi chú]])`, `bangHtml(cot, hang, cls)`. Hồ sơ nhanh cho Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc.
- Bảng mới: Bát Tự – Bảng ngũ hành (can lộ/chi/tàng can/lực/vai trò), Bảng thập thần theo nhóm; Chiêm tinh – Nguyên tố × tính chất, Bảng góc chiếu (sắp theo độ lệch); Thần số – Bảng tổng hợp các chỉ số, Bảng 4 đỉnh cao – thử thách.
- Mã `2026.10.25.1`. Kiểm tra bằng Playwright 1366 và 390 px: không lỗi, không tràn ngang.


## 25/10 (khuya) – card luận giải dễ đọc hơn (mã 2026.10.25.5)
- Nguyên nhân chữ khó đọc: `Holo.html` phủ tranh tab sau mỗi `.panel` chỉ 60–80%. Chủ dự án chọn "chỉ tăng độ tối chung": máy tính .88/.9, điện thoại .9/.93 (vẫn thấy tranh).
- Chữ: `Styles.html` cuối file `:where(.result-wrap .tab-page .panel) :where(p, li) { font-size: 16px; line-height: 1.7 }` (độ ưu tiên 0 để các khối chữ nhỏ có class riêng giữ nguyên).
- Tab "👑 Lá số chủ sở hữu" (`.tab-chu`, chỉ hiện với chủ sở hữu) và tab "📚 Tham khảo" 3 mục – xem [[TCC Tử Vi đối chiếu các phái]].
- 25/10 (đêm, mã 2026.10.25.8): `.tcc-luu-y` chuyển từ `.res-top` (Index.html) vào `<footer class="footer">`, CSS gọn (12,5px, không nền/viền).
- 25/10 (đêm, mã 2026.10.25.9): `.cta-bar` bị lệch ra mép phải vì hiệu ứng chung `.hien { animation: huLen }` đè `transform: translate(-50%)` → thêm `.cta-bar.hien { animation: none }`. Chân trang: `body.co-cta .footer { padding-bottom: 120px }`, điện thoại padding ngang 64px tránh nút tròn nổi. Kiểm tra bằng chuyên gia evidence-collector.
