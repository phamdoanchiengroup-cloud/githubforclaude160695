# TCC Tử Vi đối chiếu các phái

Nhóm: Thiên Cơ Các · Tạo 21/10/2026
Liên quan: [[TCC Sáu hệ]] · [[TCC Lập lá số và bốn tầng luận]] · [[TCC Giao diện]] · [[Việc chờ chủ dự án]]

## Yêu cầu của chủ dự án (21/10)
- Nghiên cứu cách luận Tử Vi trên aituvi.com và các trang tương tự (trong nước + nước ngoài), lập lá số giả định, học rồi đưa vào Thiên Cơ Các.
- **Ưu tiên số 1 là phương pháp luận giải** ("chất lượng của toàn bộ web nằm ở phần đó"); giao diện xử lý sau.
- Không đăng nhập tài khoản của chủ dự án trên trang khác (bộ an toàn chặn; không nhận mật khẩu qua chat). Chỉ xem phần miễn phí, không lách lớp khóa trả phí, không lách chặn bot.

## Đã khảo sát (21/10)
| Trang | Phái / cách luận | Điều học được |
|---|---|---|
| aituvi.com (Horus AI, VN) | Chỉ Tử Vi; văn do AI viết theo khung cố định | Khung tổng quan miễn phí: mở bài → Mệnh chính tinh + miếu hãm → bộ sao tam hợp (Cơ Nguyệt Đồng Lương, Âm Dương Lương…) → **"mẫu người" vòng Thái Tuế** (Tuế Hổ Phù, Phù Dương Đức…) → Thân cư → điểm yếu (cung kém) → đại vận hiện tại → tiểu vận 3 năm → kết. Điểm 0–100 cho 12 cung + Thân + tổng, biểu đồ radar. Giá: 319k (12 cung + 10 đại vận + Cách cục), 1.450k (vận hạn), 1.999k (trọn bộ 14 chuyên đề); chuyên đề Cách cục 150 xu; trợ lý AI chat. Chưa có xem hợp hai người. |
| tuvi.cohoc.net (Tử Vi Cổ Học, VN) | 7 "cách xem": Phổ biến, Bắc phái, Nam phái, Tổng hợp, Phi tinh, Tạp luận, Trung châu | Chặn trình duyệt tự động (ua-limit) – không lách. Bài về phương pháp phái Thiên Lương dùng vòng Thái Tuế. |
| Tian Qi – masterseanchan.com (Singapore) | Bát Tự + Tử Vi + Kỳ Môn + Chiêm tinh phương Tây, đối chiếu chéo | Cùng triết lý "nhiều hệ, chỗ đồng thuận thì chắc, chỗ kéo ngược thì nêu ra" như Thiên Cơ Các. Bảng chỉ số đầu trang (thanh vượng – nhược, 3 dấu ✓/✗ đắc lệnh – đắc địa – đắc thế, chip dụng/hỷ/kỵ/cừu/nhàn thần), công tắc lớp Thần sát / Hình xung hợp, mồi "Năm 2027 của bạn" không cần giờ sinh. |
| ziwei.pub (dùng iztro, Trung Quốc) | Tam hợp + Phi tinh; có Bát Tự, Mai Hoa, Kỳ Môn | Công cụ "Tìm giờ sinh" bằng câu hỏi, trang thống kê sao, hỏi đáp AI. iztro có `isOriginalPalace` (Lai Nhân cung), `fliesTo`, `selfMutaged`, giáp cung. |
| lichngaytot.com, yeutuvi.com (VN) | Luận chung theo năm sinh | Ít giá trị cho luận cá nhân. |

## Phương pháp đã đúc kết và đưa vào app (`TuViTamPhap.gs`, 21/10)
- **Ba vòng nhân sinh** (phái Thiên Lương – "Tử Vi Nghiệm Lý"; Tử Vi Chân Cơ):
  - Vòng Thái Tuế = thế đứng, gồm 4 nhóm tam hợp: Tuế–Hổ–Phù chính danh, Dương–Phù–Đức lanh lợi, Tang–Phá–Điếu đấu tranh, Âm–Long–Trực nhẫn nại.
  - Vòng Lộc Tồn (Bác Sĩ) = thực lực, 4 nhóm.
  - Vòng Tràng Sinh = nhịp thịnh suy, 4 nhóm.
  - `TP_TT_NHOM`, `TP_LT_NHOM`, `TP_TS_NHOM`, `tpBaVong_`.
