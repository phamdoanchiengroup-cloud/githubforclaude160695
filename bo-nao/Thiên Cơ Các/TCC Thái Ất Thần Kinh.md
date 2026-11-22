# TCC Thái Ất Thần Kinh

Liên quan: [[TCC Kỳ Môn Độn Giáp]] · [[Quyết định của chủ dự án]] · [[TCC Kiểm thử]] · [[00 Mục lục]]

## Nghiên cứu (21/11)
- Đề xuất: `nghien-cuu/thai-at/00-de-xuat.md`. Nguồn: kintaiyi (kentang2017, MIT) – đọc thuật toán; Thái Ất Kim Kính Thức Kinh (Wikisource, công cộng); tianyugong.com/taiyi. Sách tiếng Việt còn bản quyền – chưa đọc.
- Phái Thống Tông: tích niên = 10.153.917 + năm dương lịch. Cục năm: 2024 dương 53, 2025 dương 54, 2026 dương 55, 2027 dương 56.
- Tự dựng lại bảng 72 cục của kintaiyi: Thủy Kích khớp 70/72, Chủ/Khách/Định toán 421/432 (chỗ lệch nghi lỗi gõ bảng kintaiyi) → lập trình theo quy tắc, không chép bảng.
- Không có trang nào công bố sẵn bàn 2024–2027 → đối chiếu chủ yếu với kintaiyi.

## Quyết định chủ dự án (21/11)
- 4 phạm vi; mục riêng cho mệnh pháp + hỏi việc theo giờ; vận năm cá nhân ghép vào trang Năm 2027; thời cuộc chung miễn phí.
- Combo hỏi việc 2 môn (Kỳ Môn + Thái Ất) 19 xu; mỗi môn lẻ 9 xu.
- Các điểm chưa chắc theo đề xuất (ranh năm Lập xuân, đại tướng theo Kim Kính, cung kề thật, mệnh pháp dùng bàn Thời kế giờ sinh). Dương cửu / Bách lục để đợt sau.

## Bộ máy (21/11, xong)
- `ThaiAt.gs` (file .gs thứ 35, `HAM_CAN_CO`: `taLap_`): `taLap_({ke:'nam'|'thang'|'gio', …})` (Nhật kế chưa làm), `taBan_`, `taMenh_` (12 cung, doTinCay 'thap'), `taNamCaNhan_` (ghép của TCC), `taDanhGia_` (7 loại việc → thuan/thuan_dk/nen_cho, ngưỡng ~30/45/25%). Bảng TA_THAN (23 thần), TA_CACH.
- Đối chiếu kintaiyi 0.2.3 (MIT, chỉ cài trong venv máy kiểm thử; script `tools/thai-at/sinh-doi-chieu.py`): 1.232 ca, tích/cục/Thái Ất/Văn Xương… 100%; khác biệt đã biết K1–K10 (ranh Lập xuân vs Tết, tháng tiết vs tháng âm, lỗi jq/bảng của kintaiyi, Kế Thần âm độn khởi Thân, đại tướng toán 10/20/30/40 lấy 1, Ngũ Phúc/Đại Du/Tiểu Du). `tests/thai-at.js` 70.839/70.839, `tests/doi-chieu-thai-at.js` đạt.
- Quy ước tự chốt (đề xuất mục 4d): ô ngay trước cung Thái Ất là "bách nội"; ngoại = chiều thuận; 4 ô góc quy chi Cấn Dần/Tốn Tỵ/Khôn Thân/Càn Hợi; Nguyệt kế theo tháng tiết.

## Văn + bán + giao diện (21–22/11, xong, mã `2026.11.22.1`)
- `ThaiAtVan.gs` (file thứ 36): `taVanMenh_`, `taVanNam_`, `taVanThoiCuoc_` (không nêu nước/lãnh đạo/thiên tai), `taVanHoi_` (cùng khuôn kmVanLuan_). `tests/thai-at-van.js` 3.281/3.281 (không %, không tên thần ở phần dễ hiểu, không chữ Hán).
- Máy chủ (ThanhToan.gs mục THÁI ẤT): `thaiAtThoiCuoc()` miễn phí không token (cache `TAC_<năm>_<tháng>` 6 giờ); `thaiAtMenh(token, input)` khách xem tóm tắt (tkPhien_), `ta_menh` 19 xu theo lá số; `thaiAtHoi(token, loai, thoiDiem, vai)` + `ta_hoi` 9 xu; combo `hoi_2_mon` 15 xu (`ttGiaHoi2Mon_`: có một môn → 6), `ttMuaTaHoi_`, `ttMuaHoi2Mon_`; vận năm `r.thaiAtNam` qua `taGanNam_` (lapLaSo), cắt bằng `ttCatThaiAtNam_`. `tests/thai-at-hoi.js` 99/99.
- Rà mã: không lỗi nặng. Biết trước: đổi vai khi chưa mua thấy được mức của vai kia (không có lời luận).
- Giao diện (Script.html khối ta*): tab ☯ Thái Ất nhóm "Tôi", bàn 16 ô + giữa (Nam trên), 3 phần (bản đồ đời, hỏi việc + combo, thời cuộc 12 tháng); nút "Xem thêm góc nhìn Thái Ất" trong thẻ Kỳ Môn; khối năm ở trang Năm 2027 và tab Vận hạn.

## Còn mở
- Dương cửu / Bách lục hành hạn, Nhật kế (đợt sau). Holo.html NEN_TAB chưa có khóa `ta`.
- Sách tiếng Việt và phần mềm quen dùng của chủ dự án để dò tay vài ca (chưa có).
