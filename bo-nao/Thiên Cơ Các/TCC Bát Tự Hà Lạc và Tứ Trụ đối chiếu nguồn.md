# TCC Bát Tự Hà Lạc và Tứ Trụ đối chiếu nguồn

Liên quan: [[TCC Sáu hệ]] · [[TCC Tử Vi đối chiếu các phái]] · [[TCC Kiểm thử]] · [[00 Mục lục]]

Nhóm: Thiên Cơ Các · Tạo 22/10/2026

## Yêu cầu
Chủ dự án (22/10): tìm cách luận Bát Tự Hà Lạc và Tứ Trụ trên các web để mang về web của mình.

## Nguồn đã đọc (chỉ phần công khai)
- Hà Lạc: lyso.vn (chủ đề "Học Bát tự hà lạc": 10 thể cách tốt, bậc tam phúc thần), thienviet.wordpress.com (bài 2: nguyên đường, 4 ví dụ), hocvienlyso.org (Hóa công theo Đông chí/Xuân phân/Hạ chí/Thu phân), sohu.com "六爻飞支与元堂爻位式" (quy tắc đi hai lượt / một lượt), mục lục 河洛理數 (sourcelibrary, ctext – ctext chặn truy cập tự động).
- Tứ Trụ: bảng điều hậu 窮通寶鑑 – suanzhun.net/article/1555 và blog Vương Minh (Sina) – hai bản khớp gần hết, lệch vài lỗi chép; masterseanchan.com (Tian Qi) chỉ có bài khái quát thập thần.

## Đã đưa vào web (22/10)
- **Sửa lỗi hào nguyên đường** (HaLac.gs › `hlNguyenDuong_`): giờ dương đi trên hào dương, giờ âm đi trên hào âm, từ dưới lên; 1–3 hào cùng loại đi hai lượt, 4–5 hào đi một lượt, giờ thừa "ký cung" sang hào khác loại. Bản cũ vòng lại trên hào cùng loại nên sai với quẻ có 1, 2, 4, 5 hào cùng loại (kéo theo sai quẻ Hậu thiên, đại vận, lưu niên). Đối chiếu: Khiêm giờ Tỵ → 5, Đại Hữu giờ Thân → 1, Đại Quá giờ Dậu → 6, Thăng giờ Thìn → 1, Tụy giờ Dần → 4.
- **Tam phúc thần** (`hlThoiVi_`): thêm Địa nguyên khí (chi năm theo Hậu thiên: Tý Khảm, Sửu Dần Cấn, Mão Chấn, Thìn Tỵ Tốn, Ngọ Ly, Mùi Thân Khôn, Dậu Đoài, Tuất Hợi Càn – `HL_CHI_QUAI`) và xếp bậc theo lyso.vn: đủ ba / có Hóa công / đủ hai nguyên khí / một nguyên khí / không có. Trả thêm `bac`.
- **Mười thể cách tốt** ("Quý mệnh thập cát thể", `hlThapCat_` → `luan.thapCat`): tên quẻ, hào vị, hào nguyên đường, đắc thời (quẻ tiêu tức `HL_BICH_QUAI`), hữu viện, số thuận thời (Thiên số/25 so Địa số/30 theo tháng âm – dương), đắc thể (quái chứa nguyên đường sinh/đồng hành mạng nạp âm), đáng vị, hợp lý (quái của can năm có mặt và hợp mùa), chúng tông. Đếm số cách → bậc. Tab Hà Lạc có khung "Mười thể cách tốt của mệnh"; văn dễ hiểu thêm đoạn "Nền mệnh bẩm sinh".
- **Điều hậu 10 can × 12 tháng** (BatTuPhanTich.gs › `BTP_DIEU_HAU`, `dungThan.dieuHauBang`): thêm vào danh sách phương pháp chọn dụng thần (chỉ tham khảo, không đổi dụng thần ức phù); xét can điều hậu thấu, tàng hay chưa có. Văn dễ hiểu Bát Tự thêm đoạn "Khí hậu của lá số" (cùng ngưỡng 8% với đoạn "Cán cân ngũ hành" để hai đoạn không mâu thuẫn).
- Kiểm thử: ha-lac 8401, bat-tu 4008, cai-dat 79. Mã giao diện `2026.10.22.4`.

## Còn khác nhau giữa các nguồn / chưa làm
- **Hóa công**: mã đang dùng hành vượng theo mùa (Xuân Chấn Tốn, Hạ Ly, Thu Càn Đoài, Đông Khảm, tứ quý Khôn Cấn); hocvienlyso dùng bốn quái chính theo phân – chí (Khảm từ Đông chí, Chấn từ Xuân phân, Ly từ Hạ chí, Đoài từ Thu phân). Chưa đổi – chờ chủ dự án chọn hoặc tìm sách Học Năng / Hoàng Tuấn.
- **384 lời hào** (thể cách số 3) chưa có kho – đang chấm theo cát – hung quẻ + vị hào.
- Lưu niên Hà Lạc (quy tắc năm trong vận hào dương 9 năm / âm 6 năm) có nhiều dị bản – giữ cách cũ.
- Ý tưởng tiếp: luận 60 nhật trụ (Tứ Trụ), lưu nguyệt Hà Lạc.
