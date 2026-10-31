# TCC Tứ Hóa Phi Tinh

Nhóm: Thiên Cơ Các · Cập nhật 31/10/2026
Liên quan: [[TCC Tử Vi đối chiếu các phái]] · [[TCC Kiểm thử]] · [[Quyết định của chủ dự án]] · [[TCC Chuyên gia Agency Agents]]

## Yêu cầu (31/10)
Chủ dự án thử bài luận "Bắc phái" (Tứ Hóa Phi Tinh) của tuvi.cohoc.net cho lá số của mình, thấy rất khớp → muốn nghiên cứu sâu trường phái và đưa lên Thiên Cơ Các thành mục riêng. Chốt: **tab riêng, tạm chỉ chủ sở hữu thấy** (thử trước rồi mới mở bán; khi mở: phần mở đầu miễn phí, chi tiết bán xu) · văn hai tầng như quy tắc cũ · chỉ đọc trang cohoc để đối chiếu, không chép văn. **Không ghi ngày giờ sinh của chủ dự án vào repo** (dữ liệu đối chiếu chỉ ở scratchpad phiên).

## Nghiên cứu
- Chuyên gia nghiên cứu (general-purpose) tra ~30 nguồn: Lương Nhược Du (trang Phi Tinh, loạt bài Trương Thế Hiền), Hứa Thuyên Nhân, 108s.tw (Lai Nhân), các blog Phi Tinh Trung – Đài, trang Việt. 29 kỹ thuật có ≥2 nguồn; 10 quy tắc một nguồn để riêng.
- **Bảng Tứ Hóa trường Phi Tinh** khác phái Việt ở **can Nhâm: Khoa là Tả Phù** (phái Việt: Thiên Phủ). Mậu: Tham – Âm – Hữu Bật – Cơ; Canh: Nhật – Vũ – Âm – Đồng; Quý: Phá – Cự – Âm – Tham.
- **Lai Nhân cung**: cung có can trùng can năm, bỏ Tý/Sửu (Giáp→Tuất, Ất→Dậu, … Nhâm→Dần, Quý→Hợi).
- Can đại vận = can cung gốc; Tứ Hóa lưu niên theo can năm xem; Mệnh lưu niên ở cung có chi năm.
- **Đối chiếu với bài cohoc của chủ dự án: khớp 18/18 vị trí sao (lịch âm), can 12 cung, Lai Nhân, 48/48 phi hóa, 12 đại vận, lưu niên.**

## Đã làm (mã 2026.10.31.3)
- **`TuViPhiTinh.gs`** (file .gs thứ 31): `PT_TU_HOA`, `PT_LUAN` (50 mẫu phi hóa đơn có lời riêng), `PT_VAN` (131 mục văn hai tầng do content-creator viết: snToa 48, laiNhan 12, tự hóa 8, khuôn phi 4, 18 mẫu có tên, dvLoc/dvKy/dvKyXung 36, giới thiệu), `PT_NGUON`.
  - `ptNguyenCuc_` (phi hóa 12 cung, Lai Nhân, tự hóa ly tâm/hướng tâm, `chuyenKy`), `ptMau_` (Lưu xuất, Nghịch thủy/Thủy tiết, Nhập khố/Tiết khố, Sách mã, Tuần hoàn, Thị phi, Củ triền/Oán thán, Lộc theo Kỵ đi, Song Kỵ), `ptCung_` (luận từng cung theo thứ tự Bắc phái, kèm tên chuyển cung "X là cung Y tính từ Z"), `ptTang_` (đại vận/lưu niên: Lộc vào đâu, Kỵ nhập/xung tam hợp Mệnh–Tài–Quan, Song Kỵ, trùng điệp, Phản cung; mức Thuận/Bình/Cần giữ nhịp/Nên thận trọng), `ptLap_`, API `phiTinhLuan(input, token)` (chỉ chủ sở hữu).
  - **Tuyệt mệnh Kỵ không hiển thị** (quy tắc không đoán chết/bệnh).
- **Giao diện**: tab "✶ Phi Tinh" (`data-tab="pt"`, ẩn với người không phải chủ), `vePt`/`ptHtml`: bảng can – hóa năm sinh – tự hóa 12 cung, Tổng quan (Lai Nhân + mẫu Kỵ), Luận 12 cung, Đại vận 12 vận, Lưu niên 5 năm; mỗi mục lời dễ hiểu + "Căn cứ Phi Tinh".
- Kiểm thử `tests/phi-tinh.js` 784.984 kiểm tra (bảng Tứ Hóa, can cung Ngũ Hổ Độn, Lai Nhân, phi hóa đúng sao/vị trí, 12 cung/12 vận/5 năm, văn dễ hiểu không tên sao – không "Hóa Kỵ", không Tuyệt mệnh, chặn người không phải chủ).

## Rà chuyên gia code-reviewer → mã 2026.10.31.4
- "Trùng điệp cát" nay đúng nghĩa: Lộc/Quyền của vận rơi vào chỗ có Lộc/Quyền năm sinh (trước bắt nhầm Lộc gặp Kỵ năm sinh – nay chỉ ghi "làm dịu Kỵ" ở căn cứ).
- Phản cung Kỵ chỉ xét ở đại vận (tham số `laDaiVan`; trước lọt vào lưu niên của trẻ chưa vào vận đầu); không trừ điểm hai lần khi vừa phản cung vừa xung tam hợp.
- Lưu niên ghi "của năm"; `vePt` bỏ qua phản hồi của lá số cũ; khung căn cứ trống không hiện.
- Kiểm thử mở rộng: cấm thêm "Hóa ", "Kỵ", "Lai Nhân", "tự hóa", " phi ", chỗ trống "{", "undefined" trong văn dễ hiểu; quét cả lưu niên và giới thiệu (1.114.018 kiểm tra).
- Giữ định nghĩa "hướng tâm" theo nguồn nghiên cứu (cung A hóa sao ở cung đối diện → A có tự hóa hướng tâm).

## Còn ngỏ
- Chủ dự án đọc thử, so với cảm nhận từ bài cohoc/NotebookLM; rồi quyết định mở cho khách (giá xu, phần nào miễn phí), có đưa vào PDF không.
- Có thể thêm: lưu nguyệt (Mệnh tháng theo Đẩu quân), lựa chọn biến thể can Canh, đọc lục thân theo chuyển cung sâu hơn.
