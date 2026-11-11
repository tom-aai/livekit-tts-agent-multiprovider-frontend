'use client';

import {
  type AgentState,
  type ReceivedMessage,
  type TextStreamData,
} from '@livekit/components-react';
import { AgentChatTranscript } from '@/components/agents-ui/agent-chat-transcript';
import { cn } from '@/lib/shadcn/utils';

// The forked STT publishes each caller segment as a text stream. Segments that
// belong to the same utterance carry one shared id under this attribute, so the
// stream handler can update a segment in place as its text grows.
const SEGMENT_ID_ATTRIBUTE = 'lk.segment_id';

/**
 * Turn the text streams from a forked STT topic into the message shape that
 * AgentChatTranscript renders. Every message is marked local, so the transcript
 * aligns it on the caller's side, the same as the primary STT's caller text.
 *
 * The agent opens one stream per transcript update and shares a segment id across
 * a turn's updates (interim then final), so a turn arrives as several streams with
 * the same segment id and growing text. We keep the latest stream per segment, so
 * each turn becomes one message that the final text settles on, rather than a
 * stack of partials under a repeated key.
 */
export function callerStreamsToMessages(streams: TextStreamData[]): ReceivedMessage[] {
  const latestBySegment = new Map<string, TextStreamData>();
  for (const stream of streams) {
    if (stream.text.trim().length === 0) continue;
    const segmentId = stream.streamInfo.attributes?.[SEGMENT_ID_ATTRIBUTE] ?? stream.streamInfo.id;
    const existing = latestBySegment.get(segmentId);
    if (!existing || stream.streamInfo.timestamp >= existing.streamInfo.timestamp) {
      latestBySegment.set(segmentId, stream);
    }
  }

  return [...latestBySegment.entries()].map(([segmentId, stream]) => {
    // AgentChatTranscript reads only id, timestamp, message and from.isLocal.
    // We build that subset and cast, so we do not need a full Participant.
    return {
      id: segmentId,
      timestamp: stream.streamInfo.timestamp,
      type: 'userTranscript',
      message: stream.text,
      from: { isLocal: true, identity: stream.participantInfo.identity },
    } as unknown as ReceivedMessage;
  });
}

/** Merge message lists and order them oldest first by timestamp. */
export function mergeByTimestamp(...lists: ReceivedMessage[][]): ReceivedMessage[] {
  return lists.flat().sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Keep only the most recent human turn and the most recent agent turn, in time
 * order. Each pane then shows just the current exchange, so the two models line
 * up on one turn at a time instead of a long scrolling history.
 */
export function lastExchange(messages: ReceivedMessage[]): ReceivedMessage[] {
  const reversed = [...messages].reverse();
  const lastHuman = reversed.find((m) => m.from?.isLocal);
  const lastAgent = reversed.find((m) => !m.from?.isLocal);
  return [lastHuman, lastAgent]
    .filter((m): m is ReceivedMessage => m !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp);
}

interface TranscriptPaneProps {
  /** Model name shown in the pane heading. */
  title: string;
  /** Short qualifier next to the title, such as "preview". */
  subtitle?: string;
  /** Agent state, so the pane can show the thinking indicator. */
  agentState?: AgentState;
  /** Messages to render, already merged and sorted. */
  messages: ReceivedMessage[];
  className?: string;
}

/** One labeled transcript column. It wraps the shared AgentChatTranscript. */
export function TranscriptPane({
  title,
  subtitle,
  agentState,
  messages,
  className,
}: TranscriptPaneProps) {
  return (
    <div
      className={cn(
        'bg-background/60 flex min-h-0 flex-col overflow-hidden rounded-xl border',
        className
      )}
    >
      <div className="bg-background/80 flex shrink-0 items-baseline justify-between gap-2 border-b px-3 py-2 backdrop-blur-sm">
        <h2 className="truncate text-sm font-semibold">{title}</h2>
        {subtitle && <span className="text-muted-foreground shrink-0 text-xs">{subtitle}</span>}
      </div>
      <AgentChatTranscript
        agentState={agentState}
        messages={messages}
        scrollAnchor="any"
        className="min-h-0 flex-1 **:data-[slot=message-scroller-content]:gap-4 **:data-[slot=message-scroller-content]:p-3"
      />
    </div>
  );
}
