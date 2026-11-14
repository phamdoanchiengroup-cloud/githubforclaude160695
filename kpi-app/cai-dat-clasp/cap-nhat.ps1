# Cập nhật web KPI lên bản mới nhất trên GitHub (bấm đúp 2-CAP-NHAT.bat).
# Thứ tự: sao lưu bản đang chạy -> tải các file mới (Code.gs + danh sách HTML trong danh-sach-file.txt) -> đẩy lên Apps Script -> triển khai phiên bản mới (giữ nguyên link).
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
  # Danh sách file HTML lấy từ GitHub (31/10): web thêm file mới thì không phải gửi lại bộ cài. Lỗi thì dùng danh sách sẵn trong chung.ps1.
  try {
    $dsMoi = (Invoke-WebRequest -UseBasicParsing -Uri ($NguonWeb + 'danh-sach-file.txt?t=' + (Get-Date -Format 'yyyyMMddHHmmss'))).Content -split "`r?`n" |
      ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^[A-Za-z][A-Za-z0-9]{1,40}$' }
    if ($dsMoi -and ($dsMoi -contains 'Index')) { $CacFileHtml = @($dsMoi) }
  } catch { Write-Host '  (Không đọc được danh sách file mới – dùng danh sách có sẵn.)' -ForegroundColor Yellow }
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

  # 3b. (08/11) Bật dịch vụ Google Sheets API trong appsscript.json: máy chủ đọc gộp ~20 trang tính trong 1 lượt -> đăng nhập nhanh hơn.
  #     Máy chủ tự kiểm tra đọc 2 cách có khớp không rồi mới dùng (lịch giữ nóng). Lỗi gì cũng giữ nguyên file cũ.
  $mfTep = Join-Path $ThuMucMa 'appsscript.json'
  $mfCu = [IO.File]::ReadAllText($mfTep)
  if ($mfCu -notmatch '"serviceId"\s*:\s*"sheets"') {
    try {
      $mfObj = $mfCu | ConvertFrom-Json
      if (-not $mfObj.dependencies) { $mfObj | Add-Member -NotePropertyName dependencies -NotePropertyValue ([pscustomobject]@{}) -Force }
      $dv = @()
      if ($mfObj.dependencies.enabledAdvancedServices) { $dv = @($mfObj.dependencies.enabledAdvancedServices) }
      $dv += [pscustomobject]@{ userSymbol = 'Sheets'; serviceId = 'sheets'; version = 'v4' }
      $mfObj.dependencies | Add-Member -NotePropertyName enabledAdvancedServices -NotePropertyValue $dv -Force
      $mfMoi = $mfObj | ConvertTo-Json -Depth 20
      $kt = $mfMoi | ConvertFrom-Json
      if (-not (@($kt.dependencies.enabledAdvancedServices) | Where-Object { $_.serviceId -eq 'sheets' })) { throw 'kiểm tra lại không thấy Sheets' }
      [IO.File]::WriteAllText($mfTep, $mfMoi, (New-Object Text.UTF8Encoding $false))
      Tot '  Đã bật dịch vụ Google Sheets API (đăng nhập, tải dữ liệu nhanh hơn).'
    } catch {
      [IO.File]::WriteAllText($mfTep, $mfCu, (New-Object Text.UTF8Encoding $false))
      Write-Host ('  Chưa bật được Sheets API (giữ nguyên cấu hình cũ): ' + $_.Exception.Message) -ForegroundColor Yellow
    }
  }

  # 3c. (14/11) Gỡ file LẠ là mã trình duyệt bị đặt nhầm thành file máy chủ (.gs/.js có window./document.) – Apps Script chạy mọi file
  #     máy chủ khi gọi bất kỳ hàm nào nên cả web báo lỗi "window is not defined" (vd. file "_qt_check"). File đã nằm trong bản sao lưu.
  $giu = if ($chinh) { $chinh.FullName } else { Join-Path $ThuMucMa 'Code.gs' }
  $la = Get-ChildItem $ThuMucMa -File | Where-Object { ($_.Extension -eq '.gs' -or $_.Extension -eq '.js') -and $_.FullName -ne $giu -and (Select-String -Path $_.FullName -Pattern '(^|[^\w.])(window|document)\.' -Quiet) }
  foreach ($x in $la) {
    Remove-Item $x.FullName -Force
    Write-Host ('  Đã gỡ file lạ "' + $x.BaseName + '" (mã trình duyệt đặt nhầm làm file máy chủ – gây lỗi "window is not defined"). Bản cũ còn trong sao lưu.') -ForegroundColor Yellow
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
      Write-Host '  CẢNH BÁO: dự án clasp đang nối CHƯA có bản triển khai web nào – có thể đang nối nhầm BẢN SAO, không phải dự án chạy web công ty.' -ForegroundColor Red
      Write-Host '  Đừng bấm "Triển khai mới" (sẽ ra đường link khác). Chạy lại 1-CAI-DAT.bat với Mã tập lệnh của dự án có link web công nhân đang dùng.' -ForegroundColor Yellow
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
