# Hàm dùng chung cho 3 file cài đặt / cập nhật / khôi phục WEB BÓNG ĐÁ (Giải Bóng Đá Rhino Billiards) bằng clasp (Windows).
# File này được các file khác nạp vào, không chạy riêng. Dựa trên bộ của Thiên Cơ Các và web KPI, đổi thư mục, nhánh và cách kiểm tra.
$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Goc      = Join-Path $env:USERPROFILE 'WebBongDa-AppsScript'  # thư mục làm việc trên máy (riêng, không lẫn với KPI / Thiên Cơ Các)
$ThuMucMa = Join-Path $Goc 'ma'                                # bản mã đang có trên Apps Script
$SaoLuu   = Join-Path $Goc 'sao-luu'                           # mỗi lần cập nhật sao lưu một bản
$CauHinh  = Join-Path $Goc 'cau-hinh.json'
$Repo     = 'phamdoanchiengroup-cloud/githubforclaude160695'
$Nhanh    = 'claude/happy-brown-lttkz3'
$ThuMucRepo = 'webbongda'
$ClaspLenh = if ($IsLinux -or $IsMacOS) { 'clasp' } else { 'clasp.cmd' }   # Windows: gọi thẳng clasp.cmd của npm
$KhongDe   = @()             # web bóng đá: mọi file trên GitHub đều thay; file chỉ có trên Apps Script vẫn được giữ

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
      Loi 'Phiên đăng nhập Google của clasp đã hết hoặc đang đăng nhập tài khoản khác. Chạy lại file 1-CAI-DAT.bat.'
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

# Kiểm tra thư mục mã đúng là dự án web bóng đá (chặn dán nhầm Mã tập lệnh của web KPI hoặc Thiên Cơ Các)
function KiemTraDungDuAn {
  $gs = Get-ChildItem $ThuMucMa -Filter '*.gs' -File
  if ($gs | Where-Object { Select-String -Path $_.FullName -Pattern 'function CAI_TRIGGER_CHOT_THANG' -Quiet }) {
    throw 'Mã tập lệnh này là của WEB KPI, không phải web bóng đá. Dừng lại, chưa đổi gì. Chạy lại 1-CAI-DAT.bat và dán Mã tập lệnh của dự án web bóng đá.'
  }
  if ($gs | Where-Object { Select-String -Path $_.FullName -Pattern 'function lapLaSo\b' -Quiet }) {
    throw 'Mã tập lệnh này là của THIÊN CƠ CÁC, không phải web bóng đá. Dừng lại, chưa đổi gì. Chạy lại 1-CAI-DAT.bat và dán Mã tập lệnh của dự án web bóng đá.'
  }
  return [bool]($gs | Where-Object { Select-String -Path $_.FullName -Pattern 'function KHOI_TAO_GIAI' -Quiet })
}

