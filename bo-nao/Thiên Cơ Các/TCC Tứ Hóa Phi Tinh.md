# TCC Tứ Hóa Phi Tinh

Nhóm: Thiên Cơ Các · Cập nhật 1/11/2026
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

## Lá số Phi Tinh 4×4 nền Hologram → mã 2026.10.31.5
- Chủ dự án yêu cầu dùng lá số 4×4 nền Hologram như Tử Vi. Chốt: ô gọn (cung, can chi, chính tinh + Tả Hữu Xương Khúc, dấu hóa năm sinh, ↑/↓ tự hóa, Lai Nhân) · bấm cung → 4 mũi tên Lộc (xanh lá) / Quyền (cam) / Khoa (xanh dương, nét đứt) / Kỵ (đỏ) + lời luận cung hiện dưới lá số · nút Nguyên cục / Đại vận / Lưu niên (ô ghi "ĐV …"/"LN …", chọn vận/năm; Lưu niên chọn Mệnh năm thì vẽ Tứ Hóa theo can năm) · giữ bảng 12 cung bên dưới.
- Máy chủ: `ptLap_` trả thêm `banDo` (theo ô địa chi), `menhO`, `laiNhanO`; tầng vận/năm có `menhO`, `hoa[].o`.
- Giao diện: `ptBanDoHtml`, `ptVe` (SVG đường cong cắt tại mép ô, viền tối, đầu mũi tên), `ptGan` (nền `TCCHolo.anh('TuVi', #ptLuoi)` – cùng tranh và cách căn với lá số Tử Vi). CSS `.pt-khung/.pt-luoi/.pt-o/.pt-giua/.pt-svg`.
- Chuyên gia ui-designer rà ảnh: chữ nổi trên mũi tên, mũi tên dừng ở mép ô, đường cong tránh chồng, chú giải màu ra ngoài lưới, chữ điện thoại ≥10px, viền focus, aria-label/aria-pressed.

## Còn ngỏ
- Chủ dự án đọc thử, so với cảm nhận từ bài cohoc/NotebookLM; rồi quyết định mở cho khách (giá xu, phần nào miễn phí), có đưa vào PDF không.
- Có thể thêm: lưu nguyệt (Mệnh tháng theo Đẩu quân), lựa chọn biến thể can Canh, đọc lục thân theo chuyển cung sâu hơn.

## Kho luận giải tổng hợp + bộ sinh lên nhánh (1/11, chuẩn bị chuyển phiên)
- Chủ dự án chốt cách gộp: phiên cũ làm xong bước tổng hợp, đẩy lên nhánh; phiên mới dựng tab theo mục lục cohoc.
- Thư mục **`nghien-cuu/phi-tinh/`** (không đẩy lên Apps Script): `tong-quan.md`, `quy-tac.json`, `van.json`, `gen/vo.js`, `gen/dung.py` (sinh lại ra **đúng y hệt** `TuViPhiTinh.gs` hiện tại), `tong-hop/catalog.json` + `tong-hop/README.md`. Cách chạy và việc tiếp: `nghien-cuu/phi-tinh/README.md`.
- `catalog.json` (chuyên gia `content-creator` tổng hợp 4 bài cohoc A/B/C/D, viết lại bằng lời mới): `mucLuc` 18 phần theo mục lục cohoc, `dinhNghia` 42 khái niệm (ghi mức chắc chắn), `luan` 518 khóa / 606 ý (`nguon`, `ky`, `de`, `muc`). Kiểm: JSON hợp lệ; 185 câu tầng chuyên môn trùng ≥10 chữ liên tiếp với cohoc đã được viết lại → còn 0 (chỉ còn tên mục lục và chú thích viết tắt); tầng dễ hiểu không tên sao/cung; không dữ liệu cá nhân, không lời đoán chết/bệnh/ly hôn.
- Chưa xác định (đừng bịa): công thức điểm xí hoa, Thiên–Địa–Nhân của can Quý, cung khí số vị, Tài thiên/địa/nhân, Thuận/Nghịch thủy Kỵ, Tuyệt mệnh Kỵ / Phá thể / Dương phi nhập Âm.
- Bài cohoc đúng của con gái (lid-403265) chưa trích.


