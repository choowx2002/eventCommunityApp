import {View, Image, StyleSheet, ScrollView, ToastAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {LoadingModal, loadingHook} from '../../components/LoadingModal';
import CustomText from '../../components/CustomText';
import fontSizes from '../../types/fontSize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../utils/themesChecker';
import {formatDate, formatTime} from '../../utils/dateTimeFormatter';
import CustomButton, {BackButton} from '../../components/CustomButton';
import CustomModel from '../../components/AlertModal'

const mockEventsData = [
  {
    ids: 1,
    title: 'Healing Through Music Workshop',
    desc: 'Join us for an interactive workshop exploring the healing power of music.',
    longDescription: `Join us for an \n
    immersive experience at the "Healing Through Music Workshop," where participants will explore the transformative power of music in promoting emotional and mental well-being. This interactive workshop is designed for individuals seeking to understand how music can be used as a therapeutic tool. Attendees will engage in various activities, including group music-making, guided listening sessions, and reflective discussions. Participants will learn techniques to harness the benefits of music therapy for personal growth and healing. This workshop is suitable for all ages and backgrounds, whether you are a seasoned musician or simply curious about the healing arts.
        immersive experience at the "Healing Through Music Workshop," where participants will explore the transformative power of music in promoting emotional and mental well-being. This interactive workshop is designed for individuals seeking to understand how music can be used as a therapeutic tool. Attendees will engage in various activities, including group music-making, guided listening sessions, and reflective discussions. Participants will learn techniques to harness the benefits of music therapy for personal growth and healing. This workshop is suitable for all ages and backgrounds, whether you are a seasoned musician or simply curious about the healing arts.
    `,
    starttime: '2024-08-05T10:00:00Z',
    endtime: '2024-08-05T12:00:00Z',
    startdate: '2024-08-05',
    endDate: '2024-08-05',
    imagePath: require('../../assets/images/pic1.jpg'),
    adminId: 101,
    participantsLimit: 20,
    address: '123 Harmony Lane',
    postcode: '12345',
    state: 'California',
    city: 'Los Angeles',
    categoryID: 1,
  },
  {
    ids: 2,
    title: 'Mindfulness Music Therapy Session',
    desc: 'Experience relaxation and mindfulness through guided music therapy.',
    longDescription: `Experience a 
    
    
    journey of relaxation and self-discovery in our "Mindfulness Music Therapy Session." This guided session combines mindfulness practices with the soothing effects of music therapy, aimed at reducing stress and promoting mental clarity. Participants will engage in mindfulness exercises while listening to calming music, allowing them to connect deeply with their inner selves. The session includes breathing techniques, body scans, and mindful listening, all facilitated by a certified music therapist. This workshop is perfect for anyone looking to enhance their well-being and find a moment of peace in their busy lives.`,
    starttime: '2024-08-10T14:00:00Z',
    endtime: '2024-08-10T15:30:00Z',
    startdate: '2024-08-10',
    endDate: '2024-08-10',
    imagePath: require('../../assets/images/pic1.jpg'),
    adminId: 102,
    participantsLimit: 15,
    address: '456 Serenity Ave',
    postcode: '67890',
    state: 'New York',
    city: 'New York',
    categoryID: 2,
  },
  {
    ids: 3,
    title: 'Family Music Therapy Day',
    desc: 'A fun-filled day of music therapy activities for families and children.',
    longDescription: `Bring the whole family to our "Family Music Therapy Day," a fun-filled event designed to strengthen family bonds through music. This day-long workshop features a variety of activities suitable for children and adults alike, including music games, interactive songs, and creative expression through instruments. Families will have the opportunity to participate in group music-making, fostering cooperation and joy while exploring the therapeutic benefits of music. Participants will also learn how to use music as a tool for communication and emotional expression within the family unit. This event promises to be both entertaining and enriching for families looking to enhance their connections through shared musical experiences.`,
    starttime: '2024-08-15T11:00:00Z',
    endtime: '2024-08-15T16:00:00Z',
    startdate: '2024-08-15',
    endDate: '2024-08-15',
    imagePath: require('../../assets/images/pic1.jpg'),
    adminId: 103,
    participantsLimit: 30,
    address: '789 Joyful St',
    postcode: '54321',
    state: 'Texas',
    city: 'Austin',
    categoryID: 3,
  },
  {
    ids: 4,
    title: 'Therapeutic Music for Anxiety Relief',
    desc: 'Learn techniques to use music for managing anxiety in this informative session.',
    longDescription: `Join us for an informative session on "Therapeutic Music for Anxiety Relief," where participants will discover effective techniques to manage anxiety through music. This workshop will explore the science behind music therapy and its profound impact on mental health. Attendees will learn about various musical interventions, such as guided imagery and music, songwriting, and improvisation, that can be used to alleviate anxiety symptoms. Led by a qualified music therapist, this session will provide practical tools that participants can integrate into their daily lives to promote relaxation and emotional stability. Suitable for anyone experiencing anxiety, this workshop aims to empower individuals to take control of their mental health.`,
    starttime: '2024-08-20T18:00:00Z',
    endtime: '2024-08-20T20:00:00Z',
    startdate: '2024-08-20',
    endDate: '2024-08-20',
    imagePath: require('../../assets/images/pic1.jpg'),
    adminId: 104,
    participantsLimit: 25,
    address: '321 Calm Blvd',
    postcode: '98765',
    state: 'Florida',
    city: 'Miami',
    categoryID: 1,
  },
  {
    ids: 5,
    title: 'Rhythm and Movement for Well-being',
    desc: 'A dynamic session combining music and movement for overall wellness.',
    longDescription: `Unleash your creativity and enhance your overall wellness in our "Rhythm and Movement for Well-being" session. This dynamic workshop combines the expressive elements of music and movement to promote physical health and emotional balance. Participants will engage in rhythmic exercises, dance, and creative movement activities designed to boost mood and increase energy levels. The session will also emphasize the importance of body awareness and self-expression through movement, encouraging participants to reconnect with their physical selves. Led by experienced facilitators, this workshop is ideal for individuals of all fitness levels and backgrounds, offering a joyous experience that uplifts the spirit and revitalizes the body.`,
    starttime: '2024-08-25T17:00:00Z',
    endtime: '2024-08-25T19:00:00Z',
    startdate: '2024-08-25',
    endDate: '2024-08-25',
    imagePath: require('../../assets/images/pic1.jpg'),
    adminId: 105,
    participantsLimit: 18,
    address: '654 Energy Rd',
    postcode: '24680',
    state: 'Illinois',
    city: 'Chicago',
    categoryID: 2,
  },
];

// Mock API function
const fetchEventDetails = eventId => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const event = mockEventsData.find(
        event => event.ids === parseInt(eventId),
      );
      if (event) resolve(event);
      else reject('no data');
    }, 1000); // Simulate network delay
  });
};

