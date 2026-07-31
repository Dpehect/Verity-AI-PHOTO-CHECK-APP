# Verity — Digital Content Provenance

Verity is a content provenance platform designed to make the history of digital media visible and understandable. It presents Content Credentials, edit history, signer information, ingredients, and validation results through a clear forensic interface.

This repository currently contains the first frontend milestone: an original, motion-led product experience inspired by digital archives and evidence systems rather than conventional AI product aesthetics.

## Frontend experience

- Purpose-built loading sequence and cinematic landing experience
- Scroll-driven provenance timeline
- Interactive verification console with multiple evidence states
- Team workspace preview
- Responsive layouts for desktop, tablet, and mobile
- Reduced-motion accessibility support
- Keyboard-friendly native controls and semantic page structure

## Technology

- Next.js App Router
- React and TypeScript
- GSAP and ScrollTrigger
- CSS-based visual system and responsive motion profiles
- Lucide icons

## Local setup

Requirements:

- Node.js 20.9 or newer
- npm 10 or newer

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Create a production build:

```bash
npm run build
npm start
```

## Current status

The interface uses curated demonstration data. Upload processing, C2PA manifest extraction, authentication, persistence, team workspaces, and public verification reports will be connected in later milestones.

## Product principle

Content provenance is not a truth score. Verity is designed to communicate what can be verified about a file's origin and history without making unsupported claims about whether the content itself is true.

## License

Copyright © 2026. All rights reserved.
