# Việc sửa bảo mật web KPI (rà soát 17/10)

Rà soát 17/10 (chỉ đọc mã, chưa sửa). Chủ dự án chốt (18/10): **làm hết trong 1 đợt**, sau phần tư vấn vận hành / dễ dùng / động viên / đào tạo.
Số dòng dưới đây là Code.gs và Index.html tại thời điểm rà soát.

## Còn chờ chủ dự án trả lời
1. Mật khẩu tạm hết hạn sau bao lâu: 48 giờ / 7 ngày / không hết hạn?
2. Có nhúng web KPI vào Google Sites hay trang khác không? (ảnh hưởng mục 11)
3. Có trường hợp TP chốt ca cho người xưởng khác không, ví dụ người được điều động? (ảnh hưởng mục 8)
4. Công nhân được xem bảng KPI của ai: chỉ mình / xưởng mình / cả nhà máy? (mục 7)

## Danh sách việc

### Rất nghiêm trọng
- [ ] **1. Chặn hàm chạy tay và hàm trigger khi gọi từ web**
  - Áp dụng cho mọi hàm viết hoa (`DAT_LAI_TAT_CA_MAT_KHAU` 2771, `TAO_HANG_LOAT_TK_CONG_NHAN` 1122, `GUI_BAO_CAO_THANG_TRUOC`, `TONG_KET_COM_THANG_TRUOC`, `LUU_TRU_NHAT_KY`, `DON_PHAT_NHAP_TRE_TP_PP`, `CAI_*`, `TAO_SHEET_*`, `NANG_CAP_*`, `KIEM_TRA_*`, `CHAN_DOAN_*`…) và các hàm trigger (`chayPhatNhapTre`, `chotThangTuDong`, `snapshotKPIHangNgay`, `saoLuuHangNgay`, `donTokenHetHan`).
  - Giữ nguyên tên để không phải cài lại trigger. Thêm bước chặn ở đầu hàm:
    - Trigger: kiểm tra `e.triggerUid` có trong `ScriptApp.getProjectTriggers()`.
    - Chạy từ trình soạn thảo: kiểm tra `Session.getActiveUser().getEmail()` là chủ sở hữu.
  - `KIEM_TRA_SAU_CAP_NHAT` và `CHAN_DOAN_KPI_QL_MOT_NGUOI` không trả danh sách tài khoản ra ngoài nữa.
  - Đã kiểm tra: web không gọi hàm nào trong các hàm này.
- [ ] **2. Chặn chèn công thức vào Sheet**
  - Trong `them_`, `themNhieu_`, `suaO_` và các chỗ `setValue(s)` / `appendRow` nhận chữ người dùng: chuỗi bắt đầu bằng `= + - @ tab CR` thì thêm `'` ở đầu.
  - Cắt `GhiChu` còn ≤ 300 ký tự. Giới hạn số dòng mỗi lần gửi sản lượng.
  - Kiểm tra `MaMay` có trong MayMoc.

### Cao
- [ ] **3. Bỏ mật khẩu mặc định 123456**
  - Áp dụng cho `luuNhanSu` 1225, `taoTaiKhoan` 2675, `TAO_HANG_LOAT_TK_CONG_NHAN`.
  - Sinh mật khẩu tạm ngẫu nhiên bằng `Utilities.getUuid()` (cấp lại mật khẩu cũng vậy, bỏ `Math.random`). Hết hạn theo câu trả lời số 1.
  - Web hiện mật khẩu tạm kèm nút Chép. Tạo hàng loạt thì ra danh sách để in.
- [ ] **4. Mã hóa mật khẩu mạnh hơn**
  - Mỗi tài khoản một muối riêng (cột mới), HMAC-SHA256 lặp nhiều vòng, pepper đặt trong Script Properties.
  - Người dùng tự chuyển sang cách mới khi đăng nhập đúng.
  - Không đụng `TK_CHU_SEED` của Thiên Cơ Các (dự án khác).
