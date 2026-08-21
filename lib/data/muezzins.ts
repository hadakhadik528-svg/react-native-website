export interface Muezzin {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  colors: [string, string];
}

const AD = 'https://cdn.aladhan.com/audio/adhans/';
const IC = 'https://www.islamcan.com/audio/adhan/';

export const MUEZZINS: Muezzin[] = [
  {
    id: 'alafasy-dubai',
    name: 'مشاري راشد العفاسي',
    subtitle: 'أذان دبي — قناة ون',
    url: `${AD}a4.mp3`,
    colors: ['#8A6D1F', '#E8C874'],
  },
  {
    id: 'alafasy-2',
    name: 'مشاري راشد العفاسي',
    subtitle: 'النسخة الثانية',
    url: `${AD}a7.mp3`,
    colors: ['#1F6B6B', '#4FC0B0'],
  },
  {
    id: 'alafasy-3',
    name: 'مشاري راشد العفاسي',
    subtitle: 'النسخة الثالثة',
    url: `${AD}a9.mp3`,
    colors: ['#155A46', '#2FA87A'],
  },
  {
    id: 'nafees',
    name: 'أحمد النافس',
    subtitle: 'أذان خاشع',
    url: `${AD}a1.mp3`,
    colors: ['#3D5A80', '#7FA6D9'],
  },
  {
    id: 'zahrani',
    name: 'منصور الزهراني',
    subtitle: 'صوت مؤثر من مكة',
    url: `${AD}a11-mansour-al-zahrani.mp3`,
    colors: ['#5C3A6E', '#A678C9'],
  },
  {
    id: 'ozcan',
    name: 'حافظ مصطفى أوزجان',
    subtitle: 'أذان من تركيا',
    url: `${AD}a2.mp3`,
    colors: ['#6E1F1F', '#C96A5A'],
  },
  {
    id: 'khashi-1',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ١',
    url: `${IC}azan1.mp3`,
    colors: ['#2C4A1F', '#7FAF5A'],
  },
  {
    id: 'khashi-2',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ٢',
    url: `${IC}azan2.mp3`,
    colors: ['#1F4A6E', '#5A9AC9'],
  },
  {
    id: 'khashi-3',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ٣',
    url: `${IC}azan4.mp3`,
    colors: ['#4A1F6E', '#9A5AC9'],
  },
  {
    id: 'khashi-4',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ٤',
    url: `${IC}azan5.mp3`,
    colors: ['#6E5A1F', '#C9B45A'],
  },
  {
    id: 'khashi-5',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ٥',
    url: `${IC}azan6.mp3`,
    colors: ['#1F6E5A', '#5AC9A8'],
  },
  {
    id: 'khashi-6',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ٦',
    url: `${IC}azan8.mp3`,
    colors: ['#6E3A1F', '#C98A5A'],
  },
  {
    id: 'khashi-7',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ٧',
    url: `${IC}azan12.mp3`,
    colors: ['#1F3A6E', '#5A7AC9'],
  },
  {
    id: 'khashi-8',
    name: 'أذان خاشع',
    subtitle: 'تسجيل مؤذن حقيقي ٨',
    url: `${IC}azan15.mp3`,
    colors: ['#3A6E1F', '#8AC95A'],
  },
];

export function getMuezzin(id: string): Muezzin | undefined {
  return MUEZZINS.find((m) => m.id === id);
}
