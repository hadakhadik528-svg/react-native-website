import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  PrayerTimes,
} from 'adhan';
import type { City } from './data/locations';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type Adjustments = Record<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', number>;

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  fajr: 0,
  dhuhr: 0,
  asr: 0,
  maghrib: 0,
  isha: 0,
};

export const METHOD_LABELS: Record<string, string> = {
  auto: 'تلقائي (حسب الدولة)',
  UmmAlQura: 'أم القرى — السعودية',
  Egyptian: 'الهيئة المصرية العامة للمساحة',
  MuslimWorldLeague: 'رابطة العالم الإسلامي',
  Karachi: 'جامعة العلوم الإسلامية — كراتشي',
  Dubai: 'دائرة الشؤون الإسلامية — دبي',
  Kuwait: 'وزارة الأوقاف — الكويت',
  Qatar: 'وزارة الأوقاف — قطر',
  Singapore: 'المجلس الإسلامي — سنغافورة',
  Turkey: 'رئاسة الشؤون الدينية — تركيا',
  NorthAmerica: 'الجمعية الإسلامية بأمريكا الشمالية',
  MoonsightingCommittee: 'لجنة رؤية الهلال',
  Tehran: 'معهد الجيوفيزياء — طهران',
};

export const METHOD_KEYS = [
  'auto',
  'UmmAlQura',
  'Egyptian',
  'MuslimWorldLeague',
  'Karachi',
  'Dubai',
  'Kuwait',
  'Qatar',
  'Singapore',
  'Turkey',
  'NorthAmerica',
  'MoonsightingCommittee',
  'Tehran',
];

function methodParams(key: string): CalculationParameters {
  switch (key) {
    case 'UmmAlQura': return CalculationMethod.UmmAlQura();
    case 'Egyptian': return CalculationMethod.Egyptian();
    case 'Karachi': return CalculationMethod.Karachi();
    case 'Dubai': return CalculationMethod.Dubai();
    case 'Kuwait': return CalculationMethod.Kuwait();
    case 'Qatar': return CalculationMethod.Qatar();
    case 'Singapore': return CalculationMethod.Singapore();
    case 'Turkey': return CalculationMethod.Turkey();
    case 'NorthAmerica': return CalculationMethod.NorthAmerica();
    case 'MoonsightingCommittee': return CalculationMethod.MoonsightingCommittee();
    case 'Tehran': return CalculationMethod.Tehran();
    default: return CalculationMethod.MuslimWorldLeague();
  }
}

const tzCache: Record<string, number> = {};

/** Real UTC offset (minutes) for an IANA timezone right now (handles DST). */
export function tzOffsetMinutes(tz: string, fallback: number): number {
  if (tzCache[tz] !== undefined) return tzCache[tz];
  let off = fallback;
  try {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const map: Record<string, string> = {};
    fmt.formatToParts(now).forEach((p) => {
      map[p.type] = p.value;
    });
    const hour = map.hour === '24' ? 0 : Number(map.hour);
    const asUTC = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      hour,
      Number(map.minute),
      Number(map.second)
    );
    off = Math.round((asUTC - now.getTime()) / 60000);
  } catch {
    off = fallback;
  }
  tzCache[tz] = off;
  return off;
}

const FALLBACK_OFFSETS: Record<string, number> = {
  'Asia/Riyadh': 180, 'Africa/Cairo': 120, 'Africa/Algiers': 60, 'Africa/Casablanca': 60,
  'Africa/Tunis': 60, 'Africa/Tripoli': 120, 'Asia/Hebron': 120, 'Asia/Gaza': 120,
  'Asia/Amman': 180, 'Asia/Beirut': 120, 'Asia/Damascus': 180, 'Asia/Baghdad': 180,
  'Asia/Kuwait': 180, 'Asia/Qatar': 180, 'Asia/Bahrain': 180, 'Asia/Dubai': 240,
  'Asia/Muscat': 240, 'Asia/Aden': 180, 'Africa/Khartoum': 120, 'Africa/Mogadishu': 180,
  'Europe/Istanbul': 180, 'Asia/Kuala_Lumpur': 480, 'Asia/Jakarta': 420, 'Asia/Karachi': 300,
  'Europe/London': 0, 'Europe/Paris': 60, 'Europe/Berlin': 60, 'America/New_York': -300,
  'America/Chicago': -360, 'America/Detroit': -300, 'America/Los_Angeles': -480,
  'America/Toronto': -300, 'America/Vancouver': -480, 'America/Edmonton': -420,
  'Australia/Sydney': 600, 'Australia/Melbourne': 600, 'Australia/Brisbane': 600,
  'Australia/Perth': 480,
};

