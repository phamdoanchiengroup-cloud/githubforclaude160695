# Trợ lý KPI – hướng dẫn cài đặt (khoảng 10 phút)

Trợ lý chạy thành **một dự án Apps Script riêng**. Nó chỉ **đọc** file "CSDL KPI", không sửa web app KPI đang dùng.
Nó không đọc ra hay gửi đi số CCCD, điện thoại, địa chỉ, lương.

## Bước 1. Tạo dự án mới
1. Mở https://script.google.com → **Dự án mới**.
2. Bấm vào chữ "Dự án không có tiêu đề" ở góc trên trái, đổi tên thành **Trợ lý KPI**.
3. Mở file `Mã.gs` → **xóa hết** → dán toàn bộ nội dung file `TroLyKPI.gs` → bấm 💾 Lưu.

## Bước 2. Nhập token Zalo (không gửi token cho ai, kể cả Claude)
1. Bấm ⚙️ **Cài đặt dự án** (thanh bên trái).
2. Kéo xuống **Thuộc tính tập lệnh** → **Thêm thuộc tính tập lệnh**.
   - Thuộc tính: `ZALO_TOKEN`
   - Giá trị: dán token bot Zalo
3. Bấm **Lưu thuộc tính tập lệnh**.

## Bước 3. Triển khai thành ứng dụng web (để Zalo gửi tin nhắn vào được)
1. Bấm **Triển khai** → **Tùy chọn triển khai mới**.
2. Bấm ⚙️ cạnh "Chọn loại" → chọn **Ứng dụng web**.
   - Thực thi dưới dạng: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**. Đừng lo: chỉ Zalo mới có mã khóa bí mật, và bot chỉ trả lời Zalo của bạn.
3. Bấm **Triển khai** → **Cấp quyền truy cập** → chọn tài khoản Google của bạn.
   - Nếu hiện "Google chưa xác minh ứng dụng này": bấm **Nâng cao** → **Đi tới Trợ lý KPI** → **Cho phép**.
4. **Sao chép URL ứng dụng web** (đuôi `/exec`).
5. Quay lại ⚙️ **Cài đặt dự án** → thêm thuộc tính `WEBAPP_URL`, giá trị là URL vừa chép → Lưu.

## Bước 4. Chạy cài đặt
1. Quay lại trang mã (biểu tượng `< >`).
2. Trên thanh công cụ, ô chọn hàm → chọn **caiDat** → bấm ▶ **Chạy**.
3. Xem **Nhật ký thực thi** ở dưới. Sẽ có dòng: `👉 Mở Zalo, nhắn cho bot đúng dòng này: ketnoi 123456`.
4. Mở Zalo → vào **Bot Trợ lý KPI** → nhắn đúng `ketnoi 123456` (số của bạn).
5. Bot trả lời "✅ Đã kết nối!" là xong.

## Dùng hằng ngày
- **7 giờ sáng** bot tự gửi bản tin ngày làm việc gần nhất. Chủ nhật không gửi lặp lại bản tin thứ Bảy.
- Nhắn cho bot:
  - `bc` → bản tin ngày gần nhất
  - `bc 10/10` → bản tin ngày 10/10
  - `tuần` → tổng kết 7 ngày
  - `giúp` → hướng dẫn
- Muốn thử ngay: trong trình soạn thảo, chọn hàm **thuGuiBanTin** → ▶ Chạy.

## Bước 5. Bật hỏi tự do bằng AI

Sau bước này bạn hỏi bot bằng câu thường, ví dụ: "hôm nay bao nhiêu người nghỉ?", "xưởng nào dừng máy nhiều nhất tháng 9?", "top 5 người hiệu suất cao nhất tuần này".

1. **Lấy khóa API:**
   - Vào https://console.anthropic.com → đăng ký / đăng nhập.
   - **Billing**: nạp tiền trả trước (ví dụ 5–10 USD).
   - **API Keys** → **Create Key** → sao chép khóa (bắt đầu bằng `sk-ant-`). Không gửi khóa cho ai, kể cả Claude.
2. **Thêm file mã AI:** trong Apps Script, bấm **＋** cạnh "Tệp" → **Tập lệnh** → đặt tên `TroLyAI` → xóa nội dung mẫu → dán toàn bộ file `TroLyAI.gs` → Lưu.
3. **Dán lại `Mã.gs`** bằng bản `TroLyKPI.gs` mới nhất: xóa hết → dán → Lưu.
4. ⚙️ **Cài đặt dự án → Thuộc tính tập lệnh** → thêm `ANTHROPIC_API_KEY` = khóa vừa tạo → Lưu.
5. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.**

