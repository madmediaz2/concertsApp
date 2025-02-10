import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
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

export default function BuyTicket() {
    // Retrieve the search params from the URL
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };

    // Optionally, convert the id to a number if needed
    const concertId = id ? parseInt(id, 10) : null;


    const concertObj: Concerts | undefined = concertsData.concerts.find((concert: Concerts) => concert.id === concertId);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: concertObj ? concertObj.title : 'Buy Ticket',
        });
    }, [navigation, concertObj]);

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

    const dateToString = (date: Concerts['date']) => {
        const dateInNumbers = Number(date.replace(/-/g, ''));

        const months = ["0", "Januari", "Februari", "Maart", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "December"]

        const year = dateInNumbers.toString().substring(0, 4);
        const month = parseInt(dateInNumbers.toString().substring(5, 6), 10);
        const day = dateInNumbers.toString().substring(7,8)

        return `${day} ${months[month]} ${year}`
    }

    /* Code below did not work due to bundler limitations
    concertsData.concerts.forEach(obj => {
        const fileName = obj.imageUrl.split('/').pop() as string;
        const path = `@/assets/images/${obj.imageUrl}`
        images.push({imagename: fileName, require: () => require(path) });
    }); */

    return (
        concertObj ?
            //true 
            <ParallaxScrollView
                headerHeight={50}
                headerImage={
                    <View style={{ height: 0 }} />
                }
                headerBackgroundColor={{ dark: '#333', light: '#007BFF' }}
                bottomOverflow={0}
            >
                <View style={styles.imageContainer}>
                    <Image source={imagesMap[concertObj.imageUrl]} style={styles.image} />
                </View>

                {/* New container for date and title */}
                <View style={styles.textContainer}>
                    <Text style={styles.date}>{dateToString(concertObj.date)}</Text>
                    <Text style={[styles.subtitle, { fontWeight: 'bold' }]}>{concertObj.title}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}> Naam </Text>
                    <TextInput style={styles.input} />
                    <Text style={styles.inputLabel}> Email </Text>
                    <TextInput style={styles.input} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => console.log('Koop ticket pressed')}
                    >
                        <Text style={styles.buttonText}>Koop ticket</Text>
                    </TouchableOpacity>
                </View>


            </ParallaxScrollView>
            :
            //false
            <View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 24 }}>Concert Not Found</Text>
                </View>
            </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    textContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        marginTop: 10,
        fontFamily: 'manrope'
    },
    date: {
        fontSize: 18,
        marginBottom: 5,
        fontFamily: 'manrope'
    },
    subtitle: {
        fontSize: 25,
        marginTop: 0,
        fontFamily: 'manrope'
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 1,
        marginTop: 10,
        // Add overflow hidden to ensure the image respects the borderRadius on Android
        overflow: 'hidden',
    },
    image: {
        width: 380,
        height: 380,
        borderRadius: 10, // Adjust this value for more or less rounding
    },
    inputContainer: {
        marginTop: 15,         // spacing above the input container
        paddingHorizontal: 20, // horizontal padding inside the container
    },
    input: {
        height: 50,                   // sets the height of the input box
        borderColor: '#ccc',          // light gray border color
        borderWidth: 1,               // border thickness
        borderRadius: 8,              // rounded corners for the input box
        paddingHorizontal: 15,        // horizontal padding inside the input box
        marginBottom: 15,             // space between multiple input boxes
        backgroundColor: '#fff',      // white background for the input
        fontFamily: 'manrope'

    },
    inputLabel: {
        marginBottom: 10,
        fontSize: 15,
        fontFamily: 'manrope'
    },
    buttonContainer: {
        marginTop: 5,
        paddingHorizontal: 20,
        marginBottom: 30, // Extra bottom spacing if needed
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#AF4926', // Blue background color
        borderRadius: 10,           // Rounded edges
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#F1F1F8',              // White text color
        fontSize: 16,
        fontWeight: 'bold',
    },
});