export function cityOffset(city: City): number {
  return tzOffsetMinutes(city.tz, FALLBACK_OFFSETS[city.tz] ?? 0);
}

export interface PrayerItem {
  key: PrayerKey;
  name: string;
  icon: string;
  time: Date; // absolute moment (adjustments applied)
}

const PRAYER_NAMES: Record<PrayerKey, string> = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

const PRAYER_ICONS: Record<PrayerKey, string> = {
  fajr: 'cloudy-night',
  sunrise: 'sunny-outline',
  dhuhr: 'sunny',
  asr: 'partly-sunny',
  maghrib: 'sunset',
  isha: 'moon',
};

function addMinutes(d: Date, m: number): Date {
  return new Date(d.getTime() + m * 60000);
}

/** City calendar date parts for "now". */
export function cityDateParts(city: City, at: number = Date.now()): { y: number; m: number; d: number } {
  const off = cityOffset(city);
  const local = new Date(at + off * 60000);
  return { y: local.getUTCFullYear(), m: local.getUTCMonth(), d: local.getUTCDate() };
}

export function computePrayerTimes(
  city: City,
  methodKey: string,
  defaultMethod: string,
  adjustments: Adjustments,
  dayShift: number = 0,
  at: number = Date.now()
): PrayerItem[] {
  const parts = cityDateParts(city, at);
  const base = new Date(parts.y, parts.m, parts.d + dayShift, 12, 0, 0);
  const coords = new Coordinates(city.lat, city.lng);
  const key = methodKey === 'auto' ? defaultMethod : methodKey;
  const params = methodParams(key);
  const pt = new PrayerTimes(coords, base, params);
  return [
    { key: 'fajr', name: PRAYER_NAMES.fajr, icon: PRAYER_ICONS.fajr, time: addMinutes(pt.fajr, adjustments.fajr) },
    { key: 'sunrise', name: PRAYER_NAMES.sunrise, icon: PRAYER_ICONS.sunrise, time: pt.sunrise },
    { key: 'dhuhr', name: PRAYER_NAMES.dhuhr, icon: PRAYER_ICONS.dhuhr, time: addMinutes(pt.dhuhr, adjustments.dhuhr) },
    { key: 'asr', name: PRAYER_NAMES.asr, icon: PRAYER_ICONS.asr, time: addMinutes(pt.asr, adjustments.asr) },
    { key: 'maghrib', name: PRAYER_NAMES.maghrib, icon: PRAYER_ICONS.maghrib, time: addMinutes(pt.maghrib, adjustments.maghrib) },
    { key: 'isha', name: PRAYER_NAMES.isha, icon: PRAYER_ICONS.isha, time: addMinutes(pt.isha, adjustments.isha) },
  ];
}

export interface NextPrayerInfo {
  item: PrayerItem;
  remainingMs: number;
  isTomorrow: boolean;
}

export function getNextPrayer(
  city: City,
  methodKey: string,
  defaultMethod: string,
  adjustments: Adjustments,
  at: number = Date.now()
): NextPrayerInfo {
  const today = computePrayerTimes(city, methodKey, defaultMethod, adjustments, 0, at);
  const candidates = today.filter((p) => p.key !== 'sunrise');
  for (const p of candidates) {
    if (p.time.getTime() > at) {
      return { item: p, remainingMs: p.time.getTime() - at, isTomorrow: false };
    }
  }
  const tomorrow = computePrayerTimes(city, methodKey, defaultMethod, adjustments, 1, at);
  const fajr = tomorrow.find((p) => p.key === 'fajr')!;
  return { item: fajr, remainingMs: fajr.time.getTime() - at, isTomorrow: true };
}

export function formatClock(d: Date, city: City): string {
  const off = cityOffset(city);
  const local = new Date(d.getTime() + off * 60000);
  let h = local.getUTCHours();
  const m = local.getUTCMinutes();
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function hijriDate(at: number = Date.now()): string {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(at));
  } catch {
    return '';
  }
}

export function gregorianDate(at: number = Date.now()): string {
  try {
    return new Intl.DateTimeFormat('ar', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(at));
  } catch {
    const d = new Date(at);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }
}
