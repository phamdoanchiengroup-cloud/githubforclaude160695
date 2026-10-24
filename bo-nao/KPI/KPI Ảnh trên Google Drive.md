# KPI Ảnh trên Google Drive

Nhóm: KPI · Tạo 24/10/2026
Liên quan: [[KPI Sơ đồ nhà máy 3D]] · [[KPI Màn đăng nhập Khắc laser]] · [[KPI Phần giao diện tải sau]] · [[Quyết định của chủ dự án]]

## Vì sao
- Chủ dự án hỏi 24/10: "tại sao không đẩy các ảnh nặng lên Google Drive rồi lấy link dùng cho web?". Trước đó ảnh nhúng base64 vào file, làm SoDo.html nặng khoảng 1,46 MB. Bộ cài clasp chỉ đẩy 5 file cố định nên không thêm được file ảnh riêng vào Apps Script.
- Chuyển lên Drive: SoDo.html còn khoảng 0,54 MB, Index.html khoảng 0,82 MB. Trình duyệt tự nhớ ảnh sau lần tải đầu.

## Cách làm
- Thư mục Drive **"KPI – Ảnh web"** của chủ dự án (id `1_CBq5LU4HZuBFaemZakQMV4mW1Ewl54O`), chia sẻ **"Bất kỳ ai có đường liên kết – Người xem"**. Chủ dự án tự bật chia sẻ: công cụ Drive của Claude chỉ chia sẻ được cho từng email.
- Claude không tự tải ảnh lên được: công cụ tạo file cần base64 trong lời gọi, quá dài với ảnh vài trăm KB. Cách làm: tạo thư mục (`create_file`), gửi ảnh cho chủ dự án kéo vào, rồi tìm mã file bằng `search_files parentId = '<thư mục>'`.
- Mã file ghi ở `kpi-app/anh-drive.json`. Hàm `anh_drive(ten, tuy_chon)` trong `tests/dang-nhap/anh_rhino.py` trả về `https://lh3.googleusercontent.com/d/<mã>=<tùy chọn>`, hoặc `''` nếu chưa có mã.
- Máy chủ ảnh Google tự thu nhỏ và nén theo tùy chọn sau dấu `=`: `w1920` (rộng tối đa), `s0` (giữ cỡ), `rj` (JPEG) / `rw` (WebP), `l80` (chất lượng). Ví dụ ảnh nền đăng nhập gốc PNG 2,7 MB, với `w1920-rj-l80` còn khoảng 280 KB. Ảnh sơ đồ dùng `s0-rw-l80`.
- Kiểm tra link bằng `curl -sS -L -o /dev/null -w "%{http_code} %{content_type} %{size_download}"`. Chromium trong sandbox không tin CA của proxy, nên khi chụp thử thì thay link bằng ảnh tải về (data URL).
- Dự phòng: sơ đồ chưa có mã thì nhúng ảnh trong `kpi-app/so-do/` như cũ. Màn đăng nhập không có ảnh thì chỉ còn nền xanh đêm (gradient trên `#gate`). Ảnh tách tầng có `aspect-ratio` giữ chỗ khi đang tải.

## Ảnh hiện có (24/10)
- `nen-dang-nhap`: "Khu phức hợp RHINO dưới ánh đêm.png" (mặt tiền nhà máy ban đêm).
- `so-do-tang-1/2/3`: mặt bằng 3 tầng đã nắn khớp khung tọa độ (bản gốc: `so-do/anh-goc-tang-*.webp`).
- `so-do-tach-tang`: minh họa tách 3 tầng.

## Lưu ý cho chủ dự án
- Ai có link là xem được ảnh (mặt bằng nhà máy). Link dài, khó đoán, nhưng không phải bí mật tuyệt đối.
- Đừng xóa hay chuyển ảnh ra khỏi thư mục, đừng tắt chia sẻ, nếu không web sẽ mất ảnh. Muốn thay ảnh: tải ảnh mới lên → báo Claude ghi mã mới vào `anh-drive.json` → dựng lại.
