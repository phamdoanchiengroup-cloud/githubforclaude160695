# Hướng dẫn cập nhật web app KPI – từng bước chi tiết

Bản này gồm **mọi thay đổi từ đầu** (sửa lỗi chốt tháng, bảo mật, màn đăng nhập mới, tăng tốc, giao diện mới). Bạn chưa dán lần nào thì chỉ cần làm theo file này từ trên xuống, **một lần là đủ**.

- **Hạn chót:** xong **trước 23h ngày 30/9**. Bản cũ sẽ tự chốt KPI tháng 9 vào giờ đó và chốt sai.
- **Thời gian:** khoảng 30–45 phút. Nên làm lúc ít người dùng (buổi trưa hoặc tối).
- **Cần có:** máy tính (không làm trên điện thoại), trình duyệt Chrome, đăng nhập đúng tài khoản Google đang giữ dự án Apps Script và file Sheet "CSDL KPI".
- **Cần dán lại 2 file:** `Code.gs` và `Index.html`.

> **Bản 11/10/2026 (tối) – Cơm trưa: thực đơn + đăng ký ăn.** Đổi **cả 2 file `Code.gs` và `Index.html`**. Làm **A3 (sao lưu) → B1 → B2 → Phần D**, rồi Ctrl+F5. Sau đó làm 2 việc:
> 1. **Tạo tài khoản cho người phụ trách bếp:** tab *Tài khoản* → Tạo tài khoản mới → Vai trò **"Bếp ăn"**. Tài khoản này chỉ thấy trang *Cơm trưa* (không xem được số liệu sản xuất, nhân sự).
> 2. **Kiểm tra trigger chốt tháng đã cài** (hàm `CAI_TRIGGER_CHOT_THANG`, Phần C). Tổng kết cơm trưa chạy cùng lúc chốt KPI tháng.
> - **Thanh thực đơn** hiện ở đầu **mọi trang của mọi tài khoản** ngay khi bếp lưu thực đơn: món ăn, hạn đăng ký, nút **🍚 Ăn** / **Không ăn**. Bấm vào thanh để mở trang *Cơm trưa*.
> - **16:00 hôm trước chỉ là giờ nhắc** (bếp báo khoảng 14–15h): thanh thực đơn đếm ngược tới 16:00; **quá giờ vẫn đăng ký / đổi được tới hết ngày ăn**, không ai bị mất suất vì bận hay quên. Người chưa đăng ký sau 16:00 thấy dòng nhắc "bạn chưa đăng ký, vẫn bấm được". Bảng tổng hợp ghi rõ **bao nhiêu người đăng ký sau giờ nhắc** (bấm xem tên, mã NV, xưởng, giờ đăng ký) để bếp biết số đã thay đổi. Muốn đổi giờ nhắc: mở hàm `DAT_GIO_CHOT_COM`, sửa số 16, bấm Chạy.
> - **Bếp hoặc ban điều hành** nhập thực đơn ở trang *Cơm trưa* (mỗi dòng một món, có ô ghi chú), sửa / xóa được thực đơn ngày chưa tới.
> - **Tổng hợp số suất theo xưởng** (ăn / không ăn / chưa đăng ký): ban điều hành, nhân sự, bếp xem cả danh sách tên; trưởng / phó phòng xem số của mọi xưởng và danh sách tên xưởng mình. Dưới mỗi bảng có **Danh sách không ăn** đủ **họ tên, mã nhân viên, xưởng** (ban điều hành / nhân sự / bếp thấy cả nhà máy, trưởng phòng thấy xưởng mình). Nút **📋 Chép số suất gửi bếp** để dán vào Zalo; nút **In**.
> - **Sang tháng mới** (ngày làm việc thứ 3, cùng lúc chốt KPI): số suất từng xưởng được đưa vào **báo cáo tháng** (mục "Suất ăn trưa"); danh sách ai ăn / không ăn / chưa đăng ký từng ngày (họ tên, mã NV, xưởng) + thực đơn được lưu thành file **"Đăng ký cơm trưa yyyy-mm"** trong thư mục Drive *Báo cáo KPI hằng tháng / tháng đó*, **rồi mới xóa** dữ liệu tháng cũ khỏi Sheet (không lưu được file thì không xóa). Muốn làm ngay: chạy hàm `TONG_KET_COM_THANG_TRUOC`.
> - Sheet mới tự tạo khi dùng lần đầu: `ThucDon`, `DangKyCom`, `SuatAnThang` – không cần tạo tay.

