# KPI Soát đổi định mức 22-10

Nhóm: KPI · Cập nhật 22/10/2026
Liên quan: [[KPI Phân tích định mức]] · [[KPI Tăng tốc đợt 2 (21-10)]] · [[KPI Kiểm thử]] · [[Việc chờ chủ dự án]]

## Chủ dự án báo 22/10
"Một số công đoạn đã đổi định mức nhưng bảng KPI vẫn tính có vẻ không đúng" – nhờ tự soát NhatKyThaoTac và phần liên quan.

## Soát sheet thật (tải 22/10 chiều, bản ở scratchpad `dl2/`, không commit)
- Đổi định mức hàng loạt 19/10 (~33 công đoạn) và 22/10 9:10 (~20 công đoạn); Cân Phôi 22/10: 265 → 300 → 350.
- DinhMuc khớp giá trị mới của nhật ký thao tác; không trùng MaCD; HieuLucTu 01/10 (bản 21/10 đã lên + đã chạy AP_DINH_MUC_CA_THANG); LichSuDinhMuc chỉ còn đoạn tới 30/09.
- 6 tên công đoạn trùng nhau (1 cái "Ngừng" + 1 đang dùng, hoặc khác xưởng: "Cắt Phôi" HT-CAT / XPT-CP-CPCN) – đổi đúng mã đang dùng, không gây lỗi.
- 22/10 10:14 chủ dự án bấm **Chốt KPI tháng 10 giữa tháng** (157 người). Vô hại: tháng đang làm luôn tính trực tiếp; 9h sáng hôm sau snapshot tạm ghi đè; ngày làm việc thứ 3 tháng 11 chốt lại chính thức.
- Máy chủ đúng: tính lại tháng 10 bằng Code.gs hiện tại = bản chốt 10:14 (157/157). Phân tích định mức: các công đoạn vừa đổi đều ~85%, trungViKy = trungVi.
- **Cân Phôi – Phân Loại Phôi** vẫn ~102% dù 180 → 350: 2 người (C030, C410) chỉ dành 9–12% giờ chuẩn cho công đoạn này → "công đoạn phụ", hiệu suất do Đổ FOAM Chuôi / Vệ Sinh Ren quyết định. Gợi ý trả lại định mức cũ (180) – chờ chủ dự án.

## Lỗi tìm ra và đã sửa
1. **`kpi()` phía trình duyệt lệch Bảng KPI (149/157 người)**: cộng dồn mọi nhật ký trong máy (từ đầu tháng trước, `mocGuiVe_`) + thiếu quy tắc máy chủ (ngày đi làm không khai, nghỉ dài hạn, lỗi KCS, vi phạm theo tháng, trọng số theo kỳ). Dùng ở KPI cá nhân, cột KPI Nhân sự, hồ sơ, "dưới 80%" Tổng quan, Rhino, pháo giấy.
   → mục 30 `kpi-app/tests/kpi-may/` (`kpi-may.js`): `taiKPIMay()` lặng lẽ gọi `layKPIKy` tháng này khi mở dash / ns / kpica (tối đa 5 phút/lần, `reload()` làm mới), `kpi()` trả đúng số máy chủ (`may:true`); chưa có thì `kpiThangNay_` tính tạm chỉ nhật ký tháng này; số đổi thì vẽ lại tab (không vẽ khi đang sửa ô / đang mở khung chia đôi ở Nhân sự).
2. **Lời nhắc "Chốt bù tháng này" (21/10) sai**: Bảng KPI tháng đang làm không đọc bản chốt → `nhacChotBuDM_` nay chỉ thêm "Bảng KPI tháng này tự tính lại…"; tab phân tích bỏ cảnh báo "đã chốt". Có thể chính lời nhắc này làm chủ dự án bấm chốt tháng 10.

## Kiểm thử
- `tests/kpi-may-web.js` 6 (bản xem thử dữ liệu 22/10): 157/157 người khớp, cột Nhân sự vẽ lại, KPI cá nhân CN = Bảng KPI.
- `tests/dinh-muc.js` 26 (mục 3 sửa: tháng đã bấm chốt vẫn tính lại ngay, không nhắc Chốt bù).

## Vì sao vẫn có KPI tổng ≥ 90 (chủ dự án hỏi 22/10 chiều, dữ liệu tải lúc đó)
- 16/157 người ≥ 90. Trọng số T10: SL 70 · CL 20 · TT 5 · AT 5 (trần 500). CL/TT/AT gần như ai cũng 100 → SL 85 cho KPI tổng 89,5; chỉ cần SL ≥ 85,7 là ≥ 90. Mốc 85% là của **hiệu suất sản lượng**, không phải KPI tổng.
- Trung vị = người ở giữa: định mức "về 85%" nghĩa là một nửa số người làm công đoạn đó trên 85. Người ≥ 90 đều làm nhanh hơn hẳn đồng nghiệp cùng công đoạn (vd. Phủ Bóng Bề Mặt Gậy: 1 người 92 cái/ngày, 5 người còn lại 14–50; Ráp-Máy-Chuôi: 409 vs 257–296).
- Toàn nhà máy thực ra **thấp hơn** 85: trung vị SL 71,5, KPI tổng 80,1 – vì KPI tính cả ngày đi làm không khai sản lượng (~2.984 giờ, phân tích định mức không tính các ngày này; bỏ ra thì trung vị SL 78,3), công đoạn dưới mốc không hạ, vài người SL 0 cả tháng (152 giờ).
- Mã tính đúng: tính lại = Bảng KPI. Chưa sửa gì – báo chủ dự án.