## Dựng lại tab theo mục lục Bắc phái (1/11, phiên mới – mã 2026.11.1.5)
- Chủ dự án chốt: **đầy đủ 18 phần, mỗi phần một khối bấm mở/thu** · **vận tháng 12 tháng** của năm đang xem · mục chưa rõ công thức thì **tìm trên internet rồi hoàn thiện** · **vẫn chỉ chủ sở hữu**.
- Bộ sinh: `gen/bai.js` (bộ dựng bài luận) + `gen/cong-thuc.js` (công thức bổ sung) + kho `PT_KHO` (catalog.json, bỏ %/xác suất ở tầng chuyên môn) + `tong-hop/bo-sung.json` (content-creator: Thân cư Phu/Tài/Quan, cung khí tiểu cát / hung nhiều hơn cát). `ptLap_` trả thêm `bai` (giữ dữ liệu cũ cho lá số 4×4).
- `ptBai_`: Tổng quan (bảng can – hóa, Lai Nhân, chip mẫu Lộc – Kỵ) → Mệnh → Thân → 11 cung (can cung, mẫu phi hóa, Hóa năm sinh/tự hóa, phi 4 hóa kèm chuyển cung, M chất, sao) → 12 đại vận (`ptDaiVanBai_`: Mệnh vận phi Tứ Hóa, hồi quy, phản cung, tha–ngã, cặp Lộc–Kỵ, trùng điệp, M chất, Thể–Dụng `ptTheDung_` có dấu */**/***/****, phi phục, tổng luận 12 chủ đề `ptTongLuan_`) → vận năm (`ptNamBai_`, ô chọn năm, ứng tháng tam điểm, Lộc gặp Kỵ, Song Kỵ, Hư lộc, M chất ba tầng) → vận tháng ×12 (`ptThangBai_`) → phụ lục chính tinh + cách cục (Văn quế văn hoa, Cơ Cự đồng lâm, Lộc hợp uyên ương, Phủ Tướng triều viên).
- Chấm tổng luận: Lộc Dụng chiếu Thể +3; quy vị cát, M chất +2; Hóa cát Thể nhập/chiếu Dụng, cát nhập Mệnh, Quyền/Khoa Dụng chiếu Thể +1; Kỵ Thể nhập/xung Dụng, Kỵ nhập Mệnh −1; quy vị Kỵ, Kỵ xung Mệnh −2; Kỵ Dụng xung Thể −3 → Thuận / Đan xen / Cần giữ.
- **Nghiên cứu bổ sung** (`nghien-cuu/phi-tinh/cong-thuc-bo-sung.md`, chuyên gia general-purpose, ~30 nguồn Trung – Việt): đã dùng **Mệnh tháng theo Đẩu quân** (chi năm − (tháng sinh − 1) + giờ = tháng Giêng, đi thuận; can Tứ Hóa tháng = can cung nơi Mệnh tháng đóng – cách phái Tứ Hóa), **Nghịch thủy Kỵ** (Mệnh/Tài/Quan phi Kỵ sang cung đối có Kỵ năm sinh, không tự hóa), **Thuận thủy Kỵ** (= Lưu thủy: phi Kỵ sang cung không đối; không đưa lên chip Tổng quan).
- **Chưa đưa vào (nguồn thấp hoặc không có):** điểm xí hoa, cung khí theo hỉ – kỵ thần (giả thuyết trọng số can 20/chi 50/nạp âm 30 khớp 10/10 ví dụ nhưng cần kiểm bài gốc), Thiên–Địa–Nhân của can (Quý "không nương" – một nguồn), Tài thiên/địa/nhân, Phá thể (định nghĩa mới: cung thứ ba tam hợp Hình–Riêu, một nguồn), "Dương phi nhập Âm" (không có nguồn – đã gỡ), khí số vị cho tuyến Huynh–Nô/Phụ–Tật. Tuyệt mệnh Kỵ vẫn không hiển thị.
- Kiểm thử `tests/phi-tinh.js` thêm: thứ tự mục lục, 12 đại vận, vận năm, 12 tháng đi thuận từ Đẩu quân (ví dụ nguồn: năm Hợi, tháng 6, giờ Mão → Dậu), mọi mục đủ trường, câu dễ hiểu không tên sao/thuật ngữ/%, căn cứ không còn %/chỗ trống – 11.036.289 kiểm tra đạt.
- Rà mã code-reviewer (1/11): sửa bộ nhớ đệm khi đổi năm, đại vận đầu (trùng Mệnh gốc) thiếu tổng luận, Kỵ Thể→Dụng chấm −2, dòng Quyền/Khoa năm–tháng bị mất, Song Lộc đúng cung, hồi quy không lặp quy vị, Nghịch thủy dùng tự hóa ly tâm, Thiên Di không đếm hai lần, bỏ Thuận thủy (cung nào cũng có). Còn để sau: payload ~400KB/lần (có thể tách API theo năm).
- Ghi chú: `VanSau.gs` khởi tháng Giêng từ cung tiểu hạn, khác Đẩu quân của nguồn Trung văn – chưa đụng.
