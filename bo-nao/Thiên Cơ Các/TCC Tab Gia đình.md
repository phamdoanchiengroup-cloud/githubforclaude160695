# TCC Tab Gia đình

Nhóm: Thiên Cơ Các · Cập nhật 1/11/2026
Liên quan: [[TCC Tứ Hóa Phi Tinh]] · [[TCC Kiểm thử]] · [[Quyết định của chủ dự án]]

## Yêu cầu (1/11)
Chủ dự án muốn tab riêng cho lá số gia đình. Chốt: danh sách bấm mở lá số + luận quan hệ + bảng vận năm cả nhà · **chỉ chủ sở hữu** · dữ liệu lấy từ các link cohoc đã gửi.
**Ngày giờ sinh người nhà KHÔNG được ghi vào mã/GitHub** → lưu ở Script Properties (khóa `TCC_GIA_DINH`); chủ dự án dán danh sách một lần ở ô "Nhập nhanh" (dòng mẫu soạn sẵn gửi riêng trong chat).

## Quan hệ gia đình luận theo đúng vai + xem 3–4 lá số (mã 2026.11.1.4)
- Chủ dự án (1/11): xem "tôi – con gái" mà ra mục kết hôn, sinh con là sai, sửa ngay; và nên nghiên cứu tương tác 3–4 lá số (cha mẹ – con).
- Nguyên nhân: nút "Xem hợp nhau" cũ mượn phần Cặp đôi (`lapCapDoi`, vốn xem hôn nhân).
- Mới (`GiaDinh.gs`): `giaDinhQuanHe(ids, token)` chọn 2–4 người theo id (chỉ trong danh sách của chính tài khoản). `GD_MAC_DINH` có id cố định `gdmd1..4`.
  - `gdLoaiCap_(qa, qb)`: từ quan hệ của mỗi người với chủ danh sách suy ra cặp: vợ chồng (cả Cha–Mẹ), cha mẹ – con (Bản thân/Vợ/Chồng – Con; Cha/Mẹ – Bản thân/Anh/Chị/Em), anh chị em, ông bà – cháu (Cha/Mẹ – Con; Ông/Bà – Bản thân/Anh/Em), dâu rể – cha mẹ chồng/vợ, cô/dì/chú/bác – cháu, người thân khác. `tren` = ai là bề trên.
  - `gdCap_`: (1) tuổi: nạp âm theo chiều bề dưới → bề trên, can, chi năm; (2) Bát Tự: ai "tiếp sức" ai (hành mạnh nhất là hỷ/kỵ của người kia), nhật chủ sinh/khắc, **lục thân Tử Bình** (cha xem con = Quan Sát, mẹ xem con = Thực Thương; con xem cha = Tài, mẹ = Ấn; anh em = Tỷ Kiếp; hỷ → nâng đỡ, kỵ → thương nhưng dễ áp lực); (3) Tử Vi: Tử Tức cha mẹ ↔ Mệnh con, Phụ Mẫu con ↔ Mệnh cha mẹ, Huynh Đệ anh em, Phúc Đức ông bà, chi cung Mệnh. Điểm = tuổi 35% + Bát Tự 35% + Tử Vi 30%; xếp "Rất gắn bó → Cần nhiều kiên nhẫn". Lời dễ hiểu không tên sao/cung/thuật ngữ, ý cần lưu ý luôn có "Cách làm"; căn cứ để ở "Căn cứ cổ học".
  - Cặp vợ chồng: bản gọn + nút "Xem hợp hôn đầy đủ (tab Cặp đôi)" – giữ phần Cặp đôi đang bán.
  - `gdNhom_` (3–4 người): ngũ hành trung bình cả nhà (hành thiếu → cách bổ sung), ai tiếp sức cho ai, thế tuổi (tam hợp trọn bộ/bán hợp, xung), tam giác cha – mẹ – con (con gần ai hơn, con mang may mắn chung, con là cầu nối – đừng bắt con chọn phe), vai trò (người lớn ≥ 18 tuổi: giữ nhịp / mềm mỏng; trẻ thân vượng: cá tính mạnh), 5 năm tới (năm nhiều người phạm tuổi / năm thuận việc chung).
