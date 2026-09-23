# Thiên Cơ Các – Web App Lá Số Tử Vi & Bát Tự (Google Apps Script)

Web app lập lá số **Tử Vi Đẩu Số 12 cung** (phái Việt Nam) kết hợp **Bát Tự – Tứ Trụ**, nhập ngày sinh theo **Dương lịch hoặc Âm lịch** (có tháng nhuận), lưu lịch sử vào **Google Sheet**. Giao diện sáng, phong cách tiên hiệp.

## Các file

| File | Vai trò |
|---|---|
| `Code.gs` | `doGet`, API `lapLaSo`, `doiLich`, lưu/đọc/xóa lịch sử trên Sheet |
| `Lunar.gs` | Âm lịch Việt Nam (thuật toán Hồ Ngọc Đức, GMT+7), kinh độ mặt trời, tiết khí |
| `TuVi.gs` | An Mệnh/Thân, Cục, 14 chính tinh + miếu hãm, ~90 phụ tinh, Tứ Hóa, vòng Tràng Sinh / Bác Sĩ / Thái Tuế, Tuần, Triệt, Đại hạn, Tiểu hạn, lưu niên, luận giải & cách cục |
| `BatTu.gs` | Tứ trụ theo tiết khí, tàng can, thập thần, nạp âm, trường sinh, vượng suy, dụng thần, thần sát, hợp–xung–hình–hại, đại vận, tổng luận kết hợp |
| `LuanGiai.gs` | Luận chuyên sâu: 12 cung (cơ sở lý luận, bộ chính tinh, tam phương tứ chính, nhị hợp, giáp cung, bộ phụ tinh, sao đặc thù), Đại vận (Tứ Hóa & Lộc Kình Đà đại vận, cung chức hạn, đối chiếu Bát Tự), Tiểu vận (lưu tinh, trùng phùng), Nguyệt vận 12 tháng, Nhật vận 7 ngày (Hoàng/Hắc đạo, Thập nhị trực, giờ tốt) |
| `BatTuChiTiet.gs` | Luận Bát Tự chi tiết: cung vị tứ trụ (Niên – Nguyệt – Nhật – Thời theo độ tuổi), lục thân theo thập thần, cách cục (chính cách theo nguyệt lệnh thấu can, ngoại cách Tòng/Chuyên vượng/Hóa khí, điều kiện thành – phá), thập thần & tính cách, ngũ hành – tạng phủ, thần sát mở rộng (Thiên/Nguyệt Đức, Thái Cực, Học Đường, Kim Dư, Tướng tinh, Kiếp – Tai sát, Khôi Cương, Âm Dương sai thác, Cô Loan…), đại vận tác động cung vị |
| `DuDoan.gs` | Suy luận cả đời (tuổi 1–90): vận hạn lớn (đại vận tốt/xấu nhất, mốc giao vận), các năm dễ biến cố sức khỏe – tài chính – gia đạo, năm dễ kết hôn, sinh con, tài lộc sáng, quan lộc động mạnh; mỗi năm kèm lý do chấm điểm |
| `Index.html` | Khung trang |
| `Styles.html` | CSS |
| `Script.html` | JS trình duyệt: form, vẽ lá số 4×4, tam hợp–xung chiếu, tab luận giải, xuất PNG / in |
| `appsscript.json` | Manifest (V8, múi giờ Asia/Ho_Chi_Minh, cấu hình web app) |

## Cài đặt

1. Tạo Google Sheet mới → **Tiện ích mở rộng → Apps Script** (hoặc tạo dự án Apps Script độc lập – app sẽ tự tạo Sheet “Thiên Cơ Các – Lịch sử lá số”).
2. Tạo các file đúng tên như bảng trên (file `.gs` là *Script*, file `.html` là *HTML*, không gõ đuôi) và dán nội dung vào.
3. (Tùy chọn) **Cài đặt dự án → Hiển thị tệp kê khai appsscript.json** rồi dán nội dung `appsscript.json`.
4. Chạy thử hàm `testLapLaSo` một lần để cấp quyền.
5. **Triển khai → Bản triển khai mới → Ứng dụng web** → *Thực thi với tư cách: Tôi*, *Người có quyền truy cập: Bất kỳ ai* → Triển khai, mở URL.

Có thể mở sẵn lá số qua tham số URL, ví dụ:
`.../exec?name=An&gender=nu&calendar=am&day=12&month=3&year=1992&hour=8&minute=0`

## Ghi chú chuyên môn

- Giờ Tý muộn (23h–24h) mặc định tính sang ngày hôm sau (có thể tắt).
- Sinh tháng nhuận: chọn an như tháng thường hoặc chia đôi (1–15 tháng trước, 16 trở đi tháng sau).
- Tùy chọn hiệu chỉnh giờ mặt trời thực theo kinh độ nơi sinh.
- Tứ Hóa theo phái Việt Nam (Nhâm: Lương – Tử – Phủ – Vũ).
- Bát Tự đổi năm tại Lập Xuân, đổi tháng tại 12 Tiết (sai số thời điểm tiết khí vài phút).
- Kết quả luận giải mang tính tham khảo.

## Đối chiếu với mã nguồn mở & kiểm thử

Bộ máy đã được đối chiếu tự động với các thư viện mã nguồn mở (giấy phép MIT):

