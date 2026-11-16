# 03 – Rà soát phong cách hình ảnh (16/11/2026)

Người rà: chuyên gia **ui-designer**. Phạm vi: `tuvi-app/Styles.html` (2736 dòng, mã giao diện `2026.11.1.5`), `Holo.html`, ảnh chụp bản xem trước. **Không sửa mã web.**
Ảnh: `nghien-cuu/ra-soat/anh/ui-*.png` (390 px = điện thoại, 1366 px = máy tính). Trang mẫu hướng khuyên dùng: `anh/ui-mau.html` → `anh/ui-mau-390.png`, `anh/ui-mau-1366.png`.

## Tóm tắt 5 dòng
1. Styles.html là **6 lớp phong cách chồng lên nhau** (Huyền Bí → Thanh Thủy → Bạch Kim → Kim Sa Trầm → Chuyên nghiệp → Hologram), lớp sau đè lớp trước: 400 mã màu hex khác nhau, 66 `!important`, 26 hiệu ứng chuyển động – khó sửa, dễ lệch màu.
2. Chữ thân bài đủ tương phản trên thẻ đặc (8,5:1), nhưng **chữ nhỏ trên nền tranh thì không**: ô lá số Tử Vi phủ tối 58% → chữ phụ chỉ 3,1–4,1:1 (dưới chuẩn 4,5:1); bảng Bát Tự trên điện thoại có chữ 7–8 px.
3. Quá nhiều thứ "phát sáng" cùng lúc: tranh nền, chữ chuyển màu, nút cyan phát quang, tab vàng phát quang, vòng xoay, nút thở – mắt không biết nhìn đâu; với người 22–40 cảm giác giống **trò chơi/quảng cáo** hơn là nơi đọc luận giải đáng tin.
4. Nút và thẻ không thống nhất: trên một tab có 5–6 kiểu nút (bo 4/6/8/10/14/999 px), 4 họ chữ (Be Vietnam Pro, Chakra Petch, Noto Serif, Ma Shan Zheng) + Cormorant tải về nhưng gần như không dùng.
5. Khuyên dùng **Hướng A – "Hologram tinh gọn"**: giữ nền xanh đêm + cyan + vàng champagne mà chủ dự án đã chốt, giữ tranh và 6 bảng Holo, nhưng gom về **một bộ token**, thẻ nền đặc cho chữ dài, 3 cấp nút, bỏ phát sáng/chữ chuyển màu ngoài phần mở đầu.

## Bằng chứng chính
| Ảnh | Thấy gì |
|---|---|
| `ui-390-trang-chu.png`, `ui-1366-chart.png` | Khách vào bất kỳ tab nào, màn đầu tiên là poster "50 XU" khổng lồ + bảng giá 49/47 xu – trái quyết định "không nhắc tiền ở lời mời đầu". Lá số nằm dưới màn thứ hai. |
| `ui-390-chart.png` | Trên điện thoại, trước lá số là khối kiểm chứng + 2 hàng ô tick + 3 nút viền → lá số chỉ hiện ở đáy màn hình; thanh mời mua cố định chiếm ~15% chiều cao màn. |
| `ui-390-battu.png`, `ui-1366-battu.png` | Bảng Holo Bát Tự đẹp ở máy tính; ở 390 px bị cắt hai bên, chữ trong tranh 7–8 px, không đọc được. |
| `ui-390-moi-mua.png`, `ui-390-vh.png` | Thanh mời mua dưới đáy + nút "Mở · 9 xu" màu cyan phát sáng giống hệt nút chính khác → mọi nút đều "hét", mức ưu tiên không rõ. |
| `ui-1366-tong-giua.png`, `ui-1366-moi-mua.png` | Ảnh chân dung nhỏ cố định góc trái dưới (`.tcc-goc-anh`) **đè lên mục lục** ("…ng đời & sự nghiệp"). Đồ thị đường vận đặt trên tranh người đứng trước cổng – nét đồ thị lẫn với tranh. |
| `ui-390-tong-giua.png` | Bánh xe 9 lĩnh vực: nhãn số 4,8 / 6,2 xám nhạt nhỏ, ổ khóa 🔒 lặp 8 lần → cảm giác "bị khóa hết". |

Số đo tương phản (WCAG, chuẩn AA là 4,5:1 với chữ thường):

