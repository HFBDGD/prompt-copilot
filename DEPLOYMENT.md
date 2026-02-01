# GitHub Pages Deployment Guide

## 🎯 Goal
Deploy your Prompt Copilot web app to GitHub Pages so it's accessible from any device at:
`https://YOUR-USERNAME.github.io/prompt-copilot`

---

## ✅ Prerequisites

- [x] Web app tested and working locally
- [ ] Xcode Command Line Tools installed (installing now...)
- [ ] GitHub account (free at github.com)

---

## 📝 Step-by-Step Instructions

### Step 1: Wait for Xcode Tools Installation ⏳

**Current Status:** Installing Xcode Command Line Tools...

A dialog box should be open on your screen. Please:
1. Click "Install"
2. Agree to the license
3. Wait 5-10 minutes for installation

**When complete, you'll see:** "The software was installed."

---

### Step 2: Initialize Git Repository

Once Xcode tools are installed, run:

```bash
cd /Users/arnold/.gemini/antigravity/scratch/prompt-copilot-web
git init
```

**Expected output:** `Initialized empty Git repository`

---

### Step 3: Configure Git (First Time Only)

If this is your first time using git on this computer:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email (use the same email as your GitHub account).

---

### Step 4: Add All Files

```bash
git add .
```

**What this does:** Stages all files for commit

---

### Step 5: Create First Commit

```bash
git commit -m "Initial commit - Prompt Copilot web app"
```

**Expected output:** Shows files added and changes made

---

### Step 6: Create GitHub Repository

**Go to GitHub:**
1. Open browser → https://github.com
2. Log in to your account
3. Click the **"+"** icon (top right) → **"New repository"**

**Repository Settings:**
- **Repository name:** `prompt-copilot`
- **Description:** (optional) "AI Prompt Builder Web App"
- **Public** or **Private:** Choose Public (required for free GitHub Pages)
- **DO NOT** check "Initialize with README" (we already have files)
- Click **"Create repository"**

---

### Step 7: Connect Local Repo to GitHub

GitHub will show you commands. Use these (replace YOUR-USERNAME):

```bash
git remote add origin https://github.com/YOUR-USERNAME/prompt-copilot.git
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Create token at: https://github.com/settings/tokens
  - Select: `repo` scope
  - Copy the token and paste it as password

---

### Step 8: Enable GitHub Pages

**In your GitHub repository:**
1. Click **"Settings"** tab
2. Scroll down to **"Pages"** in left sidebar
3. Under **"Source"**:
   - Branch: Select **"main"**
   - Folder: Select **"/ (root)"**
4. Click **"Save"**

**Wait 1-2 minutes...**

---

### Step 9: Get Your Live URL

After 1-2 minutes, refresh the Settings → Pages page.

You'll see:
> ✅ Your site is live at `https://YOUR-USERNAME.github.io/prompt-copilot/`

**Click the URL to test!**

---

## 🎉 Success Checklist

- [ ] Xcode Command Line Tools installed
- [ ] Git repository initialized
- [ ] Files committed to git
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Live URL accessible
- [ ] App works on live site

---

## 🐛 Troubleshooting

### "Permission denied" when pushing
**Solution:** Use a Personal Access Token instead of password
- Go to: https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select `repo` scope
- Copy token and use as password

### "Repository not found"
**Solution:** Check the remote URL
```bash
git remote -v
# Should show your GitHub username
```

### GitHub Pages shows 404
**Solution:** 
- Wait 2-3 minutes after enabling Pages
- Make sure branch is set to "main"
- Check that `index.html` is in root folder

### App doesn't work on live site
**Solution:**
- Open browser console (F12)
- Check for errors
- Verify all files were pushed: `git status`

---

## 🔄 Updating Your Site

After making changes to your code:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will auto-update in 1-2 minutes!

---

## 📱 Next Steps After Deployment

1. **Test on mobile devices**
   - Open the URL on your iPad/phone
   - Test all features

2. **Install as PWA**
   - Desktop: Click install icon in address bar
   - Mobile: Add to Home Screen

3. **Share the URL**
   - Send to friends/colleagues
   - Add to your portfolio

4. **Customize**
   - Add your own prompt libraries
   - Modify styling
   - Add new features

---

## ℹ️ Current Status

**Waiting for:** Xcode Command Line Tools installation to complete

**Next step:** Once installed, I'll help you run the git commands!
