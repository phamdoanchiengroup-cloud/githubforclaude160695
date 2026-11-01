# TCC Tab Gia đình

Nhóm: Thiên Cơ Các · Cập nhật 1/11/2026
Liên quan: [[TCC Tứ Hóa Phi Tinh]] · [[TCC Kiểm thử]] · [[Quyết định của chủ dự án]]

## Yêu cầu (1/11)
Chủ dự án muốn tab riêng cho lá số gia đình. Chốt: danh sách bấm mở lá số + luận quan hệ + bảng vận năm cả nhà · **chỉ chủ sở hữu** · dữ liệu lấy từ các link cohoc đã gửi.
**Ngày giờ sinh người nhà KHÔNG được ghi vào mã/GitHub** → lưu ở Script Properties (khóa `TCC_GIA_DINH`); chủ dự án dán danh sách một lần ở ô "Nhập nhanh" (dòng mẫu soạn sẵn gửi riêng trong chat).

## Mở cho mọi thành viên + danh sách mặc định (mã 2026.11.1.2)
- Chủ dự án (1/11): **đồng ý đưa thông tin gia đình lên GitHub** và **mở tab cho mọi thành viên tự nhập tra cứu**.
- Lưu ở trang tính **"GiaDinh"** của Google Sheet (mỗi tài khoản một dòng JSON: `gdSh_`, `gdDong_`, `gdDoc_`, `gdGhi_`) thay cho Script Properties. Mọi hàm chỉ cần đăng nhập (`tkCan_(token)`); khách thấy lời giới thiệu + nút Đăng nhập.
- `GD_MAC_DINH`: 4 người nhà chủ sở hữu (bản thân âm 19/5/1995 giờ Mão; vợ âm 20/9/1997 giờ Sửu; con gái dương 22/8/2023 23:30 – **giờ Tý muộn sang ngày âm hôm sau = âm 8/7** (chủ dự án sửa 1/11: không được tắt chuyển ngày để khớp cohoc; bài cohoc của con gái an theo 7/7 nên KHÔNG phải lá số thật của cháu, chỉ dùng làm mẫu quy tắc); em gái âm 19/7/2001 giờ Sửu) – dùng khi chủ sở hữu chưa lưu danh sách. Đều khớp Mệnh/Cục/Lai Nhân với bài cohoc.
- Cột Phi Tinh trong bảng vận năm chỉ chủ sở hữu (`phiTinh: chu`); thành viên thấy Bát Tự lưu niên + ghi chú. Form có ô "Giờ Tý muộn tính sang ngày hôm sau".
- Mở lá số / Xem hợp nhau tính phí như khi tự lập.
- Kiểm thử `tests/gia-dinh.js` 14/14.

## Đã làm (mã 2026.11.1.1)
- **`GiaDinh.gs`** (file .gs thứ 32): `giaDinhDs`, `giaDinhLuu` (chuẩn hóa `gdChuan_`, tối đa 30 người, quan hệ trong `GD_QUAN_HE`), `giaDinhVanNam(nam)` (tuổi, năm với tuổi: trùng/xung/hình/tam hợp, Phi Tinh lưu niên `ptLap_`, Bát Tự lưu niên). Mọi hàm `tkCan_(token, true)`.
- **Giao diện** tab "👪 Gia đình" (`data-tab="gd"`, ẩn với người không phải chủ): thẻ người nhà (Mở lá số = setForm + submit · Sửa · ↑ · Xóa), "Thêm lá số đang mở", form thêm/sửa, "Nhập nhanh" (dòng `Tên | Quan hệ | Nam/Nữ | Âm/Dương | ngày/tháng/năm | giờ:phút`); "Quan hệ trong gia đình" chọn 2 người → điền khung Nhập thông tin + tab Cặp đôi rồi `xemCapDoi`; "Vận năm cả nhà" bảng theo năm chọn.
- Kiểm thử `tests/gia-dinh.js` 18/18 (chặn người không phải chủ, lưu/đọc, chuẩn hóa, từ chối thiếu năm, bảng vận năm) – dữ liệu mẫu bịa.
- Đối chiếu dữ liệu từ link cohoc: lá số chủ dự án, vợ, em gái tính lại khớp Mệnh/Cục/Lai Nhân; **lá số con gái thiếu ngày/giờ sinh** (36 ngày giờ cho cùng lá số) → hỏi chủ dự án.
