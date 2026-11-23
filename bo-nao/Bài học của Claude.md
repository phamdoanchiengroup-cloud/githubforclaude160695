# Bài học của Claude

Liên quan: [[00 Mục lục]] · [[Nhật ký thay đổi]] · [[Liên kết và công cụ]] · [[KPI Kiểm thử]]

Những lần Claude làm sai / làm chưa tới và cách tránh lặp lại. Phiên mới đọc lướt trước khi làm.

- **23/11 – Chèn chú thích `// …` vào giữa dòng code bằng thay chuỗi làm MẤT dòng kiểm quyền** (`var q = dbQuyen_(token, true);   // ghi chú if (q.loi) return q.loi;` → phần kiểm quyền thành chú thích, công nhân gọi được hàm). Kiểm thử "công nhân không xem được" bắt được. Cách tránh: chú thích luôn đặt CUỐI dòng sau toàn bộ lệnh; sau khi vá hàm có kiểm quyền thì `grep` lại dòng đó trong bản sinh ra.
- **22/11 – Giao diện kính ép màu chữ bằng luật rất mạnh** (`html.rs.rs.rs .rs-sang … !important`): sửa màu chữ phải dùng selector mạnh hơn (`html.rs.rs.rs.rs …`), và đo `getComputedStyle` trên bản xem thử trước khi báo đã sửa.
- **22/11 – Chủ dự án nói "bảng đơn" có thể là tab Đơn hàng HOẶC Order-Flow** → hỏi rõ tab nào trước khi làm demo (lần đầu làm nhầm sang Order-Flow).
- **22/11 – Demo phải là bản máy tính** (mọi người xem đơn bằng máy tính) và nên dùng đơn thật (dựng `DH=` từ Sheet cầu nối) thay vì số giả.
- **18/11 – Nói "không có dữ liệu sống" là sai.** Có Sheet cầu nối `1lZ1AS0-DiWD4uX_9mpqHN2PJKsgDhMGuEqTD5G3tffk` (IMPORTRANGE 8 tab kênh + ĐƠN ƯU TIÊN + HT-2026) tải bằng Google Drive `download_file_content` + `exportMimeType: text/csv` (~4 MB, vài giây). → Câu hỏi có số đơn hàng: TẢI TRƯỚC rồi trả lời, nói rõ đọc lúc nào. Cách cộng: mỗi tab một khối 61 cột, dòng tiêu đề có "SX CÒN THIẾU"; **không cộng ĐƠN ƯU TIÊN** (bản chép Kho) và **HT-2026** (đã hoàn thiện). Số qua cầu nối CHƯA trừ hủy / bớt / tạm dừng / ★ làm trên web (nằm ở Sheet "CSDL Đơn hàng (web)") – nói rõ khi báo số. Tab POD-ECOMSTONE trống vì chưa có đơn (chủ dự án 18/11) – không phải lỗi, đừng báo lỗi.
- **19/11 – Giả lập web trên số thật (gia-lap-kpi.js) phải đặt prop `KPI_MOC_LUU_TRU`** (vd '2026-10'), nếu không hàm web không đọc tab `NhatKySanXuat_LuuTru` → tháng cũ ra 0. Luôn so 1 tháng mới với số web / KPIThang trước khi tin.
- **18/11 – Số cầu nối chưa trừ tạm dừng**: 17/11 tối chủ dự án tạm dừng ~1.900 sp (OEM gần hết, 1 đơn A Đông) – không đọc CSDL Đơn hàng (web) thì báo tồn OEM / A Đông sai lớn. → Luôn đọc thêm tab DongHuy (HIEU_LUC: HUY trừ hết, BOT dùng SLMoi, DUNG tách riêng), hoặc đọc Sheet tóm tắt cho trợ lý.
- **18/11 – Đoán nguyên nhân mà chưa kiểm** (đơn #16/10). → Ghi rõ "chưa kiểm" và đề nghị kiểm bằng số thật.
- **17/11 – Kiểm thử phụ thuộc đồng hồ**: huy-don.js lỗi 3 mục sau 0h 18/11 (số ngày tạm dừng). → Khi báo lỗi kiểm thử, chạy lại trên bản trước để phân biệt lỗi thật / lỗi đồng hồ; nên sửa kiểm thử dùng giờ giả cố định.
- **17/11 – Chọn Playwright `text=` khớp nhầm câu khác** → dùng `button:has-text("…")`.
- **17/11 – Slide: trình duyệt có lề mặc định cho p/h** → đặt `h1,h2,h3,p{margin:0}` trong deck.css trước khi đo tràn.
