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
- `sunLongitudeDeg` cũ trong Lunar.gs (Bát Tự, Tiện ích dùng) lệch tới 13 phút so với lunar-javascript → trong ~13 phút quanh giờ giao tiết Bát Tự và Kỳ Môn có thể nhận khác tiết. Chờ chủ dự án quyết có chuyển Bát Tự sang hàm mới không.
- Đợt 1b: API công khai `kyMonHoi` + phần bán `km_hoi` 9 xu + văn luận 7 loại việc (content-creator) + giao diện (frontend-developer) + rà (code-reviewer).
