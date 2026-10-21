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
$CacFileHtml = @('Index', 'SoDo', 'HoatAnh', 'AmThanh')       # tên phải đúng từng chữ hoa / thường

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
    $kq = & $ClaspLenh @ThamSo 2>&1 | Out-String
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
  Bao 'Dự án có nhiều bản triển khai. Chọn bản đang dùng làm web cho công ty:'
  for ($i = 0; $i -lt $ds.Count; $i++) { Write-Host ('  ' + ($i + 1) + ') phiên bản ' + $ds[$i].BanSo + '  ' + $ds[$i].MoTa + '  [' + $ds[$i].Id.Substring(0, 12) + '...]') }
  $so = [int](Hoi 'Gõ số rồi bấm Enter')
  return $ds[$so - 1].Id
}
