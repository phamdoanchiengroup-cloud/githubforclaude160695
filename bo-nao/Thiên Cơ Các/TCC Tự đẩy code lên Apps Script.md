# TCC Tự đẩy code lên Apps Script

Liên quan: [[Lần dán lên Apps Script]] · [[TCC Kiểm thử]] · [[Việc chờ chủ dự án]]

Nhóm: Thiên Cơ Các · Tạo 22/10/2026

## Lịch sử
- 22/10: làm bản GitHub Actions (workflow + secret). Chủ dự án so sánh với bộ bấm đúp của web KPI, chọn **bộ bấm đúp** và yêu cầu **tắt GitHub Actions**. Đã xóa `.github/workflows/day-len-apps-script.yml`, `tools/day-len-apps-script.sh`, `HUONG-DAN-CLASP.md`.
- 22/10: làm bộ bấm đúp `tuvi-app/cai-dat-clasp/`, dựa trên `kpi-app/cai-dat-clasp/` ở nhánh KPI.

## Bộ bấm đúp (Windows, clasp 2.4.2)
- `1-CAI-DAT.bat` → `cai-dat.ps1`:
  - Cài Node (winget) và clasp, bật API, đăng nhập. Nếu máy đã có `.clasprc.json` từ bộ KPI thì hỏi dùng lại.
  - Nhập Script ID, `clasp pull`, gọi `KiemTraDungDuAn` (chặn dự án có `function napDuLieu` của KPI; dự án chưa có `lapLaSo` thì hỏi xác nhận).
  - Sao lưu, chọn bản triển khai, ghi `cau-hinh.json`.
- `2-CAP-NHAT.bat` → `cap-nhat.ps1`: sao lưu, `KiemTraDungDuAn`, `TaiBanMoi`, `ChepVaoThuMucMa`, `push -f`, `deploy --deploymentId`.
  - `TaiBanMoi` lấy sha mới nhất của nhánh qua GitHub API, liệt kê `tuvi-app/*.gs|*.html`, tải raw theo sha, so dung lượng từng file.
  - Kiểm tra `Code.gs` có `kiemTraCaiDat` và 3 mã phiên bản giao diện trùng nhau.
  - `ChepVaoThuMucMa` giữ `Anh.html` đang có trên Apps Script (`$KhongDe`) và giữ file chỉ có trên Apps Script.
- `3-KHOI-PHUC.bat` → `khoi-phuc.ps1`: chọn bản sao lưu, đẩy lại, triển khai.
- `chung.ps1`: thư mục `%USERPROFILE%\ThienCoCac-AppsScript` (`ma`, `sao-luu`, `cau-hinh.json`), nhánh `claude/happy-brown-lttkz3`.
- File `.ps1` lưu UTF-8 có BOM + CRLF để PowerShell 5 đọc đúng tiếng Việt.
- Đã chạy thử bằng PowerShell 7 trên Linux với clasp giả, kết quả:
  - cài đặt đạt;
  - cập nhật đạt: tải 33 file thật từ GitHub, giữ Anh và file riêng, triển khai đúng mã;
  - khôi phục đạt;
  - chặn nhầm dự án KPI đạt.
- Hướng dẫn cho chủ dự án: `tuvi-app/cai-dat-clasp/HUONG-DAN.md`. File ZIP gửi trong chat.

## Sửa 22/10 (sau lần chạy thật đầu tiên)
- Máy chủ dự án báo `The remote name could not be resolved: 'api.github.com'`: máy không phân giải được tên miền api.github.com (lỗi mạng hoặc DNS, không phải sai nhánh).
- `TaiBanMoi` thử API trước. Lỗi thì chuyển sang chỉ dùng raw.githubusercontent.com với danh sách `cai-dat-clasp/ds-file.txt` (tên file + byte), mỗi file tải lại tối đa 3 lần, `LoiMang` báo lỗi mạng dễ hiểu.
- **Mỗi lần thêm hoặc sửa file .gs/.html phải chạy `python3 tools/tao-ds-file.py`**: `tests/cai-dat.js` báo lỗi nếu quên.
- Đã thử cả hai đường (API, và raw khi API hỏng): đều tải đủ 33 file.

## Lưu ý
- Mỗi push đổi mã lên nhánh có thể lên web thật khi chủ dự án bấm cập nhật, nên chỉ push sau khi kiểm thử đạt.
- Nếu web KPI và Thiên Cơ Các ở hai tài khoản Google khác nhau, phải đăng nhập lại clasp khi chuyển dự án.
