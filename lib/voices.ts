// Voice catalog for the pre-call voice picker.
//
// The LiveKit Inference providers (Cartesia, Rime, Fish Audio, Inworld, Gradium, SpaceXAI) are
// reached through `inference.TTS` in the agent, so their `id` is the full LiveKit model
// descriptor in "provider/model:voice" format (see https://docs.livekit.io/agents/models/tts/).
// AssemblyAI voices are not available through LiveKit Inference, so they go through the
// local `assemblyai_tts` plugin and their `id` is just the preset voice name.
//
// The agent receives the selection as JSON `{ provider, voice }` in its job metadata and
// builds the matching TTS. See `src/agent.py` in the companion `livekit-tts-agent` project.

export type VoiceProvider =
  | 'cartesia'
  | 'rime'
  | 'fish'
  | 'inworld'
  | 'gradium'
  | 'spacexai'
  | 'assemblyai';

export interface VoiceOption {
  /** Agent-facing value: a LiveKit model descriptor, or an AssemblyAI voice name. */
  id: string;
  /** Display name shown in the picker. */
  label: string;
  /** Short description of the voice. */
  description?: string;
  provider: VoiceProvider;
}

export interface VoiceGroup {
  provider: VoiceProvider;
  /** Display name for the provider group. */
  label: string;
  /** TTS model name shown next to the provider (omitted when there is no distinct model). */
  model?: string;
  voices: VoiceOption[];
}

