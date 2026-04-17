# 🔧 Troubleshooting Guide

## Issue: Socket Permission Error / Port Already in Use

**Error Message:**
```
ERROR: [WinError 10013] An attempt was made to access a socket in a way forbidden
```

**Cause:** Port 8001 is already in use by another application or stuck process.

### Quick Fix (Try This First):

1. **Close both terminal windows** (Backend and Frontend)
2. **Double-click:** `cleanup_ports.bat`
3. **Wait:** 30 seconds
4. **Run:** `run_scraper.bat` again

---

## Solution 1: Run Cleanup Script

```bash
double-click: cleanup_ports.bat
```

**What it does:**
- Kills stuck Python processes
- Kills stuck Node processes
- Shows port status
- Frees up ports

---

## Solution 2: Smart Launcher (Already Fixed!)

The updated `run_scraper.bat` now:
- ✅ Detects if port 8001 is in use
- ✅ Automatically uses port 8002 if 8001 is occupied
- ✅ Tells frontend which port to use
- ✅ Everything works automatically

**No manual changes needed!**

---

## Solution 3: Manual Port Check

**Check which process is using the port:**
```bash
netstat -ano | findstr ":8001"
```

**Kill the process (replace XXXX with PID):**
```bash
taskkill /F /PID XXXX
```

---

## Solution 4: Use Different Port

If you want to manually specify a different port:

**Edit run_scraper.bat** and change:
```batch
set BACKEND_PORT=8002
```

---

## Common Issues & Fixes

### Issue 1: Backend window closes immediately

**Cause:** Python error or port issue

**Fix:**
1. Run `cleanup_ports.bat`
2. Check for error messages in the terminal
3. Make sure Python is installed: `python --version`

---

### Issue 2: Frontend won't load / Can't connect to backend

**Cause:** Backend didn't start or port mismatch

**Fix:**
1. Check Backend terminal window is still open
2. Check it says "Application startup complete"
3. Check it shows the correct port (8001 or 8002)
4. The frontend will connect automatically

---

### Issue 3: Browser doesn't open automatically

**Cause:** Normal - just open manually

**Fix:**
1. Open browser
2. Go to: http://localhost:5173
3. Everything should work

---

### Issue 4: Getting "Connection refused" error

**Cause:** Backend not running or wrong port

**Fix:**
1. Check both terminal windows are open
2. Check backend window shows "Application startup complete"
3. Check backend port (8001 or 8002)
4. Refresh browser (F5)

---

### Issue 5: npm install errors

**Cause:** Node.js cache or permission issue

**Fix:**
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

---

### Issue 6: Python dependency errors

**Cause:** Missing packages

**Fix:**
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

---

## Advanced Troubleshooting

### Check if ports are free:

```bash
netstat -ano | findstr ":8001"   (8001 status)
netstat -ano | findstr ":5173"   (5173 status)
netstat -ano | findstr ":8002"   (8002 status)
```

**No output = port is free**
**Output = port is in use**

---

### View detailed backend logs:

In Backend terminal, you'll see:
- `INFO: Started server process`
- `INFO: Uvicorn running on http://127.0.0.1:8001`
- `INFO: Application startup complete`

**Look for any ERROR messages**

---

### View detailed frontend logs:

In Frontend terminal, you'll see:
- `VITE v5.0.0 ready in XXX ms`
- `Local: http://localhost:5173/`

**Look for any ERROR messages about api_internal**

---

## Reset Everything

If nothing else works, do a full reset:

1. **Close both terminal windows**
2. **Run cleanup_ports.bat**
3. **Delete these folders:**
   ```bash
   rmdir /s venv
   cd frontend
   rmdir /s node_modules
   cd ..
   ```
4. **Run run_scraper.bat again**

This will reinstall everything from scratch.

---

## Port Conflict Resolution

### If Port 8001 is Stubborn:

**Option 1: Use 8002 (Recommended)**
- Launcher automatically uses 8002 if 8001 is busy
- No configuration needed!

**Option 2: Kill All Python**
```bash
taskkill /F /IM python.exe
```

**Option 3: Restart Computer**
- Always works for stuck ports

---

## Still Having Issues?

### Quick Verification:

```bash
# Test the scraper module
python test_scraper.py

# Expected: [PASS] ALL TESTS PASSED!
```

If tests pass, the system works. The issue is only with the launcher/ports.

---

## Performance Issues

### Slow Scraping?

Normal performance:
- Scrape time: <1 second
- Response: 10-15 reviews
- ML analysis: <100ms per review

### If slower:

1. Check system resources (CPU, RAM)
2. Close other applications
3. Check internet connection (for data sources)
4. Check backend terminal for errors

---

## Help Checklist

- [ ] Run cleanup_ports.bat
- [ ] Close both terminal windows
- [ ] Wait 30 seconds
- [ ] Run run_scraper.bat again
- [ ] Check both terminal windows open
- [ ] Check browser loads http://localhost:5173
- [ ] Check for errors in terminals
- [ ] Run python test_scraper.py
- [ ] Read error messages carefully
- [ ] Try reset everything (see above)

---

## Still Need Help?

1. **Read:** START_HERE.md
2. **Read:** QUICK_START.md
3. **Check:** Backend terminal error messages
4. **Check:** Frontend terminal error messages
5. **Run:** python test_scraper.py
6. **Check:** Port status with netstat command

---

## Summary

**Most Common Fix:**
1. Double-click `cleanup_ports.bat`
2. Wait 30 seconds
3. Double-click `run_scraper.bat`
4. Done!

**Smart Launcher Handles:**
- ✅ Port conflicts (auto-uses 8002 if 8001 busy)
- ✅ Missing dependencies (auto-installs)
- ✅ Port configuration (auto-configures frontend)
- ✅ Browser launching (auto-opens)

**You don't need to do anything special!**

---

**Last Resort:** Restart your computer. Port conflicts always resolve after restart.

---

Version: 2.0.0
Date: April 2026
Status: Working - Troubleshooting Guide
