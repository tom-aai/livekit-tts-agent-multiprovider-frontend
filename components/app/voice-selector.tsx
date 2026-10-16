'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VOICE_GROUPS, type VoiceOption, getVoiceByKey, voiceKey } from '@/lib/voices';

interface VoiceSelectorProps {
  selectedVoice: VoiceOption | null;
  onVoiceChange: (voice: VoiceOption) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceSelector({
  selectedVoice,
  onVoiceChange,
  disabled,
  className,
}: VoiceSelectorProps) {
  return (
    <Select
      value={selectedVoice ? voiceKey(selectedVoice) : undefined}
      onValueChange={(key) => {
        const voice = getVoiceByKey(key);
        if (voice) {
          onVoiceChange(voice);
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger className={className} aria-label="Select a voice">
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-80">
        {VOICE_GROUPS.map((group, index) => (
          <div key={group.provider}>
            {index > 0 && <SelectSeparator />}
            <SelectGroup>
              <SelectLabel>{group.label}</SelectLabel>
              {group.voices.map((voice) => (
                <SelectItem key={voiceKey(voice)} value={voiceKey(voice)}>
                  <span className="font-medium">{voice.label}</span>
                  {voice.description && (
                    <span className="text-muted-foreground text-xs">{voice.description}</span>
                  )}
                </SelectItem>
              ))}
            </SelectGroup>
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
