# Quyết định của chủ dự án

Nhóm: Chung · Cập nhật 31/10/2026
Liên quan: [[Việc chờ chủ dự án]] · [[KPI Demo đã bỏ]] · [[00 Mục lục]]

Những điều đã chốt. Đừng đề xuất lại những gì ghi "không cần" / "không làm".

## Cách làm việc
- **Mỗi dự án một nhánh** (21/10, thay quyết định "một nhánh" trước đó cùng ngày): web KPI = `claude/beautiful-ptolemy-f2j7za`, Thiên Cơ Các = `claude/happy-brown-lttkz3`. Hai dự án không liên quan nhau, mỗi nhánh có CLAUDE.md và bộ não riêng.
- Phần nào xong và đã kiểm tra thì gửi trước, không chờ xong hết (19/10).
- **Claude giúp, không giao thêm việc** (25/10): nghĩ kỹ phương án, ưu tiên cách Claude tự làm được, đưa 2–3 đề xuất có so sánh + khuyến nghị; chỉ nhờ chủ dự án khi không còn cách khác (đã ghi vào CLAUDE.md).
- **Luôn hỏi để làm rõ yêu cầu trước khi hành động** và **luôn dùng vai chuyên gia Agency Agents** cho mỗi việc (25/10, đã ghi vào CLAUDE.md). – [[Công cụ Claude]]
- Bản bảo mật + vận hành: đợi sửa xong hết mới dán một lần (18/10).
- Bộ não thứ hai: thư mục `bo-nao/` + trang bản đồ xem bằng trình duyệt (21/10), mỗi nhánh một bộ.
- Plugin: không bật `claude-mem-cowork` (gửi dữ liệu lên cmem.ai). – [[Công cụ Claude]]

## Định mức (21/10)
- **Đổi định mức là áp cho cả tháng đang làm**: toàn bộ sản lượng tháng đó tính theo định mức mới (thay cách áp theo ngày của bản 18/10). **Kể cả tháng đã chốt**. (22/10: Bảng KPI tháng đang làm luôn tính trực tiếp nên không cần Chốt bù.) – [[KPI Phân tích định mức]]
- **Mốc định mức (22/10 tối): người khá (top 25%) đạt 90%**, gộp 3 tháng gần nhất, bỏ người đột biến (> 1,5 × người khá) và người mới (tài khoản / vào làm trong 2 tháng). Công đoạn 2–3 người vẫn gợi ý (không dùng ngưỡng 5 người). Không thêm mã "giờ không sản xuất". Trước đó: trung vị 85%, không tính người học việc (22/10). Không phân công đoạn "chính / phụ" – công đoạn nào cũng là chính (22/10). – [[KPI Phân tích định mức]]
- Phân tích định mức chỉ gợi ý **nâng** định mức lỏng về mốc 85%. **Không gợi ý hạ** định mức chặt – có thể đang đào tạo nhân viên mới (chủ dự án đã nói từ trước, nhắc lại 21/10). – [[KPI Phân tích định mức]]

## Xếp loại (22/10)
- Thang mới: **S ≥ 95, A+ ≥ 90, A ≥ 85, B ≥ 80, C ≥ 70, D < 70**. – [[KPI Thang xếp loại]]

- **Không dùng trần hiệu suất sản lượng** để ép người giỏi về 90–95% (22/10: "người ta làm được nhiều thật thì phải được ghi nhận"). Giữ `TranKPI` = 500; muốn người giỏi nhất quanh 90–95% thì chỉnh bằng định mức. – [[KPI Phân tích định mức]]

## Hồ sơ nhân viên (22/10)
- Đăng nhập mà hồ sơ thiếu thì phải điền đủ mới dùng tiếp. **Không bắt buộc: chủ sở hữu, ban điều hành, tài khoản nhóm báo cơm tổng (dùng chung), bếp; mọi tài khoản còn lại đều bắt buộc.** – [[KPI Hồ sơ bắt buộc]]
- Danh sách ban điều hành & hành chính nhân sự ở tab Nhân sự: **chỉ chủ sở hữu xem**. – [[KPI Hồ sơ bắt buộc]]