- [ ] **5. Lý do nghỉ chỉ hiện đúng phạm vi**
  - Áp dụng cho `siSoTatCaXuong` 3622, `thongKeNghiThang` 3906, `layDiemDanh` 3574, `layNghiDaiHan` 3804, `napDuLieuLoi_` 544–547.
  - CN chỉ thấy của mình. TP/PP thấy xưởng mình. ADMIN/TL/HR thấy cả nhà máy. BEP/NHOM/QC chỉ thấy số đếm.
  - Sơ đồ nhà máy vẫn chỉ dùng số đếm.

### Trung bình
- [ ] **6. Sửa `esc()` và kiểm tra định dạng mã**
  - `esc()` (Index.html 1265) đổi thêm `'` và `` ` ``.
  - Kiểm tra MaMay, MaNV theo `/^[A-Za-z0-9_.-]{1,20}$/`. Dữ liệu thật đã đạt hết: 168 máy, 192 NV, 196 tài khoản.
  - `ganManh_`: so mã băm nội dung mảnh giao diện với `MANH_HASH` nhúng trong Index trước khi chạy.
- [ ] **7. `layKPIKy` và `layLichSuKPI` 3349 lọc theo vai trò**
  - Theo câu trả lời số 4. BEP/NHOM không xem KPI. QC chỉ xem KPI của mình.
- [ ] **8. `chotCa` 637 kiểm tra MaNV**
  - Người được chốt phải thuộc xưởng của TP và chưa nghỉ việc. Có ngoại lệ hay không tùy câu trả lời số 3.
- [ ] **9. Đồng bộ vai trò khi HR sửa chức danh**
  - `suaNhanSu` 1403 → `dongBoVaiTroTaiKhoan_` không bao giờ đổi tài khoản OWNER/ADMIN/HR/TL.
  - Nâng lên TP/PP chỉ OWNER làm được.
- [ ] **10. `luuNhanSu` không nhận MaNV trùng**
  - Từ chối MaNV đã gắn với tài khoản không phải CN, để TP không khóa được TP khác.
- [ ] **11. Chặn trang khác nhúng web KPI**
  - Bỏ `setXFrameOptionsMode(ALLOWALL)` (Code.gs 12), trừ khi câu trả lời số 2 cho biết có nhúng.

### Thấp
- [ ] 12. Đổi mật khẩu hoặc cấp lại mật khẩu thì thu hồi mọi phiên cũ (đánh số "phiên bản phiên" theo tài khoản). Thời hạn cache phiên lấy theo hạn còn lại, không cố định 21600 giây.
- [ ] 13. Khóa đăng nhập sai không cho người khác khóa ADMIN: dùng thời gian chờ tăng dần thay vì khóa cứng 15 phút. Thêm giới hạn chung cho số lần thử nhiều tài khoản.
- [ ] 14. Máy chủ chặn đúng chế độ chỉ xem:
  - HR không gọi được `ganCongDoanChoNhieu` / `luuKyNang`.
  - TL/HR không gọi được `xoaThucDon` nếu chủ dự án muốn vậy.
- [ ] 15. Các mục nhỏ còn lại:
  - `chotThang` 3065: TP không chốt lại được tháng đã chốt chính thức.
  - `napDuLieuLoi_`: không gửi PhieuKCS / DeXuatDinhMuc / MayMoc / ViPham của toàn nhà máy cho CN và QC khi không cần.
  - Thông báo lỗi không lộ chi tiết nội bộ.
  - Chuyển `BD_SHEET_ID` sang Script Properties.
  - Nhắc chủ dự án kiểm tra quyền chia sẻ sheet giải bóng đá và đổi mật khẩu BTC.

## Sau khi dán
1. Chủ dự án đổi mật khẩu chủ sở hữu.
2. Chạy `BAT_BUOC_DOI_MAT_KHAU_MAC_DINH` rồi `KIEM_TRA_SAU_CAP_NHAT` từ trình soạn thảo.
3. Chạy lại toàn bộ kiểm thử trong `tests/`, thêm `tests/bao-mat.js` gọi thử mọi hàm công khai theo từng vai trò và khi không có phiên.