- Giao diện: ô chọn người (tối đa 4, mặc định 2 người đầu) → "Xem quan hệ"; kết quả ngay trong tab (`gdQhHtml`). Phần quan hệ gia đình **miễn phí** cho người đăng nhập.
- Rà: chuyên gia `code-reviewer` – không lỗi chặn; đã sửa: đổi tài khoản giữa lúc chờ thì bỏ kết quả cũ, nhãn ông bà – cháu, bỏ chữ "phúc tinh", vợ chồng bản gọn.
- Kiểm thử `tests/gia-dinh.js` 7862/7862 (loại cặp, không chữ kết hôn/sinh con cho cha – con, 4 người đủ 6 cặp + tam giác, lời dễ hiểu không tên sao/thuật ngữ, 25 gia đình ngẫu nhiên); cai-dat 103/103; chạy giao diện Playwright 1200px và 390px không lỗi, không tràn.
- 1/11 (sau): chủ dự án **bỏ vai "Cháu"** khỏi `GD_QUAN_HE` (quan hệ xa, ít ảnh hưởng); dữ liệu cũ khi lưu lại thành "Khác". Kiểm thử 7863/7863.

## Mở cho mọi thành viên + danh sách mặc định (mã 2026.11.1.2)
- Chủ dự án (1/11): **đồng ý đưa thông tin gia đình lên GitHub** và **mở tab cho mọi thành viên tự nhập tra cứu**.
- Lưu ở trang tính **"GiaDinh"** của Google Sheet (mỗi tài khoản một dòng JSON: `gdSh_`, `gdDong_`, `gdDoc_`, `gdGhi_`) thay cho Script Properties. Mọi hàm chỉ cần đăng nhập (`tkCan_(token)`); khách thấy lời giới thiệu + nút Đăng nhập.
- `GD_MAC_DINH`: 4 người nhà chủ sở hữu (bản thân âm 19/5/1995 giờ Mão; vợ âm 20/9/1997 giờ Sửu; con gái dương 22/8/2023 23:30 – **giờ Tý muộn sang ngày âm hôm sau = âm 8/7** (chủ dự án sửa 1/11: không được tắt chuyển ngày để khớp cohoc; bài cohoc của con gái an theo 7/7 nên KHÔNG phải lá số thật của cháu, chỉ dùng làm mẫu quy tắc); em gái âm 19/7/2001 giờ Sửu) – dùng khi chủ sở hữu chưa lưu danh sách. Đều khớp Mệnh/Cục/Lai Nhân với bài cohoc.
- Cột Phi Tinh trong bảng vận năm chỉ chủ sở hữu (`phiTinh: chu`); thành viên thấy Bát Tự lưu niên + ghi chú. Form có ô "Giờ Tý muộn tính sang ngày hôm sau".
- Mở lá số tính phí như khi tự lập (quan hệ gia đình: xem mục trên).
- Kiểm thử `tests/gia-dinh.js` 14/14.

## Đã làm (mã 2026.11.1.1)
- **`GiaDinh.gs`** (file .gs thứ 32): `giaDinhDs`, `giaDinhLuu` (chuẩn hóa `gdChuan_`, tối đa 30 người, quan hệ trong `GD_QUAN_HE`), `giaDinhVanNam(nam)` (tuổi, năm với tuổi: trùng/xung/hình/tam hợp, Phi Tinh lưu niên `ptLap_`, Bát Tự lưu niên). Mọi hàm `tkCan_(token, true)`.
- **Giao diện** tab "👪 Gia đình" (`data-tab="gd"`, ẩn với người không phải chủ): thẻ người nhà (Mở lá số = setForm + submit · Sửa · ↑ · Xóa), "Thêm lá số đang mở", form thêm/sửa, "Nhập nhanh" (dòng `Tên | Quan hệ | Nam/Nữ | Âm/Dương | ngày/tháng/năm | giờ:phút`); "Quan hệ trong gia đình" chọn 2 người → điền khung Nhập thông tin + tab Cặp đôi rồi `xemCapDoi`; "Vận năm cả nhà" bảng theo năm chọn.
- Kiểm thử `tests/gia-dinh.js` 18/18 (chặn người không phải chủ, lưu/đọc, chuẩn hóa, từ chối thiếu năm, bảng vận năm) – dữ liệu mẫu bịa.
- Đối chiếu dữ liệu từ link cohoc: lá số chủ dự án, vợ, em gái tính lại khớp Mệnh/Cục/Lai Nhân; **lá số con gái thiếu ngày/giờ sinh** (36 ngày giờ cho cùng lá số) → hỏi chủ dự án.
