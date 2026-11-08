# KPI Tăng tốc đợt 3 (08-11)

Nhóm: KPI · Cập nhật 08/11/2026
Liên quan: [[KPI Tăng tốc đợt 2 (21-10)]] · [[KPI Tăng tốc và giao diện 29-09]] · [[KPI Quy trình sản xuất]] · [[KPI Kiểm thử]] · [[Lần dán lên Apps Script]] · [[00 Mục lục]]

Chủ dự án 08/11: "Tính toán và cải thiện tốc độ tải dữ liệu và load trang". Đã hỏi, chủ dự án chọn **A** (máy chủ + bộ đo) và **hiện số lần trước kèm nhãn**.

## Đo trước khi sửa (dữ liệu thật 07/11, máy giả lập)
- Mọi lượt gọi đọc cả sheet NhatKySanXuat: 19.252 dòng × 16 cột ≈ **345.000 ô / lượt** (tăng ~7.000 dòng/tháng). Lưu trữ nhật ký (`LUU_TRU_NHAT_KY`) giữ 4 tháng nên chưa chuyển dòng nào.
- Gói đăng nhập `napDuLieu`: chủ sở hữu / ban điều hành 1,2 MB, TP 455 KB, CN 111 KB (đã chỉ gửi 11 cột web dùng).
- `layDonHoanThien` 1,7 MB (5.355 dòng tab HT), `layDonHangXuong` 484 KB.
- Index.html 836 KB (gzip 292 KB): JS 624 KB, CSS 90 KB, 2 ảnh base64 83 KB.
- Nhật ký KHÔNG theo thứ tự ngày (nhập bù hàng loạt tháng 9, 26 dòng ghi ngày tương lai) → không đọc "đuôi sheet" được; chọn bộ nhớ dùng chung.

## Đã làm (`tests/tang-toc-3/`)
- Máy chủ `toc-do-3.gs` + `va-tang-toc-3.py` (exec cuối va-code.py):
  - **Nhật ký dùng chung giữa các lượt gọi**: `nkdLay_` / `nkdGhi_` – CacheService, JSON → gzip → base64, mảnh 90 KB (`NKD3_<pb>_i`), 10 phút; số phiên bản `NKD3_pb` đổi trong `xoaCache_` (mọi lối ghi) và `XOA_BO_NHO_TAM`. Ngày lưu dạng `\u0007<ms>` rồi dựng lại Date; giữ `_row`. Gắn vào `doc_` và `napTruoc_` (Sheets API). **Lượt đang giữ khóa ghi (`khoa_`) luôn đọc thẳng sheet** (`nkdDung_`) – các hàm duyệt / từ chối / gửi đều `khoa_()` trước khi đọc. Sửa tay trong Sheet: chạy XOA_BO_NHO_TAM hoặc đợi ≤ 10 phút. Dữ liệu thật: nén 600 KB = 7 mảnh.
  - **Bộ đo**: `__T0` đầu file; `sach_` gắn `__ms` (kết quả có `ok`), `goiNap_` gắn `__ms`. `ghiTocDo(token, ds)` gộp theo ngày vào ScriptProperties `TD_yyyyMMdd` {f: hàm → [lượt, tổng ms, chậm nhất, tổng ms máy chủ, lượt có số máy chủ, 8 ngăn <0,5/1/2/3/5/8/15/≥15 s], v: "trang|vaoApp|napDuLieu|VAI_TRO"}, giữ 14 ngày. `layTocDo(token, soNgay)` chỉ chủ sở hữu.
  - **Khóa bản lưu trên máy**: `layKhoaLuu(token)` (32 byte, ScriptProperties `KL_<tk>`), `boKhoaLuu_` khi `dangXuat` / `doiMatKhau`.
  - `doGet` dùng `createHtmlOutputFromFile('Index')` (Index không có `<? ?>`, khỏi biên dịch mẫu 0,8 MB mỗi lần mở).
  - `layDonHoanThien` gửi gọn dạng bảng 9 cột `donC` / `donH` (web mở bằng `dhHTMo`): 1,7 MB → 0,48 MB.
