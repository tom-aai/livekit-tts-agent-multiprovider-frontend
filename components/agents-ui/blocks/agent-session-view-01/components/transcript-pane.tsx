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
 * AgentChatTranscript renders. Each stream is one caller segment. Every message
 * is marked local, so the transcript aligns it on the caller's side, the same
 * as the primary STT's caller text.
 */
export function callerStreamsToMessages(streams: TextStreamData[]): ReceivedMessage[] {
  return streams
    .filter((stream) => stream.text.trim().length > 0)
    .map((stream) => {
      const segmentId = stream.streamInfo.attributes?.[SEGMENT_ID_ATTRIBUTE];
      // AgentChatTranscript reads only id, timestamp, message and from.isLocal.
      // We build that subset and cast, so we do not need a full Participant.
      return {
        id: segmentId ?? stream.streamInfo.id,
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
