# Bàn giao phiên

Nhóm: Bắt đầu · Cập nhật 28/11/2026
Liên quan: [[00 Mục lục]] · [[Tài nguyên và công cụ]] · [[Việc chờ chủ dự án]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]]

Phiên mới đọc ghi chú này ngay sau `CLAUDE.md`, rồi [[Tài nguyên và công cụ]] (liên kết, repo, công cụ) và [[00 Mục lục]]. Mỗi lần chủ dự án yêu cầu "nén phiên / chuyển phiên mới", viết đè mục "Trạng thái hiện tại" bên dưới.

## Tạm dừng 28/11/2026 – việc dở: VIẾT LẠI TOÀN BỘ VĂN "HAI MẶT"
- Chủ dự án tạm dừng 28/11 sáng, hẹn **17h (giờ VN) 28/11 làm tiếp**.
- Nhánh chính `claude/happy-brown-lttkz3`: web bản `2026.11.23.1` (chưa có văn mới). Quy tắc văn mới đã ghi ở CLAUDE.md + `nghien-cuu/van-phong/quy-tac-van-hai-mat.md` (có mục bổ sung 24/11: sức khỏe nêu thẳng bệnh + nhắc bác sĩ; bỏ chữ tiền kiếp/nghiệp lực).
- **Toàn bộ văn đã viết lại nằm ở nhánh dự phòng** `claude/happy-brown-lttkz3-du-phong` (commit 7d8b09f, chưa kiểm thử đầy đủ, chưa đưa lên nhánh chính). Làm tiếp: `git fetch origin claude/happy-brown-lttkz3-du-phong && git checkout origin/claude/happy-brown-lttkz3-du-phong -- tuvi-app nghien-cuu` (trên nhánh chính, sau đó kiểm thử rồi commit).
- Đã xong (7 nhóm): Script.html/TaiKhoan/NghiemChung; Phi Tinh (catalog.json 606 ý + van.json, sinh lại TuViPhiTinh.gs, test phi-tinh đạt); TuViHeThong.gs (~420 đoạn, cú pháp OK); DeHieu/TuViChuyenSau/TuViTrinhTu/TuViTamPhap/TuVi; Bát Tự (BatTu*, HaLac); ChiemTinh/ThanSoHoc/HumanDesign/KyMonVan/ThaiAtVan/TienIch (+ đợt bổ sung kênh/cổng HD, CT_HT); HoiTu/TongHop/LuanGiai/VanSau/DuDoan/PhoiNgau/GiaDinh/CapDoi (~480 đoạn).
- **Còn dở (bị dừng giữa chừng):**
  1. Sức khỏe nêu thẳng bệnh trong HoiTu.gs (Hồ sơ năm) + "Nhịp sống hợp với bạn" TongHop.gs; sửa `tests/ho-so-nam.js` dòng 43 (đang cấm tên bệnh theo quyết định cũ).
  2. Lượt rà chéo toàn repo: sức khỏe nêu thẳng bệnh ở Tử Vi/Bát Tự/Thần số/Chiêm tinh/HD/Phi Tinh; thay chữ tiền kiếp/nghiệp lực (đoạn `linhHon` TuViHeThong, "nợ nghiệp" ThanSoHoc…); TuViHeThong: câu dễ hiểu mở đầu bằng tên sao + mảng `loiKhuyen`. Đang làm dở – chưa rà kết quả (kiểm cẩn thận).
  3. Bộ lọc `th6LuuY_` (TaiKhoan.gs) và `tlLuuY` (Script.html) chỉ nhận câu bắt đầu "Bạn có xu hướng" → câu dạng "Mặt xấu:" bị loại; cân nhắc nới.
  4. Sau đó: `python3 tuvi-app/tools/tao-ds-file.py`, chạy toàn bộ tests, nhờ reality-checker/code-reviewer đọc soát giọng văn, gửi chủ dự án vài đoạn trước/sau, tăng 3 mã phiên bản (nếu sửa Script.html: có), cập nhật bộ não, đẩy lên nhánh chính, báo bấm 2-CAP-NHAT.bat.
