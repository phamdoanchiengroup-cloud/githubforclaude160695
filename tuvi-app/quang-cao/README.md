# Quảng cáo Thiên Cơ Các

Bộ ảnh quảng cáo dựng từ ảnh gốc "Hạnh phúc nằm trong tầm tay bạn": người đàn ông đeo kính cầm chòm sao, tông navy/teal và vàng.

| File | Kích thước | Dùng cho |
|---|---|---|
| `qc-feed.png` | 1080×1350 (4:5) | Bài đăng Facebook/Instagram |
| `qc-story.png` | 1080×1920 (9:16) | Story, Reels, TikTok |
| `qc-ngang.png` | 1200×628 (1.91:1) | Ảnh bìa link, Google Display, Zalo |

## Sửa và xuất lại

- Sửa chữ trong `qc-*.html`. Màu và font chung nằm trong `chung.css`.
- Chạy `PW=<đường dẫn playwright> node render.js` để xuất lại PNG.
- Font Be Vietnam Pro và Cormorant Garamond dùng giấy phép SIL OFL, lấy từ @fontsource.
- `chan-dung.png` là chân dung đã tách khỏi chữ in sẵn trong ảnh gốc.

## Nội dung chữ gợi ý

### Mẫu A – Năm cưới, năm có con (dùng với qc-feed)

**Chữ chính:**
> Năm nào bạn gặp đúng người? Năm nào có con?
> Thiên Cơ Các đặt Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số và Human Design cạnh nhau. Chỉ những điều nhiều hệ cùng nói mới được đưa vào kết luận.
> ✦ Xem miễn phí chân dung bản thân: xuất thân, vóc dáng, tính cách, nghề hợp kèm % phù hợp.
> ♥ Mở khóa xác suất % từng năm cưới và năm có con, tuổi người phối ngẫu hợp, chân dung con cái.
> 🎉 Nạp lần đầu được tặng thêm 100% xu. Gói mở khóa từ 49.000đ.
> 👉 Nhập ngày giờ sinh, có kết quả sau 10 giây.

**Tiêu đề:** Năm nào bạn cưới? 6 hệ huyền học cùng trả lời
**Mô tả:** Chân dung bản thân miễn phí · Nạp lần đầu tặng 100% xu
**Nút:** Tìm hiểu thêm

### Mẫu B – Hạnh phúc trong tầm tay (dùng với qc-story)

**Chữ chính:**
> Hạnh phúc nằm trong tầm tay bạn – khi bạn hiểu mình là ai.
> Chỉ cần ngày giờ sinh, 6 lĩnh vực huyền học cùng luận về bạn. Bạn sẽ thấy tính cách, nghề hợp, năm cưới, năm có con và các biến cố lớn trong 30 năm tới.
> Xem thử miễn phí. Nếu thấy đúng điều mình đang thắc mắc, bạn sẽ hiểu vì sao nên xem sâu hơn.

**Tiêu đề:** Hiểu mình – để sống đúng với mình
**Nút:** Khám phá ngay

### Mẫu C – Bạn là ai? (dùng với qc-ngang)

**Chữ chính:**
> Bạn là ai theo Tử Vi, Bát Tự, Chiêm tinh, Thần số và Human Design?
> Một lá số tổng hợp, một bản đồ về bạn. Điểm số theo thang 10 và % phù hợp rõ ràng. Có thể xuất PDF để lưu lại.

**Tiêu đề:** 6 hệ huyền học · 1 bản đồ về bạn
**Mô tả:** Xem miễn phí chân dung bản thân

## Lưu ý khi chạy quảng cáo

- Không cam kết kết quả tuyệt đối. Chỉ nên dùng các cụm như "xác suất", "tham khảo", "luận giải".
- Meta xếp nội dung chiêm tinh vào nhóm nhạy cảm. Hạn chế nhắm mục tiêu theo tình trạng hôn nhân.
- Chữ không nên phủ quá 20% diện tích ảnh. Ảnh `qc-ngang` hợp để chạy phạm vi rộng.
- Gắn `?ref=MÃ` vào link của từng chiến dịch để đo số người đăng ký qua mã giới thiệu.
