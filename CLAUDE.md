# Thiên Cơ Các – bối cảnh cho phiên Claude Code mới

File này được Claude Code tự đọc khi mở repo. Nó thay cho "trí nhớ" của các phiên trước. Hãy đọc hết trước khi làm việc.

## Dự án
- Web app **Google Apps Script** luận vận mệnh 6 hệ: Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học, Human Design. Có bán nội dung bằng **xu**.
- Toàn bộ mã nằm trong `tuvi-app/`:
  - 24 file `.gs` (chạy chung một phạm vi toàn cục như Apps Script).
  - `Index.html`, `Styles.html`, `Script.html`, `Anh.html` (tùy chọn) và `NghiemChungUI.html`.
  - Bảng vai trò từng file: `tuvi-app/README.md`. Hướng dẫn cài đặt cho chủ dự án: `tuvi-app/HUONG-DAN-CAI-DAT.md`.
- **Nhánh làm việc: `claude/happy-brown-lttkz3`.** Chỉ commit và push lên nhánh này. Không tạo PR nếu chủ dự án không yêu cầu.

## Chủ dự án – cách làm việc (bắt buộc)
- **Trả lời bằng tiếng Việt.**
  - Chủ dự án không phải dân IT, nên hướng dẫn từng bước theo dạng **"MỞ FILE X → xóa hết → dán bản mới"**.
  - Luôn nói rõ **file nào cần dán lại** vào Apps Script, kèm bước **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai**, rồi Ctrl+F5.
- Nhắc **sao lưu** (Tổng quan → Tạo bản sao dự án) trước khi dán thay đổi lớn.
- Chủ dự án hay gửi file đã tự sửa. Khi nhận:
  - **Gộp 3 chiều** với bản trong repo (`git merge-file`), không ghi đè mất thay đổi của họ.
  - Rồi rà lỗi.
- **Văn luận giải cho người đọc:**
  - Ngôn ngữ đời thường. **Không nêu tên sao** trong phần "dễ hiểu". Thuật ngữ cổ phải giải nghĩa. Không dùng chữ Hán trong văn (chỉ giữ tên Hán-Việt).
  - **Tầng 1:** "Bạn thuộc mẫu người… / có xu hướng…".
  - **Tầng 2:** giọng nhẹ nhàng, không phán xét, luôn kèm hướng khắc phục.
  - Hai tầng không được mâu thuẫn nhau.
- **Nghiệm chứng:** từ 6/8 nhóm "đúng cao" trở lên là xác nhận, 4–5 nhóm là có thể đúng. Mã hiện quy ra tỷ lệ kèm ngưỡng %.
- **Bảo mật:**
  - Mật khẩu chủ sở hữu (`chienpham`) chỉ lưu dạng muối + băm (`TK_CHU_SEED` trong `TaiKhoan.gs`). **Không bao giờ ghi mật khẩu thật vào repo hay commit.**
  - Khóa payOS được nhập qua giao diện quản trị vào Script Properties, không đưa vào mã hay chat.

## Kiến trúc chính
- **Lập lá số:**
  - `Code.gs › lapLaSoDayDu_` → `lapMoRong_` gọi các hệ phụ, `tongHopLuan` (TongHop.gs) và `deHieuLap_` (DeHieu.gs).
  - `TaiKhoan.gs › lapLaSo(input, token)` áp quyền. Khách chưa mua nhận bản rút gọn `khachRutGon_` (có `mien`, `teaser`, `moi` = mồi vận hạn).
- **Bốn tầng luận** (thiết kế của chủ dự án):
  1. Dữ liệu.
  2. Facts: `taoFact_` trong Facts.gs, gồm he / linhVuc / nhom / loai / yNghia / trongSo.
  3. Kho văn: `renderVanCung_` trong Script.html; TuViHeThong.gs sinh văn 12 cung.
  4. Đồng thuận 6 hệ: `dhTongHop_` trong DeHieu.gs, gồm 9 lĩnh vực và điểm /10.
