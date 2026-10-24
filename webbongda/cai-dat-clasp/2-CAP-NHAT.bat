@echo off
chcp 65001 >nul
if not exist "%~dp0cap-nhat.ps1" (
  echo.
  echo  CHUA GIAI NEN THU MUC!
  echo  Ban dang bam file .bat ngay trong file ZIP nen may khong thay cac file di kem.
  echo  Cach lam: dong cua so nay - chuot phai vao file ZIP vua tai - chon "Giai nen tat ca" ^(Extract All^)
  echo  - bam Giai nen - mo thu muc cai-dat-clasp vua tao - bam dup lai file 2-CAP-NHAT.bat
  echo.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0cap-nhat.ps1"
echo.
pause
