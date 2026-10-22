# TCC Luận giải hằng ngày qua email

Liên quan: [[TCC Tiện ích bán lẻ]] · [[TCC Báo cáo ngày]] · [[TCC Vận hạn chuyên sâu và biến cố]]

Nhóm: Thiên Cơ Các · Tạo 22/10/2026 · Cập nhật 22/10 tối

## Yêu cầu
Chủ dự án (22/10): email hằng ngày không phải báo cáo doanh thu mà là **luận giải lá số của mình theo từng ngày**: những điều cần lưu ý cho hôm nay và cả ngày mai.

## Cách làm (TienIch.gs › mục 8)
- Sheet `VanNgay`: Tài khoản, Email, Lá số (JSON), Đăng ký lúc, Gửi gần nhất, Trạng thái. **Lá số lưu trong sheet, không ghi vào mã** (repo công khai).
- API:
  - `dangKyVanNgay(input, email, token)`: chỉ chủ sở hữu và VIP (`ttToanQuyen_`); thay dòng cũ cùng email; gửi ngay bản thử.
  - `huyVanNgay`, `dsVanNgay`.
- Nội dung:
  - `tiVanNgayDuLieu_` gọi `lapLaSoDayDu_` với `viewDate` = hôm nay, lấy `chiTiet.nhatVan[0..1]`, `tongHop.ngay[0..1]` (điểm 4 hệ) và tháng hiện tại trong `hoSoThang`.
  - `tiVanMotNgay_` dựng văn dễ hiểu từ dữ liệu cấu trúc, không nêu tên sao:
    - lời khuyên theo quan hệ can ngày với bạn (`TI_VN_TT`, 10 loại);
    - lĩnh vực nổi bật (cung ngày → `LG_LINH_VUC`);
    - khí ngày hợp hay không hợp (`danhGiaVan_`);
    - xung, hợp tuổi; trong nhà dễ bất đồng; ngày dễ gặp người giúp;
    - nên, tránh theo trực; Mặt Trăng và ngày cá nhân thần số;
    - giờ tốt, hướng tốt, hoàng đạo hay hắc đạo (có giải nghĩa).
  - Hai tầng không mâu thuẫn: ngày xung tuổi hạ nhãn tối đa "Ngày bình"; ngày xung hoặc ngày kém thì bỏ các việc lớn khỏi mục "Nên".
  - `tiVanNgayHtml_`: email nền sáng, màu Bạch Kim. Hôm nay đầy đủ, ngày mai rút gọn, kèm bối cảnh tháng âm lịch.
- Gửi:
  - `guiVanNgay` (trigger 6 giờ sáng; mỗi email một lần mỗi ngày).
  - `caiDatVanNgay` / `tatVanNgay` chạy trong trình soạn thảo.
- Giao diện (Script.html):
  - Thẻ "🌅 Luận giải hằng ngày qua email" trong tab Tiện ích, chỉ hiện khi `toanQuyen()`.
  - `tiVanNgay`; nút "Ngừng nhận" (`data-huy-van-ngay`).
  - `veTienIch` vẽ lại khi quyền đổi (`pg._toan`).
- `BAN_MOI_CAN_CO` thêm `'TienIch.gs': ['guiVanNgay', 'tiGuiVanNgay_']`. Mã giao diện `2026.10.22.2`.

## Làm dày nội dung (22/10, sau)
Chủ dự án thấy email sơ sài → làm lại theo đề xuất (chỉ sửa `TienIch.gs`):
- Mở đầu mỗi ngày: nhãn ngày + **chip 4 hệ** (Tử Vi theo `nv.danhGia`, Bát Tự theo khí ngày, Chiêm tinh theo nhà Mặt Trăng: 1/5/9/10/11 thuận, 6/8/12 cần giữ, Thần số theo `TI_VN_SO`).
- **4 lĩnh vực** Công việc / Tiền bạc / Tình cảm – gia đình / Sức khỏe: câu gốc theo nhóm quan hệ can ngày (`TI_VN_NHOM` → `TI_VN_LV`, 5 nhóm × 4 mảng, có mức +1/0/-1); cộng câu mảng nổi bật (cung ngày → `TI_VN_CUNG_LV`), khí ngày, xung/hợp tuổi, xung trong nhà, người giúp, Mặt Trăng (`TI_VN_NHA_LV`). Mức "thuận / bình / cần giữ" (`tiVanMuc_`); ngày xung hoặc kém không gắn "thuận".
- **Lịch theo buổi** sáng/chiều/tối: giờ Hoàng đạo không xung tuổi là giờ đẹp; "giờ đẹp nhất" ưu tiên giờ hợp hành của bạn.
- **Điều kiêng lịch cổ** bằng lời ngày nay (`TI_VN_KY_CAN`, `TI_VN_KY_CHI`); bỏ khỏi "Nên" việc lịch cổ kiêng (`TI_VN_KY_BO`) và lễ lớn trong ngày Hắc đạo.
- Hôm nay có "Một việc nhỏ nên làm" (`TI_VN_VIEC_NHO`) + màu, số hợp; ngày mai đầy đủ như hôm nay + "Chuẩn bị từ tối nay" (`tiVanChuanBi_`).
- Bối cảnh tháng viết lại bằng lời đời thường (`TI_VN_THANG`, việc dễ đến, nên để ý, nhịp tháng) + mốc đang hiệu lực hoặc trong 7 ngày tới (`tiVanMocGan_`).
- Sửa lỗi chữ: ngày mai không còn mở đầu bằng "Hôm nay mọi việc…".

## Kiểm thử
- `tests/van-ngay.js` đạt 1590/1590 (22/10 sau khi làm dày; trước đó 628).
- Đã chụp thử email cho lá số chủ dự án: chỉ giữ trong scratchpad và gửi trong chat, không vào repo.

## Mở rộng sau (chưa làm)
- Bán cho khách như sản phẩm định kỳ (giá theo tháng), nếu chủ dự án muốn.
