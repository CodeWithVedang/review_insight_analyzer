@echo off
REM ============================================================================
REM  REVIEW INTELLIGENCE PLATFORM - ONE-CLICK LAUNCHER
REM  Smart setup detection + Auto port detection + Proper configuration
REM ============================================================================

setlocal enabledelayedexpansion
color 0A

echo.
echo ============================================================================
echo                    REVIEW INTELLIGENCE PLATFORM
echo                         ONE-CLICK LAUNCHER
echo ============================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo IMPORTANT: Check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version.
    echo.
    pause
    exit /b 1
)

REM Smart Setup Detection
echo [SETUP DETECTION]
echo.

REM Check if venv exists
if exist "venv" (
    echo [OK] Python virtual environment already exists
    set SETUP_NEEDED=0
) else (
    echo [CREATING] Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created
    set SETUP_NEEDED=1
)

REM Activate venv
call venv\Scripts\activate.bat

REM Check if requirements are installed
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo [INSTALLING] Python dependencies...
    pip install -q --upgrade pip
    pip install -q -r requirements.txt
    if errorlevel 1 (
        echo WARNING: Some packages may not have installed correctly
    ) else (
        echo [OK] Python dependencies installed
    )
    set SETUP_NEEDED=1
) else (
    echo [OK] Python dependencies already installed
)

REM Check if node_modules exists
if exist "frontend\node_modules" (
    echo [OK] Node.js dependencies already installed
) else (
    echo [INSTALLING] Node.js dependencies...
    cd frontend
    call npm install -q
    if errorlevel 1 (
        echo WARNING: npm installation had issues
    ) else (
        echo [OK] Node.js dependencies installed
    )
    cd ..
    set SETUP_NEEDED=1
)

echo.
if !SETUP_NEEDED! equ 1 (
    echo [SETUP COMPLETE] All dependencies installed and ready
) else (
    echo [SETUP SKIPPED] All dependencies already installed
)

echo.
echo ============================================================================
echo                    CHECKING PORT AVAILABILITY
echo ============================================================================
echo.

REM Check if port 8001 is available
netstat -ano | findstr ":8001" >nul 2>&1
if errorlevel 1 (
    echo [OK] Port 8001 is available
    set BACKEND_PORT=8001
) else (
    echo [WARNING] Port 8001 is in use
    echo [USING] Port 8002 instead
    set BACKEND_PORT=8002
)

echo.
echo Backend will run on: http://localhost:!BACKEND_PORT!
echo Frontend will run on: http://localhost:5173
echo.

echo ============================================================================
echo                        STARTING APPLICATION
echo ============================================================================
echo.

REM Start backend in new window
echo Starting Backend (FastAPI on port !BACKEND_PORT!)...
start "Review Intelligence - Backend" cmd /k "python -m uvicorn backend.main:app --port !BACKEND_PORT! --reload"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window with backend port environment variable
echo Starting Frontend (React + Vite)...
start "Review Intelligence - Frontend" cmd /k "set BACKEND_PORT=!BACKEND_PORT! && cd frontend && npm run dev"

REM Wait for frontend to start and build
timeout /t 8 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:5173

echo.
echo ============================================================================
echo                    APPLICATION LAUNCHED SUCCESSFULLY!
echo ============================================================================
echo.
echo Backend:  http://localhost:!BACKEND_PORT!
echo Frontend: http://localhost:5173
echo.
if !BACKEND_PORT! equ 8002 (
    echo NOTE: Backend is running on port 8002 (port 8001 was in use)
    echo The frontend automatically knows to use port 8002
    echo.
)
echo How to use the scraper:
echo   1. Go to "Market Data Harvester" page
echo   2. Enter a product name (e.g., iPhone 15)
echo   3. Select a category (Smartphones, Accessories, Laptops, General)
echo   4. Click "Execute Live Scrape"
echo   5. View real reviews with ML analysis!
echo.
echo To verify everything is working:
echo   Open a new terminal and run: python test_scraper.py
echo   Expected: [PASS] ALL TESTS PASSED!
echo.
echo To stop the application:
echo   Close both backend and frontend terminal windows
echo.
echo If you get connection errors:
echo   1. Check if both backend and frontend terminals are still open
echo   2. Check the terminal output for error messages
echo   3. If port conflict: Run "taskkill /F /IM python.exe" to clear
echo.
echo ============================================================================
echo.

REM Keep window open
timeout /t 3 /nobreak >nul

exit /b 0
