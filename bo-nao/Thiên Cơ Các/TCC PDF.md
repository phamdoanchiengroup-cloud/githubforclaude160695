# TCC PDF

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Giao diện]] · [[TCC Kiểm thử]] · [[00 Mục lục]]

- **24/10 – PDF sáng tông Hologram (mã 2026.10.24.2):** khối CSS cuối Styles "BÁO CÁO PDF – bản sáng tông Hologram" (bc-sang nền #FBFCFF, chữ xanh than, nhấn vàng + xanh lơ; bc-toi đổi sang xanh đêm); bìa xanh lam + tranh bánh xe (`PDF_ANH_BIA` qua `TCCHolo.layAnh('TongHop')`). `xuatPdf` chụp trước: lá số Tử Vi (`chupLaSo` giữ Hologram, thay SVG đường tam hợp bằng ảnh), bánh xe 9 lĩnh vực (`.vt-khung`) và bảng `holoBT/HL/CT/TS/HD` (`PDF_BANG`, `TCCHolo.chup`) → `bcAnhHolo` chèn đầu mỗi chương. Chương Tử Vi có phần 26 bước. Thử: bản đầy đủ 64 trang, không lỗi.

- **PDF bản đầy đủ (~82 trang, ~70 giây):** mỗi hệ lấy biểu đồ chính (`PDF_CHINH`) + văn dễ hiểu + các phần luận lĩnh vực/tổng hợp/lời khuyên (`PDF_LUAN`, theo `data-g` của khung Phần/Bước); Tử Vi lấy ảnh lá số + Phần 1 chân dung + Phần 3 Tử Vi × Bát Tự; vận hạn bỏ lịch ngày. Không chép bảng kỹ thuật. `tg-head` được coi là tiêu đề để không mồ côi cuối trang.
- **PDF:** `xuatPdf` trong Script.html dựng từ nội dung đang hiển thị.
  - `chuanHoa` bỏ giao diện bán hàng (thẻ khóa, ưu đãi, bảng giá).
  - Các mục: tom, linhvuc, nguoi, duyen, doi, vh, bien, chart, battu, astro, so, hd, halac, them. Nhóm hiển thị theo `PDF_NHOM`.

## Thiết kế lại (22/10/2026, chủ dự án chê "hơi loạn")
Bản cũ chụp lại các thẻ giao diện web (97 trang, 23 MB, nhiều chip/nhãn kỹ thuật, khung "↳ tiếp" cắt ngang). Bản mới **dựng riêng cho khổ A4 từ dữ liệu luận giải**, không chụp giao diện:
- Script.html › mục XUẤT PDF: khối dựng sẵn `bcMo` (trang mở chương), `bcH2/bcH3`, `bcDs` (danh sách có chấm màu thuận/cần lưu ý, chữ nhỏ ghi hệ nào nói), `bcBang`, `bcHop` (ô lời khuyên), `bcO` (ô số liệu), `bcVach`/`bcThanh` (thanh điểm vẽ bằng gradient nền – html2canvas bỏ sót khối con rỗng và cắt khi có `overflow:hidden` + bo góc), `bcKhoa` (phần chưa mở).
- Nội dung theo phần: `pdfTom` (tomLuoc + 10 mật mã), `pdfLinhVuc` (deHieu.th6: bảng điểm 9 lĩnh vực, từng lĩnh vực, năm nên hành động), `pdfNguoi`, `pdfDuyen` (phoiNgau, tuổi hợp, năm kết hôn/sinh con), `pdfDoi` (chặng đời, nghề), `pdfVh` (daiVanSau – chi tiết 4 đại vận từ hiện tại, hoSoNam, hoSoThang), `pdfBien` (bienCo.nong, hoiTu), `pdfChart` (ảnh lá số + 12 cung qua `taoCungDeHieu_`), `pdfHe` (bảng Tứ Trụ/ngũ hành, hành tinh, các số, HD, quẻ + deHieu.khoi), `pdfThem` (bảng may mắn). Phần thiếu dữ liệu (máy chủ đã cắt) thì in dòng 🔒 hoặc bỏ phần.
- Bản xem thử: `demoPhan` (res.teaser: hé lộ + "trong bản đầy đủ"), các phần chạy liền mạch (`bcMo(..., nho)`), trang mời mua `trangMua`.
- Giao diện: CSS khối "BÁO CÁO PDF (bc-*)" cuối Styles.html; nền giấy ngà `bc-sang` (mặc định) hoặc than ấm `bc-toi`; lề trang 42/46/50 pt, nội dung rộng 760 px; mục lục có số trang + ô "Cách đọc báo cáo"; chân trang số trang. Bìa giữ kiểu cũ (tối, vòng hoàng đạo).
- Kết quả với lá số mẫu: đầy đủ 55 trang ~13 MB, xem thử 11 trang ~2 MB. Mã giao diện `2026.10.22.3`.
- Xuất thử trong phiên đám mây: `cd tests && npm install --no-save html2canvas@1.4.1 jspdf@2.5.1`, rồi `python3 tools/xem-truoc.py && PW=/opt/node22/lib/node_modules/playwright node tools/xuat-pdf.js /đường/dẫn.pdf` (`TYPE=demo`, `THEME=dark`). Xem trang bằng `pdftoppm`.