> **Bản 11/10/2026 – Sơ đồ nhà máy theo mặt bằng mới + phóng to dễ hơn.** Chỉ đổi **`Index.html`**. Làm **A3 (sao lưu) → B2 → Phần D**, rồi Ctrl+F5.
> - Phòng các tầng vẽ lại đúng **mặt bằng bố trí máy tầng 1–3** anh/chị gửi (diện tích, số người theo chữ ghi trên bản vẽ). Tầng 1: khu phôi thô, P. khuôn, khu đổ foam, phòng nén khí, P. kỹ thuật cạnh thang T-02, máy khu nướng / cuốn / cắt. Tầng 3: "Bộ phận may" và "Tập kết sản phẩm tạm" thành **kho**, "Máy CNC thùng chạy ren" thành **Phòng QC**, thêm Bàn cắt, Hoàn thiện, Phòng kỹ thuật, phòng máy MT.
> - **Tầng 2:** toàn bộ các phòng phía dưới hành lang (khu chờ khô, P. quản lý BP Sơn, P. kiểm tra chuẩn bị, P. ráp tuốt lót, buồng sấy, khu buồng sơn kín, khu sơn tĩnh điện) tính vào **xưởng Sơn**.
> - **Phòng đóng gói (tầng 3)** dựng theo ảnh chụp thực tế: sàn epoxy trắng bóng, vạch vàng đen quanh khu bàn, 12 bàn đóng gói có khung đèn LED, kệ xanh–cam K1–K11 / Kh1–3 chất thùng carton, 4 bàn khắc laser dọc vách hành lang, máy co màng, cột tủ chữa cháy.
> - **Phòng ngọn (tầng 3)** dựng theo ảnh chụp: sàn trắng, vạch vàng đen, bàn tiện mini xanh (MT1–7, D1–6) và máy CNC nhỏ có màn hình (M1–9) đều có ống hút bụi tôn xoắn từ trần + ống mềm trắng, xe đẩy ống giấy cắm ngọn cơ đen đầu vàng, sọt nhựa xanh.
> - **Dựng theo ảnh chụp thực tế (11/10):** tầng 1 khu phôi thô (máy tiện + hút bụi, máy rót foam, thùng phuy, P. khuôn) và khu phôi carbon (máy cuốn, lò nướng, máy rút khuôn, máy chuốt, bàn kính ISO, sàn gạch xám); tầng 2 phòng In UV (máy in kín, xe jig), bộ phận Sơn (buồng sơn kín có ống hút, máy phun sơn tự động xanh), phòng Hoàn thiện (máy đánh bóng, máy ra tự động, máy chà nhám, bàn bi-a thử cơ ở ISO, máy tiện + tiện CNC ở P. cắt mặt); tầng 3 phòng CNC (máy router), Phòng da (đổi tên từ P. kỹ thuật làm phôi: máy ép, máy lạng da), máy in pad, phòng họp, Phòng QC (bàn bi-a, xe cơ, ghế cao); phòng đóng gói sắp lại thành 2 dãy bàn dài, máy co màng + hầm co, pallet hàng.
> - **Tòa điều hành:** bản 3D có thêm 4 nút **VP tầng 1–4** để xem bên trong từng tầng (ẩn vỏ tòa nhà): tầng 1 phòng trưng bày kệ đen + bàn bi-a đang lắp; tầng 2 sảnh đá xám, phòng kính khung đen (Ban giám đốc, Phòng họp, Văn phòng), thang máy, WC; tầng 3 bếp, phòng ăn VIP, phòng ăn chung, ban công lan can kính; tầng 4 phòng ăn chung. Cầu thang bộ tòa điều hành lan can kính tay vịn gỗ; cầu thang bộ giữa tòa điều hành và xưởng làm lại bậc đá đen cổ trắng, lan can thép hộp đen.
> - **Tòa điều hành dựng lại theo bản vẽ KT (mặt bằng T1–T4, tường xây, thoát nạn, mặt đứng):** cao độ sàn +4,20 / +8,10 / +12,00, mái +15,90; lõi thang máy + thang bộ T-01 + WC + kho chuyển về dải trục A–B (trước nằm giữa sàn). Tầng 1: Kho-1, Phòng họp-1, Gym, Ban điều hành, Khu trưng bày 93 m² (2 bàn bi-a), Lễ tân, WC-1, Y tế; cánh Nam: máy phát, nhà điều khiển điện, trạm biến áp. Tầng 2: Kế toán, Phòng họp-2, Chủ tịch, TGĐ, Thiết kế (2 cụm 12 bàn), Kinh doanh – Marketing, Hành chính, WC-2, Kho-2. Tầng 3: Phòng ăn VIP + Bếp phía xưởng, Phòng ăn 72 người phía mặt tiền, ban công, Kho đồ khô, WC-3. Tầng 4: Phòng ăn 120 người, hiên trước, lô-gia, Soạn chia, WC-4.
> - **Nhà xe 2 bánh** dựng lại theo bản vẽ (hình thang 17,9 × 34,2 m, mái 2 khung dốc 10 %, 169 chỗ, nhà rác ở góc Bắc) và đặt đúng **cuối khu đất**, cạnh xiên theo ranh đất, nhà rác ở góc phía Nam (ranh cuối khu đất nay cũng xiên). **Nhà để xe 4 bánh + phòng bơm + bể nước PCCC ngầm** (BNN-01) đặt dọc hàng rào phía cổng, sau tường biển tên, phòng bơm ở đầu Bắc (thay bãi 5 xe và "nhà phụ trợ" cũ).
> - **Máy móc, đồ dùng dựng lại theo ảnh chụp:** sóng nhựa xanh (thùng lưới, chồng tầng), kệ V lỗ có giằng chéo, xe jig có hàng kẹp, bàn bi-a đen nỉ xám chân vuông có lỗ, bàn khung thép mặt gỗ đen, ghế cao có vòng để chân, **ghế đẩu nhựa xanh** (tự đặt cạnh bàn làm việc), router CNC (cổng trục cao, cụm trục Z trắng, xích cáp), máy phun sơn tự động (khung xanh cao 2,6 m), buồng sơn (vách sau inox), máy đánh bóng (mô-tơ 2 bánh vải + chụp hút), máy ra tự động (tủ kem khung đen, màn hình, con lăn đỏ), máy cuốn (thêm vô lăng).
> - **Xem 3D trên điện thoại:** nút **"Xem 3D"** nay hiện cả trên điện thoại. Điện thoại tự dùng chế độ **⚡ Nhẹ** (tắt đổ bóng, giảm độ nét, ẩn công nhân, chỉ vẽ lại khi có thao tác) cho đỡ giật và đỡ nóng máy; bấm nút đó để chuyển sang **✦ Đầy đủ** nếu máy mạnh. Thao tác: kéo 1 ngón để xoay, 2 ngón để dời, chụm/mở 2 ngón để phóng to.
> - **Bộ phận đóng gói** có 14 công nhân, mỗi người đứng tại một bàn đóng gói.
> - **Rà soát lại 3D theo toàn bộ ảnh chụp:** vách ngăn thành tường panel trắng cao hết trần, có ô kính giữa (trước là tường thấp + kính); sàn xưởng epoxy trắng xám bóng (trước là xanh); cột trắng; cửa nhôm đen nửa trên kính; vạch sàn hành lang thành băng vàng–đen; máy tiện khu phôi thô màu xanh rêu đậm, thân to hơn; buồng sơn bỏ ống tròn nằm ngang, thay bằng ống hút đứng lên trần; tòa điều hành: sàn gạch xám sáng (trước bị ánh xanh đậm), tầng 1 có vách kính khung đen mặt tiền và cột trắng giữa phòng.
> - **Phóng to:** sơ đồ phẳng cuộn chuột để phóng đúng chỗ con trỏ, kéo để dời, nhấp/chạm đúp để phóng nhanh, nút **+ − ⌂**; bản 3D phóng theo con trỏ, có nút **+ − ⌂** và nhấp đúp để bay tới chỗ đó.

