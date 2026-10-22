@echo off
chcp 65001 >nul
if not exist "%~dp0khoi-phuc.ps1" (
  echo.
  echo  CHUA GIAI NEN THU MUC!
  echo  Ban dang bam file .bat ngay trong file ZIP nen may khong thay cac file di kem.
  echo  Cach lam: dong cua so nay - chuot phai vao file cai-dat-clasp.zip - chon "Giai nen tat ca" ^(Extract All^)
  echo  - bam Giai nen - mo thu muc cai-dat-clasp vua tao - bam dup lai file 3-KHOI-PHUC.bat
  echo.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0khoi-phuc.ps1"
echo.
pause
