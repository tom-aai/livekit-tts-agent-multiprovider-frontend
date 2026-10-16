'use client';

import { useMemo, useState } from 'react';
import { TokenSource } from 'livekit-client';
import { useSession } from '@livekit/components-react';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { StartAudioButton } from '@/components/agents-ui/start-audio-button';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/ui/sonner';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { type VoiceOption, voiceToAgentMetadata } from '@/lib/voices';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  return null;
}

interface AppProps {
  tokenServerId?: string;
  tokenEndpoint: string;
  agentName?: string;
  isVideoInputSupported: boolean;
}

export function App({ tokenServerId, tokenEndpoint, agentName, isVideoInputSupported }: AppProps) {
  const tokenSource = useMemo(
    () =>
      tokenServerId
        ? TokenSource.developmentTokenServer(tokenServerId)
        : TokenSource.endpoint(tokenEndpoint),
    [tokenServerId, tokenEndpoint]
  );

  // The selected voice must be chosen before the call starts. It is passed to the agent as
  // JSON job metadata, which `useSession` forwards to the token endpoint as the agent
  // dispatch metadata. The agent reads it from `ctx.job.metadata` to build its TTS.
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);

  const sessionOptions = useMemo(() => {
    const options: { agentName?: string; agentMetadata?: string } = {};
    if (agentName) {
      options.agentName = agentName;
    }
    if (selectedVoice) {
      options.agentMetadata = voiceToAgentMetadata(selectedVoice);
    }
    return Object.keys(options).length > 0 ? options : undefined;
  }, [agentName, selectedVoice]);

  const session = useSession(tokenSource, sessionOptions);

  return (
    <AgentSessionProvider session={session}>
      <AppSetup />
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController
          isVideoInputSupported={isVideoInputSupported}
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
        />
      </main>
      <StartAudioButton label="Start Audio" />
      <Toaster
        icons={{
          warning: <WarningIcon weight="bold" />,
        }}
        position="top-center"
        className="toaster group"
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          } as React.CSSProperties
        }
      />
    </AgentSessionProvider>
  );
}