- **Thang điểm:** điểm thô → /10 bằng `chuanHoa10_(d) = round(100/(1+e^(-d/3)))/10`. Nhãn phải khớp điểm (có bài kiểm tra).
- **DeHieu.gs:** văn dễ hiểu cho Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc, cùng cấu trúc với phần Tử Vi. Hiển thị đầu mỗi tab; phần kỹ thuật gom vào `<details class="chuyen-sau">` (mặc định đóng, PDF tự mở).
- **Tổng hợp 6 hệ bản 2 (DeHieu.gs › `th6Lap_`, kết quả `deHieu.th6`):** 9 lĩnh vực, mỗi lĩnh vực lấy điểm /10 + câu dễ hiểu của Tử Vi (điểm cung, câu mẫu `TH6_TV_CAU`), Bát Tự (12 lĩnh vực, điểm trong "Kết luận"), Hà Lạc và Chiêm tinh (8 lĩnh vực); Thần số, HD, văn Chiêm tinh là "góc nhìn thêm". Điểm chung có trọng số (TV 1,2 · BT 1,1 · CT 1,0 · HL 0,8), ngưỡng điểm chung ≥6 thuận / ≤4,8 cần lưu ý; số hệ cùng chiều; năm nổi bật sắp tới và đã qua lấy từ Biến cố hội tụ (`th: th` truyền vào `deHieuLap_`). Client `th6Html` (bảng nhiệt 9 lĩnh vực × 4 hệ, nút mở vận năm `nam|y` hoặc sang tab Vận hạn nếu đã mở, thẻ `tinhTrangMua`). Bản miễn phí: `th6Moi_` (TaiKhoan.gs) → `th6KhachHtml` chỉ lộ lĩnh vực mạnh nhất.
- **NghiemChung.gs (v6 trên nền v5):** thêm câu đồng thuận từ `th6` (`ncLv_`), năm đã qua từ ≥3 hệ cùng báo (`ncNamQua_`, bỏ năm trước 16 tuổi, gộp cùng năm), phiếu 3 hệ Tử Vi – Bát Tự – Hà Lạc cho anh em / cha mẹ (`ncBaHe_`).
- **NghiemChung.gs (v5):** 8 nhóm mô tả để khách tự chấm độ khớp giờ sinh, **lấy kết luận từ tổng hợp 6 hệ** (TongHop: vóc dáng, dấu vết cơ thể, trục tính cách, xuất thân, phối ngẫu + năm cưới đã qua, con cái, nghề, chặng đời) và đối chiếu Tử Vi × Bát Tự. Mỗi câu có nhãn đồng thuận; bỏ câu thiểu số (<1/3) và câu "cân bằng"; nhóm có độ tin làm trọng số; có lựa chọn "Không áp dụng".
- **BatTuPhanTich.gs:** Bát Tự theo quy trình 9 bước (vượng suy Thiệu Vĩ Hoa, dụng thần 4 phương pháp + bảng ưu tiên, cách cục đủ ngoại cách, cát hung, phương diện, đại vận, lưu niên đặc biệt). `batTuLap` gọi `btPhanTich_` rồi ghi đè `vuong/cuong/tyLeTro/phanTram/goiY` (giữ quy ước `goiY.hy[0]` = dụng thần) để mọi module dùng chung. Tab Bát Tự hiển thị theo Bước 1–9.
- **Bố cục chuyên sâu thống nhất:** tab Tử Vi chia Phần 1–4 (`khoiPhan`, chân dung lá số gộp một khung; thẻ xem nhanh cung chỉ hiện khi bấm). Tab Hà Lạc (`renderHaLac`, Phần 1–5), Thần số (`renderThanSo`, Phần 1–8), Chiêm tinh (`renderAstro`, Phần 1–8) và Human Design (`renderHD`, Phần 1–11) tự dựng khung (`PHAN_HE` đều = null; `xepPhan` giữ lại cho tương thích). `veDeHieu` chèn văn dễ hiểu lên đầu mỗi tab rồi gom các khung chuyên sâu vào `details.chuyen-sau`.
- **Vòm trời 6 hệ (Script.html › `vuTruHtml`, `vtThe`, `vtChon`, CSS `.vt-*`):** bánh xe SVG 9 lĩnh vực × 4 vòng hệ (trong → ngoài: Hà Lạc, Chiêm tinh, Bát Tự, Tử Vi; màu `th6Mau`), vùng phát sáng khi ≥3/4 hệ cùng chiều, quỹ đạo hành tinh thật lúc sinh làm nền. Bấm/phím mũi tên để xoay (`--q`, đường ngắn nhất) và đổi thẻ luận giải; nút chip làm nổi 1 hệ; "Đọc đầy đủ" mở mục `details` tương ứng. Đặt trong `th6Html` (bảng nhiệt chuyển vào "Xem dạng bảng điểm") và `th6KhachHtml` (bản miễn phí: 1 vòng điểm chung, vùng khóa mời mua). PDF: `chuanHoa` cố định SVG 640px và đổi xoay CSS thành thuộc tính `transform`. Tôn trọng `prefers-reduced-motion`.
- **Dòng thời gian cuộc đời (Script.html › `dtHtml`, `dtThe`, `dtChon`, CSS `.dt-*`):** đầu tab Vận hạn (cả bản miễn phí). SVG 0–90 tuổi: dải đại vận (`chiTiet.daiVan` hoặc `moi.daiVan`), cột từng năm (`tieuVanNhieuNam`), chấm biến cố (`tongHop.hoiTu.chuDe`, thiếu thì lấy `th6.namToi/namQua`). Thanh trượt + ‹ › chọn năm → thẻ: tuổi mụ, can chi, đại vận, biến cố, nút mở năm (`nutNam`) / đại vận / `bien_co` / `co_ban`. Không in vào PDF.
- **Hành trình dẫn dắt (Script.html › `htMo`, `htToi`, `htKetQua`, `htLaBai`; modal `#htModal` trong Index.html):** nút "✦ Nhập từng bước" (form) và nút "Khám phá ngay" mở hộp 4 bước (tên → ngày → giờ → nơi sinh), ghi vào form chính bằng `setForm` rồi `submit()`; `HT.cho` báo `submit` gọi `htKetQua` → màn khởi quẻ → 8 lá hé lộ hiện sẵn nội dung, bấm "Lá tiếp" để chuyển (dữ liệu `res.teaser.*.lo` + lĩnh vực mạnh nhất `th6`, lọc tên sao bằng `htCau`). Lá cuối: bản miễn phí mời kiểm chứng / mở khóa; bản đầy đủ dẫn tới Vòm trời, Dòng thời gian, Lá số, Kiểm chứng. `showErr` trả hộp về bước cuối nếu lỗi.
- **Bố cục trang (máy tính ≥1081px):** cột trái `#navCol` (tab xếp dọc + mục lục, JS chuyển vào lúc khởi động), giữa là kết quả, phải là form. Điện thoại: tab ngang như cũ. Lá số Tử Vi trên điện thoại được thu nhỏ vừa màn hình (`coLaSo`; `chupLaSo` bỏ thu nhỏ khi chụp PNG/PDF; `drawOverlay` quy toạ độ về kích thước gốc).
- **PDF bản đầy đủ (~82 trang, ~70 giây):** mỗi hệ lấy biểu đồ chính (`PDF_CHINH`) + văn dễ hiểu + các phần luận lĩnh vực/tổng hợp/lời khuyên (`PDF_LUAN`, theo `data-g` của khung Phần/Bước); Tử Vi lấy ảnh lá số + Phần 1 chân dung + Phần 3 Tử Vi × Bát Tự; vận hạn bỏ lịch ngày. Không chép bảng kỹ thuật. `tg-head` được coi là tiêu đề để không mồ côi cuối trang.
- **Tab (Index.html):** Lá số → Tổng quan 6 hệ → **Vận hạn** (`page-vh`, dựng bởi `veVanHan` trong Script.html; gom đại vận, năm, tháng, ngày, biến cố) → Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc → Cặp đôi → Lịch sử.

