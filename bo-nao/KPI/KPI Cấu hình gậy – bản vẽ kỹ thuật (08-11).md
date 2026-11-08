# KPI Cấu hình gậy – bản vẽ kỹ thuật (08-11)

Liên quan: [[KPI Quy trình sản xuất]] · [[KPI Bảo mật và vận hành]] · [[KPI Phần giao diện tải sau]] · [[KPI Kiểm thử]] · [[Việc chờ chủ dự án]] · [[00 Mục lục]]

## Yêu cầu chủ dự án (08/11)
- Trước làm cấu hình gậy bằng Excel nên thiếu sót; muốn đầy đủ như bản vẽ `cue-carbon.html` (chủ dự án làm bằng Qoder: cơ pool carbon 58 in, 12 chi tiết, mặt cắt, detail joint / đuôi).
- Chọn phương án B: **bản vẽ tự vẽ theo bảng thông số**. **Tab riêng "Cấu hình gậy"**; **C077 đo đạc, nhập, lưu**; **Giám đốc SX C019 duyệt** mới có hiệu lực; có **nút tải PDF**.
- **Tài liệu mật**: chỉ **C019, C056 (chủ sở hữu), C077, C067** xem. PDF có dấu chìm tên người tải + giờ + **logo Rhino mờ**; mỗi lần tải ghi nhật ký.
- Danh sách dòng gậy **dùng chung** Đơn hàng › Cấu hình sản phẩm (PL_DONG + CauHinhSP).
- Bản vẽ: **ngọn và chuôi vẽ riêng, dựng đứng, cạnh nhau**; mặt cắt cũng dựng đứng; ghi sẵn Ø các mốc, chiều dài từng đoạn, cấu tạo trong, ren + vật liệu.

## Cách dựng
- Máy chủ `tests/cau-hinh-gay/cau-hinh-gay.gs` (+ `va-cau-hinh-gay.py`, chạy cuối va-code.py):
  - `CG_QUYEN = {C056:xem, C019:duyet, C077:sua, C067:xem}`; `cgQuyenCua_(me)` – mã NV phải gắn **đúng 1** tài khoản đang dùng (chặn tạo tài khoản trùng mã); `docPhien_` thêm `o.cg`; `layManhGiaoDien` cho mảnh `CauHinhGay` theo mã NV.
  - Sheet ẩn `CauHinhGay` (Id, MaDong, PhienBan, TrangThai: Chờ duyệt / Hiệu lực / Bản cũ / Từ chối, DuLieu JSON, NguoiLuu, ThoiDiemLuu, GhiChu, NguoiDuyet, ThoiDiemDuyet, LyDo).
  - Hàm: `layDsCauHinhGay`, `layCauHinhGay(ma, phienBan)` (người chỉ xem không thấy bản chờ; ghi nhật ký "Xem cấu hình gậy" mỗi người/dòng/6 giờ), `luuCauHinhGay` (C077 – mỗi dòng 1 bản chờ, lưu lại thì thay, giữ số bản), `duyetCauHinhGay` (C019 – từ chối bắt buộc lý do; duyệt → bản hiệu lực cũ thành "Bản cũ"), `ghiTaiPdfCauHinhGay`, `demCauHinhGayCho` (Việc hôm nay của C019).
  - `cgLoc_`: chỉ lưu trường trong `CG_KHOA` (khớp `CG_TRUONG` ở web – va-cau-hinh-gay-web.py **kiểm khớp khi dựng**), đúng kiểu, số 0–5000, chữ ≤ 120.
- Web: mảnh tải sau **`CauHinhGay.html`** (nguồn `tests/cau-hinh-gay/cau-hinh-gay-web.html`, mục 42 `va-cau-hinh-gay-web.py`): tab `cgay` (nhóm Sản xuất), chỉ hiện khi `ME.cg`; logo Rhino xám chèn base64 cho dấu chìm. Đã thêm `CauHinhGay` vào `danh-sach-file.txt` + `cai-dat-clasp/chung.ps1` + `tao-ban-xem-thu.js`.
  - Danh sách nhóm: Gậy (đánh / nhảy / phá / phá nhảy) → Ngọn lẻ → Chuôi lẻ; trong nhóm: ngọn full carbon → mix → glassfiber; chip v-số / Chờ duyệt / Chưa có.
  - 62 ô thông số (`CG_TRUONG`), mẫu = cơ 58 in của bản tham chiếu; ô vàng = chưa đo, ✓ xác nhận số mẫu; `cgKiemTra` báo ghép sai (collar ngọn/chuôi, insert lọt ống, ren insert ↔ pin ↔ ren khai báo, pin thò > insert, bậc cap/sleeve, khoang/bolt…).
  - Bộ vẽ: `cgKhuc(t,'ngon'|'chuoi')` (hình ngoài + mặt cắt dọc dựng đứng, trục đúng tỉ lệ, Ø phóng ~3×, dây kích thước bên trái, Ø ngang trên hình, nhãn vật liệu bên phải xếp không chồng), `cgCT(t,'A'|'C'|'D')` (đầu ngọn, joint, đuôi – đúng tỉ lệ thật phóng to); bấm hình để phóng to.
  - PDF: jsPDF 2.5.1 + html2canvas 1.4.1 (cdnjs, có `integrity`), **2 trang A4 dọc**; mạng chặn thư viện → mở hộp in "Lưu thành PDF".
- `bao-mat-ung-dung` 08/11: không lỗi nặng; đã vá: onclick dùng `data-ma`, chống trùng mã NV, lọc khóa (chặn `__proto__`), người chỉ xem không nhận bản chờ, nhật ký xem, SRI cho thư viện. Giới hạn: dấu chìm chỉ ở PDF (chụp màn hình vẫn được); ai có quyền sửa Google Sheet vẫn đọc được sheet CauHinhGay.

## Kiểm thử (08/11)
- `tests/cau-hinh-gay.js` 45/45 (quyền, lưu / duyệt / từ chối / phiên bản, nhật ký, dữ liệu xấu, mã NV trùng).
- `tests/cau-hinh-gay-web.js` 40/40 (máy tính + điện thoại; LIB=<node_modules có jspdf + html2canvas> để thử PDF: 2 trang, ~690 KB).
- Không ảnh hưởng: manh-web 8/8, tong-quan-web 26/26, nhan-su-loc-web 13/13, tang-toc-4 14/14, luu-tru 15/15, dieu-phoi 24/24.
