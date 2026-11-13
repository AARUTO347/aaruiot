# ⚡ AARUIOT

### **Applied AI, Robotics, Unified Interfaces & Open Technologies**

> **Bridging Intelligence, Hardware, and Human Control.**

**AARUIOT** is an engineering and R&D organization building unified hardware–software ecosystems — spanning universal microcontroller abstraction libraries, autonomous robotics, custom human-interface devices (HIDs), and applied edge-AI pipelines.

🌐 **Live site:** https://aaruiot.netlify.app
🏠 **Mirror:** https://aaruto347.github.io/aaruiot

---

## 🚀 Core Engineering Pillars

- 🧠 **Applied AI & Vision** — real-time computer vision, hand-joint kinematics tracking, multi-modal security verification and interactive voice-driven AI agents.
- 🤖 **Autonomous Robotics** — high-torque mobile rovers, LiDAR SLAM navigation, edge-compute integration and custom high-current power-distribution PCBs.
- 🔌 **Unified Interfaces & Firmware** — zero-dependency, multi-architecture hardware libraries (**AARUESP**, **AARUARDUINO**) unifying 18,000+ sensors, displays and protocols under one clean API, plus custom BLE HID controllers.
- 🌐 **Open Technologies & IoT** — asynchronous embedded OS frameworks, real-time WebSocket telemetry and self-hosted developer/automation infrastructure.

## 🛠️ Tech Stack

`C++` · `Python` · `PlatformIO` · `Arduino` · `ESP32 / ESP8266` · `NVIDIA Jetson` · `ROS / LiDAR` · `OpenCV` · `MediaPipe` · `PySide6` · `Flask` · Custom PCB Design

## 📌 Flagship Projects

| Project | Description |
|---|---|
| [**AARUESP**](https://github.com/AARUTO347/AARUESP) | Universal hardware abstraction library — 18,100 registered modules across 207 ESP32/ESP8266 boards. |
| [**AARUARDUINO**](https://github.com/AARUTO347/AARUARDUINO) | Cross-architecture unified embedded framework for AVR, MegaAVR and Renesas platforms. |
| **Autonomous Rover & SLAM Stack** | All-terrain mobile robotics platform powered by 360° LiDAR, depth cameras and edge AI compute. |
| **BioHand AI & Custom BLE HIDs** | Real-time vision-to-kinematics robotic control and standalone wireless gaming/control interfaces. |

## 🧱 Site Architecture

Static single-page site — no build step, no framework runtime.

```
index.html              single page, 8 sections
assets/css/site.css     design system (--site-* tokens)
assets/js/site.js       boot sequence, IoT mesh canvas, scroll systems, live GitHub
assets/js/config.js     host endpoints for the contact channel
assets/img/*.webp       generated hero/pillar imagery
```

- **Contact form** — native Netlify Forms on Netlify; on GitHub Pages it posts to the registered Netlify endpoint. Falls back to a prefilled `mailto:` if both channels are unavailable.
- **GitHub data** — curated project cards merged with live `api.github.com` stats (cached 10 min, graceful offline fallback).
- **Accessibility** — single `h1`, labelled controls, `alt` text, `prefers-reduced-motion` respected, keyboard-skippable boot intro.

## 🚀 Deployment

| Host | URL | Method |
|---|---|---|
| Netlify | https://aaruiot.netlify.app | `netlify deploy --prod --dir web` |
| GitHub Pages | https://aaruto347.github.io/aaruiot | this repo, `main` → `/` |

---

**⚡ MADE BY AARUTO** — Abhishek "AARUTO" Solanki · [GitHub](https://github.com/AARUTO347) · [LinkedIn](https://www.linkedin.com/in/abhishek-solanki-7bb239407/)
