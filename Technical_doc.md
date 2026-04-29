# Snap3D — Technical Document
**Engineering Reference · Low-Cost Infrastructure · v1.0**

> **Cost constraint:** Full infrastructure must run for under **₹15,000/month** until the platform crosses ₹50,000 MRR. Every architecture decision in this document is made with this constraint as a hard requirement.

---

## 1. Technology Stack Decisions

> **Principle:** Use the free tier of every managed service until revenue justifies upgrading. Modal.com for GPU inference is pay-per-second — you pay literally nothing when no jobs are running.

| Layer | Choice | Why | Free / cost tier |
|---|---|---|---|
| Frontend | Next.js 14 App Router | SSR for SEO-critical tool pages. RSC for fast dashboards. | Vercel Hobby: free (up to 100GB bandwidth) |
| API server | FastAPI (Python 3.11) | Async, fast, Pydantic validation, great ML ecosystem. | Fly.io: free tier — 3 shared-cpu-1x machines |
| GPU inference | Modal.com serverless | Pay per second. A10G = $0.000306/sec. Zero idle cost. | ~$0.005/model at 17s. Scales to zero. |
| CPU workers | Fly.io machines (shared) | Cheap shared CPU for rembg, generators, slicer. | ~$3/month for 2 always-on shared machines |
| Database | Supabase (PostgreSQL) | Managed Postgres with auth, realtime, edge functions. | Free tier: 500MB DB, 1GB storage, 50MB file uploads |
| Job queue | Upstash Redis | Serverless Redis. Per-command pricing, not per-hour. | Free: 10K commands/day. $10/month after that. |
| Object storage | Cloudflare R2 | Zero egress fees. S3-compatible API. | Free: 10GB/month storage, 10M Class A ops |
| Auth | Supabase Auth + Google OAuth | Supabase Auth is free, handles JWTs natively. | Included in Supabase free tier |
| Payments | Razorpay | Native INR, UPI, NACH subscriptions, zero setup cost. | 2% per transaction. No monthly fee. |
| Monitoring | Grafana Cloud | Free 10,000 metrics/month, 50GB logs. | Free tier sufficient for MVP |
| Email | Resend | Transactional email API. Clean SDK. | Free: 3,000 emails/month |

**Total infrastructure cost:**
- At zero users (day 1): ~$0/month (everything on free tiers)
- At 300 models/day: ~$45/month GPU + $10 Redis + $3 Fly workers = ~$58/month (~₹4,800) — well within ₹15,000 constraint

---

## 2. System Architecture

### 2.1 Request Flow — AI Generation Job

```
Browser → POST /v1/generate (image + params)
    ↓
[Cloudflare WAF] ← rate limit by IP + API key
    ↓
[FastAPI on Fly.io]
    1. validate_image(file)          # format, size, NSFW check
    2. check_credit_balance(user)    # Supabase atomic decrement
    3. upload_to_r2(file)            # raw input stored
    4. insert job record (Supabase)  # status: 'queued'
    5. XADD to Upstash Redis stream  # enqueue for CPU worker
    6. return { job_id, eta_seconds: 25 }
    ↓
[CPU Worker — Fly.io shared machine]
    1. rembg.remove(image)           # background removal
    2. resize + center-pad to 1024x1024
    3. upload preprocessed image to R2
    4. call Modal.com GPU endpoint   # HTTP call, async
    ↓
[Modal.com GPU — A10G, pay-per-second]
    1. Trellis2ImageTo3DPipeline.run(image, resolution=1024)
    2. mesh.simplify(500_000)        # CuMesh
    3. o_voxel.postprocess.to_glb()  # MIT-clean path
    4. POST result back to CPU worker callback URL
    ↓
[CPU Worker — completion]
    1. upload GLB + STL to R2
    2. update job status → 'complete' in Supabase
    3. fire webhook if registered
    4. publish SSE event for browser polling
    ↓
Browser receives SSE → shows download buttons
```

### 2.2 Why Modal.com Instead of RunPod

