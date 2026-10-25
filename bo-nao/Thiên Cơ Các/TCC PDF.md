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

## 25/10 (khuya) – PDF đi theo web (mã 2026.10.25.10)
- Chủ dự án chọn: cả 6 hệ theo bố cục web, đầy đủ, bỏ "Căn cứ"; chương 👑 chỉ khi chủ sở hữu xuất.
- `Script.html`: `PDF_WEB` – lúc xuất, mỗi tab (chart → `#page-luan`, battu, halac, astro, so, hd) được hiện rồi chép bằng `pdfTuWeb` → `pdfLamSach` (mở mọi `details`, bỏ `PDF_BO_WEB`: holo-wrap, mục lục tab, tt26-ky, cung-chitiet, coso, vs-canco, hdc, nút, thẻ khóa…, canvas → ảnh, bỏ id). `pdfNoiDung` dùng PDF_WEB nếu có, không thì bản cũ (`pdfChart`, `pdfHe`). Nền sáng: `pdfSangHoa` đo màu thật, ô nền tối → giấy #FBF8F1, chữ sáng → #2B2A2E. CSS `.pdf-web`, `.bc-sang .pdf-web …`.
- Trang mới: `mo` "Tuổi của bạn" (`pdfTuoi`, ảnh con giáp + bảng năm sinh, bản mệnh, cục, Mệnh – Thân, ảnh hành bản mệnh) đứng đầu; `nguhanh` "Ngũ hành của bạn" (`pdfNguHanh`, banner hành Nhật chủ, 5 ô hành có ảnh + % + vai dụng/hỷ/kỵ, `NGU_HANH_Y`) ngay sau Bát Tự. Chương `chu` (`chuHtml` qua `pdfTuHtml`) khi `laChu()`.
- Bìa: `bia()` dùng `PdfBia2.webp` cho cả hai nền (bỏ bánh xe/holo và pdf-bia cũ).
- Ảnh qua jsDelivr SHA `19203fbd20433f395336269a411f8aebcf990086` (`TCC_ANH_CDN`, `anhHanh`, `anhGiap`): `anh/NguHanh{Moc,Hoa,Tho,Kim,Thuy}.webp`, `anh/ConGiap00..11.webp` (Tý → Hợi, 03 = Mèo), `anh/PdfBia2.webp`.
- Thử (lá số mẫu, nền sáng, đầy đủ): 183 trang, ~46 MB (trước ~55 trang) – vì gộp đủ 26 bước + 5 hệ như web. Có thể làm "bản gọn" nếu chủ dự án thấy nặng.
- Kiểm tra (evidence-collector, 3 lần): chủ sở hữu nền sáng 194 trang (có chương 👑 ở cuối, mục lục đúng), VIP nền tối 174 trang (không có chương 👑), bản xem thử 19 trang – không lỗi trang. Đã sửa: chữ/thanh tỷ lệ ở trang Ngũ hành; bỏ khối "Đại vận – tiểu vận Tử Vi" chỉ đường sang tab, câu "Bấm từng bước để mở", tiêu đề "Điểm 12 cung (bấm…)". Còn để ngỏ: biểu tượng chữ Hán trang trí ở tiêu đề khung (có từ trước trên web), vài trang gần trống do khối không tách được, bản xem thử có tiêu đề chương mồ côi (có từ trước).

## 25/10 (khuya) – Bản gọn và bản tóm tắt (mã 2026.10.25.11)
- Hộp tải PDF: `#pdfType` thêm `gon`, `tomtat`. `moPdf`: `gon` khóa như `full`; `tomtat` mở cho mọi người (khách thiếu quyền mặc định chọn tóm tắt). `xuatPdf(chon, scale, sang, brand, demo, kieu)`; chương 👑 chỉ ở bản đầy đủ.
- Quy tắc `PDF_RUT` (từ `scratchpad/ban-rut-gon.json` của chuyên gia content-creator): `chuong[k]` = giu / bo / {giuKhoi, boKhoi, deHieuDoan (tiêu đề khối lớn `.cvdh-tieude` trong "Luận giải dễ hiểu")} / {rutGon:'ngan'}; `tuVi` = {buocGiu, cungMucGiu (tiêu đề h5 mục con cung), toHop, toHopBoTrung, saoHan, saoHanSoVan, daiVanDacThoi, chanDung, phiTinh}; `loiMo` = câu mở bản + câu dẫn từng chương (chỉ in ở bản tóm tắt, `.bc-dan`).
- Hàm: `pdfCatTheoQuyTac`, `pdfCatTuVi`, `pdfTenKhoi`, `pdfKhop` (bỏ ký tự chữ Hán đầu tiêu đề khi khớp), `pdfLocTenSao` (bản rút gọn bỏ câu có tên sao trong văn cung – văn cũ còn lọt "Cụ thể: …"), `pdfRutNgan` (bản ngắn cho linhvuc/nguoi/duyen/doi/vh).
- Đo thật (lá số mẫu, nền sáng): gọn 98 trang ~25 MB; tóm tắt 54 trang ~13 MB (lần đầu 67 → chuyên gia cắt tiếp: 12 bước Tử Vi, 3 vận "điều cần phòng", mỗi hệ 1–2 khối dễ hiểu). Muốn ngắn nữa: `saoHanSoVan` 2, bỏ "Lời khuyên theo thần số", hoặc bỏ ảnh bảng Hologram ở bản tóm tắt (~5 trang).