## Kỹ năng (22/10)
- Chủ dự án giao: "cứ làm thứ tốt nhất, tham khảo chuyên gia". Đã chốt theo 2 chuyên gia: 4 cấp ILUO, trọng số A/B/C do BĐH đặt, cấp 3–4 BĐH xác nhận, hạn 24 tháng, điểm chỉ mô phỏng – chưa gắn lương. – [[KPI Kỹ năng]]
- Quy tắc làm việc mới: sau mỗi lần sửa phải rà lại toàn bộ logic code, logic hiển thị và công thức (đã ghi vào CLAUDE.md).

## Phong cách giao diện web KPI
- Hologram vũ trụ **chỉ cho tài khoản chủ sở hữu**, cả web + Tổng quan "Đài quan sát KPI", chuyển động mặc định bật, có nút tắt (23/10). Các tài khoản khác giữ giao diện cũ. – [[KPI Hologram chủ sở hữu]]
- Thích kiểu **thiết bị đo nhà máy**; chê bộ 3D "như đồ chơi", 7 mẫu đầu demo-2, demo-4 (trừ số 5), demo-5, demo tương tác và giao diện nền. Hướng hiện tại: làm lại đúng màn hình đang dùng, đặt bản cũ cạnh bản mới. – [[KPI Demo giao diện]]
- Bỏ qua demo 3D CSS (08/10). – [[KPI Demo đã bỏ]]
- Màn đăng nhập: chọn **Khắc laser** (09/10); hiệu ứng đợt 2 chọn A1, 2, 4, 5, 6 (bỏ "giữ để vào ca") + toàn bộ B; mọi hiệu ứng phải chạy trên điện thoại. – [[KPI Màn đăng nhập Khắc laser]]
- Giữ nguyên trang công nhân nhập sản lượng (mục 7, 8) và điểm danh (mục 11). – [[KPI Thao tác và hiệu ứng bên trong]]
- Nhân vật: thay Mai bằng tê giác **Rhino mẫu 3B** (cơ Retro, 11/10); bản SVG tê giác tự vẽ bị chê xấu. – [[KPI Rhino]]
- Âm thanh: bộ "HUD phi thuyền" + giọng nữ, **mặc định bật**; nút ở cuối menu, không đặt đầu trang (18/10). – [[KPI Âm thanh và giọng Rhino]]

## Sơ đồ nhà máy
- Không cần nút "Ảnh như thật". Bỏ xem 3D trên điện thoại (13/10). Kính nhìn xuyên chỉ làm cho tòa điều hành, không làm xưởng (17/10). – [[KPI Sơ đồ nhà máy 3D]]
- Xoay khối xưởng 180° (thang máy + WC phía kho phụ); P. khuôn T1 thuộc xưởng Phôi Carbon (11/10).

## Cơm trưa
- **Không cần** (13/10): đối chiếu điểm danh, suất phát sinh sau khóa, suất khách/người chưa có tài khoản, "không ăn cho cả xưởng", cá nhân đổi nơi ăn, cảnh báo bếp sửa món, giới hạn món thay, suất chay.
- Chỉ trưởng phòng ăn cùng ban điều hành; HR và QC không tính suất; phạm vi đăng ký hộ: TP/PP xưởng mình, ADMIN + TL khối văn phòng (11/10). – [[KPI Cơm trưa]]

## Ảnh và giao diện (24/10)
- Ảnh nặng không nhúng vào file. 25/10: **lấy từ repo qua jsDelivr** (thay Google Drive – Claude tự làm, chủ dự án không phải kéo ảnh). **Giữ repo GitHub công khai**; không xóa các dòng ghi chú về tài khoản dùng mật khẩu mặc định (chủ dự án 25/10). – [[KPI Ảnh web qua jsDelivr]]
- Tab Sơ đồ nhà máy không hiện KPI / sĩ số (xem ở tab khác); 2D dùng ảnh mặt bằng chủ dự án gửi + ảnh tách tầng. – [[KPI Sơ đồ nhà máy 3D]]
- Màn đăng nhập: nền ảnh tòa nhà ban đêm + thẻ nhân viên vân carbon được laser khắc mã. Ghép ảnh ngọn cơ chụp lên nền đêm: chê xấu, không dùng. – [[KPI Màn đăng nhập Khắc laser]]