const EventsDetails = ({navigation}) => {
  const route = useRoute();
  const {theme} = useTheme();//theme color
  const [eventDetails, setEventDetails] = useState(null);//store event details from api
  const {isVisible, showLoadingModal, hideLoadingModal} = loadingHook();//get loading modal hook
  const [isSticky, setIsSticky] = useState(false);// set style
  const [containerY, setContainerY] = useState(null);// get position for styling purpose 
  const [alertState, setAlertState] = useState(false);//for alert modal shown
  const [isJoin, setIsJoin] = useState(false);

  useEffect(() => {
    showLoadingModal();
    const {eventId: routeId} = route.params || {}; // Get eventId from route parameters
    if (routeId) {
      fetchEventDetails(routeId)
        .then(event => {
          setEventDetails(event); // Set fetched event details
        })
        .catch(error => {
          // console.error('Error fetching event details:', error);
          navigation.goBack();
          ToastAndroid.show("Please Try Again", ToastAndroid.SHORT);
        })
        .finally(() => hideLoadingModal());
    }
  }, [route.params]);

  //get detail layout Y
  const savePosition = event => {
    setContainerY(event.nativeEvent.layout.y);
  };

  // calculate the offset is it meet the detail Y which means stick to header or not
  // if meet then add the padding for route back
  const handleScroll = event => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    setIsSticky(scrollOffsetY > containerY - 20);
  };

  //function to show alert
  const showAlert = () => {
    console.log('click button')
    setAlertState(true);
  };

  //function to hide alert
  const hideAlert = () => {
    setAlertState(false);
    setIsJoin(!isJoin)
    navigation.pop()
  };

  return (
    <View style={{flex: 1,backgroundColor: theme.cardBackground}}>
      <LoadingModal text="loading" isVisible={isVisible} />
      {eventDetails && (
        <View style={{flex: 1}}>
          <ScrollView
            stickyHeaderIndices={[1]}
            contentContainerStyle={{paddingBottom: 80}}
            onScroll={handleScroll}>
            {/* event banner image */}
            <Image
              style={[styles.image, {backgroundColor: theme.cardBackground}]}
              source={eventDetails.imagePath}
              resizeMode="cover"
            />
            <View
              onLayout={savePosition}
              style={[
                styles.detailContainer,
                {
                  backgroundColor: theme.cardBackground,
                  paddingTop: isSticky ? 50 : 0,
                },
              ]}>
              {/* event's title */}
              <CustomText weight="bold" style={styles.title} numberOfLines={1}>
                {eventDetails.title}
              </CustomText>

              {/* event date */}
              <View style={styles.info}>
                <Ionicons
                  name={'calendar'}
                  color={theme.text}
                  size={fontSizes.xlarge}
                />
                <CustomText>
                  {formatDate(eventDetails.startdate)} -{' '}
                  {formatDate(eventDetails.endDate)}
                </CustomText>
              </View>

              {/* event time */}
              <View style={styles.info}>
                <Ionicons
                  name={'time'}
                  color={theme.text}
                  size={fontSizes.xlarge}
                />
                <CustomText>
                  {formatTime(eventDetails.starttime)} -{' '}
                  {formatTime(eventDetails.endtime)}
                </CustomText>
              </View>

              {/* event location */}
              <View style={styles.info}>
                <Ionicons
                  name={'location'}
                  color={theme.text}
                  size={fontSizes.xlarge}
                />
                <CustomText style={{lineHeight: 20}}>
                  {eventDetails.address}, {eventDetails.postcode},{' '}
                  {eventDetails.city}, {eventDetails.state}
                </CustomText>
              </View>

              {/* event participants */}
              <View style={styles.info}>
                <Ionicons
                  name={'person'}
                  color={theme.text}
                  size={fontSizes.xlarge}
                />
                <CustomText>1 / {eventDetails.participantsLimit}</CustomText>
              </View>
              <CustomText style={styles.title}>Description</CustomText>
            </View>
            <View style={styles.detailContainer}>
              {/* event description scroll view */}
              <CustomText style={{lineHeight: 24}}>
                {eventDetails.longDescription}
              </CustomText>
            </View>
          </ScrollView>

          {/* button for join */}
          <CustomButton
            style={styles.button}
            theme={isJoin?'danger':'primary'}
            onPress={showAlert}
          >
            {isJoin?'LEAVE':'JOIN'}
          </CustomButton>

          {/* back button */}
          <BackButton navigation={navigation} />
          
          {/* promp when click join/leave */}
          <CustomModel
            title={isJoin?`Are you sure to leave ${eventDetails.title}`:`Are you sure to join ${eventDetails.title}?`}
            themeColor = {isJoin?'danger':'bw'}
            isVisible={alertState}
            onClose={hideAlert}
            onConfirm={hideAlert}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: fontSizes.header,
    marginVertical: 10,
  },
  descTitle: {
    fontSize: fontSizes.header,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 6 / 3,
  },
  button: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
});

export default EventsDetails;
