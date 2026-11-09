# KPI Cấu hình gậy – bản vẽ kỹ thuật (08-11)

Liên quan: [[KPI Quy trình sản xuất]] · [[KPI Bảo mật và vận hành]] · [[KPI Phần giao diện tải sau]] · [[KPI Kiểm thử]] · [[Việc chờ chủ dự án]] · [[00 Mục lục]]

## Yêu cầu chủ dự án (08/11)
- Trước làm cấu hình gậy bằng Excel nên thiếu sót; muốn đầy đủ như bản vẽ `cue-carbon.html` (chủ dự án làm bằng Qoder: cơ pool carbon 58 in, 12 chi tiết, mặt cắt, detail joint / đuôi).
- Chọn phương án B: **bản vẽ tự vẽ theo bảng thông số**. **Tab riêng "Cấu hình gậy"**; **C077 đo đạc, nhập, lưu**; **Giám đốc SX C019 duyệt** mới có hiệu lực; có **nút tải PDF**.
- **Tài liệu mật**: chỉ **C019, C056 (chủ sở hữu), C077, C067** xem. PDF có dấu chìm tên người tải + giờ + **logo Rhino mờ**; mỗi lần tải ghi nhật ký.
- Danh sách dòng gậy **dùng chung** Đơn hàng › Cấu hình sản phẩm (PL_DONG + CauHinhSP).
- Bản vẽ: **ngọn và chuôi vẽ riêng, dựng đứng, cạnh nhau**; mặt cắt cũng dựng đứng; ghi sẵn Ø các mốc, chiều dài từng đoạn, cấu tạo trong, ren + vật liệu.

## Cách dựng
- Máy chủ `tests/cau-hinh-gay/cau-hinh-gay.gs` (+ `va-cau-hinh-gay.py`, chạy cuối va-code.py):
  - `CG_QUYEN = {C056:xem, C019:duyet, C077:sua, C067:xem}`; `cgQuyenCua_(me)` – mã NV phải gắn **đúng 1** tài khoản đang dùng (chặn tạo tài khoản trùng mã); `docPhien_` thêm `o.cg`; `layManhGiaoDien` cho mảnh `CauHinhGay` theo mã NV.
  - Sheet ẩn `CauHinhGay` (Id, MaDong, PhienBan, TrangThai: Chờ duyệt / Hiệu lực / Bản cũ / Từ chối, DuLieu JSON, NguoiLuu, ThoiDiemLuu, GhiChu, NguoiDuyet, ThoiDiemDuyet, LyDo).
  - Hàm: `layDsCauHinhGay`, `layCauHinhGay(ma, phienBan)` (người chỉ xem không thấy bản chờ; ghi nhật ký "Xem cấu hình gậy" mỗi người/dòng/6 giờ), `luuCauHinhGay` (C077 – mỗi dòng 1 bản chờ, lưu lại thì thay, giữ số bản), `duyetCauHinhGay` (C019 – từ chối bắt buộc lý do; duyệt → bản hiệu lực cũ thành "Bản cũ"), `ghiTaiPdfCauHinhGay`, `demCauHinhGayCho` (Việc hôm nay của C019).
  - `cgLoc_`: chỉ lưu trường trong `CG_KHOA` (khớp `CG_TRUONG` ở web – va-cau-hinh-gay-web.py **kiểm khớp khi dựng**), đúng kiểu, số 0–5000, chữ ≤ 120.