> **Bản 10/10/2026 (tối) – Sơ đồ nhà máy.** Chỉ đổi **`Index.html`**. Làm **A3 (sao lưu) → B2 → Phần D**, rồi Ctrl+F5.
> - Menu mới **"Sơ đồ nhà máy"** (dưới Tổng quan) cho Ban điều hành và Trưởng phòng: mặt bằng 3 tầng theo bản vẽ, mỗi khu tô màu theo **KPI tháng này** (sản lượng đã chốt từ đầu tháng, cùng cách tính với "So sánh hiệu suất giữa các xưởng") hoặc **Sĩ số hôm nay** (xưởng đã điểm danh). Chạm khu để xem KPI, có mặt, số dòng chờ duyệt và **máy đang báo bảo trì** của xưởng.
> - Trưởng phòng chỉ thấy số của xưởng mình. Công nhân không có menu này.
> - Máy tính có nút **"Xem 3D"** (mô hình 3D, cần mạng để tải thư viện; điện thoại dùng bản 2D).
> - **Bảng ghép khu ↔ xưởng** (chỉ Ban điều hành, cuối trang): ghép tạm theo tên khu trên bản vẽ; chọn lại nếu sai – lựa chọn lưu trên trình duyệt của máy đó. Máy bảo trì chưa có vị trí trên bản vẽ nên hiện theo xưởng, chưa nháy trên sơ đồ.

> **Bản 10/10/2026 – Hiệu ứng thao tác + hiệu ứng màn đăng nhập.** Chỉ đổi **`Index.html`**. Làm **A3 (sao lưu) → B2 → Phần D**, rồi Ctrl+F5.
> - **Màn đăng nhập:** mở trang là **cửa cuốn** đóng – kéo lên (hoặc chạm tay nắm / nhấn Enter) mới thấy ô nhập; chưa điền đủ mà rê chuột vào **Đăng nhập** thì nút chạy trốn (điện thoại: chạm thì nút nhảy sang bên); mắt Mai nhìn theo chữ đang gõ, bật Caps Lock thì Mai bịt tai; sai mật khẩu 3 lần liền thì khóa kiểu két sắt 30 giây; lời chào và màu nền đổi theo giờ (ca đêm tông vàng ấm). Máy bật "giảm chuyển động" thì bỏ qua cửa cuốn.
> - **Duyệt sản lượng:** bấm Duyệt / Từ chối thì nhóm đó đóng tem **ĐÃ DUYỆT / TRẢ LẠI** và có **4 giây "Hoàn tác"** rồi mới gửi đi (Từ chối không hỏi "Bạn có chắc?" nữa). Điện thoại: **vuốt cả nhóm** sang phải = Duyệt, sang trái = Từ chối.
> - **Chốt ca:** thay nút bằng **cần gạt** – kéo hẳn xuống đáy mới chốt (bàn phím: chọn cần gạt rồi Enter). Thẻ Chờ chốt: **Xóa** dòng có **Hoàn tác 5 giây**; điện thoại vuốt dòng sang trái để xóa.
> - **Kéo xuống ở đầu trang để làm mới** (điện thoại). **Nhập sai** thì Mai đứng cạnh ô và chỉ tay. **KPI cá nhân hạng A** hoặc gửi đều 7 ngày liền: pháo giấy (mỗi ngày 1 lần). **Hết phiên:** màn tối, sợi dây thả xuống – kéo dây là hiện hộp **đăng nhập lại ngay tại chỗ**, không mất trang đang xem.
> - **Giữ nguyên như cũ:** trang công nhân nhập sản lượng và trang điểm danh.

> **Bản 09/10/2026 (tối) – Màn đăng nhập "Khắc laser" (thương hiệu Rhino).** Chỉ đổi **`Index.html`** (đã gồm cả cột Ngày ở thẻ Chờ chốt bên dưới). Màn đăng nhập mới: nền ảnh ngọn carbon Rhino trong cát đen; gõ **mã nhân viên** thì tia laser khắc mã lên ngọn cơ (mật khẩu không bao giờ hiện lên), Mai chào ở góc bảng đăng nhập. Ảnh và font đã nằm sẵn trong file nên file nặng hơn (~1 MB) – dán bình thường. Làm **A3 (sao lưu) → B2 → Phần D**.

> **Bản 09/10/2026 – Ngày trong thẻ "Chờ chốt".** Chỉ đổi **`Index.html`**: thẻ *Chờ chốt* (trưởng/phó phòng, trang nhập sản lượng) có thêm **cột Ngày** (ngày/tháng + thứ). Cùng một người mà nhập 2 ngày khác nhau thì tách thành 2 nhóm; ngày không phải hôm nay tô **màu vàng** kèm chữ "không phải hôm nay", và danh sách có nhiều ngày thì hiện lời nhắc kiểm tra trước khi bấm **Chốt ca**. Làm **A3 (sao lưu) → B2 → Phần D**.

> **Bản 08/10/2026 – Nhân vật Mai.** Chỉ đổi **`Index.html`**. Mai (nhân vật chibi) chào mỗi ngày, hiện khẩu hiệu của ngày ở *Việc hôm nay* và *Nhập sản lượng*, hướng dẫn công nhân lần đầu vào trang nhập (nút **? Hướng dẫn nhập** để xem lại), **đọc lại số trước khi công nhân gửi** (bấm "Đúng rồi, gửi" mới gửi), khen sau khi gửi, động viên theo hạng ở *KPI cá nhân*, nhắc nghỉ lúc 10:00 và 15:00. Ai không thích bấm nút **🙂 Mai** ở đầu trang để tắt. Làm **A3 (sao lưu) → B2 → Phần D**.

> **Bản 07/10/2026 (tối) – Sửa lỗi treo khung "Đang tổng hợp báo cáo".** Chỉ đổi **`Index.html`**: khi máy chủ báo lỗi, khung chờ tự đóng và hiện rõ lời báo lỗi (trước đây khung che mất lời báo lỗi nên trông như treo); chờ quá 60 giây có nút Đóng. Muốn tải được PDF thì **`Code.gs` cũng phải là bản mới** (có `layBaoCaoThang`) và đã cấp quyền theo **Phần F**.

> **Bản 07/10/2026 (chiều) – Sửa lỗi + Lottie đợt 3.** Chỉ đổi **`Index.html`**: sửa lỗi **thẻ "So sánh hiệu suất giữa các xưởng" (tab Tổng quan) không hiện vạch** – lỗi có từ bản 29/09, các thanh khác cùng kiểu cũng được sửa; thêm hoạt ảnh khi từ chối/trả lại sản lượng, đổi tình trạng máy, ghi vi phạm, đăng ký nghỉ dài hạn, thêm nhân sự, đổi mật khẩu. Làm **A3 (sao lưu) → B2 → Phần D**.

