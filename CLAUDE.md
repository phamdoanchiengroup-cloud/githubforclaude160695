# Thiên Cơ Các – bối cảnh cho phiên Claude Code mới

File này được Claude Code tự đọc khi mở repo. Nó thay cho "trí nhớ" của các phiên trước. Hãy đọc hết trước khi làm việc.

## Dự án
- Web app **Google Apps Script** luận vận mệnh 6 hệ: Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học, Human Design. Có bán nội dung bằng **xu**.
- Toàn bộ mã nằm trong `tuvi-app/`:
  - 25 file `.gs` (chạy chung một phạm vi toàn cục như Apps Script).
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
  - `TaiKhoan.gs › lapLaSo(input, token)` áp quyền. **Từ 10/2026: mọi người (kể cả chưa đăng nhập) nhận bản đầy đủ luận giải 6 hệ**; máy chủ chỉ cắt phần khóa: `ttCatPhan_` (vận hạn, biến cố, phối ngẫu) và `ttCatTongHop_` khi chưa có `co_ban` (bỏ `deHieu.th6/tongHop`, các mục Tổng hợp trong `moRong.tongHop`; gắn `r.th6 = th6Moi_(r)` làm mồi, `r.tongKhoa = true`). `khachRutGon_` không còn dùng.
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
- **Sinh động & gần gũi (Script.html › `veChao`, `chaoHtml`, `hieuUng`, `huDem`, `mungMo`, `huPhaoHoa`; CSS `.chao*`, `.cho-hien/.hien`, `.an-sao`, `.hu-*`):** lời chào theo giờ + tên + ngày/tháng/năm cá nhân (công thức giống `namCaNhan` ở ThanSoHoc.gs) + đếm ngược sinh nhật (ẩn được trong ngày, `sessionStorage`); khung hiện dần khi cuộn (IntersectionObserver, gắn trong `sauHienThi`), điểm số đếm lên và thanh điểm dâng khi hiện; lá số "an sao" 12 cung hiện lần lượt từ cung Mệnh (`renderChart`); con dấu "Đã mở khóa" + kim sa khi mua thành công (`muaGo`). Tắt hết khi `prefers-reduced-motion`; `.pdf-root` tắt mọi animation và buộc hiện đủ.
- **Giao diện chuyên nghiệp (khối cuối Styles.html "GIAO DIỆN CHUYÊN NGHIỆP" + Script.html › `veHoSo`, `moForm`, `dongForm`):** giữ bảng màu cũ; bỏ quả cầu/núi/góc trang trí/chữ chuyển màu; tiêu đề khung chữ không chân; `.tg-head` thành đầu mục có vạch vàng (không còn tấm băng); nút chính màu đặc; tab trái dạng danh sách có vạch sáng. Khi có kết quả: `body.co-ket-qua` ẩn ô nhập, bố cục 2 cột (tab | nội dung ≤1080px), thẻ hồ sơ `#hoSoTom` (✎ Sửa thông tin / ＋ Lá số mới) mở ô nhập dạng ngăn kéo phải (`body.mo-form`, nền `#formNen`, Esc để đóng; `submit` tự đóng). Dải quảng cáo sau khi có kết quả chỉ còn 1 dòng. Gợi ý kiểm chứng `#ncBanner.nc-goi` gọn (chi tiết trong `details`). Xóa khối CSS này là về giao diện cũ.
- **Bố cục trang (máy tính ≥1081px):** cột trái `#navCol` (tab xếp dọc + mục lục, JS chuyển vào lúc khởi động), giữa là kết quả, phải là form. Điện thoại: tab ngang như cũ. Lá số Tử Vi trên điện thoại được thu nhỏ vừa màn hình (`coLaSo`; `chupLaSo` bỏ thu nhỏ khi chụp PNG/PDF; `drawOverlay` quy toạ độ về kích thước gốc).
- **PDF bản đầy đủ (~82 trang, ~70 giây):** mỗi hệ lấy biểu đồ chính (`PDF_CHINH`) + văn dễ hiểu + các phần luận lĩnh vực/tổng hợp/lời khuyên (`PDF_LUAN`, theo `data-g` của khung Phần/Bước); Tử Vi lấy ảnh lá số + Phần 1 chân dung + Phần 3 Tử Vi × Bát Tự; vận hạn bỏ lịch ngày. Không chép bảng kỹ thuật. `tg-head` được coi là tiêu đề để không mồ côi cuối trang.
- **Tiện ích bán lẻ (TienIch.gs + Script.html › `veTienIch`, `tiChay`, `tiKqHtml`; tab `ti` "✦ Tiện Ích"):** 7 công cụ, mỗi công cụ có phần hé lộ miễn phí + phần trả phí, luôn kèm mục "Cơ sở" và câu "chỉ để tham khảo" (`TI_THAM_KHAO`). API `tienIch(input, loai, thamSo, token)`:
  - `xem_tuoi` (9 xu): Kim Lâu, Hoang Ốc, Tam Tai theo tuổi mụ; miễn phí năm nay, trả phí bảng 10 năm + hóa giải.
  - `phong_thuy` (19 xu): cung phi Bát trạch (`tiCungPhi_`), miễn phí hướng Sinh Khí, trả phí 8 hướng + bố trí.
  - `chon_ngay` (9 xu/việc/tháng, mã `ngay:<việc>:<yyyy-mm>`): chấm điểm ngày (hoàng đạo, trực, tú, Tam Nương, Nguyệt Kỵ, xung tuổi, Bành Tổ); "Nên tránh" khi xung tuổi hoặc điểm ≤ −4.
  - `hop_tac` (19 xu, khóa theo cặp như `cap_doi`), `dat_ten` (29 xu, từ điển `TI_TEN` theo ngũ hành dụng thần).
  - `gieoQue` (Mai Hoa theo thời gian; câu đầu miễn phí, sau đó 9 xu/câu; sheet `GieoQue`).
  - `dangKyBanTin` (39 xu, 12 tháng; email hằng tháng qua `guiBanTinThang`, chủ dự án chạy `caiDatBanTin` một lần để tạo trigger).
  - `xem_tuoi`, `phong_thuy` nằm trong `TT_TRON_GOI`.
