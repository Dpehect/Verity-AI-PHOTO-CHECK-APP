# Verity — Digital Content Provenance

Verity is a content provenance platform designed to make the history of digital media visible and understandable. It presents Content Credentials, edit history, signer information, ingredients, and validation results through a clear forensic interface.

This repository contains the complete interactive frontend foundation: an original, motion-led product experience inspired by digital archives and evidence systems rather than conventional AI product aesthetics.

## Frontend experience

- Asset-aware loading sequence that is skipped after the first session visit
- Real-time WebGL evidence object with React Three Fiber and a custom GLSL shader
- Scroll-driven provenance timeline
- Local image selection and drag-and-drop analysis flow
- Browser-generated SHA-256 asset fingerprints and image metadata
- Interactive verification console with multiple evidence states
- Persistent evidence reports with print/PDF-friendly styling
- Searchable and filterable team workspace interface
- Route transitions across overview, verification, report, and workspace surfaces
- Responsive layouts for desktop, tablet, and mobile
- Reduced-motion accessibility support
- Keyboard-friendly native controls and semantic page structure

## Technology

- Next.js App Router
- React and TypeScript
- GSAP and ScrollTrigger
- React Three Fiber, Three.js, and custom shaders
- Zustand session persistence
- CSS-based visual system and responsive motion profiles
- Lucide icons

## Local setup

Requirements:

- Node.js 20.9 or newer
- npm 10 or newer

Install dependencies and start the development server:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Set `NEXT_PUBLIC_SITE_URL` to the final public domain in production so canonical metadata, robots, and sitemap URLs use the deployed origin.

Create a production build:

```bash
npm run build
npm start
```

## Current status

The frontend can read a selected image locally, calculate its SHA-256 digest, display its dimensions and size, and generate a session report. It also includes clearly labelled curated data for verified and edited credential states.

Cryptographic C2PA manifest parsing, trust-list validation, authentication, permanent database storage, background processing, and shared organization workspaces require the backend milestone. A locally selected file is therefore never labelled as verified by this browser-only demo.

## Routes

- `/` — cinematic product overview
- `/verify` — local verification lab and demonstration assets
- `/report/[id]` — detailed evidence report
- `/workspace` — searchable verification workspace

## Product principle

Content provenance is not a truth score. Verity is designed to communicate what can be verified about a file's origin and history without making unsupported claims about whether the content itself is true.

## License

Copyright © 2026. All rights reserved.
