@echo off
setlocal
cd /d "%~dp0"
echo Starting Material Studio Golden Wall Composer...
echo The launcher will select another local port automatically if 8080 is occupied.
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 server.py
) else (
  python server.py
)
echo.
echo The local server has stopped.
pause
