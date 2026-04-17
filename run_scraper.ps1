# Review Intelligence Platform - Complete Setup & Launch (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File run_scraper.ps1

Write-Host "`n=========================================================================="
Write-Host "  REVIEW INTELLIGENCE PLATFORM - SETUP & LAUNCH" -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Step 1: Check Python
Write-Host "[1/6] Checking Python..." -ForegroundColor Yellow
if (Test-CommandExists python) {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] $pythonVersion found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Python not found!" -ForegroundColor Red
    Write-Host "Install from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Make sure to add Python to PATH" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Check Node.js
Write-Host "[2/6] Checking Node.js..." -ForegroundColor Yellow
if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js not found!" -ForegroundColor Red
    Write-Host "Install from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Create/Check venv
Write-Host "[3/6] Setting up Python virtual environment..." -ForegroundColor Yellow
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to create virtual environment!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
Write-Host "[OK] Virtual environment ready" -ForegroundColor Green

# Step 4: Install Python packages
Write-Host "[4/6] Installing Python dependencies..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"
pip install -q --upgrade pip
pip install -q -r requirements.txt
Write-Host "[OK] Python dependencies installed" -ForegroundColor Green

# Step 5: Install npm packages
Write-Host "[5/6] Installing Node.js dependencies..." -ForegroundColor Yellow
Push-Location frontend
npm install -q
Pop-Location
Write-Host "[OK] Node.js dependencies installed" -ForegroundColor Green

# Step 6: Start application
Write-Host "[6/6] Starting application..." -ForegroundColor Yellow
Write-Host ""
Write-Host "=========================================================================="
Write-Host "         LAUNCHING BACKEND & FRONTEND" -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8001" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""

# Start backend
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD'; & '.\venv\Scripts\Activate.ps1'; python -m uvicorn backend.main:app --port 8001 --reload`""

Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD\frontend'; npm run dev`""

Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "=========================================================================="
Write-Host "         SUCCESS! Application is launching" -ForegroundColor Green
Write-Host "=========================================================================="
Write-Host ""
Write-Host "Backend:  http://localhost:8001" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Browser should open automatically..." -ForegroundColor Cyan
Write-Host ""
Write-Host "To use the scraper:" -ForegroundColor Yellow
Write-Host "  1. Go to 'Market Data Harvester' page" -ForegroundColor White
Write-Host "  2. Enter a product name (e.g., 'iPhone 15')" -ForegroundColor White
Write-Host "  3. Click 'Execute Live Scrape'" -ForegroundColor White
Write-Host "  4. View real reviews with ML analysis!" -ForegroundColor White
Write-Host ""
Write-Host "To verify everything works:" -ForegroundColor Yellow
Write-Host "  Open a new terminal and run: python test_scraper.py" -ForegroundColor White
Write-Host ""
Write-Host "To stop the application:" -ForegroundColor Yellow
Write-Host "  Close both terminal windows (Backend and Frontend)" -ForegroundColor White
Write-Host ""
Write-Host "=========================================================================="
Write-Host ""

Read-Host "Press Enter to exit this window"