**Tùy chọn** (thêm vào Thuộc tính tập lệnh nếu muốn):

| Thuộc tính | Mặc định | Ý nghĩa |
|---|---|---|
| `AI_MODEL` | `claude-opus-5-5` | Đổi sang `claude-haiku-5-5` để rẻ hơn khoảng 40 lần (kém thông minh hơn) |
| `AI_EFFORT` | `low` | `medium` / `high`: suy nghĩ kỹ hơn, chậm và tốn hơn |
| `AI_GIOI_HAN_NGAY` | `60` | Số câu hỏi tối đa mỗi ngày, chống tốn tiền ngoài ý muốn |

**Chi phí ước tính:** 1 USD ≈ 26.000đ. Đây là ước lượng thô, xem số thật ở console.anthropic.com → Usage.

| Model | Mỗi câu hỏi | Hỏi 10 câu/ngày |
|---|---|---|
| `claude-opus-5-5` (mặc định) | ~1.000–2.000đ | ~300–550 nghìn đồng/tháng |
| `claude-haiku-5-5` | ~50đ | ~15 nghìn đồng/tháng |

**AI chỉ đọc được:**
- Các sheet sản xuất, điểm danh, KCS, vi phạm, KPI tháng, máy móc, danh mục.
- **Không** đọc được sheet tài khoản, yêu cầu sửa hồ sơ, nhật ký thao tác, cũng không đọc được các cột CCCD, điện thoại, địa chỉ, năm sinh, lương.
- AI chỉ đọc, không sửa được gì.

## Bước 6. Công ty Agent (nhiều phòng ban AI)

Sau bước này bot có 5 "phòng" làm việc:

| Phòng | Gọi thẳng | Việc |
|---|---|---|
| Sản xuất | `@sx` | số liệu ngày, hiệu suất, dừng máy, KCS |
| Phân tích dữ liệu | `@pt` | so sánh, tìm nguyên nhân, báo cáo Google Sheet có biểu đồ |
| Nhân sự | `@ns` | điểm danh, nghỉ, vi phạm, KPI cá nhân |
| Truyền thông | `@viết` | bài Facebook, tuyển dụng, thông báo, thư |
| Thư ký | `@tk` | ghi việc + nhắc đúng giờ, ghi chú, Lịch Google, email nháp |

Phòng thứ 6 là "Kế hoạch – Đơn hàng", đang tắt, chờ Claude làm phần đọc sheet đơn hàng.

Bạn cứ nhắn tự nhiên, **thư ký điều phối** sẽ chuyển câu hỏi đúng phòng. Câu trả lời có ghi `[Tên phòng]` ở đầu.

**Cài đặt** (làm đúng thứ tự, nhớ sao lưu trước: **Tổng quan → Tạo bản sao**):

1. Dán lại `Mã.gs` ← `TroLyKPI.gs` và `TroLyAI` ← `TroLyAI.gs` (bản mới).
2. Bấm **＋ → Tập lệnh** → đặt tên `Agents` → xóa nội dung mẫu → dán `Agents.gs` → 💾 Lưu.
3. Chọn hàm **caiDatAgent** → ▶ **Chạy**.
   - Google sẽ hỏi quyền mới (Lịch, Gmail, tạo bảng tính) → **Xem lại quyền → chọn tài khoản → Nâng cao → Đi tới Trợ lý KPI → Cho phép**.
   - ⚠ **Phải làm bước này TRƯỚC bước 4.** Nếu triển khai trước khi cấp quyền, bot sẽ ngừng trả lời cho đến khi bạn chạy `caiDatAgent`.
4. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai.**
5. Xem **Nhật ký thực thi**, mở đường link sheet **"Trợ lý – Công ty Agent"** (nằm trong Drive của bạn). Vào tab **SoTay** → sửa 2 dòng có chữ **"SỬA DÒNG NÀY"**: thông tin công ty và giọng văn. Phòng Truyền thông dựa vào 2 dòng này để viết.
6. Nhắn bot `phòng ban` để xem danh sách.

