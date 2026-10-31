# TCC Thần sát Bát Tự

Nhóm: Thiên Cơ Các · Cập nhật 31/10/2026
Liên quan: [[TCC Bát Tự Hà Lạc và Tứ Trụ đối chiếu nguồn]] · [[TCC Sáu hệ]] · [[TCC PDF]] · [[TCC Kiểm thử]] · [[Quyết định của chủ dự án]]

## Yêu cầu (26/10)
Chủ dự án gửi ảnh lá số trang huyencobattu.com ("từ điển 128 sao"), muốn bổ sung thần sát lên web và luận Bát Tự có cấu trúc. Chốt: đủ sao có quy tắc rõ (≥2 nguồn) · hiện theo từng trụ + từ điển ở tab Tham khảo + PDF · luận theo trình tự Tử Bình · văn dễ hiểu như quy tắc cũ.

## Đã làm (mã 2026.10.31.1)
- **`BatTuThanSat.gs`** (file .gs thứ 30): `THS_DS` 156 sao, mỗi sao `t` tên · `l` cat/hung/trung · `n` nhóm (tb Tử Bình 55, tt vòng Thái Tuế 10, hd Hoàng đạo – Hắc đạo 12, tr thập nhị trực 12, nh sao chọn ngày Ngọc Hạp 67) · `g` gốc tra · `a` trụ áp dụng · `b` bảng · `an` cách an bằng chữ · `y` nghĩa · `de` câu dễ hiểu không tên sao · `k` hướng cân bằng.
  - `thsTheoTru_(P, nam)` an sao cho 4 trụ (sao Tử Bình xếp trước); `thsNghia_`; `thamKhaoThanSat()` cho từ điển. Gọi trong `batTuLap` → `R.thanSatTru`, `R.thanSatNghia`.
  - Dương Nhẫn can âm theo Tam Mệnh Thông Hội (lộc tiến 1: Ất Thìn, Đinh Mùi…). Kình Dương chỉ ở từ điển (cùng vị trí Dương Nhẫn). Vòng Hoàng đạo: trụ giờ tính theo chi ngày.
- **Nguồn**: chuyên gia nghiên cứu tra Tam Mệnh Thông Hội, Ngọc Hạp Thông Thư, Hiệp Kỷ Biện Phương, thayungkhiem.vn, yyzfs, wanlihonghu. **Không chép bảng suy ngược từ huyencobattu** (chỉ dùng để so). Lá số mẫu trong ảnh: khớp 18/32 sao của trang kia; 7 sao không đủ 2 nguồn nên không đưa vào (Địa Giải, Tục Thế, Tứ Tuyệt, Phục Tội, Thiên Ân, Tam Ưu, Minh Phế); vài sao trang kia an khác sách (Huyết Nhẫn, U Vi, Ích Hậu, Hoạt Diệu, Ngọc Đường, Thiên Hình).
- **Lời dễ hiểu 156 sao**: chuyên gia content-creator viết (`de`, `k`, `y`); bỏ câu nhắc sinh nở ở Lưu Hà, Cửu Sửu (quyết định không chẩn đoán sức khỏe).
- **Giao diện** (Script/Styles): hàng "Thần sát" trong bảng Tứ Trụ (`thsO` tối đa 8 nhãn/trụ + nút "+N sao", bấm nhãn → `.ths-y` hiện nghĩa + "Tra từ điển →"); bước "Thần sát" (`thsBuocHtml`: cát/hung/trung tính của nhóm Tử Bình – Thái Tuế, nhóm chọn ngày dạng nhãn, khối dễ hiểu gộp ý trùng); tab Tham khảo thêm "🔖 Từ điển thần sát" (`tkThsHtml`, tìm/lọc, viền sáng sao có trong lá số).
- **Bài luận Bát Tự 15 bước** (`renderBatTu`): Lập Tứ Trụ → Ngũ hành → Thập thần → Hợp xung hình hại → Vượng suy → Cách cục → Dụng/Hỷ/Kỵ → Thần sát → Tính cách & bản mệnh → Lục thân & cung vị → Sự nghiệp · tài lộc · sức khỏe → Phú quý → Đại vận → Lưu niên → Tổng hợp. Khối dễ hiểu (`veDeHieu`) chèn vào ô `.bt-dh-cho` của bước tương ứng.
- **PDF**: bản đầy đủ chép theo web; bản gọn giữ thêm "八字 Tứ Trụ" và "神煞 Thần sát theo từng trụ".
- Kiểm thử `tests/than-sat.js` 47690/47690 (dữ liệu, câu dễ hiểu không tên sao, đối chiếu khẩu quyết Thiên Ất/Lộc/Dương Nhẫn/Thái Tuế/Kiến/Không Vong trên 600 bộ trụ, gắn batTuLap, từ điển).

## Rà chuyên gia code-reviewer → mã 2026.10.31.2
- **Một nguồn sự thật**: `btctThanSat_` (Cung vị "Thần sát tại trụ", 12 lĩnh vực, lưu niên từng năm) nay lấy vị trí từ `bt.thanSatTru` (nhóm tb + tt), giữ tên/lời cũ qua `BTCT_TEN_MOI`; cách cũ còn ở `btctThanSatCu_` làm dự phòng. Lưu niên: Dương Nhẫn = Lộc tiến 1 cả can âm. Kiểm thử đối chiếu hai chiều trong `tests/than-sat.js` (49.754 kiểm tra).
- Đức Tú phải có hai trụ khác nhau (một can Đức, một can Tú); Thái Tuế chỉ xét các trụ khác trụ năm.
- PDF: nhãn sao đổi thành chữ trước khi bỏ nút (`pdfLamSach`), bảng Tứ Trụ `bc-nguyen` không tách trang, bảng in chỉ sao Tử Bình + Thái Tuế; tên bước đổi để quy tắc bản gọn (khớp tiền tố) không giữ nguyên cả bước: "Mười thần", "Cát thần – hung sát", "Vận 10 năm"; panel "流年 Năm đang xem – năm" thêm vào bản gọn (104 trang).
- "Tra từ điển →" lọc đúng một thẻ (`TK.chinh` + `data-ths-the`) và cuộn tới; màu nhãn cho giao diện sáng; thẻ khóa lưu niên vào bước "Lưu niên".

## Còn ngỏ
- Mỗi trụ trung bình ~15 sao (nhóm chọn ngày chiếm nhiều) – nếu chủ dự án thấy rối, có thể ẩn hẳn nhóm Ngọc Hạp.
