import { surahAudioUrl } from './surahs';

export interface Reciter {
  id: string;
  name: string;
  subtitle: string;
  server: string;
  /** surah numbers NOT available for this reciter (default: all 114 available) */
  missing?: number[];
  colors: [string, string];
}

export const RECITERS: Reciter[] = [
  {
    id: 'islam-sobhi',
    name: 'إسلام صبحي',
    subtitle: 'صوت خاشع يلامس القلوب',
    server: 'https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/',
    missing: [37, 39, 40, 45, 65],
    colors: ['#1B6E4F', '#3FBF8A'],
  },
  {
    id: 'alafasy',
    name: 'مشاري راشد العفاسي',
    subtitle: 'إمام مسجد الكبير بالكويت',
    server: 'https://server8.mp3quran.net/afs/',
    colors: ['#8A6D1F', '#E8C874'],
  },
  {
    id: 'sudais',
    name: 'عبد الرحمن السديس',
    subtitle: 'إمام الحرم المكي الشريف',
    server: 'https://server11.mp3quran.net/sds/',
    colors: ['#155A46', '#2FA87A'],
  },
  {
    id: 'shuraim',
    name: 'سعود الشريم',
    subtitle: 'إمام الحرم المكي الشريف',
    server: 'https://server7.mp3quran.net/shur/',
    colors: ['#3D5A80', '#7FA6D9'],
  },
  {
    id: 'muaiqly',
    name: 'ماهر المعيقلي',
    subtitle: 'إمام الحرم المكي الشريف',
    server: 'https://server12.mp3quran.net/maher/',
    colors: ['#5C3A6E', '#A678C9'],
  },
  {
    id: 'yasser',
    name: 'ياسر الدوسري',
    subtitle: 'إمام جامع الدخيل بالرياض',
    server: 'https://server11.mp3quran.net/yasser/',
    colors: ['#1F6B6B', '#4FC0B0'],
  },
  {
    id: 'ghamdi',
    name: 'سعد الغامدي',
    subtitle: 'قارئ سعودي شهير',
    server: 'https://server7.mp3quran.net/s_gmd/',
    colors: ['#7A4A1F', '#D99A4E'],
  },
  {
    id: 'basit',
    name: 'عبد الباسط عبد الصمد',
    subtitle: 'الحنجرة الذهبية',
    server: 'https://server7.mp3quran.net/basit/',
    colors: ['#6E1F1F', '#C96A5A'],
  },
  {
    id: 'husary',
    name: 'محمود خليل الحصري',
    subtitle: 'شيخ عموم المقارئ المصرية',
    server: 'https://server13.mp3quran.net/husr/',
    colors: ['#2C4A1F', '#7FAF5A'],
  },
  {
    id: 'banna',
    name: 'محمود علي البنا',
    subtitle: 'صوت من السماء',
    server: 'https://server8.mp3quran.net/bna/',
    colors: ['#1F4A6E', '#5A9AC9'],
  },
  {
    id: 'minshawi',
    name: 'محمد صديق المنشاوي',
    subtitle: 'الصوت الباكي',
    server: 'https://server10.mp3quran.net/minsh/',
    colors: ['#4A1F6E', '#9A5AC9'],
  },
  {
    id: 'mustafa',
    name: 'مصطفى إسماعيل',
    subtitle: 'عميد قرّاء مصر',
    server: 'https://server8.mp3quran.net/mustafa/',
    colors: ['#6E5A1F', '#C9B45A'],
  },
  {
    id: 'rifai',
    name: 'هاني الرفاعي',
    subtitle: 'صوت مؤثر من مكة',
    server: 'https://server8.mp3quran.net/hani/',
    colors: ['#1F6E5A', '#5AC9A8'],
  },
  {
    id: 'abbad',
    name: 'فارس عباد',
    subtitle: 'قارئ يمني محبوب',
    server: 'https://server8.mp3quran.net/frs_a/',
    colors: ['#6E3A1F', '#C98A5A'],
  },
  {
    id: 'qatami',
    name: 'ناصر القطامي',
    subtitle: 'صوت يخشع له القلب',
    server: 'https://server6.mp3quran.net/qtm/',
    colors: ['#1F3A6E', '#5A7AC9'],
  },
  {
    id: 'jaleel',
    name: 'خالد الجليل',
    subtitle: 'إمام جامع الأمير سلطان',
    server: 'https://server10.mp3quran.net/jleel/',
    colors: ['#3A6E1F', '#8AC95A'],
  },
  {
    id: 'abkar',
    name: 'إدريس أبكر',
    subtitle: 'قارئ سعودي مؤثر',
    server: 'https://server6.mp3quran.net/abkr/',
    colors: ['#6E1F4A', '#C95A9A'],
  },
  {
    id: 'shatri',
    name: 'أبو بكر الشاطري',
    subtitle: 'صوت نديّ خاشع',
    server: 'https://server11.mp3quran.net/shatri/',
    colors: ['#1F5A6E', '#5AB4C9'],
  },
  {
    id: 'ajmi',
    name: 'أحمد بن علي العجمي',
    subtitle: 'قارئ سعودي متقن',
    server: 'https://server10.mp3quran.net/ajm/',
    colors: ['#5A6E1F', '#B4C95A'],
  },
  {
    id: 'juhany',
    name: 'عبد الله عواد الجهني',
    subtitle: 'إمام المسجد النبوي',
    server: 'https://server13.mp3quran.net/jhn/',
    colors: ['#6E4A3A', '#C99A7A'],
  },
  {
    id: 'ayyub',
    name: 'محمد أيوب',
    subtitle: 'إمام المسجد النبوي',
    server: 'https://server8.mp3quran.net/ayyub/',
    colors: ['#2A6E4A', '#6AC99A'],
  },
  {
    id: 'shuwaie',
    name: 'يوسف الشويعي',
    subtitle: 'قارئ مصري صاعد',
    server: 'https://server9.mp3quran.net/yousef/',
    colors: ['#4A3A6E', '#9A8AC9'],
  },
  {
    id: 'luhaidan',
    name: 'محمد اللحيدان',
    subtitle: 'صوت سعودي خاشع',
    server: 'https://server8.mp3quran.net/lhdan/',
    colors: ['#3A5A2A', '#8AB46A'],
  },
  {
    id: 'tablawi',
    name: 'محمد محمود الطبلاوي',
    subtitle: 'نقيب قرّاء مصر',
    server: 'https://server12.mp3quran.net/tblawi/',
    colors: ['#5A2A3A', '#B46A8A'],
  },
  {
    id: 'waer',
    name: 'حاتم فريد الواعر',
    subtitle: 'صوت مؤثر من ليبيا',
    server: 'https://server11.mp3quran.net/hatem/',
    colors: ['#2A4A5A', '#6A9AB4'],
  },
  {
    id: 'kurdi',
    name: 'رعد محمد الكردي',
    subtitle: 'قارئ عراقي متقن',
    server: 'https://server6.mp3quran.net/kurdi/',
    colors: ['#5A4A2A', '#B49A6A'],
  },
];

export function getReciter(id: string): Reciter | undefined {
  return RECITERS.find((r) => r.id === id);
}

export function isSurahAvailable(reciter: Reciter, n: number): boolean {
  return !reciter.missing || !reciter.missing.includes(n);
}

export function availableSurahCount(reciter: Reciter): number {
  return 114 - (reciter.missing?.length ?? 0);
}

export function reciterSurahUrl(reciter: Reciter, n: number): string {
  return surahAudioUrl(reciter.server, n);
}
