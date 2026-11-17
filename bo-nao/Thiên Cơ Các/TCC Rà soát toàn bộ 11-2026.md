# TCC Rà soát toàn bộ 11-2026

Nhóm: Thiên Cơ Các · Cập nhật 16/11/2026
Liên quan: [[TCC Kiểm thử]] · [[TCC Bán hàng]] · [[TCC Giao diện]] · [[TCC Văn dễ hiểu và Tổng hợp 6 hệ]] · [[Quyết định của chủ dự án]] · [[TCC Chuyên gia Agency Agents]]

## Yêu cầu (16/11)
Chủ dự án: dùng các chuyên gia rà soát toàn bộ mã, giao diện, viết bài, logic phân tích; làm lại web bố cục rõ, thân thiện; thiết kế lại miễn phí/trả phí để kéo người mua. Chốt: **rà soát trước, sửa theo đợt** · miễn phí/trả phí do chuyên gia đề xuất, chủ dự án duyệt · **được đổi cả phong cách** · báo cáo tóm tắt trong chat.

## Báo cáo (thư mục `nghien-cuu/ra-soat/`, bối cảnh chung `00-boi-canh.md`)
- `01-ma-nguon.md` (code-reviewer): nội dung trả phí lấy được qua hàm tính toán công khai; hàm vận hành không kiểm quyền; XSS qua `INITIAL_PARAMS`; tên đăng nhập toàn số bị Sheet đổi thành số; quà 50 xu > Trọn đời 49 xu; seed mật khẩu chủ trong repo công khai.
- `03-phong-cach.md` (ui-designer): 6 lớp phong cách chồng nhau, ~400 mã màu, phát sáng thừa, poster "50 XU" đầu mọi tab; đề xuất A "Hologram tinh gọn" (khuyên dùng), B "Giấy & Mực", C "Đêm Chàm"; trang mẫu `anh/ui-mau.html`.
- `04-viet-bai.md` (content-creator): tên sao/thuật ngữ còn trong tầng dễ hiểu Tử Vi (~250 câu), câu nặng, lời khuyên đầu tư nhà đất, hai tầng mâu thuẫn (tóm tắt cung theo tên sao bỏ qua điểm), văn mặc định đã có gia đình; khung bài chuẩn "Chân dung 3 dòng → 3–5 khối → 3 điều mang theo".
- `06-mien-phi-tra-phi.md` (product-manager): phương án A "Tài khoản là chìa khóa" (khuyên dùng) / B "Giữ ví xu, vá lỗ"; 5 câu hỏi chờ chủ dự án.
- `02-bo-cuc-thao-tac.md` (ux-architect, 55 ảnh): màn đầu điện thoại là poster 50 xu + bảng giá, form ở màn thứ 4; tab mặc định "Tổng Quan 6 Hệ 🔒" đang khóa; trang từng hệ quá dài (Bát Tự ~60 màn điện thoại); 13 tab ngang; lá số Tử Vi điện thoại chữ 4–5px. Đề xuất: đáy 4 mục (Lá số · Vận hạn · Hợp đôi · Tôi), chip 6 hệ, trang Tóm lược miễn phí mặc định, mỗi hệ khung 3 tầng (Tóm lược → 6 chủ đề → Căn cứ). Form Nghiệm chứng điền sẵn 16/6/1995 giờ 4 (Index.html:509) – hỏi chủ dự án.
- `05-logic-phan-tich.md` (reality-checker, 160 lá số): bước 26 Tử Vi dùng điểm gốc cung thay điểm vận (lệch Tiểu vận 53%); Tổng hợp 6 hệ 9,5% câu tự mâu thuẫn, 22% lĩnh vực chỉ 2 hệ; thang điểm lệch từng hệ (Tử Vi ~70% thuận, Chiêm tinh 11%); vận năm/tháng ít khớp; Hồ sơ biến cố năm (bán) 57% câu trùng; nghiệm chứng 6/8 vẫn chỉ "Có thể đúng" (điều kiện 70%, NghiemChung.gs:72); còn % 4 chỗ; giờ Tý muộn đúng.

