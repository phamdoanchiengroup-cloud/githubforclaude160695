# TCC Tab Gia đình

Nhóm: Thiên Cơ Các · Cập nhật 1/11/2026
Liên quan: [[TCC Tứ Hóa Phi Tinh]] · [[TCC Kiểm thử]] · [[Quyết định của chủ dự án]]

## Yêu cầu (1/11)
Chủ dự án muốn tab riêng cho lá số gia đình. Chốt: danh sách bấm mở lá số + luận quan hệ + bảng vận năm cả nhà · **chỉ chủ sở hữu** · dữ liệu lấy từ các link cohoc đã gửi.
**Ngày giờ sinh người nhà KHÔNG được ghi vào mã/GitHub** → lưu ở Script Properties (khóa `TCC_GIA_DINH`); chủ dự án dán danh sách một lần ở ô "Nhập nhanh" (dòng mẫu soạn sẵn gửi riêng trong chat).

## Đã làm (mã 2026.11.1.1)
- **`GiaDinh.gs`** (file .gs thứ 32): `giaDinhDs`, `giaDinhLuu` (chuẩn hóa `gdChuan_`, tối đa 30 người, quan hệ trong `GD_QUAN_HE`), `giaDinhVanNam(nam)` (tuổi, năm với tuổi: trùng/xung/hình/tam hợp, Phi Tinh lưu niên `ptLap_`, Bát Tự lưu niên). Mọi hàm `tkCan_(token, true)`.
- **Giao diện** tab "👪 Gia đình" (`data-tab="gd"`, ẩn với người không phải chủ): thẻ người nhà (Mở lá số = setForm + submit · Sửa · ↑ · Xóa), "Thêm lá số đang mở", form thêm/sửa, "Nhập nhanh" (dòng `Tên | Quan hệ | Nam/Nữ | Âm/Dương | ngày/tháng/năm | giờ:phút`); "Quan hệ trong gia đình" chọn 2 người → điền khung Nhập thông tin + tab Cặp đôi rồi `xemCapDoi`; "Vận năm cả nhà" bảng theo năm chọn.
- Kiểm thử `tests/gia-dinh.js` 18/18 (chặn người không phải chủ, lưu/đọc, chuẩn hóa, từ chối thiếu năm, bảng vận năm) – dữ liệu mẫu bịa.
- Đối chiếu dữ liệu từ link cohoc: lá số chủ dự án, vợ, em gái tính lại khớp Mệnh/Cục/Lai Nhân; **lá số con gái thiếu ngày/giờ sinh** (36 ngày giờ cho cùng lá số) → hỏi chủ dự án.