- **Tám thế Mệnh – Thân** so với hành tam hợp của Thái Tuế (`tpTheMenhThan_`; quân tử chính danh, lời cứng việc ngay, nghĩ hay hơn làm…). Ngoài 8 thế thì luận từng vế.
- **Mệnh – Di** luôn đối nhóm (Tuế ↔ Tang, Dương ↔ Âm): `TP_MENH_DI`.
- **Tuế Lộc**: Lộc Tồn nằm trong tam hợp Thái Tuế thì có thực lộc suốt đời; nếu không, liệt kê các đại vận đi qua tam hợp Lộc Tồn.
- **Đại vận "đắc thời"** (`vanThaiTue`): đại vận nằm ở tam hợp Thái Tuế.
  - Tại Thái Tuế: chính đáng. Tại Quan Phù: nhờ tính toán. Tại Bạch Hổ: vất vả.
  - Các nhóm khác có lời riêng, kèm tiền bạc theo vòng Lộc Tồn.
  - Chỉ hiện đến 90 tuổi.
- **Phi Tinh** (`tpPhiTinh_`; phái Đài Loan hiện đại, cổ thư ít ghi): **tham khảo, không cộng điểm**.
  - Lai Nhân cung: can cung = can năm, bỏ Tý/Sửu. Khớp iztro trên 119 lá số.
  - Tự hóa 12 cung.
  - Mệnh phi Lộc/Kỵ; cung khác phi Lộc/Kỵ nhập Mệnh; Kỵ nhập Thiên Di (xung Mệnh); Tài Bạch/Quan Lộc phi Kỵ.
- **Kết quả:** `chiTiet.tamPhap` = { baVong { de, ky, menh, the, tueLoc }, vanThaiTue, phiTinh, coSo }, gọi từ `LuanGiai.gs › luanChiTiet` (có `typeof`).
  - Văn `de` không nêu tên sao; tên sao chỉ ở `ky`.
  - Lưu ý: "Phúc Đức" vừa là tên cung vừa là tên sao.
- **Giao diện:** tab Tử Vi thêm **Phần 2 "Thế đứng & nguồn cội"** (`Script.html › tamPhapHtml`, CSS `.tp-van`).
  - Các phần sau lùi số: 12 cung = 3, Tử Vi × Bát Tự = 4, Vận hạn = 5.
  - PDF lấy `tvp-1`, `tvp-2`, `tvp-4`.
  - Phiên bản giao diện 2026.10.13.
- **Cài đặt:** `HAM_CAN_CO` thêm `TuViTamPhap.gs: tpLap_`; `BAN_MOI_CAN_CO` thêm `LuanGiai.gs: [luanChiTiet, tpLap_]`; 27 file .gs.
- **Kiểm thử:** `tests/tam-phap.js` (14.659 kiểm tra trên 300 lá số + đối chiếu iztro).

## Ý tưởng chưa làm (chờ chủ dự án)
- **Trình tự tổng quan kiểu aituvi:** viết lại mở đầu Phần 1 thành một bài liền mạch: Mệnh → bộ sao tam hợp → thế đứng → Thân → điểm yếu → vận hiện tại → 3 năm tới.
- **Giao diện:**
  - điểm 0–100 + biểu đồ radar 12 cung;
  - thanh tab theo thang thời gian (Lá số / Luận cung / Đại vận / Tiểu vận / Nguyệt vận / Nhật vận / Chuyên đề);
  - bảng chỉ số đầu tab Bát Tự kiểu Tian Qi.
- **Chuyên đề bán lẻ** (aituvi có 14 chuyên đề, Cách cục 150 xu).
- **Trợ lý AI hỏi đáp về lá số:** cần khóa API và chi phí – hỏi chủ dự án.
- **Mồi "Năm 2027 của bạn"** không cần giờ sinh.
- Phái Trung Châu (tinh hệ, sát diệu) và Kỳ Môn: chưa nghiên cứu sâu.


## Luận theo trình tự 26 bước (24/10/2026)
- Chủ dự án gửi trình tự luận 26 bước (can chi năm → mệnh/cục/mùa/mệnh tinh → khí chất → tinh hệ Tử Vi → chính tinh → cung Thân → tứ sinh/mộ/chính → Phúc → vòng Thái Tuế/Lộc Tồn/Tràng Sinh → lục cát/sát/quý → tứ đức → Tuần Triệt → không vong → 7 chủ đề đời sống → đại/tiểu vận, năm xung, tam tai).
- Làm ở file mới `TuViTrinhTu.gs` › `tuviTrinhTu(tv, chiTiet)` → `chiTiet.trinhTu = { nhom, buoc[26] {so, ten, de, ky, huong} }` (gọi trong `lapLaSoDayDu_`). Giao diện: Script › `trinhTuHtml`, Phần 2 tab Tử Vi; PDF chương Tử Vi. CSS `.tt26-*`.
- Chỉ đọc sao đã an, không an lại. Văn `de` không nêu tên sao; `ky` ghi căn cứ. Đã thử 40 lá số: đủ 26 bước, không lỗi.
- Tránh chữ nặng nề của bản gốc ("dâm đãng", "tuyệt tự", "nghèo hèn") → "đa tình/muộn duyên", "muộn hay ít con", "lúc thiếu hụt"; bước sức khỏe luôn kèm "lá số không thay lời bác sĩ".
