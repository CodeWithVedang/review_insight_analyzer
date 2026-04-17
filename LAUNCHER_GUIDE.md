# Launcher Guide - One-Click Setup & Launch

## 🎯 Overview

You now have **3 easy ways to start the application**:

1. **run_scraper.bat** - Comprehensive setup with detailed output
2. **start_app.bat** - Simple quick launcher
3. **run_scraper.ps1** - PowerShell version with advanced features

All three do the same thing:
- ✅ Install Python virtual environment
- ✅ Install Python dependencies
- ✅ Install Node.js modules
- ✅ Start backend server
- ✅ Start frontend application
- ✅ Open browser automatically

---

## Method 1: run_scraper.bat (Recommended) ⭐

**Best for:** Complete setup with detailed status messages

### How to Use:

1. **Open File Explorer**
2. **Navigate to:** `D:\Projects\Web_Projects\review_insight_analyzer`
3. **Double-click:** `run_scraper.bat`
4. **Wait** for setup to complete (~2-3 minutes first time)
5. **Browser opens** automatically to http://localhost:5173

### What It Does:

```
[STEP 1/6] Check Python installation
[STEP 2/6] Check Node.js installation
[STEP 3/6] Create Python virtual environment
[STEP 4/6] Install Python dependencies
[STEP 5/6] Install Node.js dependencies
[STEP 6/6] Start backend & frontend, open browser
```

### What You'll See:

**Two new terminal windows will open:**

1. **"Review Intelligence - Backend"** terminal
   - Shows backend server starting
   - Displays: `Application startup complete`
   - Runs on http://localhost:8001

2. **"Review Intelligence - Frontend"** terminal
   - Shows frontend build process
   - Displays: `Local: http://localhost:5173`
   - Browser opens automatically

### Done! ✅

The browser opens to http://localhost:5173

Go to **"Market Data Harvester"** page and start scraping! 🚀

---

## Method 2: start_app.bat (Quickest) ⚡

**Best for:** Users who want minimal output

### How to Use:

1. **Double-click:** `start_app.bat`
2. **Wait** for setup
3. **Browser opens** automatically

### Pros:
- Faster execution
- Less verbose output
- Simpler interface

### Cons:
- Less detailed status messages
- Harder to diagnose if something goes wrong

---

## Method 3: run_scraper.ps1 (Advanced) 🔧

**Best for:** PowerShell users who want advanced features

### How to Use:

**Option A: Right-click & Run**
1. **Right-click** `run_scraper.ps1`
2. **Select:** "Run with PowerShell"
3. **Click:** "Run" when prompted about execution policy

**Option B: Command Line**
```powershell
powershell -ExecutionPolicy Bypass -File run_scraper.ps1
```

### Pros:
- Better error handling
- Colored output (easier to read)
- More robust startup
- PowerShell features

### Cons:
- Requires PowerShell (included in Windows 7+)
- Execution policy warning on first run

---

## Troubleshooting

### Issue 1: "Python is not installed"

**Solution:** Install Python
1. Go to https://www.python.org/downloads/
2. Download latest Python 3.x
3. **IMPORTANT:** Check "Add Python to PATH" during installation
4. Restart your computer
5. Try again

### Issue 2: "Node.js not found"

**Solution:** Install Node.js
1. Go to https://nodejs.org/
2. Download LTS version
3. Install it
4. Restart your computer
5. Try again

### Issue 3: Port 8001 already in use

**Solution:** Change the port
1. Edit `run_scraper.bat` (or `.ps1`)
2. Find: `--port 8001`
3. Change to: `--port 8002` (or any other number)
4. Save and run again

### Issue 4: npm ERR! code ERESOLVE

**Solution:** This is usually safe to ignore
- The frontend will still work
- If it doesn't, manually run:
  ```bash
  cd frontend
  npm install --legacy-peer-deps
  cd ..
  ```

### Issue 5: "Cannot find module" errors

**Solution:** Reinstall dependencies
1. Delete the `venv` folder
2. Run the batch file again
3. It will recreate venv and reinstall everything

### Issue 6: Browser doesn't open automatically

**Solution:** Manual open
1. Batch file completed without error
2. Open browser manually
3. Go to http://localhost:5173

---

## What Happens Next

### Browser Opens

The browser should open to http://localhost:5173 showing the landing page.

### Navigate to Scraper

1. Click on menu (top left)
2. Select **"Market Data Harvester"**
3. Or go directly to http://localhost:5173/scraper

### Use the Scraper

1. **Enter Product Name:** e.g., "iPhone 15"
2. **Select Category:** "Smartphones"
3. **Click:** "Execute Live Scrape"
4. **Wait:** 1-2 seconds
5. **See:** 15 real reviews with ML analysis! ✨

