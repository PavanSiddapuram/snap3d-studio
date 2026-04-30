# Snap3D — Root Agent

## What this project is
Snap3D is a browser-based platform for AI-powered 3D model generation and a free parametric tool suite for the 3D printing maker community. Target users: hobbyists, Etsy sellers, developers.

## Monorepo layout
```
snap3d-studio/
├── frontend/   ← React 19 + TanStack Start + Vite 7 + Tailwind 4 + shadcn/ui
├── backend/    ← FastAPI 0.115 + Python 3.11 (Fly.io) + Modal.com GPU inference
├── CLAUDE.md   ← this file
├── Project.md  ← product requirements and feature scope
└── Technical_doc.md  ← engineering decisions, costs, API reference, DB schema
```

## Sub-agents
- [frontend/CLAUDE.md](frontend/CLAUDE.md) — frontend stack, conventions, routes, components
- [backend/CLAUDE.md](backend/CLAUDE.md) — FastAPI structure, Modal GPU, DB schema

## Hard constraints (never violate)
- Infrastructure cost < ₹15,000/month until ₹50,000 MRR
- 90-day MVP scope — only features listed in Project.md §3 ship first
- All AI model dependencies must be MIT or LGPL licensed (no NVIDIA research licenses)
- AI job success rate ≥ 95% before public launch
- Parametric generators must produce valid, printable STLs 100% of the time

## When editing root-level files
- `.gitignore` covers both frontend and backend — update if adding new build artefacts
- `Project.md` and `Technical_doc.md` are source of truth for all product and architecture decisions — read them before adding any new feature or endpoint