| Criterion | Modal.com | RunPod Serverless |
|---|---|---|
| Billing model | Per second — $0.000306/s on A10G | Per second, similar rate |
| Cold start | ~8s (weights cached in volume) | ~90s (must spin up machine) |
| Idle cost | $0 — truly scales to zero | $0 if serverless, else ~$1/hr |
| Code deployment | Push Python function directly (no Docker) | Docker image required |
| Weights caching | `modal.Volume` persists across calls | Must bake into image or mount |
| Dev experience | Local testing with `modal run` | Requires API + Docker push loop |

**Verdict:** Modal is correct for MVP — faster iteration, zero idle cost. RunPod is better at high sustained volume.

> At 300 models/day × 17 seconds inference at $0.000306/s = $1.56/day = $47/month. At 0 models (nights/weekends), cost is exactly $0.

---

## 3. Project Structure

```
snap3d/
├── apps/
│   ├── web/                          # Next.js 14 (Vercel)
│   │   ├── app/
│   │   │   ├── (marketing)/          # /, /tools, /pricing — SSR, SEO
│   │   │   ├── (app)/                # /dashboard, /generate — client
│   │   │   │   ├── generate/
│   │   │   │   │   ├── image/page.tsx
│   │   │   │   │   └── text/page.tsx
│   │   │   │   ├── tools/            # one page per tool
│   │   │   │   │   ├── lithophane/page.tsx
│   │   │   │   │   ├── 3d-text/page.tsx
│   │   │   │   │   ├── vase/page.tsx
│   │   │   │   │   └── ...
│   │   │   │   └── dashboard/page.tsx
│   │   │   └── api/                  # Next.js API routes (thin BFF)
│   │   ├── components/
│   │   │   ├── ModelViewer.tsx       # React Three Fiber
│   │   │   ├── GenerateForm.tsx
│   │   │   ├── JobProgress.tsx       # SSE subscriber
│   │   │   └── tools/               # one component per tool
│   │   └── lib/
│   │       ├── api.ts                # typed API client
│   │       └── supabase.ts           # Supabase browser client
│   │
│   └── api/                          # FastAPI (Fly.io)
│       ├── routers/
│       │   ├── generate.py           # /v1/generate, /v1/jobs/{id}
│       │   ├── tools.py              # /v1/tools/* (litho, text, vase...)
│       │   ├── auth.py               # /v1/auth/keys
│       │   └── billing.py            # Razorpay webhooks
│       ├── workers/
│       │   ├── preprocess.py         # rembg + normalize (CPU, Fly.io)
│       │   └── generators.py         # litho, text, vase, bin (CPU, Fly.io)
│       ├── modal_inference.py        # Modal.com GPU function definition
│       ├── core/
│       │   ├── config.py             # Pydantic Settings
│       │   ├── storage.py            # R2 client (boto3)
│       │   ├── queue.py              # Upstash Redis Streams
│       │   └── supabase.py           # Supabase service client
│       └── models/
│           └── schemas.py            # Pydantic request/response models
│
├── .github/workflows/
│   ├── deploy-web.yml                # Vercel (auto on push to main)
│   ├── deploy-api.yml                # flyctl deploy
│   └── deploy-modal.yml             # modal deploy
└── docker-compose.yml               # local dev: postgres + redis
```

---

## 4. Modal.com GPU Inference

### 4.1 Function Definition

```python
# modal_inference.py
import modal

# Persistent volume for model weights — downloaded once, reused forever
weights_volume = modal.Volume.from_name('trellis2-weights', create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version='3.11')
    .run_commands(
        'pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124',
        'pip install trellis2 o_voxel cumesh rembg pillow',
    ))

app = modal.App('snap3d-inference')

@app.function(
    image=image,
    gpu=modal.gpu.A10G(),
    volumes={'/weights': weights_volume},
    timeout=120,
    retries=modal.Retries(max_retries=2, backoff_coefficient=1.0),
    scaledown_window=60,  # keep warm for 60s after last call
)
def generate_3d(image_bytes: bytes, resolution: int = 1024, poly_budget: str = 'medium') -> dict:
    import os, io
    from PIL import Image
    from trellis2.pipelines import Trellis2ImageTo3DPipeline
    import o_voxel, torch

    # Load pipeline — cached in container memory after first call
    if not hasattr(generate_3d, '_pipeline'):
        generate_3d._pipeline = Trellis2ImageTo3DPipeline.from_pretrained(
            '/weights/TRELLIS.2-4B'
        )
        generate_3d._pipeline.cuda()

    image = Image.open(io.BytesIO(image_bytes))
    poly_targets = {'high': 2_000_000, 'medium': 500_000, 'low': 150_000}

    with torch.cuda.amp.autocast():
        mesh = generate_3d._pipeline.run(image, resolution=resolution)[0]
        mesh.simplify(poly_targets[poly_budget])

    glb = o_voxel.postprocess.to_glb(
        vertices=mesh.vertices,
        faces=mesh.faces,
        attr_volume=mesh.attrs,
        coords=mesh.coords,
        attr_layout=mesh.layout,
        voxel_size=mesh.voxel_size,
        aabb=[[-0.5,-0.5,-0.5],[0.5,0.5,0.5]],
        decimation_target=poly_targets[poly_budget],
        texture_size=4096,
        remesh=True,
        verbose=False,
    )
    glb_bytes = glb.export(extension_webp=True)
    return {'glb_bytes': glb_bytes, 'vertices': len(mesh.vertices), 'triangles': len(mesh.faces)}
```