- **Demo lá số Tử Vi 3D (chưa gắn vào app):** `tuvi-app/demo/la-so-3d.tpl.html` (khuôn) → `node tools/demo-3d.js ['{json input}']` dựng `demo/la-so-3d.html` từ lá số thật. Three.js r160 (UMD từ jsdelivr), bàn 4×4 truyền thống, 12 đền cao theo `diem10`, 14 chính tinh thành "hình mẫu" (`HM`: biểu tượng, tên hình mẫu, nhân vật Phong Thần, mặt sáng/tối, lời khuyên; vẽ canvas `veHinhMau`), cung vô chính diệu mượn hình mẫu cung đối (mờ), phụ tinh là hạt sáng quay quanh đền, đường tam hợp (vàng) – xung chiếu (lam), đèn dẫn đường nhảy qua 12 cung theo thứ tự Mệnh → Phụ Mẫu (`diToi`, `tuChay`), thẻ luận dễ hiểu không nêu tên sao (`vanCung`). Phụ tinh: 59 hình mẫu (`PT`: biểu tượng, tên hình mẫu, họ, ý nghĩa) chia 8 họ (`NHOM_PT`, mỗi họ một lời khuyên), là huy hiệu tròn (`veHuy`, viền vàng = sao tốt, đỏ = sao xấu theo vị trí trong `cat/hung`) xoay quanh đền, bấm được (`moPT`); thẻ cung có mục "Nhân vật phụ quanh cung" (`ptChips`), văn dễ hiểu nêu tên hình mẫu (không nêu tên sao); bộ sưu tập theo họ (`veBoPT`). Thử trong sandbox: chặn jsdelivr thì route tới `three/build/three.min.js` cài bằng npm, chạy Chromium với `--use-angle=swiftshader --enable-unsafe-swiftshader`.
- **Tab (Index.html):** Lá số → Tổng quan 6 hệ → **Vận hạn** (`page-vh`, dựng bởi `veVanHan` trong Script.html; gom đại vận, năm, tháng, ngày, biến cố) → Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc → Cặp đôi → Lịch sử.