## Đợt 1 – bảo mật (16/11, đã đẩy; chủ dự án duyệt "oke làm đi")
- 19 hàm tính toán thành riêng: `luanChiTiet_`, `duDoanCuocDoi_`, `tongHopLuan_`, `phoiNgauLuan_`, `ketHopLuan_`, `nghiemChungLap_`, `tuviTrinhTu_`, `tuviLapLaSo_`, `batTuLap_`, `batTuChiTiet_`, `chiemTinhLap_`, `chiemTinhLuan_`, `hdLap_`, `hdLuan_`, `haLacLap_`, `haLacLuan_`, `thanSoHocLap_`, `thanSoHocLuan_`, `astToanBo_` (kể cả HAM_CAN_CO, tests, tools, bộ sinh Phi Tinh). Trường dữ liệu trả về (vd. `moRong.chiemTinhLuan`) giữ nguyên.
- `chiChayNoiBo_` / `laLichThat_` / `laChuTrinhSoan_` (TaiKhoan.gs): hàm vận hành (gửi báo cáo, bản tin, nhật vận, quét đơn, bật/tắt lịch, cài đặt, kiemTraCaiDat, test*) chỉ chạy theo lịch thật (khớp `e.triggerUid`) hoặc khi chủ dự án chạy trong trình soạn thảo. Trigger đã cài không cần cài lại.
- `thamSoAnToan_` (Code.gs) cho `INITIAL_PARAMS`; `shO_` (ThanhToan.gs) luôn thêm `'` cho chuỗi người dùng nhập khi ghi Sheet; `guiBaoCaoNgay` chỉ trả `{to}`; chủ sở hữu sau 5 lần sai chỉ đợi vài giây (cache `CHO_`), không khóa 15 phút; tài khoản không tồn tại vẫn băm; `ghiDoiChieu` tối đa 200 lần/10 phút.
- **Giữ `ALLOWALL`** (báo cáo đề xuất bỏ) vì trang qoder (thien-co-cac-…qoder.website) nhúng web Apps Script.
- Kiểm thử mới `tests/bao-mat.js` (182) + bật lại thanh-toan/tai-khoan/van-ngay; code-reviewer rà lại: không lỗi chặn, 3 góp ý mức vừa đã sửa.
- Còn mở (chờ chủ dự án): `getDoanNghiemChung` công khai lộ kết luận Tổng hợp/biến cố (V1); ranh giới vận theo năm trong tab từng hệ (V2); quà 50 xu, thưởng mời (C5); dữ liệu cũ của tài khoản toàn số trên Sheet (nếu có) cần chuyển đổi.

## Chủ dự án chốt (16/11)
- Miễn phí/trả phí: **phương án A "Tài khoản là chìa khóa"** (Đợt 3). Phong cách: **A – Hologram tinh gọn** (Đợt 4). Nghiệm chứng: **sửa đúng quy tắc 6/8**. Làm Đợt 2 ngay.

## Đợt 2 – gỡ chỗ gây khó chịu (16/11, mã 2026.11.16.1)
- Giao diện (Script/Index/Styles): poster "50 xu + 3 gói giá" → khung "Tạo tài khoản miễn phí" (`vePosterQua`, ẩn khi `body.co-ket-qua`); lời mời khách không nhắc xu (`tinhTrangMua` dùng `phan: 'dang_ky'` → `data-dang-ky`; `moDangNhap` ẩn dòng quà); tab mở đầu `chart` khi Tổng hợp khóa; bỏ "năm sinh con kèm %" (Index, Cặp đôi); lỗi số tiền hộp nạp; ngưỡng ghi cho khách 6 / 4,8; ô nhập 16px trên điện thoại; xóa ngày giờ điền sẵn form Nghiệm chứng; "Biến cố hội tụ" → "Những năm đáng chú ý" (cả tên phần trong bảng giá ThanhToan.gs).
- Logic: bước 26 Tử Vi lấy mức từ `chiTiet.daiVan` (isNow) / `chiTiet.tieuVan` (TuViTrinhTu.gs); Tổng hợp 6 hệ chỉ "thế mạnh/nên chăm chút" khi ≥3 hệ, ≥ nửa cùng chiều, không hệ ngược (`chac`, `nguoc` trong `th6Lap_`); nghiệm chứng 6/8 đúng quy tắc, phải chấm đủ 8 nhóm (`CHUA_DU`), bỏ câu số con / trai – gái; lời mồi sợ trong `TaiKhoan.gs` (teaser).
- Văn (content-creator, ~70 câu): TuViHeThong.gs (bỏ lời khuyên đầu tư nhà đất, câu nặng, "cha mẹ có thể mất sớm"), ThanSoHoc.gs ("Thiếu 9", 7 mũi tên trống tên trung tính), HoiTu.gs (nhãn "Hao tài"…), TongHop.gs (mục Cơ thể → "Nhịp sống hợp với bạn").
- Giữ % đồng thuận / % ngũ hành (quyết định 24/10). Kiểm thử: 25 file đạt (nghiem-chung 834 có ca 6/8, 4/8, chưa đủ 8 nhóm).
- Còn lại cho đợt sau: ~250 câu Tử Vi có tên sao (tách de/ky), câu nặng trong DeHieu.gs/TuViTrinhTu.gs, TS_SUC_KHOE (Thần số), văn trùng lặp phần bán.