**Sheet "Trợ lý – Công ty Agent"** (bạn sửa được trực tiếp, không cần đụng mã):
- **CacAgent**: mỗi dòng một phòng.
  - `Goi`: tên gọi tắt. `MoTa`: việc phụ trách, thư ký dựa vào đây để chia việc. `VaiTro`: cách làm việc.
  - `CongCu`: công cụ được dùng. `Model` / `Effort`: để trống là dùng mặc định. `Bat`: Có / Không.
  - **Thêm phòng mới**: thêm một dòng. Sau khi sửa sheet, chờ khoảng 10 phút để bot nhận thay đổi.
  - Công cụ có sẵn: `tra_cuu, hieu_suat, ban_tin` (đọc KPI), `bao_cao_sheet`, `so_tay_tim, so_tay_ghi, so_tay_xong`, `lich_xem, lich_tao`, `email_tim, email_nhap`.
- **SoTay**: trí nhớ chung của mọi phòng.
  - Loại **Bối cảnh**: luôn được đưa cho mọi phòng (thông tin công ty, cách xưng hô, thói quen của bạn…).
  - Loại **Việc** có **Hạn**: bot nhắn Zalo nhắc khi đến hạn, cứ 15 phút kiểm tra một lần. Việc trong ngày cũng được đưa vào bản tin 7 giờ sáng.
- **NhatKy**: lịch sử hỏi đáp để bạn xem lại.

**Lệnh nhanh** (không tốn tiền AI):
- `phòng ban`: danh sách phòng
- `việc`: các việc đang mở
- `xong 5`: đánh dấu việc số 5 đã xong

**An toàn:**
- Email chỉ tạo **nháp**, bạn tự bấm gửi.
- Lịch chỉ ghi vào lịch của bạn, không mời ai.
- Dữ liệu sản xuất chỉ đọc.
- Phòng nào chỉ dùng được công cụ ghi trong cột `CongCu` của phòng đó.

## Bước 7. "Tay chân": làm slide, đọc tệp Gmail, tin tức bi-a

Ba việc nặng này chạy trên **máy tính cách ly của Anthropic** (Claude Managed Agents, đang ở bản thử nghiệm). Mỗi việc dùng một agent riêng, chỉ có đúng quyền cần thiết:

| Việc | Cách gọi | Quyền của agent |
|---|---|---|
| **Làm slide báo cáo** | "làm slide báo cáo tháng 9" (phòng Phân tích) | Có kỹ năng PowerPoint. **Không vào được web.** |
| **Đọc tệp trong Gmail** | "đọc file báo giá trong mail anh Hòa hôm qua, so với giá cũ" (Thư ký) | **Không có mạng.** Không có quyền vào Gmail: Apps Script tự lấy tệp rồi chuyển cho agent. |
| **Tin tức ngành bi-a** | tự gửi **khoảng 7:30 mỗi sáng**; nhắn `tin tức` để lấy ngay | Chỉ tìm và đọc web. Không chạy lệnh, không có dữ liệu công ty. |

Khi bạn giao việc, bot trả lời "⏳ Đã giao…". Xong việc (thường 2–10 phút), bot nhắn kết quả. Tệp (slide, Excel…) được lưu vào thư mục Drive **"Trợ lý – Kết quả"**, kèm đường link.
Nhắn `việc nền` để xem việc đang chạy.

**Cài đặt** (sao lưu trước: **Tổng quan → Tạo bản sao**):
1. Dán lại `Mã.gs` ← `TroLyKPI.gs`, `TroLyAI` ← `TroLyAI.gs`, `Agents` ← `Agents.gs` (bản mới).
2. **＋ → Tập lệnh** → đặt tên `TayChan` → xóa nội dung mẫu → dán `TayChan.gs` → 💾 Lưu.
3. Chọn hàm **caiDatTayChan** → ▶ **Chạy** → Google hỏi quyền **Drive** (để lưu tệp kết quả) → **Nâng cao → Đi tới Trợ lý KPI → Cho phép**.
   - ⚠ Phải làm bước này **trước** bước 4.
   - Nhật ký thực thi phải hiện "ĐÃ CÀI TAY CHÂN". Nếu báo lỗi (ví dụ tài khoản chưa được dùng Managed Agents), chụp màn hình gửi Claude.
4. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai.**
5. Thử: nhắn bot `tin tức`, chờ vài phút.

**Muốn theo dõi chủ đề tin riêng:** trong sheet "Trợ lý – Công ty Agent", tab SoTay, thêm dòng có Loai = `Tin tức`, NoiDung = chủ đề. Ví dụ "giá ống carbon", "thuế nhập khẩu cơ bi-a vào Mỹ", "đối thủ X".

