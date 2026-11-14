# Bàn giao phiên

Nhóm: Chung · Cập nhật 02/11/2026
Liên quan: [[00 Mục lục]] · [[Liên kết và công cụ]] · [[Việc chờ chủ dự án]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]] · [[KPI Kiểm thử]]

## 14/11 khuya – Đơn hàng sắp xếp lại (đã commit, chờ dán + chờ duyệt mục 5)
- Xong mục 1–4 + trễ hẹn bộ phận; mục 5 chờ chủ dự án duyệt danh sách bỏ/giữ. – [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]]

## Bàn giao 14/11 khuya → phiên mới (việc ĐANG CHỜ làm)
- Đã xong + đã push: luồng ngọn mới (Taro → HT → Tip → trả HT → ĐG) áp mọi chỗ; Trạng thái đơn hàng (bảng nổi gọn: đã giao/đặt + hẹn + giao tiếp cho bộ phận, màu xoay vòng theo đơn, bỏ Chi tiết từng dòng); bộ cài clasp tự gỡ file lạ `_qt_check`. – [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]], [[KPI Cập nhật bằng clasp]]
- **Yêu cầu chủ dự án (đã làm 1–4, xem mục trên)**:
  1. Menu: "Đơn hàng" lên **đầu mục Sản xuất**, chữ to + nổi bật hơn mục khác.
  2. TP/PP: trang Tổng quan, **ngay dưới các thông báo**, hiện luôn bảng Trạng thái đơn hàng.
  3. Bảng Trạng thái đơn hàng: tab **Đơn ưu tiên** và **Đơn trễ hẹn** lên đầu; thêm tab **Đến hạn trong 10 ngày tới** (Claude tự lọc theo deadline). **Bỏ mục "Theo dõi"** – tab Đơn hàng chỉ còn 2 mục: **"Trạng thái đơn hàng"** và **"Số liệu sản xuất"**.
  4. **Bỏ "Gom theo đơn"**, nhưng thêm **thanh % hoàn thành ở cột Mã đơn** trong bảng.
  5. Rà soát + **hỏi chuyên gia** (quan-ly-van-hanh, soat-giao-dien-cuoi…) phần trùng lặp có thể bỏ; số liệu thống kê có ý nghĩa thì giữ, không quan trọng thì bỏ – trình chủ dự án duyệt danh sách bỏ trước khi xóa.

## Bàn giao 14/11 (phiên dài – mở phiên mới cho việc tiếp theo)
- Xong: Đơn hàng giao nhận theo bộ phận + màu Navy (commit 14/11), CLAUDE.md đã nới quy tắc tiết kiệm token. Chờ chủ dự án dán 3 file. – [[KPI Đơn hàng giao nhận theo bộ phận (14-11)]]
- Còn mở: 48 SKU chưa khớp dòng gậy, Ø bảng ngọn gậy đánh – [[KPI Cấu hình gậy – bản vẽ kỹ thuật (08-11)]]. 11 lỗi cũ don-hang.js + 5 lỗi cũ quy-trinh-web.js chưa sửa.
- Dựng thử: `DATA=$S/that/csdl.json DH=$S/that/dh-that.json` (scratchpad cũ có thể đã mất – nếu mất thì xin chủ dự án JSON xuất Sheet).

Ghi chú này để phiên Claude Code mới nắm bối cảnh ngay. Đọc `CLAUDE.md`, rồi ghi chú này, rồi [[Liên kết và công cụ]] (mọi link Drive, repo, artifact, công cụ), rồi [[00 Mục lục]].

