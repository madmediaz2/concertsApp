// app/agenda/index.tsx
import React, { useState } from 'react';
import { FlatList, Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import concertsData from '@/assets/config/concerts.json';
import ParallaxScrollView from '@/components/ParallaxScrollView';

interface Concerts {
	id: number,
	title: string,
	date: string
	time: string,
	imageUrl: string,
	description: string
}

export default function Agenda() {
	const router = useRouter();
	const pageSize = 5;


	function timeToMinutes(time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}

	// Removes all '-' from a string 
	function dateToNumbers(date: string) {
		return Number(date.replace(/-/g, ''));
	}

	// sort concertdata
	concertsData.concerts
		.sort((a: Concerts, b: Concerts) => timeToMinutes(a.time) - timeToMinutes(b.time))
		.sort((a: Concerts, b: Concerts) => dateToNumbers(a.date) - dateToNumbers(b.date))


	//The state visibleConcerts starts with only a subset (pageSize = 5) of the full concert list.
	const [visibleConcerts, setVisibleConcerts] = useState(
		concertsData.concerts.slice(0, pageSize)
	);

	// When FlatList detects that the user is reaching the end (onEndReached), the loadMore function adds more concerts.
	// It updates visibleConcerts by slicing a larger portion from the original concertsData.concerts array.
	const loadMore = () => {
		const currentLength = visibleConcerts.length;
		if (currentLength < concertsData.concerts.length) {
			const newLength = currentLength + pageSize;
			setVisibleConcerts(concertsData.concerts.slice(0, newLength));
		}
	};

	//Template for each concert card in the list.
	/*
	const renderItem = ({ item }: { item: any }) => (
		<ConcertCard>
			<ConcertTitle>{item.title}</ConcertTitle>
			<Text>
				{item.date} – {item.time}
			</Text>
		</ConcertCard>
	);
	*/
	return (
		<ParallaxScrollView
			headerImage={
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ fontSize: 28, fontWeight: 'bold', color: '#F1F1F8', marginTop: 50, padding: 10, fontFamily: 'manier' }}>Agenda</Text>
				</View>
			}
			bottomOverflow={0}
			headerBackgroundColor={{ dark: 'AF4926', light: '#D7A492' }}
			headerHeight={100}
			stickyHeaderHeight={100}
			renderStickyHeader={() => (
				<View
					style={{
						height: 100, // make sure this matches your stickyHeaderHeight prop
						width: '100%',
						backgroundColor: '#D7A492',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Text style={{ fontSize: 23, fontWeight: 'bold', color: 'white', marginTop: 40, fontFamily: 'manier' }}>Agenda</Text>
				</View>
			)}
			style={{gap: 10, padding: 10, backgroundColor: '#D7A492'}}
		>
			{concertsData.concerts.map((concert) => (
				<Pressable
					key={concert.id}
					onPress={() => router.push(`/buyticket?id=${concert.id}` as any)}
					style={styles.concertCard}
				>
					<Text style={styles.concertTitle}>{concert.title}</Text>
					<Text>
						{concert.date} – {concert.time}
					</Text>
				</Pressable>
			))}
		</ParallaxScrollView>

	);
}

const styles = StyleSheet.create({
	header: {
		height: 150,
		backgroundColor: '#007BFF',
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerText: {
		fontSize: 23,
		fontWeight: 'bold',
		color: 'white',
		marginTop: 40,
	},
	concertCard: {
		backgroundColor: '#FFFFFF',
		padding: 20,
		margin: 1,
		borderRadius: 8,
		fontFamily: 'manrope'
	},
	concertTitle: {
		fontSize: 16,
		fontWeight: 'bold',
	},
});
