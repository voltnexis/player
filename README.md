# ⚡ VNPlayer (VoltNexis Player)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JSDelivr](https://img.shields.io/badge/JSDelivr-CDN-orange)](https://www.jsdelivr.com/)

**VNPlayer** is a modern, high-performance, and developer-friendly open-source HTML5 video player. It features a stunning glassmorphism UI, advanced mobile gestures, multi-language subtitle support, and versioned distribution via JSDelivr.

---

## 🚀 Quick Start

### Using JSDelivr CDN (Recommended)

Just add the script tag to your site and use the custom element:

```html
<!-- Load the latest version -->
<script src="https://cdn.jsdelivr.net/gh/user/vnplayer/dist/player.js"></script>

<!-- OR Load a specific version -->
<script src="https://cdn.jsdelivr.net/gh/user/vnplayer/dist/v1.0/player.js"></script>

<voltnexis-player 
  src="your-video.mp4" 
  title="My Awesome Video"
  primary-color="#00ffd5"
  subtitle-en="english-subs.vtt"
  subtitle-es="spanish-subs.vtt"
></voltnexis-player>
```

## ✨ Features

- 💎 **Premium UI**: Modern glassmorphism design with smooth animations.
- 📱 **Native Gestures**: Double-tap to seek, long-press for 2x speed, and swipe gestures.
- 💬 **Multi-Language Subtitles**: Support for multiple VTT tracks with easy switching.
- 🎨 **Deep Customization**: Easily change primary colors, hide UI elements (like `hide="minimized"`), and customize logic via props.
- 🚀 **CDN Delivery**: High-speed delivery via JSDelivr with versioned support.

## 🛠️ Configuration

| Attribute | Description | Default |
|-----------|-------------|---------|
| `src` | Video source URL | - |
| `title` | Video title | "VoltNexis Player" |
| `primary-color` | UI accent color | `#00ffd5` |
| `subtitle-[lang]` | Subtitle Vtt for a specific language | - |
| `hide` | Comma-separated list to hide UI (e.g., `minimized`, `like`, `share`, `menu-icon`) | `[]` |

### The `hide="minimized"` Mode
Use `hide="minimized"` to keep the secondary actions (Like, Share, etc.) hidden by default. They will only show when the user clicks the menu icon.

## 📂 Repository Structure
If you are cloning this for your own use, these are the essential files:
- `dist/player.js`: The bundled player ready for CDN.
- `dist/vX.X/player.js`: Versioned builds.
- `src/`: Source code (React + Tailwind).

## 📄 License

VNPlayer is open-source software licensed under the **MIT license**.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/voltnexis">VoltNexis</a>
</p>
