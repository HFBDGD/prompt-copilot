# Prompt Copilot - Web Application

A beginner-friendly AI prompt builder that helps you create customized prompts for ChatGPT, Claude, and other AI tools.

## 📁 Project Structure

```
prompt-copilot-web/
├── index.html              # Main web page (open this in your browser)
├── css/
│   └── styles.css          # All the styling and colors
├── js/
│   ├── app.js              # Main application logic
│   ├── dataLoader.js       # Loads prompt libraries
│   └── promptBuilder.js    # Builds the final prompt
├── data/
│   ├── index.json          # List of available libraries
│   └── libraries/          # Prompt template files
│       ├── ai_writing.json
│       └── code_helper.json
├── manifest.json           # Makes app installable (PWA)
├── sw.js                   # Service worker (offline support)
└── assets/
    └── icons/              # App icons
```

## 🚀 How to Use (Beginner Guide)

### **Step 1: Test Locally**
1. Open `index.html` in your web browser (double-click it)
2. The app should load and work immediately!

### **Step 2: Deploy to GitHub Pages**
```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit your changes
git commit -m "Initial commit"

# 4. Create a repo on GitHub (github.com)
# - Click "New Repository"
# - Name it "prompt-copilot"
# - Don't initialize with README (we already have files)

# 5. Connect and push
git remote add origin https://github.com/YOUR-USERNAME/prompt-copilot.git
git branch -M main
git push -u origin main

# 6. Enable GitHub Pages
# - Go to your repo on GitHub
# - Click "Settings" → "Pages"
# - Under "Source", select "main" branch
# - Click "Save"
# - Wait 1-2 minutes
# - Visit: https://YOUR-USERNAME.github.io/prompt-copilot
```

## 🎯 Features

- ✅ **Bilingual** - Switch between Chinese and English
- ✅ **20+ Output Modes** - Midjourney, Code Only, Bug Fixer, etc.
- ✅ **Offline Support** - Works without internet (PWA)
- ✅ **Dynamic Forms** - Input fields change based on selected task
- ✅ **Real-time Preview** - See your prompt as you type
- ✅ **One-Click Copy** - Copy prompt to clipboard

## 📝 How It Works

1. **Select Library** - Choose a prompt category (AI Writing, Code Helper, etc.)
2. **Select Category** - Pick a specific role (Content Writer, Developer, etc.)
3. **Select Task** - Choose what you want to do (Blog Post, Debug Code, etc.)
4. **Fill Variables** - Enter your specific details (topic, tone, etc.)
5. **Choose Output Mode** - Pick a special mode if needed
6. **Copy Prompt** - Click the copy button and paste into ChatGPT/Claude!

## 🛠️ Customization

### Adding Your Own Prompt Library

Create a new JSON file in `data/libraries/`:

```json
{
  "My Category": {
    "My Task": {
      "description": "What this prompt does",
      "template": "You are a {role}. Please {action}.",
      "vars": {
        "role": ["Expert", "Beginner", "Teacher"],
        "action": "Enter what to do"
      }
    }
  }
}
```

Then add it to `data/index.json`:
```json
{
  "My Custom Library": "data/libraries/my_library.json"
}
```

## 🐛 Troubleshooting

**App doesn't load?**
- Make sure you're opening `index.html` in a modern browser (Chrome, Firefox, Safari)
- Check browser console for errors (F12 → Console tab)

**Offline mode not working?**
- Visit the site once while online
- The service worker needs to cache files first
- Refresh the page and try again

**GitHub Pages shows 404?**
- Wait 2-3 minutes after enabling Pages
- Make sure `index.html` is in the root folder
- Check that the branch is set to "main" in Settings

## 📚 Learn More

- **HTML/CSS/JS Basics**: [MDN Web Docs](https://developer.mozilla.org/)
- **GitHub Pages Guide**: [GitHub Docs](https://docs.github.com/pages)
- **PWA Tutorial**: [web.dev](https://web.dev/progressive-web-apps/)

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new prompt libraries
- Improve the UI/UX
- Fix bugs
- Add features

## 📄 License

Free to use and modify for personal and commercial projects.
