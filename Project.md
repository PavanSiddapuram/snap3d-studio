# Snap3D — MVP Product Requirements Document
**Version 1.0 · April 2026 · Confidential**
> MVP Scope: 3-month build target

---

## 1. Overview

Snapy3D is a browser-based platform that lets anyone generate printable 3D models from text or photos, and process those models with a suite of free parametric and utility tools — no CAD skills required.

The MVP targets **makers, hobbyists, and Etsy sellers** who want to create and print custom 3D objects without touching professional design software.

> **Scope rule:** If a feature is not explicitly listed in Section 3, it is out of scope for the MVP. No exceptions. We ship a tight, working product before expanding.

---

## 1.1 What Snap3D Is (MVP)

- A web app where users upload a photo or type a prompt and get a downloadable 3D model in under 60 seconds
- A collection of free parametric generators: lithophane, 3D text, name sign, vase, bin organizer
- A set of free calculators useful to the 3D printing community: print cost, Etsy profit, filament weight, layer height
- A simple credit-based monetization model with a free tier generous enough to drive organic growth

## 1.2 What Snap3D Is NOT (MVP)

- Not a marketplace or community platform — no user profiles, explore feed, or model uploads from other users
- Not a fulfillment or print-on-demand service
- Not a mobile app — responsive web only
- Not an enterprise or B2B product
- Not a WhatsApp bot or any other channel beyond the web app

## 1.3 Name

**Working name: Snap3D.** Alternative: TextGen3D. Snap3D is preferred — shorter, memorable, platform-agnostic, works for both image and text input.

Domain: `snap3d.io` or `snap3d.in`

## 1.4 Success Metrics at 90 Days

| Metric | Target |
|---|---|
| Daily active users | 500+ |
| Models generated / day | 300+ |
| Free-to-paid conversion | 5% |
| MRR | ₹50,000+ |
| Tool page organic traffic (SEO) | 2,000+ sessions/month |
| Job success rate | ≥ 95% |

---

## 2. Target Users

### Hobbyist / Casual Maker
- Wants to print cool, personalized objects — phone stands, name tags, pet figurines, wall art
- Has a consumer FDM printer (Bambu, Prusa, Ender) or uses a local print shop
- Will not pay upfront; needs to see value first. Free tier is the hook.
- Shares results on Reddit r/3Dprinting, Instagram, TikTok — the primary organic growth channel

### Etsy / Print Farm Seller
- Sells 3D-printed products — flexi animals, lithophanes, name plates, custom figurines
- Needs tools that help them price correctly (Etsy Profit Calculator) and create unique products fast
- Will pay for a monthly plan if the ROI is clear and immediate

### Developer / API User
- Building a product that needs 3D generation as a backend service
- Needs a clean REST API with predictable pricing per call
- Reached via GitHub, ProductHunt, and tech newsletters

---

## 3. Feature Scope — MVP

> This is the complete feature list. Every item here ships in 90 days. Nothing else ships in 90 days.

### 3.1 AI Generation

#### Image-to-3D
- Upload one photo (JPEG/PNG/WEBP, max 10 MB)
- Auto background removal before inference
- Generation at 512³ (fast, 1 credit) or 1024³ (quality, 2 credits)
- Output: GLB with PBR textures + STL
- In-browser 3D preview with orbit controls, environment lighting
- Download buttons for GLB and STL
- Estimated wait time shown while generating

#### Text-to-3D
- Plain language prompt input: `a small dragon figurine sitting on a rock`
- Style selector: Realistic / Cartoon / Mechanical / Organic (4 presets)
- Same output and preview as Image-to-3D
- Same credit cost as Image-to-3D

#### Pet-to-3D Figurine
- Upload a pet photo → stylized 3D figurine
- Style options: Realistic / Cartoon / Chibi
- Output: watertight STL optimized for FDM printing

#### Face-to-3D Figurine
- Upload a portrait/selfie → 3D bust or cake-topper figurine
- Style options: Realistic / Cartoon
- Output: watertight STL

---

### 3.2 Parametric Generators *(Free, No Credits)*

> These tools run entirely on CPU — no GPU required, no credit cost. They are **free forever** to use, with no login required. Primary SEO and organic traffic drivers.

| Generator | Description |
|---|---|
| **Lithophane Generator** | Upload any photo → height-map STL for backlit printing. Controls: size (mm), thickness, border toggle, flat or curved (lamp shade). Live 3D preview, instant STL download. |
| **3D Text Generator** | Type text → choose font → set extrusion depth → download STL. Font library: 10 curated fonts (serif, sans, bold, handwriting, stencil, sci-fi). |
| **Name Sign Generator** | Large initial letter with inlaid smaller name — dual-extrusion / multicolor effect. Font selector, size control, inlay depth. |
| **Custom Vase Generator** | Cross-section profile presets: circle, square, hex, star, teardrop. Controls: twist, taper, height, wall thickness, surface texture (smooth/ribbed/wavy/honeycomb). |
| **Bin & Sorting Tray Generator** | Grid dimensions (cols × rows), bin width/depth/height, wall thickness, rounded corners toggle. Instant STL download. |
| **3D Name Plate Generator** | Shape selector: rectangle, oval, badge, rounded-rect. Font + text + mounting holes + raised border. Multi-color print support via separate base and text STL files. |

---

### 3.3 Utility Tools *(Free, No Credits, No Login)*