## Mô hình bán hàng (ThanhToan.gs) – bán theo giai đoạn
- `TT_PHAN_MAC_DINH` là bảng giá mặc định; chủ dự án sửa được trong Quản trị.
- **Chiến lược 10/2026: kéo người dùng.** Mọi phần 9–49 xu, trường `goc` = giá cũ để hiện gạch ngang (`giaHtml` ở client). `TT_GIA_PHIEN`: bảng giá lưu trong Script Properties không cùng phiên thì bỏ qua phần giá/gói nạp (chỉ giữ mức thưởng) – tăng số này mỗi khi đổi giá mặc định. `TT_KM_MAC_DINH`: quà đăng ký 19 xu (đủ mở `co_ban`), mời bạn đăng ký thì cả hai +9 xu (trần 30 lượt/người mời, đếm `soMoiDK` trong tài khoản), vẫn giữ 20% lần nạp đầu của bạn bè. `dangKy` → `ttQuaDangKy_` trả `r.qua`. `bangGiaCongKhai()` cho khách chưa đăng nhập (kèm `url` để làm link mời). Client: `quaDK()`, `linkMoi()`, `chiaSe()` (Web Share, không có thì chép lời mời), `moiBanHtml()` (cuối tab Tổng quan và Tiện ích), nút "↗ Mời bạn bè" ở thẻ hồ sơ, `#wlQua` ở trang chủ, `#rgQua` trong hộp đăng ký; khách chưa đăng nhập thấy CTA "Đăng ký nhận quà & mở Tổng hợp" (`tinhTrangMua`, `th6KhachHtml`, `tongKhoaHtml`). `tests/thanh-toan.js` ghim bảng giá cũ cho phần đầu, phần cuối kiểm tra giá mới + quà.
- **Luận giải 6 hệ miễn phí** (12 cung Tử Vi, Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc).
- `co_ban` (19 xu) nay là **Tổng hợp 6 hệ**: 9 lĩnh vực, chân dung, con người, tình duyên, đường đời, mật mã; mở vĩnh viễn. Client: `tongKhoa(r)`, `tongKhoaHtml` (tab Tổng quan khóa), `tinhTrangMua` mời mở Tổng hợp (trừ ở tab Vận hạn). Mua vận hạn/biến cố/PDF không cần `co_ban`; riêng `phoi_ngau` cần `co_ban` (nằm trong phần Tổng hợp).
- **Vận hạn bán lẻ theo giai đoạn.** Mỗi lần mở ghi một dòng vào sheet `MoKhoa` (cột "Phần") với mã:
  - `dv:<năm bắt đầu>`: một đại vận, 9 xu.
  - `nam:<năm>`: vận năm, 19 xu.
  - `thang:<yyyy-mm>`: nhật vận một tháng, 9 xu.
  - `dong_hanh:<năm>`: đồng hành cả năm, 39 xu (trừ phần đã mua).
- **Gói trọn:** `tron_dai_van` 39 xu. `tron_goi` (Trọn đời, 49 xu) gồm `TT_TRON_GOI`, **không gồm năm/tháng** (vẫn giữ nguồn thu định kỳ).
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
node tests/tien-ich.js                         # 7 tiện ích bán lẻ: công thức, miễn phí/trả phí, mua, gieo quẻ, bản tin (55 kiểm tra)
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
