# 🚀 Launcher Files - Quick Reference

## Choose One to Start

You have **3 ways** to start the application. Pick one:

---

## ⭐ RECOMMENDED: `run_scraper.bat`

**Best for:** Everyone - Most detailed output, easiest to use

### How:
Double-click **`run_scraper.bat`**

### What it does:
1. ✅ Checks Python & Node.js
2. ✅ Creates Python virtual environment
3. ✅ Installs all Python packages
4. ✅ Installs all Node.js modules
5. ✅ Starts backend server
6. ✅ Starts frontend application
7. ✅ Opens browser to http://localhost:5173

### Output:
```
[STEP 1/6] Checking Python installation...
[STEP 2/6] Checking Node.js installation...
[STEP 3/6] Setting up Python virtual environment...
[STEP 4/6] Installing Python dependencies...
[STEP 5/6] Installing Node.js dependencies...
[STEP 6/6] Starting application...

SUCCESS! Application is launching
Backend:  http://localhost:8001
Frontend: http://localhost:5173
```

---

## ⚡ QUICK: `start_app.bat`

**Best for:** Users who want minimal output

### How:
Double-click **`start_app.bat`**

### What it does:
Same as above, but with less verbose output

### Pros:
- Faster (less output to process)
- Simpler interface
- Still fully functional

### Cons:
- Less detailed error messages

---

## 🔧 ADVANCED: `run_scraper.ps1`

**Best for:** PowerShell users with advanced needs

### How:
Right-click **`run_scraper.ps1`** → "Run with PowerShell"

Or from terminal:
```powershell
powershell -ExecutionPolicy Bypass -File run_scraper.ps1
```

### What it does:
Same as `run_scraper.bat` but with:
- Better error handling
- Colored output (easier to read)
- PowerShell-specific features

### Pros:
- Colorful output (green = success, red = error)
- Better error messages
- More robust

### Cons:
- Requires PowerShell (usually already installed)
- Execution policy warning on first run

---

## What Happens After You Run One

### ✅ Two Terminal Windows Open

**Window 1: Backend**
```
INFO:     Uvicorn running on http://127.0.0.1:8001
INFO:     Application startup complete
```

**Window 2: Frontend**
```
VITE v5.0.0  ready in 234 ms
Local: http://localhost:5173/
```

### ✅ Browser Opens Automatically

Opens to http://localhost:5173

### ✅ Start Using the Scraper

1. Go to "Market Data Harvester" page
2. Enter a product name: "iPhone 15"
3. Click "Execute Live Scrape"
4. See 15 real reviews appear with:
   - Reviewer names
   - Star ratings
   - Review text
   - Sentiment (Positive/Negative/Neutral)
   - Confidence scores
   - Source attribution

---

## Timing

### First Run
- Initial setup: 2-3 minutes
  - Installing Python packages: ~1-2 minutes
  - Installing Node.js packages: ~1-2 minutes
  - Starting servers: ~30 seconds

### Subsequent Runs
- Much faster: 10-20 seconds
- Packages already installed
- Just starts the servers

---

## Keep Those Windows Open!

**IMPORTANT:** Keep both terminal windows open while using the app:

- If you close **Backend** → API stops working
- If you close **Frontend** → Dev server stops
- You can close the **main launcher window** though

To stop everything: Close both terminal windows.

---

## If Something Goes Wrong

### Not Working?

1. **Check error messages** in the terminal windows
2. **Try installing manually:**
   ```bash
   # Terminal 1
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn backend.main:app --port 8001
   
   # Terminal 2
   cd frontend
   npm install
   npm run dev
   ```

3. **Test the system:**
   ```bash
   python test_scraper.py
   ```
   Should show: `[PASS] ALL TESTS PASSED!`

### Still Having Issues?

Check: `LAUNCHER_GUIDE.md` → Troubleshooting section

---

## File Descriptions

| File | Type | Best For | Size | Complexity |
|------|------|----------|------|-----------|
| `run_scraper.bat` | Batch | Everyone | ~2KB | Simple |
| `start_app.bat` | Batch | Quick start | ~1KB | Very Simple |
| `run_scraper.ps1` | PowerShell | Advanced users | ~3KB | Medium |

---

## One More Thing...

### Want to verify everything works WITHOUT the UI?

```bash
python test_scraper.py
```

This runs 8 comprehensive tests and should show:
```
[PASS] ALL TESTS PASSED!
```

---

## Quick Comparison

| Need | Use This |
|------|----------|
| Just start it | ⭐ `run_scraper.bat` |
| Quick launch | ⚡ `start_app.bat` |
| Advanced features | 🔧 `run_scraper.ps1` |
| Verify it works | ✅ `python test_scraper.py` |
| Full docs | 📖 `LAUNCHER_GUIDE.md` |

---

## Summary

**Pick one:** 
- 🎯 `run_scraper.bat` ← START HERE
- ⚡ `start_app.bat`
- 🔧 `run_scraper.ps1`

**Double-click it** → Everything starts automatically! 🚀

**That's it.** No manual setup needed. No complicated steps. Just double-click and go! ✨

---

For detailed help, see:
- `LAUNCHER_GUIDE.md` - Complete launcher documentation
- `QUICK_START.md` - Quick start guide
- `SCRAPER_GUIDE.md` - Full system documentation
