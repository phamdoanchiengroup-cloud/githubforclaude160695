# TCC Văn dễ hiểu và Tổng hợp 6 hệ

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Giao diện]] · [[TCC Nghiệm chứng]] · [[TCC Bán hàng]] · [[00 Mục lục]]

- **DeHieu.gs:** văn dễ hiểu cho Bát Tự, Chiêm tinh, Thần số, HD, Hà Lạc, cùng cấu trúc với phần Tử Vi. Hiển thị đầu mỗi tab; phần kỹ thuật gom vào `<details class="chuyen-sau">` (mặc định đóng, PDF tự mở).
- **Tổng hợp 6 hệ bản 2 (DeHieu.gs › `th6Lap_`, kết quả `deHieu.th6`):** 9 lĩnh vực, mỗi lĩnh vực lấy điểm /10 + câu dễ hiểu của Tử Vi (điểm cung, câu mẫu `TH6_TV_CAU`), Bát Tự (12 lĩnh vực, điểm trong "Kết luận"), Hà Lạc và Chiêm tinh (8 lĩnh vực); Thần số, HD, văn Chiêm tinh là "góc nhìn thêm". Điểm chung có trọng số (TV 1,2 · BT 1,1 · CT 1,0 · HL 0,8), ngưỡng điểm chung ≥6 thuận / ≤4,8 cần lưu ý; số hệ cùng chiều; năm nổi bật sắp tới và đã qua lấy từ Biến cố hội tụ (`th: th` truyền vào `deHieuLap_`). Client `th6Html` (bảng nhiệt 9 lĩnh vực × 4 hệ, nút mở vận năm `nam|y` hoặc sang tab Vận hạn nếu đã mở, thẻ `tinhTrangMua`). Bản miễn phí: `th6Moi_` (TaiKhoan.gs) → `th6KhachHtml` chỉ lộ lĩnh vực mạnh nhất.

## 24/10 (khuya) – Sửa nội dung nhạy cảm (4 hướng, cả 6 hệ)
- Quy tắc biên tập giao cho 4 chuyên gia content-creator: chuyện đã qua → gợi ý để tự đối chiếu; bỏ %/xác suất/số con/tỷ lệ trai–gái trong lời văn; bỏ chẩn đoán sức khỏe; hôn nhân, con cái, tiền bạc, pháp lý, năm hạn viết theo hướng chủ động.
- Đã sửa lời văn: LuanGiai (~130 chuỗi), TuViTrinhTu, TuViTamPhap, DuDoan (tên chủ đề mới "Năm nên giữ sức, sống chậm"…), NghiemChung (nhóm A "Vóc dáng & nét bên ngoài", E "Nếp sống & giai đoạn khó đã qua", bỏ câu vùng cơ thể), TuViHeThong (bỏ đoạn "Số con & giới tính", Tật Ách đổi tiêu đề "Nếp sống tổng quát / Điều nên để ý / Cách giữ gìn sức khỏe"), TongHop, PhoiNgau, CapDoi, HoiTu, BatTu*, DeHieu, ChiemTinh, HaLac, VanSau. 3/4 chuyên gia bị ngắt vì hết hạn mức, phần sót đã rà bằng grep.
- Giao diện (Script.html): hàm `hoiDoiChieu(muc, cau)` – nút Đúng / Một phần / Không đúng ở Phụ Mẫu, Huynh Đệ, Điền Trạch (Tử Vi), Xuất thân, Vóc dáng (Tổng hợp), Dáng vẻ cung Mọc (Chiêm tinh); lưu localStorage + `ghiDoiChieu` (Code.gs, sheet `DoiChieu` ẩn danh). Bỏ % ở Hồ sơ biến cố năm, kết hôn/sinh con (biểu đồ tương đối thang 10), nghề (n/6 hệ), cặp đôi, PDF. Dòng lưu ý `.tcc-luu-y` đầu kết quả + mục "Cách đọc báo cáo" PDF.
- Giữ nguyên: % đồng thuận, độ khớp nghiệm chứng/dò giờ (đó là số đo khớp, không phải dự đoán), % ngũ hành Bát Tự.

