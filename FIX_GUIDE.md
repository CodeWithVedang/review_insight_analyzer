# 🔧 Complete Fix Guide

## Problem

You're getting a Node.js module error:
```
Cannot find module 'dist.js' imported from node.js
```

Or similar dependency/module errors when trying to start the application.

---

## ✅ Solution (Choose One)

### **Option 1: Master Fix (RECOMMENDED)**

**Double-click:** `FIX_ALL_ISSUES.bat`

This fixes everything:
- ✅ Python virtual environment
- ✅ Python dependencies
- ✅ Node.js modules
- ✅ npm packages
- ✅ All configurations

**Takes:** 3-5 minutes

**After fix:**
```bash
1. Double-click: run_scraper.bat
2. Application starts normally
3. Done!
```

---

### **Option 2: Fix Node Only**

If only frontend/Node.js is broken:

**Double-click:** `fix_node_modules.bat`

This fixes:
- ✅ Clears npm cache
- ✅ Removes corrupted node_modules
- ✅ Reinstalls all npm packages
- ✅ Verifies installation

**Takes:** 2-3 minutes

---

### **Option 3: Fix Python Only**

If only Python is broken:

**Double-click:** `fix_python_venv.bat`

This fixes:
- ✅ Removes old venv
- ✅ Creates fresh virtual environment
- ✅ Installs all dependencies
- ✅ Verifies installation

**Takes:** 1-2 minutes

---

## 🚀 Quick Steps

### If You Just Got an Error:

1. **Run:** `FIX_ALL_ISSUES.bat`
2. **Wait:** 3-5 minutes for completion
3. **Then:** Double-click `run_scraper.bat`
4. **Done:** Application starts

### If Fix Doesn't Work:

1. **Restart your computer** (clears ports and processes)
2. **Run:** `FIX_ALL_ISSUES.bat` again
3. **Then:** Double-click `run_scraper.bat`

### If Still Having Issues:

1. **Delete folders:** `venv` and `frontend\node_modules`
2. **Run:** `FIX_ALL_ISSUES.bat`
3. **Restart:** Computer
4. **Try:** `run_scraper.bat`

---

## 📊 What Each Fix Script Does

### **FIX_ALL_ISSUES.bat** (Master Fix)

```
1. Verifies Python is installed
2. Verifies Node.js is installed
3. Removes old venv
4. Creates fresh venv
5. Upgrades pip
6. Installs Python packages
7. Clears npm cache
8. Removes corrupted node_modules
9. Removes package-lock.json
10. Reinstalls npm packages
11. Verifies everything
```

**Use when:** You're getting multiple errors

---

### **fix_node_modules.bat**

```
1. Clears npm cache
2. Removes node_modules
3. Removes package-lock.json
4. Reinstalls with npm install
5. Verifies Vite is installed
```

**Use when:** Only frontend/Node.js is broken

---

### **fix_python_venv.bat**

```
1. Verifies Python exists
2. Removes old venv
3. Creates fresh venv
4. Upgrades pip
5. Installs all requirements
```

**Use when:** Only Python is broken

---

## ⏱️ Time Required

| Fix | Time | When To Use |
|-----|------|------------|
| **FIX_ALL_ISSUES.bat** | 3-5 min | All errors |
| **fix_node_modules.bat** | 2-3 min | Node only |
| **fix_python_venv.bat** | 1-2 min | Python only |

---

## 🎯 Recommended Process

### **If Getting Module Error:**

```
1. Double-click: FIX_ALL_ISSUES.bat
   Wait for completion
   
2. If fixes show [OK] on all items:
   Double-click: run_scraper.bat
   Should work!
   
3. If still getting errors:
   Restart computer
   Run FIX_ALL_ISSUES.bat again
   Try run_scraper.bat
```

---

## ✨ What Gets Fixed

### Python Environment:
- ✅ Virtual environment (venv)
- ✅ pip package manager
- ✅ FastAPI
- ✅ All Python dependencies

### Node Environment:
- ✅ npm packages
- ✅ Vite (frontend build tool)
- ✅ React and dependencies
- ✅ All frontend dependencies

### Configurations:
- ✅ Package caches
- ✅ Lock files
- ✅ Version conflicts

---

## 🆘 Troubleshooting Fixes

### **If fix script fails:**

**Option 1: Manual cleanup**
```bash
# Delete these manually
rmdir C:\path\venv
rmdir C:\path\frontend\node_modules
del C:\path\frontend\package-lock.json

# Then run FIX_ALL_ISSUES.bat again
```

**Option 2: Restart and retry**
```bash
1. Restart computer
2. Run FIX_ALL_ISSUES.bat
```

**Option 3: Check installations**
```bash
python --version       (should show Python 3.x)
node --version         (should show v18.x or higher)
npm --version          (should show 9.x or higher)
```

---

## 📝 Verification

After running fix script, verify everything works:

```bash
# Test 1: Check Python
python test_scraper.py
Expected: [PASS] ALL TESTS PASSED!

# Test 2: Check Frontend
Run: run_scraper.bat
Expected: Browser opens to http://localhost:5173
```

---

## ⚠️ Important Notes

### **Do NOT:**
- ❌ Delete `package.json` or `requirements.txt`
- ❌ Manually edit venv or node_modules
- ❌ Run multiple fix scripts simultaneously

### **DO:**
- ✅ Let fix scripts run to completion
- ✅ Wait for messages to appear
- ✅ Restart computer if issues persist
- ✅ Run `FIX_ALL_ISSUES.bat` if unsure

---

## 🎬 Step-by-Step (If Lost)

### **You're here because:**
You got a module/dependency error

### **Here's what to do:**

**Step 1: Run Master Fix**
```
1. Double-click: FIX_ALL_ISSUES.bat
2. Read messages carefully
3. Wait for completion
4. Check for [OK] messages
```

**Step 2: Start Application**
```
1. Double-click: run_scraper.bat
2. Wait for setup
3. Browser opens
4. Go to "Market Data Harvester"
```

**Step 3: Use Scraper**
```
1. Enter product name (e.g., "iPhone 15")
2. Click "Execute Live Scrape"
3. View results!
```

---

## 📞 Help

### **If fix script shows errors:**

1. **Read the error message** in the terminal
2. **Check Python:** `python --version`
3. **Check Node:** `node --version`
4. **Check npm:** `npm --version`
5. **Restart computer** and try again

### **If modules still missing:**

1. **Run FIX_ALL_ISSUES.bat** again
2. **Restart computer**
3. **Delete venv and node_modules** manually
4. **Run FIX_ALL_ISSUES.bat** once more

---

## ✅ Final Checklist

After running fix script:

- [ ] FIX_ALL_ISSUES.bat completed
- [ ] No error messages in terminal
- [ ] All [OK] checkpoints passed
- [ ] run_scraper.bat starts without errors
- [ ] Browser opens to http://localhost:5173
- [ ] "Market Data Harvester" page loads
- [ ] Can enter product and click scrape
- [ ] Everything works!

---

## Summary

**Your error is fixable!**

Just:
1. **Double-click:** `FIX_ALL_ISSUES.bat`
2. **Wait:** 3-5 minutes
3. **Then:** Double-click `run_scraper.bat`
4. **Enjoy:** Your working scraper!

---

**Version:** 2.0.2 (with fix scripts)
**Date:** April 2026
**Status:** Ready to Fix

All fix scripts included and tested. You got this! 💪
