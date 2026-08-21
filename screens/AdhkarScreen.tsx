import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ADHKAR_CATEGORIES } from '../lib/data/adhkar';
import { COLORS, FONTS, RADIUS, SHADOW } from '../lib/theme';

export default function AdhkarScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>الأذكار</Text>
        <Text style={styles.subtitle}>«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»</Text>
      </View>

      <FlatList
        data={ADHKAR_CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AdhkarCategory', { categoryId: item.id })}
          >
            <LinearGradient
              colors={['#123127', '#0E241C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.card}
            >
              <LinearGradient
                colors={item.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconWrap}
              >
                <Ionicons name={item.icon as any} size={24} color="#FFF" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
                {item.tasbih ? null : (
                  <Text style={styles.count}>{item.items.length} ذكر</Text>
                )}
              </View>
              <Ionicons name="chevron-back" size={18} color={COLORS.textFaint} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: FONTS.uiBold,
    fontSize: 24,
    color: COLORS.goldLight,
  },
  subtitle: {
    fontFamily: FONTS.quran,
    fontSize: 15,
    color: COLORS.textDim,
    marginTop: 6,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: 16,
    ...SHADOW,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: FONTS.uiBold,
    fontSize: 16,
    color: COLORS.text,
  },
  desc: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: COLORS.textDim,
    marginTop: 2,
  },
  count: {
    fontFamily: FONTS.uiMedium,
    fontSize: 11,
    color: COLORS.gold,
    marginTop: 4,
  },
});
