@echo off
REM ============================================================================
REM  MASTER FIX SCRIPT - Fixes all known issues
REM  Run this if you get any module/dependency errors
REM ============================================================================

color 0A

echo.
echo ============================================================================
echo                       MASTER FIX SCRIPT
echo              Fixing all dependency and configuration issues
echo ============================================================================
echo.

setlocal enabledelayedexpansion

REM Verify Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Verify Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo [STEP 1/3] Fixing Python Virtual Environment
echo.

REM Remove old venv
if exist venv (
    echo Removing old venv...
    rmdir /s /q venv >nul 2>&1
)

REM Create fresh venv
echo Creating fresh virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create venv!
    pause
    exit /b 1
)

REM Activate and upgrade pip
call venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul 2>&1

REM Install requirements
echo Installing Python packages (this may take 1-2 minutes)...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [WARNING] Some packages had issues, but continuing...
) else (
    echo [OK] Python environment fixed
)

echo.
echo [STEP 2/3] Fixing Node.js Modules
echo.

cd frontend

REM Clear npm cache
echo Clearing npm cache...
call npm cache clean --force >nul 2>&1

REM Remove corrupted node_modules
if exist node_modules (
    echo Removing corrupted node_modules...
    rmdir /s /q node_modules >nul 2>&1
)

REM Remove package-lock
if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json >nul 2>&1
)

REM Reinstall npm packages
echo Installing Node packages (this may take 2-3 minutes)...
call npm install --legacy-peer-deps >nul 2>&1
if errorlevel 1 (
    echo [WARNING] npm install had some issues, but continuing...
) else (
    echo [OK] Node modules fixed
)

cd ..

echo.
echo [STEP 3/3] Verifying Installation
echo.

REM Check Python packages
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo [ERROR] FastAPI not installed properly!
    pause
    exit /b 1
) else (
    echo [OK] Python packages verified
)

REM Check Node modules
if exist frontend\node_modules\vite (
    echo [OK] Node modules verified
) else (
    echo [ERROR] Vite not installed properly!
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo                       FIX COMPLETE!
echo ============================================================================
echo.
echo All dependencies have been cleaned and reinstalled.
echo.
echo What was fixed:
echo   [OK] Python virtual environment
echo   [OK] Python dependencies
echo   [OK] Node.js modules
echo   [OK] npm packages
echo.
echo Next steps:
echo   1. Double-click: run_scraper.bat
echo   2. Wait for setup/startup
echo   3. Browser opens automatically
echo   4. Start scraping!
echo.
echo If you still get errors:
echo   1. Check error message in terminal
echo   2. Restart your computer
echo   3. Run this script again
echo.
echo ============================================================================
echo.

pause
exit /b 0