| Cặp màu | Tỷ lệ | Đánh giá |
|---|---|---|
| Chữ chính `#EAF4FF` trên thẻ `#0D1B30` | 15,5 | Tốt |
| Chữ phụ `#A8B8CC` trên thẻ | 8,5 | Tốt |
| Giá gạch `#7F97B5` trên thẻ | 5,8 | Đạt |
| Chữ phụ ô Tử Vi `#A8C0D8` trên ô phủ 58% đặt lên vùng tranh sáng vàng | 4,1 | **Không đạt** |
| Vòng Tràng Sinh `#8FA6C2` trên cùng ô đó | 3,1 | **Không đạt** |
| Chữ phụ trên thẻ phủ 88% đặt lên vùng tinh vân sáng | 6,9 | Đạt (nhờ đợt 25/10) |
| Nút cyan: chữ `#021018` trên `#5CEBFF` | 13,6 | Tốt |

Thống kê chữ trên tab (390 px): Tử Vi 128 khối chữ 11 px + 6 khối 10 px; Bát Tự 21 khối 7 px, 39 khối 8 px, 183 khối 11 px.

## Vấn đề & đề xuất

### Mức Cao
| # | Chỗ | Vấn đề | Đề xuất | Công sức |
|---|---|---|---|---|
| C1 | Styles.html dòng 8–55, 1684–1841, 1965–2062, 2339–2400 | 6 lớp phong cách đè nhau; token `:root` khai báo 2 lần (Bạch Kim rồi Hologram); 400 mã hex, nhiều màu nâu/vàng hồng cũ viết thẳng (vd. dòng 1048–1080 dùng `rgba(227,185,138…)`). | Viết lại **một** khối token duy nhất (bảng màu Hướng A bên dưới), xóa token Bạch Kim; thay màu viết thẳng bằng biến. Làm theo từng vùng, chụp so sánh trước/sau. | L |
| C2 | Lá số Tử Vi (`#chartArea.xem-holo .cung`, dòng ~2384) | Ô cung phủ 58% trên tranh → chữ phụ 3,1–4,1:1; chữ 10–11 px trên điện thoại. | Tăng phủ ô lên ~78% (`rgba(4,10,26,.78)`), chữ nhỏ nhất 12 px trên điện thoại, chữ phụ sáng hơn `#B8C8DA`. Giữ nguyên cách xếp sao (bài học 23/10). | S |
| C3 | Bảng Holo Bát Tự trên điện thoại (Holo.html) | Chữ 7–8 px, bảng cắt hai mép. | Dưới 640 px: ẩn tranh bảng Holo, thay bằng bảng 4 trụ dạng thẻ chữ ≥13 px (dữ liệu đã có ở bảng chi tiết bên dưới); tranh để xem phóng to khi bấm. | M |
| C4 | Poster quà (`.poster-qua`, dòng 2425–2462) đặt đầu mọi tab cho khách | Lời mời đầu tiên toàn chữ "xu", giá – trái quyết định của chủ dự án; đẩy lá số xuống màn 2. | Đưa poster ra khỏi đầu tab; lời mời chỉ còn "Tạo tài khoản miễn phí – đọc tiếp luận giải" (xem khối mời trong `ui-mau.html`). Bảng giá chỉ hiện khi người dùng bấm "Mở". | S (phối hợp báo cáo bán hàng) |
| C5 | Nút (`.btn-primary` dòng 2368, `.pq-go` 2456, nút "Mở · 9 xu") | Nút chính có gradient + quầng sáng + nút "thở" liên tục; mọi nút mua đều là nút chính → không rõ đâu là việc quan trọng nhất. | 3 cấp nút: **chính** (cyan đặc, mỗi màn tối đa 1), **phụ** (viền), **chữ** (liên kết). Cao 48 px, bo 10 px. Bỏ `box-shadow` phát sáng và `animation: pqTho`. | S |

