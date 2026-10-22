# Việc chờ chủ dự án

Nhóm: Chung · Cập nhật 21/10/2026
Liên quan: [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

## Câu hỏi đang chờ trả lời
- Phạt nhập trễ trước 15/09 (349 lượt) không có vi phạm NHAPTRE nên công nhân không bị trừ nề nếp, nhưng trưởng phòng vẫn bị trừ "không nhắc". Giữ hay gỡ? – [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]
- (Đã rõ 22/10: giữ `TranKPI` = 500, không dùng trần.) – [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]
- Dòng "Tổng" trong thẻ "Chờ chốt" có muốn cộng SL/Lỗi không (đang "–")? – [[KPI Sửa nhỏ trên web]]
- Xưởng của 3 phòng: "Khu chuốt ráp nước" (T1), "Kho thành phẩm", "Phòng kế toán kho" (T3) – ghi chú 13/10 đã ghép tạm; ô xám chưa rõ máy trên sơ đồ 3D chờ ảnh/giải thích. – [[KPI Sơ đồ nhà máy 3D]]
- Video giới thiệu từ tư liệu Rhino: tự dựng bằng ffmpeg + hoạt ảnh, hay video AI qua Everygen (tốn credit)? – [[KPI Màn đăng nhập demo chờ duyệt]]

## Câu hỏi 22/10
- Cân Phôi – Phân Loại Phôi đã nâng 180 → 350 mà vẫn ~102% (công đoạn phụ, 2 người chỉ dành 9–12% thời gian) – có trả về 180 không? – [[KPI Soát đổi định mức 22-10]]

- Sửa NhanSu: Trương Thị Thùy Linh NgayVaoLam 08/11/2026 (tương lai); Hà Thị Hải có 2 dòng. – [[KPI Phân tích định mức]]
- Có loại người SL 0 cả tháng (Bùi Hoàng Anh, Trần Thị Thuỳ Dung, Tống Thị Mỹ Duyên, Nguyễn Thị Mai Nga…) khỏi bảng KPI công nhân không? Có muốn đổi trọng số (SL 70/CL 20/TT 5/AT 5) để KPI tổng bám 85% hơn không? – [[KPI Soát đổi định mức 22-10]]

- Có giới hạn mỗi lần nâng định mức tối đa 10% không (chuyên gia đề xuất, chưa trả lời)? Xác nhận số liệu người đột biến (tab phân tích ghi tên). – [[KPI Phân tích định mức]]


## Kỹ năng (22/10)
- Dùng thử tab Kỹ năng: nhờ 1–2 xưởng đề xuất 8–15 kỹ năng trước, BĐH duyệt và đặt trọng số, rồi mới mở cho các xưởng khác. Chạy thử 3–6 tháng rồi mới bàn quy đổi điểm → phụ cấp kỹ năng (nhờ nhân sự rà pháp lý). – [[KPI Kỹ năng]]

## Chờ chủ dự án làm
- Lưu trữ 2 link thừa `AKfycbyQ…`, `AKfycbz2…` trong Quản lý triển khai (clasp đã tự triển khai đúng link công ty từ 22/10). – [[KPI Cập nhật bằng clasp]]
- Dán bản 21/10 (sửa lỗi + tăng tốc), chạy `CAI_TRIGGER_LAM_NONG_KPI`, kiểm tra Sheets API. – [[KPI Tăng tốc đợt 2 (21-10)]]
- Sau khi dán: chạy một lần `AP_DINH_MUC_CA_THANG`, mở Phân tích định mức tháng 10 → "Áp dụng các dòng đã chọn"; nếu tháng đã chốt thì bấm "Chốt bù tháng này". – [[KPI Phân tích định mức]]

## Dữ liệu trong sheet cần sửa tay (soát 21/10)
- 29 dòng nhật ký ngày sai: NhatKySanXuat dòng 588–609 (C049, đảo ngày/tháng + 5 ô #VALUE!), 733–735 (C638), 2707–2709 (C075, từ chối), 4324 (C080, ngày trống).
- DiemDanhNghi dòng 100–120 và XacNhanDiemDanh dòng 88–90 ghi ngày 2001-08-11.
- 10 người mới thiếu NgayVaoLam.
- `giamdoc`, `phogd2` (ADMIN) vẫn dùng mật khẩu mặc định chung.
- C285 tạm nghỉ bị phạt 7 lượt; 21 lượt phạt + 16 vi phạm rơi vào ngày nghỉ sẽ tự gỡ khi dán bản 21/10.
- Chi tiết: [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]

## Demo chờ góp ý
- Kiểu chia đôi màn hình đã làm thẳng trên web (có nút "Kiểu cũ" để so) – chờ chủ dự án dùng thử, góp ý, và cho biết muốn áp thêm cho tab nào (Duyệt sản lượng, Máy móc…). – [[KPI Chia đôi màn hình]]
- Màn Duyệt sản lượng làm lại: `kpi-app/demo-duyet-san-luong.html` – [[KPI Demo giao diện]]
- Giao diện mới bên trong (3 màn × 2 hướng sáng/tối): `kpi-app/demo-giao-dien-moi.html` – [[KPI Demo giao diện]]
- Lottie đợt 4: `kpi-app/demo-lottie-4.html` – [[KPI Lottie]]
- 9 thao tác mới bên trong: `kpi-app/demo-thao-tac-2.html` – [[KPI Thao tác và hiệu ứng bên trong]]
- Màn đăng nhập "Trạm khắc", hiệu ứng đợt 3 + video nền, 5 kiểu "thịnh hành" (đang dở): [[KPI Màn đăng nhập demo chờ duyệt]]
- Mai hướng dẫn công nhân / khẩu hiệu (nay đã thay bằng Rhino trên web): [[KPI Mai]]

## Việc đã làm, chờ dán
- Xem [[Lần dán lên Apps Script]].