**An toàn:**
- Agent không bao giờ nhận mật khẩu hay quyền Gmail/Drive.
- Agent đọc tệp không có mạng: dù tệp có cài lệnh ẩn, nó cũng không gửi được gì ra ngoài.
- Thao tác nào máy chủ cho là cần người duyệt sẽ **tự bị từ chối**, vì không có ai trực để duyệt.

**Chi phí** (ước tính thô, xem số thật ở console.anthropic.com → Usage):
- Mỗi việc có **trần chi phí**: slide 3 USD, đọc tệp 2 USD, tin tức 1 USD. Chạm trần thì việc tự dừng và báo bạn.
- Thường thực tế thấp hơn nhiều. Tin tức mỗi sáng khoảng 0,2–0,5 USD, tức khoảng 150–400 nghìn đồng/tháng.
- Tối đa 15 việc nền/ngày. Đổi bằng thuộc tính `TC_GIOI_HAN_NGAY`.
- Muốn tắt tin tức sáng: vào **Trình kích hoạt** (biểu tượng đồng hồ) → xóa `tinTucSang`.

## Bước 8. Web app – bảng điều khiển

Một trang web dùng trên điện thoại hoặc máy tính, gồm:
- **Tổng quan**: hiệu suất từng xưởng, xu hướng 14 ngày, dừng máy, cảnh báo, việc, kết quả.
- **Trò chuyện**: chọn phòng muốn hỏi.
- **Phòng ban**: bật/tắt phòng, nhập chuyên gia Agency.
- **Việc**: thêm việc, đánh dấu xong.
- **Giao việc**: làm slide, đọc tệp Gmail, lấy tin tức.

**Cài đặt** (sao lưu trước):
1. Dán lại các file cũ bản mới: `Mã.gs` ← `TroLyKPI.gs`, `TroLyAI`, `Agents`, `TayChan`.
2. **＋ → Tập lệnh** → tên `WebUI` → dán `WebUI.gs` → Lưu.
3. **＋ → HTML** → tên đúng **`WebApp`** (không thêm đuôi) → xóa nội dung mẫu → dán `WebApp.html` → Lưu.
4. **＋ → Tập lệnh** → tên `Agency` → dán `Agency.gs` → Lưu.
5. Chọn hàm **caiDatWebApp** → ▶ Chạy → **Cho phép** (Google hỏi thêm quyền xem email đăng nhập để nhận ra chủ).
   - Nhật ký hiện **đường link bảng điều khiển** (đuôi `?k=…`).
   - **Lưu link này vào dấu trang hoặc màn hình chính điện thoại. Không chia sẻ cho ai.**
6. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai.**
7. Mở link. Trên điện thoại: menu trình duyệt → **Thêm vào màn hình chính** để dùng như một ứng dụng.

**Bảo mật:**
- Chỉ ai có link chứa khóa riêng, hoặc chính bạn khi đăng nhập Google, mới mở được trang. Người khác chỉ thấy một dòng chữ.
- Lỡ lộ link: chạy hàm **doiKhoaWebApp**, link cũ hết tác dụng ngay. Chạy xong lấy link mới trong nhật ký.

## Bước 9. Chuyên gia Agency (thư viện nhân vật nguồn mở)

Agency Agents (github.com/msitarzewski/agency-agents, giấy phép MIT) là bộ khoảng 270 "nhân vật chuyên gia" viết sẵn. Claude đã chọn **22 nhân vật hợp với nhà máy cơ bi-a**:
- vận hành Lean, cung ứng, định giá, chiến lược, tuyển dụng, đào tạo
- biên bản họp, tóm tắt điều hành, xu hướng thị trường
- biên dịch, chăm sóc khách hàng, hồ sơ chào hàng OEM, ESG, pháp chế…

Mỗi nhân vật thành **một phòng** trong Công ty Agent.

**Nhập:** mở web app → **Phòng ban** → tích chọn → **Nhập các mục đã chọn**. Hoặc chạy hàm **nhapAgency** trong Apps Script để nhập cả 22.
- 8 phòng bật sẵn: Vận hành, Cung ứng, Định giá, Chiến lược, Tuyển dụng, Đào tạo, Biên bản họp, Tóm tắt điều hành.
- Các phòng còn lại nhập vào ở trạng thái tắt, muốn dùng thì bật.

