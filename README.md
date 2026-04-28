# ⚡ VoltNexis Player v3.2

[![License: MIT](https://img.shields.io/badge/License-MIT-turquoise.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/badge/Release-v3.2.0-blue.svg)](https://github.com/voltnexis/player/releases/tag/v3.2)

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
- **Cross-Browser Safe**: v2.8 includes a safe storage utility that prevents crashes in Firefox when the player is embedded cross-origin (fixes `DOMException: The operation is insecure`).
- **Mutual Exclusion**: Smart logic keeps your choices clean (Liking automatically removes a Dislike).

### ⚡ Pro Gestures & Shortcuts
- **Accumulative Seeking**: Seek 5s, 10s, 15s... instantly with rapid inputs or mobile side-taps.
- **Mobile Optimized v3.2**: Refined interaction logic with 2x "Focus Mode", dynamic caption placement that avoids the seek bar, and improved double-tap seeking that won't interrupt playback.
- **Smart Preview System**: Support for VTT sprite thumbnails with a high-fidelity live video fallback for real-time visual scrubbing.
- **Top Shortcuts**: `K` (Play/Pause), `J/L` (Seek ±10s), `M` (Mute), `F` (Fullscreen), `T` (Theater).
- **Speed Persistence**: Remembers your playback speed across pause/resume and source changes.

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
   git clone https://github.com/voltnexis/player.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run local dev server**:
   ```bash
   npm run dev
   ```

### Option B: Use JSDelivr CDN
You can link directly to a specific version without downloading anything:
- **v3.2 (Latest)**: `https://cdn.jsdelivr.net/gh/voltnexis/player@3.2.0/dist/player.js`
- **v3.1**: `https://cdn.jsdelivr.net/gh/voltnexis/player@3.1.0/dist/player.js`
- **v2.8**: `https://cdn.jsdelivr.net/gh/voltnexis/player@2.8.0/dist/player.js`
- **Latest Main**: `https://cdn.jsdelivr.net/gh/voltnexis/player@main/dist/player.js`

---

*Designed with ❤️ by VoltNexis Team*
