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

For deployment to Vercel:
```bash
vercel --prod
```

## Architecture

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: LocalStorage for mood data persistence
- **PWA Features**: Service worker for offline caching, web app manifest
- **Deployment**: Static hosting (GitHub Pages, Vercel, Netlify)

## Key Files

- `index.html` - Main app interface with mood selector and history
- `app.js` - MoodTracker class handling mood selection, storage, and display
- `styles.css` - Responsive styling with mobile-first design
- `manifest.json` - PWA manifest for app installation
- `sw.js` - Service worker for offline functionality

## Features

- Rate mood on 1-5 scale with emoji interface
- LocalStorage persistence (no backend required)
- View mood history sorted by date
- Update today's mood if already logged
- Offline functionality via service worker
- Mobile-responsive design
- PWA installable on mobile devices