# Tải toàn bộ file .gs / .html của web bóng đá ở bản mới nhất trên GitHub về thư mục $dich, kiểm tra đủ dung lượng từng file.
# Cách 1: GitHub API (api.github.com) lấy đúng mã commit mới nhất. Cách 2 (máy không vào được api.github.com):
# chỉ dùng raw.githubusercontent.com với danh sách cai-dat-clasp/ds-file.txt (tên file + dung lượng).
function TaiTep($url, $ra) {
  $lan = 0
  while ($true) {
    try { Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $ra; return }
    catch { $lan++; if ($lan -ge 3) { throw }; Start-Sleep -Seconds (2 * $lan) }
  }
}
function LoiMang($e) {
  $m = [string]$e.Exception.Message
  if ($m -match 'could not be resolved|không thể phân giải|No such host|Unable to connect|timed out|actively refused|proxy|502|503') {
    return 'Máy không kết nối được tới GitHub (' + $m + '). Kiểm tra mạng: mở thử https://github.com trên trình duyệt; tắt VPN / phần mềm chặn web nếu có; hoặc thử mạng khác (phát Wi-Fi từ điện thoại) rồi chạy lại.'
  }
  return $m
}
function TaiBanMoi($dich) {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  if (Test-Path $dich) { Remove-Item $dich -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $dich | Out-Null
  $tep = @(); $goc = ''; $ma = ''
  try {
    $tieuDe = @{ 'User-Agent' = 'WebBongDa-clasp'; 'Accept' = 'application/vnd.github+json' }
    $commit = Invoke-RestMethod -UseBasicParsing -Headers $tieuDe -Uri ('https://api.github.com/repos/' + $Repo + '/commits/' + $Nhanh)
    $ds = Invoke-RestMethod -UseBasicParsing -Headers $tieuDe -Uri ('https://api.github.com/repos/' + $Repo + '/contents/' + $ThuMucRepo + '?ref=' + $commit.sha)
    $tep = @($ds | Where-Object { $_.type -eq 'file' -and $_.name -match '\.(gs|html)$' } | ForEach-Object { [pscustomobject]@{ Ten = $_.name; Co = [int64]$_.size } })
    $goc = 'https://raw.githubusercontent.com/' + $Repo + '/' + $commit.sha + '/' + $ThuMucRepo + '/'
    $ma = $commit.sha.Substring(0, 7)
  } catch {
    Write-Host '  Không vào được api.github.com – chuyển sang tải trực tiếp (raw.githubusercontent.com).' -ForegroundColor Yellow
    $goc = 'https://raw.githubusercontent.com/' + $Repo + '/' + $Nhanh + '/' + $ThuMucRepo + '/'
    $dsTxt = Join-Path $dich 'ds-file.txt'
    try { TaiTep ($goc + 'cai-dat-clasp/ds-file.txt?t=' + (Get-Date -Format 'yyyyMMddHHmmss')) $dsTxt } catch { throw (LoiMang $_) }
    $tep = @(Get-Content $dsTxt -Encoding UTF8 | Where-Object { $_ -match '\t' } | ForEach-Object { $c = $_ -split "`t"; [pscustomobject]@{ Ten = $c[0].Trim(); Co = [int64]$c[1] } })
    Remove-Item $dsTxt -Force
    $ma = 'nhánh mới nhất'
  }
  if (-not ($tep | Where-Object { $_.Ten -ceq 'Code.gs' }) -or -not ($tep | Where-Object { $_.Ten -ceq 'Index.html' })) { throw ('Trên GitHub thiếu Code.gs hoặc Index.html (thấy ' + $tep.Count + ' file) – bất thường, dừng lại.') }
  foreach ($f in $tep) {
    $ra = Join-Path $dich $f.Ten
    try { TaiTep ($goc + $f.Ten + '?t=' + (Get-Date -Format 'yyyyMMddHHmmss')) $ra } catch { throw (LoiMang $_) }
    $co = (Get-Item $ra).Length
    if ($co -ne $f.Co) { throw ('File ' + $f.Ten + ' tải về chưa khớp (' + $co + '/' + $f.Co + ' byte). Nếu Claude vừa đẩy bản mới, chờ 5 phút cho GitHub cập nhật rồi chạy lại.') }
  }
  # Kiểm tra nhanh trước khi đẩy: Code.gs có các hàm chính, doGet mở đúng file Index, Index.html đủ đến thẻ đóng
  $code = Get-Content (Join-Path $dich 'Code.gs') -Raw -Encoding UTF8
  foreach ($h in @('function doGet', 'function napDuLieu', 'function KHOI_TAO_GIAI')) {
    if ($code -notmatch [regex]::Escape($h)) { throw ('Code.gs tải về thiếu "' + $h + '" – dừng, chưa đổi gì.') }
  }
  if ($code -notmatch "createTemplateFromFile\('Index'\)") { throw 'Code.gs không còn mở file Index – báo Claude, chưa đổi gì.' }
  $html = Get-Content (Join-Path $dich 'Index.html') -Raw -Encoding UTF8
  if ($html -notmatch '</html>\s*$') { throw 'Index.html tải về bị thiếu đoạn cuối – dừng, chưa đổi gì. Chờ 5 phút rồi chạy lại.' }
  return [pscustomobject]@{ Sha = $ma; SoFile = $tep.Count; BanGiaoDien = '-' }
}

# Chép bản mới vào thư mục mã: ghi đè file cùng tên, giữ file chỉ có trên Apps Script
function ChepVaoThuMucMa($tu) {
  $giu = @()
  foreach ($f in Get-ChildItem $tu -File) {
    $dich = Join-Path $ThuMucMa $f.Name
    if ($KhongDe -contains $f.Name -and (Test-Path $dich)) { $giu += $f.Name; continue }
    # Xóa file cùng tên khác hoa/thường (vd. "script.html") để tên trên Apps Script đúng như GitHub
    Get-ChildItem $ThuMucMa -File | Where-Object { $_.Name -ieq $f.Name -and $_.Name -cne $f.Name } | Remove-Item -Force
    Copy-Item $f.FullName -Destination $dich -Force
  }
  return $giu
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
  Bao 'Dự án có nhiều bản triển khai. Chọn bản đang dùng làm web bóng đá:'
  for ($i = 0; $i -lt $ds.Count; $i++) { Write-Host ('  ' + ($i + 1) + ') phiên bản ' + $ds[$i].BanSo + '  ' + $ds[$i].MoTa + '  [' + $ds[$i].Id.Substring(0, 12) + '...]') }
  $so = [int](Hoi 'Gõ số rồi bấm Enter')
  return $ds[$so - 1].Id
}
