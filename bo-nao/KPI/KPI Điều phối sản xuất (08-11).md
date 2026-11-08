# KPI Điều phối sản xuất (08-11)

Nhóm: KPI · Cập nhật 08/11/2026
Liên quan: [[KPI Quy trình sản xuất]] · [[KPI Gộp công đoạn và tiến độ BTP]] · [[KPI Kiểm thử]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

Chủ dự án hỏi 08/11 "Điều gì giúp tôi quản lý và điều phối sản xuất tốt hơn?". Chuyên gia `quan-ly-van-hanh` đề xuất 5 việc. Chủ dự án chọn **1, 2, 3**; việc 4 (gợi ý điều người) "chưa chắc, để sau"; việc 5 (sổ việc sau họp) không chọn.

## Chủ dự án chốt
- Việc 1: chưa họp trưởng phòng → **Claude đề xuất cách đếm, chủ dự án duyệt** (bấm Áp dụng).
- Việc 2: **TP + PP xưởng mình, chủ thấy tất cả, hiện cả kênh bán / khách**; hạn = **chỉ xếp theo hạn đơn** (không tính ngược).
- Việc 1 + 3 (sức khỏe dữ liệu, tồn / nút cổ chai): **chủ + Ban điều hành** (vai trò ADMIN: giamdoc C019, phogd2 C077, kimloan C067; chủ sở hữu C056).

## Đã làm (`tests/dieu-phoi/`)
- Máy chủ `dieu-phoi.gs` (va-dieu-phoi.py, cuối va-code.py):
  - `DP_DE_XUAT`: Phôi Carbon thêm **Cắt Phôi Ngọn** (CB-CHECK-CAT); Sơn **÷ 2**, In UV **÷ 2** (mỗi chuôi ghi 2 lần: Sơn máy + súng tay; In và phủ bóng + phủ bóng). Số thật T10: Phôi Carbon 255 → 471/ngày, Sơn 759 → 379, In UV 706 → 353; đối chiếu Phôi Thô xuất chuôi 340, Đóng gói 342.
  - "Số lần ghi mỗi khúc" = dòng `LUOT` trong sheet QuyTrinh (`qtDocQT_().luot`), giữ nguyên khi Lưu quy trình / duyệt đề xuất TP (`qtKiemGhi_` chép lại). `dhSanLuongXuong_` chia `luot` (buoc giữ số ghi thật), web `qtRa` / `dhXG` / chú thích xưởng ghi "÷ 2".
  - `apCachDem(token, {xuat, luot})` (quy-trinh.gs, chỉ chủ sở hữu, chỉ thay dòng XUAT / LUOT của xưởng đó) + `apDeXuatDem(token)`.
  - `layDieuPhoi(token, lamMoi)` (OWNER / ADMIN, nhớ `DP_v1` 10 phút) → `dem`, `sk` (ngày làm thiếu nhật ký 6 ngày, chờ duyệt > 2 ngày, số bất thường > max(3 × trung vị, trung vị + 100) trong 7 ngày, ngày tương lai), `cap` (6 chặng, 14 ngày làm: đang dồn / hụt / cân bằng / lệch lớn > 40%), `chuoi` (nút cổ chai chuỗi chuôi / ngọn: TB 7 ngày + hôm qua). Chưa áp đề xuất → dòng chảy tính theo đề xuất (`theoDeXuat`). Hoàn thiện → Đóng gói không so (khúc / sản phẩm).
  - `layViecXuongToi(token)`: TP/PP → dòng đơn còn thiếu liên quan xưởng mình (`DP_LOAI_XUONG`), chủ sở hữu → tất cả. `dpEmail_` thêm mục "ĐIỀU PHỐI" vào email 8h.
- Web mục 39 `va-dieu-phoi-web.py` (Việc hôm nay, khối `#dpHN`): `dpVeQL` 4 thẻ (Cách đếm + nút Áp dụng chỉ chủ sở hữu, Nút cổ chai, Dòng chảy, Sức khỏe dữ liệu); việc 2: `dpViecTai` → mảnh QuyTrinh `dpTinhViec` / `dpVeViec` (cùng cách tính Việc theo xưởng `dhCon`), 3 nhóm **Ưu tiên → Trễ hạn → Theo hạn đơn** có tổng nhóm, tổng theo khối (chuôi / chuôi nhảy / ngọn…), 15 đơn + "Xem thêm"; điện thoại dạng thẻ. Chủ sở hữu bấm "Xem việc theo xưởng" + chọn xưởng.

## PDF họp trưởng phòng theo cách đếm mới (08/11)
- Chủ dự án chọn "áp dụng trên web trước, PDF ra số mới". `tests/hop/tao-pdf-hop-xuong.js` thêm chế độ `MOI=1`: áp `apDeXuatDem` trong bản thử rồi mới lấy số; khung "Cách đếm mới đã áp dụng 08/11" ở trang đầu; trang Phôi Carbon / Sơn / In UV có ô ☐ Đồng ý / ☐ Không; thêm câu Ngọn Taro (Tester + Check ngọn đếm đôi?); số mục 5 (dòng chảy) lấy từ dữ liệu thay vì gõ cứng. Số T10 mới: Phôi Carbon 446/461 (97%), Sơn 383/325 (118%), In UV 377/325 (116%). File 24 trang ở scratchpad (không commit).
- Chạy: `MOI=1 F=<bản thử số thật> O=<thư mục> LD=<luudo.json> LY=tests/hop/luu-do-y-kien.js node tests/hop/tao-pdf-hop-xuong.js`.

## Kiểm thử
- `tests/dieu-phoi.js` 27/27 (DATA + DH số thật), `tests/dieu-phoi-web.js` 13/13 (bản thử số thật GIO 08/11, chủ / giamdoc / tpson điện thoại / c040).
- Bộ cũ: quy-trinh.js 76/76, tang-toc-3.js 17/17, don-hang.js 130/135 (5 lỗi có sẵn, giống bản trước sửa).

## Còn để sau
- Việc 4 gợi ý điều người (chờ chủ dự án: có điều người giữa xưởng không). Việc 5 sổ việc sau họp (không chọn).
- Tồn thật cần số kiểm đếm đầu kỳ; hiện chỉ có phần tăng / giảm trong 14 ngày.
- Ngọn Taro 451 > Phôi Thô ngọn 310 ("đang hụt"). Chủ dự án trả lời 08/11: **"Tester" là joint tester thử ren chuôi cho khách** (phụ kiện, nhánh PK), không phải ngọn → `phan()` trong `dpTinh_` bỏ nhánh PK / tên có "tester" khỏi chuỗi ngọn (vẫn tính vào sản lượng xưởng). Tester chỉ ~5/ngày nên 451 gần như toàn là "Check ngọn": không đếm đôi; chênh với Phôi Thô có thể do Ngọn Taro đang dùng ngọn tồn hoặc bước xuất ngọn của Phôi Thô chưa đủ – theo dõi thêm.
- 08/11 chủ dự án: **số Ngọn Taro đúng; ngọn GF qua Phôi Thô nhưng Phôi Thô ghi thiếu.** Thêm `DP_GHI_THIEU` (dieu-phoi.gs): đối chiếu 14 ngày mã xưởng trước giao ↔ xưởng sau nhận (ngọn GF: XPT-TR-TRNGF ↔ NGON-TARORENDONG-GF + NGON-TARORENTHUONG-GF; ngọn carbon: 2 bước Epoxy ngọn CB ↔ NGON-TAROREN-CB + NGON-TARORENDONG-CARBON). Sau > 1,3 × trước và hơn 20/ngày → `sk.ghiThieu` (chip vàng "Có thể ghi thiếu" ở Sức khỏe dữ liệu + email 8h), chặng "Ngọn chờ taro" đang hụt có dòng "có thể do ghi thiếu". Số thật 14 ngày: Phôi Thô ghi giao ngọn GF 39/ngày, Ngọn Taro làm 233/ngày; carbon khớp.
