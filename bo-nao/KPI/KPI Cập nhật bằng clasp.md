# KPI Cập nhật bằng clasp

Nhóm: KPI · Cập nhật 21/10/2026
Liên quan: [[Lần dán lên Apps Script]] · [[KPI Tổng quan và cách dựng]] · [[KPI Tăng tốc đợt 2 (21-10)]] · [[00 Mục lục]]

Chủ dự án 21/10 nhờ "tự dùng máy tính của tôi cài clasp": phiên đám mây không có công cụ điều khiển máy tính, và Claude không được gõ vào cửa sổ lệnh → làm bộ cài bấm đúp cho Windows.

- Thư mục `kpi-app/cai-dat-clasp/` (repo công khai nên tải được thẳng từ GitHub raw): `1-CAI-DAT.bat`, `2-CAP-NHAT.bat`, `3-KHOI-PHUC.bat` gọi `cai-dat.ps1`, `cap-nhat.ps1`, `khoi-phuc.ps1` (UTF-8 có BOM, CRLF – PowerShell 5.1 cần BOM), hàm chung `chung.ps1`, hướng dẫn `HUONG-DAN.md`.
- Cài: winget cài Node.js LTS nếu thiếu → `npm i -g @google/clasp@2.4.2` (ghim bản 2.x để `fileExtension:"gs"` và cú pháp `deploy --deploymentId` không đổi) → mở trang bật Apps Script API → `clasp login` → hỏi Mã tập lệnh → `.clasp.json` + `clasp pull` vào `%USERPROFILE%\KPI-AppsScript\ma` → sao lưu → chọn bản triển khai web (bỏ @HEAD) → `cau-hinh.json` {scriptId, deployId, tuTrienKhai = manifest có "webapp"}.
- Cập nhật: sao lưu (`clasp pull` → `sao-luu\yyyy-MM-dd_HH-mm-ss`) → tải Code.gs + Index/SoDo/HoatAnh/AmThanh.html từ nhánh `claude/beautiful-ptolemy-f2j7za` (kiểm tra kích thước + có `function napDuLieu`) → ghi đè file .gs đang chứa `function napDuLieu` (tên có thể là "Mã"), xóa file html sai hoa/thường (vd. "Sodo") → `clasp push -f` → `clasp deploy --deploymentId` (giữ link). Khôi phục: chọn bản sao lưu → push + deploy.
- Bẫy đã gặp khi thử: hàm PowerShell tên `Clasp` trùng lệnh `clasp` → tự gọi lại vô hạn (đã đổi `GoiClasp`, gọi `clasp.cmd` trên Windows); PowerShell 5 coi chữ in ra stderr là lỗi khi `ErrorActionPreference=Stop` → tạm đặt Continue khi gọi clasp.
- Đã thử trên Linux bằng PowerShell 7.4.6 (tải về /tmp/pwsh) + "clasp giả" (scratchpad `thu-clasp/bin/clasp`): cả 3 bước chạy đúng. **Chưa chạy trên Windows thật / clasp thật** – lần đầu nên làm cùng chủ dự án.
- 22/10: chủ dự án **cài xong**. Lỗi gặp lần đầu: bấm .bat ngay trong file ZIP (Windows chỉ giải nén .bat ra Temp) → PowerShell báo "-File … không tồn tại". 3 file .bat nay kiểm tra .ps1 có cạnh không, báo "CHUA GIAI NEN THU MUC" + cách sửa.
