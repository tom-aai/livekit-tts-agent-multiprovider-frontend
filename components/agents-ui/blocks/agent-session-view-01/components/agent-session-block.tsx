'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, type MotionProps, motion } from 'motion/react';
import {
  useAgent,
  useSessionContext,
  useSessionMessages,
  useTextStream,
} from '@livekit/components-react';
import {
  AgentControlBar,
  type AgentControlBarControls,
} from '@/components/agents-ui/agent-control-bar';
import { cn } from '@/lib/shadcn/utils';
import { MetricsStrip } from './metrics-strip';
import {
  TranscriptPane,
  callerStreamsToMessages,
  lastExchange,
  mergeByTimestamp,
} from './transcript-pane';

/** Topic the agent publishes the forked Universal 3.6 Pro caller transcript on (Phase 2). */
const U3_6_PRO_TOPIC = 'lk.transcription.u3_6_pro';
/**
 * Topic the agent republishes the primary 3.7 caller transcript on, grouped one
 * segment per turn. The default `lk.transcription` path carries the same transcript,
 * but it also forwards chunk-based preflight partials that make the pane flash and
 * fragment, so the right pane reads this steady side topic instead.
 */
const U3_7_PREVIEW_TOPIC = 'lk.transcription.u3_7_preview';

const BOTTOM_VIEW_MOTION_PROPS: MotionProps = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    delay: 0.5,
    ease: 'easeOut',
  },
};

const CHAT_MOTION_PROPS: MotionProps = {
  variants: {
    hidden: {
      opacity: 0,
      transition: {
        ease: 'easeOut',
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        ease: 'easeOut',
        duration: 0.3,
      },
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

const SHIMMER_MOTION_PROPS: MotionProps = {
  variants: {
    visible: {
      opacity: 1,
      transition: {
        ease: 'easeIn',
        duration: 0.5,
        delay: 0.8,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        ease: 'easeIn',
        duration: 0.5,
        delay: 0,
      },
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        'from-background pointer-events-none h-4 bg-linear-to-b to-transparent',
        top && 'bg-linear-to-b',
        bottom && 'bg-linear-to-t',
        className
      )}
    />
  );
}

export interface AgentSessionView_01Props {
  /**
   * Message shown above the controls before the first chat message is sent.
   *
   * @default 'Agent is listening, ask it a question'
   */
  preConnectMessage?: string;
  /**
   * Shows a pre-connect buffer state with a shimmer message before messages appear.
   *
   * @default true
   */
  isPreConnectBufferEnabled?: boolean;
  /** Optional class name merged onto the outer `<section>` container. */
  className?: string;
}

export function AgentSessionView_01({
  preConnectMessage = 'Agent is listening, ask it a question',
  isPreConnectBufferEnabled = true,
  ref,
  className,
  ...props
}: React.ComponentProps<'section'> & AgentSessionView_01Props) {
  const session = useSessionContext();
  const { messages } = useSessionMessages(session);
  // Agent speech rides the default path, so useSessionMessages holds it (the
  // non-local messages). Each pane pairs that shared agent speech with its own
  // model's caller transcript, read from a side topic.
  const { textStreams: u3_6_proStreams } = useTextStream(U3_6_PRO_TOPIC);
  const { textStreams: u3_7_previewStreams } = useTextStream(U3_7_PREVIEW_TOPIC);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const { state: agentState } = useAgent();

  // Voice-only UI: no camera, screen share, or transcript toggle button. The
  // transcript panes stay open on their own, so the bar keeps just the mic and
  // End call.
  const controls: AgentControlBarControls = {
    leave: true,
    microphone: true,
    chat: false,
    camera: false,
    screenShare: false,
  };

  // Agent speech is shared by both panes. Each pane pairs it with its own model's
  // caller transcript, read from that model's side topic, then trims to the current
  // exchange so both panes show the same one-turn window.
  const agentMessages = useMemo(() => messages.filter((m) => !m.from?.isLocal), [messages]);
  const u3_6_proMessages = useMemo(
    () => lastExchange(mergeByTimestamp(agentMessages, callerStreamsToMessages(u3_6_proStreams))),
    [agentMessages, u3_6_proStreams]
  );
  const u3_7_previewMessages = useMemo(
    () =>
      lastExchange(mergeByTimestamp(agentMessages, callerStreamsToMessages(u3_7_previewStreams))),
    [agentMessages, u3_7_previewStreams]
  );

  return (
    <section
      ref={ref}
      className={cn('bg-background relative z-10 h-full w-full overflow-hidden', className)}
      {...props}
    >
      <Fade top className="absolute inset-x-4 top-0 z-10 h-40" />
      {/* transcripts: Universal 3.6 Pro (left) and 3.7 Realtime Agent (right) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            {...CHAT_MOTION_PROPS}
            className="absolute inset-x-0 top-0 bottom-[135px] overflow-hidden md:bottom-[170px]"
          >
            <div className="mx-auto flex h-full max-w-5xl flex-col gap-2 px-2 pt-28 pb-2 md:gap-3 md:px-4 md:pt-32">
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                <TranscriptPane
                  title="Universal 3.6 Pro"
                  subtitle="(agent doesn't see, just prints transcript)"
                  agentState={agentState}
                  messages={u3_6_proMessages}
                />
                <TranscriptPane
                  title="AAI 3.7 Realtime Agent"
                  subtitle="(sent to agent, used to drive conversation)"
                  agentState={agentState}
                  messages={u3_7_previewMessages}
                />
              </div>
              <MetricsStrip />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom */}
      <motion.div
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="absolute inset-x-3 bottom-0 z-50 md:inset-x-12"
      >
        {/* Pre-connect message */}
        {isPreConnectBufferEnabled && (
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.p
                key="pre-connect-message"
                aria-hidden={messages.length > 0}
                {...SHIMMER_MOTION_PROPS}
                className="shimmer shimmer-duration-2000 pointer-events-none mx-auto block w-full max-w-2xl pb-4 text-center text-sm font-semibold"
              >
                {preConnectMessage}
              </motion.p>
            )}
          </AnimatePresence>
        )}
        <div className="bg-background relative mx-auto max-w-2xl pb-3 md:pb-12">
          <AgentControlBar
            variant="assemblyai"
            controls={controls}
            isChatOpen={isChatOpen}
            isConnected={session.isConnected}
            onDisconnect={session.end}
            onIsChatOpenChange={setIsChatOpen}
          />
        </div>
      </motion.div>
    </section>
  );
}
