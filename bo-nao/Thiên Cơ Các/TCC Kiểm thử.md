# TCC Kiểm thử

Nhóm: Thiên Cơ Các · Tách từ CLAUDE.md ngày 21/10/2026
Liên quan: [[TCC Lịch sử lá số]] · [[TCC Lá số 3D]] · [[00 Mục lục]]

```bash
cd tuvi-app
node tests/cai-dat.js                          # bộ kiemTraCaiDat: HAM_CAN_CO đủ file, BAN_MOI_CAN_CO khớp mã hiện tại (tránh báo nhầm "bản cũ")
node tests/bao-cao.js                          # báo cáo ngày cho chủ sở hữu: số liệu 24h/7/30 ngày, người nhận, trigger 7 giờ
node tests/giai-doan.js                        # bán theo giai đoạn, gói gia đình, phần cắt ở máy chủ (34 kiểm tra)
node tests/lich-su.js                          # lịch sử: lá số trùng chỉ giữ bản mới nhất, ẩn trùng, dọn trùng
node tests/nghiem-chung.js                     # nghiệm chứng dựa trên tổng hợp 6 hệ
node tests/tong-hop.js                         # Tổng hợp 6 hệ bản 2: nhãn khớp điểm, không tên sao, bản miễn phí chỉ lộ 1 lĩnh vực
node tests/ho-so-nam.js                        # Hồ sơ biến cố năm: 19 sự kiện, xác suất, đồng thuận/đối lập, bản khóa
node tests/chuyen-sau.js                       # tab Lá số chủ sở hữu: bộ sao đúng sao/địa chi/cung, Thương ở Nô – Sứ ở Tật – kẹp Thiên Di, 12 đại vận, năm hệ trọng, thọ khí không đoán tuổi mất, chặn người không phải chủ (32.770 kiểm tra trên 300 lá số)
node tests/tam-phap.js                        # Tử Vi đối chiếu các phái: ba vòng nhân sinh, 8 thế Mệnh – Thân, vận Thái Tuế, Lai Nhân (đối chiếu iztro), tự hóa, phi hóa
node tests/van-sau.js                          # Vận hạn chuyên sâu: 12 tháng, hiệu chỉnh, đại vận 5 hệ, 12 cung lưu niên, nhật vận, ứng kỳ Mai Hoa
node tests/bat-tu.js                           # Bát Tự 9 bước trên 400 lá số
node tests/ha-lac.js                           # Hà Lạc lục hào nạp giáp (bát cung, lục thân, phục thần) trên 200 lá số
node tests/than-so.js                          # Thần số học 6 bước (nợ nghiệp, số 0, số bậc thầy…) trên 300 lá số
node tests/chiem-tinh.js                       # Chiêm tinh 7 bước: Chiron/Lilith, cấu hình, 8 lĩnh vực, chu kỳ, so sánh (~40 giây)
node tests/human-design.js                     # Human Design 11 bước; đối chiếu màu Mặt Trời với hd-chart-engine nếu đã npm install trong tests/
node tests/chiem-tinh.js   # (23/10) + công thức Phần may mắn/tinh thần theo phe ngày/đêm
node tests/van-ngay.js                         # luận giải hằng ngày qua email: 7 lá số × 12 ngày, không tên sao, ngày xung không khuyên việc lớn, đủ 4 lĩnh vực/4 hệ/3 buổi, không mâu thuẫn lịch cổ, ngày mai không viết "hôm nay", quyền, trigger bản Zalo (≤1900 ký tự/tin, chỉ lá số chủ sở hữu) (1599 kiểm tra; TK_PASS cho phần chủ sở hữu)
node tests/tien-ich.js                         # 7 tiện ích bán lẻ: công thức, miễn phí/trả phí, mua, gieo quẻ, bản tin (55 kiểm tra)
TK_PASS='<mật khẩu chủ>' node tests/tai-khoan.js   # cần mật khẩu chủ sở hữu – hỏi chủ dự án hoặc đặt biến môi trường TK_PASS
TK_PASS='<mật khẩu chủ>' node tests/thanh-toan.js
cd tests && npm install && node thien-van.mjs && node doi-chieu.js   # đối chiếu thiên văn / an sao với thư viện nguồn mở
```
- **Mô phỏng Apps Script:** `tools/gia-lap.js` gồm Sheet trong bộ nhớ, Properties, Cache, Lock và payOS giả. Dùng `const { ctx } = require('./tools/gia-lap.js')`, rồi gọi thẳng các hàm `.gs`.
- **Xem giao diện:**
  - `python3 tools/xem-truoc.py` → `tools/preview.html`. `google.script.run` được thay bằng `window.srv`.
  - `PW=/opt/node22/lib/node_modules/playwright node tools/chup.js` chụp các tab (`W=390` để giả điện thoại).
  - Không chạy `playwright install`; Chromium có sẵn.
- **Xuất thử PDF:** `tools/xuat-pdf.js` (cần `npm install --no-save html2canvas@1.4.1 jspdf@2.5.1` trong tests/) – xem [[TCC PDF]].
- **Kiểm tra cú pháp:** `.gs` thì copy ra `.js` rồi `node --check`. `Script.html` thì trích nội dung `<script>` rồi `node --check`.
- **Giới hạn mạng:** WebFetch bị chặn với một số trang tiếng Việt (vd. lasobattu.com, 4thuman.com); WebSearch dùng được.
- **Thêm file `.gs` mới:** phải thêm vào `HAM_CAN_CO` trong Code.gs (hàm `kiemTraCaiDat`) và cập nhật số file trong HUONG-DAN-CAI-DAT.md.
- **`BAN_MOI_CAN_CO` = [hàm, chuỗi phải có trong thân hàm đó]:** chọn đúng hàm thực sự chứa lời gọi (đã từng đặt nhầm `htHoiTu_` thay vì `htTinHieu_` → chủ dự án dán đúng vẫn bị báo bản cũ). Luôn chạy `node tests/cai-dat.js`.
