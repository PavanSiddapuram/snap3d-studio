# Snap3D — Frontend Agent

## Stack
| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Router | Next.js App Router — file-based in `app/` |
| Build | Turbopack (`next dev --turbopack`) |
| Styles | Tailwind CSS v4, config in `app/globals.css` via `@import "tailwindcss"` |
| Components | shadcn/ui "new-york" style, all in `components/ui/` |
| 3D | React Three Fiber + Drei + Three.js |
| Animations | Framer Motion |
| Package manager | **Bun** — always use `bun add`, `bunx`, never `npm` or `npx` |
| Language | TypeScript 5, strict mode |
| Deploy | Vercel |

## Path alias
`@/` maps to `./` (repo root) — configured in `tsconfig.json`.
- `@/components/Navbar` → `components/Navbar.tsx`
- `@/lib/utils` → `lib/utils.ts`
- `@/hooks/use-mobile` → `hooks/use-mobile.tsx`

## Design system (dark-first)
All CSS tokens live in `app/globals.css` under `:root` and `.dark, :root`.
Key tokens: `--background`, `--foreground`, `--card`, `--elevated`, `--accent`, `--border`, `--border-subtle`, `--muted-foreground`, `--success`, `--warning`, `--error`.

Key utility classes (defined in `globals.css`):
- `.noise` — film grain on cards
- `.glass` / `.glass-strong` — frosted glass surfaces (navbar)
- `.aurora` — animated gradient blob for hero sections
- `.grid-bg` — subtle grid background pattern
- `.shimmer` — loading shimmer animation
- `.ring-conic` — premium conic gradient ring on highlighted cards

## App Router structure
```
app/
  layout.tsx          ← root layout (Geist fonts, Navbar, Toaster)
  globals.css         ← Tailwind + design tokens
  page.tsx            ← / → renders LandingPage
  generate/
    image/page.tsx    ← /generate/image → ImageGeneratePage
    text/page.tsx     ← /generate/text → TextGeneratePage
  tools/
    page.tsx          ← /tools → ToolsPage
    lithophane/       ← /tools/lithophane → LithophanePage
  pricing/page.tsx    ← /pricing → PricingPage
  dashboard/page.tsx  ← /dashboard → DashboardPage
  settings/page.tsx   ← /settings → SettingsPage

components/
  pages/              ← 'use client' components (one per route)
    LandingPage.tsx
    ImageGeneratePage.tsx
    TextGeneratePage.tsx
    ToolsPage.tsx
    LithophanePage.tsx
    PricingPage.tsx
    DashboardPage.tsx
    SettingsPage.tsx
  ui/                 ← shadcn/ui components
  Navbar.tsx          ← 'use client', usePathname for active link
  Footer.tsx          ← server-safe, Link from next/link
  PageShell.tsx       ← 'use client', Framer Motion entry animation + Footer
  UploadZone.tsx      ← 'use client', drag/drop upload
  ModelViewer.tsx     ← R3F scene (loaded via dynamic() with ssr:false)
  ComingSoon.tsx      ← placeholder component
```

## Key Next.js patterns
- **Thin server pages**: `app/*/page.tsx` exports `metadata` (SEO) + renders client page component.
- **Client components**: All interactive pages in `components/pages/` have `'use client'` at top.
- **Three.js SSR**: Always use `dynamic(() => import("@/components/ModelViewer"), { ssr: false })` — never `React.lazy()`.
- **Navigation**: Use `Link` from `next/link` with `href=` (not TanStack's `to=`).
- **Active route**: Use `usePathname()` from `next/navigation` (not `useRouterState`).
- **Font**: GeistSans/GeistMono from `geist/font/sans` and `geist/font/mono`, applied as CSS vars.

## Component conventions
- Shared layout wrapper: `<PageShell>` — adds entry animation + `<Footer />`
- 3D viewer: `<ModelViewer />` — dynamically imported with `ssr: false`
- File upload: `<UploadZone onFile={fn} />` — handles drag/drop + preview
- Placeholder pages: `<ComingSoon title="..." blurb="..." />`
- Adding shadcn components: `bunx --bun shadcn@latest add <component-name>`

## Page-level patterns
- Two-column generate pages: `grid lg:grid-cols-[45fr_55fr]`, left = controls, right = viewer
- Section header: `<p className="text-[11px] uppercase tracking-[0.2em] text-accent">Label</p>` then `<h2 className="mt-4 text-4xl...">`
- Cards: `rounded-2xl border border-border-subtle bg-card p-5 noise`
- Primary CTA: `rounded-full bg-foreground text-background`
- Secondary CTA: `rounded-full border border-border bg-card/40 backdrop-blur hover:bg-elevated`
- Segmented control: motion.span with `layoutId` for animated indicator

## Animation conventions
- Page enter: `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}`
- Section reveal: `whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}`
- Stagger: `delay: i * 0.04`
- Spring tabs: `type: "spring", stiffness: 400, damping: 32`
- Ease: `[0.16, 1, 0.3, 1]` (expo out)

## SEO requirements
Each route's `app/*/page.tsx` exports a `metadata` object targeting a long-tail keyword.
The page component itself (in `components/pages/`) is `'use client'` for interactivity.

## Scope decisions (MVP)
- **Calculators are cut** — no Print Cost, Resin Cost, Etsy Profit, Print Time, etc. `/tools/etsy-profit` redirects to `/tools` via `next.config.ts`. Do not build any calculator pages.
- **User-facing REST API is paused** — not shown on pricing, no API key UI in settings. Do not add API access to pricing plans until explicitly re-enabled.

## Current route status
| Route | Status |
|---|---|
| `/` | Complete |
| `/generate/image` | Complete |
| `/generate/text` | Complete |
| `/tools` | Complete |
| `/tools/lithophane` | Complete |
| `/tools/etsy-profit` | Redirects to /tools (next.config.ts) |
| `/pricing` | Complete |
| `/dashboard` | Complete (static data) |
| `/settings` | Placeholder (ComingSoon) |
| `/tools/3d-text` | Not yet created |
| `/tools/vase` | Not yet created |
| `/tools/bin` | Not yet created |
| `/tools/nameplate` | Not yet created |
| `/tools/viewer` | Not yet created |
| `/tools/converter` | Not yet created |
| `/tools/gcode` | Not yet created |

## Dev commands
```bash
cd frontend
bun dev          # starts on localhost:3000 with Turbopack
bun build        # production build
bun lint         # eslint
bun format       # prettier
```
