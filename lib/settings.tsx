import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_ADJUSTMENTS, type Adjustments } from './prayer';

export interface Settings {
  countryId: string;
  cityId: string;
  methodKey: string; // 'auto' or method id
  adjustments: Adjustments;
  adhanVolume: number; // 0..1
  quranVolume: number; // 0..1
  readerFontSize: number;
  autoAdhan: boolean;
  autoAdhanMuezzinId: string;
}

const DEFAULTS: Settings = {
  countryId: 'sa',
  cityId: 'c1', // مكة المكرمة
  methodKey: 'auto',
  adjustments: { ...DEFAULT_ADJUSTMENTS },
  adhanVolume: 0.9,
  quranVolume: 0.85,
  readerFontSize: 24,
  autoAdhan: false,
  autoAdhanMuezzinId: 'alafasy-dubai',
};

const KEY = '@sadaqah_jariyah_settings';

interface SettingsCtx {
  settings: Settings;
  loaded: boolean;
  update: (patch: Partial<Settings>) => void;
  setAdjustment: (prayer: keyof Adjustments, value: number) => void;
  resetAdjustments: () => void;
}

const Ctx = createContext<SettingsCtx>({
  settings: DEFAULTS,
  loaded: false,
  update: () => {},
  setAdjustment: () => {},
  resetAdjustments: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSettings({
            ...DEFAULTS,
            ...parsed,
            adjustments: { ...DEFAULT_ADJUSTMENTS, ...(parsed.adjustments || {}) },
          });
        }
      } catch {
        // keep defaults
      }
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback((next: Settings) => {
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const update = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setAdjustment = useCallback(
    (prayer: keyof Adjustments, value: number) => {
      const clamped = Math.max(-60, Math.min(60, value));
      setSettings((prev) => {
        const next = { ...prev, adjustments: { ...prev.adjustments, [prayer]: clamped } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const resetAdjustments = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, adjustments: { ...DEFAULT_ADJUSTMENTS } };
      persist(next);
      return next;
    });
  }, [persist]);

  const value = useMemo(
    () => ({ settings, loaded, update, setAdjustment, resetAdjustments }),
    [settings, loaded, update, setAdjustment, resetAdjustments]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}
