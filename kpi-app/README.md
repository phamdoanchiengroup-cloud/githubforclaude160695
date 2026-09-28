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
| `tests/gia-lap-kpi.js` | Giả lập Apps Script: Sheet tự đổi chuỗi ngày như Google Sheets, khóa, cache, đồng hồ giả |
| `tests/kiem-tra.js` | 63 kiểm tra trên dữ liệu thật, có đối chứng với mã gốc |
| `tests/xem-truoc.js` | Chạy giao diện trên máy với máy chủ giả lập |

## Chạy kiểm tra

Dữ liệu thật (có CCCD, SĐT) **không** đưa vào repo. Cách lấy: tải file Sheet dạng .xlsx, đổi thành JSON `{TenSheet: [[...], ...]}` (ô ngày ghi dạng `{"$d": "2026-08-25T00:00:00"}`, tính theo giờ VN).

```bash
python3 kpi-app/tests/va-code.py && python3 kpi-app/tests/va-index.py      # tạo lại bản vá từ goc/
TZ=Asia/Ho_Chi_Minh DATA=/đường/dẫn/csdl.json node kpi-app/tests/kiem-tra.js
DATA=/đường/dẫn/csdl.json node kpi-app/tests/xem-truoc.js                  # http://localhost:8787
```

Phải đặt `TZ=Asia/Ho_Chi_Minh`: mã gốc dùng `getHours()` theo múi giờ máy, nên chạy ở múi giờ khác thì số liệu đối chứng sẽ lệch.

## Khi chủ dự án gửi bản tự sửa

Gộp 3 chiều bằng `git merge-file <bản-repo> goc/<file> <bản-mới-của-họ>`, rồi chép bản mới của họ vào `goc/` làm gốc cho lần sau.