- Web: mảnh tải sau **`CauHinhGay.html`** (nguồn `tests/cau-hinh-gay/cau-hinh-gay-web.html`, mục 42 `va-cau-hinh-gay-web.py`): tab `cgay` (nhóm Sản xuất), chỉ hiện khi `ME.cg`; logo Rhino xám chèn base64 cho dấu chìm. Đã thêm `CauHinhGay` vào `danh-sach-file.txt` + `cai-dat-clasp/chung.ps1` + `tao-ban-xem-thu.js`.
  - Danh sách nhóm: Gậy (đánh / nhảy / phá / phá nhảy) → Ngọn lẻ → Chuôi lẻ; trong nhóm: ngọn full carbon → mix → glassfiber; chip v-số / Chờ duyệt / Chưa có.
  - 62 ô thông số (`CG_TRUONG`), mẫu = cơ 58 in của bản tham chiếu; ô vàng = chưa đo, ✓ xác nhận số mẫu; `cgKiemTra` báo ghép sai (collar ngọn/chuôi, insert lọt ống, ren insert ↔ pin ↔ ren khai báo, pin thò > insert, bậc cap/sleeve, khoang/bolt…).
  - Bộ vẽ: `cgKhuc(t,'ngon'|'chuoi')` (hình ngoài + mặt cắt dọc dựng đứng, trục đúng tỉ lệ, Ø phóng ~3×, dây kích thước bên trái, Ø ngang trên hình, nhãn vật liệu bên phải xếp không chồng), `cgCT(t,'A'|'C'|'D')` (đầu ngọn, joint, đuôi – đúng tỉ lệ thật phóng to); bấm hình để phóng to.
  - PDF: jsPDF 2.5.1 + html2canvas 1.4.1 (cdnjs, có `integrity`), **2 trang A4 dọc**; mạng chặn thư viện → mở hộp in "Lưu thành PDF".
- `bao-mat-ung-dung` 08/11: không lỗi nặng; đã vá: onclick dùng `data-ma`, chống trùng mã NV, lọc khóa (chặn `__proto__`), người chỉ xem không nhận bản chờ, nhật ký xem, SRI cho thư viện. Giới hạn: dấu chìm chỉ ở PDF (chụp màn hình vẫn được); ai có quyền sửa Google Sheet vẫn đọc được sheet CauHinhGay.

## Kiểm thử (08/11)
- `tests/cau-hinh-gay.js` 45/45 (quyền, lưu / duyệt / từ chối / phiên bản, nhật ký, dữ liệu xấu, mã NV trùng).
- `tests/cau-hinh-gay-web.js` 40/40 (máy tính + điện thoại; LIB=<node_modules có jspdf + html2canvas> để thử PDF: 2 trang, ~690 KB).
- Không ảnh hưởng: manh-web 8/8, tong-quan-web 26/26, nhan-su-loc-web 13/13, tang-toc-4 14/14, luu-tru 15/15, dieu-phoi 24/24.

