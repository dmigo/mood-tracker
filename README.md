# 🌟 Mood Tracker

A **neo-brutalist** mood tracking Progressive Web App with weather-themed interface, daily thoughts journaling, and activity tagging.

![Weather-themed mood interface with 5 levels from stormy to sunny]

## ✨ Features

### Core Functionality
- **Weather-Themed Mood Scale**: 1-5 rating with weather emojis (🌧️ ☁️ ⛅ 🌤️ ☀️)
- **Daily Thoughts**: Rich text journaling with auto-save
- **Activity & Mood Tags**: Core activities (meditation, sports) + mood-specific descriptors
- **Smart Date Navigation**: Swipe gestures, keyboard controls, and intelligent date labeling
- **Mood History**: Timeline view with all past entries, thoughts, and tags

### Design System
- **Neo-Brutalist Aesthetic**: Bold typography, thick black borders, chunky shadows
- **Angular Design**: Zero border-radius, sharp geometric elements
- **Dynamic Weather Background**: Large weather icons that change with mood
- **High Contrast**: Pure black on colored backgrounds
- **Interactive Feedback**: Translate transforms and shadow depth changes

### Technical Features
- **Progressive Web App**: Installable, offline-capable
- **LocalStorage Persistence**: No backend required
- **Responsive Design**: Mobile-first with touch gestures
- **Auto-Save**: Debounced saving for thoughts and instant tag updates
- **Custom 404**: Branded redirect page for GitHub Pages

## 🚀 Quick Start

### Development

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
# or
npm start
```

Open http://localhost:3000 in your browser.

### Deployment

Automatically deploys to GitHub Pages on push to main branch.

## 🎨 Design Philosophy

This app embraces **neo-brutalism** - a bold, unapologetic design approach featuring:
- Thick black borders (4-5px)
- Offset box shadows (6px 6px 0px)
- Bold typography (font-weight: 900)
- Uppercase headers with letter-spacing
- High contrast color combinations
- Geometric, angular interfaces

## 📱 Usage

1. **Select your mood** using the weather-themed scale
2. **Add thoughts** in the text area (auto-saves after 1 second)
3. **Tag activities** like meditation, sports, or mood descriptors
4. **Navigate dates** with swipe gestures or arrow buttons
5. **View history** to see your mood patterns and reflections

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: LocalStorage
- **PWA**: Service Worker + Web App Manifest
- **Deployment**: GitHub Pages
- **Design**: Neo-brutalist CSS with custom shadows and borders

## 📊 Data Structure

Each mood entry contains:
```javascript
{
  date: "Mon Jan 06 2025",
  mood: 4,                    // 1-5 scale
  thoughts: "Great day!",     // Optional text
  tags: ["sports", "happy"],  // Activity + mood tags
  timestamp: 1736150400000    // For sorting
}
```

## 🌈 Mood Tags

**Dynamic tags based on selected mood:**
- **Level 1 (🌧️)**: tired, anxious, sad, hopeless, overwhelmed, lonely
- **Level 2 (☁️)**: stressed, worried, down, frustrated, bored, irritated
- **Level 3 (⛅)**: calm, okay, peaceful, focused, balanced, content
- **Level 4 (🌤️)**: motivated, optimistic, grateful, excited, confident, social
- **Level 5 (☀️)**: joyful, energetic, inspired, proud, accomplished, loved

## 🔄 Updating the App

Since this is a PWA with offline caching, you might need to refresh to get updates:

### If you're not seeing the latest features:

**Quick fix:**
- Pull down to refresh in your mobile browser
- Or close and reopen the browser tab

**Clear cache (keeps your mood data safe):**

**Android Chrome:**
1. Chrome → Menu → Settings → Site settings → Storage
2. Find mood.dmigo.me → Clear & reset
3. Select only "Cached images and files" (keep "Cookies and site data" unchecked)

**iPhone Safari:**
1. Settings → Safari → Advanced → Website Data
2. Find mood.dmigo.me and swipe left → Delete
3. Or Safari → Hold refresh button → "Reload Without Content Blockers"

**Your mood data is safe** - it's stored in LocalStorage, separate from the cache.

## 🔗 Live Demo

Visit [mood.dmigo.me](https://mood.dmigo.me) to try the app!
