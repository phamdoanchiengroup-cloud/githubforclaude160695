# KPI Hồ sơ bắt buộc

Nhóm: KPI · Cập nhật 22/10/2026
Liên quan: [[KPI Tổng quan và cách dựng]] · [[KPI Kiểm thử]] · [[Quyết định của chủ dự án]] · [[Việc chờ chủ dự án]]

## Chủ dự án yêu cầu 22/10
- Đăng nhập mà hồ sơ còn thiếu thì hiện bảng điền, điền đủ mới dùng tiếp; ai đủ rồi thì thôi; thống kê số người chưa đủ.
- Không bắt buộc với **chủ sở hữu và ban điều hành**; **trợ lý BĐH và nhân sự VẪN bắt buộc**; trưởng / phó phòng trở xuống (công nhân, tổ trưởng, chuyên viên kỹ thuật) bắt buộc.

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
- `tests/ho-so.js` 18 (DATA=) · `tests/ho-so-web.js` 9 (bản xem thử dữ liệu 22/10).
