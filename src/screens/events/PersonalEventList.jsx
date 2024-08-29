import {Alert, RefreshControl, View, StyleSheet, Pressable, ToastAndroid} from 'react-native';
import React, {useEffect, useState,useCallback} from 'react';
import {useTheme} from '../../utils/themesUtil';
import {globalStyle} from '../../styles/globalStyles';
import CustomButton, {BackButton} from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import fontSizes from '../../types/fontSize';
import {FlatList} from 'react-native-gesture-handler';
import {useRoute} from '@react-navigation/native';
import {LoadingModal, loadingHook} from '../../components/LoadingModal';
import {getFontFamily} from '../../types/customFonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getUserEvents} from '../../services/userApi.service';
import {format, parse} from 'date-fns';

const groups = {
  active: {
    title: 'Ongoing Events',
    noEventsPhrase: 'No ongoing events at the moment.',
    buttonText: 'Explore more!',
  },
  past: {
    title: 'Past Events',
    noEventsPhrase: 'No past events available.',
    buttonText: 'Explore more!',
  },
  manage: {
    title: 'Manage Events',
    noEventsPhrase: 'You have no events to manage.',
    buttonText: 'Host your own event!',
  },
};

const events = [
  {
    id: '1',
    title: 'Music Therapy Workshop',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-08-15',
    startTime: '10:00 AM',
    endDate: '2024-08-15',
    endTime: '12:00 PM',
    location: 'Community Center',
    imageUrl: 'https://picsum.photos/500/250',
  },
  {
    id: '2',
    title: 'Group Session',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-08-20',
    startTime: '02:00 PM',
    endDate: '2024-08-20',
    endTime: '03:30 PM',
    location: 'Library Hall',
    imageUrl: 'https://picsum.photos/600/250',
  },
  {
    id: '3',
    title: 'One-on-One Therapy',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-08-25',
    startTime: '11:00 AM',
    endDate: '2024-08-25',
    endTime: '12:00 PM',
    location: 'Therapy Room 3',
    imageUrl: 'https://picsum.photos/500/240',
  },
  {
    id: '4',
    title: 'Evening Relaxation Session',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-08-18',
    startTime: '06:00 PM',
    endDate: '2024-08-18',
    endTime: '07:00 PM',
    location: 'Park Pavilion',
    imageUrl: 'https://picsum.photos/500/260',
  },
  {
    id: '5',
    title: 'Mindfulness Meditation',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-08-22',
    startTime: '09:00 AM',
    endDate: '2024-08-22',
    endTime: '10:30 AM',
    location: 'Yoga Studio',
    imageUrl: 'https://picsum.photos/600/260',
  },
  {
    id: '6',
    title: 'Art Therapy Session',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-08-28',
    startTime: '03:00 PM',
    endDate: '2024-08-28',
    endTime: '05:00 PM',
    location: 'Art Room 2',
    imageUrl: 'https://picsum.photos/500/270',
  },
  {
    id: '7',
    title: 'Therapeutic Drumming Circle',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-08-30',
    startTime: '04:00 PM',
    endDate: '2024-08-30',
    endTime: '06:00 PM',
    location: 'Music Hall',
    imageUrl: 'https://picsum.photos/600/270',
  },
  {
    id: '8',
    title: 'Morning Yoga and Music',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-09-01',
    startTime: '07:00 AM',
    endDate: '2024-09-01',
    endTime: '08:30 AM',
    location: 'Outdoor Garden',
    imageUrl: 'https://picsum.photos/500/280',
  },
  {
    id: '9',
    title: 'Family Music Therapy',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-09-05',
    startTime: '02:00 PM',
    endDate: '2024-09-05',
    endTime: '03:30 PM',
    location: 'Community Hall',
    imageUrl: 'https://picsum.photos/600/280',
  },
  {
    id: '10',
    title: 'Stress Relief with Music',
    maxParticipants: '100',
    currentParticipants: '2',
    startDate: '2024-09-10',
    startTime: '05:00 PM',
    endDate: '2024-09-10',
    endTime: '06:30 PM',
    location: 'Wellness Center',
    imageUrl: 'https://picsum.photos/500/290',
  },
];

// Mock API function

