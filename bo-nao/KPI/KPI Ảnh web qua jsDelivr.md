# KPI Ảnh web qua jsDelivr

Nhóm: KPI · Tạo 24/10/2026 (ảnh trên Google Drive) · Cập nhật 25/10/2026 (chuyển sang jsDelivr)
Liên quan: [[KPI Sơ đồ nhà máy 3D]] · [[KPI Màn đăng nhập Khắc laser]] · [[KPI Phần giao diện tải sau]] · [[Quyết định của chủ dự án]] · [[Liên kết và công cụ]]

## Vì sao
- Ảnh nặng không nhúng vào file (SoDo.html từng nặng 1,46 MB). Bộ cài clasp chỉ đẩy 5 file cố định nên không thêm file ảnh riêng vào Apps Script được.
- 24/10: để ảnh trên Google Drive của chủ dự án. Nhược điểm: Claude không tải ảnh lên Drive được (công cụ cần base64 trong lời gọi), nên **chủ dự án phải tự kéo ảnh lên**.
- 25/10 chủ dự án hỏi "sao không dùng jsDelivr?". Repo GitHub đang **công khai** (API: `private=false`; phiên trước ghi nhầm là riêng tư) nên jsDelivr phục vụ thẳng ảnh trong repo. **Claude tự làm hết**, chủ dự án không phải làm gì. Chủ dự án chọn giữ repo công khai (đã biết mặt bằng nhà máy và mã nguồn công khai).

## Cách làm
- Ảnh nằm trong repo: nền đăng nhập `kpi-app/anh/web/nen-dang-nhap.jpg` (nén từ PNG 2,7 MB "Khu phức hợp RHINO dưới ánh đêm" → JPEG 1920 px chất lượng 80, ~300 KB); mặt bằng `kpi-app/so-do/anh-tang-{0,1,2}.webp` + `anh-tach-tang.webp` (giống hệt bản đã để trên Drive).
- Hàm `anh_cdn(duong)` trong `tests/dang-nhap/anh_rhino.py` trả `https://cdn.jsdelivr.net/gh/phamdoanchiengroup-cloud/githubforclaude160695@<commit>/kpi-app/<duong>`, **ghim theo commit cuối cùng đổi ảnh đó** (`git log -1 -- <file>`): ảnh không đổi thì link không đổi (trình duyệt + jsDelivr nhớ lâu), thay ảnh thì commit mới → link mới, không bị kẹt ảnh cũ (link theo nhánh bị jsDelivr nhớ ~12 giờ).
- Dùng ở: `{{NEN_DN}}` (màn đăng nhập, `anh_rhino`), `SD_ANH` / `SD_TACH` (`tests/so-do/va-so-do.py`). Ảnh chỉ dùng trong `<img>` / SVG `<image>`, không vẽ lên canvas → không vướng CORS.
- **Thay ảnh:** đặt file mới cùng tên → commit + push ảnh **trước** → dựng lại (`va-index.py`; demo: `tests/dang-nhap/tao-demo-bi-a.py`, `tests/tao-xem-thu.py`). Ảnh chưa commit thì `anh_cdn` dừng dựng và báo lỗi. Không rebase / force-push commit chứa ảnh đã dùng (link ghim theo mã commit đó).
- Kiểm tra link: `curl -sS -o /dev/null -w "%{http_code} %{content_type} %{size_download}" <link>` (25/10: cả 5 link 200, đúng loại ảnh). Chromium trong sandbox không tin CA của proxy nên khi chụp thử ảnh ngoài không hiện – bình thường.
- Thư mục Drive "KPI – Ảnh web" (id `1_CBq5LU4HZuBFaemZakQMV4mW1Ewl54O`) không còn dùng; `kpi-app/anh-drive.json` đã xóa. Chủ dự án giữ hay xóa thư mục đó đều được, web không phụ thuộc.

## Kiểm thử (25/10)
- `manh-web.js` 8/8 (nền đăng nhập là link jsDelivr ghim commit, không nhúng), `dang-nhap-web.js` 15/15, `demo-dang-nhap-khac.js` 60/60, `so-do-web.js` 27/27 (phần 2D).