> **Bản 07/10/2026 – Hoạt ảnh Lottie đợt 2.** Chỉ đổi **`Index.html`**: thêm hoạt ảnh khi chốt tháng, lưu điểm danh, công nhân gửi sản lượng, xuất Excel, trang "chưa có dữ liệu"; **hết phiên đăng nhập không tự tải lại trang nữa** mà chờ bấm "Đăng nhập lại". Làm **A3 (sao lưu) → B2 → Phần D**.

> **Bản 06/10/2026 – Hoạt ảnh Lottie.** Chỉ đổi **`Index.html`** (4 hoạt ảnh: đang tổng hợp báo cáo, dấu tích khi duyệt, "Đã duyệt hết", mất kết nối có nút Thử lại). Đã dán bản 05/10 thì chỉ cần **A3 (sao lưu) → B2 → Phần D**. Mạng chặn thư viện hoạt ảnh thì web tự dùng hình tĩnh, không ảnh hưởng chức năng.

> **Bản 05/10/2026 – Báo cáo tháng.** Nếu bạn **đã dán bản trước** và chỉ cần thêm báo cáo tháng: làm **A3 (sao lưu) → B1 → B2 → Phần F → Phần D**. Nếu chưa dán lần nào: làm cả file từ trên xuống, Phần F làm sau Phần C.

---

## Phần A — Chuẩn bị

### A1. Tải 2 file mới về máy

Cách 1 (dễ nhất): tải 2 file `Code.gs` và `Index.html` mà Claude gửi trong khung chat.

Cách 2: lấy trên GitHub:
1. Mở repo, vào thư mục `kpi-app`, bấm vào file `Code.gs`.
2. Bấm nút **Raw** (góc phải phía trên nội dung file).
3. Trang chỉ còn chữ: nhấn **Ctrl+A** rồi **Ctrl+C** là đã chép xong. Làm tương tự với `Index.html`.

**Cách mở file đã tải để chép:** bấm chuột phải vào file → **Mở bằng** → **Notepad**. Trong Notepad: **Ctrl+A** (chọn hết) → **Ctrl+C** (chép).

> Đừng mở `Index.html` bằng cách bấm đúp: file sẽ mở thành trang web trong Chrome, không chép mã được.

### A2. Mở dự án Apps Script

1. Mở Google Sheet **CSDL KPI**.
2. Menu **Tiện ích mở rộng** → **Apps Script**. Một thẻ mới mở ra, đó là trình soạn thảo.
   - Nếu dự án là dự án riêng (không gắn với Sheet), mở https://script.google.com và bấm vào tên dự án web app KPI.
3. Cột bên trái có mục **Tệp**, trong đó có `Code.gs` và `Index.html`.

### A3. Sao lưu (bắt buộc)

1. Ở cột ngoài cùng bên trái, bấm biểu tượng **ⓘ Tổng quan**.
2. Góc trên bên phải, bấm biểu tượng **Tạo bản sao** (hình hai tờ giấy chồng nhau).
3. Một bản "Bản sao của …" được tạo. Có bản này thì lỡ lỗi vẫn quay lại được. Bạn **tiếp tục làm trên dự án gốc**, không làm trên bản sao.
4. Bấm biểu tượng **< >  Trình chỉnh sửa** ở cột trái để quay lại màn hình mã.

---

## Phần B — Dán mã mới

### B1. Dán Code.gs

1. Ở cột trái, bấm vào **Code.gs**.
2. Bấm chuột vào giữa vùng mã, nhấn **Ctrl+A** (bôi đen hết) rồi **Delete**. Vùng mã trống trơn.
3. Mở file `Code.gs` mới bằng Notepad, **Ctrl+A**, **Ctrl+C**.
4. Quay lại Apps Script, bấm vào vùng mã trống, nhấn **Ctrl+V**. Mã dài khoảng 5.270 dòng, đợi vài giây cho dán xong.
5. Nhấn **Ctrl+S** để lưu. Tên file không còn dấu chấm tròn là đã lưu.

**Kiểm tra dán đủ:** kéo xuống cuối file. Dòng cuối cùng phải là:
```
  return napDuLieuLoi_(token, phan && phan.length ? phan : null);
}
```
Nếu Ctrl+S báo lỗi kiểu "Lỗi cú pháp…" thì thường là dán thiếu: xóa hết và dán lại.

### B2. Dán Index.html

1. Ở cột trái, bấm vào **Index.html**.
2. **Ctrl+A** → **Delete**.
3. Mở file `Index.html` mới bằng Notepad, **Ctrl+A**, **Ctrl+C**.
4. Quay lại Apps Script, **Ctrl+V**. File dài khoảng 6.380 dòng, trong đó có 1 dòng rất dài (ảnh ngọn cơ). Đợi dán xong.
5. **Ctrl+S**.

**Kiểm tra:** dòng cuối cùng là `</html>`.

### B3. Đặt múi giờ dự án

1. Cột trái, bấm biểu tượng **⚙ Cài đặt dự án**.
2. Mục **Múi giờ**: chọn **(GMT+07:00) Giờ Đông Dương – Hồ Chí Minh**. Nếu đã đúng thì để nguyên.
3. Bấm **< > Trình chỉnh sửa** để quay lại.

### B4. Bật dịch vụ Google Sheets API (để trang mở nhanh hơn)

1. Cột trái, cạnh chữ **Dịch vụ**, bấm dấu **+**.
2. Trong danh sách, bấm **Google Sheets API**.
3. Giữ nguyên ô **Mã nhận dạng** là `Sheets`, bấm **Thêm**.
4. Dưới mục **Dịch vụ** xuất hiện dòng **Sheets** là xong.

Nếu vì lý do nào đó không thêm được, bỏ qua bước này và bỏ qua hàm số 8 ở Phần C. Web vẫn chạy bình thường, chỉ mở chậm hơn một chút.

---

## Phần C — Chạy các hàm một lần

### Cách chạy một hàm

1. Bấm vào **Code.gs** ở cột trái (ô chọn hàm chỉ liệt kê hàm của file đang mở).
2. Trên thanh công cụ, cạnh nút **▶ Chạy** và **Gỡ lỗi**, có một ô chứa tên hàm. Bấm vào ô đó để mở danh sách.
3. Danh sách xếp theo thứ tự trong file và khá dài. Các hàm chạy tay đa số nằm **gần cuối** danh sách, hãy cuộn xuống. Tên hàm viết HOA nên dễ nhận ra.
4. Bấm vào đúng tên hàm, rồi bấm **▶ Chạy**.
5. Phía dưới hiện khung **Nhật ký thực thi**. Đợi đến khi có dòng **"Đã hoàn tất thực thi"**, rồi đọc các dòng thông báo phía trên nó.

