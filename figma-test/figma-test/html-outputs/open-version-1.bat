@echo off
cd /d "%~dp0"
node static-server.mjs "%~dp0version-1" 4175
pause
