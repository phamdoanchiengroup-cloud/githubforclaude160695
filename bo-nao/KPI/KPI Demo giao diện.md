# KPI Demo giao diện

Nhóm: KPI · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[Việc chờ chủ dự án]] · [[KPI Sửa lỗi giao diện]] · [[KPI Thao tác và hiệu ứng bên trong]] · [[00 Mục lục]]

- Demo giao diện (chủ dự án thích phong cách **thiết bị đo nhà máy**: kim lò xo, đồng hồ cơ, mặt tối; chê bộ 3D và 7 mẫu đầu demo-2 là "xấu, không đạt"). Mẫu đã duyệt nằm trong `kpi-app/mau-da-chon/`: `dong-ho-hieu-suat.html` (demo-2 số 8), `cum-dong-ho-xuong.html` (demo-3 số 1), `dong-ho-lat-dem-nguoc.html` (demo-3 số 8), `thuoc-truot-dinh-muc.html` (demo-4 số 5). `demo-4.html` (trừ số 5) và `demo-5.html` bị chê "không ổn" – chủ dự án muốn thêm **demo tương tác** và **giao diện nền**: `kpi-app/demo-tuong-tac.html` (6 thao tác nhập liệu) và `kpi-app/demo-giao-dien-nen.html` (khung web 4 kiểu nền × 3 bố cục) – cả hai cũng chưa vừa ý ("trông như đồ chơi, không sát công việc"). Hướng mới: **làm lại đúng màn hình đang dùng, đặt bản cũ cạnh bản mới**, bỏ trang trí giả đồ vật. Bắt đầu với `kpi-app/demo-duyet-san-luong.html` (dựa trên `vDuyetSL` thật), chờ góp ý.
- **Demo giao diện mới (11/10, chờ chọn):** `kpi-app/demo-giao-dien-moi.html` (1 file tự chứa, số liệu MẪU, ảnh Rhino 3B nhúng base64): 3 màn Việc hôm nay (danh sách việc theo mức gấp, bảng xưởng, tiến độ ca so với giờ) / Bảng KPI (lọc 1 dòng, sắp xếp cột, bấm dòng mở 4 phần điểm, điện thoại thành danh sách) / KPI của tôi (câu "thiếu bao nhiêu lên loại trên", thước C/B/A, cột sản lượng ngày, Rhino gợi ý) × 2 hướng A sáng "Giấy kỹ thuật" (Be Vietnam Pro, xanh ngọc #0f766e) / B tối "Rhino" (Arimo, #2b2b2b + #f7b829); khung điện thoại dùng container query `app`. Impeccable detect: 0 lỗi.
- **Bốn kiểu giao diện độc đáo (22/10, chờ chọn):** `kpi-app/demo-giao-dien-doc-dao.html` (1 file, số liệu MẪU, ảnh bản đang dùng nhúng base64), trang xem trên điện thoại: https://claude.ai/artifact/S35dXvGWZFSHA6UFSh4bb6
  - Chủ dự án nhờ "tham khảo chuyên gia thiết kế, tìm trên mạng". Đã hỏi vai `soat-giao-dien-cuoi`, tìm: chuẩn HMI ISA-101 (màn xám, chỉ tô màu khi bất thường, thước có dải mục tiêu), bảng Andon (kế hoạch / thực tế / chênh, đèn từng giờ), phong cách thiết bị Teenage Engineering.
  - 4 hướng, đều làm lại đúng 2 màn đang dùng: Tổng quan (BĐH) + KPI của tôi (điện thoại). Thêm tab "Bản đang dùng" là ảnh chụp bản xem thử:
    1. **Tủ đồng hồ**: đồng hồ có vạch đúng ngưỡng xếp loại C70/B80/A85/A+90/S95, số lật, thước kim theo xưởng, "còn x điểm lên hạng". Chuyên gia chọn hướng này.
    2. **Phòng điều khiển** (ISA-101): danh sách cần xử lý theo mức, thước xám có dải 80–100, đường sản lượng cộng dồn so với kế hoạch.
    3. **Bảng Andon**: kế hoạch / thực tế / chênh + 8 ô giờ, gồm xanh = đạt (≥ 97%), vàng = hơi chậm, đỏ = chậm (< 85%), ô viền = giờ đang chạy. Hợp TV treo xưởng.
    4. **Bản vẽ kỹ thuật**: đường kích thước từ mốc 85, khung tên, chuỗi kích thước SL + CL + (TT + AT) = KPI, thước du xích sản lượng hôm nay.
  - Lưu ý kỹ thuật: file mở trực tiếp không có `<!doctype>` → chế độ quirks, bảng không kế thừa màu/font → `.k3 table{color:var(--c);font:inherit}`. Mỗi màn dùng container query nên tự co khi khung hẹp.

