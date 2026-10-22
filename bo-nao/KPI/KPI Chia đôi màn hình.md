# KPI Chia đôi màn hình

Nhóm: KPI · Cập nhật 21/10/2026
Liên quan: [[KPI Tăng tốc đợt 2 (21-10)]] · [[KPI Thao tác và hiệu ứng bên trong]] · [[Lần dán lên Apps Script]] · [[00 Mục lục]]

Chủ dự án 21/10: bấm "Chi tiết" một công nhân ở Bảng KPI và "Xem hồ sơ" tải lâu; muốn kiểu chia đôi: một bên danh sách, một bên thông tin người được bấm, và các tab tương tự.

## Nguyên nhân chậm (đo trên dữ liệu thật 21/10)
- `layLichSuKPI` đọc 14 sheet (~262.000 ô) để trả 3–4 KB; `hoSoNhanVien` đọc ~238.000 ô (cả NhatKySanXuat) để trả ~15 KB. Mỗi lần bấm ở bản thật mất vài giây vì đọc sheet.
- Trình duyệt đã có sẵn từ lúc đăng nhập: điểm KPI của dòng (`layKPIKy`), `D.nhatky` + `D.choDuyet` (từ đầu tháng trước), `D.kcs`, `D.nhansu`.

## Đã làm (chưa dán; chỉ Index.html) = va-index.py **mục 27** `tests/chia-doi/va-chia-doi.py` + `chia-doi.{css,js}` (mục CUỐI vì bọc hàm của mục trước)
- Màn ≥1100px và `localStorage kpi_chia_doi` ≠ 'tat': khung `#cdPanel` cố định bên phải (`--cd-w: clamp(420px,40vw,580px)`, `--cd-top` = đáy header), `body.cd-mo #main` chừa lề phải.
- `xemChiTietKPI`: hiện ngay 8 ô số từ dòng của `window.__kpiR` (bọc `veBangKPI`) + nút "Xem hồ sơ", rồi `layLichSuKPI` (chờ 350 ms để bấm ↓ liên tục không gọi thừa) vẽ bằng `veLichSu` vào `#ls_noidung`.
- `xemHS`: dựng hồ sơ tạm từ `nv()`, `D.nhatky`+`D.choDuyet`, `D.kcs` → `veHS` (đã vá: có `window.__hsVao` thì vẽ vào khung, bỏ nút "Về danh sách"), rồi `hoSoNhanVien` thay bản đầy đủ. `edHS` đóng khung trước.
- KPI quản lý: `window.__qlDs`, dòng `data-cd="ql|<maNV>"`, `cdQL` hiện 6 chỉ số + điểm trừ vận hành (không gọi máy chủ).
- Chung: dòng có nút Chi tiết / Xem hồ sơ tự được gắn `data-cd` (MutationObserver trên #main); bấm dòng mở chi tiết; ↑ ↓ Esc; tô sáng dòng (`tr.cd-chon`, chỉ nền – không dùng vạch sọc bên); cột phụ `COT_PHU` ẩn khi mở (`.cd-an`); sang tab khác tự đóng; đóng bong bóng Rhino khi mở, Rhino lùi sang trái khung; nút "Kiểu cũ" ↔ "⧉ Chia đôi" (trong cửa sổ lịch sử cũ và trang hồ sơ cũ). Màn hẹp giữ nguyên cách cũ.
- Kiểm thử `tests/chia-doi-web.js` (21, bản xem thử `GIO=2026-10-21T10:00:00+07:00`). sua-loi-21-10-web, van-hanh-web, thao-tac-web, dang-nhap-web cho kết quả giống hệt trước.

## Có thể mở rộng (chưa làm)
- Các tab khác dạng danh sách → chi tiết: Duyệt sản lượng (từng công nhân), Máy móc, Nhật ký, Công đoạn của người (`xemCongDoan`).
- Máy chủ: chỉ mục nhật ký theo người để lần tải đầy đủ cũng nhanh (hiện vẫn đọc cả sheet).

## 22/10: Nhân sự → nút "Công đoạn" mở khung "Công đoạn đã gán" (chủ dự án)
- `cdKN(ma)` (chia-doi.js mục 2b): khung bên phải chỉ liệt kê công đoạn đã gán (tên, xưởng nếu khác, định mức + đơn vị, mức kỹ năng Đang học / Làm được / Kèm được, nhãn "đã ngừng"), nút "✎ Sửa / gán công đoạn" đóng khung rồi mở bảng gán cũ (`goc_edKN_`). Ghi đè `edKN` và `xemCongDoan` (nút "x công đoạn ▸") khi `cdDuoc()`; màn hẹp giữ cách cũ.
- Loại khung `kn` dùng chung dòng `data-cd="hs|…"` (`the(loai)`), phím ↑/↓ chuyển người vẫn ở khung công đoạn; "Kiểu cũ" → `edKN`.
- Kiểm thử `chia-doi-web.js` 27 (thêm mục 4b, 6 kiểm tra).
