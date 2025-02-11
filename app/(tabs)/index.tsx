import React from 'react';
import { Image, StyleSheet, View, Text, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import concertsData from '@/assets/config/concerts.json';
import { useNavigation } from 'expo-router';
import { NavigationProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';


interface Concert {
	id: number;
	title: string;
	date: string;
	time: string;
	imageUrl: string;
	description: string;
}

const imagesMap: { [key: string]: any } = {
	"images/the-harmonics.jpg": require('@/assets/images/the-harmonics.jpg'),
	"images/indie-explosie.jpg": require('@/assets/images/indie-explosie.jpg'),
	"images/classical-night.jpg": require('@/assets/images/classical-night.jpg'),
	"images/jazz-jam.jpg": require('@/assets/images/jazz-jam.jpg'),
	"images/dj-night.jpg": require('@/assets/images/dj-night.jpg'),
	"images/rock-anthems.jpg": require('@/assets/images/rock-anthems.jpg'),
	"images/highlights/latin-dance.jpg": require('@/assets/images/highlights/latin-dance.jpg'),
	"images/kids-sing-along.jpg": require('@/assets/images/kids-sing-along.jpg'),
	"images/acoustic-evenings.jpg": require('@/assets/images/acoustic-evenings.jpg'),
	"images/highlights/metal-storm.jpg": require('@/assets/images/highlights/metal-storm.jpg'),
	"images/piano-night.jpg": require('@/assets/images/piano-night.jpg'),
	"images/hiphop-legends.jpg": require('@/assets/images/hiphop-legends.jpg'),
	"images/folk-tales.jpg": require('@/assets/images/folk-tales.jpg'),
	"images/highlights/magical-kids.jpg": require('@/assets/images/highlights/magical-kids.jpg'),
};

// New component for rendering a single concert
// New component for rendering a single concert as a pressable card
const HighlightedConcert = ({ concert }: { concert: Concert }) => {
	const navigation = useNavigation<NavigationProp<any>>();
	const router = useRouter();

	return (
		<Pressable
			onPress={() =>
				router.push(`/buyticket?id=${concert.id}`) as any
				}
		>
			<View style={styles.concertCard}>
				<Image
					source={imagesMap[concert.imageUrl]}
					style={styles.concertImage}
					resizeMode="cover"
				/>
				<Text style={styles.concertTitle}>{concert.title}</Text>
				<Text style={styles.concertDate}>
					{concert.date} @ {concert.time}
				</Text>
				<Text style={styles.concertDescription}>
					{concert.description}
				</Text>
			</View>
		</Pressable>
	);
};

export default function HomeScreen() {
	// Choose the indexes for the concerts you want to highlight.
	const indexes = [7, 10, 14];
	let highlightObjects: Concert[] = [];

	// Build the highlightObjects array by finding each concert by id
	indexes.forEach((id) => {
		const concertObj: Concert | undefined = [...concertsData.concerts].find(
			(concert: Concert) => concert.id === id
		);
		if (concertObj) {
			highlightObjects.push(concertObj);
		}
	});

	function timeToMinutes(time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}

	// Removes all '-' from a string 
	function dateToNumbers(date: string) {
		return Number(date.replace(/-/g, ''));
	}

	concertsData.concerts
		.sort((a: Concert, b: Concert) => timeToMinutes(a.time) - timeToMinutes(b.time)) //sort by time
		.sort((a: Concert, b: Concert) => dateToNumbers(a.date) - dateToNumbers(b.date)) //sort by date

	
	const upcomingConcerts: Concert[] = [...concertsData.concerts].splice(0,4)
	

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#D7A492', dark: '#AF4926' }}
			headerHeight={100}
			bottomOverflow={0}
			style={{ backgroundColor: '#f1f1f8' }}
			headerImage={
				<View style={styles.header}>
					<View style={styles.imageWrapper}>
						<Image
							source={require('@/assets/images/echo_logo.png')}
							style={styles.reactLogo}
						/>
					</View>
					<View style={{ flexDirection: 'column', marginLeft: 10, padding: 0 }}>
						<ThemedText
							style={{
								fontSize: 45,
								padding: 0,
								margin: 0,
								lineHeight: 45,
								fontFamily: 'manier',
								color: '#F1F1F8',
							}}>
							Echo
						</ThemedText>
						<ThemedText
							style={{
								fontSize: 20,
								margin: 0,
								padding: 0,
								lineHeight: 20,
								fontFamily: 'manier',
								color: '#F1F1F8',
							}}>
							Utrecht
						</ThemedText>
					</View>
				</View>
			}>
			<View style={styles.highlight}>
				<Text style={styles.textField}>Uitgelicht</Text>
				{highlightObjects.map((concert) => (
					<HighlightedConcert key={concert.id} concert={concert} />
				))}
			</View>

			<View style={styles.highlight}>
				<Text style={styles.textField}>Binnenkort</Text>
				{upcomingConcerts.map((concert) => (
					<HighlightedConcert key={concert.id} concert={concert} />
				))}
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 100,
		width: 100,
		bottom: 0,
		left: 0,
		position: 'relative',
	},
	imageWrapper: {
		borderWidth: 2, 
		borderColor: '#FFFFFF', 
		borderRadius: 10, 
		padding: 5, 
		backgroundColor: '#F1F1F8',
		marginLeft: 10,
	},
	header: {
		marginTop: 100,
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'nowrap',
		overflow: 'visible',
		paddingVertical: 10,
	},
	textField: {
		padding: 5,
		marginTop: 0,
		fontSize: 18,
	},
	highlight: {
		padding: 10,
		minHeight: 300,
	},
	concertCard: {
		marginVertical: 10,
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 8,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},
	concertImage: {
		width: '100%',
		height: 200,
		borderRadius: 8,
	},
	concertTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 10,
	},
	concertDate: {
		fontSize: 16,
		color: '#888',
		marginVertical: 5,
	},
	concertDescription: {
		fontSize: 16,
		marginTop: 5,
	},
});