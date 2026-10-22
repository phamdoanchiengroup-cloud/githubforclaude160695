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
