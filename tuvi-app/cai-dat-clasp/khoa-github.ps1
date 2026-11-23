# Nhập / thay khóa truy cập GitHub (bấm đúp 4-KHOA-GITHUB.bat) – dùng khi repo Thiên Cơ Các để RIÊNG TƯ.
# Khóa chỉ lưu trên máy này: %USERPROFILE%\ThienCoCac-AppsScript\khoa-github.txt. Không gửi khóa cho ai, kể cả Claude.
. (Join-Path $PSScriptRoot 'chung.ps1')
try {
  Bao '=== KHÓA TRUY CẬP GITHUB CHO THIÊN CƠ CÁC ==='
  Write-Host 'Dán khóa (bắt đầu bằng github_pat_ ...) rồi bấm Enter. Khi dán, màn hình chỉ hiện dấu * thay cho chữ – bình thường.'
  $an = Read-Host 'Khóa' -AsSecureString
  $k = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($an)) -replace '\s', ''
  if (-not $k) { throw 'Chưa dán khóa – không đổi gì.' }
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $h = @{ 'User-Agent' = 'ThienCoCac-clasp'; 'Accept' = 'application/vnd.github+json'; 'Authorization' = 'Bearer ' + $k }
  try { $c = Invoke-RestMethod -UseBasicParsing -Headers $h -Uri ('https://api.github.com/repos/' + $Repo + '/commits/' + $Nhanh) }
  catch { throw ('Khóa chưa dùng được (' + $_.Exception.Message + '). Kiểm tra: khóa còn hạn, chọn đúng repo githubforclaude160695, quyền Contents = Read-only.') }
  New-Item -ItemType Directory -Force -Path $Goc | Out-Null
  Set-Content -Path $TepKhoa -Value $k -Encoding UTF8 -NoNewline
  Tot ('KHÓA DÙNG ĐƯỢC – đã lưu. Bản mới nhất trên GitHub: ' + $c.sha.Substring(0, 7) + '. Từ giờ bấm 2-CAP-NHAT.bat như bình thường.')
} catch { Loi ('Chưa xong: ' + $_.Exception.Message) }
