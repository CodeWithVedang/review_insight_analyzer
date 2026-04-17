@echo off
REM ============================================================================
REM  Port Cleanup Script - Fixes port conflicts
REM  Run this if you get port already in use errors
REM ============================================================================

color 0A

echo.
echo ============================================================================
echo                     PORT CLEANUP & TROUBLESHOOTING
echo ============================================================================
echo.

echo Checking for stuck processes...
echo.

REM Kill Python processes (backend)
echo Killing any stuck Python processes...
taskkill /F /IM python.exe >nul 2>&1
if errorlevel 1 (
    echo [OK] No Python processes to kill
) else (
    echo [DONE] Python processes killed
)

REM Kill Node processes (frontend)
echo Killing any stuck Node processes...
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
    echo [OK] No Node processes to kill
) else (
    echo [DONE] Node processes killed
)

echo.
echo ============================================================================
echo                      CHECKING PORT STATUS
echo ============================================================================
echo.

echo Port 8001 status:
netstat -ano | findstr ":8001" >nul 2>&1
if errorlevel 1 (
    echo [FREE] Port 8001 is available
) else (
    echo [IN USE] Port 8001 is in use
)

echo.
echo Port 5173 status:
netstat -ano | findstr ":5173" >nul 2>&1
if errorlevel 1 (
    echo [FREE] Port 5173 is available
) else (
    echo [IN USE] Port 5173 is in use
)

echo.
echo Port 8002 status:
netstat -ano | findstr ":8002" >nul 2>&1
if errorlevel 1 (
    echo [FREE] Port 8002 is available
) else (
    echo [IN USE] Port 8002 is in use
)

echo.
echo ============================================================================
echo                           SOLUTIONS
echo ============================================================================
echo.
echo If you still have port conflicts:
echo.
echo OPTION 1: Wait 30 seconds for ports to fully release, then run launcher
echo OPTION 2: Restart your computer (nuclear option - always works)
echo.
echo If frontend can't connect to backend:
echo.
echo 1. Check that BOTH terminal windows are still open
echo    (Backend terminal and Frontend terminal)
echo.
echo 2. If backend shows error: Port may be 8002 instead of 8001
echo    The launcher handles this automatically
echo.
echo 3. Check the backend terminal for error messages
echo.
echo 4. Check the frontend terminal for connection errors
echo.
echo ============================================================================
echo.

pause
exit /b 0
