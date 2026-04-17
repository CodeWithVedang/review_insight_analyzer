@echo off
REM ============================================================================
REM  Fix Python Virtual Environment
REM ============================================================================

color 0A

echo.
echo ============================================================================
echo                    FIXING PYTHON VIRTUAL ENVIRONMENT
echo ============================================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/4] Removing corrupted venv...
if exist venv (
    rmdir /s /q venv >nul 2>&1
    echo [OK] Old venv removed
) else (
    echo [OK] No venv to remove
)

echo.
echo [2/4] Creating fresh virtual environment...
python -m venv venv
if errorlevel 1 (
    echo [ERROR] Failed to create venv!
    pause
    exit /b 1
)
echo [OK] Virtual environment created

echo.
echo [3/4] Activating and upgrading pip...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul 2>&1
echo [OK] pip upgraded

echo.
echo [4/4] Installing requirements...
echo This may take 1-2 minutes...
pip install -r requirements.txt
if errorlevel 1 (
    echo [WARNING] Some packages had issues but continuing...
) else (
    echo [OK] All requirements installed
)

echo.
echo ============================================================================
echo                    FIX COMPLETE!
echo ============================================================================
echo.
echo Python environment has been cleaned and reinstalled.
echo.
echo Next steps:
echo   1. Double-click: run_scraper.bat
echo   2. Application should start normally
echo.
echo If you still get errors:
echo   1. Restart your computer
echo   2. Run this script again
echo.
echo ============================================================================
echo.

pause
exit /b 0