export const VOICE_GROUPS: VoiceGroup[] = [
   {
    provider: 'assemblyai',
    label: 'AssemblyAI',
    // Multilingual voice library. These go through the local assemblyai_tts plugin, and the
    // agent passes `id` straight through as the AssemblyAI voice_id, so each uses the "aai-" slug.
    voices: [
      {
        provider: 'assemblyai',
        id: 'aai-antonioluis',
        label: 'Antonio Luis',
        description: 'A deep, low-pitched voice of a middle-aged man speaking Mexican Spanish.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-audrey',
        label: 'Audrey',
        description: 'A middle-aged woman with an even, steady intonation speaks American English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-carrie',
        label: 'Carrie',
        description: 'A middle-aged woman with a soft-spoken delivery in British English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-eloy',
        label: 'Eloy',
        description: 'An older man with a deep, low-pitched voice speaking British English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-ernest',
        label: 'Ernest',
        description:
          'A middle-aged man speaking fast-paced American English with a high-pitched voice.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-ewald',
        label: 'Ewald',
        description: 'A middle-aged man speaking American English at a fairly fast pace.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-freida',
        label: 'Freida',
        description:
          'A middle-aged woman with expressive intonation, breathy and raspy texture in her British English speech.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-kyla',
        label: 'Kyla',
        description: 'A young woman speaking American English at a fast pace.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-magdalena',
        label: 'Magdelena',
        description: 'A young woman with a deep, low-pitched voice speaking German.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-malvina',
        label: 'Malvina',
        description: 'A soft-spoken middle-aged woman speaking Mexican Spanish.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-steven',
        label: 'Steven',
        description: 'A middle-aged man speaking Australian English with a fairly even tone.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-tito',
        label: 'Tito',
        description: 'A deep, low-pitched voice of a middle-aged man speaking British English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-troy',
        label: 'Troy',
        description:
          'A young man with a soft-spoken, deep, low-pitched voice and expressive intonation of Scottish English.',
      },
    ],
  }, 
  {
    provider: 'cartesia',
    label: 'Cartesia',
    model: 'sonic-3.6',
    voices: [
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:f6ff7c0c-e396-40a9-a70b-f7607edb6937',
        label: 'Emma',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:30894953-bcce-41fe-892c-15ce19c843ff',
        label: 'Parker',
        description: 'Supportive, conversational American male',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:db6b0ed5-d5d3-463d-ae85-518a07d3c2b4',
        label: 'Skylar',
        description: 'Friendly, conversational American female',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:47c38ca4-5f35-497b-b1a3-415245fb35e1',
        label: 'Daniel',
        description: 'Modern, instructional American male',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:ef191366-f52f-447a-a398-ed8c0f2943a1',
        label: 'Archie',
        description: 'Approachable, conversational British male',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:1463a4e1-56a1-4b41-b257-728d56e93605',
        label: 'Hugo',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:dc30854e-e398-4579-9dc8-16f6cb2c19b9',
        label: 'Victoria',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:62ae83ad-4f6a-430b-af41-a9bede9286ca',
        label: 'Gemma',
        description: 'Decisive, professional British female',
      },
    ],
  },
  {
    provider: 'rime',
    label: 'Rime',
    model: 'coda',
    voices: [
      {
        provider: 'rime',
        id: 'rime/coda:astra',
        label: 'Astra',
        description: 'Chipper, upbeat American female',
      },
      {
        provider: 'rime',
        id: 'rime/coda:celeste',
        label: 'Celeste',
        description: 'Chill Gen-Z American female',
      },
      {
        provider: 'rime',
        id: 'rime/coda:luna',
        label: 'Luna',
        description: 'Chill but excitable American female',
      },
      {
        provider: 'rime',
        id: 'rime/coda:lyra',
        label: 'Lyra',
        description: 'Warm, natural American female',
      },
    ],
  },
  {
    provider: 'fish',
    label: 'Fish Audio',
    model: 'drama-3',
    voices: [
      {
        provider: 'fish',
        id: 'fishaudio/drama-3:bf322df2096a46f18c579d0baa36f41d',
        label: 'Adrian',
        description: 'Friendly, casual American male',
      },
      {
        provider: 'fish',
        id: 'fishaudio/drama-3:9a9cf47702da476aa4629e2506d4a857',
        label: 'Hannah',
        description: 'A conversational specialist',
      },
      {
        provider: 'fish',
        id: 'fishaudio/drama-3:79d0bd3e4e5444b18f7b6d89b5927bf1',
        label: 'Jordan',
        description: 'A motivational speaker',
      },
      {
        provider: 'fish',
        id: 'fishaudio/drama-3:e3cd384158934cc9a01029cd7d278634',
        label: 'Laura',
        description: 'A confident female narrator',
      },
    ],
  },
  {
    provider: 'inworld',
    label: 'Inworld',
    model: 'inworld-tts-2',
    voices: [
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Alistair',
        label: 'Alistair',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Clive',
        label: 'Clive',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Maisie',
        label: 'Maisie',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Penelope',
        label: 'Penelope',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Arthur',
        label: 'Arthur',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Jason',
        label: 'Jason',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Sarah',
        label: 'Sarah',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Zoe',
        label: 'Zoe',
      },
    ],
  },
  {
    provider: 'gradium',
    label: 'Gradium',
    model: 'default',
    voices: [
      {
        provider: 'gradium',
        id: 'gradium/default:GgfEkEJtxZR7gnpy',
        label: 'Freya',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:CF0NgaMwHMMrHZn0',
        label: 'Reuben',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:4rdlkbxRv4m3UQTW',
        label: 'Tilly',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:dME3IWyZBvmh1n1q',
        label: 'Toby',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:4SZHfMpw-p46Ywgs',
        label: 'Harper',
        description: 'Modern, confident and friendly American female',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:Bla6SbVMczYnOhfK',
        label: 'Marlowe',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:_6Aslh2DxfmnRLmP',
        label: 'Russell',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:6MFfc37kq0sBjBjy',
        label: 'Sterling',
        description: 'Warm, energetic American male with theatrical flair',
      },
    ],
  },
  {
    provider: 'spacexai',
    label: 'SpaceXAI',
    model: 'tts-1',
    voices: [
      {
        provider: 'spacexai',
        id: 'xai/tts-1:eve',
        label: 'Eve',
        description: 'Energetic, upbeat',
      },
      {
        provider: 'spacexai',
        id: 'xai/tts-1:leo',
        label: 'Leo',
        description: 'Authoritative, strong',
      },
      {
        provider: 'spacexai',
        id: 'xai/tts-1:altair',
        label: 'Altair',
        description: 'Elegant, refined',
      },
      {
        provider: 'spacexai',
        id: 'xai/tts-1:carina',
        label: 'Carina',
        description: 'Soft, empathetic',
      },
      {
        provider: 'spacexai',
        id: 'xai/tts-1:helix',
        label: 'Helix',
        description: 'Bold, dynamic',
      },
      {
        provider: 'spacexai',
        id: 'xai/tts-1:luna',
        label: 'Luna',
        description: 'Gentle, patient',
      },
    ],
  },
];

/** A stable, collision-free key for use as a `<Select>` item value. */
export function voiceKey(voice: Pick<VoiceOption, 'provider' | 'id'>): string {
  return `${voice.provider}__${voice.id}`;
}

const VOICES_BY_KEY = new Map<string, VoiceOption>(
  VOICE_GROUPS.flatMap((group) => group.voices.map((voice) => [voiceKey(voice), voice]))
);

/** Look up a voice by the key produced by `voiceKey`. */
export function getVoiceByKey(key: string): VoiceOption | undefined {
  return VOICES_BY_KEY.get(key);
}

/** The JSON payload the agent reads from its job metadata to configure the TTS. */
export function voiceToAgentMetadata(voice: VoiceOption): string {
  return JSON.stringify({ provider: voice.provider, voice: voice.id });
}
