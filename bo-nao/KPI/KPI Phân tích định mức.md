# KPI Phân tích định mức

Nhóm: KPI · Cập nhật 21/10/2026
Liên quan: [[KPI Tổng quan và cách dựng]] · [[KPI Kiểm thử]] · [[Quyết định của chủ dự án]] · [[KPI Bảo mật và vận hành]]

## Chủ dự án hỏi 21/10
- "Đưa toàn bộ gợi ý thay đổi để về định mức 85%".
- **Bỏ gợi ý hạ định mức chặt** – có thể đang đào tạo nhân viên mới (chủ dự án nhắc lại 21/10, đã nói từ trước).
- "Sửa định mức theo gợi ý, phân tích lại vẫn ra hiệu suất trên 100%, vấn đề là gì?"
- Chốt: **đổi định mức thì toàn bộ sản lượng tháng đó tính theo định mức mới**, **kể cả tháng đã chốt**.

## Nguyên nhân >100% sau khi áp gợi ý
1. Từ 18/10 (A1) định mức áp **theo ngày** (sheet `LichSuDinhMuc`): các ngày trước hôm đổi vẫn tính định mức cũ, phân tích cũng dùng định mức từng ngày.
2. Giờ có mặt của một ngày chia cho các công đoạn theo tỷ lệ giờ chuẩn → hiệu suất một công đoạn = hiệu suất **cả ngày** của người đó. Gợi ý cũ "định mức × trung vị / 85" bỏ qua việc các công đoạn làm cùng ngày kéo nhau.

## Đã làm (máy chủ: mục vá `kpi-app/tests/dinh-muc/va-dinh-muc.py` + `dinh-muc.gs`, cuối `va-code.py`)
- `ngayApDM_()` = ngày 1 tháng hiện tại, luôn luôn (kể cả tháng đã chốt).
- `luuLichSuDM_` (hook `suaO_('DinhMuc','DinhMucGio')`): `catLichSuDM_(maCD, ngày 1)` cắt / xóa đoạn lịch sử trùng tháng này; định mức cũ chỉ lưu tới hết ngày cuối tháng trước. Cả 12 chỗ ghi `HieuLucTu` (6 hàm × 2 dạng) dùng `ngayApDM_()`.
- (22/10 bỏ – xem [[KPI Soát đổi định mức 22-10]]) `nhacChotBuDM_(msg)`: tháng này đã chốt chính thức (`daChotChinhThuc_`) thì thêm câu nhắc bấm "Chốt bù tháng này". Gắn vào lời báo của duyetDeXuat, duyetTatCaDeXuat, luuDinhMuc, suaCongDoan (khi có đổi định mức), banDieuHanhSuaDinhMuc, banDieuHanhSuaDinhMucNhieu.
- `AP_DINH_MUC_CA_THANG()` – chạy tay 1 lần sau khi dán: cắt mọi đoạn LichSuDinhMuc trùng tháng này (34 công đoạn trên dữ liệu thật). Chặn gọi từ web (bao-mat.js: 38 hàm viết hoa).
- `phanTichDinhMucGoc_` mới (bản cũ đổi tên `phanTichDinhMucCu_`):
  - Hiệu suất tính theo **định mức đang dùng** cho mọi ngày (`trungVi`); vẫn trả `trungViKy` = theo định mức từng ngày như KPI.
  - **Chỉ nâng, không hạ**: khoảng dò định mức chặn dưới ở định mức đang dùng; giải ra không cần nâng thì giữ đúng số cũ (không làm tròn – lỗi 12,9 → 13).
  - **Giải chung** mọi công đoạn có dữ liệu: lặp, mỗi công đoạn chia đôi trên thang log để trung vị = 85, mỗi bước tối đa ×1,5, nửa bước (giảm dao động), chặn ×4 (`CHAN`).
  - Công đoạn phải đổi gần ×4 (`chamChan`, ≥×3,6) = **phụ thuộc** công đoạn chính cùng ngày → giữ định mức, giải lại phần còn lại; thử nhận lại từng công đoạn, nhận lại thì giải chung lần nữa.
  - Làm tròn `dmLamTron_` (≥20: 1; ≥5: 0,5; ≥2: 0,1; còn lại 0,05). Bỏ gợi ý nếu giữ định mức cũ vẫn trong ±3.
  - Trả mỗi công đoạn: dinhMuc, soCoData, trungVi, trungViKy, nhan (do/vang/nhe/sat/chat), itNguoi (<3 người), dmGoiY, chinh (%), trungViSau (dự kiến), phuThuoc; chung: apTu, daChot.
- Giao diện chỉ nâng: tóm tắt "N công đoạn nên nâng định mức", lọc mặc định ẩn công đoạn dưới mốc, nhãn "Dưới mốc — giữ" + ghi "không hạ định mức — có thể người mới đang đào tạo".
- Giao diện (mục 28 `va-dinh-muc-web.py` + `dinh-muc-web.js`, trước mục 27 chia đôi): tóm tắt nâng/hạ, báo áp cả tháng (vàng nếu tháng đã chốt), lọc "có gợi ý / tất cả", cột Gợi ý định mức + dự kiến, ghi chú công đoạn phụ / ít người / KPI đang tính khác; chọn sẵn **mọi** gợi ý (bỏ công đoạn ít người ra làm lệch lời giải chung); ô định mức `step="any"`; lời xác nhận "áp cho CẢ THÁNG …" + nhắc Chốt bù.

## Kết quả trên dữ liệu thật tháng 10
- 174 công đoạn: 19 gợi ý nâng, 2 công đoạn phụ để nguyên (bản đầu có cả hạ: 105 gợi ý – đã bỏ).
- Áp hết gợi ý → phân tích lại: công đoạn ≥3 người đã nâng đều 79–91%, không còn công đoạn ≥3 người >100%; KPI tháng 10 khớp số phân tích; KPI tháng 9 không đổi.

