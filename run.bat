@echo off
chcp 65001 >nul
echo ========================================================
echo  Запуск Compresso
echo ========================================================

if exist "%~dp0release\compresso.exe" (
    echo Запуск Compresso...
    cd /d "%~dp0release"
    start "" compresso.exe
    exit /b 0
)

if exist "%~dp0src-tauri\target\release\compresso.exe" (
    echo Запуск Release сборки...
    cd /d "%~dp0src-tauri\target\release"
    start "" compresso.exe
    exit /b 0
)

if exist "%~dp0src-tauri\target\debug\compresso.exe" (
    echo Запуск Debug сборки...
    cd /d "%~dp0src-tauri\target\debug"
    start "" compresso.exe
    exit /b 0
)

echo Исполняемый файл не найден. Сначала запустите build.bat для сборки!
pause
