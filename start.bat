@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

title Review Insight Analyzer - Setup ^& Launch

echo.
echo  ============================================================
echo    Review Insight Analyzer  ^|  Full Setup ^& Launch
echo  ============================================================
echo.

REM ── 1. Check Python ──────────────────────────────────────────
echo [1/8] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.9+ and add it to PATH.
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo        Found: %%v

REM ── 2. Check Node ────────────────────────────────────────────
echo [2/8] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install Node.js 18+ and add it to PATH.
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo        Found: Node %%v

REM ── 3. Python virtual environment ────────────────────────────
echo [3/8] Setting up Python virtual environment...
if not exist "venv\Scripts\activate.bat" (
    echo        Creating venv...
    python -m venv venv
    if errorlevel 1 ( echo [ERROR] Failed to create venv. & pause & exit /b 1 )
    echo        [OK] venv created.
) else (
    echo        [OK] venv already exists.
)
call venv\Scripts\activate.bat

REM ── 4. Install Python dependencies ───────────────────────────
echo [4/8] Installing Python dependencies...
pip install -r requirements.txt --quiet --disable-pip-version-check
if errorlevel 1 ( echo [ERROR] pip install failed. & pause & exit /b 1 )
echo        [OK] Python packages installed.

REM ── 5. Download NLTK data ─────────────────────────────────────
echo [5/8] Downloading NLTK data...
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True); nltk.download('punkt_tab', quiet=True); nltk.download('averaged_perceptron_tagger', quiet=True); print('       [OK] NLTK data ready.')"

REM ── 6. Generate dataset + train model ────────────────────────
echo [6/8] Checking ML dataset and model...
if not exist "ml\dataset_processed.csv" (
    echo        Generating dataset (this may take a minute)...
    python -m ml.setup_data
    if errorlevel 1 ( echo [ERROR] Dataset generation failed. & pause & exit /b 1 )
) else (
    echo        [OK] dataset_processed.csv already exists.
)

if not exist "ml\model.pkl" (
    echo        Training ML model...
    python -m ml.train
    if errorlevel 1 ( echo [ERROR] Model training failed. & pause & exit /b 1 )
) else (
    echo        [OK] model.pkl already exists.
)

REM ── 7. Install frontend npm packages ─────────────────────────
echo [7/8] Installing frontend dependencies...
if not exist "frontend\node_modules" (
    echo        Running npm install (this may take a minute)...
    pushd frontend
    npm install --silent
    if errorlevel 1 ( echo [ERROR] npm install failed. & popd & pause & exit /b 1 )
    popd
    echo        [OK] npm packages installed.
) else (
    echo        [OK] node_modules already exists.
)

REM ── 8. Launch backend + frontend in separate windows ─────────
echo [8/8] Launching backend and frontend...
echo.

REM Kill anything already on these ports
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":8001 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%p >nul 2>&1
)
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%p >nul 2>&1
)
for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":5174 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%p >nul 2>&1
)

REM Start backend
start "Backend  ^|  http://localhost:8001" cmd /k "cd /d "%~dp0" && call venv\Scripts\activate.bat && echo. && echo  [BACKEND] Starting FastAPI on http://127.0.0.1:8001 ... && echo. && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001"

REM Wait a moment for backend to bind before opening browser
timeout /t 4 /nobreak >nul

REM Start frontend
start "Frontend ^|  http://localhost:5173" cmd /k "cd /d "%~dp0\frontend" && echo. && echo  [FRONTEND] Starting Vite on http://localhost:5173 ... && echo. && npm run dev"

REM Wait for frontend to boot then open browser
timeout /t 4 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo  ============================================================
echo    Both servers are starting in separate windows.
echo.
echo    Backend  :  http://127.0.0.1:8001
echo    Frontend :  http://localhost:5173
echo    API Docs :  http://127.0.0.1:8001/docs
echo.
echo    Close the two server windows to stop the project.
echo  ============================================================
echo.
pause