## PHIÊN 02/11 (tiếp) – 6 yêu cầu đã xong
- 03/11: mở tab Quy trình cho trưởng / phó phòng (chỉ xưởng mình, gửi đề xuất → chủ sở hữu duyệt) – [[KPI Quy trình sản xuất]] mục "Đợt 7".
- Thêm sau đó: Cấu hình sản phẩm trên web + báo sản phẩm mới ở Việc hôm nay + tự đọc tab kênh mới; PDF hướng dẫn 2 tab đã gửi (nguồn `kpi-app/tests/huong-dan/`). Chi tiết: [[KPI Quy trình sản xuất]] mục "Đợt 6".
- Đã làm + commit + push cả 6 yêu cầu (chi tiết: [[KPI Quy trình sản xuất]] mục "Đợt 5"). Chưa dán: Code.gs + Index.html + QuyTrinh.html (2-CAP-NHAT.bat).
- Chờ: chất liệu các mã chuôi nhảy / phá nhảy / Vũ trụ / Eclipse / Carom; file Excel cấu hình gậy + quy trình nháp; câu tip; họp trưởng phòng; Sơn hệ số lớp.
- Mẹo: repo clone **nông** làm link jsDelivr ghim sai commit khi dựng (SoDo.html đổi) → chạy `git fetch --unshallow origin claude/beautiful-ptolemy-f2j7za` trước khi dựng. Sheet đơn hàng quá lớn để tải qua Drive → dùng bộ đơn giả (`scratchpad/gen/tao-dh.js`) hoặc nhờ chủ dự án tải file lên.

## BÀN GIAO 02/11 (đọc phần này trước)
Phiên 31/10–02/11 rất dài, chủ dự án yêu cầu chuyển phiên mới. **Mọi việc đã commit + push** lên `claude/beautiful-ptolemy-f2j7za`, bộ não + bản đồ artifact đã cập nhật (bản 57). Chưa biết chủ dự án đã dán các đợt 31/10–02/11 lên web chưa (cách dán: bấm đúp `2-CAP-NHAT.bat`, bộ cài đã thay 31/10).

**Đã xong trong phiên** (chi tiết: [[KPI Quy trình sản xuất]], [[KPI Gộp công đoạn và tiến độ BTP]]):
- Tab **Quy trình sản xuất** (chỉ chủ sở hữu): cân bằng tải theo **sp/tháng** (9.000, 26 ngày; nhịp hiện nay đo từ đóng gói ~368/ngày – chủ dự án xác nhận "khá sát"), bảng thiếu/thừa người; **lưu đồ nhà máy** (thẻ kính, đường cong phát sáng, CNC→Ngọn Tip, CNC→Sơn "đầu gậy lết", CNC→Đóng gói "tip bán lẻ", POM Ngọn Taro→Phôi Thô); **lưu đồ từng xưởng kiểu nhà máy** (nhóm công đoạn chỉ để vẽ); điện thoại ẩn lưu đồ; **cách A** bước xuất mỗi xưởng → ra/ngày.
- Tab **Đơn hàng** riêng (chỉ chủ sở hữu): như web app đơn hàng + thống kê + Việc theo xưởng + Kiểm phân loại; bản chụp đơn 9h hằng ngày (sheet ẩn `DonHangChup`).
- Phân loại SKU 4 thông số + kiểu (đánh/nhảy/phá/phá nhảy) + chất liệu; 370/390 tên chắc chắn.
- File **Cau-hinh-gay-va-quy-trinh-nhap.xlsx** đã gửi chủ dự án (chỉ ở scratchpad, không commit; dựng lại bằng `kpi-app/tests/quy-trinh/xuat-cauhinh.js` (cần csdl.json + dh.json lấy lại từ Drive) rồi `tao-excel-cauhinh.py`).

