# PRD — Alieu Bojang Portfolio

## Original problem statement
Build a landing page: I want to make a portfolio website to promote me. I have a google site currently of my roblox game basically some ui elements ive made and projects ive worked on but now i want to upgrade. Im thinking a website black backgind maybe not completely dark and fluids cursor movement with webGL. I want to put my resume somewhere there. ... Projects: StealthGPT, Recoil Bot, Zero Hour (https://www.roblox.com/games/80481292697597/World-War-II). You can add anything that u think will make the website good too.

User choices: green accent; resume as full image with "paint it full" reveal; contact form that stores messages; links GitHub VirtualBlack2, alieu.bojang@icloud.com, Discord Virtual_Black. Later: flip the Zero Hour / Recoil Bot icons (Zero Hour = helmet smiley, Recoil Bot = soldier).

## Architecture
- React + Tailwind + framer-motion + lenis; custom WebGL2 fluid sim (FluidCanvas.jsx) full-page behind content
- FastAPI + MongoDB: POST /api/contact (public), GET/DELETE /api/contact (X-Admin-Key = ADMIN_KEY env)
- /inbox page to read messages with admin key

## Implemented (2026-10-02)
- Hero with masked line reveal, 3D tilt image stack, scroll parallax; marquee; bento projects (Zero Hour, Recoil Bot, StealthGPT, 10M+ plays, Lightnata, GitHub); experience timeline + skills; paint-to-reveal resume canvas with progress, reveal/repaint, PDF download; contact form + links; footer; AB SVG logo/favicon
- Icons flipped per user request
- Tested: backend 100%, frontend 100% (iteration_1)

## Update (2026-10-02)
- Icons swapped back: Zero Hour = soldier, Recoil Bot = helmet smiley (user confirmed)
- Owner email alerts via Emergent-managed Resend (email_service.py) to OWNER_EMAIL on each contact submission; 5/IP/10min rate limit
- Typing Survival project card (Roblox link, inspired by Glyphica)
- "Currently building" section: Color the World with hover-to-paint flag board
- Tested iteration_2: all pass
- Pending: none — real cover art added for Typing Survival and Color the World (2026-10-02)
- Thank-you screen (2026-10-02): MessageReceived.jsx replaces form after successful submit (animated check, masked headline, Send another); FluidCanvas listens for window 'fluid-burst' events, Contact fires bursts around card edges
- Netlify self-host support (2026-10-02): netlify.toml at repo root (base frontend, CI=false yarn build, SPA redirect, REACT_APP_FORM_PROVIDER=netlify); hidden Netlify Forms form in public/index.html; Contact.jsx posts to Netlify Forms when REACT_APP_FORM_PROVIDER=netlify or no backend URL, else FastAPI backend

## Backlog
- P1: Roblox UI elements gallery (from Google Site)
- P2: Rate limiting on contact form; email notification on new message
