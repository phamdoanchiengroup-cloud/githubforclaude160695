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
- `02-bo-cuc-thao-tac.md` (ux-architect, 55 ảnh): màn đầu điện thoại là poster 50 xu + bảng giá, form ở màn thứ 4; tab mặc định "Tổng Quan 6 Hệ 🔒" đang khóa; trang từng hệ quá dài (Bát Tự ~60 màn điện thoại); 13 tab ngang; lá số Tử Vi điện thoại chữ 4–5px. Đề xuất: đáy 4 mục (Lá số · Vận hạn · Hợp đôi · Tôi), chip 6 hệ, trang Tóm lược miễn phí mặc định, mỗi hệ khung 3 tầng (Tóm lược → 6 chủ đề → Căn cứ). Form Nghiệm chứng điền sẵn 16/6/1995 giờ 4 (Index.html:509) – hỏi chủ dự án.
- `05-logic-phan-tich.md` (reality-checker, 160 lá số): bước 26 Tử Vi dùng điểm gốc cung thay điểm vận (lệch Tiểu vận 53%); Tổng hợp 6 hệ 9,5% câu tự mâu thuẫn, 22% lĩnh vực chỉ 2 hệ; thang điểm lệch từng hệ (Tử Vi ~70% thuận, Chiêm tinh 11%); vận năm/tháng ít khớp; Hồ sơ biến cố năm (bán) 57% câu trùng; nghiệm chứng 6/8 vẫn chỉ "Có thể đúng" (điều kiện 70%, NghiemChung.gs:72); còn % 4 chỗ; giờ Tý muộn đúng.

## Đợt 1 – bảo mật (16/11, đã đẩy; chủ dự án duyệt "oke làm đi")
- 19 hàm tính toán thành riêng: `luanChiTiet_`, `duDoanCuocDoi_`, `tongHopLuan_`, `phoiNgauLuan_`, `ketHopLuan_`, `nghiemChungLap_`, `tuviTrinhTu_`, `tuviLapLaSo_`, `batTuLap_`, `batTuChiTiet_`, `chiemTinhLap_`, `chiemTinhLuan_`, `hdLap_`, `hdLuan_`, `haLacLap_`, `haLacLuan_`, `thanSoHocLap_`, `thanSoHocLuan_`, `astToanBo_` (kể cả HAM_CAN_CO, tests, tools, bộ sinh Phi Tinh). Trường dữ liệu trả về (vd. `moRong.chiemTinhLuan`) giữ nguyên.
- `chiChayNoiBo_` / `laLichThat_` / `laChuTrinhSoan_` (TaiKhoan.gs): hàm vận hành (gửi báo cáo, bản tin, nhật vận, quét đơn, bật/tắt lịch, cài đặt, kiemTraCaiDat, test*) chỉ chạy theo lịch thật (khớp `e.triggerUid`) hoặc khi chủ dự án chạy trong trình soạn thảo. Trigger đã cài không cần cài lại.
- `thamSoAnToan_` (Code.gs) cho `INITIAL_PARAMS`; `shO_` (ThanhToan.gs) luôn thêm `'` cho chuỗi người dùng nhập khi ghi Sheet; `guiBaoCaoNgay` chỉ trả `{to}`; chủ sở hữu sau 5 lần sai chỉ đợi vài giây (cache `CHO_`), không khóa 15 phút; tài khoản không tồn tại vẫn băm; `ghiDoiChieu` tối đa 200 lần/10 phút.
- **Giữ `ALLOWALL`** (báo cáo đề xuất bỏ) vì trang qoder (thien-co-cac-…qoder.website) nhúng web Apps Script.
- Kiểm thử mới `tests/bao-mat.js` (182) + bật lại thanh-toan/tai-khoan/van-ngay; code-reviewer rà lại: không lỗi chặn, 3 góp ý mức vừa đã sửa.
- Còn mở (chờ chủ dự án): `getDoanNghiemChung` công khai lộ kết luận Tổng hợp/biến cố (V1); ranh giới vận theo năm trong tab từng hệ (V2); quà 50 xu, thưởng mời (C5); dữ liệu cũ của tài khoản toàn số trên Sheet (nếu có) cần chuyển đổi.

## Chủ dự án chốt (16/11)
- Miễn phí/trả phí: **phương án A "Tài khoản là chìa khóa"** (Đợt 3). Phong cách: **A – Hologram tinh gọn** (Đợt 4). Nghiệm chứng: **sửa đúng quy tắc 6/8**. Làm Đợt 2 ngay.

## Đợt 2 – gỡ chỗ gây khó chịu (16/11, mã 2026.11.16.1)
- Giao diện (Script/Index/Styles): poster "50 xu + 3 gói giá" → khung "Tạo tài khoản miễn phí" (`vePosterQua`, ẩn khi `body.co-ket-qua`); lời mời khách không nhắc xu (`tinhTrangMua` dùng `phan: 'dang_ky'` → `data-dang-ky`; `moDangNhap` ẩn dòng quà); tab mở đầu `chart` khi Tổng hợp khóa; bỏ "năm sinh con kèm %" (Index, Cặp đôi); lỗi số tiền hộp nạp; ngưỡng ghi cho khách 6 / 4,8; ô nhập 16px trên điện thoại; xóa ngày giờ điền sẵn form Nghiệm chứng; "Biến cố hội tụ" → "Những năm đáng chú ý" (cả tên phần trong bảng giá ThanhToan.gs).
- Logic: bước 26 Tử Vi lấy mức từ `chiTiet.daiVan` (isNow) / `chiTiet.tieuVan` (TuViTrinhTu.gs); Tổng hợp 6 hệ chỉ "thế mạnh/nên chăm chút" khi ≥3 hệ, ≥ nửa cùng chiều, không hệ ngược (`chac`, `nguoc` trong `th6Lap_`); nghiệm chứng 6/8 đúng quy tắc, phải chấm đủ 8 nhóm (`CHUA_DU`), bỏ câu số con / trai – gái; lời mồi sợ trong `TaiKhoan.gs` (teaser).
- Văn (content-creator, ~70 câu): TuViHeThong.gs (bỏ lời khuyên đầu tư nhà đất, câu nặng, "cha mẹ có thể mất sớm"), ThanSoHoc.gs ("Thiếu 9", 7 mũi tên trống tên trung tính), HoiTu.gs (nhãn "Hao tài"…), TongHop.gs (mục Cơ thể → "Nhịp sống hợp với bạn").
- Giữ % đồng thuận / % ngũ hành (quyết định 24/10). Kiểm thử: 25 file đạt (nghiem-chung 834 có ca 6/8, 4/8, chưa đủ 8 nhóm).
- Còn lại cho đợt sau: ~250 câu Tử Vi có tên sao (tách de/ky), câu nặng trong DeHieu.gs/TuViTrinhTu.gs, TS_SUC_KHOE (Thần số), văn trùng lặp phần bán.