### Mức Vừa
| # | Chỗ | Vấn đề | Đề xuất | Công sức |
|---|---|---|---|---|
| V1 | Kiểu chữ (Index.html dòng 11) | Tải 6 họ chữ (Be Vietnam Pro, Chakra Petch, Cormorant, Noto Serif, Ma Shan Zheng, Noto Sans Symbols 2) – chậm trên 4G; tiêu đề lẫn lộn chữ có chân/không chân. | Giữ **Be Vietnam Pro** (mọi chữ) + **Chakra Petch** (chỉ số liệu, nhãn ngắn). Bỏ Cormorant, Noto Serif, Ma Shan Zheng (đã bỏ chữ Hán khỏi văn). Thang cỡ chữ: 12 / 14 / 16 / 18 / 22 / 28. | S |
| V2 | Chữ chuyển màu (dòng 149, 892, 959, 2083, 2098, 2103, 2117, 2438) | 8 chỗ chữ gradient (tên thương hiệu, tên người, con số) → khó đọc, kém trang nhã. | Chữ đặc: tên người `#EAF2FB`, con số `#E6C27A`. | S |
| V3 | Thanh tab | Tab đang chọn là khối vàng phát sáng; điện thoại có tab cuộn ngang + nút "Mục lục" vàng → 2 điểm nhấn vàng cạnh nhau. | Tab kiểu gạch chân cyan 2 px (như mẫu); "Mục lục" là nút phụ. | S |
| V4 | `.tcc-goc-anh` (dòng ~2473) | Ảnh góc đè mục lục ở máy tính. | Đặt ảnh chủ dự án trong thẻ "Về tác giả"/chân trang, bỏ vị trí cố định (vẫn giữ ảnh – yêu cầu bắt buộc). | S |
| V5 | Tranh sau biểu đồ (`ui-1366-moi-mua.png`) | Đồ thị đường vận đặt trên tranh có hình người → nét đồ thị lẫn vào tranh. | Biểu đồ và chữ dài luôn trên thẻ nền đặc; tranh chỉ ở dải đầu trang/đầu tab (cao ≤ 240 px, mờ dần). | M |
| V6 | Bo góc và khoảng cách | Bo 4/6/8/10/14/18/22/999 px; khoảng cách lẻ (13, 14, 26 px). | Bo: thẻ 12, nút 10, chip 999. Khoảng cách bậc 4: 4/8/12/16/24/32. | M |
| V7 | Hiển thị số % (Bát Tự "77,3%", Tổng hợp "đồng thuận 53%") | Trái quyết định "bỏ %"; về hình ảnh số % lớn tạo cảm giác "máy chấm điểm". | Đổi sang chữ mức độ (Vượng / Cân bằng / Nhược; Thuận / Cần vun đắp / Cần chăm chút) – mẫu ở `ui-mau.html`. | S (phối hợp báo cáo nội dung) |

### Mức Thấp
| # | Chỗ | Vấn đề | Đề xuất | Công sức |
|---|---|---|---|---|
| T1 | Emoji trong tab (🔒 💞 👪 ⏳) và ổ khóa lặp trên bánh xe | Lẫn kiểu biểu tượng; 8 ổ khóa → cảm giác bị chặn. | Một bộ biểu tượng nét mảnh (SVG nội tuyến); vùng khóa dùng một dải "Đọc tiếp" thay vì khóa từng quả cầu. | M |
| T2 | 26 `@keyframes` | Xoay, thở, quét – tốn pin điện thoại. | Giữ: hiện dần khi cuộn, đếm số, lá số "an sao". Bỏ: vòng xoay poster, nút thở, quét sáng. | S |
| T3 | Bản in `.theme-light` | Còn tông nâu Kim Sa Trầm ở một số chip. | Khi làm C1 đưa bản in về cùng bộ token (nền giấy, chữ xanh than). | S |

## Ba hướng phong cách

### Hướng A – "Hologram tinh gọn" (KHUYÊN DÙNG)
Giữ tinh thần Hologram chủ dự án đã chốt 23/10, bớt ồn.
| Vai trò | Mã |
|---|---|
| Nền trang | `#070D1A` |
| Thẻ | `#0F1A2E` (đặc, không trong suốt khi có chữ dài) |
| Thẻ nổi / ô phụ | `#15233B` |
| Viền / viền đậm | `#22324D` / `#2F4566` |
| Chữ chính / phụ / mờ | `#EAF2FB` / `#A9B7C9` / `#8496AD` |
| Cyan – chỉ cho thứ bấm được | `#5CE1F5` (hover `#8BEBF9`) |
| Vàng champagne – điều quan trọng, số liệu, đã mở khóa | `#E6C27A` |
| Tốt / vừa / cần chăm chút | `#6FD8A2` / `#E6C27A` / `#F29A8E` |
| Tím `#B38CFF` | chỉ trong biểu đồ (màu hệ), không dùng cho giao diện |

- **Chữ:** Be Vietnam Pro 400/600/700 cho mọi thứ; Chakra Petch 600/700 chỉ cho con số và nhãn ngắn. Thân bài 16 px/1,65.
- **Thẻ:** nền đặc `#0F1A2E`, viền 1 px `#22324D`, bo 12 px, đệm 24 px; nhãn nhỏ viết hoa xám trên tiêu đề 22 px; khối "Gợi ý" viền trái vàng (tầng 2 luôn có hướng khắc phục); "Xem căn cứ chuyên môn" là mục mở/đóng ở cuối thẻ.
- **Nút:** chính = cyan đặc, chữ `#04121A`; phụ = viền `#2F4566`; chữ = liên kết cyan. Cao 48 px, bo 10 px, không phát sáng.
- **Tranh:** chỉ dải đầu trang/đầu tab và 6 bảng Holo (máy tính); không đặt sau chữ dài.
- **Ưu:** không đi ngược quyết định của chủ dự án; dùng lại toàn bộ tranh, ảnh, bảng Holo; chuyển đổi dần theo token, rủi ro thấp; tương phản đạt AA ở mọi chỗ.
- **Nhược:** bớt "lung linh" so với bản hiện tại – chủ dự án có thể thấy hơi "phẳng"; vẫn là nền tối (một số người đọc lâu thích nền sáng).

