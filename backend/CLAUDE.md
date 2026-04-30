# Snap3D — Backend Agent

## Stack
| Concern | Choice |
|---|---|
| Framework | FastAPI 0.115, Python 3.11 |
| Hosting | Fly.io — shared-cpu-1x machines, ~$3/month |
| GPU inference | Modal.com serverless — A10G, pay-per-second ($0.000306/s) |
| Database | Supabase (PostgreSQL) — service key for server-side ops |
| Object storage | Cloudflare R2 — S3-compatible, zero egress fees |
| Job queue | Upstash Redis Streams |
| Auth | Supabase JWT + custom API key (blake2b hash stored) |
| Payments | Razorpay webhooks |
| Email | Resend |
| CPU workers | rembg (bg removal) + OpenSCAD CLI (parametric STLs) |
| Package manager | `uv` for fast installs |

## Project layout
```
backend/
├── app/
│   ├── main.py              ← FastAPI app, CORS, router includes
│   ├── routers/
│   │   ├── generate.py      ← POST /v1/generate, GET /v1/jobs/{id}
│   │   ├── tools.py         ← POST /v1/tools/* (lithophane, 3dtext, vase, bin, nameplate)
│   │   ├── auth.py          ← POST/DELETE /v1/auth/keys
│   │   └── billing.py       ← POST /v1/billing/razorpay-webhook
│   ├── workers/
│   │   ├── preprocess.py    ← rembg + center-pad to square
│   │   └── generators.py    ← OpenSCAD CLI wrappers
│   ├── core/
│   │   ├── config.py        ← Pydantic Settings (reads from .env)
│   │   ├── storage.py       ← R2 boto3 client, upload(), presign()
│   │   ├── supabase.py      ← Supabase service client singleton
│   │   └── queue.py         ← Upstash Redis XADD enqueue
│   └── models/
│       └── schemas.py       ← Pydantic request/response models
├── requirements.txt
└── pyproject.toml
```

## API surface (v1)
See Technical_doc.md §6 for full reference. Key endpoints:
- `POST /v1/generate` — accepts multipart with image + params, returns job_id + eta
- `GET /v1/jobs/{job_id}` — poll status, returns presigned asset URLs on completion
- `GET /v1/jobs/{job_id}/stream` — SSE stream with progress 0–100
- `POST /v1/tools/lithophane` — returns STL bytes (CPU, free, no auth)
- `POST /v1/billing/razorpay-webhook` — HMAC-SHA256 validated

## Database schema
Full schema in Technical_doc.md §5. Key tables:
- `profiles` — extends `auth.users`, has `credits` and `plan` columns
- `jobs` — all job types, status lifecycle: queued → processing → complete/failed
- `api_keys` — key_hash (blake2b), key_prefix shown to user
- `subscriptions` — Razorpay sync
- `credit_events` — append-only audit ledger

## Modal.com GPU inference
The `generate_3d` function is defined in `modal_inference.py` (see Technical_doc.md §4).
- GPU: A10G @ $0.000306/s, ~17s avg → ~$0.005/model
- Weights cached in `modal.Volume` — downloaded once (~18GB)
- Call from FastAPI: `await generate_3d.remote.aio(image_bytes, resolution=resolution)`
- Cold start: ~8s (weights cached); scales to zero

## Credit system
- 512³ model = 1 credit, 1024³ = 2 credits
- Atomic decrement in Supabase before enqueueing job
- Append credit_events record for every deduction/grant
- Free tier: 10 credits/month (reset on subscription anniversary)

## Security rules
- API keys: store only blake2b hash + prefix in DB, return full key once at creation
- Razorpay webhooks: always validate HMAC-SHA256 before processing
- User data: RLS enabled on all Supabase tables — service key bypasses RLS intentionally
- Never log full API keys or JWT tokens

## Dev commands
```bash
cd backend
uv venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
cp .env.example .env                   # fill in real credentials
uvicorn app.main:app --reload --port 8000
```
