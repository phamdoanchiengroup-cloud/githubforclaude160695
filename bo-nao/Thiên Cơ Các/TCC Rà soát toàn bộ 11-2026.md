# TCC Rà soát toàn bộ 11-2026

Nhóm: Thiên Cơ Các · Cập nhật 16/11/2026
Liên quan: [[TCC Kiểm thử]] · [[TCC Bán hàng]] · [[TCC Giao diện]] · [[TCC Văn dễ hiểu và Tổng hợp 6 hệ]] · [[Quyết định của chủ dự án]] · [[TCC Chuyên gia Agency Agents]]

## Yêu cầu (16/11)
Chủ dự án: dùng các chuyên gia rà soát toàn bộ mã, giao diện, viết bài, logic phân tích; làm lại web bố cục rõ, thân thiện; thiết kế lại miễn phí/trả phí để kéo người mua. Chốt: **rà soát trước, sửa theo đợt** · miễn phí/trả phí do chuyên gia đề xuất, chủ dự án duyệt · **được đổi cả phong cách** · báo cáo tóm tắt trong chat.

## Báo cáo (thư mục `nghien-cuu/ra-soat/`, bối cảnh chung `00-boi-canh.md`)
- `01-ma-nguon.md` (code-reviewer): nội dung trả phí lấy được qua hàm tính toán công khai; hàm vận hành không kiểm quyền; XSS qua `INITIAL_PARAMS`; tên đăng nhập toàn số bị Sheet đổi thành số; quà 50 xu > Trọn đời 49 xu; seed mật khẩu chủ trong repo công khai.
- `03-phong-cach.md` (ui-designer): 6 lớp phong cách chồng nhau, ~400 mã màu, phát sáng thừa, poster "50 XU" đầu mọi tab; đề xuất A "Hologram tinh gọn" (khuyên dùng), B "Giấy & Mực", C "Đêm Chàm"; trang mẫu `anh/ui-mau.html`.
- `04-viet-bai.md` (content-creator): tên sao/thuật ngữ còn trong tầng dễ hiểu Tử Vi (~250 câu), câu nặng, lời khuyên đầu tư nhà đất, hai tầng mâu thuẫn (tóm tắt cung theo tên sao bỏ qua điểm), văn mặc định đã có gia đình; khung bài chuẩn "Chân dung 3 dòng → 3–5 khối → 3 điều mang theo".
- `06-mien-phi-tra-phi.md` (product-manager): phương án A "Tài khoản là chìa khóa" (khuyên dùng) / B "Giữ ví xu, vá lỗ"; 5 câu hỏi chờ chủ dự án.
- `02-bo-cuc-thao-tac.md` (ux-architect) và `05-logic-phan-tich.md` (reality-checker): **dừng giữa chừng vì hết hạn mức** – gửi tin cho chính chuyên gia đó để chạy tiếp (lưu ý: tên hàm tính toán đã đổi thành dạng có "_", script nháp `anh/logic-*.js` cần sửa theo).

## Đợt 1 – bảo mật (16/11, đã đẩy; chủ dự án duyệt "oke làm đi")
- 19 hàm tính toán thành riêng: `luanChiTiet_`, `duDoanCuocDoi_`, `tongHopLuan_`, `phoiNgauLuan_`, `ketHopLuan_`, `nghiemChungLap_`, `tuviTrinhTu_`, `tuviLapLaSo_`, `batTuLap_`, `batTuChiTiet_`, `chiemTinhLap_`, `chiemTinhLuan_`, `hdLap_`, `hdLuan_`, `haLacLap_`, `haLacLuan_`, `thanSoHocLap_`, `thanSoHocLuan_`, `astToanBo_` (kể cả HAM_CAN_CO, tests, tools, bộ sinh Phi Tinh). Trường dữ liệu trả về (vd. `moRong.chiemTinhLuan`) giữ nguyên.
- `chiChayNoiBo_` / `laLichThat_` / `laChuTrinhSoan_` (TaiKhoan.gs): hàm vận hành (gửi báo cáo, bản tin, nhật vận, quét đơn, bật/tắt lịch, cài đặt, kiemTraCaiDat, test*) chỉ chạy theo lịch thật (khớp `e.triggerUid`) hoặc khi chủ dự án chạy trong trình soạn thảo. Trigger đã cài không cần cài lại.
- `thamSoAnToan_` (Code.gs) cho `INITIAL_PARAMS`; `shO_` (ThanhToan.gs) luôn thêm `'` cho chuỗi người dùng nhập khi ghi Sheet; `guiBaoCaoNgay` chỉ trả `{to}`; chủ sở hữu sau 5 lần sai chỉ đợi vài giây (cache `CHO_`), không khóa 15 phút; tài khoản không tồn tại vẫn băm; `ghiDoiChieu` tối đa 200 lần/10 phút.
- **Giữ `ALLOWALL`** (báo cáo đề xuất bỏ) vì trang qoder (thien-co-cac-…qoder.website) nhúng web Apps Script.
- Kiểm thử mới `tests/bao-mat.js` (182) + bật lại thanh-toan/tai-khoan/van-ngay; code-reviewer rà lại: không lỗi chặn, 3 góp ý mức vừa đã sửa.
- Còn mở (chờ chủ dự án): `getDoanNghiemChung` công khai lộ kết luận Tổng hợp/biến cố (V1); ranh giới vận theo năm trong tab từng hệ (V2); quà 50 xu, thưởng mời (C5); dữ liệu cũ của tài khoản toàn số trên Sheet (nếu có) cần chuyển đổi.
