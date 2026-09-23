# Thiên Cơ Các – Web App Lá Số Tử Vi & Bát Tự (Google Apps Script)

Web app lập lá số **Tử Vi Đẩu Số 12 cung** (phái Việt Nam) kết hợp **Bát Tự – Tứ Trụ**, **Chiêm tinh phương Tây (cung hoàng đạo)**, **Thần số học Pythagoras** và **Human Design**, cùng phần **Luận tổng hợp 5 hệ** (xuất thân, vóc dáng, đặc điểm cơ thể, tính cách, đường đời), nhập ngày sinh theo **Dương lịch hoặc Âm lịch** (có tháng nhuận), lưu lịch sử vào **Google Sheet**. Giao diện tông **cyan** với card xanh đen nổi khối và lá số nền giấy ngà; chỉ còn các tab: Lá số & Luận giải 12 cung, Bát Tự, Hà Lạc, Chiêm tinh, Thần số, Human Design, **Tổng hợp 6 hệ** (gồm cả vận hạn & dự đoán); từ khóa/tên sao được tô màu, có biểu đồ trực quan và báo cáo **PDF thương mại** (bìa, tóm lược, mục lục, thương hiệu người luận).

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
| `Astro.gs` | Thiên văn không cần thư viện: Mặt Trời → Diêm Vương (Kepler + nhiễu động, thời gian ánh sáng, quang sai), Mặt Trăng (chuỗi Meeus + ΔT), Nút Bắc thật, Mọc/Thiên đỉnh |
| `ChiemTinh.gs` | Chiêm tinh: 12 cung, nhà Placidus, phẩm chất miếu/vượng/hãm/tù, góc chiếu có orb, nguyên tố – tính chất, pha Mặt Trăng, chủ tinh lá số, ngoại hình theo cung Mọc, dấu hiệu cơ thể (Sao Hỏa/Sao Thổ/nhà 6), gốc gác (nhà 4), nghề (MC), chu kỳ Sao Thổ/Sao Mộc/Thiên Vương/Nút theo ngày quá cảnh thực, hồ sơ năm (profection) |
| `HumanDesign.gs` | Human Design: 26 kích hoạt (Tính cách + Thiết kế 88°), 9 trung tâm, 36 kênh, Loại, Chiến lược, Thẩm quyền, Hồ sơ, Định nghĩa, Giao điểm hóa thân, sinh học trung tâm |
| `ThanSoHoc.gs` | Thần số học: số chủ đạo (2–11, 22, 33), ngày sinh, thái độ, biểu đồ ngày sinh & 15 mũi tên, biểu đồ tên tiếng Việt (linh hồn, nhân cách, sứ mệnh, trưởng thành, cân bằng, bài học nghiệp, đam mê ẩn), 4 đỉnh cao – thử thách, năm/tháng cá nhân |
| `TongHop.gs` | Luận tổng hợp 5 hệ bằng "bỏ phiếu" độc lập & độ đồng thuận: xuất thân – gia cảnh, vóc dáng – diện mạo, vùng cơ thể có dấu vết/cần giữ gìn, tính cách 5 trục, phối ngẫu tương lai, chủ đề đời – nghề nghiệp – các chặng đời, năm đang xem theo 5 hệ, bảng may mắn |
| `TaiKhoan.gs` | **Đăng nhập & phân quyền**: tài khoản lưu trong Script Properties, mật khẩu chỉ lưu dạng băm SHA-256 lặp 400 vòng + salt; phiên 6 giờ (CacheService); sai 5 lần khóa 15 phút; chủ sở hữu tạo/xóa/đặt lại mật khẩu thành viên; **chế độ khách**: chưa đăng nhập vẫn lập lá số nhưng máy chủ chỉ trả lá số + phần "hé lộ" (giống PDF xem thử), PDF chỉ xuất bản xem thử |
| `BatTuLuan.gs` | **Luận Tứ Trụ theo 12 lĩnh vực** (tương ứng 12 cung Tử Vi: bản mệnh, cha mẹ, anh em, phu thê, con cái, tài bạch, tật ách, thiên di, quý nhân, quan lộc, điền trạch, phúc đức) theo nguyên tắc "cung vị làm thể, thập thần làm dụng" + hỷ/kỵ, hợp – xung – hình – hại – phá, Không Vong, thần sát và các cách kinh điển; **lưu niên Tứ Trụ** 14 năm (dẫn động tứ trụ, phục ngâm, phản ngâm, tuế vận tịnh lâm, thần sát năm, sự việc theo lĩnh vực) |
| `HaLac.gs` | Bát Tự Hà Lạc: đổi tứ trụ ra số Hà Đồ – Lạc Thư, Thiên số/Địa số, quẻ Tiên thiên – Hậu thiên – Hỗ, hào nguyên đường theo giờ, đại vận theo 12 hào (dương 9 năm, âm 6 năm), quẻ lưu niên từng năm, chấm điểm theo cát/hung quẻ, vị hào và dụng thần |
| `HoiTu.gs` | **Biến cố hội tụ 6 hệ**: mỗi năm (30 năm tới) cho 8 chủ đề (tài lộc, thăng tiến, kết hôn, con cái, bước ngoặt, sức khỏe, hao tài, gia đạo) được Tử Vi, Bát Tự, Hà Lạc, Chiêm tinh, Thần số bỏ phiếu – từ 3 hệ trở lên là xác suất cao; vận 12 tháng & 7 ngày đa hệ; "mật mã cá nhân" (nguyên tố linh hồn, con số định mệnh, giờ vàng, mùa, quý nhân, cán cân âm dương, năm vàng…) |
| `PhoiNgau.gs` | Chân dung vợ/chồng tương lai từ 5 hệ (ngoại hình, tính cách, chênh tuổi, nơi gặp, chất lượng hôn nhân, năm dễ cưới) + chấm điểm năm sinh (thang 10: nạp âm, thiên can, địa chi, cung phi Bát trạch, thiên mệnh + dụng thần) và tháng sinh âm/dương lịch phù hợp |
| `Index.html` | Khung trang |
| `Styles.html` | CSS |
| `Script.html` | JS trình duyệt: form, vẽ lá số 4×4, tam hợp–xung chiếu, bánh xe bản đồ sao, bodygraph, tab luận giải, xuất PNG / **PDF (A4, có bìa, chọn phần)** / in |
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
- Chiêm tinh & Human Design dùng **giờ đồng hồ + múi giờ lúc sinh + nơi sinh** (chọn trong form; miền Nam 1959–1975 dùng UTC+8). Tử Vi – Bát Tự vẫn tính theo giờ Việt Nam.
- Thần số học dùng **họ tên khai sinh** (bỏ dấu, Đ → D); nếu để trống chỉ tính phần ngày sinh.
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

