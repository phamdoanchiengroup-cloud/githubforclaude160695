# Đọc PDF ít tốn token

Nhóm: Chung · Cập nhật 08/11/2026
Liên quan: [[Liên kết và công cụ]] · [[KPI Chính sách lương và cẩm nang]] · [[00 Mục lục]]

Chủ dự án 08/11: "kiếm cách đọc pdf ít tốn token". Cách đã dùng (không cần cài repo lớn):
1. **PDF có lớp chữ** (xuất từ Excel / Word): `pdftotext -layout file.pdf out.txt` (poppler, có sẵn trong máy). Gọn bảng: `sed -E 's/ {2,}/ | /g'`. Bảng lương 4 trang ≈ 32 KB chữ.
2. **PDF làm từ ảnh** (Gamma, Canva, scan): `pdftotext` ra gần trống → OCR trong máy: `apt-get install -y tesseract-ocr tesseract-ocr-vie` (phiên đám mây phải cài lại mỗi phiên, ~1 phút), `pdftoppm -r 150 -png file.pdf p` rồi `tesseract p-01.png p-01 -l vie`. Cẩm nang 42 trang → 26 KB chữ thay vì 42 ảnh trang.
3. Chỉ xem ảnh những trang OCR dễ sai số (5↔3, O↔0) hoặc sơ đồ: ghép 4 trang vào 1 ảnh nhỏ (rộng 800 px/trang) bằng PIL rồi mới đọc.
- Thay thế nặng hơn khi cần giữ bảng phức tạp: Microsoft `markitdown`, IBM `docling`, `pdfplumber` (đã có sẵn) để lấy bảng theo ô.