## Mô hình bán hàng (ThanhToan.gs) – bán theo giai đoạn
- `TT_PHAN_MAC_DINH` là bảng giá mặc định; chủ dự án sửa được trong Quản trị.
- **Bản mở** `co_ban` (49 xu): bản mệnh, mở vĩnh viễn.
- **Vận hạn bán lẻ theo giai đoạn.** Mỗi lần mở ghi một dòng vào sheet `MoKhoa` (cột "Phần") với mã:
  - `dv:<năm bắt đầu>`: một đại vận, 19 xu (vận đã qua 9 xu).
  - `nam:<năm>`: vận năm, 29 xu.
  - `thang:<yyyy-mm>`: nhật vận một tháng, 9 xu.
  - `dong_hanh:<năm>`: đồng hành cả năm, 79 xu (trừ phần đã mua).
- **Gói trọn:** `tron_dai_van` 99 xu. `tron_goi` (Trọn đời, 149 xu) gồm `TT_TRON_GOI`, **không gồm năm/tháng** (vẫn giữ nguồn thu định kỳ).
- **Gói gia đình:** `gia_dinh_3` / `gia_dinh_5` cộng lượt vào sheet `Ve`. `dungLuotGiaDinh` dùng 1 lượt = Bản mở + vận năm cho 1 lá số.
- **Quyền:** `ttQuyen_` trả `q` gồm cờ từng phần, `q.dvMo`, `q.namMo`, `q.thangMo`, `q.dhNam` và `dvAll/namAll/thangAll`.
  - **Chú ý:** không đặt tên map trùng tên gói (`nam`, `thang`), vì từng gây lỗi ghi đè.
