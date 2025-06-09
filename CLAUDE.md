# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mood tracker Progressive Web App (PWA) that allows users to log their daily mood on a 1-5 scale and view their mood history. The app works offline and can be installed on mobile devices.

## Development Commands

This is a vanilla HTML/CSS/JavaScript PWA with npm for dependency management and development server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
npm start

# Server runs on http://localhost:3000
```

For deployment:
- **GitHub Pages**: Automatically deploys on push to main branch via GitHub Actions

## Architecture

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: LocalStorage for mood data persistence
- **PWA Features**: Service worker for offline caching, web app manifest
- **Deployment**: GitHub Pages (automated via GitHub Actions)

## Key Files

- `index.html` - Main app interface with mood selector and history
- `app.js` - MoodTracker class handling mood selection, storage, and display
- `styles.css` - Responsive styling with mobile-first design
- `manifest.json` - PWA manifest for app installation
- `sw.js` - Service worker for offline functionality

## Features

### Core Functionality
- **Mood Rating**: 1-5 scale with weather-themed emoji interface (🌧️ ☁️ ⛅ 🌤️ ☀️)
- **Data Persistence**: LocalStorage for mood data (no backend required)
- **Mood History**: View past entries sorted by date with mood labels
- **Date Navigation**: Navigate between dates with swipe gestures and arrow buttons
- **Mood Updates**: Update/overwrite mood for any selected date
- **Dual Views**: Today view for mood entry, History view for viewing past entries

### Design System - Neo-Brutalist
- **Bold Typography**: Font-weight 900, uppercase headers with letter-spacing
- **Angular Design**: Sharp corners, no border-radius throughout
- **Thick Borders**: 4-5px solid black borders on all interactive elements
- **Chunky Shadows**: Offset box-shadows (6px 6px 0px #000000) for depth
- **High Contrast**: Pure black text/borders on colored backgrounds
- **Interactive Effects**: 
  - Hover: `translate(-2px, -2px)` with increased shadow
  - Active: `translate(2px, 2px)` with reduced shadow for press effect

### Visual Features
- **Large Weather Icon Background**: 12rem weather emoji in top-left (desktop), 8rem (mobile)
  - Dynamically changes based on selected mood
  - Hidden on history view and neutral states
  - Positioned behind main content with proper z-indexing
- **Dynamic Color Themes**: Background gradient changes based on current mood selection
- **Weather-Based Mood Interface**: Each mood level corresponds to weather conditions
- **Save Indicator**: Top-right corner with loading spinner (⟳) and success state (OK)

### User Experience
- **Touch Gestures**: Swipe left/right to navigate between dates
- **Keyboard Navigation**: Arrow keys for date navigation in mood view
- **Auto-Save**: Mood selections save immediately without confirmation
- **Visual Feedback**: Save indicator shows loading → success states
- **Responsive Design**: Optimized layouts for mobile and desktop
- **PWA Features**: Offline functionality, installable on mobile devices

### Technical Implementation
- **Color Palette**: 
  - Very down: #4a90a4 (deep blue)
  - Somewhat down: #6ba3b5 (lighter blue)  
  - Neutral: #5ba05b (natural green)
  - Pretty good: #f6dc5a (warm yellow)
  - Very good: #f4d03f (bright yellow)
- **Date Management**: Smart date display (Today, Yesterday, Tomorrow, X days ago/from now)
- **State Management**: Tracks current date, selected mood, and view state
- **Data Structure**: JSON objects with date, mood, and timestamp stored in localStorage