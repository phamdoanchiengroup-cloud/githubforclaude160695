# Bối cảnh chung cho đợt rà soát toàn bộ Thiên Cơ Các (16/11/2026)

Chủ dự án yêu cầu: rà soát toàn bộ mã, giao diện, cách viết bài, logic phân tích từng khía cạnh, thiết kế lại phần đọc miễn phí / trả phí để lôi kéo người mua; làm lại web có bố cục rõ, thân thiện, dễ thao tác. **Đợt này CHỈ rà soát và đề xuất – không sửa mã, không commit.** Sửa theo đợt sau khi chủ dự án duyệt. Chủ dự án cho phép đổi cả phong cách giao diện (hiện là Hologram).

## Dự án
- Web app Google Apps Script, thư mục `tuvi-app/` (vai trò từng file: `tuvi-app/README.md`). 32 file .gs (máy chủ, ES5), giao diện `Index.html` + `Styles.html` + `Script.html` (một trang, nhiều tab). Người dùng mua nội dung bằng **xu** (payOS).
- 6 hệ: Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số học, Human Design; thêm Tổng hợp 6 hệ, Vận hạn, Cặp đôi, Gia đình, Tham khảo, tab chỉ chủ sở hữu (👑, ✶ Phi Tinh).
- Bộ não dự án (lịch sử quyết định): `bo-nao/` – đọc `bo-nao/Quyết định của chủ dự án.md`, `bo-nao/Thiên Cơ Các/TCC Giao diện.md`, `TCC Bán hàng.md`, `TCC Văn dễ hiểu và Tổng hợp 6 hệ.md`, `TCC Sáu hệ.md` khi cần.

## Quy tắc chủ dự án đã chốt (đề xuất không được trái)
- Văn hai tầng: tầng dễ hiểu (không tên sao, thuật ngữ cổ phải giải nghĩa, không chữ Hán, "Bạn thuộc mẫu người… / có xu hướng…", giọng nhẹ nhàng không phán xét, luôn kèm hướng khắc phục) + tầng căn cứ chuyên môn; hai tầng không mâu thuẫn.
- Bỏ %/xác suất/số con/tỷ lệ trai–gái; không chẩn đoán sức khỏe; không đoán chết/bệnh/ly hôn; dòng lưu ý "góc nhìn cổ học để tham khảo và tự suy ngẫm".
- Chủ dự án không thích nhắc tiền/xu ở lời mời đầu ("nghe mất tiền là không thích") – lời mời kiểu "tạo tài khoản miễn phí, đọc luận giải miễn phí".
- Người dùng chính: 22–40 tuổi, dùng điện thoại.
- Không ghi ngày giờ sinh của chủ dự án vào repo.

## Công cụ chạy thử (phiên đám mây Linux)
- Giả lập máy chủ: `tuvi-app/tools/gia-lap.js` (xuất `ctx` gọi mọi hàm .gs). Kiểm thử: `cd tuvi-app && node tests/<ten>.js`.
- Xem trước giao diện: `cd tuvi-app && python3 tools/xem-truoc.py` → `tools/preview.html`; chụp bằng Playwright (`require('/opt/node22/lib/node_modules/playwright')`, KHÔNG chạy `playwright install`), mẫu ở `tuvi-app/tools/chup.js` (W=390 cho điện thoại). Khi chụp phải thêm CSS `.cho-hien{opacity:1!important;transform:none!important}`. Muốn đóng vai chủ sở hữu: đặt `ctx.tkPhien_ = () => ({ ten: 'chu', vaiTro: 'chu' })` và `localStorage.tcc_token='x'`.
- Ảnh chụp và file nháp: để trong `nghien-cuu/ra-soat/anh/` (tạo nếu chưa có), đặt tên có tiền tố của mình.

## Đầu ra của mỗi chuyên gia
Một file `nghien-cuu/ra-soat/<số>-<tên>.md` (tiếng Việt): tóm tắt 5 dòng → danh sách vấn đề/đề xuất xếp theo mức (Cao / Vừa / Thấp), mỗi mục: chỗ (file:dòng hoặc tab/khối), vấn đề, bằng chứng (ảnh, đoạn văn, số liệu), đề xuất cụ thể, công sức ước lượng (S/M/L) → đề xuất chia đợt sửa. Trả lời người gọi bằng bản tóm tắt ≤ 15 dòng.
