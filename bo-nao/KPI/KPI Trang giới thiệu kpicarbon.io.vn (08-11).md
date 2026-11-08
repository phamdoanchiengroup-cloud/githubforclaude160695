# KPI Trang giới thiệu kpicarbon.io.vn (08-11)

Liên quan: [[Liên kết và công cụ]] · [[Việc chờ chủ dự án]] · [[KPI Demo giao diện]] · [[00 Mục lục]]

## Vì sao có trang này
- Chủ dự án muốn link web KPI dán vào Zalo có **ảnh xem trước** (như trang Qoder `kpi-san-xuat-tefppm4sll9.qoder.website` họ tự làm).
- Link Apps Script (`script.google.com/.../exec`) không hiện ảnh vì Google bọc web trong iframe, Zalo không đọc được thẻ `og:`. → cần trang trung gian ở chỗ khác.
- 08/11 chủ dự án tự mua tên miền **kpicarbon.io.vn** (đuôi .io.vn của VNNIC, phí duy trì 20.000 đ/năm). Không mua hosting: trang để trên **GitHub Pages** miễn phí (repo công khai).
- Đã cân nhắc và bỏ: dùng `kpi.rhinobilliards.vn` (DNS ở Mắt Bão, web Shopify) / `kpi.rhino-billiards.com` (DNS Cloudflare) – chủ dự án không muốn dùng tên miền công ty.

## Cách dựng
- Thư mục `docs/` ở nhánh KPI (không tạo nhánh mới): `index.html`, `og.jpg` (1200×630), `nen.jpg`, `logo-rhino.png`, `favicon.png`, `apple-touch-icon.png`, `CNAME` (= `kpicarbon.io.vn`), `.nojekyll`.
- `og.jpg` dựng từ `kpi-app/anh/web/nen-dang-nhap.jpg` (ảnh nhà máy đêm, nền màn đăng nhập) + logo RHINO + chữ "Hệ thống KPI sản xuất" + nhãn tên miền; HTML nguồn ở scratchpad (không commit), chụp bằng Playwright.
- `index.html`: nút "Mở hệ thống KPI →" tới link công ty `AKfycbzeCiG2…/exec`; **tự mở sau 1,5 s** (`?o=0` để ở lại trang). Đổi link web KPI = sửa `href` của nút `#mo`.
- Kiểm 08/11: 390 px và 1280 px không lỗi, không tràn; tự chuyển đúng link.

## Việc chủ dự án cần làm (chờ)
1. GitHub → repo → Settings → Pages → Source "Deploy from a branch" → nhánh `claude/beautiful-ptolemy-f2j7za`, thư mục `/docs` → Save. (Claude không có công cụ bật Pages.)
2. Trang quản lý DNS của nơi mua tên miền: 4 bản ghi **A** cho `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; 1 bản ghi **CNAME** `www` → `phamdoanchiengroup-cloud.github.io`.
3. Sau khi DNS chạy: Settings → Pages → tick "Enforce HTTPS".
- 08/11 kiểm DNS: `kpicarbon.io.vn` chưa có bản ghi (NXDOMAIN).

## Sau đó (08/11)
- Chủ dự án muốn tên miền **vào thẳng web**, không phải landing. Phương án: A = trang `og:` + chuyển ngay (thanh địa chỉ thành script.google.com, không đổi bảo mật); B = iframe toàn màn hình, giữ kpicarbon.io.vn trên thanh địa chỉ, cần bật lại ALLOWALL (bỏ từ 18/10) + kiểm `location.ancestorOrigins` (chỉ cho chạy khi không bị nhúng hoặc tầng ngoài là kpicarbon.io.vn), mỗi người đăng nhập lại 1 lần. Chưa chọn – **tạm gác** cùng việc chuyển quyền sang công ty (xem [[Việc chờ chủ dự án]]). Trang `docs/` hiện vẫn là bản landing tự mở sau 1,5 s; GitHub Pages + DNS chưa bật.
