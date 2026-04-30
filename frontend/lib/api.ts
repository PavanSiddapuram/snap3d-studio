const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface JobQueued {
  job_id: string
  status: "queued"
  eta_seconds: number
  credits_used: number
  poll_url: string
  stream_url: string
}

export interface JobAssets {
  glb: string
  stl: string
  preview: string | null
}

export interface JobResult {
  job_id: string
  status: "queued" | "processing" | "complete" | "failed"
  duration_s: number | null
  assets: JobAssets | null
  mesh: { vertices: number; faces: number } | null
  error: string | null
  created_at: string | null
  completed_at: string | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json()
    return body.detail ?? `HTTP ${res.status}`
  } catch {
    return `HTTP ${res.status}`
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function submitGenerate(
  formData: FormData,
  token?: string,
): Promise<JobQueued> {
  const res = await fetch(`${API_BASE}/v1/generate`, {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function pollJob(jobId: string, token?: string): Promise<JobResult> {
  const res = await fetch(`${API_BASE}/v1/jobs/${jobId}`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function listJobs(token?: string): Promise<JobResult[]> {
  const res = await fetch(`${API_BASE}/v1/jobs`, {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export { API_BASE }
