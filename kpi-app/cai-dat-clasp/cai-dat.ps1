# Cài clasp và nối máy tính với dự án Apps Script của web KPI. Chạy MỘT lần (bấm đúp 1-CAI-DAT.bat).
. (Join-Path $PSScriptRoot 'chung.ps1')

try {
  Bao '=== CÀI ĐẶT CẬP NHẬT TỰ ĐỘNG CHO WEB KPI ==='

  # 1. Node.js (clasp chạy trên Node)
  LamMoiPath
  if (-not (CoLenh 'node')) {
    Bao 'Bước 1/5: Cài Node.js (máy có thể hỏi quyền quản trị – bấm Có / Yes)...'
    if (-not (CoLenh 'winget')) { throw 'Máy chưa có winget. Tải Node.js bản LTS ở https://nodejs.org , cài xong rồi chạy lại file này.' }
    winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
    LamMoiPath
    if (-not (CoLenh 'node')) { throw 'Cài Node.js xong nhưng máy chưa nhận. Đóng cửa sổ này, bấm đúp 1-CAI-DAT.bat lần nữa.' }
  }
  Tot ('Bước 1/5: Node.js ' + (node -v))

  # 2. clasp (giữ đúng bản 2.4.2 để các lệnh bên dưới không đổi)
  if (-not (CoLenh 'clasp') -or -not ((clasp --version 2>$null) -match '^2\.4\.')) {
    Bao 'Bước 2/5: Cài clasp...'
    $truoc = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    npm install -g @google/clasp@2.4.2 2>&1 | Out-Host
    $ErrorActionPreference = $truoc
    LamMoiPath
    if (-not (CoLenh 'clasp')) { throw 'Chưa cài được clasp. Chụp màn hình cửa sổ này gửi Claude.' }
  }
  Tot ('Bước 2/5: clasp ' + (clasp --version))

  # 3. Bật Apps Script API cho tài khoản Google
  Bao 'Bước 3/5: Bật "Google Apps Script API"'
  Write-Host '  Trình duyệt sẽ mở trang cài đặt Apps Script. Gạt nút "Google Apps Script API" sang BẬT (On).'
  Start-Process 'https://script.google.com/home/usersettings'
  Hoi '  Bật xong thì quay lại đây bấm Enter' | Out-Null

  # 4. Đăng nhập Google
  Bao 'Bước 4/5: Đăng nhập Google'
  Write-Host '  Trình duyệt sẽ mở. Chọn ĐÚNG tài khoản Google đang sở hữu dự án Apps Script của web KPI, bấm "Cho phép" (Allow).'
  New-Item -ItemType Directory -Force -Path $Goc | Out-Null
  $truoc = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  clasp login 2>&1 | Out-Host
  $ErrorActionPreference = $truoc

  # 5. Nối với dự án
  Bao 'Bước 5/5: Nối với dự án web KPI'
  Write-Host '  Mở dự án Apps Script của web KPI -> bấm biểu tượng bánh răng "Cài đặt dự án" bên trái -> chép "Mã tập lệnh" (Script ID).'
  $id = Hoi '  Dán Mã tập lệnh vào đây rồi bấm Enter'
  if ($id -notmatch '^[\w-]{20,}$') { throw 'Mã tập lệnh không đúng dạng (là một chuỗi dài chữ và số). Chạy lại file này.' }
  if (Test-Path $ThuMucMa) { Rename-Item $ThuMucMa ($ThuMucMa + '-cu-' + (Get-Date -Format 'yyyyMMdd-HHmmss')) }
  New-Item -ItemType Directory -Force -Path $ThuMucMa | Out-Null
  # .clasp.json: mã máy chủ để đuôi .gs giống trong Apps Script
  ('{"scriptId":"' + $id + '","fileExtension":"gs"}') | Set-Content -Path (Join-Path $ThuMucMa '.clasp.json') -Encoding ASCII
  GoiClasp -ThamSo @('pull') | Out-Null
  $tep = Get-ChildItem $ThuMucMa -File | Where-Object { $_.Name -ne '.clasp.json' }
  Tot ('  Đã tải về ' + $tep.Count + ' file đang có trên Apps Script: ' + (($tep | ForEach-Object { $_.Name }) -join ', '))
  if (-not ($tep | Where-Object { $_.Name -eq 'appsscript.json' })) { throw 'Không thấy appsscript.json – có thể dán nhầm Mã tập lệnh của dự án khác.' }
  $dich = SaoLuuBanTrenMang

  $trienKhai = ChonTrienKhai
  if (-not $trienKhai) {
    # Dự án chưa có bản triển khai web nào: rất có thể đã dán Mã tập lệnh của BẢN SAO (Tạo bản sao dự án) chứ không phải dự án đang chạy web (22/10)
    Write-Host ''
    Write-Host '  CẢNH BÁO: dự án này CHƯA có bản triển khai web nào.' -ForegroundColor Red
    Write-Host '  Dự án đang chạy web của công ty luôn có ít nhất 1 bản triển khai. Có thể bạn đã chép Mã tập lệnh của BẢN SAO.' -ForegroundColor Red
    Write-Host '  Kiểm tra: mở dự án có đường link web công nhân đang dùng -> Triển khai -> Quản lý triển khai phải thấy đúng link đó,' -ForegroundColor Yellow
    Write-Host '  rồi lấy Mã tập lệnh của CHÍNH dự án đó.' -ForegroundColor Yellow
    $tl = Hoi '  Gõ C rồi Enter nếu chắc chắn đúng dự án (dự án mới, chưa từng triển khai); chỉ Enter để dừng và làm lại'
    if ($tl -notmatch '^[cC]') { throw 'Đã dừng để kiểm tra lại Mã tập lệnh. Chạy lại 1-CAI-DAT.bat với Mã tập lệnh của dự án đang chạy web.' }
  }
  $manifest = Get-Content (Join-Path $ThuMucMa 'appsscript.json') -Raw -Encoding UTF8
  $tuTrienKhai = [bool]($trienKhai -and ($manifest -match '"webapp"'))
  GhiCauHinh ([pscustomobject]@{ scriptId = $id; deployId = $trienKhai; tuTrienKhai = $tuTrienKhai; ngayCai = (Get-Date -Format 'yyyy-MM-dd HH:mm') })

  Bao '=== CÀI ĐẶT XONG ==='
  Write-Host ('  Bản sao lưu đầu tiên: ' + $dich)
  if ($tuTrienKhai) { Tot '  Từ nay mỗi lần có bản mới: bấm đúp 2-CAP-NHAT.bat là xong (tự dán + tự triển khai, giữ nguyên đường link web).' }
  else { Write-Host '  Từ nay mỗi lần có bản mới: bấm đúp 2-CAP-NHAT.bat (tự dán), rồi vẫn bấm Triển khai -> Quản lý triển khai -> ✏️ -> Phiên bản mới -> Triển khai như cũ.' -ForegroundColor Yellow }
} catch {
  Loi ('Chưa xong: ' + $_.Exception.Message)
  Write-Host 'Chụp màn hình cửa sổ này gửi Claude để được hướng dẫn tiếp.'
}
