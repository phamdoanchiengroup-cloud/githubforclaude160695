# Cập nhật web KPI lên bản mới nhất trên GitHub (bấm đúp 2-CAP-NHAT.bat).
# Thứ tự: sao lưu bản đang chạy -> tải 5 file mới -> đẩy lên Apps Script -> triển khai phiên bản mới (giữ nguyên link).
. (Join-Path $PSScriptRoot 'chung.ps1')

try {
  LamMoiPath
  $ch = DocCauHinh
  Bao ('=== CẬP NHẬT WEB KPI (nhánh ' + $Nhanh + ') ===')

  # 1. Sao lưu (cũng lấy về mọi chỗ ai đó vừa sửa tay trên Apps Script)
  $dich = SaoLuuBanTrenMang

  # 2. Tải file mới về thư mục tạm, kiểm tra đủ rồi mới chép vào
  Bao 'Đang tải bản mới từ GitHub...'
  $tam = Join-Path $Goc 'tai-ve'
  if (Test-Path $tam) { Remove-Item $tam -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $tam | Out-Null
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $ds = @('Code.gs') + ($CacFileHtml | ForEach-Object { $_ + '.html' })
  foreach ($f in $ds) {
    Invoke-WebRequest -UseBasicParsing -Uri ($NguonWeb + $f + '?t=' + (Get-Date -Format 'yyyyMMddHHmmss')) -OutFile (Join-Path $tam $f)
    $kb = [math]::Round((Get-Item (Join-Path $tam $f)).Length / 1KB)
    if ($kb -lt 5) { throw ('File ' + $f + ' tải về quá nhỏ (' + $kb + ' KB) – mạng lỗi? Chạy lại.') }
    Tot ('  ' + $f + '  ' + $kb + ' KB')
  }
  if (-not (Select-String -Path (Join-Path $tam 'Code.gs') -Pattern 'function napDuLieu' -Quiet)) { throw 'Code.gs tải về không đúng – dừng, chưa đổi gì.' }

  # 3. Chép vào thư mục mã. File máy chủ: ghi đè đúng file đang chứa mã web KPI (có thể tên khác "Code", vd. "Mã").
  $gs = Get-ChildItem $ThuMucMa -Filter '*.gs' -File
  $chinh = $gs | Where-Object { Select-String -Path $_.FullName -Pattern 'function napDuLieu' -Quiet } | Select-Object -First 1
  if ($chinh) { Copy-Item (Join-Path $tam 'Code.gs') -Destination $chinh.FullName -Force; Tot ('  Mã máy chủ -> ' + $chinh.Name) }
  else { Copy-Item (Join-Path $tam 'Code.gs') -Destination (Join-Path $ThuMucMa 'Code.gs') -Force; Tot '  Mã máy chủ -> Code.gs (file mới)' }
  foreach ($t in $CacFileHtml) {
    # Xóa file cùng tên khác hoa/thường (vd. "Sodo.html") để tên trên Apps Script đúng "SoDo"
    Get-ChildItem $ThuMucMa -Filter '*.html' -File | Where-Object { $_.BaseName -ieq $t -and $_.BaseName -cne $t } | Remove-Item -Force
    Copy-Item (Join-Path $tam ($t + '.html')) -Destination (Join-Path $ThuMucMa ($t + '.html')) -Force
  }

  # 4. Đẩy lên Apps Script
  Bao 'Đang đẩy lên Apps Script...'
  GoiClasp -ThamSo @('push', '-f') | Out-Host
  Tot '  Đã đẩy xong.'

  # 5. Triển khai phiên bản mới (giữ nguyên link web)
  $moTa = 'Cập nhật ' + (Get-Date -Format 'dd/MM/yyyy HH:mm') + ' bằng clasp'
  if (-not ($ch.tuTrienKhai -and $ch.deployId)) {
    # Lúc cài chưa tự triển khai được (22/10): kiểm tra lại mỗi lần – triển khai tay xong Apps Script thường ghi thêm
    # mục "webapp" vào appsscript.json, khi đó bật tự triển khai luôn. Chỉ bật khi đủ cả 2 điều kiện (an toàn cho link web).
    Bao 'Kiểm tra lại có tự triển khai được không...'
    $idTk = if ($ch.deployId) { $ch.deployId } else { ChonTrienKhai }
    $mf = Get-Content (Join-Path $ThuMucMa 'appsscript.json') -Raw -Encoding UTF8
    if ($idTk -and ($mf -match '"webapp"')) {
      $ch = [pscustomobject]@{ scriptId = $ch.scriptId; deployId = $idTk; tuTrienKhai = $true; ngayCai = $ch.ngayCai }
      GhiCauHinh $ch
      Tot '  Đủ điều kiện – từ nay tự triển khai.'
    } elseif (-not $idTk) {
      Write-Host '  Chưa tự triển khai được: không tìm thấy bản triển khai web nào của dự án (lệnh "clasp deployments").' -ForegroundColor Yellow
    } else {
      Write-Host '  Chưa tự triển khai được: file appsscript.json của dự án chưa có mục "webapp" (tự triển khai lúc này có thể làm web mất quyền truy cập).' -ForegroundColor Yellow
      Write-Host '  Sau khi bạn triển khai tay một lần, lần cập nhật sau máy sẽ tự kiểm tra lại.' -ForegroundColor Yellow
    }
  }
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
