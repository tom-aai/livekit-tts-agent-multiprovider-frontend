// Voice catalog for the pre-call voice picker.
//
// The LiveKit Inference providers (Cartesia, Rime, Fish Audio, Inworld, Gradium) are
// reached through `inference.TTS` in the agent, so their `id` is the full LiveKit model
// descriptor in "provider/model:voice" format (see https://docs.livekit.io/agents/models/tts/).
// AssemblyAI voices are not available through LiveKit Inference, so they go through the
// local `assemblyai_tts` plugin and their `id` is just the preset voice name.
//
// The agent receives the selection as JSON `{ provider, voice }` in its job metadata and
// builds the matching TTS. See `src/agent.py` in the companion `livekit-tts-agent` project.

export type VoiceProvider = 'cartesia' | 'rime' | 'fish' | 'inworld' | 'gradium' | 'assemblyai';

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
    provider: 'cartesia',
    label: 'Cartesia',
    model: 'sonic-3.6',
    voices: [
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:a167e0f3-df7e-4d52-a9c3-f949145efdab',
        label: 'Blake',
        description: 'Energetic American male',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc',
        label: 'Jacqueline',
        description: 'Confident, young American female',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:f31cc6a7-c1e8-4764-980c-60a361443dd1',
        label: 'Robyn',
        description: 'Neutral, mature Australian female',
      },
      {
        provider: 'cartesia',
        id: 'cartesia/sonic-3.6:5c5ad5e7-1020-476b-8b91-fdcbe9cc313c',
        label: 'Daniela',
        description: 'Calm, trusting Mexican female',
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
        id: 'inworld/inworld-tts-2:Ashley',
        label: 'Ashley',
        description: 'Warm, natural American female',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Edward',
        label: 'Edward',
        description: 'Fast-talking, emphatic American male',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Olivia',
        label: 'Olivia',
        description: 'Upbeat, friendly British female',
      },
      {
        provider: 'inworld',
        id: 'inworld/inworld-tts-2:Diego',
        label: 'Diego',
        description: 'Soothing, gentle Mexican male',
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
        id: 'gradium/default:4SZHfMpw-p46Ywgs',
        label: 'Harper',
        description: 'Modern, confident and friendly American female',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:6MFfc37kq0sBjBjy',
        label: 'Sterling',
        description: 'Warm, energetic American male with theatrical flair',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:YhIHaAfQ0cQPDV9R',
        label: 'Solène',
        description: 'Bright, warm and enthusiastic French female',
      },
      {
        provider: 'gradium',
        id: 'gradium/default:aBNlTApBeOlVKa23',
        label: 'Lorena',
        description: 'Warm and lively young German female',
      },
    ],
  },
  {
    provider: 'assemblyai',
    label: 'AssemblyAI',
    // Multilingual voice library. These go through the local assemblyai_tts plugin, and the
    // agent passes `id` straight through as the AssemblyAI voice_id, so each uses the "aai-" slug.
    voices: [
      {
        provider: 'assemblyai',
        id: 'aai-isadora',
        label: 'Isadora',
        description: 'A young woman speaking Portuguese with a fairly warm tone.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-cloyd',
        label: 'Cloyd',
        description:
          'An older man with a high-pitched, fast-paced, energetic delivery in British English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-kyla',
        label: 'Kyla',
        description: 'A young woman speaking American English at a fast pace.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-steven',
        label: 'Steven',
        description: 'A middle-aged man speaking Australian English with a fairly even tone.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-april',
        label: 'April',
        description: 'A young woman speaking American English at a fast pace.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-benton',
        label: 'Benton',
        description:
          'An older American man with an energetic delivery and expressive intonation, featuring a nasal quality.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-franciscoborja',
        label: 'Francisco',
        description:
          'A middle-aged man speaking Spanish from Spain with an energetic delivery and soft-spoken, warm, rich tone.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-eira',
        label: 'Eira',
        description: 'Young woman speaking Mexican Spanish with a high-pitched voice.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-donatien',
        label: 'Donatien',
        description:
          'A middle-aged man with a high-pitched, soft-spoken voice and expressive intonation.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-karin',
        label: 'Karin',
        description:
          'A middle-aged woman speaking German with energetic delivery, fast-paced and expressive intonation.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-amerigo',
        label: 'Amerigo',
        description:
          'An energetic, high-pitched, expressive Italian male voice with dynamic intonation.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-titus',
        label: 'Titus',
        description: 'A young man with a deep, low-pitched voice speaking American English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-ewald',
        label: 'Ewald',
        description: 'A middle-aged man speaking American English at a fairly fast pace.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-audrey',
        label: 'Audrey',
        description: 'A middle-aged woman with an even, steady intonation speaks American English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-violet',
        label: 'Violet',
        description:
          'A young woman with a balanced, natural, easy-to-listen-to voice speaking American English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-troy',
        label: 'Troy',
        description:
          'A young man with a soft-spoken, deep, low-pitched voice and expressive intonation of Scottish English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-nash',
        label: 'Nash',
        description: 'A middle-aged man speaking British English with a fairly even tone.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-nancy',
        label: 'Nancy',
        description: 'A middle-aged woman speaking British English with a fairly even tone.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-carrie',
        label: 'Carrie',
        description: 'A middle-aged woman with a soft-spoken delivery in British English.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-magdalena',
        label: 'Magdelena',
        description: 'A young woman with a deep, low-pitched voice speaking German.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-jorg',
        label: 'Jörg',
        description: 'A middle-aged man speaking German with a fairly even tone.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-gunther',
        label: 'Gunther',
        description:
          'A middle-aged man speaking German with expressive intonation and a soft-spoken delivery.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-constanza',
        label: 'Constanza',
        description: 'A young woman speaking Mexican Spanish with an even, steady intonation.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-malvina',
        label: 'Malvina',
        description: 'A soft-spoken middle-aged woman speaking Mexican Spanish.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-oriol',
        label: 'Oriol',
        description: 'A middle-aged man speaking Mexican Spanish at a fairly fast pace.',
      },
      {
        provider: 'assemblyai',
        id: 'aai-antonioluis',
        label: 'Antonio Luis',
        description: 'A deep, low-pitched voice of a middle-aged man speaking Mexican Spanish.',
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