- **Cắt nội dung ở máy chủ:** `ttCatPhan_` bỏ lời luận của phần chưa mở, chỉ giữ điểm làm mồi, và gắn `r.vanTom`.
- **Gói cũ:** người đã mua `luu_nien` được xem mọi năm/tháng.
- **Phía trình duyệt:** `data-mua="phan|id"` → `muaGo`; `tinhTrangMua` quyết định thanh kêu gọi mua; `chenKhoa` chèn thẻ khóa; `bangGiaHtml` là bảng giá 3 bậc.
- **Bản miễn phí:** `renderKhach` có câu mở, nút nghiệm chứng, dòng thời gian đại vận bị che, bảng giá và cam kết minh bạch.
- **Phễu nghiệm chứng:** `phieuNc` trong Script.html. Khớp → mời mở; nửa khớp → dò giờ; không khớp → nói thật "phương pháp có thể không hợp với bạn, đừng mua".

## Kiểm thử (chạy trước khi commit)
```bash
cd tuvi-app
node tests/giai-doan.js                        # bán theo giai đoạn, gói gia đình, phần cắt ở máy chủ (34 kiểm tra)
node tests/lich-su.js                          # lịch sử: lá số trùng chỉ giữ bản mới nhất, ẩn trùng, dọn trùng
node tests/nghiem-chung.js                     # nghiệm chứng dựa trên tổng hợp 6 hệ
node tests/tong-hop.js                         # Tổng hợp 6 hệ bản 2: nhãn khớp điểm, không tên sao, bản miễn phí chỉ lộ 1 lĩnh vực
node tests/bat-tu.js                           # Bát Tự 9 bước trên 400 lá số
node tests/ha-lac.js                           # Hà Lạc lục hào nạp giáp (bát cung, lục thân, phục thần) trên 200 lá số
node tests/than-so.js                          # Thần số học 6 bước (nợ nghiệp, số 0, số bậc thầy…) trên 300 lá số
node tests/chiem-tinh.js                       # Chiêm tinh 7 bước: Chiron/Lilith, cấu hình, 8 lĩnh vực, chu kỳ, so sánh (~40 giây)
node tests/human-design.js                     # Human Design 11 bước; đối chiếu màu Mặt Trời với hd-chart-engine nếu đã npm install trong tests/
TK_PASS='<mật khẩu chủ>' node tests/tai-khoan.js   # cần mật khẩu chủ sở hữu – hỏi chủ dự án hoặc đặt biến môi trường TK_PASS
TK_PASS='<mật khẩu chủ>' node tests/thanh-toan.js
cd tests && npm install && node thien-van.mjs && node doi-chieu.js   # đối chiếu thiên văn / an sao với thư viện nguồn mở
```
- **Mô phỏng Apps Script:** `tools/gia-lap.js` gồm Sheet trong bộ nhớ, Properties, Cache, Lock và payOS giả. Dùng `const { ctx } = require('./tools/gia-lap.js')`, rồi gọi thẳng các hàm `.gs`.
- **Xem giao diện:**
  - `python3 tools/xem-truoc.py` → `tools/preview.html`. `google.script.run` được thay bằng `window.srv`.
  - `PW=/opt/node22/lib/node_modules/playwright node tools/chup.js` chụp các tab (`W=390` để giả điện thoại).
  - Không chạy `playwright install`; Chromium có sẵn.