### Lần chạy đầu: Google hỏi cấp quyền

Chỉ xảy ra một lần (hoặc thêm một lần sau khi bật Sheets API):
1. Hộp **"Cần cấp quyền"** hiện ra: bấm **Xem lại quyền**.
2. Chọn tài khoản Google của bạn.
3. Nếu hiện **"Google chưa xác minh ứng dụng này"**: bấm chữ nhỏ **Nâng cao**, rồi **Đi tới … (không an toàn)**. Đây là mã của chính bạn nên an toàn.
4. Bấm **Cho phép**. Sau đó bấm **▶ Chạy** lại hàm đó.

### Chạy lần lượt 9 hàm dưới đây

Chạy **đúng thứ tự**, xong hàm này mới chạy hàm kia. Cột "Thông báo mong đợi" là kết quả khi chạy thử trên bản sao dữ liệu ngày 28/9; số của bạn có thể chênh một chút.

| # | Hàm | Việc hàm làm | Thông báo mong đợi |
|---|---|---|---|
| 1 | `CAI_LAI_TAT_CA_TRIGGER` | Xóa và cài lại 6 việc chạy tự động theo giờ VN. Chốt tháng giờ chạy vào **ngày làm việc thứ 3 của tháng sau** | 6 dòng "Đã cài trigger…" và "Xong: đã cài 6 trigger theo giờ Việt Nam." |
| 2 | `TAO_SHEET_NGAY_LE` | Tạo trang tính **NgayLe** (có sẵn 1–2/9/2026 và 1/1/2027) | "Đã tạo sheet NgayLe với 3 ngày mẫu…" |
| 3 | `NGUNG_TK_NGHI_VIEC` | Ngừng tài khoản của người đã chuyển "Nghỉ việc" | "Đã ngừng 9 tài khoản: c491 (…), …" |
| 4 | `BO_SUNG_MA_GHI_VIPHAM` | Thêm mã cho các vi phạm "nhập trễ" cũ, để xóa lẻ được trên giao diện | "Đã bổ sung mã ghi cho 95 vi phạm." |
| 5 | `DON_PHAT_NHAP_TRE_TP_PP` | Xóa các lượt phạt oan của trưởng/phó phòng (hàm này nằm ở **giữa** danh sách) | "Đã dọn: 11 dòng PhatNhapTre…" |
| 6 | `BAT_BUOC_DOI_MAT_KHAU_MAC_DINH` | Bắt mọi tài khoản còn dùng mật khẩu 123456 phải đặt mật khẩu mới ở lần đăng nhập tới. **Không** đổi mật khẩu của ai | "Đã bật "phải đổi mật khẩu" cho 4 tài khoản…" |
| 7 | `SUA_NGAY_NHAT_KY` | Tìm dòng nhật ký bị sai ngày. Xem mục **C1** ngay dưới bảng | "=== 55 dòng nhật ký có ngày sai (chế độ XEM) ===" rồi danh sách |
| 8 | `KIEM_TRA_SHEETS_API` | Chỉ chạy nếu đã làm B4. So từng ô giữa cách đọc cũ và mới, khớp hết mới bật đọc nhanh | "KHỚP toàn bộ 24 trang tính. ĐÃ BẬT đọc gộp bằng Sheets API." |
| 9 | `KIEM_TRA_SAU_CAP_NHAT` | Kiểm tra lại mọi thứ (chỉ đọc, không sửa gì) | Xem mục **C2** |

**Trước khi chạy hàm số 6:** báo trước cho mọi người (kể cả giamdoc, phogd2, nhansu, kcs nếu còn dùng 123456) rằng lần đăng nhập tới web sẽ bắt đặt mật khẩu mới. Nếu **chính bạn** còn dùng 123456 thì bạn cũng sẽ bị hỏi; hãy chọn mật khẩu bạn nhớ được.

**Nếu hàm số 8 báo "Có … ô lệch → CHƯA bật":** không sao, web vẫn chạy cách đọc cũ. Chụp màn hình nhật ký gửi Claude xem.

**Nếu hàm nào báo lỗi màu đỏ:** chụp màn hình khung Nhật ký thực thi, gửi Claude. Không cần làm lại từ đầu.

### C1. Sửa ngày sai trong nhật ký (hàm số 7)

Hàm này có 2 chế độ. Lần chạy đầu ở chế độ **XEM**: chỉ liệt kê, không sửa gì.

**Lần 1 – xem danh sách:** chạy `SUA_NGAY_NHAT_KY`. Mỗi dòng trong nhật ký có dạng:
```
Dòng 588 | C049 | HT-HK-1 | Đã chốt | ngày đang ghi: 2026-01-08 | nhập lúc: 2026-08-30 | TỰ SỬA thành 2026-08-01
```
- "Dòng 588" là số dòng trong trang tính **NhatKySanXuat**.
- **TỰ SỬA thành …**: hàm chắc chắn (ngày và tháng bị đảo), sẽ tự sửa ở lần 2.
- **có thể là … (sửa tay)** hoặc **không đoán được**: bạn phải tự sửa trong Sheet.

**Lần 2 – cho hàm tự sửa:**
1. Trong Code.gs, nhấn **Ctrl+F**, gõ `var CHE_DO`, nhấn Enter. Con trỏ nhảy tới dòng:
   ```
   var CHE_DO = 'XEM';   // <-- đổi thành 'SUA' ở bước 2
   ```
2. Sửa chữ `XEM` thành `SUA` (giữ nguyên hai dấu nháy đơn): `var CHE_DO = 'SUA';`
3. **Ctrl+S**, rồi chọn lại hàm `SUA_NGAY_NHAT_KY` và bấm **▶ Chạy**. Cuối nhật ký báo "ĐÃ SỬA 21 dòng…" (21 dòng của C049).
4. Sửa lại `SUA` thành `XEM` rồi **Ctrl+S**, để lần sau lỡ bấm chạy cũng không sửa gì.

