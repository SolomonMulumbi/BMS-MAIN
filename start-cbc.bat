@echo off
title BIBO BC-2800 Bridge

echo BIBO folder:
echo %~dp0
echo.

cd /d "%~dp0"

echo Looking for test-cbc.js...

if not exist "%~dp0test-cbc.js" (
    echo.
    echo ERROR: test-cbc.js was not found.
    echo Expected:
    echo %~dp0test-cbc.js
    echo.
    pause
    exit /b
)

echo Found test-cbc.js
echo.
echo Starting BIBO BC-2800 Bridge...
echo.

node "%~dp0test-cbc.js"

echo.
echo Bridge stopped.
pause