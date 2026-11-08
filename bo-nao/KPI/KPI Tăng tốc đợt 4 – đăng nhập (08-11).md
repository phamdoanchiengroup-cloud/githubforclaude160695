# KPI Tăng tốc đợt 4 – đăng nhập (08-11)

Nhóm: KPI · Cập nhật 08/11/2026
Liên quan: [[KPI Tăng tốc đợt 3 (08-11)]] · [[KPI Kiểm thử]] · [[Lần dán lên Apps Script]] · [[KPI Cập nhật bằng clasp]] · [[00 Mục lục]]

Chủ dự án 08/11: "công nhân và TP, PP mất hơn 20 giây để bấm đăng nhập, thấy số và tải gói dữ liệu". Chọn **A + B**.

## Đo (máy giả lập, số thật 09/11 7h30)
- Mỗi lần nạp gói đăng nhập: **~21 lượt đọc trang tính riêng lẻ** (Sheets API chưa bật trên bản thật – việc chờ từ 21/10 chưa làm) + bộ nhớ nhật ký trống thì đọc thêm cả sheet nhật ký (345k ô, ~19k dòng).
- Gói thật (chuỗi gửi về): TP 180–426 KB (Phôi Carbon lớn nhất), CN ~200 KB (cả xưởng đã chốt để xếp hạng), ban điều hành 1,1 MB. Số 816 KB báo lúc đầu bị tính trùng (JSON của chuỗi). Gói TP/PP **đã** lọc theo xưởng + từ đầu tháng trước → phần B gần như có sẵn, không cắt thêm (cắt nữa mất nhật ký tháng trước của TP).

## Đã làm (`tests/tang-toc-4/`, exec cuối va-code.py)
- `2-CAP-NHAT.bat` (cap-nhat.ps1 bước 3b): tự thêm dịch vụ Sheets v4 vào `appsscript.json` trước khi đẩy; lỗi thì giữ nguyên file cũ.
- `GIU_NONG_DANG_NHAP` (lịch 5 phút, 6h–22h, **tự cài** `tt4CaiLich_` khi chủ sở hữu mở web): (1) có dịch vụ Sheets mà chưa bật → chạy `KIEM_TRA_SHEETS_API` (đọc 2 cách so khớp) tối đa 1 lần/ngày tới khi khớp; `TAT_SHEETS_API` ghi `KPI_SHEETS_TAT` để không tự bật lại. (2) bản nhớ nhật ký NKD3 quá 8 phút → đọc lại sheet và ghi (`NKD3_t`); bản nhớ sống 10 → 15 phút.
- `napDuLieuLoi_` gọi `napTruoc_(SHEET_NAP_)` ngay đầu (trước đọc phiên), thêm `LichSuDinhMuc` → khi đã bật API, cả gói đăng nhập **1 lượt đọc**.
- Thống kê › Tốc độ web: dòng trạng thái Sheets API + lịch giữ nóng (`layTocDo().tt4`).
- Chạy tay nếu cần: `TAT_GIU_NONG_DANG_NHAP`, `BAT_GIU_NONG_DANG_NHAP`.

## Kiểm thử
- `tests/tang-toc-4.js` 14/14. Bộ cũ: tang-toc-3 17/17, tang-toc-2 31/31, dieu-phoi 27/27, quy-trinh 72/76 và van-hanh 3 lỗi (giống bản trước).
- cap-nhat.ps1 chưa chạy thử được (máy đám mây không có PowerShell) – đọc soát kỹ, có khôi phục file cũ khi lỗi.

## Sau khi dán
- 08/11 chủ dự án báo: dịch vụ Sheets API **đã có sẵn** trong Apps Script → thiếu là cờ `KPI_SHEETS_API` (chỉ đặt khi chạy tay KIEM_TRA_SHEETS_API – chưa chạy). Lịch giữ nóng tự kiểm tra và bật, không cần làm tay.
- Mở web bằng tài khoản chủ sở hữu 1 lần (tự cài lịch). Sau ≤ 1 ngày xem Thống kê › Tốc độ web: "đọc gộp Sheets API **đang bật**".