**Các dòng còn lại – sửa tay trong Google Sheet:** mở trang tính **NhatKySanXuat**, tìm đúng số dòng, sửa ô cột **Ngay** theo dạng `2026-08-04`.
- 5 dòng C049 có ô ngày lỗi `#VALUE!`. Nhiều khả năng là 04/08: C049 nhập các ngày 1, 3, 5, 6… tháng 8, thiếu đúng ngày 4.
- 9 dòng xưởng DG nhập ngày 03/09 nhưng ghi ngày 27, 28, 29/9 (khi nhập các ngày đó chưa tới). Nhiều khả năng là 27–29/8. **Hỏi trưởng phòng xưởng DG** cho chắc.
- 4 dòng DG nhập 03/09 ghi ngày 07/09. Hàm gợi ý 07/08, nhưng cũng nên hỏi trưởng phòng DG.
- 1 dòng C631 nhập 26/08 ghi 21/09: dòng đã bị từ chối, không ảnh hưởng KPI, sửa hay không cũng được.
- 6 dòng C668 ghi năm 1483: sửa thành `2026-09-15`.
- Các dòng ô ngày trống và dòng `2026-10-10`: hỏi trưởng phòng rồi điền.

Nếu chưa hỏi được ai thì cứ để đó, làm tiếp Phần D rồi sửa sau cũng được. Sửa xong các dòng thuộc tháng 8 (tháng đã chốt) thì làm thêm bước E3.

### C2. Đọc kết quả kiểm tra (hàm số 9)

Hàm in ra nhiều dòng. Những dòng nên thấy:
- `Múi giờ dự án: Asia/Ho_Chi_Minh (đúng)`
- `Trigger đang cài:` có đủ 6 tên: chayPhatNhapTre, chotThangTuDong, snapshotKPIHangNgay, donTokenHetHan, saoLuuHangNgay, LUU_TRU_NHAT_KY.
- `Tài khoản của người đã nghỉ việc vẫn "Đang dùng": 0`
- `Vi phạm thiếu mã ghi: 0`
- `Sheet NgayLe: 3 ngày` (hoặc nhiều hơn nếu bạn đã thêm)

Dòng nào có dấu **->** là việc còn phải làm, ví dụ `-> chạy CAI_LAI_TAT_CA_TRIGGER`: chạy hàm được chỉ tên rồi chạy lại hàm số 9. Riêng dòng "ngày sai → SUA_NGAY_NHAT_KY" sẽ còn cho tới khi bạn sửa tay xong mục C1, không sao.

---

## Phần D — Triển khai phiên bản mới (bắt buộc)

Chưa làm bước này thì người dùng vẫn thấy bản cũ.

1. Góc trên bên phải trình soạn thảo, bấm nút xanh **Triển khai** → **Quản lý triển khai**.
2. Bên trái chọn bản triển khai đang dùng (thường chỉ có một, loại "Ứng dụng web").
3. Bấm biểu tượng **✏️ Chỉnh sửa** (hình bút chì, phía trên bên phải).
4. Ô **Phiên bản**: bấm vào, chọn **Phiên bản mới**. Có thể gõ mô tả "Cập nhật 29/9".
5. **Không** đổi các ô khác (Thực thi dưới dạng, Ai có quyền truy cập).
6. Bấm **Triển khai**, rồi **Xong**.

Đường link web app **giữ nguyên**, không phải gửi lại cho ai.

> Không bấm **"Triển khai mới"** vì sẽ tạo ra link mới. Chỉ dùng **Quản lý triển khai → ✏️**.

---

## Phần F — Báo cáo tháng (PDF tự động)

Mỗi tháng, vào **ngày làm việc thứ 3** (lúc 23h chốt KPI tháng trước), hệ thống tự tạo báo cáo PDF và làm 3 việc:

- Lưu vào Google Drive, thư mục **Báo cáo KPI hằng tháng / 2026-09** (mỗi tháng một thư mục). Trong đó có **1 báo cáo toàn nhà máy** và **1 báo cáo cho mỗi xưởng**.
- Gửi email báo cáo toàn nhà máy cho ban lãnh đạo, kèm tóm tắt và các nhận định chính ngay trong email.
- Gửi email báo cáo xưởng cho người phụ trách xưởng đó (nếu có trong danh sách).

Trưởng phòng và ban điều hành cũng **tải được bất cứ lúc nào** trên web: **Bảng KPI → khung "Báo cáo tháng"** → chọn tháng → **Tải PDF** hoặc **Xem & in**.

### F1. Tạo danh sách người nhận (làm 1 lần)

1. Trong Apps Script, chạy hàm **`TAO_SHEET_NGUOI_NHAN_BAO_CAO`** (cách chạy như mục "Cách chạy một hàm" ở Phần C).
2. Mở Google Sheet "CSDL KPI". Có thêm trang tính **NguoiNhanBaoCao** với 3 cột: `Email | NhanBaoCao | GhiChu`.
3. **Xóa dòng mẫu**, rồi điền mỗi người một dòng:

| Email | NhanBaoCao | Ý nghĩa |
|---|---|---|
| giamdoc@congty.com | `TOAN_NHA_MAY` | nhận báo cáo toàn nhà máy |
| truongphong.son@congty.com | `SON` | nhận báo cáo riêng xưởng Sơn (ghi **mã xưởng**) |
| nhansu@congty.com | `TAT_CA` | nhận báo cáo toàn nhà máy **và** tất cả xưởng |

   Mã xưởng xem trong trang tính **PhongBan** (cột `MaXuong`), hoặc xem dòng chữ hiện ra sau khi chạy hàm ở bước 1.

### F2. Cấp quyền Drive và Gmail, gửi thử (bắt buộc làm 1 lần)

Báo cáo cần thêm quyền **lưu file vào Drive** và **gửi email**. Google chỉ hỏi quyền khi bạn tự chạy tay một lần:

1. Chạy hàm **`GUI_BAO_CAO_THANG_TRUOC`**.
2. Google hiện hộp **"Cần được cho phép"** → **Xem lại quyền** → chọn tài khoản → **Nâng cao → Đi tới … (không an toàn)** → **Cho phép**. Đây là dự án của chính bạn nên an toàn.
3. Đợi khoảng 1 phút. Dòng cuối của **Nhật ký thực thi** ghi kiểu: `Đã tạo 10 tệp trong Drive và gửi 3 email cho kỳ 2026-09.`
4. Mở Google Drive, vào thư mục **Báo cáo KPI hằng tháng → 2026-09** để xem các file PDF. Mở hộp thư để xem email.

> Không làm F2 thì đến ngày chốt, máy vẫn chốt KPI bình thường nhưng **không gửi được báo cáo** (thiếu quyền).
> Hàm `GUI_BAO_CAO_THANG_TRUOC` cũng dùng để **gửi bù** khi lỡ ngày, hoặc **gửi lại** sau khi sửa số liệu. File cũ cùng tên trong Drive tự chuyển vào thùng rác, không bị trùng.

### F3. Báo cáo gồm những gì

