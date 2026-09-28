# Web app KPI sản xuất (Apps Script)

Dự án riêng, **không liên quan** tới `tuvi-app/`.

## Các file

| File | Vai trò |
|---|---|
| `Code.gs` | Mã máy chủ, là bản đã vá. Dán vào Apps Script |
| `Index.html` | Giao diện, là bản đã vá. Dán vào Apps Script |
| `goc/` | Bản gốc chủ dự án gửi ngày 28/09/2026 (đã đổi xuống dòng CRLF sang LF). Dùng làm gốc khi gộp 3 chiều |
| `HUONG-DAN-CAP-NHAT.md` | Các bước dán mã và chạy hàm một lần, viết cho chủ dự án |
| `xem-thu-dang-nhap.html` | Bản xem thử màn đăng nhập "Precision". Sinh bằng `tests/tao-xem-thu.py`. Gõ mật khẩu `demo` để xem hiệu ứng đăng nhập đúng |
| `tests/dang-nhap-bi-a.html` | Nguồn duy nhất của màn đăng nhập (gồm 3 đoạn CSS / HTML / JS). `va-index.py` chèn vào Index.html, `tao-xem-thu.py` dựng bản xem thử |
| `tests/va-code.py`, `tests/va-index.py` | Tạo `Code.gs` / `Index.html` từ `goc/` bằng các lần thay có kiểm tra (mỗi chuỗi gốc phải khớp đúng số lần) |
| `tests/ham-chay-tay.gs` | Các hàm chạy tay (kiểm tra, sửa ngày sai, ngày lễ…), được nối vào cuối `Code.gs` |
| `tests/toc-do.gs` | Tăng tốc, nối vào cuối `Code.gs`: bộ đệm ghi `suaO_` → `xaGhi_`, `xong_()` cuối lượt (trong `sach_`), số phiên bản `KPI_PB` + `nho_()` (CacheService gzip, khối 90KB, 10 phút), `ganPhanDoi_` (sheet đã đổi → `phanDoi`), `napPhan`, Sheets API `batchGet` (bật bằng `KIEM_TRA_SHEETS_API`), `LUU_TRU_NHAT_KY` |
| `tests/giao-dien-moi.html` | CSS + JS giao diện bên trong (menu nhóm, thanh dưới, Việc hôm nay, chỉ mục tra cứu `ix_`). `va-index.py` chèn vào Index.html |
| `tests/tao-ban-xem-thu.js` | Dựng **một file HTML** chạy cả web app trong trình duyệt (Code.gs chạy trên Sheet giả), dữ liệu ẩn danh, mật khẩu `demo`. File kết quả **không** đưa vào repo |
| `tests/gia-lap-kpi.js` | Giả lập Apps Script: Sheet tự đổi chuỗi ngày như Google Sheets, khóa, cache, đồng hồ giả |
| `tests/kiem-tra.js` | 85 kiểm tra trên dữ liệu thật, có đối chứng với mã gốc (mục 10: tăng tốc) |
| `tests/xem-truoc.js` | Chạy giao diện trên máy với máy chủ giả lập. `/phien/<tên đăng nhập>` trả mã phiên để chụp ảnh không cần mật khẩu |

## Chạy kiểm tra

Dữ liệu thật (có CCCD, SĐT) **không** đưa vào repo. Cách lấy: tải file Sheet dạng .xlsx, đổi thành JSON `{TenSheet: [[...], ...]}` (ô ngày ghi dạng `{"$d": "2026-08-25T00:00:00"}`, tính theo giờ VN).

```bash
python3 kpi-app/tests/va-code.py && python3 kpi-app/tests/va-index.py      # tạo lại bản vá từ goc/
TZ=Asia/Ho_Chi_Minh DATA=/đường/dẫn/csdl.json node kpi-app/tests/kiem-tra.js
DATA=/đường/dẫn/csdl.json node kpi-app/tests/xem-truoc.js                  # http://localhost:8787
DATA=/đường/dẫn/csdl.json OUT=/tmp/xem-thu-kpi.html node kpi-app/tests/tao-ban-xem-thu.js   # bản xem thử 1 file
```

Giao diện: mỗi lời gọi ghi trên máy chủ trả `phanDoi` (danh sách phần `nk/cc/ns/cd/mm/vp/ts/tb/dm`, hoặc `'tat'`); `call()` giữ lại để `reload()` gọi `napPhan` thay vì `napDuLieu`. Thêm sheet mới mà giao diện có dùng thì nhớ thêm vào `PHAN_CUA_SHEET_` (toc-do.gs) và phần tương ứng trong `napDuLieuLoi_`.

Phải đặt `TZ=Asia/Ho_Chi_Minh`: mã gốc dùng `getHours()` theo múi giờ máy, nên chạy ở múi giờ khác thì số liệu đối chứng sẽ lệch.

## Khi chủ dự án gửi bản tự sửa

Gộp 3 chiều bằng `git merge-file <bản-repo> goc/<file> <bản-mới-của-họ>`, rồi chép bản mới của họ vào `goc/` làm gốc cho lần sau.