- **Kiểm tra cú pháp:** `.gs` thì copy ra `.js` rồi `node --check`. `Script.html` thì trích nội dung `<script>` rồi `node --check`.
- **Giới hạn mạng:** WebFetch bị chặn với một số trang tiếng Việt (vd. lasobattu.com, 4thuman.com); WebSearch dùng được.

## Lưu ý kỹ thuật đã gặp
- **Lịch sử lá số (Code.gs):** trùng = cùng tài khoản + họ tên (bỏ hoa/thường, khoảng trắng) + giới tính + ngày dương + giờ + phút (`lsKhoa_`). `luuLichSu_` xóa bản cũ trùng trong 400 dòng gần nhất rồi ghi bản mới; `getLichSu` ẩn trùng; `donLichSu(token)` (nút "🧹 Dọn lá số trùng") xóa trùng cũ trong Sheet.
- `google.script.run` **không trả được Date**, ra null. Vì vậy lịch sử dùng `getDisplayValues` và ghi ngày có tiền tố `'`.
- **Khởi động trang:** gắn tab và Lịch sử **trước tiên**, mỗi bước bọc trong `buoc(...)`. Một bước lỗi (vd. Index.html cũ thiếu phần tử) không được làm chết cả trang.
- **Lớp phủ:** `.modal` z-index 120 (trên thanh CTA 85 và mục lục 90). `.toast` có `pointer-events: none`.
- **PDF:** `xuatPdf` trong Script.html dựng từ nội dung đang hiển thị.
  - `chuanHoa` bỏ giao diện bán hàng (thẻ khóa, ưu đãi, bảng giá).
  - Các mục: tom, linhvuc, nguoi, duyen, doi, vh, bien, chart, battu, astro, so, hd, halac, them. Nhóm hiển thị theo `PDF_NHOM`.
- **Thêm file `.gs` mới:** phải thêm vào `HAM_CAN_CO` trong Code.gs (hàm `kiemTraCaiDat`) và cập nhật số file trong HUONG-DAN-CAI-DAT.md.

## Tiến trình
**Đã xong** (xem `git log`):
- Lá số và 6 hệ; tài khoản, ví xu, payOS; cặp đôi.
- Văn dễ hiểu 12 cung (của chủ dự án) và 5 hệ, cùng phần đồng thuận 6 hệ.
- Nghiệm chứng theo sách cổ.
- Bán theo giai đoạn, tab Vận hạn, gói gia đình, bản miễn phí có phễu.
- PDF theo bố cục mới.

