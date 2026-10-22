# Cài clasp và nối máy tính với dự án Apps Script của Thiên Cơ Các. Chạy MỘT lần (bấm đúp 1-CAI-DAT.bat).
. (Join-Path $PSScriptRoot 'chung.ps1')

try {
  Bao '=== CÀI ĐẶT CẬP NHẬT TỰ ĐỘNG CHO THIÊN CƠ CÁC ==='

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
  try { Start-Process 'https://script.google.com/home/usersettings' } catch { Write-Host '  (Tự mở trình duyệt không được – hãy tự mở link trên.)' }
  Hoi '  Bật xong (hoặc đã bật từ trước) thì quay lại đây bấm Enter' | Out-Null

  # 4. Đăng nhập Google (máy đã đăng nhập clasp từ bộ web KPI thì có thể dùng lại nếu cùng tài khoản)
  Bao 'Bước 4/5: Đăng nhập Google'
  $dangNhapLai = $true
  if (Test-Path (Join-Path $env:USERPROFILE '.clasprc.json')) {
    $tl = Hoi '  Máy này đã đăng nhập clasp từ trước (vd. khi cài bộ web KPI). Tài khoản Google đó CÓ chứa dự án Thiên Cơ Các không? Gõ C rồi Enter để dùng luôn, chỉ Enter để đăng nhập lại'
    if ($tl -match '^[cC]') { $dangNhapLai = $false }
  }
  if ($dangNhapLai) {
    Write-Host '  Trình duyệt sẽ mở. Chọn ĐÚNG tài khoản Google đang sở hữu dự án Apps Script của Thiên Cơ Các, bấm "Cho phép" (Allow).'
    $truoc = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
    clasp logout 2>&1 | Out-Null
    clasp login 2>&1 | Out-Host
    $ErrorActionPreference = $truoc
  }
  New-Item -ItemType Directory -Force -Path $Goc | Out-Null

  # 5. Nối với dự án
  Bao 'Bước 5/5: Nối với dự án Thiên Cơ Các'
  Write-Host '  Mở dự án Apps Script của Thiên Cơ Các -> bấm biểu tượng bánh răng "Cài đặt dự án" bên trái -> chép "Mã tập lệnh" (Script ID).'
  $id = Hoi '  Dán Mã tập lệnh vào đây (chuột phải để dán) rồi bấm Enter'
  if ($id -notmatch '^[\w-]{20,}$') { throw 'Mã tập lệnh không đúng dạng (là một chuỗi dài chữ và số). Chạy lại file này.' }
  if (Test-Path $ThuMucMa) { Rename-Item $ThuMucMa ($ThuMucMa + '-cu-' + (Get-Date -Format 'yyyyMMdd-HHmmss')) }
  New-Item -ItemType Directory -Force -Path $ThuMucMa | Out-Null
  # .clasp.json: mã máy chủ để đuôi .gs giống trong Apps Script
  ('{"scriptId":"' + $id + '","fileExtension":"gs"}') | Set-Content -Path (Join-Path $ThuMucMa '.clasp.json') -Encoding ASCII
  GoiClasp -ThamSo @('pull') | Out-Null
  $tep = Get-ChildItem $ThuMucMa -File | Where-Object { $_.Name -ne '.clasp.json' }
  Tot ('  Đã tải về ' + $tep.Count + ' file đang có trên Apps Script.')
  if (-not ($tep | Where-Object { $_.Name -eq 'appsscript.json' })) { throw 'Không thấy appsscript.json – có thể dán nhầm Mã tập lệnh. Chạy lại file này.' }
  if (-not (KiemTraDungDuAn)) {
    $tl = Hoi '  Dự án này CHƯA có mã Thiên Cơ Các (có thể là dự án mới tạo). Gõ C rồi Enter nếu đúng là dự án bạn muốn dùng cho Thiên Cơ Các, Enter để dừng'
    if ($tl -notmatch '^[cC]') { throw 'Đã dừng theo lựa chọn của bạn. Kiểm tra lại Mã tập lệnh rồi chạy lại.' }
  }
  $dich = SaoLuuBanTrenMang

  $trienKhai = ChonTrienKhai
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
