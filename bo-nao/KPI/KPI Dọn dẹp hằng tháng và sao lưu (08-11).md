# KPI Dọn dẹp hằng tháng và sao lưu (08-11)

Nhóm: KPI · Cập nhật 08/11/2026
Liên quan: [[KPI Tăng tốc đợt 4 – đăng nhập (08-11)]] · [[KPI Tăng tốc đợt 3 (08-11)]] · [[KPI Kiểm thử]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

Chủ dự án 08/11: "sheet nhật ký sản lượng và nhật ký thao tác có xóa bớt sau mỗi tháng không? chỉ nên giữ tháng hiện tại và tháng trước… có sao lưu hàng tháng / hàng ngày?"

## Trước khi sửa (số thật 07/11)
- NhatKySanXuat 19.252 dòng (từ tháng 8), **chưa từng lưu trữ** (`LUU_TRU_NHAT_KY` có sẵn, giữ 3 tháng, lịch `CAI_TRIGGER_LUU_TRU` phải chạy tay – chưa chạy).
- NhatKyThaoTac 34.319 dòng (~14.000 dòng/tháng), **không bao giờ xóa**.
- Sao lưu: `saoLuuHangNgay` 1h sáng, chép cả file vào Drive `KPI_Backup`, giữ 30 ngày. Không có bản tháng giữ lâu.

## Chủ dự án chọn
- Nhật ký sản lượng: sheet chính giữ **tháng này + tháng trước**, cũ hơn **chuyển** sang `NhatKySanXuat_LuuTru` cùng file (không xóa).
- Nhật ký thao tác: giữ 2 tháng, cũ hơn **xóa** (tra lại trong bản sao tháng).
- Sao lưu tháng: **giữ 24 bản**.

## Đã làm (`tests/luu-tru/`, exec cuối va-code.py)
- `DON_DEP_HANG_THANG` – lịch **ngày 1 hằng tháng 3h** (tự cài `ldCaiLich_` khi chủ sở hữu mở web, xóa lịch cũ `LUU_TRU_NHAT_KY` ngày 5; lần đầu chạy sau 15 phút):
  1. `saoLuuThang_`: chép file vào Drive `KPI_Backup_Thang` tên "… — thang yyyy-MM" (đã có thì thôi), giữ 24 bản mới nhất (cũ hơn vào thùng rác).
  2. Chỉ khi đã có bản sao tháng này (`LD_SAO_LUU`): `LUU_TRU_NHAT_KY` với `SO_THANG_GIU = 1` (vẫn chỉ chuyển tháng **đã chốt chính thức**), `donNhatKyThaoTac_` xóa dòng trước đầu tháng trước.
  - Kết quả lần chạy cuối: ScriptProperties `LD_LAN_CUOI` + 1 dòng Nhật ký thao tác "Dọn dẹp hằng tháng".
- `docNKTu_(tu)`: nhật ký từ ngày `tu` – ghép trang lưu trữ khi `tu` cũ hơn mốc. Dùng ở `hoSoNhanVien`, `layQuyTrinh`, `dhDongGoiNgay_`, `dhSanLuongXuong_` (200 ngày), `dpTinh_`, `kiemTraTonThang`, `layThongKe`. Bảng KPI / KPI quản lý / phân tích định mức đã có sẵn `canLuuTru_`.
- Máy giả lập: Drive giả thêm `getFiles`, `makeCopy`.

## Kiểm thử
- `tests/luu-tru.js` 15/15 (số thật): tháng 8, 9 sang lưu trữ đủ dòng; sheet chính còn 10 + 11; nhật ký thao tác xóa 17.488 dòng (còn từ 01/10); **Bảng KPI T9, T10, Thống kê T9, sản lượng xưởng 200 ngày, Quy trình 90 ngày, Điều phối, hồ sơ nhân viên giống hệt trước khi dọn**; đăng nhập đọc 345k → 202k ô; chạy lại cùng tháng không chuyển trùng.
- Bộ cũ giống bản trước (quy-trinh 72/76, van-hanh 3 lỗi, don-hang 124/135 – bản 08/11 sáng cũng 124 do phụ thuộc ngày chạy).

## Để ý sau
- Trang lưu trữ lớn dần (~7–9k dòng/tháng): các màn của chủ sở hữu đọc dài ngày (Thống kê tháng cũ, đóng gói 200 ngày) sẽ chậm dần. Khi quá ~12 tháng có thể cắt trang lưu trữ (đã có bản sao tháng) – hỏi chủ dự án.
