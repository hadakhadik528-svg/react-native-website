import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../lib/settings';
import { getCity, getCountry } from '../lib/data/locations';
import { METHOD_KEYS, METHOD_LABELS, type Adjustments } from '../lib/prayer';
import { MUEZZINS } from '../lib/data/muezzins';
import { COLORS, FONTS, RADIUS } from '../lib/theme';

const ADJUSTABLE: { key: keyof Adjustments; name: string }[] = [
  { key: 'fajr', name: 'الفجر' },
  { key: 'dhuhr', name: 'الظهر' },
  { key: 'asr', name: 'العصر' },
  { key: 'maghrib', name: 'المغرب' },
  { key: 'isha', name: 'العشاء' },
];

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon as any} size={16} color={COLORS.gold} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { settings, update, setAdjustment, resetAdjustments } = useSettings();
  const [showMethods, setShowMethods] = useState(false);

  const country = getCountry(settings.countryId);
  const city = getCity(settings.countryId, settings.cityId);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>الإعدادات</Text>
          <Text style={styles.subtitle}>خصّص تطبيقك ليخدم عبادتك</Text>
        </View>

        {/* Location */}
        <SectionCard title="الموقع والتوقيت" icon="location">
          <TouchableOpacity style={styles.rowBtn} onPress={() => navigation.navigate('CityPicker')}>
            <Text style={styles.rowLabel}>الدولة والمدينة</Text>
            <View style={styles.rowValue}>
              <Text style={styles.rowValueText}>
                {country.flag} {city.name}
              </Text>
              <Ionicons name="chevron-back" size={16} color={COLORS.textFaint} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowBtn} onPress={() => setShowMethods((s) => !s)}>
            <Text style={styles.rowLabel}>طريقة حساب المواقيت</Text>
            <View style={styles.rowValue}>
              <Text style={styles.rowValueText}>
                {settings.methodKey === 'auto'
                  ? `تلقائي — ${METHOD_LABELS[country.method]}`
                  : METHOD_LABELS[settings.methodKey]}
              </Text>
              <Ionicons name={showMethods ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textFaint} />
            </View>
          </TouchableOpacity>

          {showMethods ? (
            <View style={styles.methodList}>
              {METHOD_KEYS.map((k) => {
                const active = settings.methodKey === k;
                return (
                  <TouchableOpacity
                    key={k}
                    style={[styles.methodRow, active && styles.methodRowActive]}
                    onPress={() => update({ methodKey: k })}
                  >
                    <Ionicons
                      name={active ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={active ? COLORS.gold : COLORS.textFaint}
                    />
                    <Text style={[styles.methodText, active && styles.methodTextActive]}>
                      {k === 'auto' ? `${METHOD_LABELS.auto} (${METHOD_LABELS[country.method]})` : METHOD_LABELS[k]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          <View style={styles.adjustHead}>
            <Text style={styles.adjustTitle}>الضبط اليدوي للمواقيت (بالدقائق)</Text>
            <TouchableOpacity style={styles.adjustReset} onPress={resetAdjustments}>
              <Ionicons name="refresh" size={13} color={COLORS.gold} />
              <Text style={styles.adjustResetText}>إعادة الضبط</Text>
            </TouchableOpacity>
          </View>
          {ADJUSTABLE.map((p) => {
            const v = settings.adjustments[p.key];
            return (
              <View key={p.key} style={styles.adjustRow}>
                <Text style={styles.adjustName}>{p.name}</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => setAdjustment(p.key, v - 1)}>
                    <Ionicons name="remove" size={15} color={COLORS.gold} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, v !== 0 && styles.stepValueModified]}>
                    {v > 0 ? `+${v}` : `${v}`} د
                  </Text>
                  <TouchableOpacity style={styles.stepBtn} onPress={() => setAdjustment(p.key, v + 1)}>
                    <Ionicons name="add" size={15} color={COLORS.gold} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          <Text style={styles.hint}>
            التوقيت يُحسب تلقائيًا حسب إحداثيات مدينتك، ويمكنك تقديم أو تأخير أي صلاة يدويًا
          </Text>
        </SectionCard>

        {/* Auto adhan */}
        <SectionCard title="التشغيل التلقائي للأذان" icon="notifications">
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>تشغيل الأذان عند دخول الوقت</Text>
              <Text style={styles.hintInline}>يعمل أثناء فتح التطبيق</Text>
            </View>
            <Switch
              value={settings.autoAdhan}
              onValueChange={(v) => update({ autoAdhan: v })}
              trackColor={{ false: COLORS.border, true: 'rgba(217,164,65,0.5)' }}
              thumbColor={settings.autoAdhan ? COLORS.gold : COLORS.textFaint}
            />
          </View>
          {settings.autoAdhan ? (
            <View style={styles.muezzinPick}>
              <Text style={styles.adjustTitle}>اختر صوت المؤذن</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {MUEZZINS.slice(0, 6).map((m) => {
                  const active = settings.autoAdhanMuezzinId === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.muezzinChip, active && styles.muezzinChipActive]}
                      onPress={() => update({ autoAdhanMuezzinId: m.id })}
                    >
                      <Text style={[styles.muezzinChipText, active && styles.muezzinChipTextActive]} numberOfLines={1}>
                        {m.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </SectionCard>

        {/* Audio */}
        <SectionCard title="الصوت" icon="volume-high">
          <View style={styles.volumeRow}>
            <Ionicons name="volume-medium" size={18} color={COLORS.gold} />
            <Text style={styles.volumeLabel}>صوت الأذان</Text>
            <Text style={styles.volumeValue}>{Math.round(settings.adhanVolume * 100)}%</Text>
          </View>
          <Slider
            value={settings.adhanVolume}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={COLORS.gold}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor={COLORS.gold}
            onValueChange={(v) => update({ adhanVolume: v })}
            style={styles.slider}
          />
          <View style={styles.volumeRow}>
            <Ionicons name="musical-notes" size={18} color={COLORS.greenBright} />
            <Text style={styles.volumeLabel}>صوت تلاوة القرآن</Text>
            <Text style={styles.volumeValue}>{Math.round(settings.quranVolume * 100)}%</Text>
          </View>
          <Slider
            value={settings.quranVolume}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={COLORS.greenBright}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor={COLORS.greenBright}
            onValueChange={(v) => update({ quranVolume: v })}
            style={styles.slider}
          />
        </SectionCard>

        {/* Reading */}
        <SectionCard title="القراءة" icon="book">
          <View style={styles.volumeRow}>
            <Ionicons name="text" size={18} color={COLORS.gold} />
            <Text style={styles.volumeLabel}>حجم خط القراءة</Text>
            <Text style={styles.volumeValue}>{settings.readerFontSize}</Text>
          </View>
          <Slider
            value={settings.readerFontSize}
            minimumValue={16}
            maximumValue={40}
            step={1}
            minimumTrackTintColor={COLORS.gold}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor={COLORS.gold}
            onValueChange={(v) => update({ readerFontSize: Math.round(v) })}
            style={styles.slider}
          />
          <Text style={[styles.preview, { fontSize: settings.readerFontSize, lineHeight: settings.readerFontSize * 2 }]}>
            ﴿إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا﴾
          </Text>
        </SectionCard>

        {/* About */}
        <View style={styles.about}>
          <Text style={styles.aboutName}>صدقة جارية</Text>
          <Text style={styles.aboutText}>
            مواقيت الصلاة • الأذان بأصوات مؤذنين حقيقيين • القرآن الكريم بأصوات أشهر القرّاء • الأذكار اليومية
          </Text>
          <Text style={styles.aboutDua}>اللهم اجعل هذا العمل صدقة جارية لا ينقطع أجرها</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 40 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  title: {
    fontFamily: FONTS.uiBold,
    fontSize: 24,
    color: COLORS.goldLight,
  },
  subtitle: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.textDim,
    marginTop: 4,
  },
  section: {
    marginTop: 18,
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    overflow: 'hidden',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: 'rgba(217,164,65,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  rowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginTop: 8,
  },
  rowLabel: {
    fontFamily: FONTS.uiMedium,
    fontSize: 13.5,
    color: COLORS.text,
  },
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '60%',
  },
  rowValueText: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: COLORS.textDim,
  },
  methodList: {
    marginTop: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    overflow: 'hidden',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderSoft,
  },
  methodRowActive: {
    backgroundColor: 'rgba(217,164,65,0.08)',
  },
  methodText: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: COLORS.textDim,
    flex: 1,
  },
  methodTextActive: {
    color: COLORS.goldLight,
    fontFamily: FONTS.uiMedium,
  },
  adjustHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 4,
  },
  adjustTitle: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12.5,
    color: COLORS.textDim,
  },
  adjustReset: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adjustResetText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11.5,
    color: COLORS.gold,
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  adjustName: {
    fontFamily: FONTS.uiBold,
    fontSize: 13.5,
    color: COLORS.text,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(217,164,65,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: COLORS.textDim,
    minWidth: 46,
    textAlign: 'center',
  },
  stepValueModified: {
    color: COLORS.goldLight,
  },
  hint: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: COLORS.textFaint,
    marginTop: 10,
    lineHeight: 17,
  },
  hintInline: {
    fontFamily: FONTS.ui,
    fontSize: 11,
    color: COLORS.textFaint,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  muezzinPick: {
    marginTop: 12,
    gap: 8,
  },
  muezzinChip: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  muezzinChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(217,164,65,0.12)',
  },
  muezzinChipText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: COLORS.textDim,
  },
  muezzinChipTextActive: {
    color: COLORS.goldLight,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  volumeLabel: {
    flex: 1,
    fontFamily: FONTS.uiMedium,
    fontSize: 13.5,
    color: COLORS.text,
  },
  volumeValue: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: COLORS.goldLight,
  },
  slider: {
    marginTop: 2,
  },
  preview: {
    fontFamily: FONTS.quran,
    color: COLORS.gold,
    textAlign: 'center',
    marginTop: 8,
  },
  about: {
    marginTop: 26,
    marginHorizontal: 20,
    alignItems: 'center',
    padding: 20,
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(217,164,65,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(217,164,65,0.2)',
  },
  aboutName: {
    fontFamily: FONTS.quranBold,
    fontSize: 22,
    color: COLORS.goldLight,
  },
  aboutText: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
  aboutDua: {
    fontFamily: FONTS.quran,
    fontSize: 14,
    color: COLORS.gold,
    textAlign: 'center',
    marginTop: 12,
  },
});