### Two Terminal Windows Running

Keep both windows open:

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

If either closes, the application will stop working.

---

## To Stop the Application

### Option 1: Close Both Windows
1. Close the Backend terminal
2. Close the Frontend terminal
3. Done!

### Option 2: Run Again Later
1. Just close the browser
2. Keep the terminals running
3. Browser will still work if you open http://localhost:5173

### Option 3: Kill Process
```bash
# In a new terminal
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

---

## Performance Notes

### First Run
- Takes longer (2-3 minutes)
- Installing Python packages: ~1 minute
- Installing npm packages: ~1 minute
- Starting servers: ~30 seconds
- **Subsequent runs: Much faster (10-20 seconds)**

### Subsequent Runs
- Packages already installed
- Just starts the servers
- Faster startup: 10-20 seconds

---

## Tips & Tricks

### Tip 1: Create Desktop Shortcut
1. Right-click `run_scraper.bat`
2. Select "Send to" → "Desktop (create shortcut)"
3. Now you can double-click from desktop!

### Tip 2: Speed Up Startup
- For subsequent runs, keep venv activated
- Run `python -m uvicorn backend.main:app --port 8001 --reload` manually

### Tip 3: Test Without Browser
```bash
python test_scraper.py
```
- Tests all functionality without UI
- Takes ~1 second
- Shows all test results

### Tip 4: Custom Port
Edit the batch file:
```batch
start "Review Intelligence - Backend" cmd /k "python -m uvicorn backend.main:app --port 8002 --reload"
```

### Tip 5: Keep Logs
The terminal windows stay open so you can see:
- Errors (if any)
- Requests being made
- Debug information

---

## Comparison

| Feature | run_scraper.bat | start_app.bat | run_scraper.ps1 |
|---------|-----------------|---------------|-----------------|
| Setup | ✅ Detailed | ✅ Quick | ✅ Detailed |
| Ease | ⭐⭐⭐ Very Easy | ⭐⭐⭐ Very Easy | ⭐⭐ Easy |
| Error Messages | ✅ Detailed | ⚠️ Basic | ✅✅ Very Detailed |
| Colored Output | ❌ No | ❌ No | ✅ Yes |
| Speed | Normal | Normal | Normal |
| Compatibility | ✅ All Windows | ✅ All Windows | ✅ Win7+, Requires PS |
| Best For | Everyone | Quick Users | Advanced Users |

---

## Quick Reference

### Every Time You Want to Use the App:

**1. Double-click one of:**
- `run_scraper.bat` ⭐ Recommended
- `start_app.bat` ⚡ Quickest
- Or PowerShell: `run_scraper.ps1`

**2. Wait for setup**
- First time: 2-3 minutes
- Afterwards: 10-20 seconds

**3. Browser opens automatically**
- If not: Open http://localhost:5173

**4. Start scraping!**
- Navigate to "Market Data Harvester"
- Enter product name
- Click "Execute Live Scrape"
- See real reviews! ✨

**5. When done:**
- Close the two terminal windows
- Or leave them running for next use

---

## FAQ

**Q: Do I need to do this every time?**  
A: Yes, but it's just one click. Subsequent runs are faster (10-20 sec).

**Q: Can I keep it running in the background?**  
A: Yes! Leave the two terminals open and keep using the browser.

**Q: What if I close the browser?**  
A: The backend & frontend keep running. Just open http://localhost:5173 again.

**Q: Can I use the app on my phone?**  
A: Yes! Use your computer's IP address instead of localhost:
```
http://YOUR_COMPUTER_IP:5173
```

**Q: What if the port is in use?**  
A: Edit the batch file and change 8001 to 8002 (or another number).

**Q: Do I need internet?**  
A: For scraping, yes (to fetch from data sources). But the app will use fallback data if offline.

**Q: Is it safe?**  
A: Completely! All code is local on your computer. No data is sent anywhere except to local scraping sources.

---

## Support

### If Something Goes Wrong:

1. **Check error messages** in the terminal windows
2. **Run tests:**
   ```bash
   python test_scraper.py
   ```
3. **Read:** `SCRAPER_GUIDE.md` (Troubleshooting section)
4. **Try reinstalling:**
   - Delete `venv` folder
   - Run batch file again

---

## Summary

You have **3 easy ways** to start:

✅ **Double-click `run_scraper.bat`** ← Start here!  
✅ **Or double-click `start_app.bat`**  
✅ **Or run `run_scraper.ps1` with PowerShell**

All three:
- Install everything
- Start everything
- Open browser
- Done!

---

**That's it!** Just double-click and you're done. 🎉

Questions? See `SCRAPER_GUIDE.md` for complete documentation.
