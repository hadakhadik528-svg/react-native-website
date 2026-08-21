import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COUNTRIES, type Country } from '../lib/data/locations';
import { useSettings } from '../lib/settings';
import { COLORS, FONTS, RADIUS } from '../lib/theme';

export default function CityPickerScreen() {
  const navigation = useNavigation();
  const { settings, update } = useSettings();
  const [country, setCountry] = useState<Country | null>(null);
  const [query, setQuery] = useState('');

  const countries = useMemo(() => {
    const q = query.trim();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.includes(q));
  }, [query]);

  const cities = useMemo(() => {
    if (!country) return [];
    const q = query.trim();
    if (!q) return country.cities;
    return country.cities.filter((c) => c.name.includes(q));
  }, [country, query]);

  const selectCity = (cityId: string) => {
    if (!country) return;
    update({ countryId: country.id, cityId });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (country ? (setCountry(null), setQuery('')) : navigation.goBack())} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={22} color={COLORS.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>{country ? `مدن ${country.name}` : 'اختر دولتك'}</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={COLORS.textFaint} />
        <TextInput
          style={styles.searchInput}
          placeholder={country ? 'ابحث عن مدينة...' : 'ابحث عن دولة...'}
          placeholderTextColor={COLORS.textFaint}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textFaint} />
          </TouchableOpacity>
        ) : null}
      </View>

      {!country ? (
        <FlatList
          data={countries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = item.id === settings.countryId;
            return (
              <TouchableOpacity
                style={[styles.countryRow, selected && styles.rowSelected]}
                activeOpacity={0.8}
                onPress={() => {
                  setCountry(item);
                  setQuery('');
                }}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.cityCount}>{item.cities.length} مدينة</Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.gold} />
                ) : (
                  <Ionicons name="chevron-back" size={18} color={COLORS.textFaint} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = item.id === settings.cityId && country.id === settings.countryId;
            return (
              <TouchableOpacity
                style={[styles.countryRow, selected && styles.rowSelected]}
                activeOpacity={0.8}
                onPress={() => selectCity(item.id)}
              >
                <View style={[styles.cityDot, selected && styles.cityDotActive]} />
                <Text style={[styles.countryName, { flex: 1 }]}>{item.name}</Text>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.gold} />
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.uiBold,
    fontSize: 17,
    color: COLORS.text,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.ui,
    fontSize: 14.5,
    color: COLORS.text,
    padding: 0,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    gap: 8,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowSelected: {
    borderColor: 'rgba(217,164,65,0.5)',
    backgroundColor: 'rgba(217,164,65,0.07)',
  },
  flag: { fontSize: 26 },
  countryName: {
    fontFamily: FONTS.uiBold,
    fontSize: 15,
    color: COLORS.text,
  },
  cityCount: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: COLORS.textDim,
    marginTop: 1,
  },
  cityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  cityDotActive: {
    backgroundColor: COLORS.gold,
  },
});
