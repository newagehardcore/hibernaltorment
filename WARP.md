# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Hibernal Torment is a haunted Winamp-style music player experience featuring GATEKEEPER's "Wrong Planet" album. This is an interactive multimedia web application that recreates the classic Winamp interface with custom audio-visual elements including animated starfields, password protection, and responsive design.

## Architecture

### Core Structure
- **Frontend-only application**: Pure HTML/CSS/JavaScript with no backend dependencies
- **Webamp Integration**: Built on top of the Webamp library (Winamp clone in HTML5/JS)
- **Dual HTML Setup**: 
  - `src/index.html`: Main desktop experience with full visual effects
  - `src/mobile.html`: Mobile-optimized version using CDN Webamp
- **Asset Management**: Uses Cloudinary CDN for audio files, local assets for skins/images
- **Build System**: Custom Node.js build script that prepares files for GitHub Pages deployment

### Key Components

**Main Application Flow (index.html)**:
1. Password protection overlay system
2. Animated starfield background canvas
3. Webamp player initialization with custom GATEKEEPER tracks
4. Floating window animations (desktop only)
5. Fullscreen background video support
6. Cover window system with custom messaging

**Mobile Version (mobile.html)**:
- Simplified experience using CDN Webamp
- Performance-optimized starfield with fewer stars
- Touch-friendly interface adaptations
- Legendarium logo integration

**Track Management**: 
- Custom tracks are defined in `patch-webamp-bundle.js` and mobile.html
- Audio files hosted on Cloudinary CDN
- Metadata includes artist "GATEKEEPER" and individual track titles

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server (serves src/ directory)
npm run dev

# Access at: http://localhost:8080
```

### Building for Production
```bash
# Build for GitHub Pages deployment
npm run build

# Clean build directory
npm run clean
```

### Bundle Patching
```bash
# Patch webamp bundle with custom tracks (for desktop version)
node patch-webamp-bundle.js

# Restore original bundle
node patch-webamp-bundle.js --restore
```

## Development Workflow

### Working with Audio Content
- Audio files are served from Cloudinary CDN (not stored in repo due to size)
- Track definitions exist in two places:
  - `patch-webamp-bundle.js`: For desktop version (patches the bundle)
  - `mobile.html`: Inline JavaScript array for mobile version
- When adding new tracks, update both locations with matching metadata

### Styling and Visual Effects
- Main styles are in `src/index.html` (embedded CSS)
- Webamp-specific overrides in `src/webamp.css` and root `webamp.css`  
- CSS variables for easy customization of starfield behavior and scaling
- Responsive design with mobile-specific optimizations
- Window animations disabled on mobile for performance

### Asset Management
- Skins stored in `src/assets/skins/` (including custom GKSkin.wsz)
- Images in `src/assets/images/` (logos, UI elements)
- Build process excludes loops directory (using CDN instead)
- GitHub Pages deployment handles path rewriting for relative assets

### Testing Considerations
- Test both desktop (`index.html`) and mobile (`mobile.html`) versions
- Verify Webamp functionality after bundle patching
- Check password protection flow
- Test responsive design breakpoints
- Validate Cloudinary CDN asset loading

## File Structure Notes

```
src/
├── index.html           # Main desktop experience
├── mobile.html          # Mobile-optimized version  
├── webamp.css          # Webamp styling overrides
├── webamp-bundle.js    # Local Webamp bundle (gets patched)
├── webamp-bundle.css   # Webamp CSS bundle
└── assets/
    ├── images/         # UI images and logos
    └── skins/          # Custom Winamp skins

scripts/
└── build.js            # Production build script

patch-webamp-bundle.js  # Track patching utility
webamp.css             # Root webamp styles (copied to dist)
```

## Deployment

The project auto-deploys to GitHub Pages via GitHub Actions on pushes to main. The build process:
1. Installs dependencies via `npm ci`
2. Runs `npm run build` (executes `scripts/build.js`)
3. Deploys `dist/` directory to GitHub Pages
4. Handles path rewriting for CDN assets and relative links

## Browser Compatibility

- Requires modern browsers with Canvas API support for starfield
- Audio requires Web Audio API compatibility
- Touch events handled for mobile dragging functionality
- Responsive design supports mobile viewports down to 768px width