const PersonalEventList = ({navigation}) => {
  const route = useRoute();
  const {listType} = route.params;
  const {theme} = useTheme();
  const [constantText, setConstantText] = useState(groups['active']);
  const [events, setEvents] = useState([]);
  const {isVisible, showLoadingModal, hideLoadingModal} = loadingHook();
  const [refreshing, setRefreshing] = useState(false);
  const [apiCall, setApiCall] = useState(0)

  // set the type of list page
  // if no type or wrong declare will show toast and route back
  useEffect(() => {
    showLoadingModal();
    if (!groups[listType]) {
      navigation.goBack();
      return ToastAndroid.show('Please Try Again', ToastAndroid.SHORT);
    }
    setConstantText(groups[listType]);
    _fetchEventDetails(listType== 'manage'?'own':listType);
  }, [listType]);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: theme.background,
      flex: 1,
    },
    noEventsText: {
      fontSize: fontSizes.xxlarge,
      textAlign: 'center',
      marginHorizontal: 30,
      marginBottom: 20,
    },
    noEventsBox: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    eventItem: {
      backgroundColor: theme.cardBackground,
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingBottom: 15,
      paddingTop: 20,
    },
    eventInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    eventMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginBottom: 5,
    },
    eventTitle: {
      fontSize: fontSizes.large,
      marginBottom: 10,
    },
    eventParticipants: {
      textAlign: 'right',
      alignItems:'flex-end'
    },
  });

  const _fetchEventDetails = (eventType) => {
    getUserEvents({userId: 51, eventType}) //testing purpose
      .then(res => {
        console.log(JSON.stringify(res));
        setEvents(res.data.userEvents);
      })
      .catch(() => {
        Alert.alert('There are something wrong. QAQ');
      })
      .finally(() => {
        setApiCall(1)
        hideLoadingModal();
      });
  };

  /**
   *
   * @param action - detect which  route action
   * @param id -  for detail's page it will need a id. if don't have, it will show toast
   */
  const routeTo = (action, id = null) => {
    switch (action) {
      case 'detail':
        if (id === null)
          return ToastAndroid.show('Please Try Again', ToastAndroid.SHORT);
        console.log(action,id)
        navigation.navigate(
          listType === 'manage' ? 'manageEvent' : 'eDetails',
          {
            eventId: id,
          },
        );
        break;
      case 'list':
        navigation.navigate(listType === 'manage' ? 'create' : 'eList');
        break;
      default:
        break;
    }
  };

  //refresh the manage list
  const onRefresh = useCallback(() => {
    if(!refreshing){
      setRefreshing(true);
      _fetchEventDetails(listType== 'manage'?'own':listType)
    }
    while(apiCall < 1) {
      return
    }
    setApiCall(0)
    setRefreshing(false)
  }, [apiCall]);

  //used for render items
  const EventItem = ({event}) => {
    return (
      <Pressable
        style={styles.eventItem}
        onPress={() => routeTo('detail', event.id)}>
        {/* title */}
        <CustomText
          style={[styles.eventTitle, getFontFamily('bold')]}
          numberOfLines={1}>
          {event.title}
        </CustomText>

        {/* show event's date */}
        <View style={styles.eventMeta}>
          <Ionicons
            name={'calendar-outline'}
            color={theme.text}
            size={fontSizes.regular}
          />
          <CustomText>
            {format(event.start_date, 'yyyy-MM-dd')} -{' '}
            {format(event.end_date, 'yyyy-MM-dd')}
          </CustomText>
        </View>

        {/* show event's time */}
        <View style={styles.eventMeta}>
          <Ionicons
            name={'time-outline'}
            color={theme.text}
            size={fontSizes.regular}
          />
          <CustomText>
            {format(parse(event.start_time, 'HH:mm:ss', new Date()), 'hh:mm a')}{' '}
            - {format(parse(event.end_time, 'HH:mm:ss', new Date()), 'hh:mm a')}
          </CustomText>
        </View>

        <View style={styles.eventInfo}>
          {/* show event's location state/city */}
          <View style={[styles.eventMeta,{width: '75%'}]}>
            <Ionicons
              name={'location-outline'}
              color={theme.text}
              size={fontSizes.regular}
            />
            <CustomText numberOfLines={2}>
              {event.address}, {event.postcode}, {event.city}, {event.state}
            </CustomText>
          </View>

          {/* show event's participants */}
          <View style={[styles.eventMeta,styles.eventParticipants]}>
            <Ionicons
              name={'person-outline'}
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
    <View style={styles.page}>
      <View style={globalStyle.header}>
        <BackButton navigation={navigation} float={false} showBg={false} />
        <CustomText weight="bold" style={globalStyle.headerTitle}>
          {constantText.title}
        </CustomText>
      </View>

      {/* loading */}
      <LoadingModal text="loading" isVisible={isVisible} />

      {/* events list */}
      {!isVisible &&
        (events.length > 0 ? (
          <FlatList
            style={styles.flatList}
            data={events}
            renderItem={({item}) => <EventItem event={item} />}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View style={styles.noEventsBox}>
            <CustomText weight="italic" style={styles.noEventsText}>
              {constantText.noEventsPhrase}
            </CustomText>
            <CustomButton theme="secondary" onPress={() => routeTo('list')}>
              {constantText.buttonText}
            </CustomButton>
          </View>
        ))}
    </View>
  );
};

export default PersonalEventList;