## Bóng đá
- Không làm tab riêng, chỉ dải thông báo; hiện từ 7 ngày trước trận (13/10). – [[KPI Bóng đá]]

## Bảo mật và vận hành (18/10)
- 25/10: chủ dự án nói **"kệ 2 tài khoản đó"** – không đổi mật khẩu `giamdoc`, `phogd2`, đừng nhắc lại (đã biết repo công khai + 2 tài khoản vào được bằng mật khẩu mặc định).
- Không làm A5 (chưa có KCS), giữ ô "Đặt số dòng", không làm A3 giờ dừng, không cần video hướng dẫn; phần tăng ca đã gỡ. – [[KPI Bảo mật và vận hành]]

## Quy trình sản xuất (31/10)
- Tab "Quy trình sản xuất" (gộp Kỹ năng): làm theo **phương án C**. Giai đoạn 1 cân bằng 9 xưởng; Claude soạn quy trình nháp, TP/PP chỉ sửa. **Tab chỉ mở cho tài khoản chủ sở hữu** cho tới khi chỉnh xong. Kiến trúc **B**: mảnh tải sau `QuyTrinh.html` trong web hiện tại (không làm web riêng). Câu hỏi giờ ca / số máy / ai sửa: chủ dự án thấy khó → Claude tự lấy (giờ = ô chỉnh trên màn hình, máy từ sheet MayMoc, quyền = chỉ chủ sở hữu). – [[KPI Quy trình sản xuất]]

- App Qoder (31/10): chỉ làm tạm khi Claude hết token, **không sửa gì trên đó**; lấy phần tốt nhất đưa vào web KPI, ưu tiên phân loại cấu hình gậy cho SKU. Sản lượng thật ~9.000 sản phẩm/tháng (không tính tay nối). – [[KPI Quy trình sản xuất]]
- 01/11: **Luôn rà logic để sắp xếp theo cách dễ nhìn, dễ theo dõi, dễ tổng hợp nhất.** Đơn hàng: nhóm chuôi / chuôi nhảy / ngọn; gậy đánh / nhảy / phá (ngọn lẻ cũng vậy), trong nhóm xếp full carbon → mix carbon+glassfiber → glassfiber. Đơn hàng ra tab riêng dưới tab Quy trình. Có nhánh POM Ngọn Taro → Phôi Thô. – [[KPI Quy trình sản xuất]]
- 01/11 (trả lời 4 câu hỏi): tab Đơn hàng **chỉ chủ sở hữu**, **có** "Thay đổi hôm nay" (web KPI tự lưu bản chụp đơn mỗi ngày vào sheet riêng, Sheet đơn vẫn chỉ đọc); cân bằng tải theo **số sản phẩm/tháng sửa được** (mặc định 9.000, 26 ngày); gộp công đoạn **chỉ để xem + tư vấn** (không đổi danh mục KPI); **Phá nhảy là nhóm riêng** (Đánh / Nhảy / Phá / Phá nhảy), GF vỏ carbon tính là Mix. – [[KPI Gộp công đoạn và tiến độ BTP]]
- 01/11 (sau ảnh mẫu lưu đồ 9 xưởng): **không cần ảnh minh họa / AI tạo ảnh**; làm đẹp lưu đồ bằng **hiệu ứng, chau chuốt đường line, card** – áp cho **cả lưu đồ toàn nhà máy và từng xưởng**; **điện thoại bỏ lưu đồ** (chỉ bản máy tính). – [[KPI Quy trình sản xuất]]
- 01/11 (khuya): **KHÔNG gộp công đoạn tính KPI** (định mức khác nhau, chủ dự án sẽ họp từng trưởng phòng) – gộp nhóm **chỉ để vẽ lưu đồ xưởng**, lưu đồ xưởng phải **vẽ theo kiểu lưu đồ toàn nhà máy** (thẻ + đường nối). Nhịp ~368 sp/ngày "khá sát". Tiến độ BTP: chọn **cách A** (từ nhật ký KPI), Claude chọn sẵn bước xuất mỗi xưởng, chủ dự án sửa trên web. Thêm nhánh **CNC cấp "đầu gậy lết" cho Sơn**. Cần bảng **đầy đủ cấu hình gậy** đã tổng hợp. – [[KPI Quy trình sản xuất]]
- 02/11: CNC còn cấp **tip bán lẻ thẳng cho Đóng gói** (đã thêm luồng). **Sơn và In UV không làm ngọn**; Sơn **ghi mỗi lớp sơn thành 1 lần riêng**; câu hỏi tip (1 phôi ra 2 tip hay bán riêng) chủ dự án chưa rõ. Chủ dự án yêu cầu chuyển phiên mới (phiên quá dài). – [[KPI Quy trình sản xuất]]
- 02/11 (phiên mới, 4 câu hỏi): đơn quá hạn > 30 ngày hiện ở **thẻ riêng mở sẵn**; nhãn chất liệu **2 chip "Chuôi:" / "Ngọn:"**; Thống kê lấy **tất cả** đề xuất Lean + giữ phần có giá trị, **mỗi thẻ có chú thích dễ hiểu để trình bày cho người khác**; Sửa quy trình làm **cả A (kéo thả trên lưu đồ) và B (danh sách ↑↓)**, điện thoại không hiện lưu đồ. – [[KPI Quy trình sản xuất]]
- 02/11 (tiếp): Sheet đơn **thường không có cấu hình** sản phẩm → **báo sản phẩm mới ở Việc hôm nay**; cấu hình sửa trên web (dòng gậy mới = tên + chữ nhận diện + cấu hình; loại chuôi / ngọn / tip: chất liệu, kiểu, thêm mới, chỉ ẩn khi đã dùng); **tự đọc tab kênh mới** có cột chuẩn. Yêu cầu **PDF hướng dẫn chi tiết** 2 tab (tổng quan, thông tin, chức năng, diễn giải, thao tác, phân tích thống kê). – [[KPI Quy trình sản xuất]]
- 03/11: **mở tab Quy trình cho trưởng / phó phòng** – chỉ xưởng mình; xem Từng xưởng + Con người + Sửa + lưu đồ nhà máy không số; sửa = **gửi đề xuất, chủ sở hữu duyệt**; được sửa luồng giao đi từ xưởng mình; **tab Đơn hàng giữ chỉ chủ sở hữu**. – [[KPI Quy trình sản xuất]]

