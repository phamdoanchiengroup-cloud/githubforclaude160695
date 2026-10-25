# Bàn giao phiên

Nhóm: Bắt đầu · Cập nhật 25/10/2026
Liên quan: [[00 Mục lục]] · [[Tài nguyên và công cụ]] · [[Việc chờ chủ dự án]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]]

Phiên mới đọc ghi chú này ngay sau `CLAUDE.md`, rồi [[Tài nguyên và công cụ]] (liên kết, repo, công cụ) và [[00 Mục lục]]. Mỗi lần chủ dự án yêu cầu "nén phiên / chuyển phiên mới", viết đè mục "Trạng thái hiện tại" bên dưới.

## Trạng thái hiện tại (25/10/2026)
- Nhánh `claude/happy-brown-lttkz3`, mã giao diện **`2026.10.25.10`** (25/10 khuya: ảnh ngũ hành – con giáp, PDF theo web; 25/10 đêm: dòng lưu ý xuống chân trang; 25/10 đêm: 26 bước thành bài luận chính; 25/10 khuya: tab Tham khảo 3 mục + card dễ đọc; 25/10 tối: thêm tab "👑 Lá số chủ sở hữu", file .gs thứ 29 `TuViChuyenSau.gs` – xem [[TCC Tử Vi đối chiếu các phái]]; trước đó `2026.10.25.1`) (3 chỗ: `tcc-ban` Index, `--tcc-ban` Styles, `BAN_GIAO_DIEN` Script). Mọi thay đổi đã push; chủ dự án chỉ cần bấm `2-CAP-NHAT.bat` + Ctrl+F5.
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
