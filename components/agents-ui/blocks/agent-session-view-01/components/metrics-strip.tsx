'use client';

import { useMemo } from 'react';
import { useTextStream } from '@livekit/components-react';
import { cn } from '@/lib/shadcn/utils';

/** Topic the agent publishes per-turn latency on (Phase 3). */
export const METRICS_TOPIC = 'lk.metrics';

// The agent sends one JSON blob per committed turn on METRICS_TOPIC. Every value
// is a latency in seconds. We read the agent's own metric keys, and accept a
// friendlier alias for each, so the two sides can't drift on a name:
//
//   transcription_delay
//   end_of_turn_delay   | end_of_utterance
//   llm_node_ttft       | llm_ttft
//   tts_node_ttfb       | tts_ttfb
//   e2e_latency         | total_latency
interface TurnMetrics {
  transcriptionDelay?: number;
  endOfUtterance?: number;
  llmTtft?: number;
  ttsTtfb?: number;
  totalLatency?: number;
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function parseTurnMetrics(raw: string): TurnMetrics | null {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  return {
    transcriptionDelay: num(data.transcription_delay),
    endOfUtterance: num(data.end_of_turn_delay) ?? num(data.end_of_utterance),
    llmTtft: num(data.llm_node_ttft) ?? num(data.llm_ttft),
    ttsTtfb: num(data.tts_node_ttfb) ?? num(data.tts_ttfb),
    totalLatency: num(data.e2e_latency) ?? num(data.total_latency),
  };
}

function fmtMs(seconds: number | undefined): string {
  if (seconds === undefined) return '—';
  return `${Math.round(seconds * 1000).toLocaleString()} ms`;
}

/**
 * A strip of the agent's latency numbers for the most recent turn. The numbers
 * describe the live 3.7 pipeline, the only path with an LLM and TTS stage.
 */
export function MetricsStrip({ className }: { className?: string }) {
  const { textStreams } = useTextStream(METRICS_TOPIC);

  const metrics = useMemo(() => {
    const latest = textStreams
      .slice()
      .sort((a, b) => a.streamInfo.timestamp - b.streamInfo.timestamp)
      .at(-1);
    return latest ? parseTurnMetrics(latest.text) : null;
  }, [textStreams]);

  const items: Array<{ label: string; value: number | undefined }> = [
    { label: 'Transcription', value: metrics?.transcriptionDelay },
    { label: 'End of turn', value: metrics?.endOfUtterance },
    { label: 'LLM TTFT', value: metrics?.llmTtft },
    { label: 'TTS TTFB', value: metrics?.ttsTtfb },
    { label: 'Total turn', value: metrics?.totalLatency },
  ];

  return (
    <div className={cn('bg-background/60 shrink-0 rounded-xl border px-2 py-2', className)}>
      <dl className="grid grid-cols-3 gap-x-3 gap-y-2 sm:grid-cols-5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <dt className="text-muted-foreground text-[10px] tracking-wide uppercase">
              {item.label}
            </dt>
            <dd className="font-mono text-sm font-semibold tabular-nums">{fmtMs(item.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