## Kiểm thử
- `tests/dinh-muc.js` 25 (DATA= dữ liệu thật) · `tests/dinh-muc-web.js` 15 (bản xem thử).
- `tests/van-hanh.js` mục A1 sửa theo quy tắc mới (áp cả tháng).

## 22/10: bỏ người học việc khỏi trung vị (chủ dự án)
- `phanTichDinhMucGoc_` bỏ dòng nhật ký của ngày người đó còn học việc (`dangHocViec_(MaNV, ngày)`, 1 tháng kể từ NgayVaoLam); trả `soHocViecBo`, giao diện ghi "Không tính sản lượng những ngày còn học việc của N người".
- Dữ liệu 22/10: bỏ 19 người, 27 công đoạn đổi trung vị (đa số tăng vì người mới làm chậm); thêm 2 gợi ý nâng: Nhập Nguyên Vật Liệu 1,05 → 1,1, Quấn Cao Để Đúc Ren 98 → 108; "Tiện Rà Tròn Chuôi 1 Máy" chỉ có người học việc làm nên ra khỏi phân tích.
- Lỗi dữ liệu thấy khi soát: Trương Thị Thùy Linh NgayVaoLam 2026-11-08 (tương lai – gõ nhầm?); Hà Thị Hải có 2 dòng NhanSu; người thiếu NgayVaoLam không được coi là học việc.
- Kiểm thử `dinh-muc.js` 27.

## 22/10: bỏ nhãn "công đoạn phụ" (chủ dự án: công đoạn nào cũng là công đoạn chính)
- Bỏ `chamChan` / `phuThuoc` / thử nhận lại: chỉ `giai(canChinh)` cho mọi công đoạn có dữ liệu, giữ chặn an toàn ×4 (`CHAN`). Trả `chamTran` khi gợi ý chạm ×4; giao diện ghi "đã nâng tối đa ×4 mà chưa về 85% – cân nhắc trước khi áp".
- Dữ liệu 22/10: Cân Phôi 350 → 1399 (dự kiến 92%), Cắt Nối 80 → 320 (dự kiến 112%, 1 người) – đều chạm ×4.
- Kiểm thử `dinh-muc.js` 28, `dinh-muc-web.js` 15.

## 22/10 (tối): mốc mới "người khá = 90%" (chủ dự án duyệt theo tư vấn chuyên gia vận hành `quan-ly-van-hanh`)
- Chuyên gia: không lấy người cao nhất làm chuẩn (dao động, phạt tập thể; thông lệ 100% = người đạt chuẩn, người giỏi 115–130%); đề xuất định mức = tốc độ P75 (3 tháng, bỏ đột biến) ÷ 0,90. Chủ dự án chọn: dùng P75 = 90%, gộp 3 tháng, bỏ người đột biến + người mới (tài khoản/vào làm trong 2 tháng); KHÔNG áp ngưỡng 5 người (nhiều công đoạn 2–3 người); giữ quy tắc áp cả tháng đang làm; không thêm mã "giờ không sản xuất". (Giới hạn nâng 10%/lần: chủ dự án chưa trả lời – chưa làm.)
- Mã: hằng số `DM_MOC=90`, `DM_PV=0.75`, `DM_DOT_BIEN=1.5`, `DM_MOI_THANG=2`, `DM_SO_THANG=3`. `pv()` phân vị nội suy; `hsTu` hiệu suất từng người; giải chung mọi công đoạn cho P75 = 90 (chỉ nâng, chặn ×4).
- Người mới: ngày muộn hơn giữa NgayVaoLam (NhanSu) và NgayTao (TaiKhoan) > cuối kỳ − 2 tháng → bỏ cả người; người cũ thì vẫn bỏ ngày còn học việc (`dangHocViec_`).
- Đột biến: hiệu suất > 1,5 × P75 của **những người còn lại** (bỏ chính họ – bản đầu tính cả họ làm Sơn-Máy-Tự-Động nhảy 99 → 73 sau khi áp), chỉ xét công đoạn ≥ 4 người; tách khỏi thống kê công đoạn đó, hiện tên + % để xác nhận.
- Trả mỗi công đoạn: thap/trungVi/kha/caoNhat (P25/P50/P75/max), dotBien[], dmGoiY, khaSau/trungViSau/caoNhatSau (khi áp TẤT CẢ gợi ý), chamTran. Chung: thang[3], nguoiMoi[], soHocViecBo, doiHang {soNguoi, soDoi, chuyen} (KPI tháng đang làm trước/sau khi áp hết, đổi tạm `dt.idxDM`).
- Giao diện: cột "Thấp · Giữa · Khá · Cao", "sau: giữa · khá · cao", ghi chú người đột biến, dòng "Dữ liệu 8–10/2026 · không tính N người mới (xem tên)", "Áp hết: x/157 người đổi hạng (A → C: 1 …)"; dòng chạm ×4 không chọn sẵn.
- Dữ liệu 22/10: 191 công đoạn, 12 gợi ý nâng (3 chạm ×4: Cân Phôi, Cắt Nối, Laser Tag Giá Bé – 1–2 người), 13 công đoạn có người đột biến, 41 người mới bị bỏ; áp hết thì 6/157 người đổi hạng.
- Kiểm thử `dinh-muc.js` 32, `dinh-muc-web.js` 15.
- **24/10 (chủ dự án):** mở tab là tự phân tích luôn kỳ đang chọn, mặc định tháng hiện tại (`vPTDM` gọi `ptdmChay()`). `dinh-muc-web.js` 16/16.