- Web mục 38 `va-tang-toc-3-web.py` (exec cuối va-index.py):
  - `call()` đo từng lượt (`tdGhi_`), `napDuLieu`, `vaoApp` (bấm Đăng nhập → thấy số), `trang` (DOMContentLoaded); gửi gộp `tdGui_` (15 mục / 3 phút / khi ẩn trang / khi Thoát).
  - **"Mở nhanh (máy cá nhân)"** – ô tích ở màn đăng nhập, mặc định TẮT (`kpi_nho_dl`). Bản lưu `kpi_dl_<tk>` mã hóa AES-GCM (khóa từ máy chủ, giữ ở sessionStorage `kpi_kl`), bỏ SoCCCD / DienThoai / DiaChi / SdtKhanCap / LuongCoBan / NamSinh / SoTaiKhoan / Email, hết hạn 12 giờ, gắn phiên bản Index (`DL_VER`). Mở web: `dlHienCu_` hiện ngay + nhãn `#dlNhan` "Đang hiện số lúc … · đang cập nhật số mới…", `window.__dlCu` chặn mọi lượt ghi trong `call()`; số mới về thì bỏ nhãn, ở nguyên tab. Thoát / hết phiên / bỏ tích → xóa.
  - Thống kê › **Tốc độ web** (`tkVeTD` trong quy-trinh-web.html): theo vai trò (mở trang, đăng nhập → thấy số, gói dữ liệu) với mục tiêu màu, từng thao tác (TB, 90% nhanh hơn, chậm nhất, máy chủ vs đường truyền), cột theo ngày.
- Chuyên gia: `quan-ly-van-hanh` (ưu tiên: đọc ít dữ liệu → trang nhẹ cho công nhân → hiện số cũ → gói đăng nhập → HT; mục tiêu: mở trang < 3 s, đăng nhập → thấy số CN < 2 s / chủ < 4 s, máy chủ P50 < 1,5 s, P95 < 3 s). `bao-mat-ung-dung` (mã hóa bằng khóa máy chủ, mặc định không lưu – người dùng tự tích, bỏ trường nhạy cảm, đổi khóa khi Thoát / đổi mật khẩu).

## Kết quả đo lại (máy giả lập)
- Ô đọc mỗi lượt sau lượt đầu: 345k → **37k** (napDuLieu), layKPIKy 334k → 26k, phanTichDinhMuc 335k → 27k, layThongKe 358k → 50k.
- Mở lại trang (có "Mở nhanh"): thấy số sau ~20–30 ms trong lúc chờ gói mới.
- Số thật trên Google: xem Thống kê › Tốc độ web sau vài ngày dùng.

## Chưa làm / còn có thể làm
- Gói đăng nhập chủ sở hữu vẫn 1,2 MB (nhật ký 2 tháng) – đợi số đo: nếu "đường truyền" lớn thì tách tháng trước tải sau.
- Thu nhỏ Index cho công nhân (phương án B) – chủ dự án chưa chọn.
- Chạy `CAI_TRIGGER_LUU_TRU` nếu chưa cài (lưu trữ nhật ký cũ hằng tháng).

## Kiểm thử
- `tests/tang-toc-3.js` 17/17 (DATA= dữ liệu thật), `tests/tang-toc-3-web.js` 24/24 (bản xem thử dh-uu, GIO 01/11).
- `don-hang.js` thêm 1 (HT dạng bảng). Bộ cũ (sua-loi-21-10, bao-mat, van-hanh, com-trua, bao-cao, ho-so, don-hang, tang-toc-2, dinh-muc, quy-trinh…) cho kết quả giống hệt bản trước sửa.
- Bản xem thử: `tao-ban-xem-thu.js` thêm `base64Encode/Decode` và `window.__tre` (độ trễ giả cho kiểm thử); giả lập `gia-lap-kpi.js` đặt lại `__T0`, `__NKD_TT` mỗi lượt.
