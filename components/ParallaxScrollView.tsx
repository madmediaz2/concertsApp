import type { PropsWithChildren, ReactElement } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, {
	Extrapolate,
	Extrapolation,
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

let STICKY_HEADER_HEIGHT;
let HEADER_HEIGHT;

type Props = PropsWithChildren<{
	headerImage: ReactElement;
	headerBackgroundColor: { dark: string; light: string };
	/** Optional sticky header that will be rendered over the parallax header once you scroll past a threshold */
	renderStickyHeader?: () => ReactElement;
	headerHeight: Float;
	stickyHeaderHeight?: Float;
	bottomOverflow: number;
	/** Additional style for the outer container */
	style?: StyleProp<ViewStyle>;
}>;

export default function ParallaxScrollView({
	children,
	headerImage,
	headerBackgroundColor,
	renderStickyHeader,
	headerHeight,
	stickyHeaderHeight,
	bottomOverflow = 0, // default value if not provided
	style,
}: Props) {
	const colorScheme = useColorScheme() ?? 'light';
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	STICKY_HEADER_HEIGHT = stickyHeaderHeight;
	HEADER_HEIGHT = headerHeight;

	let bottom: number = bottomOverflow;
	try {
		bottom = useBottomTabOverflow();
	} catch (error) {
		// Optionally, you can log the error for debugging:
		// console.warn('useBottomTabOverflow not available, using fallback:', error);
		bottom = bottomOverflow;
	}

	// Parallax header animated style (translate & scale)
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-headerHeight, 0, headerHeight],
						[-headerHeight / 2, 0, headerHeight * 0.75]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-headerHeight, 0, headerHeight],
						[2, 1, 1]
					),
				},
			],
		};
	});

	// Sticky header animated style: fade in when scrolling past the header
	const stickyHeaderAnimatedStyle = useAnimatedStyle(() => {
		// Adjust the input/output range as needed
		const opacity = interpolate(
			scrollOffset.value,
			[headerHeight - (stickyHeaderHeight ?? 0), headerHeight],
			[0, 1],
			Extrapolation.CLAMP
		);
		return { opacity };
	});

	return (
		<ThemedView style={styles.container}>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				scrollIndicatorInsets={{ bottom }}
				contentContainerStyle={{ paddingBottom: bottom }}>
				<Animated.View
					style={[
						styles.header,
						{ backgroundColor: headerBackgroundColor[colorScheme] },
						headerAnimatedStyle,
					]}>
					{headerImage}
				</Animated.View>
				<ThemedView style={[styles.content, style]}>{children}</ThemedView>
			</Animated.ScrollView>
			{/* Render the sticky header if provided */}
			{renderStickyHeader && (
				<Animated.View style={[styles.stickyHeader, stickyHeaderAnimatedStyle]}>
					{renderStickyHeader()}
				</Animated.View>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative', // required for absolutely positioning the sticky header
	},
	header: {
		height: HEADER_HEIGHT,
		overflow: 'hidden',
	},
	content: {
		flex: 1,
		overflow: 'hidden',
	},
	stickyHeader: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: STICKY_HEADER_HEIGHT,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10, // ensure it stays on top of the ScrollView content
	},
});