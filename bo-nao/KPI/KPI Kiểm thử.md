# KPI Kiểm thử

Nhóm: KPI · Cập nhật 21/10/2026
Liên quan: [[KPI Tổng quan và cách dựng]] · [[00 Mục lục]]

## Dựng lại và chạy thử (từ `kpi-app/README.md`)
```bash
python3 kpi-app/tests/va-code.py && python3 kpi-app/tests/va-index.py      # tạo lại bản vá từ goc/
TZ=Asia/Ho_Chi_Minh DATA=/đường/dẫn/csdl.json node kpi-app/tests/kiem-tra.js
DATA=/đường/dẫn/csdl.json node kpi-app/tests/xem-truoc.js                  # http://localhost:8787
DATA=/đường/dẫn/csdl.json OUT=/tmp/xem-thu-kpi.html node kpi-app/tests/tao-ban-xem-thu.js   # bản xem thử 1 file
```
- Dữ liệu JSON xuất từ Sheet có thông tin cá nhân: để ở scratchpad, **không commit**.
- Giả lập Apps Script: `kpi-app/tests/gia-lap-kpi.js`. Kiểm thử web chạy trên bản xem thử (`F=<bản xem thử>`).

## Số kiểm tra hiện có (theo các ghi chú)
- Máy chủ: `ho-so.js` 28 · `ky-nang.js` 49 · `xep-loai.js` 10 · `dinh-muc.js` 32 · `tang-toc-2.js` 31 · `com-trua.js` 81 · `com-mon-doi.js` 35 · `bao-mat.js` 52 · `van-hanh.js` 26 · `sua-loi-21-10.js` 31 · `bong-da.js` 19 · `bao-cao.js`
- Web: `holo-web.js` 19 · `ho-so-web.js` 12 · `ky-nang-web.js` 19 · `kpi-may-web.js` 6 · `dinh-muc-web.js` 15 · `chia-doi-web.js` 27 · `com-trua-web.js` 41 · `so-do-web.js` 37 · `mai-web.js` 32 · `thao-tac-web.js` 32 · `van-hanh-web.js` 29 · `lottie-web.js` 53 · `hieu-ung.js` 29 · `cho-chot-ngay.js` 16 · `dang-nhap-web.js` 15 · `am-thanh-web.js` 15 · `sua-loi-21-10-web.js` 9 · `manh-web.js` 8
- Demo: `demo-dang-nhap-khac.js` 60 · `demo-thao-tac.js` 60 · `demo-dang-nhap-rhino.js` 42 · `demo-so-do.js` 23 · `demo-dang-nhap-hieu-ung.js` 22 · `demo-dang-nhap-hieu-ung-2.js` 20
- Rà 21/10 (dữ liệu thật mới): `sua-loi-21-10.js` 12/31, `sua-loi-21-10-web.js` 1/9, `bao-mat.js` 2/50 lỗi, `van-hanh.js` (A4 trở đi), `com-trua.js`, `kiem-tra.js` dừng giữa chừng – `bao-cao.js` (tài khoản giamdoc không còn là chủ sở hữu) – **bản trước đó (commit 1f03051) cũng y hệt**, do kiểm thử viết cho bộ dữ liệu cũ, không phải lỗi mới.
- `dinh-muc.js` (22/10): kiểm tra `AP_DINH_MUC_CA_THANG` nay so với số công đoạn cần cắt tính từ chính dữ liệu (bộ dữ liệu từ 22/10 đã được cắt sẵn trên sheet thật → 0 là đúng). Đạt 32/32 trên cả 3 bộ dữ liệu.
- Lỗi đã biết: `hieu-ung.js` còn 1 lỗi "khung chờ tải bảng KPI" có từ trước (bản xem thử trả kết quả quá nhanh). – [[KPI Bảo mật và vận hành]]

## Mẹo sandbox
- Kiểm thử cũ đăng nhập bằng tài khoản còn thiếu hồ sơ: tạo bản xem thử với `BO_HO_SO=1` (tắt bảng hồ sơ bắt buộc). – [[KPI Hồ sơ bắt buộc]]
- 3D cần gói `three@0.160.0` (lấy bằng `npm pack`, đặt `THREE=`); WebGL chạy bằng `--use-gl=swiftshader`. – [[KPI Sơ đồ nhà máy 3D]]
- Lottie: sandbox chặn cdnjs nên nhúng lottie-web lấy từ npm (`LOTTIE=`). – [[KPI Lottie]]
- Chromium không tin CA của proxy → tải trang ngoài bằng `page.route` + Node `fetch` (NODE_USE_ENV_PROXY=1); ffmpeg đủ codec lấy từ pip `imageio-ffmpeg`. – [[KPI Màn đăng nhập Khắc laser]]