## Tra cứu cấu tạo chuẩn (08/11, chủ dự án yêu cầu "search internet để vẽ cho chuẩn")
- Ngọn carbon: ống carbon quấn trên lõi thép + epoxy, thành 0,8–1,2 mm (nhiều hãng ~1,0); lõi foam polyurethane (có hãng nhiều tỉ trọng), có hãng bịt nút gỗ maple 2 đầu lõi (Meucci); ferrule gậy carbon 6–13 mm (gỗ cổ điển 19–25). Predator: đầu joint Ø21,31–21,38 mm.
- Chuôi: đa số gậy carbon vẫn chuôi gỗ; A-joint = mộng tròn cắm lỗ khoan (thợ hay dùng 5/8" ≈ Ø16 × 16); joint pin tổng ~80 mm, phần lớn chôn trong forearm; weight bolt thường 3/8-16, chỉnh ~17,5–21,5 oz.
- Ren joint (`CG_REN` trong web): 3/8-8 (Ø9,525 · bước 3,175), 3/8-10 (2,54), 3/8-11 (2,309, không lắp lẫn 3/8-10), 3/8-14 (1,814), 5/16-14 (Ø7,938 · 1,814), 5/16-18 (1,411), Radial (~Ø9,42 · ~7,6 ren/inch ≈ 3,34, ren tròn, vặn thẳng vào gỗ / phenolic – số đo thợ, hãng không công bố), Uni-Loc / Q-loc / VQR… (độc quyền – đo thật).
- Đã thêm vào bản vẽ / form (67 ô): nút bịt đầu / cuối lõi + vật liệu, pin chôn trong chuôi, profile ren (V / tròn – Detail C vẽ ren răng cưa hoặc ren tròn); đổi ren pin → tự điền Ø, bước, profile, ren insert (ô chưa đo); kiểm tra: Ø / bước khác chuẩn của ren, pin chôn chạm mộng A-joint, nút bịt + tenon + insert dài hơn ống. Hộp "Tham khảo khi đo" (bảng ren + cấu tạo) trong tab, không in PDF.
- Nguồn: pooldawg.com (What's my joint style), predatorcues.com (joint types, Uni-Loc guide), uni-loc.com, meuccicues.com (Carbon Pro), forums.azbilliards.com (Radial), dzcues.com (A-joint), bizubilliards.com (quy trình làm ngọn carbon).

## Đổi quyền (09/11)
- Chủ dự án: **cả 4 tài khoản sửa được**, **C019 hoặc C056 duyệt**, **được tự duyệt** bản mình lưu. `CG_QUYEN = {C056: duyet, C019: duyet, C077: sua, C067: sua}`; `cgQuyen_(…, 'sua')` nhận cả `duyet`. Bản chờ: mỗi dòng gậy 1 bản, ai lưu sau thay bản đang chờ (web báo tên người lưu). Tổng quan chủ sở hữu tự nạp số bản chờ duyệt (`demCauHinhGayCho`). Kiểm thử `cau-hinh-gay.js` 50/50.

## Chuôi carbon theo bản vẽ thực tế Rhino (09/11)
- Chủ dự án gửi 7 PDF tham khảo (Omega shaft/butt, Radial pin, Rhino cue butt, Rhino carbon fiber, Uni-Loc, "Cao Su Bịt Nối Ø26mm", "Cao Su Ø26mm") – "vẽ chuẩn như vậy".
- Thêm ô **Kiểu chuôi** (`chuoi.kieu`: carbon mặc định / gỗ). Form chỉ hiện nhóm ô đúng kiểu (`cgTruongHien`), đếm "đã đo x / y" theo nhóm đang hiện. Ô kiểu là ô chọn.
- Chuôi carbon (`cgTrongCb` dùng chung cho hình chuôi + chi tiết C / D, `cgNgoaiCb` viền trên hình ngoài): vỏ (thành `vo.day`) · veneer đầu dưới collar · **khối POM đen giữ pin** (lỗ pin, đáy kín) · lõi foam 2 đoạn (forearm xanh nhạt, tay cầm xanh đậm, chấm như bản vẽ) · **thanh thép nối** forearm / tay cầm (`thanhNoi.l` = 0 → không có, bản "Bịt Nối" có) · 2 vòng inlay be · cap veneer · **ống POM ren trong** (đáy kín trên) + **quả cân đồng** (số quả × dài, rãnh vặn) · ren cắm bumper · bumper cao su Ø26.
- Mẫu mới: cap 4 (veneer xanh), bumper Ø26 × 15 ren cắm 12, sleeve 117,6 (giữ tổng 58 in), khối pin Ø16 × 75, ống Ø18 × 150 ren M12, 2 quả Ø12 × 25, thanh nối Ø10 × 100, vỏ 1,6. Chất liệu chuôi FC/MIX/GF → "Carbon"/"Mix…"/"Glassfiber".
- Chuôi gỗ giữ nguyên cách vẽ cũ (mộng A-joint + khoang cân + weight bolt) – nhóm ô "Chuôi – gỗ: mộng + khoang cân".
- 90 trường (CG_KHOA máy chủ sinh lại từ CG_TRUONG). Kiểm tra mới: khối pin lọt lòng vỏ / to hơn pin, pin chôn sâu hơn veneer + khối, thanh nối lọt lòng / quá dài, ống lọt lòng / quá dài, quả cân quá to, số quả × dài + ren bumper vừa ống, bumper to hơn cap. Bảng chi tiết chuôi carbon 15 dòng.
- Màu mới `CG_VL`: POM (`cgHpo`), veneer (`cgHve`), inlay, foam xanh nhạt (`cgHfx`) / đậm (`cgHfd`).
- Kiểm thử: `cau-hinh-gay.js` 50/50, `cau-hinh-gay-web.js` 40/40 (thay ô "bậc đuôi" bằng kiểm đủ chi tiết chuôi carbon).
- Chưa chắc (đã hỏi chủ dự án): "Bịt Nối" có đúng là thanh thép nối không; ngọn có cần vẽ lại cùng kiểu màu không; kích thước thật ống POM / quả cân / khối pin.

## Joint pin = ảnh cắt từ bản vẽ gốc Rhino (09/11)
- Chủ dự án: "phần joint pin không vẽ chính xác được thì cắt ảnh ghép vào"; chọn **ghép thẳng vào file** (biết repo đang công khai) và **thay vào chi tiết chuôi, bỏ số kích thước trên ảnh**.
- Nguồn: 4 PDF bản vẽ pin (3/8-8 Radial xẻ rãnh, Uniloc, 5/16-18 Inox/Mạ, 5/16-14 ren cái). Cách làm: `pdftocairo -svg` → bỏ chữ (`<use>`) và nét kích thước (stroke-width 1, 2), giữ nét thân pin (5, 6; Uniloc 4, 6, bỏ 2 đường dẫn ghi chú) → chụp 4× → cắt sát → xoay đứng (đầu ren nối ngọn lên trên) → nền ngoài trong suốt, trong thân tô xám thép → `kpi-app/anh/pin/pin-{radial,uniloc,r1618,r1614}.png` (~23–27 KB).
- `va-cau-hinh-gay-web.py` chèn ảnh base64 + kích thước vào `CG_PIN` (giữa `/*PIN*/`): L dài, T thò khỏi vai, D Ø lớn nhất – Radial 85,20 / 35,85 / 9,80; Uniloc 80,80 / ~50,7 / 9,71; 5/16-18 76,55 / 27,20 / 9,80; 5/16-14 ~79,6 / ~30,6 / 9,70 (5/16-14 và Uniloc đo trên hình).
- Web: `cgPinAnh(c)` chọn ảnh theo ô Pin ren (`CG_REN[8]`), `cgVePin` đặt ảnh đúng tỉ lệ thật (vai tại mặt joint), cắt theo vùng nhìn (svg lồng). Thay pin tự vẽ ở hình chuôi (ngoài: chỉ phần thò; mặt cắt: cả pin) và chi tiết C (cả chuôi carbon lẫn gỗ). Ren khác (3/8-10, 11, 14, 5/16 khác) vẫn tự vẽ.
- `CG_REN` theo bản vẽ công ty: **3/8-8 = Radial** (Ø9,36 · bước 3,20 · ren tròn), 5/16-18 Ø7,70 · 1,41, Uniloc Ø9,71 · 2,30 (60°); thêm [6] thò, [7] chôn → mẫu và ô tự điền khi đổi ren; insert ngọn mẫu ≥ thò + 2 (Radial 38). Kiểm tra mới: pin thò / chôn lệch bản vẽ > 1 mm.
- Kiểm thử: cau-hinh-gay 50/50, cau-hinh-gay-web 40/40 (đổi số mẫu pin thò 12,7 → 35,85), manh-web 8/8. CauHinhGay.html ~240 KB.

## Gậy nhảy / phá nhảy 3 khúc + khối đối trọng (09/11)
- Chủ dự án gửi 4 bản vẽ mặt cắt nhà máy: "mặt cắt chuôi 1/2" (chuôi full carbon 736 có khối 100 ở 550 / 600 / 300, Komet khối 50 ở 420, mix khối 70 ở 300, trọng lượng trước sơn 14–14,6 oz; Nhảy full carbon 220-360), "chuôi nhảy, phá nhảy" (**Nhảy 350-150**: ren radial ngắn, foam nặng, lõi carbon mix; **Phá nhảy lùn 380-250**: ren radial dài, POM dài, foam nặng, lõi carbon mix), "mặt cắt ngọn" (735, bảng Ø mỗi 50 mm 21,37 → 13,87).
- Chủ dự án chốt: ngọn gậy 3 khúc **C077 đo riêng**; thêm ô **Số khúc** (2 / 3); khối giữa lõi = **khối đối trọng**; bảng Ø ngọn mỗi 50 mm **chưa cần**.
- Trường mới (101 trường): `chuoi.soKhuc`; nhóm "Chuôi – khớp giữa (gậy 3 khúc)" (`chuoi.noi.dai` đuôi rời / khớp cách đuôi, `ren`, `pinD`, `tho`, `chon`, `insD`, `vl`) chỉ hiện khi 3 khúc (`cgK3`, nhóm `'k3'` trong `cgTruongHien`); `chuoi.khoiCan.{dai,vt,vl}` (tâm cách đuôi) trong nhóm carbon.
- Mẫu: kiểu NHAY / PHANHAY → 3 khúc (trừ tên có "2 khúc"; tên có "3 khúc" luôn 3). Tên dạng "(390-100)" → khúc trên 390 + đuôi rời 100; mặc định 350-150 (nhảy) / 380-250 (phá nhảy); forearm / tay cầm / sleeve chia theo tổng; ống quả cân vừa đuôi rời, thanh nối 0, khối đối trọng 0. Gậy 2 khúc: khối đối trọng FC 100 ở 550, MIX 70 ở 300.
- Vẽ: `cgKhopGiua` (ống ren POM ở đáy khúc trên + pin nối thép cắm từ đuôi rời + vạch tháo rời) trên hình chuôi + kích thước KHÚC TRÊN / ĐUÔI RỜI bên trái; chi tiết mới **K · KHỚP GIỮA** (`cgCT(t,'B')`, lưới 4 cột khi có); khối đối trọng trong `cgTrongCb`. Bảng chi tiết thêm nhóm KHỚP GIỮA (K1–K3) + dòng khối đối trọng; thông số ghi "3 khúc: trên + đuôi".
- Kiểm tra: đuôi rời hợp lệ, pin < ống ren, ống ren lọt lòng vỏ, ống quả cân + pin chôn ≤ đuôi rời, thanh nối ≠ 0 ở gậy 3 khúc (vàng), khối đối trọng chạm ống quả cân / khối pin / khớp giữa. Bỏ cảnh báo "ngọn – chuôi chênh nhiều" cho gậy 3 khúc.
- Kiểm thử: cau-hinh-gay 50/50, cau-hinh-gay-web 46/46 (thêm TKNHAY 390-100, EVOVAL 380-250, RETRO không khớp giữa). PDF EVOVAL 2 trang có đủ A · C · K · D.

## Chuôi 2 mảnh vẽ tách rời + kích thước mẫu theo bản vẽ nhà máy (09/11)
- Chủ dự án: "chuôi 2 khúc thì vẽ rời 2 khúc ra, đừng vẽ dính liền"; "xem lại kích thước toàn bộ phần ngọn".
- Hình chuôi gậy 3 khúc: vẽ 2 lần cắt theo khớp giữa (clipPath `cgKT/cgKD` + số `CG_SO`), mảnh đuôi rời dời xuống G px (≥ 54, đủ chỗ pin thò); **pin nối đi cùng đuôi rời** (`cgPinNoi`, cả hình ngoài + mặt cắt), khúc trên còn lỗ ống ren; chữ "⇅ tháo rời / khớp giữa"; nhãn + kích thước phía dưới dời theo (`Y` mới), KHÚC TRÊN / ĐUÔI RỜI tách 2 đoạn. `cgKhopGiua(..., roi)`; chi tiết K vẫn vẽ ghép để thấy pin cắm vào ống ren.
- Mẫu theo bản vẽ nhà máy: **ngọn 735 từ mặt joint tới hết ferrule** (ống 719 + collar 12 + ferrule 4; tổng hiển thị 745,7 gồm tip 9,5 + pad 1,2, có thêm đường kích thước "735 KHÔNG TÍNH TIP + PAD"); **chuôi 2 khúc 736** (sleeve 117). Gậy nhảy / phá nhảy: Ø ngọn theo bảng "Nhảy full carbon" (joint 21,37 → 16,14 cách đầu 335 → đầu 13,87), collar + forearm đầu Ø21,37 cho khớp joint. Gậy đánh giữ Ø mẫu cũ (bản vẽ ngọn 735 không ghi Ø).
- Kiểm thử: cau-hinh-gay 50/50, cau-hinh-gay-web 46/46 (tổng mẫu 1.481,7 mm).

## Đơn vị đo: giữ như cũ (09/11)
- Chủ dự án yêu cầu "chuyển hết đơn vị đo về mm" → tôi lỡ bỏ cả inch ở tổng dài, đổi ghi chú "ren/inch", bỏ oz (commit bd2aff0) → chủ dự án: **trả lại như cũ**; tên ren / ghi chú ren giữ nguyên, **oz vẫn dùng**; chỉ cần chiều dài + đường kính của ngọn và chuôi bằng mm. Đã revert (d22b709). Hiện mọi chiều dài / Ø ngọn, chuôi (hình, chi tiết, bảng, ô nhập, PDF) đều đã là mm; chỉ dòng tổng cả cây ghi thêm "· x in".
