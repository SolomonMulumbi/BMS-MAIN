@echo off
setlocal

set "BIBO_DIR=%~dp0"
set "START_FILE=%BIBO_DIR%start-cbc.bat"

if not exist "%START_FILE%" (
    echo ERROR: start-cbc.bat not found.
    pause
    exit /b 1
)

reg add "HKCU\Software\Classes\bibo-cbc" /ve /d "URL:BIBO CBC Bridge" /f
reg add "HKCU\Software\Classes\bibo-cbc" /v "URL Protocol" /d "" /f
reg add "HKCU\Software\Classes\bibo-cbc\shell\open\command" /ve /d "\"%START_FILE%\"" /f

echo.
echo BIBO CBC launcher installed successfully.
echo.
pause