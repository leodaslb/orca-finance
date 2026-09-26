import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="transacao/nova" />
        <Stack.Screen name="transacao/[id]" />
        <Stack.Screen name="metas/[id]" />
        <Stack.Screen name="metas/index" />
        <Stack.Screen name="metas/nova" />
        <Stack.Screen name="categorias/index" />
        <Stack.Screen name="planejamento/limites-alertas" />
        <Stack.Screen name="planejamento/gastos-livres" />
        <Stack.Screen name="planejamento/planejado-realizado" />
      </Stack>
    </>
  );
}