## Đợt 3 – phương án A "Tài khoản là chìa khóa" (16/11, máy chủ; commit 41a522c)
- Chủ dự án duyệt: Trọn đời **89 xu**, Hội viên năm **99 xu** (vận năm/tháng/nhật vận mọi lá số của tài khoản, 12 tháng), gia đình **79/119**, quà **9 xu** sau đăng ký (mỗi SĐT/email một lần), thưởng mời chỉ khi bạn nạp lần đầu, không hoàn xu, người đã mua giữ nguyên quyền.
- `ttQuyen_`: tài khoản có `taiKhoan`, `co_ban`, `do_gio` miễn phí; `q.daMua` = phần thật sự đã trả (Trọn đời chỉ trừ phần này – trước đó sẽ trừ oan 28 xu); `ttHoiVien_` đọc dòng MoKhoa khóa `TK:<tên>`, mã `hoi_vien:yyyy-mm-dd`.
- `ttDvMienPhi_`: đại vận ĐÃ QUA gần nhất mở miễn phí (ttCatPhan_ → `vanTom.dvQuaMienPhi`; `muaPhan` trả `daCo`, không bán lại).
- `ttCatPhan_` (rà soát V2): `duDoan.vanLon`, `battuChiTiet.daiVanCungVi`, `moRong.haLac.luan.daiVan` của vận chưa mở chỉ giữ khung + mức, gắn `khoa:true` (vận đã qua mở cho tài khoản).
- `ttMuaHoiVien_` (gia hạn nối 365 ngày); `dungLuotGiaDinh` mỗi lượt = `dong_hanh:<năm>`; `ttQuaDangKy_(u, gt, lienHe)` + `ttLienHeChuan_` (Script Property `QUA_LH_<sha>`); `TT_GIA_PHIEN`/`TT_KM_PHIEN` = 3; bỏ mọi giá gạch ngang (`goc`).
- V1: `getDoanNghiemChung(input, token)` cần tài khoản (hoặc chủ trong trình soạn thảo), tối đa 20 lần/10 phút; giao diện gửi token qua `window.tccToken`.
- Kiểm thử: thanh-toan viết lại theo phương án A (+Hội viên, quà mỗi liên hệ 1 lần), bao-mat 185/185, van-ngay 1605/1605; cả 24 file đạt.
- Sau rà payments-billing-engineer (commit 898cc34): `ttCoDh_` (Hội viên không bị thu Đồng hành / không tốn lượt gia đình); Gmail bỏ dấu chấm và +đuôi; quà cộng xu trước rồi mới đánh dấu liên hệ; bảng giá phiên 2 giữ giá tùy chỉnh, riêng `TT_GIA_DOI` (tron_goi, hoi_vien, gia_dinh_3/5) lấy giá mới; `vanMo` – tab Bát Tự/Hà Lạc/Dự đoán chỉ mở giai đoạn trùng năm với đại vận Tử Vi đã mở (giai đoạn đang diễn ra cần đại vận hiện tại); vận miễn phí tính trước khi khóa ví; `ttGhiQuyen_` hoàn xu nếu ghi quyền lỗi; Hội viên +12 tháng lịch; `ttCatNamHe_` chặn lời luận năm của Chiêm tinh (hồ sơ năm, chu kỳ, lời khuyên năm), HD (Solar Return, transit, Vận trình), Thần số (năm/tháng/ngày cá nhân, Vận trình), Tổng hợp `namNay.nguon`, đoạn "Năm nay" trong phần dễ hiểu. giai-doan 45/45.
- Còn mở: liên hệ đăng ký chưa xác minh (SĐT giả lấy thêm 9 xu – chủ dự án chọn cách xử lý); khóa `QUA_LH_*` nên chuyển sang sheet riêng khi nhiều người đăng ký.