### 4.2 Calling Modal from FastAPI

```python
# routers/generate.py
from modal_inference import generate_3d  # imports the Modal function handle

@router.post('/v1/generate')
async def create_job(image: UploadFile, resolution: int = 1024, background_tasks: BackgroundTasks = None):
    user = get_current_user()
    deduct_credit(user.id, cost=1 if resolution==512 else 2)
    image_bytes = await image.read()
    preprocessed = remove_background_and_resize(image_bytes)  # CPU, in-process
    job = db.create_job(user_id=user.id, status='queued')
    background_tasks.add_task(run_inference_and_save, job.id, preprocessed, resolution)
    return {'job_id': job.id, 'eta_seconds': 25 if resolution==512 else 50}

async def run_inference_and_save(job_id, image_bytes, resolution):
    try:
        # .remote() calls the Modal function — awaitable, returns when GPU done
        result = await generate_3d.remote.aio(image_bytes, resolution=resolution)
        glb_key = f'assets/{job_id}/model.glb'
        r2.upload(glb_key, result['glb_bytes'])
        db.complete_job(job_id, glb_key=glb_key, mesh_stats=result)
    except Exception as e:
        db.fail_job(job_id, error=str(e))
```

---

## 5. Database Schema (Supabase / PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    plan         TEXT NOT NULL DEFAULT 'free',   -- free | starter | pro
    credits      INT  NOT NULL DEFAULT 10,
    created_at   TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security: users can only read/update their own row
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY 'own profile' ON profiles USING (auth.uid() = id);