| Tool | Description |
|---|---|
| **3D Model Viewer** | Drag-and-drop STL, OBJ, GLB, GLTF — no upload, 100% in-browser. Geometry stats: vertex count, triangle count, dimensions (mm), estimated volume. Orbit, zoom, pan controls. |
| **Format Converter** | Convert STL ↔ OBJ ↔ GLB ↔ GLTF in-browser. 100% client-side — no files sent to any server. |
| **G-code Viewer** | Upload .gcode file → layer-by-layer visualization. Shows print paths, travel moves, filament usage, estimated print time. Compatible with Cura, PrusaSlicer, Bambu Studio output. |

---

### 3.4 Calculators *(Free, No Login)*

| Calculator | What it computes |
|---|---|
| **3D Print Cost** | material weight × filament cost/kg + electricity + machine wear + time |
| **Resin Print Cost** | volume × resin cost/ml + IPA wash + FEP + failure rate markup |
| **Etsy Profit** | sale price - material - electricity - Etsy fees (6.5% transaction + 3%+25p payment) - shipping - your time = net profit |
| **Print Time Estimator** | volume + layer height + print speed + infill % → estimated hours/minutes |
| **Filament Spool** | enter spool weight → estimate meters remaining. Supports common brand spool weights. |
| **Layer Height** | printer step size → magic numbers for smooth prints |
| **E-Steps** | measured vs expected extrusion → correction value |
| **Material Shrinkage** | scaling factor for ABS, ASA, Nylon, PC, PP — presets included |

---

### 3.5 Auth, Credits & Billing

- **Sign in:** Google OAuth only at launch. No password auth.
- **Free tier:** 10 AI generation credits per month, recurring. All tools and calculators always free.
- **Starter plan:** ₹499/month — 60 credits/month, all export formats, no watermark on GLB
- **Pro plan:** ₹1,499/month — unlimited credits, priority queue, REST API access, batch endpoint
- **Pay-per-use credits:** ₹20/credit for top-ups. 1 credit = 512³ model, 2 credits = 1024³ model.
- **Payments:** Razorpay for all INR payments — UPI, cards, net banking, recurring subscriptions via NACH
- Credit balance shown in header at all times

---

## 4. Key User Stories

| As a… | I want to… | So that… | Acceptance criteria |
|---|---|---|---|
| Hobbyist | Upload a photo of my cat and get a 3D figurine STL | I can print it as a gift | Job completes in < 75s. STL is watertight. I can download without signing in (uses 1 free guest credit). |
| Etsy seller | Use the Etsy Profit Calculator | I price my listings correctly and actually make money | Calculator shows net profit after all Etsy fees, shipping, material, and my hourly rate. No login required. |
| Maker | Use the Lithophane Generator | I create a custom backlit photo panel for my wall | Upload photo → adjust size/thickness → live preview updates → download STL. No login. No credit used. |
| Developer | Access the generation API with my API key | I can generate 3D models inside my own product | POST /v1/generate returns job_id in < 200ms. Webhook fires on completion. Documented at docs.snap3d.io. |
| Any user | View my job history | I can re-download a model I generated last week | Dashboard shows last 30 jobs with thumbnail, status, download links (48-hour presigned URL). |

---

## 5. Phased Roadmap

> **Phase 1 is the only thing that matters for the next 90 days.** Phase 2 does not start until Phase 1 has 200 daily active users.

### Phase 1 — MVP (Days 1–90)
- Image-to-3D and Text-to-3D generation (TRELLIS.2)
- Pet-to-3D and Face-to-3D figurines
- 6 parametric generators: Lithophane, 3D Text, Name Sign, Vase, Bin, Name Plate
- 3 utility tools: 3D Viewer, Format Converter, G-code Viewer
- 8 calculators
- Google auth, credit system, Razorpay billing
- REST API (Pro tier)

### Phase 2 — Growth (Days 91–180, gated on 200 DAU)
- Vehicle-to-3D and Architecture-to-3D specialized pipelines
- 3D Map Maker (city/terrain topography)
- Text Flip / Ambigram 3D Generator
- 3D Puzzle Maker
- Filament Painter (multicolor OBJ export)
- Visual Workflow Editor (node-based ComfyUI-style, build your own pipeline)
- AI Product Listing Generator (Etsy/Shopify SEO copy from 3D model photo)

### Phase 3 — Community (Days 181+, gated on ₹2L MRR)
- User profiles and public model gallery
- Creator model uploads + sales
- Print-on-demand fulfillment integration

### What's Explicitly Deferred Forever (Unless Data Changes Mind)

| Feature | Why deferred |
|---|---|
| Native iOS/Android app | PWA covers mobile. App store = 3-month delay. |
| WhatsApp bot | Significant backend complexity. Not needed for first 200 DAU. |
| Marketplace / community | Requires moderation, trust, and critical mass. Not an MVP problem. |
| WebGL in-browser boolean mesh editor | Months of work. Low early demand. |
| Enterprise / B2B portal | Wrong persona for MVP. Revisit at Month 9. |

---

## 6. Constraints & Non-Negotiables

### 6.1 Time
Phase 1 ships in **90 days** from the day the first engineer starts. Every feature in Section 3 must be live. Scope is fixed — if we can't ship something in time, it moves to Phase 2.

### 6.2 Cost
Infrastructure cost must stay under **₹25,000/month** until the platform reaches ₹50,000 MRR. All infrastructure choices in the Technical Document are optimized for this constraint.

### 6.3 Quality
- AI job success rate must be **≥ 95%** before public launch.
- Parametric generators must produce valid, printable STLs **100% of the time**. A broken tool is worse than a missing tool.

### 6.4 Legal
All AI model dependencies must be **MIT-licensed or LGPL**. No NVIDIA research-license dependencies (`nvdiffrast`, `nvdiffrec`) in the production pipeline. Full license matrix is in the Technical Document.

---

*End of Document — Snap3D MVP PRD v1.0*