- Việc kế tiếp đã duyệt: **"Gieo và gặt"** trong tab Phi Tinh – [[TCC Gieo và gặt]] (làm sau đợt viết lại văn).

## Trạng thái hiện tại (25/10/2026)
- Nhánh `claude/happy-brown-lttkz3`, mã giao diện **`2026.11.16.2`** (16/11 Đợt 3 giá phương án A + Đợt 4 giao diện mới đã đẩy, code-reviewer đang rà trước khi báo chủ dự án cập nhật; còn Đợt 5 khung bài 3 tầng + văn – xem [[TCC Rà soát toàn bộ 11-2026]]; 16/11 Đợt 2: gỡ chỗ gây khó chịu; 16/11: rà soát toàn bộ bằng 6 chuyên gia + đợt 1 bảo mật đã đẩy – xem [[TCC Rà soát toàn bộ 11-2026]]; 2 chuyên gia ux/logic chờ chạy tiếp; 1/11 phiên mới: tab ✶ Phi Tinh dựng lại theo mục lục cohoc – `ptBai_` trong `nghien-cuu/phi-tinh/gen/bai.js`, vận tháng theo Đẩu quân, xem [[TCC Tứ Hóa Phi Tinh]]; 1/11: quan hệ gia đình luận đúng vai + 3–4 người `giaDinhQuanHe`; tab 👪 Gia đình – `GiaDinh.gs`, file .gs thứ 32 – xem [[TCC Tab Gia đình]]; Phi Tinh: kho luận giải tổng hợp + bộ sinh đã ở `nghien-cuu/phi-tinh/` – phiên mới dựng lại tab theo mục lục cohoc, đọc `nghien-cuu/phi-tinh/README.md`; Agent Reach (đọc phụ đề video) tạm dừng theo chủ dự án – lệnh cài bị hệ thống chặn, muốn dùng thì thêm vào Setup script môi trường) (31/10: tab ✶ Phi Tinh – Tứ Hóa Phi Tinh Bắc phái, file .gs thứ 31 `TuViPhiTinh.gs`, chỉ chủ sở hữu – xem [[TCC Tứ Hóa Phi Tinh]]; 31/10: thần sát Bát Tự 156 sao, file .gs thứ 30 `BatTuThanSat.gs`, Bát Tự 15 bước – xem [[TCC Thần sát Bát Tự]]; cập nhật chỉ cần bấm 2-CAP-NHAT.bat vì clasp tự sao lưu + triển khai; 26/10: PDF dựng chạy nền, thẻ tiến trình nhỏ + Hủy – xem [[TCC PDF]]; 25/10 khuya: PDF bản gọn + bản tóm tắt; 25/10 khuya: ảnh ngũ hành – con giáp, PDF theo web; 25/10 đêm: dòng lưu ý xuống chân trang; 25/10 đêm: 26 bước thành bài luận chính; 25/10 khuya: tab Tham khảo 3 mục + card dễ đọc; 25/10 tối: thêm tab "👑 Lá số chủ sở hữu", file .gs thứ 29 `TuViChuyenSau.gs` – xem [[TCC Tử Vi đối chiếu các phái]]; trước đó `2026.10.25.1`) (3 chỗ: `tcc-ban` Index, `--tcc-ban` Styles, `BAN_GIAO_DIEN` Script). Mọi thay đổi đã push; chủ dự án chỉ cần bấm `2-CAP-NHAT.bat` + Ctrl+F5.
- Kiểm thử gần nhất đều đạt: cai-dat 85/85, tong-hop, ha-lac, bat-tu, tien-ich, than-so, van-ngay, van-sau, giai-doan, ho-so-nam, nghiem-chung 852/852, chiem-tinh, human-design, bao-cao.
- Có thư mục `webbongda/` (web bóng đá chủ dự án tự đưa lên, commit 8e735a6) – chủ dự án chọn để nguyên, không đụng.

