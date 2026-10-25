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


## Tab "👑 Lá số chủ sở hữu" (25/10/2026, mã 2026.10.25.2)
- Yêu cầu: tìm thêm nguồn về luận theo bộ sao (chính tinh + phụ tinh), sao hạn đại vận (Thiên Không, Thiên Thương), cách tính dương thọ; đặt ở tab riêng chỉ chủ sở hữu thấy.
- Nguồn tra (WebSearch; trang tiếng Việt nhiều bài chất lượng thấp nên dựa thêm nguồn Trung): Toàn thư quyển 2 "An Thiên Thương Thiên Sứ quyết"; Lưu Uẩn Linh (ziweishuyuan.com) – Thương = việc hình thành, Sứ = phải có kết quả, cách 3 ô ≈ 3 năm, đại vận thứ 6 chắc chắn qua một trong hai; shenjige.cn – Thương Sứ kẹp Thiên Di, chính tinh Cự/Cơ/Tham/Liêm/Phá hãm + sát + Kỵ là nặng nhất; kabala.vn – sao giải Tử Phủ Lương Đồng, Khoa Lộc Tả Hữu; Trung Châu – xem thọ bằng Tật Ách + Mệnh + Phúc Đức ("thọ nguyên"); dushu.com + tianjiyao – điều kiện ~60 cách cục, cách tốt bị sát phá, cách xấu gặp cát giải. Danh sách nằm trong `TVCS_NGUON` và hiện ở cuối tab.
- Mã: `TuViChuyenSau.gs` (file .gs thứ 29). `tuViChuSoHuu(input, token)` – `tkCan_(token, true)` chặn người không phải chủ; `tvcsLap_(tv)` = { boSao, daiVan, tho, nguon }.
  - `TVCS_BO_SAO` ~80 bộ: điều kiện `d` (đồng cung, chính tinh mượn cung xung khi VCD), `h` (tam phương tứ chính), `g` (giáp), `mot/motH`, `chi`, `o` (chỉ xét ở cung nào – cho các bộ phụ tinh luôn đứng tam hợp nhau như Hình Riêu Y, Thai Cáo, Tang Hổ; đã bỏ "Kình Đà giáp" vì luôn kẹp Lộc Tồn), `kc`. Mỗi bộ có câu phú `cau`, ý `y`, hướng `huong`.
  - `tvcsDaiVan_`: trọng số sao hạn `TVCS_HAN_W` (đồng cung đủ, chiếu ×0,4), vận ở Nô/Tật/Thiên Di, chính tinh hãm ở đó, giáp Kình Đà/Không Kiếp/Hỏa Linh, Dương Đà giáp Kỵ, Hóa Kỵ – Hóa Lộc theo can cung vận, sao giải, Tuần Triệt ×0,85, bộ nặng (Linh Xương Đà Vũ, Song Không…). Mức: <1,5 Êm, <3,5 Cần để ý, <6 Nặng, còn lại Rất nặng (300 lá số: 27% / 44% / 26% / 3%). Năm hệ trọng: đại tiểu hạn mỗi bên một sao Thương/Sứ, tiểu hạn có sát vào Nô/Tật/Di giữa vận nặng, Thái Tuế đóng cung Thương/Sứ khi vận ở đó, tiểu hạn gặp Thiên Không + Không/Kiếp, Kỵ + sát.
  - `tvcsTho_`: cộng/trừ theo chính tinh sáng/hãm, sao thọ – sao giải, sát tinh, Tuần Triệt, vòng Tràng Sinh ở Mệnh – Phúc – Tật; Cục sinh/khắc Mệnh; Thân cư Phúc. Mức Dồi dào / Khá / Vừa / Cần giữ gìn + các vận Nặng làm "giai đoạn nên chăm lo sức khỏe". Không đoán tuổi mất (kiểm thử chặn các chữ "tử vong, chết, qua đời…").
- Giao diện: nút tab `data-tab="chu"` (ẩn, `capNhatUser` chỉ hiện khi `vaiTro === 'chu'`), trang `#page-chu`; Script › `veChu`, `chuHtml`, bộ nhớ `CHU` theo `state.input`; CSS `.tab-chu`, `.chu-*`. `HAM_CAN_CO` thêm `TuViChuyenSau.gs: tuViChuSoHuu`. Kiểm thử `tests/chuyen-sau.js`.
- Có thể làm tiếp: lưu niên từng năm (lưu Kình Đà, lưu Kỵ) cho tab này; cho chủ sở hữu chỉnh trọng số; đưa tab vào PDF riêng.