### Hướng B – "Giấy & Mực" (nền sáng, kiểu tạp chí)
| Vai trò | Mã |
|---|---|
| Nền / thẻ | `#F6F2EA` / `#FFFFFF` |
| Viền | `#E4DCCB` |
| Chữ chính / phụ | `#1C2333` / `#5A6272` |
| Nhấn bấm được (chàm) | `#2F4AA0` |
| Vàng đồng (điểm nhấn, số liệu) | `#A9792B` |
| Tốt / vừa / khó | `#2E7D55` / `#A9792B` / `#B5473A` |

- **Chữ:** Noto Serif 700 cho tiêu đề, Be Vietnam Pro cho thân bài.
- **Thẻ/nút:** thẻ trắng bóng đổ rất nhẹ, bo 10 px; nút chính chàm đặc chữ trắng, nút phụ viền chàm.
- **Ưu:** dễ đọc nhất cho bài dài, trông "chuyên gia", đồng bộ với bản PDF sáng; tải nhanh.
- **Nhược:** đi ngược lựa chọn nền tối/Hologram của chủ dự án; tranh tiên cảnh tối không hợp, phải làm lại 6 bảng Holo; mất chất huyền bí. Có thể dùng làm **"chế độ đọc"** tùy chọn sau này.

### Hướng C – "Đêm Chàm" (tối ấm, tối giản kiểu ứng dụng thiền)
| Vai trò | Mã |
|---|---|
| Nền / thẻ / thẻ nổi | `#110F1C` / `#1B1830` / `#252140` |
| Viền | `#332E52` |
| Chữ chính / phụ | `#F3F0FA` / `#B5AFCB` |
| Nhấn bấm được (hổ phách) | `#F2B66D` |
| Nhấn phụ (oải hương) | `#A99BFF` |
| Tốt / khó | `#7BD3A8` / `#F08F86` |

- **Chữ:** Be Vietnam Pro toàn bộ, tiêu đề 700, chữ số dạng bảng (tabular).
- **Thẻ/nút:** bo 16 px, nút chính hổ phách chữ `#1B1206`, bo tròn hẳn.
- **Ưu:** hiện đại, ấm, hợp người trẻ; khác biệt với các trang tử vi truyền thống.
- **Nhược:** đổi hẳn màu nhận diện (bỏ cyan/vàng đã chốt); tranh Hologram tông xanh lệch màu với nền chàm tím; phải chụp lại mọi tab.

### Vì sao chọn A
Chủ dự án đã chọn nền tối 3 lần (Kim Sa Trầm, Bạch Kim, Hologram) và có đầu tư lớn vào tranh/bảng Holo. Vấn đề hiện tại **không nằm ở bảng màu Hologram** mà nằm ở việc chồng lớp, phát sáng thừa, chữ đặt trên tranh và mời mua quá sớm. Hướng A sửa đúng những chỗ đó với ít rủi ro nhất. Trang mẫu: `anh/ui-mau.html` (đạt tương phản AA, không tràn ngang ở 390 và 1366 px; khối mời đọc tiếp không nhắc xu).

## Đề xuất chia đợt sửa
1. **Đợt 1 – sửa nhanh, rõ hiệu quả (S, ~1 phiên):** C2 (ô Tử Vi dễ đọc), C5 (3 cấp nút, bỏ phát sáng), V2 (bỏ chữ chuyển màu), V4 (ảnh góc), T2 (bớt chuyển động). Chụp trước/sau 390/1366.
2. **Đợt 2 – bố cục khách (S–M, phối hợp báo cáo bán hàng/UX):** C4 (bỏ poster xu đầu tab, khối "Đọc tiếp miễn phí"), V3 (tab gạch chân), V7 (bỏ %), T1 (vùng khóa gọn).
3. **Đợt 3 – dọn nền móng (L, 2–3 phiên):** C1 (một bộ token Hướng A, xóa các lớp cũ), V1 (2 họ chữ), V6 (bo góc/khoảng cách), T3 (bản in), V5 (tranh chỉ ở đầu trang). Chạy đủ kiểm thử giao diện và PDF.
4. **Đợt 4:** C3 (Bát Tự điện thoại dạng thẻ chữ), xem xét "chế độ đọc" sáng theo Hướng B.

Mỗi đợt tăng 3 mã phiên bản giao diện (Index/Styles/Script) như quy tắc.
