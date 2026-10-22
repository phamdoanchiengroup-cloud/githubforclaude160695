# TCC Chiêm tinh Thần số HD nâng cấp chuyên sâu

Liên quan: [[TCC Sáu hệ]] · [[TCC Bát Tự Hà Lạc và Tứ Trụ đối chiếu nguồn]] · [[TCC Kiểm thử]] · [[00 Mục lục]]

Nhóm: Thiên Cơ Các · Tạo 23/10/2026

## Yêu cầu
Chủ dự án (22/10): tìm cách luận chuyên sâu Human Design, Thần số học, Chiêm tinh để nâng cấp luận giải.

## Rà soát trước khi làm
Ba hệ đã sâu (Chiêm tinh 7 bước có profection, chủ tinh từng nhà; Thần số 6 bước có bài học nghiệp, số tiềm thức, đam mê ẩn; HD 11 bước có biến số, giao điểm hóa thân, chủ đề bản ngã giả trong văn dễ hiểu). Chỉ bổ sung kỹ thuật **còn thiếu và có quy tắc rõ ràng**:

## Đã làm (23/10)
- **Chiêm tinh – phe ngày/đêm (sect) + Phần may mắn (Fortune) + Phần tinh thần (Spirit)** (Hy Lạp cổ, Vettius Valens): ChiemTinh.gs › `chiemTinhLap` thêm `sect.ngay` (Mặt Trời ở nhà 7–12), `lot.fortune` (ngày = Mọc + Trăng − Trời, đêm đảo), `lot.spirit` (ngược Fortune); `ctPhanTich_` → `phucLoc` (văn chuyên sâu + bản `tron*` dễ hiểu; chủ tinh của cung chứa phần). Tab Chiêm tinh: khung "Phe ngày/đêm · Phần may mắn · Phần tinh thần" trong Trường hợp đặc biệt; văn dễ hiểu thêm khối "Nguồn may mắn và chí hướng". Nguồn đối chiếu: Wikipedia "Arabic parts", Cafe Astrology, Skyscript.
- **Thần số – chữ cái chuyển tiếp & số tinh chất** (Transit letters / Essence, Pythagoras – Decoz): ThanSoHoc.gs › `tsChuCai_`, `tsChuyenTiep_` → `phanTich.chuyenTiep` (10 năm: chữ thể chất = tên gọi, trí tuệ = đệm, tâm linh = họ; mỗi chữ kéo dài số năm bằng giá trị; tinh chất = tổng, giữ 11/22; đánh dấu năm trùng năm cá nhân). Tab Thần số: bảng 10 năm trong Phần 4 Chu kỳ; văn dễ hiểu thêm đoạn "Chủ đề năm theo tên của bạn".
- **Human Design – câu tự hỏi cho trung tâm mở** (`HD_CENTER_HOI`, 9 trung tâm: câu hỏi bản ngã giả + trí tuệ khi sống đúng) → `trungTam[].hoi/triTue`, nối vào văn "Bài học"; văn dễ hiểu thêm đoạn "Câu hỏi giúp bạn sống đúng mình".
- Bỏ **4 mặt phẳng biểu hiện** (Planes of Expression): các nguồn gán chữ cái vào mặt phẳng khác nhau – không đủ tin cậy.
- Không dùng Gene Keys (bản quyền của tác giả).
- `BAN_MOI_CAN_CO`: ThanSoHoc `tsChuyenTiep_`, ChiemTinh `lot: lot`, HumanDesign `HD_CENTER_HOI`. Mã giao diện `2026.10.23.2`.
- Kiểm thử: chiem-tinh 1820 (công thức Fortune/Spirit), than-so 2651 (mẫu Nguyễn Văn An 36 tuổi: A + N + N = 11), human-design 2100, cai-dat 83.
