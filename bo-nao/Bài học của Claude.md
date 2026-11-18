# Bài học của Claude

Liên quan: [[00 Mục lục]] · [[Nhật ký thay đổi]] · [[Liên kết và công cụ]] · [[KPI Kiểm thử]]

Những lần Claude làm sai / làm chưa tới và cách tránh lặp lại. Phiên mới đọc lướt trước khi làm.

- **18/11 – Nói "không có dữ liệu sống" là sai.** Có Sheet cầu nối `1lZ1AS0-DiWD4uX_9mpqHN2PJKsgDhMGuEqTD5G3tffk` (IMPORTRANGE 8 tab kênh + ĐƠN ƯU TIÊN + HT-2026) tải bằng Google Drive `download_file_content` + `exportMimeType: text/csv` (~4 MB, vài giây). → Câu hỏi có số đơn hàng: TẢI TRƯỚC rồi trả lời, nói rõ đọc lúc nào. Cách cộng: mỗi tab một khối 61 cột, dòng tiêu đề có "SX CÒN THIẾU"; **không cộng ĐƠN ƯU TIÊN** (bản chép Kho) và **HT-2026** (đã hoàn thiện). Số qua cầu nối CHƯA trừ hủy / bớt / tạm dừng / ★ làm trên web (nằm ở Sheet "CSDL Đơn hàng (web)") – nói rõ khi báo số. Tab POD-ECOMSTONE trong cầu nối đang #REF!.
- **18/11 – Đoán nguyên nhân mà chưa kiểm** (đơn #16/10). → Ghi rõ "chưa kiểm" và đề nghị kiểm bằng số thật.
- **17/11 – Kiểm thử phụ thuộc đồng hồ**: huy-don.js lỗi 3 mục sau 0h 18/11 (số ngày tạm dừng). → Khi báo lỗi kiểm thử, chạy lại trên bản trước để phân biệt lỗi thật / lỗi đồng hồ; nên sửa kiểm thử dùng giờ giả cố định.
- **17/11 – Chọn Playwright `text=` khớp nhầm câu khác** → dùng `button:has-text("…")`.
- **17/11 – Slide: trình duyệt có lề mặc định cho p/h** → đặt `h1,h2,h3,p{margin:0}` trong deck.css trước khi đo tràn.
