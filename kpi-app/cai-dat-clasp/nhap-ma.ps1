# 23/11: nhập (hoặc đổi) mã truy cập GitHub cho bộ cập nhật web KPI – bấm đúp 4-NHAP-MA-GITHUB.bat.
# Cần khi repo GitHub để RIÊNG TƯ. Mỗi máy tính nhập một lần (cùng một mã dùng được cho nhiều máy).
. (Join-Path $PSScriptRoot 'chung.ps1')
try {
  Bao '=== NHẬP MÃ TRUY CẬP GITHUB ==='
  Write-Host 'Dán mã bắt đầu bằng github_pat_... (chuột phải để dán – chữ sẽ KHÔNG hiện ra, vẫn dán được) rồi bấm Enter:'
  $ss = Read-Host -AsSecureString 'Mã'
  $ma = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($ss)).Trim()
  if ($ma.Length -lt 20) { throw 'Mã quá ngắn – chép lại cả dòng github_pat_... rồi chạy lại.' }
  Bao 'Đang thử tải từ GitHub bằng mã này...'
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $kq = TaiTuGitHub -Ten 'danh-sach-file.txt' -Ma $ma
  if ($kq -notmatch 'Index') { throw 'Tải được nhưng nội dung lạ – kiểm tra mã có quyền đọc đúng repo githubforclaude160695.' }
  New-Item -ItemType Directory -Force -Path $Goc | Out-Null
  ($ma | ConvertTo-SecureString -AsPlainText -Force | ConvertFrom-SecureString) | Set-Content -Path $MaGitHubTep -Encoding ASCII
  Bao '=== XONG ==='
  Tot '  Mã hợp lệ và đã lưu (mã hóa, chỉ máy này đọc được). Từ nay 2-CAP-NHAT.bat dùng như cũ.'
} catch {
  Loi ('Chưa xong: ' + $_.Exception.Message)
}
