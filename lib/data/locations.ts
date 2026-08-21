export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tz: string;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  method: string;
  cities: City[];
}

let cid = 0;
function c(name: string, lat: number, lng: number, tz: string): City {
  cid += 1;
  return { id: `c${cid}`, name, lat, lng, tz };
}

export const COUNTRIES: Country[] = [
  {
    id: 'sa', name: 'السعودية', flag: '🇸🇦', method: 'UmmAlQura',
    cities: [
      c('مكة المكرمة', 21.4225, 39.8262, 'Asia/Riyadh'),
      c('المدينة المنورة', 24.5232, 39.5692, 'Asia/Riyadh'),
      c('الرياض', 24.7136, 46.6753, 'Asia/Riyadh'),
      c('جدة', 21.4858, 39.1925, 'Asia/Riyadh'),
      c('الدمام', 26.4207, 50.0888, 'Asia/Riyadh'),
      c('الطائف', 21.2703, 40.4158, 'Asia/Riyadh'),
      c('تبوك', 28.3838, 36.5550, 'Asia/Riyadh'),
      c('بريدة', 26.3578, 43.9656, 'Asia/Riyadh'),
      c('أبها', 18.2464, 42.5117, 'Asia/Riyadh'),
      c('حائل', 27.5219, 41.6907, 'Asia/Riyadh'),
      c('جازان', 16.8892, 42.5611, 'Asia/Riyadh'),
      c('نجران', 17.4917, 44.1322, 'Asia/Riyadh'),
      c('الخرج', 24.1369, 47.3072, 'Asia/Riyadh'),
      c('ينبع', 23.9570, 38.2560, 'Asia/Riyadh'),
    ],
  },
  {
    id: 'eg', name: 'مصر', flag: '🇪🇬', method: 'Egyptian',
    cities: [
      c('القاهرة', 30.0444, 31.2357, 'Africa/Cairo'),
      c('الإسكندرية', 31.2001, 29.9187, 'Africa/Cairo'),
      c('الجيزة', 30.0131, 31.2089, 'Africa/Cairo'),
      c('شبرا الخيمة', 30.1286, 31.2422, 'Africa/Cairo'),
      c('بورسعيد', 31.2653, 32.3019, 'Africa/Cairo'),
      c('السويس', 29.9668, 32.5498, 'Africa/Cairo'),
      c('الأقصر', 25.6872, 32.6396, 'Africa/Cairo'),
      c('أسوان', 24.0889, 32.8998, 'Africa/Cairo'),
      c('المنصورة', 31.0409, 31.3785, 'Africa/Cairo'),
      c('طنطا', 30.7865, 31.0004, 'Africa/Cairo'),
      c('الإسماعيلية', 30.6043, 32.2723, 'Africa/Cairo'),
      c('أسيوط', 27.1809, 31.1837, 'Africa/Cairo'),
      c('الفيوم', 29.3084, 30.8428, 'Africa/Cairo'),
      c('الزقازيق', 30.5877, 31.5020, 'Africa/Cairo'),
      c('دمياط', 31.4165, 31.8133, 'Africa/Cairo'),
      c('سوهاج', 26.5591, 31.6957, 'Africa/Cairo'),
      c('المنيا', 28.1099, 30.7503, 'Africa/Cairo'),
      c('دمنهور', 31.0341, 30.4682, 'Africa/Cairo'),
      c('الغردقة', 27.2579, 33.8116, 'Africa/Cairo'),
      c('مرسى مطروح', 31.3543, 27.2458, 'Africa/Cairo'),
    ],
  },
  {
    id: 'dz', name: 'الجزائر', flag: '🇩🇿', method: 'MuslimWorldLeague',
    cities: [
      c('الجزائر العاصمة', 36.7538, 3.0588, 'Africa/Algiers'),
      c('وهران', 35.6969, -0.6331, 'Africa/Algiers'),
      c('قسنطينة', 36.3650, 6.6147, 'Africa/Algiers'),
      c('عنابة', 36.9000, 7.7667, 'Africa/Algiers'),
      c('البليدة', 36.4701, 2.8277, 'Africa/Algiers'),
      c('باتنة', 35.5560, 6.1742, 'Africa/Algiers'),
      c('سطيف', 36.1911, 5.4137, 'Africa/Algiers'),
      c('تلمسان', 34.8783, -1.3150, 'Africa/Algiers'),
      c('بجاية', 36.7509, 5.0566, 'Africa/Algiers'),
      c('ورقلة', 31.9493, 5.3246, 'Africa/Algiers'),
      c('غرداية', 32.4902, 3.6738, 'Africa/Algiers'),
      c('تمنراست', 22.7850, 5.5228, 'Africa/Algiers'),
    ],
  },
  {
    id: 'ma', name: 'المغرب', flag: '🇲🇦', method: 'MuslimWorldLeague',
    cities: [
      c('الدار البيضاء', 33.5731, -7.5898, 'Africa/Casablanca'),
      c('الرباط', 34.0209, -6.8416, 'Africa/Casablanca'),
      c('فاس', 34.0181, -5.0078, 'Africa/Casablanca'),
      c('مراكش', 31.6295, -7.9811, 'Africa/Casablanca'),
      c('طنجة', 35.7595, -5.8340, 'Africa/Casablanca'),
      c('أكادير', 30.4278, -9.5981, 'Africa/Casablanca'),
      c('مكناس', 33.8935, -5.5473, 'Africa/Casablanca'),
      c('وجدة', 34.6814, -1.9086, 'Africa/Casablanca'),
      c('القنيطرة', 34.2610, -6.5802, 'Africa/Casablanca'),
      c('تطوان', 35.5889, -5.3684, 'Africa/Casablanca'),
      c('العيون', 27.1536, -13.2033, 'Africa/Casablanca'),
      c('الجديدة', 33.2316, -8.5007, 'Africa/Casablanca'),
    ],
  },
  {
    id: 'tn', name: 'تونس', flag: '🇹🇳', method: 'MuslimWorldLeague',
    cities: [
      c('تونس', 36.8065, 10.1815, 'Africa/Tunis'),
      c('صفاقس', 34.7406, 10.7603, 'Africa/Tunis'),
      c('سوسة', 35.8256, 10.6412, 'Africa/Tunis'),
      c('القيروان', 35.6781, 10.0963, 'Africa/Tunis'),
      c('بنزرت', 37.2746, 9.8739, 'Africa/Tunis'),
      c('قابس', 33.8815, 10.0981, 'Africa/Tunis'),
      c('المنستير', 35.7779, 10.8262, 'Africa/Tunis'),
      c('نابل', 36.4561, 10.7376, 'Africa/Tunis'),
    ],
  },
  {
    id: 'ly', name: 'ليبيا', flag: '🇱🇾', method: 'MuslimWorldLeague',
    cities: [
      c('طرابلس', 32.8872, 13.1913, 'Africa/Tripoli'),
      c('بنغازي', 32.1167, 20.0667, 'Africa/Tripoli'),
      c('مصراتة', 32.3754, 15.0925, 'Africa/Tripoli'),
      c('الزاوية', 32.7571, 12.7276, 'Africa/Tripoli'),
      c('زليتن', 32.4674, 14.5684, 'Africa/Tripoli'),
      c('سبها', 27.0377, 14.4283, 'Africa/Tripoli'),
      c('البيضاء', 32.7627, 21.7551, 'Africa/Tripoli'),
    ],
  },
  {
    id: 'ps', name: 'فلسطين', flag: '🇵🇸', method: 'Egyptian',
    cities: [
      c('القدس', 31.7683, 35.2137, 'Asia/Hebron'),
      c('غزة', 31.5017, 34.4668, 'Asia/Gaza'),
      c('الخليل', 31.5326, 35.0998, 'Asia/Hebron'),
      c('نابلس', 32.2211, 35.2544, 'Asia/Hebron'),
      c('رام الله', 31.8996, 35.2042, 'Asia/Hebron'),
      c('بيت لحم', 31.7054, 35.2024, 'Asia/Hebron'),
      c('جنين', 32.4610, 35.2953, 'Asia/Hebron'),
      c('طولكرم', 32.3139, 35.0283, 'Asia/Hebron'),
      c('خان يونس', 31.3406, 34.3046, 'Asia/Gaza'),
      c('رفح', 31.2870, 34.2450, 'Asia/Gaza'),
    ],
  },
  {
    id: 'jo', name: 'الأردن', flag: '🇯🇴', method: 'MuslimWorldLeague',
    cities: [
      c('عمّان', 31.9454, 35.9284, 'Asia/Amman'),
      c('الزرقاء', 32.0609, 36.0876, 'Asia/Amman'),
      c('إربد', 32.5556, 35.8500, 'Asia/Amman'),
      c('العقبة', 29.5267, 35.0078, 'Asia/Amman'),
      c('السلط', 32.0392, 35.7272, 'Asia/Amman'),
      c('المفرق', 32.3426, 36.2089, 'Asia/Amman'),
      c('جرش', 32.2847, 35.8991, 'Asia/Amman'),
      c('الكرك', 31.1853, 35.7048, 'Asia/Amman'),
    ],
  },
  {
    id: 'lb', name: 'لبنان', flag: '🇱🇧', method: 'MuslimWorldLeague',
    cities: [
      c('بيروت', 33.8938, 35.5018, 'Asia/Beirut'),
      c('طرابلس', 34.4367, 35.8497, 'Asia/Beirut'),
      c('صيدا', 33.5633, 35.3708, 'Asia/Beirut'),
      c('صور', 33.2705, 35.2038, 'Asia/Beirut'),
      c('زحلة', 33.8463, 35.9020, 'Asia/Beirut'),
      c('جبيل', 34.1236, 35.6511, 'Asia/Beirut'),
    ],
  },
  {
    id: 'sy', name: 'سوريا', flag: '🇸🇾', method: 'MuslimWorldLeague',
    cities: [
      c('دمشق', 33.5138, 36.2765, 'Asia/Damascus'),
      c('حلب', 36.2021, 37.1343, 'Asia/Damascus'),
      c('حمص', 34.7324, 36.7137, 'Asia/Damascus'),
      c('اللاذقية', 35.5317, 35.7919, 'Asia/Damascus'),
      c('حماة', 35.1312, 36.7578, 'Asia/Damascus'),
      c('دير الزور', 35.3359, 40.1408, 'Asia/Damascus'),
      c('طرطوس', 34.8891, 35.8866, 'Asia/Damascus'),
      c('درعا', 32.6189, 36.1021, 'Asia/Damascus'),
    ],
  },
  {
    id: 'iq', name: 'العراق', flag: '🇮🇶', method: 'MuslimWorldLeague',
    cities: [
      c('بغداد', 33.3152, 44.3661, 'Asia/Baghdad'),
      c('البصرة', 30.5085, 47.7804, 'Asia/Baghdad'),
      c('الموصل', 36.3350, 43.1189, 'Asia/Baghdad'),
      c('أربيل', 36.1911, 44.0092, 'Asia/Baghdad'),
      c('السليمانية', 35.5611, 45.4306, 'Asia/Baghdad'),
      c('كركوك', 35.4681, 44.3922, 'Asia/Baghdad'),
      c('النجف', 31.9991, 44.3306, 'Asia/Baghdad'),
      c('كربلاء', 32.6160, 44.0240, 'Asia/Baghdad'),
      c('الرمادي', 33.4258, 43.3040, 'Asia/Baghdad'),
    ],
  },
  {
    id: 'kw', name: 'الكويت', flag: '🇰🇼', method: 'Kuwait',
    cities: [
      c('مدينة الكويت', 29.3759, 47.9774, 'Asia/Kuwait'),
      c('حولي', 29.3326, 48.0289, 'Asia/Kuwait'),
      c('السالمية', 29.3611, 48.0838, 'Asia/Kuwait'),
      c('الفروانية', 29.2776, 47.9590, 'Asia/Kuwait'),
      c('الأحمدي', 29.0769, 48.0838, 'Asia/Kuwait'),
      c('الجهراء', 29.3375, 47.6581, 'Asia/Kuwait'),
    ],
  },
  {
    id: 'qa', name: 'قطر', flag: '🇶🇦', method: 'Qatar',
    cities: [
      c('الدوحة', 25.2854, 51.5310, 'Asia/Qatar'),
      c('الريان', 25.2919, 51.4244, 'Asia/Qatar'),
      c('الوكرة', 25.1717, 51.6036, 'Asia/Qatar'),
      c('الخور', 25.6804, 51.4969, 'Asia/Qatar'),
      c('أم صلال', 25.4107, 51.3991, 'Asia/Qatar'),
    ],
  },
  {
    id: 'bh', name: 'البحرين', flag: '🇧🇭', method: 'MuslimWorldLeague',
    cities: [
      c('المنامة', 26.2285, 50.5860, 'Asia/Bahrain'),
      c('المحرق', 26.2572, 50.6119, 'Asia/Bahrain'),
      c('الرفاع', 26.1298, 50.5550, 'Asia/Bahrain'),
      c('مدينة حمد', 26.1152, 50.5069, 'Asia/Bahrain'),
    ],
  },
  {
    id: 'ae', name: 'الإمارات', flag: '🇦🇪', method: 'Dubai',
    cities: [
      c('دبي', 25.2048, 55.2708, 'Asia/Dubai'),
      c('أبوظبي', 24.4539, 54.3773, 'Asia/Dubai'),
      c('الشارقة', 25.3463, 55.4209, 'Asia/Dubai'),
      c('عجمان', 25.4052, 55.5136, 'Asia/Dubai'),
      c('العين', 24.1917, 55.7606, 'Asia/Dubai'),
      c('رأس الخيمة', 25.7895, 55.9432, 'Asia/Dubai'),
      c('الفجيرة', 25.1288, 56.3265, 'Asia/Dubai'),
      c('أم القيوين', 25.5647, 55.5553, 'Asia/Dubai'),
    ],
  },
  {
    id: 'om', name: 'عُمان', flag: '🇴🇲', method: 'MuslimWorldLeague',
    cities: [
      c('مسقط', 23.5880, 58.3829, 'Asia/Muscat'),
      c('صلالة', 17.0151, 54.0924, 'Asia/Muscat'),
      c('صحار', 24.3461, 56.7075, 'Asia/Muscat'),
      c('نزوى', 22.9333, 57.5333, 'Asia/Muscat'),
      c('صور', 22.5667, 59.5289, 'Asia/Muscat'),
      c('البريمي', 24.2466, 55.7883, 'Asia/Muscat'),
    ],
  },
  {
    id: 'ye', name: 'اليمن', flag: '🇾🇪', method: 'MuslimWorldLeague',
    cities: [
      c('صنعاء', 15.3694, 44.1910, 'Asia/Aden'),
      c('عدن', 12.7855, 45.0187, 'Asia/Aden'),
      c('تعز', 13.5789, 44.0219, 'Asia/Aden'),
      c('الحديدة', 14.7979, 42.9550, 'Asia/Aden'),
      c('إب', 13.9667, 44.1667, 'Asia/Aden'),
      c('المكلا', 14.5356, 49.1342, 'Asia/Aden'),
      c('مأرب', 15.4623, 45.3237, 'Asia/Aden'),
    ],
  },
  {
    id: 'sd', name: 'السودان', flag: '🇸🇩', method: 'Egyptian',
    cities: [
      c('الخرطوم', 15.5007, 32.5599, 'Africa/Khartoum'),
      c('أم درمان', 15.6445, 32.4777, 'Africa/Khartoum'),
      c('بورتسودان', 19.6158, 37.2164, 'Africa/Khartoum'),
      c('كسلا', 15.4515, 36.4002, 'Africa/Khartoum'),
      c('ود مدني', 14.4012, 33.5192, 'Africa/Khartoum'),
      c('الأبيض', 13.1833, 30.2167, 'Africa/Khartoum'),
    ],
  },
  {
    id: 'so', name: 'الصومال', flag: '🇸🇴', method: 'MuslimWorldLeague',
    cities: [
      c('مقديشو', 2.0469, 45.3182, 'Africa/Mogadishu'),
      c('هرجيسا', 9.5600, 44.0650, 'Africa/Mogadishu'),
      c('كيسمايو', -0.3560, 42.5460, 'Africa/Mogadishu'),
    ],
  },
  {
    id: 'tr', name: 'تركيا', flag: '🇹🇷', method: 'Turkey',
    cities: [
      c('إسطنبول', 41.0082, 28.9784, 'Europe/Istanbul'),
      c('أنقرة', 39.9334, 32.8597, 'Europe/Istanbul'),
      c('إزمير', 38.4237, 27.1428, 'Europe/Istanbul'),
      c('بورصة', 40.1885, 29.0610, 'Europe/Istanbul'),
      c('أنطاليا', 36.8969, 30.7133, 'Europe/Istanbul'),
      c('قونية', 37.8746, 32.4932, 'Europe/Istanbul'),
      c('غازي عنتاب', 37.0660, 37.3833, 'Europe/Istanbul'),
      c('طرابزون', 41.0027, 39.7168, 'Europe/Istanbul'),
    ],
  },
  {
    id: 'my', name: 'ماليزيا', flag: '🇲🇾', method: 'Singapore',
    cities: [
      c('كوالالمبور', 3.1390, 101.6869, 'Asia/Kuala_Lumpur'),
      c('جورج تاون', 5.4141, 100.3288, 'Asia/Kuala_Lumpur'),
      c('جوهور باهرو', 1.4927, 103.7414, 'Asia/Kuala_Lumpur'),
      c('كوتا كينابالو', 5.9804, 116.0735, 'Asia/Kuala_Lumpur'),
    ],
  },
  {
    id: 'id', name: 'إندونيسيا', flag: '🇮🇩', method: 'Singapore',
    cities: [
      c('جاكرتا', -6.2088, 106.8456, 'Asia/Jakarta'),
      c('سورابايا', -7.2575, 112.7521, 'Asia/Jakarta'),
      c('باندونغ', -6.9175, 107.6191, 'Asia/Jakarta'),
      c('ميدان', 3.5952, 98.6722, 'Asia/Jakarta'),
    ],
  },
  {
    id: 'pk', name: 'باكستان', flag: '🇵🇰', method: 'Karachi',
    cities: [
      c('إسلام آباد', 33.6844, 73.0479, 'Asia/Karachi'),
      c('كراتشي', 24.8607, 67.0011, 'Asia/Karachi'),
      c('لاهور', 31.5204, 74.3587, 'Asia/Karachi'),
      c('فيصل آباد', 31.4504, 73.1350, 'Asia/Karachi'),
      c('بيشاور', 34.0151, 71.5249, 'Asia/Karachi'),
    ],
  },
  {
    id: 'gb', name: 'بريطانيا', flag: '🇬🇧', method: 'MuslimWorldLeague',
    cities: [
      c('لندن', 51.5074, -0.1278, 'Europe/London'),
      c('برمنغهام', 52.4862, -1.8904, 'Europe/London'),
      c('مانشستر', 53.4808, -2.2426, 'Europe/London'),
      c('ليدز', 53.8008, -1.5491, 'Europe/London'),
      c('ليستر', 52.6369, -1.1398, 'Europe/London'),
    ],
  },
  {
    id: 'fr', name: 'فرنسا', flag: '🇫🇷', method: 'MuslimWorldLeague',
    cities: [
      c('باريس', 48.8566, 2.3522, 'Europe/Paris'),
      c('مارسيليا', 43.2965, 5.3698, 'Europe/Paris'),
      c('ليون', 45.7640, 4.8357, 'Europe/Paris'),
      c('ليل', 50.6292, 3.0573, 'Europe/Paris'),
      c('تولوز', 43.6047, 1.4442, 'Europe/Paris'),
      c('ستراسبورغ', 48.5734, 7.7521, 'Europe/Paris'),
    ],
  },
  {
    id: 'de', name: 'ألمانيا', flag: '🇩🇪', method: 'MuslimWorldLeague',
    cities: [
      c('برلين', 52.5200, 13.4050, 'Europe/Berlin'),
      c('كولونيا', 50.9375, 6.9603, 'Europe/Berlin'),
      c('فرانكفورت', 50.1109, 8.6821, 'Europe/Berlin'),
      c('هامبورغ', 53.5511, 9.9937, 'Europe/Berlin'),
      c('ميونخ', 48.1351, 11.5820, 'Europe/Berlin'),
    ],
  },
  {
    id: 'us', name: 'أمريكا', flag: '🇺🇸', method: 'NorthAmerica',
    cities: [
      c('نيويورك', 40.7128, -74.0060, 'America/New_York'),
      c('شيكاغو', 41.8781, -87.6298, 'America/Chicago'),
      c('ديترويت', 42.3314, -83.0458, 'America/Detroit'),
      c('هيوستن', 29.7604, -95.3698, 'America/Chicago'),
      c('دالاس', 32.7767, -96.7970, 'America/Chicago'),
      c('لوس أنجلوس', 34.0522, -118.2437, 'America/Los_Angeles'),
      c('مينيابوليس', 44.9778, -93.2650, 'America/Chicago'),
    ],
  },
  {
    id: 'ca', name: 'كندا', flag: '🇨🇦', method: 'NorthAmerica',
    cities: [
      c('تورونتو', 43.6532, -79.3832, 'America/Toronto'),
      c('مونتريال', 45.5017, -73.5673, 'America/Toronto'),
      c('أوتاوا', 45.4215, -75.6972, 'America/Toronto'),
      c('فانكوفر', 49.2827, -123.1207, 'America/Vancouver'),
      c('إدمونتون', 53.5461, -113.4938, 'America/Edmonton'),
    ],
  },
  {
    id: 'au', name: 'أستراليا', flag: '🇦🇺', method: 'MuslimWorldLeague',
    cities: [
      c('سيدني', -33.8688, 151.2093, 'Australia/Sydney'),
      c('ملبورن', -37.8136, 144.9631, 'Australia/Melbourne'),
      c('بريزبن', -27.4698, 153.0251, 'Australia/Brisbane'),
      c('بيرث', -31.9505, 115.8605, 'Australia/Perth'),
    ],
  },
];

export function getCountry(id: string): Country {
  return COUNTRIES.find((x) => x.id === id) ?? COUNTRIES[0];
}

export function getCity(countryId: string, cityId: string): City {
  const co = getCountry(countryId);
  return co.cities.find((x) => x.id === cityId) ?? co.cities[0];
}