Thêm `tests/thien-van.mjs` đối chiếu vị trí hành tinh và cung Mọc với [cosinekitty/astronomy](https://github.com/cosinekitty/astronomy) (astronomy-engine – sai số < 4′, Mặt Trăng < 0,2′, Mọc < 0,3′), kiểm tra nhà Placidus theo đúng định nghĩa chia ba bán cung, và Human Design với hd-chart-engine (lệch cổng 2/3.300 kích hoạt – chỉ ở ranh giới cổng).

Kết quả hiện tại: 100% khớp vị trí sao Tử Vi (~107.000 sao/2.000 lá số), 100% tứ trụ và Thai nguyên/Mệnh/Thân cung, 100% Nhị thập bát tú; Thập nhị trực và Hoàng đạo khớp 99,9% (khác biệt còn lại do lịch Trung Hoa dùng múi giờ +8 ở ngày giao tiết).

Các điểm khác biệt có chủ đích giữa phái Việt Nam và Trung Hoa được giữ theo phái Việt Nam: Hỏa Tinh/Linh Tinh đi ngược chiều theo âm dương nam nữ, Thiên Quý theo Văn Khúc, Giải Thần theo năm, bảng miếu hãm Việt Nam.

## Quy tắc suy luận vận hạn (DuDoan.gs)

Ngoài tiểu hạn, lưu tinh và Tứ Hóa đại vận, bộ suy luận dùng thêm:

- **Lưu niên đại hạn** (phái Thái Thứ Lang): năm 1 tại cung đại hạn, năm 2 sang cung xung chiếu, năm 3 Dương Nam/Âm Nữ lùi 1 cung (ngược lại thì tiến), năm 4 trở về cung xung chiếu, từ năm 5 đi tiếp mỗi năm một cung – xét như "điểm rơi" thứ hai của năm (trọng số 0,6).
- **Luận sao lưu niên** (mục riêng trong vận năm): từng sao lưu (Thái Tuế, Lộc Tồn, Tứ Hóa, Kình – Đà, Thiên Mã, Tang – Hổ, Hồng – Hỷ – Đào) rơi vào cung gốc nào → lĩnh vực nào; các cách lưu gặp gốc: song Lộc, Lộc Mã giao trì, chiết túc mã, song Kỵ / Kỵ xung Kỵ, Kình – Đà trùng phùng, Hổ gặp Kình, Tang – Hổ trùng phùng, Thái Tuế xung Mệnh / nhập hạn – có cộng trừ điểm vào đánh giá năm.
- **Lưu tinh bổ sung** theo can/chi năm (đối chiếu iztro): lưu Văn Xương – Văn Khúc, Thiên Khôi – Thiên Việt, Đào Hoa.
- **Hóa Kỵ xung chiếu** (nặng hơn Kỵ tọa thủ), **Song/Tam Kỵ** (Kỵ lưu niên + đại vận + gốc hội tam phương tiểu hạn), **Lộc – Kỵ giao xung**.
- **Nền đại vận**: đại hạn kém khuếch đại rủi ro, đại hạn tốt giảm nhẹ ("đại hạn là gốc, tiểu hạn là ngọn").
- **Bát Tự**: thiên khắc địa xung với từng trụ, phục ngâm trụ ngày, tuế vận tịnh lâm/tương xung, thiên địa uyên ương hợp, can năm ngũ hợp Nhật chủ, "hợp gặp xung" ở cung phu thê, Hồng Loan/Thiên Hỷ theo chi tuổi, xung khai tài khố, thương quan kiến quan, dịch mã động, kiêu thần đoạt thực, năm khắc Dụng thần.

**Đối chiếu sự kiện & dò giờ sinh**: nhập các năm đã xảy ra sự kiện thật (kết hôn, sinh con, ốm nặng, đổi việc…). App tính bách phân vị của năm đó trong cửa sổ tuổi hợp lý, và có thể thử cả 12 giờ sinh để tìm giờ giải thích các sự kiện tốt nhất (cần ≥ 3–4 sự kiện ở các chủ đề khác nhau).

Nguồn tham khảo quy tắc: [Học viện lý số – Tiểu vận](https://hocvienlyso.org/chuong-17-tieu-van.html), [Kabala – Lưu đại hạn](https://hoc.kabala.vn/chuong-7-luu-dai-han/), [lyso.vn – Phân biệt lưu đại vận và lưu tiểu hạn](https://lyso.vn/xem-tu-vi/phan-biet-luu-dai-van-va-luu-tieu-han-t35275/), [tuvilyso.org – Hạn tình cảm](https://tuvilyso.org/forum/topic/20132-han-tinh-cam-va-mot-so-phuong-phap-xem-han-noi-chung/), [tutru.khosachquy.com – Thiên khắc địa xung](http://tutru.khosachquy.com/bat-tu-dai-van-luu-nien-thien-khac-dia-xung-nid-115753.html), mã nguồn [iztro](https://github.com/SylarLong/iztro) (lưu diệu).

Tham khảo Bát Tự chi tiết: [douban – 四柱宫位定义](https://www.douban.com/note/829239302/), [知乎 – 四柱分限断法](https://zhuanlan.zhihu.com/p/710636347), [简书 – 格局的概念及取法](https://www.jianshu.com/p/7ef430db0c26), [阐微堂 – 八字正格格局的取法](https://chanweitang.com/post/82.html), [三命通会 – 论天月德](https://m.gushiwen.cn/guwen/bookv_b0d70c0b58dc.aspx).

## Tài khoản

- Tài khoản **chủ sở hữu** `chienpham` được tạo sẵn (trong mã chỉ có salt + mã băm, không có mật khẩu gốc). Nên **đổi mật khẩu ngay sau lần đăng nhập đầu** (nút 👑 trên thanh tiêu đề → Đổi mật khẩu) – mật khẩu mới được băm với salt mới và lưu trong Script Properties, ghi đè bản mặc định.
- Chủ sở hữu tạo tài khoản thành viên trong cùng hộp thoại. Thành viên xem đầy đủ luận giải, lưu và xem lịch sử lá số của mình; chủ sở hữu xem được toàn bộ lịch sử.
- Khách chưa đăng nhập: lập lá số, xem lá số và phần hé lộ; lời luận chi tiết không được gửi xuống trình duyệt.

## Thang điểm

Mọi điểm hiển thị quy về **thang 10** (5 = trung bình, ≥ 7 tốt, ≥ 8,5 rất tốt, < 4 kém). Điểm thô Tử Vi/Bát Tự là tổng trọng số tín hiệu (chính tinh Miếu +3 … Hãm −2, Lộc +2, Kỵ −2, sát tinh −1,5, hỷ/dụng thần +1,2…+2, kỵ thần −1,2, xung −0,8, hợp +0,4…) không có trần, được đổi sang thang 10 bằng hàm logistic `10 / (1 + e^(−d/3))` (0 → 5; +2,5 → 7; +5 → 8,4; −4 → 2,1). "Cường độ" chủ đề dự đoán là tổng tín hiệu năm, cắt ở 10.

Tham khảo Tứ Trụ: [china-testing/bazi](https://github.com/china-testing/bazi), [ruanxiaoer888/bazi-engine](https://github.com/ruanxiaoer888/bazi-engine), [qianye-wuyu/yueyuan-bazi](https://github.com/qianye-wuyu/yueyuan-bazi), [知乎 – 反吟伏吟、岁运并临](https://zhuanlan.zhihu.com/p/448546674).

## Thiết kế & nội dung báo cáo

- **Giao diện**: toàn bộ màu đi qua token CSS (`:root` = nền cyan + card xanh đen, `.theme-light` = nền sáng cho bản in và cho ô lá số). Bảng màu biểu đồ (hổ phách `#b08a2c`, ngọc `#1fa688`, lam `#4f8ff0`, san hô `#d9503f`) đã chạy bộ kiểm tra tương phản & mù màu cho cả nền tối và nền sáng.
- **Tô đậm tự động**: tên sao (tím nhạt), khái niệm then chốt (vàng), tín hiệu tốt (xanh), điều cần lưu ý (đỏ); phần mở đầu trước dấu ":" của mỗi ý được in đậm.
- **Biểu đồ**: đường vận trình cả đời, điểm hợp tuổi theo năm sinh, cường độ từng lĩnh vực trong năm, cân bằng 4 nguyên tố – đều có tooltip khi rê chuột.
- **Lời văn**: phần "Chân dung hé lộ" và các câu dẫn viết theo nguyên tắc copywriting – rõ ràng hơn bay bổng, cụ thể (số liệu, năm, x/5 hệ đồng thuận), nói trực tiếp với "bạn", mỗi mục một ý, kết bằng hành động; không phóng đại (tham khảo [coreyhaines31/marketingskills – copywriting](https://github.com/coreyhaines31/marketingskills/blob/main/skills/copywriting/SKILL.md), [robpalmer99/claude-code-copywriting-skills](https://github.com/robpalmer99/claude-code-copywriting-skills)).
- **PDF 2 loại**: *bản đầy đủ* (~85–95 trang, chia 3 khối: A. Tổng hợp 6 hệ – chân dung & mật mã, con người, tình duyên, đường đời + 12 đại vận, biến cố hội tụ, vận năm–tháng–ngày; B. Chi tiết từng hệ – lá số + luận 12 cung, Bát Tự, Hà Lạc, Chiêm tinh, Thần số, Human Design; C. Kiểm chứng & may mắn. Chỉ lược phần giải thích phương pháp, giữ "căn cứ từ từng hệ"; dàn trang theo khổ A4 trước khi chụp: card dài được tách thành phần "↳ tiếp" có tiêu đề, không cắt ngang dòng chữ) và *bản xem thử* (~14 trang: mỗi phần hé lộ vài thông tin then chốt, che bớt dữ liệu, ảnh xem trước làm mờ, trang kêu gọi mua kèm ưu đãi). Cả hai có bìa tràn trang, trang "Chân dung hé lộ", mục lục có số trang + bookmark, trang mở đầu mỗi phần có câu dẫn, trang lời kết, chân trang tiếng Việt kèm thương hiệu/liên hệ người luận; chọn nền tối (đọc trên máy) hoặc sáng (để in).
