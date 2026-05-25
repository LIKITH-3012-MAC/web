# Prometheus AI — Likith Naidu's Portfolio Frontend

An elite, founder-grade personal portfolio landing page and AI concierge built for **Likith Naidu Anumakonda** (Founder, THE SAKRA GROUP PVT LTD / AI-ML Architect). 

This interface features physics-based stacking animations, a horizontal scrolling marquee of animated assets, and a fully interactive **Neo-Glassmorphic conversational AI agent** ("Prometheus") equipped with real-time multilingual voice recognition and synthesis.

---

## 🚀 Key Features

### 1. Neo-Glassmorphism Conversational Agent
- **Holographic Glass panel**: Styled with deep backdrop blur, subtle inner bezel highlights, gradient borders, and custom glowing shadows (`bg-[#060608]/75 backdrop-blur-2xl border-white/10`).
- **Dynamic Scrollbars**: Sleek custom purple-to-orange scrollbars integrated directly into the message layout.
- **Pulsing Audio Waves**: Real-time bouncing visualizer bars indicating voice transcription input.

### 2. Multi-Language Voice System (Speech Recognition & Synthesis)
- **Selected Language Mirroring**: The AI responds in the language chosen in the UI language dropdown (English 🇺🇸, Telugu 🇮🇳, Hindi 🇮🇳, Spanish 🇪🇸, German 🇩🇪), translating static context matches on-the-fly.
- **Speech-To-Text**: Integrates the Web Speech `SpeechRecognition` API, dynamically re-initializing language models on select.
- **Text-To-Speech (Voice Readback)**: Plays audio responses with natural dialect system voices matching the locale. Includes a mute/unmute speaker toggle in the header.

### 3. Extraordinary Typography & Custom Markdown
- **Markdown Parser**: Native, regex-driven markdown renderer supporting styled inline formats:
  - **Headers**: Formatted with left-aligned vertical gradient accent bars, bold white weights, and uppercase tracking.
  - **Lists**: Rendered with left margins and glowing purple bullet circles.
  - **Inline Code**: Embedded in rounded dark-glass badges with orange font styling.
  - **Hyperlinks**: Interactive underlines with animated external link icons.

### 4. Interactive Context Cards
- Parses metadata token streams (e.g. `[[CARD:git]]`) to render visual cards inside chat bubbles:
  - `contact` card: direct buttons to Email, Phone, LinkedIn, and GitHub.
  - `collab` card: redirects the user to trigger the Intake Modal.
  - `git` card: repository widgets showing the active code archives.
  - `youtube` card: redirects to Likith's classical piano and technical media hubs.

### 5. Sticky Stacking Project Cards
- Render 5 responsive sticky project cards (Prometheus AI V2.0, Resolvit-AI, BenchAI, Forms Project, and Aqua Sentinel) utilizing `framer-motion` scroll-linked scaling offsets.

---

## 🛠️ Technology Stack
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS + Custom Vanilla CSS Utilities
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Voice APIs**: Web Speech API (`webkitSpeechRecognition`, `speechSynthesis`)

---

## 📦 Directory Structure
```bash
├── public/
│   ├── collab.html        # Standalone HTML collaboration request form
│   ├── robots.txt         # SEO spiders configuration
│   ├── vercel.json        # Public static redirects
│   └── knowledge/         # Local static query templates
├── src/
│   ├── components/
│   │   ├── PrometheusChat.tsx   # Neo-Glassmorphic Chatbot UI, Speech Recognition, & Synthesis
│   │   ├── CollabModal.tsx      # Secure collaboration intake form
│   │   ├── ServicesSection.tsx  # Specializations list
│   │   ├── ProjectsSection.tsx  # Sticky stacking cards
│   │   └── HeroSection.tsx      # Custom header and portrait magnets
│   ├── utils/
│   │   └── analytics.ts         # Client session visit logger
│   ├── App.tsx                  # App layout
│   └── main.tsx                 # Bootstrapper
├── vercel.json                  # SPA routing configuration for Vercel
├── tailwind.config.js
└── package.json
```

---

## 💻 Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Serves the React Vite frontend at [http://localhost:5173/](http://localhost:5173/).

### 3. Compile Production Bundle
```bash
npm run build
```
Compiles static optimized assets into the `dist/` directory.

---

## 🌐 Deployment configuration
- **Vercel**: When creating a project on Vercel, set the **Root Directory** to `frontend` (in monorepo structures) or build the root folder directly. The bundled [vercel.json](vercel.json) automatically overrides routing to prevent `404` errors on client-side paths.