- **Toàn nhà máy:**
  - 6 chỉ số chính, so với tháng trước;
  - nhận định tự động bằng lời (xưởng dẫn đầu / thấp nhất, xưởng giảm mạnh, số người loại D, công đoạn dưới định mức, chuyên cần, vi phạm);
  - bảng so sánh 9 xưởng;
  - phân bố xếp loại A+ → D;
  - biểu đồ sản lượng theo ngày;
  - 10 người dẫn đầu và 10 người cần hỗ trợ;
  - công đoạn dưới 85% định mức;
  - công đoạn nhiều lỗi;
  - KPI trưởng/phó phòng.
- **Từng xưởng:**
  - tóm tắt và vị trí của xưởng so với toàn nhà máy;
  - nhận định;
  - **bảng KPI từng công nhân** (hạng, 4 thành phần, so với tháng trước);
  - sản lượng theo ngày;
  - 15 công đoạn chính;
  - chuyên cần từng người;
  - danh sách vi phạm;
  - KPI quản lý của xưởng.
- Số KPI **lấy đúng như Bảng KPI trên web** (bản chốt chính thức). Tải tháng chưa chốt thì báo cáo ghi rõ "tạm tính".
- Tháng 8/2026 mới bắt đầu dùng web, ít dữ liệu, nên báo cáo tháng 9 **không so sánh** với tháng 8. Từ tháng 10 trở đi sẽ có cột so sánh.

---

## Phần E — Kiểm tra trên web và việc của bạn

### E1. Mở web app

1. Mở link web app như mọi ngày.
2. Nhấn **Ctrl+F5** để trình duyệt bỏ bản cũ đã lưu. Điện thoại: đóng hẳn trình duyệt rồi mở lại.
3. Thấy màn đăng nhập mới (bi cái và ngọn cơ carbon, nền trắng ngà) là đúng.
4. Đăng nhập **chienpham**. Vào xong sẽ thấy menu dọc bên trái và trang **Việc hôm nay**.

Nếu vẫn thấy giao diện cũ: kiểm tra lại Phần D (đã chọn **Phiên bản mới** chưa), rồi Ctrl+F5.

### E2. Cấp mật khẩu mới cho ban điều hành

1. Menu trái → **Hệ thống → Tài khoản**.
2. Ở dòng `giamdoc`, bấm nút **Cấp lại MK**. Máy hiện một **mật khẩu tạm 6 số ngẫu nhiên**: ghi lại, báo riêng cho người dùng tài khoản đó. Họ sẽ phải đổi ngay khi đăng nhập.
3. Làm tương tự với `phogd2`.

### E3. Việc khác

- **Định mức còn thiếu:** vào **Định mức → Công đoạn**, đặt định mức cho `XPT-VSR-VSP` và `SON-MAY-TU-DONG-1`. Hiện khoảng 80 dòng sản lượng của 2 công đoạn này chưa được tính vào KPI.
- **Ngày lễ:** mở trang tính **NgayLe** trong Google Sheet, thêm các ngày nghỉ (Tết Âm lịch, Giỗ Tổ, 30/4, 1/5…), mỗi ngày một dòng:
  - Cột `Ngay`: dạng `2027-02-06`.
  - Cột `TenLe`: tên ngày lễ.
  - Cột `MaXuong`: để trống nếu cả nhà máy nghỉ; ghi mã xưởng (VD `CNC`) nếu chỉ xưởng đó nghỉ.
- **Nếu đã sửa tay ngày của tháng 8** (mục C1): vào **KPI → Bảng KPI**, chọn Kỳ **Tháng 8/2026**, bấm **Chốt bù tháng này (toàn nhà máy)** để bảng tính lại.

---

## Sau khi cập nhật: những điều nên biết

- **Chốt tháng:** tháng 9 sẽ được chốt chính thức lúc 23h ngày làm việc thứ 3 của tháng 10, không phải 23h ngày 30/9 như trước. Nhờ vậy sản lượng duyệt muộn mấy ngày cuối tháng vẫn được tính.
- **Sửa tay trong Google Sheet:** web nhớ kết quả tính (bảng KPI, KPI quản lý, chấm công…) trong 10 phút cho nhanh. Sửa trên web thì tự cập nhật ngay. Sửa tay trong Sheet thì chạy hàm `XOA_BO_NHO_TAM` để web thấy ngay, không thì đợi tối đa 10 phút.
- **Lưu trữ tự động:** ngày 5 hằng tháng lúc 2h sáng, nhật ký của các tháng đã chốt và cũ hơn 3 tháng được chuyển sang trang tính `NhatKySanXuat_LuuTru` cho sheet chính nhẹ. Dữ liệu không mất.
- **Nếu có lỗi nặng:** Triển khai → Quản lý triển khai → ✏️ → ô Phiên bản chọn lại **phiên bản cũ** (số nhỏ hơn) → Triển khai. Web quay về bản cũ ngay. Hoặc mở bản sao đã tạo ở bước A3.

---

## Những gì đã thay đổi

**Chốt tháng**
- Chốt chính thức lúc 23h **ngày làm việc thứ 3** của tháng sau. Trước khi chốt, bảng KPI tháng đó vẫn tính trực tiếp.
- Bảng KPI công nhân **không còn trưởng/phó phòng** (trước đây họ lọt vào với 30 điểm).
- Snapshot 9h sáng chỉ là **bản tạm**.

**Bảo mật**
- Bắt đổi mật khẩu lần đầu và sau khi được cấp lại; không đặt được 123456, 888888, tên đăng nhập hay mã nhân viên.
- Nhập sai 5 lần thì khóa 15 phút. "Cấp lại mật khẩu" tạo mật khẩu tạm ngẫu nhiên.
- Người **Nghỉ việc** không đăng nhập được.
- Công nhân chỉ xem hồ sơ của chính mình. Trước đây máy công nhân còn nhận về **CCCD, điện thoại, địa chỉ, lương của cả xưởng** (không hiện trên màn hình nhưng xem được bằng công cụ trình duyệt); nay đã chặn. Trưởng phòng không nhận CCCD và lương.
- Trưởng/phó phòng không đổi được chức danh sang cấp quản lý.

**Dữ liệu**
- Có **khóa ghi**: nhiều người cùng lưu thì máy xử lý lần lượt, không đè hay xóa nhầm dòng.
- Kiểm tra ngày: không nhận ngày tương lai, ngày trước 1/7/2026 hay ngày không tồn tại.
- Lưu điểm danh ngày không còn xóa mất ô nửa ngày / đi muộn, không xóa dữ liệu cũ của người đã nghỉ việc.
- Ngày lễ (sheet NgayLe) không tính quên điểm danh, không tính vào hạn duyệt / hạn nhập.
- Trọng số KPI áp theo từng kỳ; phạt nhập trễ không phạt trưởng/phó phòng.

