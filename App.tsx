import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from './lib/settings';
import { AudioProvider } from './lib/audio';
import { COLORS, FONTS } from './lib/theme';
import { MiniPlayer } from './components/MiniPlayer';

import HomeScreen from './screens/HomeScreen';
import CityPickerScreen from './screens/CityPickerScreen';
import AdhanScreen from './screens/AdhanScreen';
import QuranScreen from './screens/QuranScreen';
import ReciterScreen from './screens/ReciterScreen';
import ReaderScreen from './screens/ReaderScreen';
import AdhkarScreen from './screens/AdhkarScreen';
import AdhkarCategoryScreen from './screens/AdhkarCategoryScreen';
import SettingsScreen from './screens/SettingsScreen';

// Force RTL layout for Arabic
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

const RootStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const QuranStack = createNativeStackNavigator();
const AdhkarStack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.bg,
    card: COLORS.surface,
    primary: COLORS.gold,
    text: COLORS.text,
    border: COLORS.border,
  },
};

function TabBarWithPlayer(props: any) {
  return (
    <View style={{ backgroundColor: COLORS.bg }}>
      <MiniPlayer />
      <BottomTabBar {...props} />
    </View>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

function QuranStackScreen() {
  return (
    <QuranStack.Navigator screenOptions={{ headerShown: false }}>
      <QuranStack.Screen name="QuranMain" component={QuranScreen} />
      <QuranStack.Screen name="Reciter" component={ReciterScreen} />
      <QuranStack.Screen name="Reader" component={ReaderScreen} />
    </QuranStack.Navigator>
  );
}

function AdhkarStackScreen() {
  return (
    <AdhkarStack.Navigator screenOptions={{ headerShown: false }}>
      <AdhkarStack.Screen name="AdhkarMain" component={AdhkarScreen} />
      <AdhkarStack.Screen name="AdhkarCategory" component={AdhkarCategoryScreen} />
    </AdhkarStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      tabBar={(props) => <TabBarWithPlayer {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textFaint,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.borderSoft,
          height: 62,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.uiMedium,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="AdhanTab"
        component={AdhanScreen}
        options={{
          title: 'الأذان',
          tabBarIcon: ({ color, size }) => <Ionicons name="volume-high" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="QuranTab"
        component={QuranStackScreen}
        options={{
          title: 'القرآن',
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="AdhkarTab"
        component={AdhkarStackScreen}
        options={{
          title: 'الأذكار',
          tabBarIcon: ({ color, size }) => <Ionicons name="leaf" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size - 2} color={color} />,
        }}
      />
    </Tabs.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen
          name="CityPicker"
          component={CityPickerScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function Splash() {
  return (
    <View style={splash.wrap}>
      <Text style={splash.name}>صدقة جارية</Text>
      <Text style={splash.sub}>جارٍ التحميل...</Text>
    </View>
  );
}

function AppInner() {
  const { loaded } = useSettings();
  const [fontsLoaded] = useFonts({
    'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
    'Tajawal-Medium': require('./assets/fonts/Tajawal-Medium.ttf'),
    'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
    'Amiri-Regular': require('./assets/fonts/Amiri-Regular.ttf'),
    'Amiri-Bold': require('./assets/fonts/Amiri-Bold.ttf'),
    ...Ionicons.font,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.title = 'صدقة جارية';
      document.body.style.backgroundColor = COLORS.bg;
    }
  }, []);

  if (!fontsLoaded || !loaded) {
    return <Splash />;
  }

  return (
    <AudioProvider>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </AudioProvider>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppInner />
    </SettingsProvider>
  );
}

const splash = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: FONTS.quranBold,
    fontSize: 36,
    color: COLORS.goldLight,
  },
  sub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: COLORS.textDim,
    marginTop: 10,
  },
});
