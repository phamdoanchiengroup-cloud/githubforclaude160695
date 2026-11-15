# KPI Học hỏi ERPNext (16-11)

Liên quan: [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]] · [[KPI Phân tích định mức]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

Chủ dự án hỏi (16/11): nghiên cứu ERP (ERPNext, `frappe/erpnext`, 41k sao) xem phần nào áp dụng được cho web KPI. Claude đọc phân hệ sản xuất (`erpnext/manufacturing`: doctype + report).

## ERPNext có gì – web mình đã có tương đương
- Routing / Operation / BOM theo mã → Quy trình sản xuất, cấu hình bán thành phẩm từng mã, Cấu hình gậy.
- Work Order + Job Card (SL xong từng công đoạn, người làm, trạng thái) → tab Đơn hàng giao nhận theo bộ phận + nhật ký sản lượng công nhân.
- Corrective Job Card (làm lại) → cột "Hỏng cần làm bù".
- Production Plan / capacity → Công suất & deadline, Thử nhận đơn, Ngày dự kiến xong, bậc ưu tiên.
- Workstation + Plant Floor → Sơ đồ nhà máy, bảo trì máy. BOM operations time / variance → Phân tích định mức.

## Đề xuất học (chờ chủ dự án chọn)
1. **Báo cáo hàng hỏng + chi phí làm lại** (Process Loss Report + Cost of Poor Quality): từ cột Hỏng cần làm bù → tỷ lệ hỏng theo bộ phận / dòng gậy / vật liệu, quy ra giờ công làm lại theo định mức. Dữ liệu có sẵn.
2. **Hạn chuẩn từng bộ phận lùi từ deadline đơn** (Job Card expected start/end, scheduling): mỗi bộ phận có "hạn phải giao" gợi ý; hẹn trễ hơn → cảnh báo sớm. Cần số ngày chuẩn mỗi bộ phận (Claude ước từ dữ liệu, chủ dự án duyệt).
3. **Dự báo lượng đơn theo kênh** (Sales Forecast / Exponential Smoothing) → chuẩn bị công suất, phôi tháng tới.
4. (Sau) Nhu cầu phôi / vật tư theo đơn (MRP) – cần định mức vật tư từng mã.

## Không áp dụng
- Giờ dừng máy (Downtime Entry) – chủ dự án đã chốt **không làm A3** (18/10).
- Kiểm tra chất lượng KCS (Quality Inspection) – **chưa có KCS** (A5).
- Kế toán, kho nhiều vị trí, số lô / serial, đơn giá giờ máy: ngoài phạm vi web KPI.

## 16/11 – Chủ dự án chốt làm cả 3 phần + nghiên cứu BOM
- Trả lời: (1) làm cả 3; (2) báo cáo hỏng: TP/PP xem, mỗi người chỉ bộ phận mình, ban điều hành xem hết; (3) có email 8h báo bộ phận hẹn trễ hạn chuẩn; (4) đưa hỏng vào báo cáo tháng / PDF lãnh đạo; (5) nghiên cứu định mức nguyên vật liệu (BOM).
- Đã hỏi chuyên gia `quan-ly-van-hanh`. Góp ý chính:
  - Hỏng không có ngày → lưu hỏng vào bản chụp 9h, **hỏng phát sinh = max(0, nay − hôm trước)**, lưu lâu dài theo ngày. Giờ công làm lại = SL hỏng × Σ(8h ÷ định mức) các công đoạn từ đầu luồng tới bộ phận hỏng. Chỉ số: tỷ lệ hỏng = hỏng phát sinh ÷ SL giao; giờ công làm lại; Pareto bộ phận × dòng × vật liệu; xu hướng 3 tháng. Số hỏng do bộ phận tự khai → nên kiểm chéo.
  - Hạn chuẩn: lùi theo luồng từng mã, **ngày làm việc**; bảng số ngày chuẩn bộ phận × loại SKU do chủ duyệt (sau 2–3 tháng chỉnh theo thực tế); **một đệm chung trước Đóng gói** (1–2 ngày), không đệm từng bộ phận. Vàng = trễ hạn chuẩn trong đệm, đỏ = vượt đệm, đỏ đậm = trễ cả deadline; chưa hẹn mà còn ≤ 2 ngày tới hạn chuẩn cũng cảnh báo. Email chỉ dòng mới đỏ / vừa đổi, gom theo bộ phận.
  - Dự báo: trung bình trượt có trọng số 3 tháng (50/30/20) theo kênh, theo số SP từng loại SKU; khoảng thấp–cao; nhãn "tin cậy thấp" khi < 6 tháng; ghi sai số thực tế mỗi tháng. Tải = công cần (định mức) ÷ công có; > 85% vàng, > 100% đỏ.
  - BOM: chưa làm ngay; lộ trình: 5–8 vật tư chính, định mức tiêu hao theo nhóm SKU (loại × vật liệu) do tổ trưởng ước + kho kiểm, số xuất kho tháng; web tính nhu cầu (đơn mở + dự báo) và hao hụt.
  - Thứ tự: lưu hỏng vào bản chụp ngay → hạn chuẩn → báo cáo hỏng (khi có ~1 tháng số) → dự báo → BOM.
- **Đã làm (16/11)**: bản chụp 9h thêm cột 7 = 0 (dòng thường) + cột 8 = hỏng từng bộ phận; `dhChupMoi_`, `dhTinhHong_`, `dhGhiHong_` → sheet ẩn **DonHangHong** (Ngay, TuNgay, Khoa, BP, Moi, SL), chỉ tính khi cả 2 bản chụp là dạng mới. Kiểm thử giả lập 7/7.
- **Đã làm phần 2 (14/11 phiên mới) – hạn chuẩn bộ phận.** Chủ dự án chốt: (1) số ngày theo SL **từng dòng** (cách A); (2) Hoàn thiện ngọn tính lùi đủ 2 lượt, chỉ 1 hạn = hạn giao Đóng gói; (3) TP/PP chỉ thấy bộ phận mình, ban điều hành thấy hết, email gửi người đang nhận email 8h (chủ sở hữu); (4) bỏ dòng trễ deadline > 30 ngày; (5) bảng công suất mỗi bộ phận 1 số, Phôi tách chuôi / ngọn.
  - Máy chủ `don-hang.gs`: `dhHanChuan_` (lùi ngày làm việc `dhLuiNgayLam_`, `dhSoNgayLam_`, `dhNgayLamFn_`), `dhGanHanChuan_` gắn `o.hc` vào dữ liệu `layDonHangXuong`; công suất `dhCsBP_` lưu trong `DH_CONG_SUAT.bp` (`luuCongSuat` nhận `bp`); email 8h thêm mục `dhHanChuanEmail_` (chỉ dòng mới đỏ / đỏ đậm hoặc vừa đổi, gom theo bộ phận, nhớ ở thuộc tính `DH_HC_TRUOC`).
  - Mức: vàng = trễ ≤ 2 ngày làm, đỏ = trễ hơn, đỏ đậm = sau deadline; chưa hẹn: chỉ xét bộ phận đầu tiên chưa xong mỗi nhánh (có cột ĐANG Ở BP thì tính từ đó), quá hạn → xếp mức theo hôm nay, còn ≤ 2 ngày → "sắp".
  - Web `quy-trinh-web.html`: chip ở ô hẹn (`dhHCChip`), thẻ **Hạn chuẩn bộ phận** dưới "Trễ hẹn ở bộ phận" (`dhVeHanChuan`: đỏ đậm / đỏ / vàng / sắp + **% hẹn đúng hạn chuẩn**, bấm bộ phận ra danh sách nhóm theo khối SKU); ⚙ Công suất có 8 ô công suất bộ phận.
  - Kiểm thử: `tests/han-chuan.js` 22/22 (không cần DATA); giả lập trình duyệt 1360 + 390 px: không lỗi, không tràn, đúng quyền.
- **14/11 (sau) – Ngày dự kiến xong làm lại (chủ dự án chọn B + C, góp ý `quan-ly-van-hanh`).** Lý do: 3 bậc theo kênh đẩy đơn OEM/Kho trễ lùi mãi, cả nhà máy coi như 1 hàng đợi, không xét hàng đã tới bộ phận nào.
  - **2 làn công suất** mỗi bộ phận mỗi ngày: 30% Dealer + Web lẻ thường + Web lẻ custom + POD, 70% đơn khác; phần dư của 2 làn gom lại (làn lẻ dùng trước). Trong làn: thử đẩy → dòng ưu tiên → deadline sớm.
  - **Hạn ngầm đơn lẻ** (Web lẻ, POD) không ghi deadline = ngày đặt (theo mã đơn) + 10 ngày lịch (`dhDlNgam` web, `dhDlNgam_` máy chủ – dùng cả cho hạn chuẩn); không ngày đặt thì không có hạn ngầm (không lấy "hôm nay + 10" – chuyên gia: hạn sẽ trôi mãi). Không tính vào thống kê trễ; có chỉ số riêng "đơn lẻ quá 10 ngày".
  - **Mô phỏng từng ngày qua từng bộ phận** (`dhSimDong`, `dhMoPhong`): chuôi Phôi chuôi → Sơn → UV → HT; ngọn Phôi ngọn → Taro → HT lượt 1 (chỉ tính thời gian) → Làm đầu → HT; rồi Đóng gói; bắt đầu từ số lũy kế trong Sheet + cột ĐANG Ở BP; hàng xong ở bộ phận trước sang ngày sau; không làm tròn từng bộ phận. Hoàn thiện 310 riêng nhánh chuôi + 310 nhánh ngọn (1 gậy = 1 sp).
  - **Trễ > 30 ngày** chưa đặt Hạn mới: không xếp lịch, nhóm "chờ kênh đặt hạn mới"; đặt hạn mới (cột Hạn mới HT đơn cũ) thì tự vào lại.
  - **2 ngày dự kiến**: theo công suất ⚙ và theo **công suất Đóng gói thực đo** = trung vị 10 ngày làm gần nhất có số (`dhCsDo_`, nhớ tạm 3 giờ, < 5 ngày thì không dùng).
  - Kiểm thử: `tests/hai-lan-web.js` 11/11, `tests/han-chuan.js` 27/27; 1.500 dòng tính 0,17 giây.
- **15/11 chiều: XONG phần 3 – Dự báo đơn tháng tới** – [[KPI Gậy 1 khúc, ưu tiên và nhập nhanh (15-11)]].
- **Còn làm**: phần 1 (báo cáo hỏng – khi DonHangHong đủ ~1 tháng), BOM (chủ dự án chưa có dữ liệu vật tư).