**An toàn:**
- Chỉ tải đúng **phiên bản Claude đã đọc và rà soát** (khóa theo mã commit `652b269`). Mỗi tệp có **dấu vân tay SHA-256**: nếu ai đó sửa tệp trên mạng, bot **từ chối nhập**.
- Đã bỏ phần mã ví dụ và giới hạn độ dài để tiết kiệm chi phí.
- Nhân vật chỉ là lời mô tả vai trò. Quyền thật nằm ở cột `CongCu`.
- Phòng có `tim_web` (tra cứu Internet) **không được** đồng thời có công cụ đọc dữ liệu nội bộ (KPI, Gmail, lịch, slide). Nếu bạn lỡ gán cả hai, bot **tự gỡ** `tim_web` và ghi cảnh báo 🔒 trong mục Phòng ban. Lý do: trang web có thể cài lệnh ẩn để dụ AI gửi dữ liệu công ty ra ngoài.

**Gọi phòng:** chọn trong ô "Hỏi phòng" ở web app, hoặc nhắn Zalo `@cu tìm nhà cung cấp ống carbon`, `@giá báo giá 500 cơ cho khách Mỹ`, `@bb` kèm ghi chép cuộc họp…

**Chi phí:** mỗi lần hỏi phòng Agency tốn hơn một chút so với phòng thường (bản mô tả vai trò dài 5–12 nghìn ký tự), khoảng 1.000–3.000đ/câu với Opus 5.5. Phòng ít dùng thì nên để tắt.

## Bước 10. Giọng nói – trò chuyện như "Jarvis"

Tab **🎙 Giọng nói** trong web app (Bước 8):
- **Chạm vòng tròn rồi nói**, ví dụ "Hôm qua xưởng nào thấp nhất, vì sao?". Nói xong trang tự gửi. Trợ lý trả lời bằng giọng, đồng thời hiện chữ trên màn hình.
- **🔊 Đọc bản tin**: đọc to bản tin sản xuất ngày gần nhất (hiệu suất, xưởng cao/thấp, dừng máy, việc cần chú ý, việc hôm nay). **Không tốn tiền AI.**
  - Nói "báo cáo" hoặc "việc hôm nay" cũng được, cũng không tốn AI.
- **Trò chuyện liên tục** (công tắc): trợ lý đọc xong thì tự nghe tiếp, khỏi chạm lại.
- **Rảnh tay** (công tắc): trang luôn lắng nghe. Gọi **"Trợ lý ơi, …"** (hoặc "Jarvis, …") rồi nói câu hỏi. Hợp máy tính để bàn ở phòng làm việc. Trên điện thoại có thể kêu "bíp" mỗi lần nghe lại.
- **Hỏi phòng**: chọn phòng muốn hỏi, hoặc để Tự động.

**Cài đặt** (sao lưu trước: Tổng quan → Tạo bản sao dự án):
1. **＋ → Tập lệnh** → tên `GiongNoi` → xóa hết → dán `GiongNoi.gs` → 💾 Lưu.
2. MỞ FILE `TroLyAI` → xóa hết → dán bản mới `TroLyAI.gs` → Lưu.
3. MỞ FILE `WebApp` (HTML) → xóa hết → dán bản mới `WebApp.html` → Lưu.
4. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản mới → Triển khai.**
5. Mở link bảng điều khiển → Ctrl+F5 (điện thoại: tải lại trang) → tab **🎙 Giọng nói**.
6. Lần đầu chạm vòng tròn, trình duyệt hỏi **quyền dùng micro** → chọn **Cho phép**.

**Nên dùng:** Chrome trên Android hoặc máy tính, Safari trên iPhone.
- Nếu trang báo **"Không mở được micro"**: chạm vào ô chữ bên dưới vòng tròn, rồi bấm nút **🎤 trên bàn phím điện thoại** để nói. Bàn phím Gboard và bàn phím iPhone đều nghe được tiếng Việt. Trợ lý vẫn đọc to câu trả lời như thường.
- Nếu **không nghe thấy tiếng đọc** hoặc giọng đọc lơ lớ tiếng Anh, là máy chưa có giọng tiếng Việt:
  - Android: Cài đặt → tìm "Chuyển văn bản thành giọng nói" → Công cụ của Google → tải **Tiếng Việt**.
  - iPhone: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → **Tiếng Việt**.