**Việc có thể làm tiếp / còn ngỏ:**
- Chủ dự án muốn làm **kỹ từng hệ một**. Đã xong: Bát Tự 9 bước; Hà Lạc lục hào (HaLac.gs: `hlLucHao_` nạp giáp/Thế Ứng/lục thân/lục thú/phục thần/vượng suy theo tháng–ngày sinh/không vong/hào động hóa; `hlLinhVuc_` 8 lĩnh vực; `hlThoiVi_` hóa công – nguyên khí; `hlQueKhac_` Biến/Thác/Tổng). Thần số học 6 bước (ThanSoHoc.gs `tsPhanTich_`: chỉ số cốt lõi + bổ sung, nợ nghiệp, chu kỳ năm/tháng/ngày, 4 đỉnh cao, luận 5 lĩnh vực, lời khuyên, trường hợp đặc biệt; tab 8 phần có biểu đồ ngày sinh/tên/tổng hợp, đỉnh cao, chu kỳ 9 năm, tháng, lịch 30 ngày, ô "Thử tên"). Chiêm tinh 7 bước (ChiemTinh.gs `ctPhanTich_`: giờ sao, Nút Nam/Chiron/Lilith, Big Three, 12 nhà, cấu hình Stellium/T-Square/Grand Trine/Grand Cross/Yod, 8 lĩnh vực, `ctChuKyThoiGian_` transit/tiến triển/Solar Arc/Solar Return/Lunar Return, lời khuyên, trường hợp đặc biệt; `ctSoSanh_` nhà chồng lấn/Composite/Davison dùng trong CapDoi; tab 8 phần có lưới góc chiếu). Human Design 11 bước (HumanDesign.gs `hdPhanTich_`: 5 loại, 7 thẩm quyền, định nghĩa + cổng cầu nối, 12 hồ sơ, 9 trung tâm, 36 kênh theo mạch cá nhân/hợp tác, 64 cổng đen–đỏ/treo/trống, 4 biến số từ màu – tông, hồi quy Mặt Trời, chu kỳ 7 năm, transit, luận tổng hợp; tab 11 phần). **Cả 6 hệ đã làm lại theo quy trình của chủ dự án.** Việc có thể làm tiếp: chờ chủ dự án góp ý sau khi dán; PDF đã kiểm tra (82 trang; trong sandbox cdnjs bị chặn nên phải chép html2canvas/jspdf vào tests/node_modules để thử).
- Bản PDF xem thử: mục "Kết hợp 6 hệ theo lĩnh vực" chưa có ảnh xem trước mờ, trông trống (có thể bỏ khỏi bản xem thử).
- Giá bán là mức khởi đầu, chưa qua thử nghiệm; nên xem doanh thu trong Quản trị rồi điều chỉnh.
- Chủ dự án nên đổi mật khẩu chủ sở hữu sau lần đăng nhập đầu, nếu chưa đổi.

