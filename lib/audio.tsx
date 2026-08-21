import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Audio, type AVPlaybackStatus } from 'expo-av';
import { useSettings } from './settings';

export type TrackType = 'adhan' | 'quran';

export interface AudioTrack {
  id: string;
  type: TrackType;
  title: string;
  subtitle: string;
  url: string;
  next?: AudioTrack;
}

interface AudioCtx {
  track: AudioTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  play: (track: AudioTrack) => void;
  togglePlayPause: () => void;
  stop: () => void;
  seekTo: (ms: number) => void;
}

const Ctx = createContext<AudioCtx>({
  track: null,
  isPlaying: false,
  isLoading: false,
  position: 0,
  duration: 0,
  play: () => {},
  togglePlayPause: () => {},
  stop: () => {},
  seekTo: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);
  const trackRef = useRef<AudioTrack | null>(null);
  const volumeRef = useRef({ adhan: settings.adhanVolume, quran: settings.quranVolume });

  useEffect(() => {
    volumeRef.current = { adhan: settings.adhanVolume, quran: settings.quranVolume };
    const t = trackRef.current;
    if (t && soundRef.current) {
      const vol = t.type === 'adhan' ? settings.adhanVolume : settings.quranVolume;
      soundRef.current.setVolumeAsync(vol).catch(() => {});
    }
  }, [settings.adhanVolume, settings.quranVolume]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    }).catch(() => {});
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  const onStatus = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        setIsLoading(false);
        setIsPlaying(false);
      }
      return;
    }
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis);
    setDuration(status.durationMillis ?? 0);
    setIsLoading(status.isBuffering);
    if (status.didJustFinish) {
      const current = trackRef.current;
      if (current?.next) {
        // auto-advance (next surah)
        loadAndPlay(current.next);
      } else {
        setIsPlaying(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unloadCurrent = useCallback(async () => {
    const s = soundRef.current;
    soundRef.current = null;
    if (s) {
      try {
        await s.unloadAsync();
      } catch {
        // ignore
      }
    }
  }, []);

  const loadAndPlay = useCallback(
    async (t: AudioTrack) => {
      await unloadCurrent();
      trackRef.current = t;
      setTrack(t);
      setIsLoading(true);
      setPosition(0);
      setDuration(0);
      try {
        const vol = t.type === 'adhan' ? volumeRef.current.adhan : volumeRef.current.quran;
        const { sound } = await Audio.Sound.createAsync(
          { uri: t.url },
          { shouldPlay: true, volume: vol, progressUpdateIntervalMillis: 500 },
          onStatus
        );
        soundRef.current = sound;
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        setIsPlaying(false);
      }
    },
    [onStatus, unloadCurrent]
  );

  const play = useCallback(
    (t: AudioTrack) => {
      const current = trackRef.current;
      if (current && current.id === t.id) {
        // toggle
        const s = soundRef.current;
        if (!s) {
          loadAndPlay(t);
          return;
        }
        if (isPlaying) {
          s.pauseAsync().catch(() => {});
        } else {
          s.playAsync().catch(() => {});
        }
        return;
      }
      loadAndPlay(t);
    },
    [isPlaying, loadAndPlay]
  );

  const togglePlayPause = useCallback(() => {
    const s = soundRef.current;
    if (!s) return;
    if (isPlaying) {
      s.pauseAsync().catch(() => {});
    } else {
      s.playAsync().catch(() => {});
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    unloadCurrent();
    trackRef.current = null;
    setTrack(null);
    setIsPlaying(false);
    setIsLoading(false);
    setPosition(0);
    setDuration(0);
  }, [unloadCurrent]);

  const seekTo = useCallback((ms: number) => {
    soundRef.current?.setPositionAsync(ms).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ track, isPlaying, isLoading, position, duration, play, togglePlayPause, stop, seekTo }),
    [track, isPlaying, isLoading, position, duration, play, togglePlayPause, stop, seekTo]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio() {
  return useContext(Ctx);
}
