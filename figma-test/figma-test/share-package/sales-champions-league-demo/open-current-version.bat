@echo off
cd /d "%~dp0"
set "NODE_EXE=node"
if exist "C:\Program Files\nodejs\node.exe" set "NODE_EXE=C:\Program Files\nodejs\node.exe"
"%NODE_EXE%" static-server.mjs "%~dp0current-version" 4174
pause