| Thư viện | Dùng để kiểm chứng |
|---|---|
| [SylarLong/iztro](https://github.com/SylarLong/iztro) – thư viện Tử Vi Đẩu Số phổ biến nhất | Mệnh, Thân, Cục, đại hạn và vị trí ~50 sao trên 2.000 lá số ngẫu nhiên |
| [6tail/lunar-javascript](https://github.com/6tail/lunar-javascript) – lịch pháp & Bát Tự | Tứ trụ, Thai nguyên, Mệnh/Thân cung Bát Tự, Thập nhị trực, 12 thần Hoàng/Hắc đạo, Nhị thập bát tú; bảng hướng Hỷ/Tài/Phúc thần, sát phương, Bành Tổ bách kỵ |
| [doanguyen/lasotuvi](https://github.com/doanguyen/lasotuvi) – an sao Tử Vi phái Việt Nam (Python) | Bảng miếu – hãm (chính tinh, Xương Khúc, các sao đắc địa), Văn Tinh, thuyết Tứ Hóa năm Canh của cụ Thiên Lương |

Chạy lại bộ đối chiếu (cần Node.js):

```bash
cd tests && npm install && npm test
```

Kết quả hiện tại: 100% khớp vị trí sao Tử Vi (~107.000 sao/2.000 lá số), 100% tứ trụ và Thai nguyên/Mệnh/Thân cung, 100% Nhị thập bát tú; Thập nhị trực và Hoàng đạo khớp 99,9% (khác biệt còn lại do lịch Trung Hoa dùng múi giờ +8 ở ngày giao tiết).

Các điểm khác biệt có chủ đích giữa phái Việt Nam và Trung Hoa được giữ theo phái Việt Nam: Hỏa Tinh/Linh Tinh đi ngược chiều theo âm dương nam nữ, Thiên Quý theo Văn Khúc, Giải Thần theo năm, bảng miếu hãm Việt Nam.

## Quy tắc suy luận vận hạn (DuDoan.gs)

Ngoài tiểu hạn, lưu tinh và Tứ Hóa đại vận, bộ suy luận dùng thêm:

- **Lưu niên đại hạn** (phái Thái Thứ Lang): năm 1 tại cung đại hạn, năm 2 sang cung xung chiếu, năm 3 Dương Nam/Âm Nữ lùi 1 cung (ngược lại thì tiến), năm 4 trở về cung xung chiếu, từ năm 5 đi tiếp mỗi năm một cung – xét như "điểm rơi" thứ hai của năm (trọng số 0,6).
- **Lưu tinh bổ sung** theo can/chi năm (đối chiếu iztro): lưu Văn Xương – Văn Khúc, Thiên Khôi – Thiên Việt, Đào Hoa.
- **Hóa Kỵ xung chiếu** (nặng hơn Kỵ tọa thủ), **Song/Tam Kỵ** (Kỵ lưu niên + đại vận + gốc hội tam phương tiểu hạn), **Lộc – Kỵ giao xung**.
- **Nền đại vận**: đại hạn kém khuếch đại rủi ro, đại hạn tốt giảm nhẹ ("đại hạn là gốc, tiểu hạn là ngọn").
- **Bát Tự**: thiên khắc địa xung với từng trụ, phục ngâm trụ ngày, tuế vận tịnh lâm/tương xung, thiên địa uyên ương hợp, can năm ngũ hợp Nhật chủ, "hợp gặp xung" ở cung phu thê, Hồng Loan/Thiên Hỷ theo chi tuổi, xung khai tài khố, thương quan kiến quan, dịch mã động, kiêu thần đoạt thực, năm khắc Dụng thần.

**Đối chiếu sự kiện & dò giờ sinh**: nhập các năm đã xảy ra sự kiện thật (kết hôn, sinh con, ốm nặng, đổi việc…). App tính bách phân vị của năm đó trong cửa sổ tuổi hợp lý, và có thể thử cả 12 giờ sinh để tìm giờ giải thích các sự kiện tốt nhất (cần ≥ 3–4 sự kiện ở các chủ đề khác nhau).

Nguồn tham khảo quy tắc: [Học viện lý số – Tiểu vận](https://hocvienlyso.org/chuong-17-tieu-van.html), [Kabala – Lưu đại hạn](https://hoc.kabala.vn/chuong-7-luu-dai-han/), [lyso.vn – Phân biệt lưu đại vận và lưu tiểu hạn](https://lyso.vn/xem-tu-vi/phan-biet-luu-dai-van-va-luu-tieu-han-t35275/), [tuvilyso.org – Hạn tình cảm](https://tuvilyso.org/forum/topic/20132-han-tinh-cam-va-mot-so-phuong-phap-xem-han-noi-chung/), [tutru.khosachquy.com – Thiên khắc địa xung](http://tutru.khosachquy.com/bat-tu-dai-van-luu-nien-thien-khac-dia-xung-nid-115753.html), mã nguồn [iztro](https://github.com/SylarLong/iztro) (lưu diệu).

Tham khảo Bát Tự chi tiết: [douban – 四柱宫位定义](https://www.douban.com/note/829239302/), [知乎 – 四柱分限断法](https://zhuanlan.zhihu.com/p/710636347), [简书 – 格局的概念及取法](https://www.jianshu.com/p/7ef430db0c26), [阐微堂 – 八字正格格局的取法](https://chanweitang.com/post/82.html), [三命通会 – 论天月德](https://m.gushiwen.cn/guwen/bookv_b0d70c0b58dc.aspx).
