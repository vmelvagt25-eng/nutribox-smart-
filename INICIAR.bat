@echo off
title NutriBox - Servidor Local
color 0A
echo.
echo  Iniciando NutriBox en http://192.167.1.39:8080/
echo  Abre tu celular y navega a esa direccion
echo.

:: Ejecutar PowerShell con permisos para abrir puertos de red
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0iniciar-servidor.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [ERROR] No se pudo iniciar. Intentando con permisos de administrador...
    pause
    powershell -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -NoProfile -File ""%~dp0iniciar-servidor.ps1""' -Verb RunAs"
)

pause
