import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		manrope: require('../assets/fonts/Manrope/Manrope-VariableFont_wght.ttf'),
		manier: require('../assets/fonts/manier-font-family/Manier-Medium.otf')
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="+not-found" />
				<Stack.Screen
					name="(screens)/buyticket"
					options={{
						headerShown: true,
						headerBackTitle : "Agenda",
						headerBackTitleStyle: { fontFamily: 'manrope', fontSize: 16 }, // Change the back title text style here
						contentStyle: { backgroundColor: '#D7A492', } // <-- Set your desired background color here
					}}
				/>
			</Stack>
			<StatusBar style='auto' />
		</ThemeProvider>
	);
}
