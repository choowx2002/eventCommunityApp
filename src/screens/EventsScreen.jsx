import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getEventByCatId, getEventByState, getEvents } from '../services/eventApi.service';
import { getFontFamily } from '../types/customFonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../utils/themesUtil';
import fontSizes from '../types/fontSize';
import CustomText from '../components/CustomText';
import { format } from 'date-fns';
import { getAllCategories } from '../services/categoryApi.service';
import CustomButton from '../components/CustomButton';

const EventsScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const route = useRoute();
    const [eventsData, setEventData] = useState([]);
    const [eventsCategories, setEventsCategories] = useState([]);
    //styles
    const styles = StyleSheet.create({
        searchInputBox: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            paddingHorizontal: 10,
            gap: 5,
            borderWidth: 1,
            borderRadius: 30,
            borderColor: theme.text,
            backgroundColor: theme.cardBackground,
        },
        inputBox: {
            flex: 1,
            color: theme.text,
            paddingVertical: 5,
        },
        searchButton: {
            marginVertical: 5,
            paddingVertical: 5,
            paddingHorizontal: 20,
            elevation: 0,
            lineHeight: '100%',
        },
        eventItem: {
            backgroundColor: theme.cardBackground,
            marginBottom: 10,
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        eventInfo: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        eventMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        title: {
            fontSize: fontSizes.large,
            marginBottom: 2,
        },
        flatList: {
            paddingBottom: 50,
        },
        noEventsBox: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        noEventsText: {
            fontSize: fontSizes.xxlarge,
            textAlign: 'center',
            marginHorizontal: 30,
        },
    });
    useEffect(() => {
        setEventData([]);

        const type = route.params?.type;
        const value = route.params?.value;
        console.log(type, value);
        renderSelectCategories();
        if (!type || type == "all") {
            renderAll();
        }
        else if (!type || type == "Location") {
            renderLocation(value);
        }
        else {
            renderCategories(value);
        }


    }, [route.params])

    const renderAll = async () => {
        try {
            const events = await getEvents();
            if (events?.data?.events) setEventData(events.data.events);
        } catch (error) {
            console.log(error);
        }
    }

    const renderLocation = async (location) => {
        try {
            const events = await getEventByState({ state: location, limit: 10 });
            if (events?.data?.events) setEventData(events.data.events);
        } catch (error) {
            console.log(error);
        }
    }

    const renderCategories = async ({ id, name }) => {
        try {
            const events = await getEventByCatId({ category_id: id, limit: 10 });
            if (events?.data?.events) setEventData(events.data.events);
        } catch (error) {
            console.log(error);
        }
    }

    const renderSelectCategories = async () => {
        try {
            const categories = await getAllCategories();
            if (categories?.data?.categories) {
                let res = categories.data.categories;
                let newRes = [];
                let sliceNum = 6;
                if (route.params?.type === 'Categories' && route.params?.value.id) {
                    sliceNum = 5
                    newRes = res.filter(obj => {
                        if (obj.id != route.params?.value.id)
                            return obj
                    });
                }
                if(newRes.length > 0) res = newRes;
                res = res.sort(() => Math.random() - 0.5).slice(0, sliceNum);
                if (sliceNum === 5) res = [route.params.value, ...res]
                setEventsCategories(res);
            }
            console.log(categories);
        } catch (error) {
            console.log(error);
        }
    }



    const EventItem = ({ event }) => {
        return (
            <Pressable
                style={styles.eventItem}
                onPress={() => navigation.navigate('eDetails', { eventId: event.id })}>

                <CustomText
                    style={[styles.title, getFontFamily('bold')]}
                    numberOfLines={1}>
                    {event.title}
                </CustomText>
                <View style={styles.eventInfo}>
                    <View style={styles.eventMeta}>
                        <Ionicons
                            name={'calendar'}
                            color={theme.text}
                            size={fontSizes.regular}
                        />
                        <CustomText>{format(event.start_date, 'yyyy-MM-dd')}</CustomText>
                    </View>
                    <View style={styles.eventMeta}>
                        <Ionicons
                            name={'person'}
                            color={theme.text}
                            size={fontSizes.regular}
                        />
                        <CustomText>
                            {event.participants}/{event.participants_limit}
                        </CustomText>
                    </View>
                </View>
            </Pressable>
        );
    };
    return (
        <View>
            <Text>EventsList</Text>
            {eventsCategories.length > 0 && eventsCategories.map((category) => {
                return (
                    <CustomButton key={category.id} onPress={() => navigation.navigate('Events',
                        {
                            type: "Categories", value: {
                                id: category.id,
                                name: category.name,
                            }
                        })
                    }>
                        {category.name}
                    </CustomButton>
                );
            })}

            <CustomText>{route.params?.type === "all" || !route.params.type ? "All Events" : route.params?.type === "Location" ? "Nearby Events" : route.params.value.name}</CustomText>
            <FlatList

                style={styles.flatList}
                data={eventsData}
                renderItem={({ item }) => <EventItem event={item} />}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default EventsScreen;