**Chờ chủ dự án:**
- Gửi lại file Excel: 22 tên hàng vàng, sửa cấu hình dòng gậy, **chỗ sai trong sheet "Quy trình nháp"** (quy trình từng xưởng là bản nháp Claude tự soạn – chủ dự án thấy vài chỗ sai). Nhận file → gộp vào `PL_DONG` / `QT_NHAP` (+ sửa tay của chủ dự án trong sheet `PhanLoaiSKU`, `QuyTrinh`).
- Họp trưởng phòng về **gộp công đoạn có định mức khác nhau** – KHÔNG tự gộp danh mục KPI.
- Trả lời 02/11: **Sơn và In UV không làm ngọn** (so sánh với ~346 chuôi/ngày); **Sơn có ghi mỗi lớp sơn thành 1 lần riêng** → số ra/ngày của bước xuất Sơn (Sơn máy + súng ≈ 729) đang gồm nhiều lớp, nên cân nhắc hệ số chia hoặc chọn bước 1 lần/chiếc; câu "tip" chủ dự án chưa rõ – hỏi lại đơn giản: CNC ra ~1.200 tip + phíp/ngày trong khi cần ~350 ngọn/ngày, vậy 1 ngọn dùng mấy tip/phíp, có làm tip bán lẻ / để kho không?

**YÊU CẦU MỚI 02/11 (phiên mới làm ngay, hỏi rõ trước khi sửa code theo CLAUDE.md):**
1. Tab Đơn hàng → "Đơn cần chú ý": hiện thêm các đơn **quá hạn hơn 30 ngày** trong **1 thẻ riêng bên dưới** (hiện `DH_TRE_MAX=30` đang bỏ hẳn các đơn này – `dhChuY`, `dhVeChuY` trong `tests/quy-trinh/quy-trinh-web.html`).
2. Nhãn chất liệu của SKU phải có **2 nhãn: chuôi và ngọn** (hiện `plKieu_` chỉ có 1 `vl`; `dhVlChip`). Tách `vlChuoi` / `vlNgon` (bảng `PL_VL_CHUOI`, `PL_VL_NGON` trong `don-hang.gs`).
3. Thống kê tab Đơn hàng "nhóm hàng × chất liệu" chưa đúng với gậy 2 khúc (chuôi và ngọn có thể khác chất liệu) → thống kê riêng chuôi × chất liệu và ngọn × chất liệu (hoặc ma trận chuôi × ngọn).
4. Hỏi chuyên gia (`quan-ly-van-hanh`…) theo **Lean Six Sigma** để đưa ra các thống kê có giá trị thực tiễn cho tab Đơn hàng.
5. "Việc theo xưởng": **nhãn chất liệu nhiều dòng còn sai** → rà lại cách gán chất liệu theo từng xưởng (xưởng chuôi dùng chất liệu chuôi, xưởng ngọn dùng chất liệu ngọn, SKU dùng cả 2).
6. Tab Quy trình → "Sửa quy trình" **rất khó dùng**, chủ dự án đọc không hiểu → đề xuất 2–3 phương án sửa quy trình dễ hơn (vd. kéo thả thẻ trên lưu đồ xưởng, sửa theo nhóm, nhập từ Excel "Quy trình nháp"), có so sánh + khuyến nghị, hỏi chủ dự án chọn rồi làm.

**Gợi ý việc tiếp theo:** (1) xử lý file Excel khi chủ dự án gửi lại; (2) Sơn: hệ số lớp sơn cho bước xuất; (3) giai đoạn 2 thu tiến độ BTP: kiểm kê 1 lần + phiếu giao nhận 3 điểm (cách B) khi chủ dự án muốn.

## Trạng thái nhánh (25/10)
- Mọi việc đã commit và push lên `claude/beautiful-ptolemy-f2j7za`. Commit cuối: "ảnh web lấy từ repo qua jsDelivr" (25/10).
- Nhánh tạm `claude/beautiful-ptolemy-f2j7za-dang-lam` đã gộp hết vào nhánh chính, không còn dùng.
- Chủ dự án cập nhật web bằng bộ cài clasp: bấm đúp `2-CAP-NHAT.bat` rồi Ctrl+F5. Bộ cài nằm ở `kpi-app/cai-dat-clasp/`; lần gần nhất đã gửi lại bản zip ngày 24/10. Chưa biết chủ dự án đã cập nhật các đợt 24–25/10 lên web hay chưa.

