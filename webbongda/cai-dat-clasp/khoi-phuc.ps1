# Quay web bóng đá về một bản đã sao lưu (bấm đúp 3-KHOI-PHUC.bat).
. (Join-Path $PSScriptRoot 'chung.ps1')

try {
  LamMoiPath
  $ch = DocCauHinh
  $ds = @(Get-ChildItem $SaoLuu -Directory | Sort-Object Name -Descending | Select-Object -First 10)
  if (-not $ds.Count) { throw 'Chưa có bản sao lưu nào.' }
  Bao 'Các bản sao lưu gần nhất (1 = mới nhất):'
  for ($i = 0; $i -lt $ds.Count; $i++) { Write-Host ('  ' + ($i + 1) + ') ' + $ds[$i].Name) }
  Write-Host '  Lưu ý: mỗi lần chạy 2-CAP-NHAT.bat đều sao lưu bản ĐANG CHẠY trước khi thay. Muốn bỏ bản vừa cập nhật thì chọn 1.'
  $so = [int](Hoi 'Gõ số bản muốn quay về rồi bấm Enter')
  $chon = $ds[$so - 1]
  if (-not $chon) { throw 'Số không hợp lệ.' }

  # Sao lưu cả bản hiện tại trước khi quay về (để còn đường quay lại)
  SaoLuuBanTrenMang | Out-Null
  Get-ChildItem $ThuMucMa -File | Where-Object { $_.Name -ne '.clasp.json' } | Remove-Item -Force
  Get-ChildItem $chon.FullName -File | Where-Object { $_.Name -ne '.clasp.json' } | Copy-Item -Destination $ThuMucMa
  Bao ('Đang đẩy bản ' + $chon.Name + ' lên Apps Script...')
  GoiClasp -ThamSo @('push', '-f') | Out-Host
  if ($ch.tuTrienKhai -and $ch.deployId) {
    GoiClasp -ThamSo @('deploy', '--deploymentId', $ch.deployId, '--description', ('Khôi phục bản ' + $chon.Name)) | Out-Host
    Tot '=== ĐÃ QUAY VỀ BẢN CŨ. Mở web, bấm Ctrl+F5. ==='
  } else {
    Write-Host '=== ĐÃ DÁN BẢN CŨ. Vào Apps Script: Triển khai -> Quản lý triển khai -> ✏️ -> Phiên bản mới -> Triển khai. ===' -ForegroundColor Yellow
  }
} catch {
  Loi ('Chưa xong: ' + $_.Exception.Message)
  Write-Host 'Chụp màn hình gửi Claude.'
}
