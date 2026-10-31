# Hàm dùng chung cho 3 file cài đặt / cập nhật / khôi phục web KPI bằng clasp (Windows).
# File này được các file khác nạp vào, không chạy riêng.
$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Goc      = Join-Path $env:USERPROFILE 'KPI-AppsScript'      # thư mục làm việc trên máy
$ThuMucMa = Join-Path $Goc 'ma'                               # bản mã đang có trên Apps Script (clasp clone)
$SaoLuu   = Join-Path $Goc 'sao-luu'                          # mỗi lần cập nhật sao lưu một bản
$CauHinh  = Join-Path $Goc 'cau-hinh.json'
$Nhanh    = 'claude/beautiful-ptolemy-f2j7za'
$NguonWeb = 'https://raw.githubusercontent.com/phamdoanchiengroup-cloud/githubforclaude160695/' + $Nhanh + '/kpi-app/'
$ClaspLenh = if ($IsLinux -or $IsMacOS) { 'clasp' } else { 'clasp.cmd' }   # Windows: gọi thẳng clasp.cmd của npm
$CacFileHtml = @('Index', 'SoDo', 'HoatAnh', 'AmThanh', 'QuyTrinh')   # dự phòng – lúc cập nhật đọc danh sách mới từ kpi-app/danh-sach-file.txt trên GitHub (31/10)

function Bao($chu)  { Write-Host ''; Write-Host $chu -ForegroundColor Cyan }
function Tot($chu)  { Write-Host $chu -ForegroundColor Green }
function Loi($chu)  { Write-Host ''; Write-Host $chu -ForegroundColor Red }
function Hoi($chu)  { Write-Host ''; return (Read-Host $chu).Trim() }

function LamMoiPath {
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User') +
    ';' + (Join-Path $env:APPDATA 'npm')
}
function CoLenh($ten) { return [bool](Get-Command $ten -ErrorAction SilentlyContinue) }

# Chạy clasp trong thư mục mã, trả về chữ in ra; lỗi thì dừng kèm thông báo dễ hiểu
function GoiClasp {
  param([string[]]$ThamSo, [switch]$KhongDung)
  Push-Location $ThuMucMa
  $truoc = $ErrorActionPreference; $ErrorActionPreference = 'Continue'   # PowerShell 5 coi chữ in ra stderr là lỗi -> tạm tắt
  try {
    # clasp in tiến trình ("Deploying project…") ra stderr; PowerShell 5 hiện thành chữ đỏ NativeCommandError dù không lỗi (22/10)
    # -> đổi mỗi dòng về chữ thường; lỗi thật vẫn nhận ra qua mã thoát $LASTEXITCODE bên dưới
    $kq = & $ClaspLenh @ThamSo 2>&1 | ForEach-Object { if ($_ -is [System.Management.Automation.ErrorRecord]) { $_.Exception.Message } else { "$_" } } | Out-String
    $ma = $LASTEXITCODE
  } finally { $ErrorActionPreference = $truoc; Pop-Location }
  if ($ma -ne 0 -and -not $KhongDung) {
    if ($kq -match 'Apps Script API') {
      Loi 'Chưa bật "Google Apps Script API". Mở https://script.google.com/home/usersettings , gạt nút sang BẬT, rồi chạy lại.'
    } elseif ($kq -match 'login|credentials|invalid_grant') {
      Loi 'Phiên đăng nhập Google của clasp đã hết. Chạy lại file 1-CAI-DAT.bat.'
    }
    throw ('clasp ' + ($ThamSo -join ' ') + " báo lỗi:`n" + $kq)
  }
  return $kq
}

function DocCauHinh {
  if (-not (Test-Path $CauHinh)) { throw 'Chưa cài đặt. Chạy file 1-CAI-DAT.bat trước.' }
  return Get-Content $CauHinh -Raw -Encoding UTF8 | ConvertFrom-Json
}
function GhiCauHinh($o) {
  $o | ConvertTo-Json | Set-Content -Path $CauHinh -Encoding UTF8
}

# Sao lưu bản đang chạy trên Apps Script (lấy mới về rồi chép sang sao-luu\ngày-giờ)
function SaoLuuBanTrenMang {
  Bao 'Đang sao lưu bản đang chạy trên Apps Script...'
  GoiClasp -ThamSo @('pull') | Out-Null
  $dich = Join-Path $SaoLuu (Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')
  New-Item -ItemType Directory -Force -Path $dich | Out-Null
  Get-ChildItem $ThuMucMa -File | Where-Object { $_.Name -ne '.clasp.json' } | Copy-Item -Destination $dich
  Copy-Item (Join-Path $ThuMucMa '.clasp.json') -Destination $dich
  Tot ('  Đã sao lưu vào: ' + $dich)
  return $dich
}

# Tìm mã triển khai web app (không phải @HEAD) để cập nhật đúng đường link đang dùng
function ChonTrienKhai {
  $kq = GoiClasp -ThamSo @('deployments')
  $ds = @()
  foreach ($dong in ($kq -split "`r?`n")) {
    if ($dong -match '^\s*-\s*(AKfy[\w-]+)\s+@(\d+)\s*-?\s*(.*)$') { $ds += [pscustomobject]@{ Id = $Matches[1]; BanSo = $Matches[2]; MoTa = $Matches[3] } }
  }
  if ($ds.Count -eq 0) { return '' }
  if ($ds.Count -eq 1) { return $ds[0].Id }
  Bao 'Dự án có nhiều bản triển khai. Chọn bản có ĐƯỜNG LINK công ty đang dùng (so phần AKfy… trong link web với cột bên phải):'
  for ($i = 0; $i -lt $ds.Count; $i++) { Write-Host ('  ' + ($i + 1) + ') link …/s/' + $ds[$i].Id.Substring(0, 14) + '…   (phiên bản ' + $ds[$i].BanSo + ($(if ($ds[$i].MoTa) { ' · ' + $ds[$i].MoTa } else { '' })) + ')') }
  # 22/10: chủ dự án gõ số PHIÊN BẢN (227) thay vì số thứ tự -> trước đây ra rỗng. Nay nhận số thứ tự, số phiên bản hoặc vài ký tự đầu của mã; sai thì hỏi lại.
  while ($true) {
    $go = Hoi ('Gõ số thứ tự (1-' + $ds.Count + ') rồi bấm Enter')
    $chon = $null
    if ($go -match '^\d+$' -and [int]$go -ge 1 -and [int]$go -le $ds.Count) { $chon = $ds[[int]$go - 1] }
    elseif ($go -match '^\d+$') { $chon = $ds | Where-Object { $_.BanSo -eq $go } | Select-Object -First 1 }
    elseif ($go.Length -ge 6) { $chon = $ds | Where-Object { $_.Id.StartsWith($go) -or $_.Id.StartsWith('AKfy' + $go) } | Select-Object -First 1 }
    if ($chon) { Tot ('  Đã chọn link …/s/' + $chon.Id.Substring(0, 14) + '…'); return $chon.Id }
    Write-Host '  Chưa đúng – gõ số thứ tự ở đầu dòng (1, 2, 3…).' -ForegroundColor Yellow
  }
}