## Việc đã làm 22–25/10 (chi tiết ở từng ghi chú)
- [[KPI Kỹ năng]]: tab mới, ma trận 4 cấp.
- [[KPI Hologram chủ sở hữu]]: giao diện riêng cho chủ sở hữu. Ngày 25/10 sửa lỗi menu điện thoại bị lớp nền tối che.
- [[KPI Bảng KPI tất cả xưởng]], [[KPI Phân tích định mức]] (tự chạy tháng hiện tại), [[KPI Cơm trưa]] (nhắc TP/PP số người chưa báo).
- [[KPI Sơ đồ nhà máy 3D]]:
  - Bỏ KPI / sĩ số ở cả 2D và 3D.
  - 2D dùng 3 ảnh mặt bằng chủ dự án gửi (đã nắn), thêm nút "Tách tầng" có chú thích xưởng, có đèn ban đêm.
  - Bản dọc đã thử rồi bỏ: chủ dự án muốn giữ bản ngang.
- [[KPI Màn đăng nhập Khắc laser]]: nền ảnh nhà máy ban đêm, thẻ nhân viên vân carbon được laser khắc mã và tên.
- [[KPI Ảnh web qua jsDelivr]]: 25/10 ảnh nền đăng nhập + mặt bằng sơ đồ lấy từ repo (công khai) qua jsDelivr, ghim commit; Claude tự làm, không cần Drive.

## Đã làm 31/10 (lịch sử)
- [[KPI Quy trình sản xuất]]: tab mới gộp Kỹ năng.
  - Đã chốt phương án C, chỉ chủ sở hữu xem.
  - Đã đọc 2 file chủ dự án gửi (danh mục mã hàng, trạng thái đơn hàng). Tiền tố mã cho biết chặng BTP; hàng còn thiếu ~12.000, giao ~250/ngày.
  - 31/10 đã làm bản đầu (commit "Tab Quy trình sản xuất…"), chưa dán. Bộ cài clasp mới đọc `danh-sach-file.txt`, đã gửi zip.

## Còn chờ / gợi ý
- 25/10: chủ dự án trả lời 4 câu (xem [[Quyết định của chủ dự án]] mục "KPI và định mức (25/10)"); đã sửa khoản "không nhắc" (chỉ Code.gs, chưa dán). Còn chờ: chủ dự án tự sửa Cân Phôi về 180 trên web; nội dung video giới thiệu.
- Hỏi chủ dự án: có cho chú tê giác Rhino và khung lời chào tự ẩn khi mở menu trên điện thoại không (hiện chúng đè lên cuối menu)? Chưa trả lời.
- Sơ đồ 3D đẹp như ảnh mẫu: chưa chọn. Xem [[Việc chờ chủ dự án]].
- Lỗi kiểm thử có từ trước, không phải do các lần sửa gần đây:
  - `mai-web.js` 31/32 (mục "lúc 10:05").
  - `com-trua-web.js` (viết cho dữ liệu ngày 12/10).
- Phần 3D của `so-do-web.js` chạy chậm (khoảng 10 phút với swiftshader). Phần 2D chạy được riêng, không cần `THREE=`.

## Mẹo môi trường
- Bản xem thử:
  - Dựng: `DATA=$S/dl4/csdl.json OUT=$S/xt-v.html GIO=2026-10-22T17:00:00+07:00 BO_HO_SO=1 TZ=Asia/Ho_Chi_Minh node tests/tao-ban-xem-thu.js`.
  - `$S` là scratchpad. Phiên mới tự lấy lại `csdl.json` từ Sheet CSDL KPI qua kết nối Google Drive (cách làm ở [[Liên kết và công cụ]]). Dữ liệu này **không commit**.
- Chromium trong sandbox không tin CA của proxy nên ảnh ngoài (jsDelivr) không hiện khi chụp thử: thay link bằng ảnh nhúng nếu cần chụp.
- Đừng chạy `pkill -f <tên>` trong cùng lệnh có chứa tên đó: nó tự giết chính shell của lệnh.