## Sửa sau rà Đợt 2 (code-reviewer, commit eef2137)
- Bước 26 Tử Vi: `chuanHoa10_(dvNay.diem)` (trước so điểm thô với ngưỡng thang 10 → chỉ 21/200 lá "thuận"). TongHop: mũi tên trống tra theo dãy số (đổi tên làm lệch điểm tính cách 28/40 lá). Tóm tắt Tổng hợp: "Thế mạnh" (chac) / "Nghiêng về thuận". DeHieu giữ câu "Bạn có xu hướng…". NghiemChungUI đòi đủ 8 nhóm, bỏ NaN%.

## Đợt 4 – giao diện (frontend-developer, mã 2026.11.16.2, commit f572d42)
- Hologram tinh gọn (lớp token cuối Styles.html, 2 font Be Vietnam Pro + Chakra Petch, bỏ hiệu ứng chạy liên tục, bỏ chữ Hán trang trí). Trang chủ: câu hứa → form "Nhập từng bước" 4 bước (+ "Tôi không rõ giờ sinh") → ảnh chân dung; form điện thoại từ 1655px lên 71px.
- Thanh đáy 4 mục (Lá số · Vận hạn · Hợp đôi · Tôi) + hàng chip dính; trang `page-tomluoc` mặc định sau khi lập (2408px thay Tử Vi 7583px); trang `page-toi` (ví, hạn Hội viên, lịch sử, gia đình, tiện ích, tham khảo, chủ sở hữu).
- Thẻ Hội viên năm 99 xu, huy hiệu "Miễn phí – tự kiểm chứng", thẻ khóa vận trong tab từng hệ, nghiệm chứng mời tạo tài khoản; Tử Vi điện thoại: nút phóng to + danh sách 12 cung; Bát Tự Holo không cắt mép; một lời mời mỗi trang; aria tab/tabpanel.
- Hiệu ứng: nút co .97, rung 8ms (màn cảm ứng), màn "an sao" 12 cung, hiện dần khi lướt, mở niêm phong, đếm số; tắt hết khi `prefers-reduced-motion`.
- Sửa 6 lỗi giao diện từ rà Đợt 2 (dải mời bị ẩn với khách, giờ trống NaN, đủ 8 nhóm, `mucTh6` thang 6/4,8, `attrMua`, bỏ xu trong lời mời khách).
- Ảnh trước/sau `nghien-cuu/ra-soat/anh/dot4-*.png` (64 ảnh) + số đo json. Smoke Playwright khách/tài khoản 390/1366: 0 pageerror, 10 tab không có undefined/NaN.
- Chưa làm: khung 3 tầng từng hệ (Bát Tự/Chiêm tinh vẫn 40–50 nghìn px), dọn lớp CSS cũ, hộp đăng ký 3 ô, câu "lưu ý" riêng cho khách ở Tóm lược (đợt văn).

## Sau Đợt 4 (16/11, mã 2026.11.16.3)
- code-reviewer rà 898cc34 + f572d42: không lỗi chặn; đã sửa S1–S5 (Solar Return năm, "Chủ đề năm theo tên", Hội viên không bị chào Đồng hành, câu lưu ý Tóm lược, nhãn dò giờ cho khách) + M1 (3 tháng sáng nhất trong Tổng hợp), M2 (thẻ khóa tháng/ngày Thần số, transit HD), M3 (giữ Cormorant cho PDF), M9 (giải nghĩa Nhật chủ). Commit e5d35d2.
- Đợt 5 phần 1 (content-creator, commit 14ea36f): 90 câu nặng/phán chắc viết lại trong DeHieu (36), TuViTrinhTu (30), ThanSoHoc (24, gồm TS_SUC_KHOE, TS_THACH_SK). Tên 26 bước giữ nguyên (khóa TT_GOP).
- Chủ dự án đổi hướng bán "chi nhỏ nhiều lần" (xem [[Quyết định của chủ dự án]]); product-manager đang soạn `nghien-cuu/ra-soat/07-ban-le-9-19.md`.

