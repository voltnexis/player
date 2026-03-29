# ⚡ VoltNexis Player v2.6

[![License: MIT](https://img.shields.io/badge/License-MIT-turquoise.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/badge/Release-v2.6.0-blue.svg)](https://github.com/your-repo/releases)

**VoltNexis Player** is a state-of-the-art, glassmorphic HTML5 video player built for the modern web. It combines elite aesthetics with high-performance interaction, featuring a persistent session-based feedback system and pro-grade gesture controls.

---

## 🚀 Experience the Difference

### 💎 Elite Aesthetics
- **Glassmorphic UI**: Ultra-premium `backdrop-blur` and translucent designs that adapt to any background.
- **Unified Branding**: Every interaction (Like, Comment, Chat) syncs perfectly with your `primaryColor`.
- **Intelligent Visuals**: Vibrant colors only appear when *you* interact, keeping the focus entirely on your content.

### 🧠 Smart Session Feedback
- **Always Remembered**: Your Like/Dislike/Comment/Chat states stay active even if you refresh the page.
- **Privacy First**: Preferences are saved in `sessionStorage`—choices are cleared only when you close the tab.
- **Mutual Exclusion**: Smart logic keeps your choices clean (Liking automatically removes a Dislike).

### ⚡ Pro Gestures & Shortcuts
- **Accumulative Seeking**: Seek 5s, 10s, 15s... instantly with rapid inputs or mobile side-taps.
- **Mobile Optimized**: Side-aware double-tap gestures for seamless mobile navigation.
- **Top Shortcuts**: `K` (Play/Pause), `J/L` (Seek ±10s), `M` (Mute), `F` (Fullscreen).

---

## 🛠️ How to Use

### 1. Basic Embedding
Simply add the tag to your page. You can customize the look and feel instantly:

```html
<vn-player 
  src="path/to/video.mp4" 
  primary-color="#00ffd5" 
  clicktitle="My Premium Content">
</vn-player>
```

### 2. Available Properties
| Property | Description | Default |
| :--- | :--- | :--- |
| `src` | URL of the video file | Required |
| `primary-color` | The accent color for all UI elements | `#00ffd5` |
| `clicktitle` | The title shown in the player header | "VoltNexis Player" |
| `auto` | Auto-play the video | `false` |

---

## 📥 Download & Installation

### Option A: Clone & Build (Recommended)
1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/voltnexis-player.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run local dev server**:
   ```bash
   npm run dev
   ```

### Option B: Download Release
Visit the [Releases](https://github.com/your-username/voltnexis-player/releases) page to download the latest compiled `dist/` folder containing the ready-to-use JS/CSS files.

---

## 📂 Repository Structure
To maintain this project on GitHub, please ensure the following files are uploaded:
- `src/` - All React components and core logic.
- `public/` - Static assets and icons.
- `package.json` - Project metadata and dependencies.
- `index.html` - Main demo page.
- `vite.config.ts` - Build and optimization configurations.
- `README.md` - (This file) Documentation for your users.

---

*Designed with ❤️ by VoltNexis Team*