## Tab "📚 Tham khảo" – Nghề nghiệp & Thư viện bộ sao (25/10 khuya, mã 2026.10.25.5)
- Chủ dự án chọn (hỏi bằng câu hỏi lựa chọn): đặt trong tab Tham khảo chung, bảng tra + đối chiếu lá số, mở cho mọi người, thêm thư viện bộ sao.
- Dữ liệu: `TuViChuyenSau.gs › TVCS_NGHE` (47 nghề, 10 nhóm; mỗi nghề 5–8 sao {ten, cung[Mệnh|Quan Lộc|Tài Bạch|Thiên Di|Phúc Đức], w 1–3}, câu `y` không tên sao, `nguon`). Chuyên gia `content-creator` soạn từ muaban.net (14 chính tinh ở Quan Lộc), mytour.vn (phụ tinh gắn nghề), masterseanchan.com (tính chất 14 chính tinh), toutiao. Nghề suy từ tính chất sao (không nguồn nói thẳng): lập trình, dữ liệu – AI, KOL, chứng khoán, nhân sự, tâm lý trị liệu, nông nghiệp (yếu nhất).
- Nguồn lệch nhau: Tử Vi ở Quan Lộc (muaban: việc độc lập; các nguồn khác: lãnh đạo) – theo số đông; Thất Sát (không gán giáo dục); Thái Dương, Cự Môn, Thiên Lương, Thái Âm mỗi nguồn nhấn một hướng; nhiều nguồn chỉ nói nghề theo tổ hợp → chấm cộng dồn nhiều sao.
- API công khai `thamKhaoTuVi()` → { boSao (TVCS_BO_SAO + điều kiện bằng lời `tvcsDieuKien_`, `TVCS_DK_THEM`), nghe, nguon }.
- Client: tab `que64` đổi tên "📚 Tham khảo"; `tkVe` dựng thanh `#tkTabs` (64 / nghe / bo) + `#tkNoi` (kdVeTab vẽ vào đây); `tkSaoCung` (VCD mượn cung xung), `tkKhop` = Σw trùng / Σw → "Rất khớp ≥0,6 / Khớp ≥0,35 / Khớp một phần", cần ≥2 sao trùng, top 8; `tkLoc` lọc theo chữ, nhóm, loại. CSS `.tk-*`.

## 26 bước thành bài luận chính (25/10 đêm, mã 2026.10.25.6)
- Chủ dự án hỏi vì sao luận giải không dùng thư viện bộ sao và 26 bước sơ sài; chọn: 26 bước là bài luận chính, bộ sao vào từng bước, mỗi bước dài như sách, bước 26 dùng sao hạn viết nhẹ nhàng.
- Máy chủ: `TuViTrinhTu.gs › TT_GOP` gắn `gop` cho 16 bước ({cung[], tp[], than, tongQuan, cachCuc, vanThaiTue, saoHan}); 12 cung mỗi cung gộp đúng một lần (Phúc Đức + Phụ Mẫu + Huynh Đệ ở bước 9; Tài Bạch + Điền Trạch ở bước 20; Nô Bộc ở bước 25). `Code.gs › lapLaSoDayDu_` thêm `chiTiet.boSao` (`tvcsBoSaoCong_`, lời dễ hiểu `TVCS_BO_SAO_DE` – 83 bộ do content-creator viết, không tên sao) và `chiTiet.saoHan` (`tvcsSaoHanCong_`: nhãn "những điều cần phòng" `TVCS_MUC_CONG` – khác điểm tốt/xấu chung của vận để hai tầng không mâu thuẫn; lời `TVCS_HAN_DE`, `TVCS_KHUYEN_CONG`). `ThanhToan.gs › ttCatPhan_` cắt saoHan của vận chưa mở còn khung. `BAN_MOI_CAN_CO`: Code `tvcsBoSaoCong_`, TuViTrinhTu `TT_GOP`, TuViChuyenSau `TVCS_NGHE`.
- Giao diện: `trinhTuHtml(T, res)` + `ttBoSaoHtml`, `phiTinhHtml` (Phi Tinh thành phụ lục cuối); renderLuan khi có trinhTu: Chân dung (chỉ số + dải điểm 12 cung trỏ `tvc-i` trong bước) → 26 bước → Tử Vi × Bát Tự → Vận hạn. PDF giữ như cũ (26 bước ngắn + 12 cung).
- Kiểm thử `tests/chuyen-sau.js` 35.393 (thêm: bộ sao/sao hạn công khai không tên sao, 26 bước 16 bước gộp, 12 cung gộp đủ, khách bị cắt saoHan).
- Còn sót: văn 12 cung cũ (TuViHeThong / sinhVanCungMenh_) có chỗ nêu tên sao trong phần dễ hiểu.