## Bán lẻ 9/19 xu (16–17/11, mã 2026.11.17.2)
- Máy chủ (payments-billing-engineer, 63c3737): `TT_GIA_PHIEN`/`TT_KM_PHIEN` = 4; phần mới `nam_cd:<cd>:<năm>` (cv/tien/tc/sk, 9 xu, `ttCoCd_`, `ttGanNamCd_` → `r.namCd`), `quan_he` 9 xu/cặp (`ttQuanHeInput_`, `gdLuanQH_`); Đồng hành 49 gồm bản tin; ẩn `tron_dai_van`/`hoi_vien`/`ban_tin` (người mua cũ giữ quyền); khấu trừ combo tối đa 50% (`ttGiaCombo_`, `ttGiaNangCap_`, `q.daTra`); MoKhoa cột 7 "Phiên giá" (dòng `nam:` cũ → `q.namCu` giữ cả 4 chủ đề); quà 39 xu sau xác thực email `guiMaEmail`/`xacThucEmail` (TaiKhoan.gs, `TK_OTP`, mã băm có muối), `ttQuaXacThuc_`; bỏ thưởng giới thiệu.
- Văn (content-creator, 1b15431): 4 chủ đề năm 5 mục ~350–450 chữ (`HSN_CD_VAN`, `htCdVan_`), Hiểu nhau hơn theo vai + tuổi (`GD_VAN_VAI`, `GD_HANH_*`), Người bạn đời thêm 7 dòng (`pnVanThem_`), "Việc nên làm trong 10 năm này" (`vsViec10_`).
- Giao diện (frontend-developer): thẻ 4 chủ đề + thanh tiến độ + "Mở trọn năm thêm X xu", nút "Hiểu nhau hơn · 9 xu", hộp xác thực email nhận 39 xu, ẩn gói ngừng bán.
- code-reviewer: không lỗi chặn. Đã sửa: bản tin miễn phí 1 dòng/lá số, tối đa 5 (`dangKyBanTin`); chừa quota email theo người nhận thư (`tkChuaQuota_`) + trần 40 mã/ngày (`OTP_TONG`); cộng quà trước khi lưu email; Đồng hành ≤ giá phần còn thiếu; đọc cột MoKhoa an toàn; nút mở năm.
- 17/11 chủ dự án chốt: chỉ đăng ký bằng email (`dangKy` từ chối SĐT); `gdQhRutGon_` chỉ khóa 5 mục mới, phần xem cũ giữ đủ; giữ bảng 12 tháng và cách chọn tháng thuận. Mã 2026.11.17.3, 24 file kiểm thử đạt, smoke 8/8.

## 17/11 – hộp đăng ký 3 ô (mã 2026.11.17.4)
- `dangKy`: tên đăng nhập trống → tự tạo từ phần trước @ (bỏ +đuôi), trùng thì thêm số; mỗi email chuẩn hóa 1 tài khoản (chỉ mục Script Property `EM_<sha>`, `tkKhoaEmail_`/`tkTenTuEmail_`); `dangNhap` nhận email; `xacThucEmail` ghi chỉ mục cho tài khoản cũ.
- Giao diện: Email · Mật khẩu (nút 👁 hiện/ẩn) · Tên; bỏ ô nhập lại mật khẩu và ô mã mời (mã lấy từ link `?ref=`). Kiểm thử thanh-toan thêm 5 kiểm tra.


## 17/11 – trang 6 hệ chia 3 tầng (mã 2026.11.17.6)
- frontend-developer: `chiaBaTang` (gọi cuối `render`), `t3Trang` (Bát Tự/Hà Lạc/Chiêm tinh/Thần số/HD từ `moRong.deHieu`), `t3TuVi` (26 bước + ba vòng, bảng `T3_TV`), `T3_CD`/`T3_RE`/`T3_CAN`, `t3Phang` (PDF trải phẳng – giống hệt từng byte), `cuonToi` (mục lục tự mở tầng 3). Chiều cao mặc định điện thoại: Bát Tự 58 → 5,3 màn, Chiêm tinh 46 → 5,8, HD 31 → 5,1, Hà Lạc 28 → 3,2, Thần số 25 → 4,3, Tử Vi 8,3 → 5,8.
- code-reviewer: không lỗi chặn; đã sửa Tóm lược Tử Vi bỏ câu thuật ngữ (`THUAT`) + giải nghĩa Cục/Thân cư, chèn khung tầng 3 trước khi chuyển nội dung, thẻ Thời vận luôn có khi có thẻ mua vận, giữ trạng thái mở khi đổi năm (`state.t3Mo`, `state.t3The`), regex chủ đề.
- Chưa: dựng tầng 3 khi mở (lazy thật), văn tầng 2 lặp trong tầng 3, Chiêm tinh tầng 1–2 còn tên hành tinh/cung (văn gốc). Tiếp theo: dọn CSS cũ + câu "lưu ý" riêng cho khách ở Tóm lược.