-- API Keys (hashed storage)
CREATE TABLE api_keys (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
    key_hash    TEXT UNIQUE NOT NULL,       -- blake2b of full key
    key_prefix  TEXT NOT NULL,             -- 's3_live_xxxx' — shown to user
    name        TEXT,
    last_used   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Jobs (all job types in one table)
CREATE TABLE jobs (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID REFERENCES profiles(id),
    job_type     TEXT NOT NULL,            -- image_to_3d | text_to_3d | pet | face
    status       TEXT NOT NULL DEFAULT 'queued',
    resolution   INT  DEFAULT 1024,
    poly_budget  TEXT DEFAULT 'medium',
    style_preset TEXT,
    input_r2_key TEXT,
    glb_r2_key   TEXT,
    stl_r2_key   TEXT,
    error_msg    TEXT,
    credits_used INT  DEFAULT 2,
    duration_ms  INT,
    mesh_vertices INT,
    mesh_faces   INT,
    created_at   TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_jobs_user   ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);

-- Subscriptions (Razorpay sync)
CREATE TABLE subscriptions (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID REFERENCES profiles(id) UNIQUE,
    razorpay_sub_id     TEXT UNIQUE,
    plan                TEXT,
    status              TEXT,              -- active | cancelled | past_due
    credits_per_month   INT,
    current_period_end  TIMESTAMPTZ,
    updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Credit ledger (append-only audit trail)
CREATE TABLE credit_events (
    id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id  UUID REFERENCES profiles(id),
    delta    INT  NOT NULL,               -- positive = add, negative = use
    reason   TEXT NOT NULL,               -- 'monthly_grant' | 'job_deduct' | 'topup' | 'refund'
    ref_id   TEXT,                        -- job_id or razorpay_order_id
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. API Reference

### 6.1 Authentication

All API calls require either a **session JWT** (from Supabase Auth, for web app) or an **API key** in the `X-Snap3D-Key` header (for programmatic access). API keys are hashed in the DB — if a key is leaked, it can be revoked instantly.

### 6.2 Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/v1/generate` | Key or JWT | Submit image or text for 3D generation. Returns `job_id` + eta. |
| GET | `/v1/jobs/{job_id}` | Key or JWT | Poll job status. Returns asset URLs on completion. |
| GET | `/v1/jobs/{job_id}/stream` | Key or JWT | SSE stream: pushes progress 0–100 + final result. |
| GET | `/v1/jobs` | JWT | List last 50 jobs for current user. |
| POST | `/v1/tools/lithophane` | None (free) | Generate lithophane STL from uploaded image. |
| POST | `/v1/tools/3dtext` | None (free) | Generate 3D text STL. Body: `{text, font, depth_mm}`. |
| POST | `/v1/tools/vase` | None (free) | Generate vase STL. Body: `{profile, twist, height, texture}`. |
| POST | `/v1/tools/bin` | None (free) | Generate bin/tray STL. Body: `{cols, rows, width, depth, height}`. |
| POST | `/v1/tools/nameplate` | None (free) | Generate name plate STL. Body: `{text, shape, font}`. |
| GET | `/v1/credits` | JWT | Get current credit balance and usage history. |
| POST | `/v1/auth/keys` | JWT | Create a new API key. Returns key once — not stored. |
| DELETE | `/v1/auth/keys/{id}` | JWT | Revoke an API key. |
| POST | `/v1/webhooks` | JWT (Pro) | Register webhook URL for `job.complete` / `job.failed` events. |
| POST | `/v1/billing/razorpay-webhook` | Razorpay sig | Handle subscription + payment events. |

### 6.3 Generate Request / Response

```
# POST /v1/generate — multipart/form-data
# Fields:
#   image        UploadFile   JPEG/PNG/WEBP max 10MB (required for image modes)
#   prompt       str          Text description (required for text mode)
#   job_type     str          image_to_3d | text_to_3d | pet | face (default: image_to_3d)
#   resolution   int          512 | 1024 (default: 1024)
#   poly_budget  str          low | medium | high (default: medium)
#   style_preset str          realistic | cartoon | mechanical | organic | chibi
#   webhook_url  str          Optional HTTPS URL

# 202 Accepted response:
{
  "job_id": "uuid-v4",
  "status": "queued",
  "eta_seconds": 25,
  "credits_used": 2,
  "poll_url": "https://api.snap3d.io/v1/jobs/{job_id}",
  "stream_url": "https://api.snap3d.io/v1/jobs/{job_id}/stream"
}

# Completed job response (on poll or webhook):
{
  "job_id": "uuid-v4",
  "status": "complete",
  "duration_s": 17.4,
  "assets": {
    "glb":     "https://r2.snap3d.io/assets/{job_id}/model.glb?X-Amz-Expires=172800",
    "stl":     "https://r2.snap3d.io/assets/{job_id}/model.stl?...",
    "preview": "https://pub.snap3d.io/assets/{job_id}/thumb.jpg"
  },
  "mesh": {
    "vertices": 482031,
    "faces":    498210
  }
}
```

---

## 7. Frontend — Key Implementation Notes

### 7.1 3D Viewer Component

```tsx
// components/ModelViewer.tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, useProgress, Html } from '@react-three/drei'
import { Suspense } from 'react'

function Loader() {
  const { progress } = useProgress()
  return <Html center><p style={{color:'white'}}>{Math.round(progress)}% loaded</p></Html>
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} dispose={null} />
}

export function ModelViewer({ glbUrl, height = 400 }: { glbUrl: string, height?: number }) {
  return (
    <Canvas style={{ height, borderRadius: 12 }} camera={{ position: [0, 0.5, 2.5], fov: 42 }} gl={{ antialias: true }}>
      <Environment preset='studio' />
      <ambientLight intensity={0.4} />
      <Suspense fallback={<Loader />}>
        <Model url={glbUrl} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={0.5} maxDistance={8} />
    </Canvas>
  )
}
```

### 7.2 SSE Job Polling Hook

```ts
// lib/useJobProgress.ts
import { useState, useEffect } from 'react'

export function useJobProgress(jobId: string | null) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'queued'|'processing'|'complete'|'failed'>('queued')
  const [result, setResult] = useState<JobResult | null>(null)

  useEffect(() => {
    if (!jobId) return
    const es = new EventSource(`/api/jobs/${jobId}/stream`)
    es.onmessage = (e) => {
      const data = JSON.parse(e.data)
      setProgress(data.progress ?? progress)
      setStatus(data.status)
      if (data.status === 'complete') { setResult(data); es.close() }
      if (data.status === 'failed')   { es.close() }
    }
    return () => es.close()
  }, [jobId])

  return { progress, status, result }
}
```

### 7.3 SEO Strategy for Tool Pages

Each tool page must be **server-rendered** (Next.js App Router, no `'use client'` at page level). The `metadata` object for each tool page should include a targeted long-tail keyword as the title tag.

| Tool page | Target keyword | Monthly search volume (est.) |
|---|---|---|
| `/tools/lithophane` | free lithophane generator | 8,000–12,000 |
| `/tools/3d-text` | free 3d text generator stl | 5,000–8,000 |
| `/tools/vase` | custom 3d printable vase generator | 2,000–4,000 |
| `/tools/etsy-calculator` | etsy 3d printing profit calculator | 3,000–5,000 |
| `/tools/print-cost` | 3d print cost calculator | 6,000–10,000 |
| `/tools/filament-spool` | filament spool calculator | 4,000–6,000 |
| `/generate/image` | image to 3d model free | 15,000–25,000 |
| `/generate/text` | text to 3d model generator | 10,000–18,000 |

> Free tools with no login = indexed, linked, shared. The calculator and generator pages are the **SEO moat**. Each one is a backlink target from r/3Dprinting and 3D printing YouTube channels.

---

## 8. Parametric Generator Implementation

### 8.1 Technology Choices

| Generator | Backend tech | Why | CPU time |
|---|---|---|---|
| Lithophane | Python: Pillow + NumPy → custom STL writer | Direct pixel-to-height-map, no dependencies | < 3s |
| 3D Text + Name Sign + Name Plate | OpenSCAD CLI — `text()` + `linear_extrude()` | Mature, supports any font, Boolean ops | < 5s |
| Vase Generator | OpenSCAD CLI — parametric profile + `rotate_extrude()` | Clean parametric math, SVG profile import | < 4s |
| Bin / Sorting Tray | OpenSCAD CLI — `cube()` Boolean grid | Reliable geometry, no edge cases | < 3s |
| 3D Model Viewer | client-side: three.js STLLoader/GLTFLoader | Zero server cost — runs in browser | 0 (client) |
| Format Converter | client-side: three.js + custom exporters | 100% private, zero upload, zero cost | 0 (client) |
| G-code Viewer | client-side: custom G-code parser + Canvas | Proven approach (GCodeViewer.com) | 0 (client) |

### 8.2 OpenSCAD Worker Pattern

```python
# workers/generators.py
import subprocess, tempfile, os

def run_openscad(scad_code: str, output_format='stl') -> bytes:
    with tempfile.TemporaryDirectory() as tmpdir:
        scad_path = os.path.join(tmpdir, 'model.scad')
        out_path  = os.path.join(tmpdir, f'model.{output_format}')
        with open(scad_path, 'w') as f:
            f.write(scad_code)
        result = subprocess.run(
            ['openscad', '-o', out_path, scad_path],
            capture_output=True, timeout=30
        )
        if result.returncode != 0:
            raise ValueError(f'OpenSCAD error: {result.stderr.decode()}')
        with open(out_path, 'rb') as f:
            return f.read()

def generate_3d_text(text: str, font: str, depth_mm: float) -> bytes:
    scad = f"""
linear_extrude(height={depth_mm})
  text("{text}", font="{font}", size=20, halign="center", valign="center");
"""
    return run_openscad(scad)
```

---

## 9. Infrastructure Cost Model

### 9.1 Cost at Different Scale Points

| Service | 0 users (day 1) | 100 gen/day | 300 gen/day | 1000 gen/day |
|---|---|---|---|---|
| Modal.com GPU (A10G, 17s avg) | $0 | $15/mo | $47/mo | $156/mo |
| Fly.io API + CPU workers | $0 (free tier) | $0 (free tier) | $3/mo | $12/mo |
| Supabase (DB + Auth) | $0 (free tier) | $0 (free tier) | $0 (free tier) | $25/mo (Pro) |
| Upstash Redis | $0 (free tier) | $0 (free tier) | $10/mo | $10/mo |
| Cloudflare R2 | $0 (free tier) | $1/mo | $3/mo | $8/mo |
| Vercel (frontend) | $0 (free tier) | $0 (free tier) | $0 (free tier) | $20/mo (Pro) |
| Resend (email) | $0 (free tier) | $0 (free tier) | $0 (free tier) | $20/mo |
| **TOTAL** | **$0** | **~$16/mo (~₹1,300)** | **~$63/mo (~₹5,200)** | **~$251/mo (~₹20,800)** |

### 9.2 Revenue vs Cost Breakeven

| Scenario | Models/day | Infra cost/mo | Revenue/mo (est.) | Gross margin |
|---|---|---|---|---|
| Day 1 (free tier only) | 50 | ₹0 | ₹0 | — |
| Month 1 (10 paid users) | 80 | ₹1,300 | ₹8,000 | 84% |
| Month 2 (50 paid users) | 150 | ₹2,500 | ₹30,000 | 92% |
| Month 3 (200 paid users) | 300 | ₹5,200 | ₹1,20,000 | 96% |
| Month 6 (1000 paid users) | 1,200 | ₹21,000 | ₹6,00,000 | 97% |

> At 300 gen/day: infrastructure is 3% of revenue. At ₹20 revenue per generation (blended), 300/day = ~₹1,80,000/month revenue.

---

## 10. Environment Variables

| Variable | Example | Where needed |
|---|---|---|
| `SUPABASE_URL` | `https://xxx.supabase.co` | API, workers |
| `SUPABASE_SERVICE_KEY` | `eyJhbGc...` | API server only (admin) |
| `NEXT_PUBLIC_SUPABASE_URL` | same as above | Next.js frontend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Next.js frontend |
| `MODAL_TOKEN_ID` / `MODAL_TOKEN_SECRET` | modal.com API credentials | API (calls Modal) |
| `R2_ACCOUNT_ID` | Cloudflare account ID | API, workers |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Cloudflare R2 credentials | API, workers |
| `R2_BUCKET_NAME` | `snap3d-assets` | API, workers |
| `R2_PUBLIC_URL` | `https://pub.snap3d.io` | API (for public asset URLs) |
| `UPSTASH_REDIS_REST_URL` | `https://xxx.upstash.io` | API |
| `UPSTASH_REDIS_REST_TOKEN` | `AX...` | API |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | `rzp_live_...` | API (billing) |
| `RAZORPAY_WEBHOOK_SECRET` | random hex | API (webhook validation) |
| `RESEND_API_KEY` | `re_...` | API (transactional email) |
| `JWT_SECRET` | 64-byte random hex | API (API key signing) |

---

## 11. Local Development Setup

```bash
# Prerequisites: Python 3.11, Node 20, Docker

# 1. Clone repo
git clone https://github.com/your-org/snap3d && cd snap3d

# 2. Start local Postgres + Redis
docker-compose up -d

# 3. Backend
cd apps/api
pip install uv && uv venv && source .venv/bin/activate
uv pip install -r requirements.txt
cp .env.example .env   # fill in Supabase, R2, Modal creds
uvicorn main:app --reload --port 8000

# 4. Frontend
cd apps/web
npm install
cp .env.local.example .env.local   # fill in Supabase public keys
npm run dev   # starts on localhost:3000

# 5. Modal (GPU inference) — local testing
pip install modal
modal run modal_inference.py::generate_3d --image-path test.jpg
# First run downloads weights to Modal volume (~18GB, one time)

# 6. Run tests
pytest apps/api/tests/ -v
cd apps/web && npm run test
```

---

*End of Document — Snap3D Technical Document v1.0*
