# KPI Tăng tốc đợt 2 (21-10)

Nhóm: KPI · Cập nhật 21/10/2026
Liên quan: [[KPI Tăng tốc và giao diện 29-09]] · [[KPI Phần giao diện tải sau]] · [[KPI Cập nhật bằng clasp]] · [[Lần dán lên Apps Script]] · [[00 Mục lục]]

Chủ dự án báo 21/10: đăng nhập vẫn lâu; tab Bảng KPI và KPI quản lý tải lâu.

## Đo trên dữ liệu thật 21/10 (CSDL KPI tải qua Google Drive, bản xuất ở scratchpad, KHÔNG commit)
- NhatKySanXuat 14.460 dòng (~7.000 dòng/tháng), NhatKyThaoTac 26.856 dòng. Mỗi lượt nạp đọc ~265.000 ô.
- `napDuLieu` gửi về: ban điều hành 2,9 MB (riêng `nhatky` 12.417 dòng = 2,2 MB), TP 1,06 MB, CN 0,9 MB.
- `layKPIKy` / `layKPIQuanLy` có bộ nhớ tạm 10 phút (`nho_`) nhưng khóa theo `KPI_PB`, mà mọi lượt ghi có khóa (`xong_` → `tangPhienBan_`) đều đổi số này – kể cả công nhân gửi sản lượng, đăng ký cơm – nên giờ làm việc gần như luôn tính lại từ đầu.

## Đã sửa (chưa dán – gộp với bản sửa 21/10: Code.gs + Index.html)
- Máy chủ `tests/tang-toc-2/va-tang-toc.py` (exec cuối va-code.py):
  - `napDuLieu`/`napPhan` → `goiNap_`: trả MỘT chuỗi JSON; mảng ≥30 dòng mà mọi dòng cùng thứ tự cột thì gói `{__b:1,c:[cột],h:[[giá trị]]}`. Ban điều hành 2,9 → 1,36 MB, TP 1,06 → 0,58 MB, CN 0,91 → 0,46 MB.
  - Bộ nhớ tạm KPI có số phiên bản riêng `KPI_PB_KPI` (`phienBanKPI_`, `NHO_KPI_` = layKPIKy, layKPIQuanLy, layLichSuKPI). `xong_` chỉ đổi khi `anhHuongKPI_()`: bỏ qua lượt chỉ ghi `SHEET_KHONG_KPI_` (DangKyCom, ThucDon, SuatAnThang, NhatKyThaoTac, ThongBao, BoTriMay, HoiNhap, YeuCauSuaHoSo, KiemTraDuLieu, NguoiNhanBaoCao) và `congNhanGuiSanLuong` (`__KPI_KHONG_DOI`: dòng "Chờ duyệt" không vào KPI; KPI quản lý tính duyệt trễ theo ThoiDiemDuyet nên cũng không đổi). `tangPhienBan_()` gọi thẳng (XOA_BO_NHO_TAM…) vẫn xóa cả nhớ KPI.
  - Làm nóng: `LAM_NONG_KPI` (trigger 10 phút, chỉ 6h–22h, `noiBo_`) tính sẵn layKPIKy tháng này cho '' + từng xưởng PhongBan và layKPIQuanLy cho ADMIN (owner/không owner) + TP từng xưởng; `layKPIKyGoc_`/`layKPIQuanLyGoc_` nhận thêm `meSan`. Cài: chạy tay `CAI_TRIGGER_LAM_NONG_KPI`; tắt: `TAT_TRIGGER_LAM_NONG_KPI`. Trên giả lập ~2,5 giây/lượt.
- Web = va-index.py **mục 26** `tests/tang-toc-2/va-tang-toc-web.py`: `moGoi_` mở gói ở napTruoc_, napCo_, reload, lmTai.
- Giả lập: `gia-lap-kpi.js` `__goi` tự mở gói như trình duyệt, `__goiTho` lấy bản thô; đếm ô đọc `__thongKe.o`; `everyMinutes`. `tao-ban-xem-thu.js` reset `__PB_KPI`, `__KPI_KHONG_DOI`.
- Kiểm thử `tests/tang-toc-2.js` (31, DATA=). Các bộ cũ (sua-loi-21-10, bao-mat, van-hanh, com-trua, bao-cao, kiem-tra; web: sua-loi-21-10-web, van-hanh-web, thao-tac-web, dang-nhap-web) cho kết quả **giống hệt** bản trước sửa – các lỗi / dừng còn lại có từ trước do dữ liệu thật đã khác lúc viết kiểm thử (vd. van-hanh dừng ở `SLGoc`, com-trua ở `TenDangNhap`).

## Còn có thể làm
- Chưa biết bản thật đã bật Sheets API (`KIEM_TRA_SHEETS_API`) chưa – nếu chưa, mỗi lượt nạp đọc 23 sheet riêng lẻ, rất chậm. Đã ghi vào hướng dẫn dán.
- `nhatky` gửi từ đầu tháng trước (`SO_THANG_GUI_VE` = 2); có thể giảm nếu giao diện không cần tháng trước.
- Index.html ~0,83 MB tải mỗi lần mở trang (ảnh nền đăng nhập 131 KB base64).
- 22/10: chủ dự án chạy `KIEM_TRA_SHEETS_API` báo 2 ô lệch ở TaiKhoan cột 11 `HanMatKhauTam` (ngày giờ trả về số serial) → thêm `HanMatKhauTam`, `CapNhat` vào `COT_NGAY_` (`tests/toc-do.gs`). Thử trên dữ liệu thật: KHỚP 24 trang tính.