**Tốc độ**
- Lưu nhanh hơn nhiều: máy chủ gom các ô cần sửa và ghi một lần (duyệt 1 người: 38 lần ghi còn 3), sau đó web chỉ tải lại phần vừa đổi.
- Không còn lớp phủ che cả màn hình khi lưu: chỉ có vạch vàng chạy trên cùng, nút vừa bấm hiện vòng xoay.
- Bảng KPI, KPI quản lý, chấm công tháng mở lần hai trong 10 phút gần như tức thì. Tổng quan vẽ nhanh gấp khoảng 8 lần.

**Giao diện**
- Màn đăng nhập mới "Precision" (bi cái, ngọn cơ carbon thật).
- Bên trong cùng tông: nền đen, chữ trắng ngà, điểm nhấn vàng đồng.
- Máy tính: menu dọc bên trái chia nhóm, có số đếm việc chờ. Điện thoại: thanh dưới 4 mục + nút Menu.
- **Việc hôm nay** (trang đầu của ban điều hành, trưởng/phó phòng) gom mọi nhắc việc, mỗi việc có nút đi thẳng tới chỗ xử lý.
- **Hướng dẫn** chuyển thành nút **?** trên đầu trang.


## Cơm trưa – 5 nhóm ngoài xưởng báo tổng số suất (11/10)

- Có vai trò mới **"Nhóm báo cơm"**. Mỗi nhóm có 1 tài khoản; nhóm không cần danh sách nhân sự.
- Tạo tài khoản: tab *Tài khoản* → Tạo tài khoản mới → Vai trò **"Nhóm báo cơm"** → chọn nhóm:
  1. Bếp + lái xe + bảo vệ (Hà Nam)
  2. Kế toán kho + tạp vụ (Hà Nam)
  3. May + kế toán kho + lái xe (Hà Nội)
  4. Marketing (Hà Nội)
  5. Store 47 Nguyễn Tuân (Hà Nội)
- Người giữ tài khoản nhóm đăng nhập → thấy thực đơn, gõ **tổng số suất** của cả nhóm → bấm **Báo suất**. Cả nhóm không ăn thì gõ **0**. Sửa được tới hết ngày ăn.
- Bếp / ban điều hành thấy mỗi nhóm thành 1 dòng trong bảng tổng hợp (sau các xưởng). Nhóm chưa báo hiện chữ **"chưa báo"**.
- 4 bộ phận chuẩn bị trước đây (Kho, HC–KT, Marketing–Bán hàng, Showroom–Store, mỗi người 1 tài khoản) **đã bỏ** để không trùng với 5 nhóm này.

## Cơm trưa – trưởng phòng ăn cùng ban điều hành (11/10)

- Suất ăn của **trưởng phòng** **không tính theo xưởng nữa** mà tính vào dòng **"Ban điều hành và trưởng bộ phận"** (trước đây là "Văn phòng / khác"). **Phó phòng vẫn tính theo xưởng; trưởng 4 bộ phận Kho / Hành chính – Kế toán / Marketing – Bán hàng / Showroom – Store vẫn tính theo bộ phận của mình.**
- Dòng này cũng gồm các tài khoản không gắn xưởng (ban điều hành, trợ lý, nhân sự, QC…). Ban điều hành / trợ lý / nhân sự đăng ký hộ được cho trưởng phòng.

## Cơm trưa – trưởng / phó phòng đăng ký hộ (11/10)
- Công nhân vẫn tự đăng ký như cũ.
- Trưởng / phó phòng mở trang **Cơm trưa** → khung **Đăng ký hộ**: chọn ngày ăn, tìm tên, bấm **Ăn** / **Không ăn** cho từng người trong xưởng mình, hoặc bấm **Đăng ký ăn cho tất cả người chưa đăng ký**.
- Ban điều hành đăng ký hộ được cho mọi người. Người được đăng ký hộ thấy tên người đã đăng ký giúp; họ vẫn tự đổi lại được.
- Cần dán lại **Code.gs** và **Index.html**. Sheet `DangKyCom` tự thêm cột `DangKyHo`, không phải làm gì thêm.


## Vai trò Trợ lý ban điều hành + bếp chỉ thấy số suất (11/10)
- Tài khoản trợ lý đã có: mở Google Sheet, trang tính **TaiKhoan**, sửa ô **VaiTro** của người đó thành `TL`; người đó đăng xuất rồi đăng nhập lại. Tạo mới thì vào **Tài khoản**, ô Vai trò chọn **Trợ lý ban điều hành**.
- Đăng ký cơm hộ: trưởng / phó phòng chỉ cho người trong xưởng mình; ban điều hành và trợ lý chỉ cho người khối văn phòng (tài khoản không gắn xưởng).
  Trợ lý chỉ thấy Tổng quan, Bảng KPI, Sơ đồ nhà máy và Cơm trưa; không sửa / duyệt / chốt được gì. Ở Cơm trưa trợ lý báo thực đơn, đăng ký hộ, xem tổng hợp có họ tên.
- Bếp chỉ thấy số suất ăn / không ăn / chưa đăng ký theo từng xưởng và tổng; không thấy họ tên, mã NV.
- Cần dán lại **Code.gs** và **Index.html**.


## Trợ lý / nhân sự xem thêm + 4 bộ phận báo cơm (11/10)
- Trợ lý ban điều hành xem thêm Điểm danh, Công đoạn, Nhân sự, Máy móc (chỉ xem, có dòng "Chế độ chỉ xem"). Nhân sự có các trang như trợ lý và sửa được Hồ sơ nhân sự.
- Thêm 4 bộ phận chỉ để báo cơm: Bộ phận Kho, Hành chính – Kế toán, Marketing – Bán hàng, Showroom – Store (không tính KPI).
  Tạo tài khoản: **Tài khoản → Tạo tài khoản mới**, Vai trò chọn **Nhân viên bộ phận…** hoặc **Trưởng bộ phận…**, chọn **Bộ phận**, mã NV (nếu có).
  Nhân viên bộ phận tự bấm Ăn / Không ăn; trưởng bộ phận đăng ký hộ được người trong bộ phận mình.
- Cần dán lại **Code.gs** và **Index.html**.
