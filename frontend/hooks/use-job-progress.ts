"use client"

import { useEffect, useRef, useState } from "react"
import { API_BASE, type JobResult } from "@/lib/api"

export type JobStatus = "queued" | "processing" | "complete" | "failed"

interface SSEEvent {
  status: JobStatus
  progress: number
  stage?: string
  job_id?: string
  error?: string
}

export interface JobProgress {
  progress: number
  status: JobStatus
  stage: string
  result: JobResult | null
  error: string | null
}

// EventSource doesn't support custom headers, so for authenticated SSE the
// backend must accept the session cookie or a ?token= query param.
// For now the SSE endpoint uses the same Depends(get_current_user_id) —
// hook up Supabase session cookies (httpOnly) once auth is integrated.
export function useJobProgress(jobId: string | null): JobProgress {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<JobStatus>("queued")
  const [stage, setStage] = useState("Waiting")
  const [result, setResult] = useState<JobResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!jobId) return

    esRef.current?.close()
    const es = new EventSource(`${API_BASE}/v1/jobs/${jobId}/stream`)
    esRef.current = es

    es.onmessage = (e: MessageEvent) => {
      const data: SSEEvent = JSON.parse(e.data)
      if (data.progress !== undefined) setProgress(data.progress)
      setStatus(data.status)
      if (data.stage) setStage(data.stage)
      if (data.error) setError(data.error)
      if (data.status === "complete" || data.status === "failed") es.close()
    }

    es.onerror = () => es.close()

    return () => {
      es.close()
      esRef.current = null
    }
  }, [jobId])

  return { progress, status, stage, result, error }
}
