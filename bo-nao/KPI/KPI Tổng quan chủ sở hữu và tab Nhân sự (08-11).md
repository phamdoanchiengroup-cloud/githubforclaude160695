# KPI Tổng quan chủ sở hữu và tab Nhân sự (08-11)

Nhóm: KPI · Cập nhật 08/11/2026
Liên quan: [[KPI Điều phối sản xuất (08-11)]] · [[KPI Kiểm thử]] · [[Lần dán lên Apps Script]] · [[Quyết định của chủ dự án]] · [[00 Mục lục]]

Chủ dự án yêu cầu 08/11 (5 việc). Hỏi chuyên gia `quan-ly-van-hanh` cho Tổng quan: "một màn hình trả lời 5 câu mỗi sáng", 3 phương án, khuyến nghị **Vừa**. Chủ dự án chọn Vừa nhưng **bỏ tỷ lệ lỗi** (chưa có số liệu lỗi), Đài quan sát **làm lại đẹp hơn, thêm hiệu ứng**, bộ lọc **Xưởng + Trạng thái + Chức danh + Thâm niên + Độ tuổi**, áp cho **mọi vai trò**.

## 1. Gỡ "Đón người mới"
- Web: bỏ mục D4 (`vhHoiNhap`, `vhDanhDau`, CSS `.vh-muc`) trong `tests/van-hanh/van-hanh-web.html`; `ho-so-web.js` hết tham chiếu `vhHN`.
- Máy chủ: bỏ `layHoiNhap`, `danhDauHoiNhap`, `HN_*` trong `tests/van-hanh/van-hanh.gs`. Sheet `HoiNhap` cũ trong Google Sheet để nguyên (không còn dùng, chủ dự án tự xóa nếu muốn).
- Kiểm thử: bỏ phần D4 ở `van-hanh.js`; `van-hanh-web.js` kiểm "không còn khung Đón người mới".

## 2–4. Tab Nhân sự (mục 40 `tests/nhan-su/va-nhan-su-loc-web.py`)
- Thứ tự: **Thêm nhân viên → Tìm nhân viên (+ bộ lọc) → Hồ sơ chưa đủ → bảng theo xưởng**.
- `nsTheTim()`: ô tên / mã + 5 bộ lọc (số người mỗi lựa chọn trong ngoặc), nhóm thâm niên / tuổi giống Thống kê nhân sự (`NS_TN`, `NS_TUOI`). `locNhanSu()` lọc theo `data-x/tt/cd/tn/tuoi` của từng dòng, đầu thẻ xưởng "k / n người", nút "✕ Bỏ lọc"; vẽ lại tab giữ bộ lọc (`NS_LOC`).
- Bảng (mọi vai trò): bỏ cột Xưởng, bỏ cột KPI, thêm **Thâm niên** "x năm y tháng" (`nsThang` từ NgayVaoLam, dưới 3 tháng tô vàng). Trạng thái chỉ có Đang làm / Tạm nghỉ (người nghỉ việc không tải về web).

## 5. Tổng quan chủ sở hữu (mục 41 `tests/tong-quan/tong-quan-web.js`)
- Chỉ `ME.laOwner`: `vDash` → `tqVe()`; ban điều hành / TP giữ Tổng quan cũ (vẫn có chưa khai báo + dưới 80%).
- Khối: (1) 4 ô – thành phẩm Đóng gói ngày làm gần nhất / mục tiêu + đường 14 ngày, giao đúng hạn 4 tuần, có mặt hôm nay, đơn trễ hạn (+ số ngày hàng tồn); (2) sản lượng từng xưởng ngày làm gần nhất so mục tiêu (xanh ≥ 95, vàng 80–95, đỏ < 80); (3) đơn hàng: trễ hạn, đến hạn 7 ngày (đơn ưu tiên), đơn vào / làm xong 7 ngày (báo khi vào > xong 3 ngày liền); (4) nhân lực hôm nay theo xưởng + suất cơm (`xemTongHopCom`); (5) cần chú ý: độ tin cậy số liệu (% nhật ký ngày làm gần nhất đã duyệt), nút cổ chai, hàng đang dồn, chờ duyệt quá 2 ngày, có thể ghi thiếu (`layDieuPhoi`).
- Nạp: `siSoTatCaXuong`, `xemTongHopCom`, `layDieuPhoi`, mảnh QuyTrinh (`dhTai`, `dhTaiDG`, `dhTaiTD`); bọc `dhVeLai` để khi đang ở tab Tổng quan thì vẽ lại khối, không vẽ Quy trình.
- Đài quan sát (`tests/holo/holo-web.js`): bỏ "Dưới 80%" + "Hôm nay đã khai"; cột phải = **Có mặt hôm nay** (`holoCoMat`, cập nhật khi tải xong điểm danh) + **Số liệu ngày làm gần nhất đã duyệt** (`holoNgayLamTruoc`). Hiệu ứng (chỉ khi Hologram · chuyển động, `.hl-dong`; tắt khi "tĩnh" / máy giảm chuyển động): quét radar, vành vạch xoay, hạt bay quỹ đạo, sao nhấp nháy, đa giác vẽ dần, nhịp tim ở tâm, vòng tròn chạy, vạch sáng quét dọc, số chạy từ 0 (`holoDemSo`).

## Kiểm thử
- `tests/nhan-su-loc-web.js` 13/13, `tests/tong-quan-web.js` 19/19 (bản thử số thật GIO 09/11 9h), `holo-web.js` 21/21 (chờ số chạy xong), `van-hanh-web.js` 29/29, `dieu-phoi-web.js` 13/13. `van-hanh.js` 3 lỗi có sẵn (giống bản trước).
