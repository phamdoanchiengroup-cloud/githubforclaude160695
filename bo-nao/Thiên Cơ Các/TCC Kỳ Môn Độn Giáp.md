# TCC Kỳ Môn Độn Giáp

Nhóm: Thiên Cơ Các · Cập nhật 21/11/2026
Liên quan: [[TCC Rà soát toàn bộ 11-2026]] · [[TCC Kiểm thử]] · [[Quyết định của chủ dự án]]

## Quyết định
- 21/11: chủ dự án chọn làm Kỳ Môn đợt 1 "Hỏi một việc" (9 xu) theo đề xuất `nghien-cuu/ky-mon/00-de-xuat.md` (product-manager). Đợt 2 "Giờ tốt – hướng tốt 7 ngày".

## Đợt 1a – bộ máy lập bàn (21/11, xong)
- File mới `tuvi-app/KyMon.gs` (file .gs thứ 33; `HAM_CAN_CO`: `kmLap_`). Chỉ hàm riêng, chưa có API công khai, chưa có văn luận, chưa có giao diện.
- `kmLap_({day, month, year, hour, minute})` giờ VN: Thời gia, chuyển bàn, Sách Bổ (nguyên theo phù đầu), bảng `KM_CUC` 24 tiết × 3 nguyên; tiết khí tính riêng bằng VSOP87 rút gọn (`kmKinhDoMatTroi_`, `kmGiaoTiet_`, `kmTietKhiNam_`; lệch ≤ 0,62 phút so với lunar-javascript); giờ Tý muộn sang ngày sau (`chuanHoaThoiGian_`).
- Kết quả: độn, cục, nguyên, phù đầu, tuần thủ, trực phù, trực sử, tuần không (theo trụ giờ), mã tinh (theo chi giờ), 9 ô (địa bàn, thiên bàn, sao, cửa, thần).
- Lựa chọn phái: ô giữa gửi cung 2; 8 thần giữ nguyên khi âm độn; chưa làm Trí Nhuận, Mao Sơn, phi bàn.
- Kiểm thử `tests/ky-mon.js` 33.723/33.723 trên 2.704 thời điểm, đối chiếu 3meta@2.6.0 + bigfishmarquis-qimen@1.0.0 (MIT, chỉ dùng sinh kết quả mong đợi; script `tools/ky-mon/sinh-doi-chieu.js`). Khác biệt đã ghi: K1 múi giờ Bắc Kinh (3meta), K2 ô giữa lớp Người (3meta), K3 mã tinh Hợi Mão Mùi (3meta sai).
- Lập thu 2022: 19:29 giờ VN (đề xuất cũ ghi nhầm, đã sửa).

## Còn mở
- Cách cục: 13 cách chỉ có một nguồn – nên đối chiếu thêm trước khi quảng bá.
- Đợt 2: gói "Giờ tốt 7 ngày"; combo hỏi việc 2 môn với Thái Ất (19 xu).

## Đợt 1b – "Hỏi một việc" 9 xu (21/11, xong, mã `2026.11.21.1`)
- Bát Tự: `sunLongitudeDeg` (Lunar.gs) gọi `kmKinhDoMatTroi_` khi có → lệch tối đa 0,43 phút (trước 12,9 phút); 37.572 mốc quét quanh giờ giao tiết chỉ còn lệch đúng phút giao.
- API `kyMonHoi(token, loai, thoiDiem)`; phần bán `km_hoi` 9 xu qua `muaPhan` → `ttMuaKmHoi_` (mã `km_hoi:yyyymmddhh:loai`, MoKhoa cột 6 lưu thời điểm). `kmDanhGia_` chấm dụng thần → mức thuan/thuan_dk/nen_cho (ngưỡng chỉnh ~30/45/25%). `kmThoiDiem_(t, boPhamVi)`: chưa mua giới hạn 1 ngày trước–3 ngày tới, đã mua mở lại được.
- Văn: file mới `KyMonVan.gs` (`kmVanLuan_` → ketLuan, canCu, viec, luuY; bảng KMV_*), 34 file .gs.
- Phễu: sheet `SuKien`, `skGhi_`, `skLapLaSo_` (Cache, gần đúng; trang Năm 2027 gửi `khongDem`), `skMua_`, API chủ `qtPheu(token, soNgay)`.
- Rà mã: `ttKhoa_` flush trước khi nhả khóa; `skMua_` đọc lại tài khoản trước khi ghi; giới hạn 30 lượt/10 phút cả khi mua.
- Giao diện (Script.html `km*`): thẻ trong Tiện ích sau Gieo quẻ, bàn 9 ô Lạc Thư (Nam trên).
- Test: `tests/ky-mon-hoi.js` 98/98, `tests/pheu.js` 41/41, bao-mat 197/197; cả 28 file đạt.