## Dự án phụ: `kpi-app/` (web app KPI sản xuất của chủ dự án, không liên quan Thiên Cơ Các)
- `kpi-app/Code.gs`, `kpi-app/Index.html` là bản đã vá, sinh từ `kpi-app/goc/` bằng `tests/va-code.py` và `tests/va-index.py`. Sửa tiếp thì sửa hai script vá này (hoặc sửa thẳng rồi cập nhật `goc/`).
- Hướng dẫn cho chủ dự án: `kpi-app/HUONG-DAN-CAP-NHAT.md`.
- **Báo cáo tháng (05/10):** `tests/bao-cao.gs` (nối vào Code.gs bởi va-code.py) tạo PDF toàn nhà máy + từng xưởng, tự gửi sau chốt tháng (Drive + email theo sheet `NguoiNhanBaoCao`); web: khung "Báo cáo tháng" trên trang Bảng KPI (`khoiBaoCaoThang`, `taiBaoCaoUI` trong va-index.py; `call()` tự thêm TOKEN, đừng truyền lại). Kiểm thử `tests/bao-cao.js`. HTML báo cáo chỉ dùng bảng/màu nền (Apps Script đổi PDF không hỗ trợ flex/grid/SVG). Chủ dự án cần chạy `TAO_SHEET_NGUOI_NHAN_BAO_CAO` rồi `GUI_BAO_CAO_THANG_TRUOC` một lần để cấp quyền Drive/Gmail (HUONG-DAN Phần F).
- Bản 29/09: tăng tốc máy chủ (`tests/toc-do.gs`: gom ghi, nhớ tạm kết quả, `napPhan` + `phanDoi`, Sheets API, lưu trữ nhật ký) và giao diện bên trong mới (`tests/giao-dien-moi.html`: menu nhóm, thanh dưới điện thoại, tab Việc hôm nay, bảng màu xám than + cyan, nút ☀/☾, hiệu ứng chỉ chạy khi có sự kiện và tôn trọng prefers-reduced-motion). Bản xem thử 1 file: `tests/tao-ban-xem-thu.js` (kết quả có số liệu thật đã ẩn danh, không commit). Kiểm thử: `kpi-app/README.md` (cần dữ liệu JSON xuất từ Sheet, không commit vì có dữ liệu cá nhân).
- Demo giao diện (chủ dự án thích phong cách **thiết bị đo nhà máy**: kim lò xo, đồng hồ cơ, mặt tối; chê bộ 3D và 7 mẫu đầu demo-2 là "xấu, không đạt"). Mẫu đã duyệt nằm trong `kpi-app/mau-da-chon/`: `dong-ho-hieu-suat.html` (demo-2 số 8), `cum-dong-ho-xuong.html` (demo-3 số 1), `dong-ho-lat-dem-nguoc.html` (demo-3 số 8), `thuoc-truot-dinh-muc.html` (demo-4 số 5). `demo-4.html` (trừ số 5) và `demo-5.html` bị chê "không ổn" – chủ dự án muốn thêm **demo tương tác** và **giao diện nền**: `kpi-app/demo-tuong-tac.html` (6 thao tác nhập liệu) và `kpi-app/demo-giao-dien-nen.html` (khung web 4 kiểu nền × 3 bố cục) – cả hai cũng chưa vừa ý ("trông như đồ chơi, không sát công việc"). Hướng mới: **làm lại đúng màn hình đang dùng, đặt bản cũ cạnh bản mới**, bỏ trang trí giả đồ vật. Bắt đầu với `kpi-app/demo-duyet-san-luong.html` (dựa trên `vDuyetSL` thật), chờ góp ý. Demo Lottie: `kpi-app/demo-lottie.html` (4 chỗ: chờ báo cáo, duyệt xong, trang trống, mất mạng; hoạt ảnh tự vẽ `kpi-app/lottie/*.json` bằng `tests/tao-lottie.py`; sandbox chặn cdnjs nên nhúng thẳng lottie-web lấy từ npm) – chủ dự án duyệt cả 4, **đã gắn vào web thật** (va-index.py mục 8, kiểm thử `tests/lottie-web.js`); demo Lottie đợt 2 `kpi-app/demo-lottie-2.html` (chốt tháng, điểm danh, CN gửi sản lượng, xuất Excel, kỳ chưa có dữ liệu, hết phiên; sinh bằng `tests/tao-lottie-2.py`, hàm chung `tests/lottie_cu.py`) – chủ dự án duyệt, **đã gắn vào web** (va-index.py mục 9; hết phiên không tự tải lại trang nữa). Demo Lottie đợt 3 `kpi-app/demo-lottie-3.html` (trả lại sản lượng, máy đang sửa, ghi vi phạm, nghỉ dài hạn, thêm nhân sự, đổi mật khẩu; `tests/tao-lottie-3.py`) – chủ dự án duyệt, **đã gắn vào web** (va-index.py mục 10). **Lỗi đã sửa 07/10:** hai hiệu ứng "thanh mọc từ 0" (`play` cũ trong goc + `hieuUngMoi` của giao-dien-moi.html) chạy chồng làm thanh `.hbar .hfill` (So sánh hiệu suất giữa các xưởng) kẹt ở 0 – nay cùng đọc chiều rộng thật qua `data-w` (va-index.py mục 11, kiểm tra trong `tests/hieu-ung.js`). Demo Lottie đợt 4 `kpi-app/demo-lottie-4.html` (chốt ca, đề xuất định mức, miễn trừ KPI, cấp lại mật khẩu có nút Chép, gán công đoạn, thanh lý máy; `tests/tao-lottie-4.py`) chờ góp ý, chưa gắn vào web. **Bàn giao 07/10 (từ phiên trước):**
  - Chưa rõ chủ dự án đã dán các bản gần đây lên Apps Script chưa (Code.gs bản báo cáo tháng 05/10 + Phần F HUONG-DAN; Index.html bản 07/10 chiều có sửa lỗi thanh So sánh hiệu suất + Lottie đợt 1–3). Hỏi lại trước khi làm thay đổi mới.
  - Lỗ hổng phân quyền đã phát hiện, **chưa sửa, chờ chủ dự án quyết**: `layKPIKy` trả bảng KPI toàn nhà máy cho mọi vai trò; `thongKeNghiThang` / `siSoTatCaXuong` lộ lý do nghỉ của xưởng khác.
  - Chờ góp ý: `kpi-app/demo-duyet-san-luong.html`, `kpi-app/demo-lottie-4.html`, `kpi-app/demo-huong-dan-cn.html` (nhân vật anime Mai hướng dẫn công nhân nhập sản lượng khi đăng nhập lần đầu; SVG tự vẽ kiểu **chibi** (08/10: chủ dự án muốn dễ thương hơn, mặt lấy cảm hứng ảnh AI của họ – tóc bob nâu đen mái lệch, mắt nâu mật ong, khuyên tai; áo khoác đồng phục thể thao kín đáo; KHÔNG dùng ảnh gốc vì có logo LA Dodgers/CrossFit/Rogue và trang phục hở) – nguồn chung `kpi-app/tests/mai/mai-chibi.js`, chép vào biến `MAI`, các bước trong `BUOC`, kiểm tra theo quy tắc `cnGui`; khi gắn vào web: gọi từ `vaoHeThong` cho vai trò CN nếu chưa có cờ đã xem, rọi vào phần tử thật của `vCNNhap`). Và `kpi-app/demo-khau-hieu.html` (Mai nói khẩu hiệu khích lệ ở 6 chỗ, 33 câu theo 6 chủ đề, đổi theo ngày; giọng khen, không chê; không bịa số liệu web không có).
  - **Mai đã gắn vào web (08/10, chủ dự án nói "Do your best")** – `kpi-app/tests/mai/va-mai.py` = mục 12 của va-index.py (exec): `maiChao` (mỗi ngày 1 lần, lùi lại nếu đang hướng dẫn), `maiBang` (khẩu hiệu của ngày ở `vHomNay` + `vCNNhap`), `maiTourCN` (rọi sáng phần tử thật, KHÔNG tự gõ vào ô; tự mở lần đầu, khóa `kpi_mai_hd_cn_<tk>`; nút "? Hướng dẫn nhập"), `maiXacNhan` chen vào `cnGui` trước `congNhanGuiSanLuong` (đọc lại từng dòng + tổng, cảnh báo >5.000; "Sửa lại" gọi `huy`), `maiKhenGui` + `maiChuoi` (chuỗi ngày gửi đều, bỏ CN), `maiKPI` trong `vKPICaNhanToi` (số % còn thiếu tính từ `loai`), `maiNghi` 10:00/15:00, nút `#btnMai` tắt/bật (`kpi_mai`='tat'). Không làm "tin vui cả xưởng" vì web chưa có kế hoạch tháng theo xưởng. Kiểm thử `tests/mai-web.js` (32, đặt múi giờ Asia/Ho_Chi_Minh). Câu khẩu hiệu đang nằm trong mã (`MAI_KH`); việc tiếp theo có thể: chuyển sang sheet `KhauHieu`.
  - Quy ước hoạt ảnh Lottie: tự vẽ bằng `tests/tao-lottie*.py` (hàm chung `tests/lottie_cu.py`), màu CY #2fd3c6 / XAM #aab5bc / AM #f0b04e / DO #f26b6b; mỗi đợt làm demo "Hiện tại" cạnh "Có Lottie", chủ dự án duyệt rồi mới gắn vào web (va-index.py, mỗi đợt một mục mới), luôn có hình tĩnh dự phòng `LT_TINH` và tôn trọng giảm chuyển động. Chỉ nói đúng chức năng thật trong câu chữ hoạt ảnh (đã kiểm tra thông điệp máy chủ).
  - Plugin Claude Code: `.claude/settings.json` bật ponytail, claude-mem (chỉ bản chạy trên máy, KHÔNG bật claude-mem-cowork vì gửi dữ liệu lên cmem.ai), task-observer, claude-code-setup. Trên phiên đám mây có thể không tải được plugin.
  - Phiên đám mây chặn tự sửa cài đặt Claude (`.claude/settings.json`) ở chế độ Auto; cần chủ dự án chuyển sang "Accept edits" và bấm cho phép.
  Tách một mẫu từ trang demo ra file riêng: lấy CSS chung + khối `/* ===== N.` + `<section id="demoN">` + phần JS chung + khối `/* =================== N.`. Chưa gắn mẫu nào vào web thật.