**Giọng tự nhiên hơn (tùy chọn) – FPT.AI:**
1. Đăng ký tại console.fpt.ai → tạo khóa API cho Text to Speech. Không gửi khóa cho ai, kể cả Claude.
2. Apps Script → ⚙️ **Cài đặt dự án** → **Thuộc tính tập lệnh** → thêm:
   - `FPT_TTS_KEY` = khóa vừa tạo.
   - (tùy chọn) `FPT_GIONG` = `banmai` (nữ miền Bắc, mặc định), `thuminh`, `lannhi`, `myan`, `linhsan`, `leminh` (nam miền Bắc) hoặc `giahuy`.
3. Lưu. Không cần triển khai lại.
4. Trong tab Giọng nói → **Giọng đọc** → chọn "FPT.AI". Giọng này đọc chậm hơn giọng máy khoảng 3 giây. Lỗi hoặc hết lượt thì trang tự quay về giọng máy.

**Chi phí:**
- Nghe giọng nói và đọc bằng giọng máy: **miễn phí** (chạy ngay trên điện thoại hoặc máy tính).
- Gõ hoặc nói `bc`, `bc 15/10`, `tuần`, `việc`, `xong 5` trong tab Giọng nói cũng miễn phí (kết quả hiện trên màn hình).
- Câu hỏi tự do tốn tiền AI như khi gõ chữ. Câu trả lời giọng nói được dặn ngắn (2–5 câu) nên thường **rẻ hơn**.
- FPT.AI có gói dùng thử miễn phí, sau đó tính theo số ký tự.

## Khi cập nhật bản mới
1. Mở từng file (`Mã.gs` ← `TroLyKPI.gs`, `TroLyAI` ← `TroLyAI.gs`, `Agents` ← `Agents.gs`, `TayChan` ← `TayChan.gs`, `WebUI` ← `WebUI.gs`, `WebApp` ← `WebApp.html`, `Agency` ← `Agency.gs`, `GiongNoi` ← `GiongNoi.gs`) → xóa hết → dán bản mới → 💾 Lưu.
2. **Triển khai → Quản lý triển khai → ✏️ → Phiên bản: Phiên bản mới → Triển khai.** URL giữ nguyên, không cần chạy lại `caiDat`.
   - Nếu Claude báo bản mới dùng thêm quyền: chạy `caiDatAgent` / `caiDatTayChan` để cấp quyền **trước** khi triển khai.
   - Nếu Claude báo đã đổi cách làm việc của agent tay chân: chạy lại `caiDatTayChan` (chỉ cập nhật, không tạo trùng).

## Cách tính (giống web app KPI)
- Chỉ tính dòng `NhatKySanXuat` có TrangThai **"Đã chốt"** (trưởng phòng đã duyệt). "Chờ duyệt" được đếm riêng. "Từ chối" bị bỏ.
- **Hiệu suất** = Σ (số lượng − hàng lỗi KCS) ÷ định mức, chia cho **giờ có mặt** theo chấm công:
  - đi làm = 8h, nửa ngày = 4h, đi muộn x-n thì trừ n giờ, nghỉ = 0.
  - Ngày công = xưởng đã xác nhận điểm danh, hoặc người đó có dòng đã chốt.
  - Không tính trưởng/phó phòng, người nghỉ việc, ngày nghỉ dài hạn.
  - Định mức lấy dòng cuối cùng của công đoạn trong sheet DinhMuc.
- ▲▼ là chênh lệch so với 14 ngày trước đó (bản tin ngày) hoặc 7 ngày trước đó (bản tin tuần).
- Điểm KPI tháng (chất lượng, tuân thủ, an toàn, tổng KPI) xem ở bảng `KPIThang` do web app chốt.

## Gỡ lỗi
- Bot không trả lời:
  - Kiểm tra Bước 3 đã chọn **Bất kỳ ai**.
  - Kiểm tra `WEBAPP_URL` có đuôi `/exec`.
  - Chạy lại **caiDat**.
- Nếu lỡ để lộ token: vào Zalo Bot Creator (https://zalo.me/s/botcreator/) tạo token mới → sửa `ZALO_TOKEN` → chạy lại **caiDat**.
- Bot báo lỗi quyền, hoặc ngừng trả lời sau khi cập nhật: chạy **caiDatAgent** trong Apps Script và bấm Cho phép.
- Kiểm thử trên máy (dành cho Claude): `node tests/tro-ly.js && node tests/agents.js && node tests/tay-chan.js && node tests/web-agency.js`.
