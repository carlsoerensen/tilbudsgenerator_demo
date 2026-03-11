# Tilbudsgenerator – Demo

Demo app: voice-to-quote flow with recording simulation, generating state, and result screen.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Resize the window or use DevTools device mode to test mobile vs desktop.

## Deploy online (mobile-friendly)

### Vercel (recommended)

1. Push this repo to GitHub (already connected).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import `tilbudsgenerator_demo`.
3. Leave build settings as default (Vite is auto-detected). Deploy.
4. Share the generated URL; it works great on phones.

### Build for other hosts

```bash
npm run build
```

Serve the `dist/` folder as static files. For SPA routing, point all routes to `index.html`.

## Mobile behaviour

- **On phones / narrow viewports:** The app is full-screen (no device frame), with safe-area padding for notches and home indicators. Use “Add to Home Screen” for an app-like demo.
- **On desktop (≥768px):** The app is shown inside a phone frame with the Meta Ad recording instructions above.
