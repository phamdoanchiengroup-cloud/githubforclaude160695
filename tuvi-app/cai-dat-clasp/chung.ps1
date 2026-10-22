# Hàm dùng chung cho 3 file cài đặt / cập nhật / khôi phục Thiên Cơ Các bằng clasp (Windows).
# File này được các file khác nạp vào, không chạy riêng. Dựa trên bộ của web KPI, đổi thư mục, nhánh và cách tải file.
$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$Goc      = Join-Path $env:USERPROFILE 'ThienCoCac-AppsScript' # thư mục làm việc trên máy (riêng, không lẫn với KPI-AppsScript)
$ThuMucMa = Join-Path $Goc 'ma'                                # bản mã đang có trên Apps Script
$SaoLuu   = Join-Path $Goc 'sao-luu'                           # mỗi lần cập nhật sao lưu một bản
$CauHinh  = Join-Path $Goc 'cau-hinh.json'
$Repo     = 'phamdoanchiengroup-cloud/githubforclaude160695'
$Nhanh    = 'claude/happy-brown-lttkz3'
$ThuMucRepo = 'tuvi-app'
$ClaspLenh = if ($IsLinux -or $IsMacOS) { 'clasp' } else { 'clasp.cmd' }   # Windows: gọi thẳng clasp.cmd của npm
$KhongDe   = @('Anh.html')   # đã có trên Apps Script thì giữ nguyên (ảnh của chủ dự án), không thay bằng bản GitHub

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

# Kiểm tra thư mục mã đúng là dự án Thiên Cơ Các (chặn dán nhầm Mã tập lệnh của web KPI)
function KiemTraDungDuAn {
  $gs = Get-ChildItem $ThuMucMa -Filter '*.gs' -File
  if ($gs | Where-Object { Select-String -Path $_.FullName -Pattern 'function napDuLieu' -Quiet }) {
    throw 'Mã tập lệnh này là của WEB KPI, không phải Thiên Cơ Các. Dừng lại, chưa đổi gì. Chạy lại 1-CAI-DAT.bat và dán Mã tập lệnh của dự án Thiên Cơ Các.'
  }
  return [bool]($gs | Where-Object { Select-String -Path $_.FullName -Pattern 'function lapLaSo\b' -Quiet })
}

# Tải toàn bộ file .gs / .html của Thiên Cơ Các ở bản mới nhất trên GitHub về thư mục $dich.
# Lấy danh sách qua GitHub API theo đúng mã commit (không bị bản cũ trong bộ nhớ đệm), kiểm tra đủ dung lượng từng file.
function TaiBanMoi($dich) {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $tieuDe = @{ 'User-Agent' = 'ThienCoCac-clasp'; 'Accept' = 'application/vnd.github+json' }
  $commit = Invoke-RestMethod -UseBasicParsing -Headers $tieuDe -Uri ('https://api.github.com/repos/' + $Repo + '/commits/' + $Nhanh)
  $sha = $commit.sha
  $ds = Invoke-RestMethod -UseBasicParsing -Headers $tieuDe -Uri ('https://api.github.com/repos/' + $Repo + '/contents/' + $ThuMucRepo + '?ref=' + $sha)
  $tep = @($ds | Where-Object { $_.type -eq 'file' -and $_.name -match '\.(gs|html)$' })
  if ($tep.Count -lt 20) { throw ('Danh sách file trên GitHub chỉ có ' + $tep.Count + ' file – bất thường, dừng lại.') }
  if (Test-Path $dich) { Remove-Item $dich -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $dich | Out-Null
  foreach ($f in $tep) {
    $ra = Join-Path $dich $f.name
    Invoke-WebRequest -UseBasicParsing -Uri ('https://raw.githubusercontent.com/' + $Repo + '/' + $sha + '/' + $ThuMucRepo + '/' + $f.name) -OutFile $ra
    $co = (Get-Item $ra).Length
    if ($co -ne [int64]$f.size) { throw ('File ' + $f.name + ' tải về chưa đủ (' + $co + '/' + $f.size + ' byte) – mạng chập chờn? Chạy lại.') }
  }
  # Kiểm tra nhanh trước khi đẩy: đủ hàm chính, 3 mã phiên bản giao diện trùng nhau
  if (-not (Select-String -Path (Join-Path $dich 'Code.gs') -Pattern 'function kiemTraCaiDat' -Quiet)) { throw 'Code.gs tải về không đúng – dừng, chưa đổi gì.' }
  $b1 = [regex]::Match((Get-Content (Join-Path $dich 'Index.html') -Raw -Encoding UTF8), 'name="tcc-ban" content="([^"]+)"').Groups[1].Value
  $b2 = [regex]::Match((Get-Content (Join-Path $dich 'Styles.html') -Raw -Encoding UTF8), '--tcc-ban:\s*"([^"]+)"').Groups[1].Value
  $b3 = [regex]::Match((Get-Content (Join-Path $dich 'Script.html') -Raw -Encoding UTF8), "BAN_GIAO_DIEN = '([^']+)'").Groups[1].Value
  if (-not $b1 -or $b1 -ne $b2 -or $b1 -ne $b3) { throw ('Mã phiên bản giao diện không khớp (Index ' + $b1 + ', Styles ' + $b2 + ', Script ' + $b3 + ') – báo Claude, chưa đổi gì.') }
  return [pscustomobject]@{ Sha = $sha.Substring(0, 7); SoFile = $tep.Count; BanGiaoDien = $b1; Ngay = $commit.commit.committer.date }
}

# Chép bản mới vào thư mục mã: ghi đè file cùng tên, giữ file chỉ có trên Apps Script, giữ Anh.html đang có
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
  Bao 'Dự án có nhiều bản triển khai. Chọn bản đang dùng làm web Thiên Cơ Các:'
  for ($i = 0; $i -lt $ds.Count; $i++) { Write-Host ('  ' + ($i + 1) + ') phiên bản ' + $ds[$i].BanSo + '  ' + $ds[$i].MoTa + '  [' + $ds[$i].Id.Substring(0, 12) + '...]') }
  $so = [int](Hoi 'Gõ số rồi bấm Enter')
  return $ds[$so - 1].Id
}
