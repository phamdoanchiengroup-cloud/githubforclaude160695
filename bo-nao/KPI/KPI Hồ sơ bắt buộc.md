# KPI Hồ sơ bắt buộc

Nhóm: KPI · Cập nhật 22/10/2026
Liên quan: [[KPI Tổng quan và cách dựng]] · [[KPI Kiểm thử]] · [[Quyết định của chủ dự án]] · [[Việc chờ chủ dự án]]

## Chủ dự án yêu cầu 22/10
- Đăng nhập mà hồ sơ còn thiếu thì hiện bảng điền, điền đủ mới dùng tiếp; ai đủ rồi thì thôi; thống kê số người chưa đủ.
- Chốt cuối 22/10: **chỉ tài khoản admin (chủ sở hữu, ban điều hành) không phải điền; mọi tài khoản còn lại đều phải điền** (trợ lý BĐH, nhân sự, bếp, nhóm báo cơm, trưởng / phó phòng, công nhân…).
- Tab Nhân sự thiếu người ban điều hành / hành chính nhân sự → thêm khối liệt kê, **chỉ chủ sở hữu xem**.

## Làm (máy chủ `kpi-app/tests/ho-so/ho-so.gs` + `va-ho-so.py`, cuối va-code.py; web mục 31 `ho-so-web.js` + `va-ho-so-web.py`)
- 6 mục `HS_MUC`: DienThoai (10 số, đầu 0), SoCCCD (12 số), DiaChi (≥ 5 ký tự), SdtKhanCap (khác SĐT của mình), NamSinh (1950 … 15 tuổi), NgayVaoLam (≤ hôm nay). Giá trị đang có trong sheet được dễ dãi: SĐT 9 số / CCCD 11 số (mất số 0 đầu do lưu dạng số) vẫn coi là đủ.
- `hsVaiTroPhai_`: mọi vai trò trừ `HS_KHONG_BAT_BUOC = ['OWNER','ADMIN']`; chỉ hồ sơ NhanSu "Đang làm", tài khoản có MaNV.
- `napDuLieu` gửi `me.hoSoThieu`; `luuHoSoThieu(token, o)` chỉ ghi các mục đang thiếu (mục đã có không bị đè; SĐT/CCCD ghi dạng chữ `suaOText_`), không cần duyệt; sửa mục đã có vẫn qua "Hồ sơ của tôi" (duyệt). `thongKeHoSoThieu(token)`: ADMIN/TL/HR cả nhà máy, TP xưởng mình.
- Web: bảng `#hsBox` (z-index 8950 – trên tour Rhino 8800/8900, dưới hộp "phiên hết hạn" 9000), hiện sau `buildNav`; lỗi ngay dưới từng ô; nút Thoát = đăng xuất. Tab Nhân sự: thẻ `#hsTk` "Hồ sơ chưa đủ: x/y người" + số theo mục + danh sách theo xưởng.
- `tao-ban-xem-thu.js` có `BO_HO_SO=1` để tắt bảng (cho kiểm thử cũ đăng nhập bằng tài khoản thiếu hồ sơ – `cho-chot-ngay` cần).

## Số liệu 22/10 (sheet thật)
- 148/184 người phải điền (CN 129, PP 15, TP 4). Thiếu: SĐT khẩn cấp 133, CCCD 125, địa chỉ 78, SĐT 75, ngày vào làm 73, năm sinh 52. 41 người thiếu cả 6 mục, 65 người chỉ thiếu 1–2.
- Theo xưởng: Phôi Thô 27, Phôi Carbon 25, Sơn 21, Đóng gói 20, Hoàn thiện 18, Ngọn Taro 15, CNC 13, In UV 7, Ngọn Tip 2.

## Kiểm thử
- `tests/ho-so.js` 28 (DATA=) · `tests/ho-so-web.js` 11 (bản xem thử dữ liệu 22/10).

## 22/10 (tối): tài khoản không gắn mã nhân viên + khối "Ban điều hành & Hành chính nhân sự"
- Nguyên nhân tab Nhân sự thiếu họ: ban điều hành, trợ lý BĐH, nhân sự, bếp, nhóm báo cơm chỉ có dòng TaiKhoan (MaNV trống), không có dòng NhanSu – nên trước đó bảng hồ sơ bắt buộc cũng không áp được cho họ.
- Sheet mới `HoSoVanPhong` (`VP_COT`: TenDangNhap, HoTen, VaiTro, DienThoai, SoCCCD, DiaChi, SdtKhanCap, NamSinh, NgayVaoLam, CapNhat; SĐT/CCCD dạng chữ), tự tạo khi lưu lần đầu (`vpSheet_`). Không thêm vào NhanSu để khỏi lọt Bảng KPI công nhân.
- `hsCuaToi_`: có MaNV → NhanSu; không có → `vpHoSo_(tk, vaiTro, ten)` (bản trống `_moi` nếu chưa có dòng). `hsVaiTroPhai_`: mọi vai trò trừ `HS_KHONG_BAT_BUOC = ['OWNER','ADMIN']`. `me.hoSoThieu` tính ngay sau kiểm tra đổi mật khẩu trong `napDuLieu` (cả nhánh rút gọn của BEP / NHOM / NV / TBP).
- `danhSachVanPhong(token)` (chỉ `laOwner`): tài khoản OWNER/ADMIN/TL/HR đang dùng + hồ sơ + số mục thiếu + lần đăng nhập cuối. Web `vpDanhSach()` – khối ở tab Nhân sự, trên khung "Gán công đoạn".
- `thongKeHoSoThieu`: chủ sở hữu thấy thêm nhóm "Tài khoản không gắn mã nhân viên" (`MaXuong: 'VAN_PHONG'`); ban điều hành / nhân sự / TP không thấy nhóm này.
- Số liệu: 160/197 phải điền (gồm 13 tài khoản không gắn mã NV). Khối BĐH & HCNS: 10 người (1 chủ sở hữu, 3 BĐH, 3 trợ lý, 3 nhân sự).
- Chủ dự án 22/10: tài khoản nhóm báo cơm tổng (NHOM, dùng chung) **không cần điền** → `HS_KHONG_BAT_BUOC = ['OWNER','ADMIN','NHOM']`. Còn 154/191 phải điền (7 tài khoản không gắn mã NV).
- Kiểm thử `ho-so.js` 27, `ho-so-web.js` 11.