## KPI và định mức (25/10)
- Bỏ khoản "Không nhắc CN nhập" của TP/PP với lượt phạt trễ không có vi phạm NHAPTRE (phạt trước 15/09): chỉ trừ khi công nhân thật sự bị trừ. – [[KPI Sửa lỗi 21-10 và dữ liệu sheet]]
- Cân Phôi – Phân Loại Phôi trả về 180 (chủ dự án tự sửa trên web). **Không giới hạn** mức nâng định mức mỗi lần (bỏ đề xuất 10%/lần). – [[KPI Phân tích định mức]]
- Người SL 0 cả tháng (Bùi Hoàng Anh, Trần Thị Thuỳ Dung, Tống Thị Mỹ Duyên, Nguyễn Thị Mai Nga) là nhân viên mới; **giữ trọng số** SL 70 / CL 20 / TT 5 / AT 5. – [[KPI Soát đổi định mức 22-10]]
- Video giới thiệu từ tư liệu Rhino: **tự dựng** (ffmpeg + hoạt ảnh), không dùng video AI tốn credit. – [[KPI Màn đăng nhập demo chờ duyệt]]

## Giao diện sáng (03/11)
- Giao diện tối giữ nguyên (chủ dự án: "đẹp rồi"). Giao diện sáng phải đọc rõ mọi thẻ, lưu đồ. Hologram chủ sở hữu chỉ dùng ở nền tối: chọn nền sáng thì hologram tự tắt; bấm nút hologram khi đang sáng thì web chuyển sang nền tối. – [[KPI Hologram chủ sở hữu]]
- (03/11) Giao diện sáng: chọn **card xanh ngọc nhạt** (phương án B) cho mọi người, mọi tab; không chọn nền xám + card trắng (A) hay card kem (C).
- (03/11) Lưu đồ từng xưởng (cả xem và Sửa quy trình) chạy **dọc từ trên xuống**: hàng = bước, cột = nhánh. Không quay lại kiểu ngang.
- (03/11) Mã "ƯU TIÊN": mục mới trong tab Đơn hàng (chỉ chủ sở hữu), chỉ đơn đang làm (bỏ "Đơn hàng HT"), chỉ tính chữ "ưu tiên" (không tính nền vàng), chữ ở ô mã đơn = cả đơn ưu tiên.
- (03/11) Phần đề xuất quy trình của trưởng / phó phòng ghi "Ban điều hành" duyệt, không dùng chữ "chủ sở hữu" (quyền duyệt hiện vẫn là tài khoản chủ sở hữu – đang hỏi có mở cho tài khoản Ban điều hành không).
- (03/11) Lưu đồ / bảng cân bằng: ghi đủ chức danh "1 TP · 2 PP · 2 TT · 18 CN = 23", tổng phải khớp danh sách đang làm / chấm công; tải tính theo **công nhân + tổ trưởng có mặt theo điểm danh** (không theo ngày có ghi KPI). Duyệt đề xuất quy trình: giữ chỉ owner.
- (03/11) Giai đoạn 2 (hạn từng xưởng): chủ dự án mang PDF đề xuất đi họp với GĐ sản xuất + trưởng phòng rồi mới chốt.
- (03/11) Bộ phận ngoài sản xuất (Kho, Bếp + tạp vụ, Ban điều hành, Xưởng May): **chỉ danh sách, không tính KPI**, tạm thời **chỉ chủ sở hữu thấy** (cuối tab Nhân sự). Ban điều hành = chủ dự án + tài khoản admin + trợ lý BĐH. Sửa theo chấm công chỉ: ngày vào làm, tên, mã, người thiếu; trạng thái / xưởng / chức danh bỏ qua. Đổi mã thì tên đăng nhập đổi theo, giữ mật khẩu. – [[KPI Nhân sự theo chấm công]]
- (03/11) Sơ đồ 3D: thêm **dòng hàng** (ai xem sơ đồ cũng thấy, không số) + **khung lưu đồ** khi bấm xưởng (chủ sở hữu có số; TP/PP xưởng mình, nhà máy không số). Không gắn công đoạn vào từng phòng / máy (phương án C chưa làm). – [[KPI Sơ đồ nhà máy 3D]]
- (07/11) Sơ đồ 3D: **bỏ phần quy trình** (nút Dòng hàng + nút lưu đồ trong thẻ phòng). Khung lưu đồ ở sơ đồ 2D giữ nguyên. – [[KPI Sơ đồ nhà máy 3D]]
- (07/11) Lưu đồ toàn nhà máy: ngọn lẻ → Đóng gói vẽ bằng **đường** (nét đứt cam) như POM / lết, không ghi chữ.
- (07/11) Tab Đơn hàng: **làm lại toàn bộ** (3 ô trả lời, 3 nhóm xem, ⚙ Cài đặt, ⋯); tab Sheet **"ĐƠN ƯU TIÊN" là nguồn mục Ưu tiên**, không cộng vào tổng đơn; ở tab Đơn hàng thu gọn cơm trưa + Tết, Rhino không che số liệu. – [[KPI Quy trình sản xuất]]
- (07/11) Đơn hàng: thanh % **2 màu** ở mọi danh sách đơn; **POD-ECOMSTONE** là kênh chuẩn; sản lượng nhập ngày = thiếu hôm trước − thiếu hôm nay cùng đơn; công suất **350 sp/ngày cho mọi hàng sản xuất**, thứ 2 – thứ 7, ngày lễ điền sẵn + sửa trên web; báo cáo lãnh đạo PDF + Excel có **theo kênh · người đặt** và **đơn deadline trong tháng kèm %**. – [[KPI Quy trình sản xuất]]
- (07/11) Tab **HT-<năm>** (đơn đã hoàn thiện, chép cả đơn, có khi còn thiếu) dùng để tính sản lượng + báo cáo "đã hoàn thiện" (OTIF, fill rate); không bao giờ là kênh. – [[KPI Quy trình sản xuất]]
- (07/11) **Không sửa app ORDER·FLOW**, chỉ sửa web KPI. Web KPI là nguồn số cho lãnh đạo; **không lạm dụng bản chụp**: đơn hoàn thiện đọc thẳng tab HT-<năm> (không có ngày xong → tháng theo hạn), sản lượng = Đóng gói theo nhật ký KPI, báo cáo 3 tháng. Email báo cáo **chỉ gửi chủ sở hữu**, 8h thứ 2 – thứ 7. Lấy từ ORDER·FLOW: sửa đọc Sheet + gộp dòng trùng, lễ âm lịch + ưu tiên khi trùng hạn, công đoạn + hẹn trả + phân bố thời hạn, báo cáo có quyết định cần duyệt + ô ký + 8 đơn trọng điểm. – [[KPI Quy trình sản xuất]]
- 07/11 tối: **giữ tháng 8** trong so sánh 3 tháng (không bỏ); tab HT: suy kênh theo tiền tố mã đơn; dòng chuyển HT còn thiếu cả đơn = **đơn hủy / dừng sản xuất** (không tính fill rate); **giữ** sheet cầu nối. – [[KPI Quy trình sản xuất]]
- 07/11 tối: **không cần** khai kênh cho các tiền tố mã đơn lạ (ORDER, RESTOCK, SEYBERT…) – ghi "Chưa xác định". Đừng hỏi lại. – [[KPI Quy trình sản xuất]]
- 07/11 tối: bảng "Ba tháng gần nhất" trong PDF báo cáo **không cần** cột Chuyển HT, Cây giao, Giao thiếu, Hủy / dừng SX, Fill rate. Ghi web lên Sheet đơn hàng (form cho trưởng phòng / trợ lý): **tạm để đấy**. – [[KPI Quy trình sản xuất]]
- 07/11 đêm: báo cáo bản mới nhất **gửi Giám đốc sản xuất**; bản cho Phó Tổng bàn lại, yêu cầu vào thứ 2. Mục tiêu xưởng **tính ngược từ 350**; In UV = In và phủ bóng + Phủ bóng; HT = Tổ check hàng; lịch giao + quá hạn/tuổi đơn chuyển khỏi Thống kê; sản lượng xưởng có trong báo cáo. – [[KPI Quy trình sản xuất]]
- 07/11 đêm: mọi biểu đồ Thống kê vào báo cáo GĐSX kèm cách đọc + tư vấn; họp đầu / giữa tháng dùng **slide PowerPoint .pptx sửa được**, kỳ tự theo ngày họp, **mỗi xưởng 1 slide**; PDF họp thống nhất trưởng phòng có ô kết luận + ký. – [[KPI Quy trình sản xuất]]
- 07/11 đêm: biểu đồ họp theo **phương án C** (ảnh biểu đồ web + biểu đồ PowerPoint thật); thêm I-MR, bullet, bản đồ nhiệt, nút cổ chai, CFD, tuổi dở dang, Pareto lũy kế, OTD, SQDCP vào web; Vào–Ra–Tồn thay bằng CFD; sản lượng xưởng theo ngày = **biểu đồ cột có số trên đỉnh cột**. – [[KPI Quy trình sản xuất]]
- 07/11 khuya: **Thống kê thành tab chính** dưới Đơn hàng, **chỉ chủ sở hữu**; giữ thống kê cũ ở từng tab + tổng hợp ở Thống kê; báo cơm phải có **số người không báo**; làm hết một lần. KPI tháng đang chạy (tạm tính) không đem so – dùng tháng đã chốt. – [[KPI Quy trình sản xuất]]
- 08/11: tăng tốc theo **phương án A** (máy chủ + bộ đo); **cho hiện số lần trước kèm nhãn** – làm dạng "Mở nhanh (máy cá nhân)" người dùng tự tích, mã hóa, không lưu CCCD / điện thoại / địa chỉ (chuyên gia bảo mật). Chưa chọn B (thu nhỏ trang cho công nhân). – [[KPI Tăng tốc đợt 3 (08-11)]]
- 08/11: TB đi làm / ngày đặt ở **cả Nhân sự và Điểm danh**; nửa ngày = 0,5, đi muộn = 1. Tỷ lệ quản lý: **tổ trưởng tính vào CN**, không tính vào quản lý. Biểu đồ thâm niên / tuổi: nới rộng, ghi số người trên từng đoạn. – [[KPI Quy trình sản xuất]]
- 08/11: 33 người Marketing / Kinh doanh: tách 2 bộ phận; **chưa tạo tài khoản / chưa cấp mật khẩu**, chỉ danh sách + thống kê; cơm vẫn báo theo nhóm. Bộ phận ngoài SX chỉ cần **hồ sơ** (ngày onboard, chính thức, thử việc / chính thức, thâm niên, phép còn lại), không cần chấm công trên web. File Drive chung + nút "Cập nhật từ file". – [[KPI Quy trình sản xuất]]
- 08/11: **không hiện phép năm còn lại** ở Nhân sự ngoài sản xuất – "không cần bây giờ" (đừng đề xuất lại khi chưa được hỏi). – [[KPI Quy trình sản xuất]]
- 08/11: **giữ chức danh đúng như tài liệu gửi lên** – không tự sửa chữ (kể cả lỗi gõ như "Giám đóc", chữ hoa "Cửa hàng Trưởng"); chỉ bỏ dấu cách thừa. Áp dụng cho mọi dữ liệu chủ dự án gửi. – [[KPI Quy trình sản xuất]]
- 08/11: thêm nghỉ lễ **24/11 (Ngày Văn hóa Việt Nam)** hằng năm; **không sửa** chức danh Phạm Kiều Oanh (giữ "Trưởng bộ phận" Kho). – [[KPI Chính sách lương và cẩm nang]]
- 08/11: Cơ cấu lương do kế toán thiết kế – chủ dự án chỉ nhận thông tin, **không nhận xét / đề xuất về lương nữa**. Từ cẩm nang + bảng lương **chưa cần** đưa gì lên web: không nhắc hết thử việc / hợp đồng, không mốc thâm niên – phúc lợi, không DS xét tăng lương, không đề cử khen thưởng, không trang quy định cho công nhân, không cảnh báo đi muộn. Đừng đề xuất lại khi chưa được hỏi. **Thâm niên trên web giữ tính từ ngày vào thật, KHÔNG áp mốc 28/12/2022** (chủ dự án chốt 08/11: "Thâm niên của C110 giữ nguyên như trước, hơn 7 năm, đừng sửa"). – [[KPI Chính sách lương và cẩm nang]]
- 08/11: Điều phối sản xuất – làm việc **1, 2, 3** của `quan-ly-van-hanh` (cách đếm do Claude đề xuất, chủ dự án duyệt; việc xưởng cho TP + PP xưởng mình, chủ thấy tất cả, **hiện cả kênh / khách**, **chỉ xếp theo hạn đơn**; sức khỏe dữ liệu + tồn / nút cổ chai cho **chủ + Ban điều hành**). Việc 4 điều người: **chưa chắc, để sau**. Việc 5 sổ việc sau họp: không chọn. – [[KPI Điều phối sản xuất (08-11)]]
- 08/11: **"Tester" ở Ngọn Taro là joint tester thử ren chuôi cho khách** (phụ kiện), không phải ngọn → không tính vào chuỗi / dòng chảy ngọn. – [[KPI Điều phối sản xuất (08-11)]]
- 08/11: **Số Ngọn Taro (~450/ngày) là đúng; ngọn Glassfiber có đi qua Phôi Thô nhưng Phôi Thô ghi thiếu** bước Taro Ngọn Glassfiber → web cảnh báo "có thể ghi thiếu", không đổi cách tính. – [[KPI Điều phối sản xuất (08-11)]]
- 08/11: **Bỏ hẳn "Đón người mới"** (tab Nhân sự, web + máy chủ). Tab Nhân sự: Thêm NV đầu, Tìm + bộ lọc (xưởng, trạng thái, chức danh, thâm niên, độ tuổi), bảng bỏ Xưởng + KPI, thêm Thâm niên – mọi vai trò. **Tổng quan chủ sở hữu: bỏ "chưa khai báo sản lượng" + "cá nhân dưới 80%"**, dùng phương án Vừa của quan-ly-van-hanh **không có tỷ lệ lỗi** (chưa có số liệu); Đài quan sát làm lại đẹp hơn có hiệu ứng. – [[KPI Tổng quan chủ sở hữu và tab Nhân sự (08-11)]]
