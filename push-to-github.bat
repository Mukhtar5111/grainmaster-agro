@echo off
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo GrainMaster Agro Solutions - Pushing to GitHub Pages...
echo ========================================================
git branch -M main
git push -u origin main
echo.
echo Process complete. Press any key to exit.
pause
