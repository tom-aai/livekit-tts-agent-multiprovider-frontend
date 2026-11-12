'use client';

import { useMemo } from 'react';
import { useTextStream } from '@livekit/components-react';
import { cn } from '@/lib/shadcn/utils';

/** Topic the agent publishes per-turn latency on (Phase 3). */
export const METRICS_TOPIC = 'lk.metrics';

// The agent sends one JSON blob per committed turn on METRICS_TOPIC. Every value
// is a latency in seconds. These describe the primary 3.7 pipeline, the only path
// with an LLM and TTS stage. They are the sequential stages of one response, so the
// three stages sum to the end-to-end total. We read the agent's own metric keys, and
// accept a friendlier alias for each, so the two sides can't drift on a name:
//
//   end_of_turn_delay | end_of_utterance_delay   STT + endpointing wait
//   llm_ttfs          | llm_node_ttfs            LLM to the first sentence
//   tts_ttfb          | tts_node_ttfb            TTS to the first audio frame
//   total_latency     | e2e_latency             stopped speaking -> response
//
// The LLM stage is time to first sentence, not first token: TTS can't start until a
// whole sentence exists. STT compute time (STTMetrics.duration) is not a stage of its
// own; in STT turn-detection mode it runs inside end_of_turn_delay.
interface TurnMetrics {
  endOfTurn?: number;
  llmTtfs?: number;
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
    endOfTurn: num(data.end_of_turn_delay) ?? num(data.end_of_utterance_delay),
    llmTtfs: num(data.llm_ttfs) ?? num(data.llm_node_ttfs),
    ttsTtfb: num(data.tts_ttfb) ?? num(data.tts_node_ttfb),
    totalLatency: num(data.total_latency) ?? num(data.e2e_latency),
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

  // The stages of one response, in order. They sum to the total, so they read left to
  // right as a breakdown of the end-to-end response latency. The turn-handoff and
  // playback glue stages are ~0 for this agent and left out.
  const stages: Array<{ label: string; value: number | undefined }> = [
    { label: 'STT + end of turn', value: metrics?.endOfTurn },
    { label: 'LLM to 1st sentence', value: metrics?.llmTtfs },
    { label: 'TTS to 1st audio', value: metrics?.ttsTtfb },
  ];

  return (
    <div className={cn('bg-background/60 shrink-0 rounded-xl border px-2 py-2', className)}>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
        {stages.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center">
            <dt className="text-muted-foreground text-[10px] tracking-wide uppercase">
              {item.label}
            </dt>
            <dd className="font-mono text-sm font-semibold tabular-nums">{fmtMs(item.value)}</dd>
          </div>
        ))}
        <div className="border-primary/40 flex flex-col items-center border-l pl-3 text-center">
          <dt className="text-foreground text-[10px] font-semibold tracking-wide uppercase">
            Total
          </dt>
          <dd className="font-mono text-sm font-semibold tabular-nums">
            {fmtMs(metrics?.totalLatency)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
