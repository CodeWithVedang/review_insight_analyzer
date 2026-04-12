@echo off
echo ============================================
echo  Review Intelligence Platform - Backend
echo ============================================
cd /d "%~dp0"

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo [OK] Virtual environment activated.
) else (
    echo [WARN] No venv found - using system Python.
)

echo [INFO] Starting FastAPI server on http://localhost:8001
echo [INFO] Press Ctrl+C to stop.
echo.

python -m uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload

pause
