@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build-windows.ps1"
if errorlevel 1 (
  echo Build failed. See the error above.
  exit /b 1
)
echo Ready: release\Compresso.exe
