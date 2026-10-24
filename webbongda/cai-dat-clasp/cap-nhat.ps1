# Cập nhật web bóng đá lên bản mới nhất trên GitHub (bấm đúp 2-CAP-NHAT.bat).
# Thứ tự: sao lưu bản đang chạy -> tải toàn bộ file mới, kiểm tra -> chép vào -> đẩy lên Apps Script -> triển khai phiên bản mới (giữ nguyên link).
. (Join-Path $PSScriptRoot 'chung.ps1')

try {
  LamMoiPath
  $ch = DocCauHinh
  Bao ('=== CẬP NHẬT THIÊN CƠ CÁC (nhánh ' + $Nhanh + ') ===')

  # 1. Sao lưu (cũng lấy về mọi chỗ ai đó vừa sửa tay trên Apps Script)
  $dich = SaoLuuBanTrenMang
  if (-not (KiemTraDungDuAn)) { throw 'Dự án trên Apps Script không còn mã web bóng đá (hoặc nối nhầm dự án). Dừng lại, chưa đổi gì. Chạy lại 1-CAI-DAT.bat.' }

  # 2. Tải bản mới về thư mục tạm, kiểm tra đủ rồi mới chép vào
  Bao 'Đang tải bản mới từ GitHub...'
  $tam = Join-Path $Goc 'tai-ve'
  $ban = TaiBanMoi $tam
  Tot ('  Đã tải ' + $ban.SoFile + ' file · bản ' + $ban.Sha)

  # 3. Chép vào thư mục mã (giữ file chỉ có trên Apps Script)
  $giu = ChepVaoThuMucMa $tam
  if ($giu.Count) { Tot ('  Giữ nguyên trên Apps Script: ' + ($giu -join ', ')) }

  # 4. Đẩy lên Apps Script
  Bao 'Đang đẩy lên Apps Script...'
  GoiClasp -ThamSo @('push', '-f') | Out-Host
  Tot '  Đã đẩy xong.'

  # 5. Triển khai phiên bản mới (giữ nguyên link web)
  $moTa = 'Cập nhật ' + (Get-Date -Format 'dd/MM/yyyy HH:mm') + ' · ' + $ban.Sha + ' bằng clasp'
  if ($ch.tuTrienKhai -and $ch.deployId) {
    Bao 'Đang triển khai phiên bản mới...'
    GoiClasp -ThamSo @('deploy', '--deploymentId', $ch.deployId, '--description', $moTa) | Out-Host
    Bao '=== XONG ==='
    Tot '  Web đã chạy bản mới. Mở web, bấm Ctrl+F5 để tải lại.'
  } else {
    Bao '=== ĐÃ DÁN XONG – CÒN 1 BƯỚC ==='
    Write-Host '  Vào Apps Script: Triển khai -> Quản lý triển khai -> ✏️ -> Phiên bản mới -> Triển khai. Rồi mở web, bấm Ctrl+F5.' -ForegroundColor Yellow
  }
  Write-Host ('  Nếu bản mới có vấn đề: bấm đúp 3-KHOI-PHUC.bat để quay về bản vừa sao lưu (' + (Split-Path $dich -Leaf) + ').')
} catch {
  Loi ('Chưa xong: ' + $_.Exception.Message)
  Write-Host 'Web vẫn chạy bản cũ nếu lỗi xảy ra trước bước "Đang đẩy lên Apps Script". Chụp màn hình gửi Claude.'
}