## Các đợt việc gần nhất (24–25/10)
0. **Tab "👑 Lá số chủ sở hữu" (25/10 tối, mã 2026.10.25.2)** – bộ sao chính – phụ tinh từng cung, 12 đại vận soi Thiên Không / Thiên Thương – Thiên Sứ / Không Kiếp, thọ khí; chỉ chủ sở hữu thấy. Kiểm thử `tests/chuyen-sau.js`.
1. **Nội dung nhạy cảm (24/10, mã 2026.10.24.9)** – 4 hướng áp cho cả 6 hệ, xem [[Quyết định của chủ dự án]] và [[TCC Văn dễ hiểu và Tổng hợp 6 hệ]]:
   - Chuyện đã qua → gợi ý + nút "Đúng / Một phần / Không đúng" (`hoiDoiChieu` trong Script, `ghiDoiChieu` trong Code.gs → sheet `DoiChieu` ẩn danh).
   - Bỏ %/xác suất/số con/tỷ lệ trai–gái (giữ % đồng thuận, độ khớp dò giờ, % ngũ hành).
   - Bỏ chẩn đoán sức khỏe; hôn nhân, con cái, tiền bạc, năm hạn viết giọng chủ động.
   - Dòng lưu ý `.tcc-luu-y` đầu kết quả + "Cách đọc báo cáo" PDF.
   - 3/4 chuyên gia nội dung bị ngắt vì hết hạn mức; phần sót đã rà bằng grep. **Có thể còn câu "nặng"** trong Bát Tự / Tổng hợp / Tử Vi hệ thống / HaLac ("để ý những vùng dưới đây") → sửa khi chủ dự án báo.
   - Tab 64 quẻ chuyển xuống cuối: "📚 Tham khảo · 64 quẻ".
2. **Bố cục 5 hệ (25/10, mã 2026.10.25.1)** – xem [[TCC Giao diện]]: bỏ khối "Phần chuyên sâu" thu gọn; thứ tự Hologram → Hồ sơ nhanh (`hoSoNhanh`) → mục lục tab (`mucLucTab`, nút `[data-nhay]`) → Phần 1 → Luận dễ hiểu → các phần còn lại; `moChiTiet` mở sẵn `details`. Bảng mới: ngũ hành, thập thần (Bát Tự); nguyên tố × tính chất, góc chiếu (Chiêm tinh); tổng hợp chỉ số, 4 đỉnh cao (Thần số).
3. Trước đó (24/10): ảnh nặng + dữ liệu 64 quẻ qua **jsDelivr** ghim theo SHA; PDF phong cách thủy mặc (bìa `pdf-bia.webp`, nền `pdf-nen.webp`); Tử Vi chỉ còn lá số Hologram; trình tự luận Tử Vi 26 bước (`TuViTrinhTu.gs`); bỏ toàn bộ 3D.

## Đang chờ chủ dự án
- Bấm `2-CAP-NHAT.bat` lấy `2026.10.25.1`, xem thử.
- Cho biết trang 5 hệ có dài quá không (khối dài nhất: "Luận giải cát hung" Bát Tự ~10.000px) – có thể thu gọn riêng khối đó.
- Báo câu luận nào còn "nặng" để sửa tiếp.

## Mẹo kỹ thuật cho phiên mới
- Xem trước giao diện: `python3 tuvi-app/tools/xem-truoc.py` → `tools/preview.html`; chạy bằng Playwright với `window.srv` gọi `ctx` từ `tools/gia-lap.js`. Khi chụp ảnh phải tắt hiệu ứng `.cho-hien` (opacity) bằng `addStyleTag`, nếu không các khối hiện trống.
- Kiểm cú pháp: `node -e "new (require('vm').Script)(...)"` cho từng .gs; Script.html thì tách phần `<script>`.
- Thêm/sửa .gs/.html → `python3 tuvi-app/tools/tao-ds-file.py`, `node tuvi-app/tests/cai-dat.js`.
- Cuối việc: cập nhật bộ não, `python3 bo-nao/tao-ban-do.py`, đăng lại `bo-nao/ban-do.html` lên https://claude.ai/artifact/ATmkGiUrZzEGjhRTxjyFjW.
