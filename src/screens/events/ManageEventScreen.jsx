import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import {LoadingModal, loadingHook} from '../../components/LoadingModal';
import CustomText from '../../components/CustomText';
import fontSizes from '../../types/fontSize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../utils/themesChecker';
import {BackButton, FabButton} from '../../components/CustomButton';
import CustomModel from '../../components/AlertModal';
import PagerView from 'react-native-pager-view';
import DetailTab from '../manageTabs/DetailTab';
import NotificationTab from '../manageTabs/NotificationTab';
import {globalStyle} from '../../styles/globalStyles';
import {createCSV} from '../../utils/createCSV';
import {format} from 'date-fns';

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
    participantsLimit: 100,
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

const participants = [
  {id: 1, name: 'John Doe', email: 'john.doe@example.com', gender: 'male'},
  {id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', gender: 'female'},
  {id: 3, name: 'Bob Smith', email: 'bob.smith@example.com', gender: 'male'},
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    gender: 'female',
  },
  {id: 5, name: 'Mike Brown', email: 'mike.brown@example.com', gender: 'male'},
  {
    id: 6,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    gender: 'female',
  },
  {id: 7, name: 'David Lee', email: 'david.lee@example.com', gender: 'male'},
  {
    id: 8,
    name: 'Sarah Taylor',
    email: 'sarah.taylor@example.com',
    gender: 'female',
  },
  {
    id: 9,
    name: 'Kevin White',
    email: 'kevin.white@example.com',
    gender: 'male',
  },
  {
    id: 10,
    name: 'Olivia Martin',
    email: 'olivia.martin@example.com',
    gender: 'female',
  },
  {
    id: 11,
    name: 'William Harris',
    email: 'william.harris@example.com',
    gender: 'male',
  },
  {
    id: 12,
    name: 'Ava Thompson',
    email: 'ava.thompson@example.com',
    gender: 'female',
  },
  {
    id: 13,
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    gender: 'male',
  },
  {
    id: 14,
    name: 'Isabella Garcia',
    email: 'isabella.garcia@example.com',
    gender: 'female',
  },
  {
    id: 15,
    name: 'Robert Miller',
    email: 'robert.miller@example.com',
    gender: 'male',
  },
  {
    id: 16,
    name: 'Mia Rodriguez',
    email: 'mia.rodriguez@example.com',
    gender: 'female',
  },
  {
    id: 17,
    name: 'Richard Lewis',
    email: 'richard.lewis@example.com',
    gender: 'male',
  },
  {
    id: 18,
    name: 'Sophia Kim',
    email: 'sophia.kim@example.com',
    gender: 'female',
  },
  {
    id: 19,
    name: 'Daniel Brooks',
    email: 'daniel.brooks@example.com',
    gender: 'male',
  },
  {
    id: 20,
    name: 'Julia Price',
    email: 'julia.price@example.com',
    gender: 'prefer not to say',
  },
];

const notificationList = [
  {
    id: 1,
    title: 'Welcome Notification',
    message: 'Welcome to our application!',
    created_date: '2024-08-05T10:00:00Z',
  },
  {
    id: 2,
    title: 'Event Reminder',
    message: "Don't forget about the upcoming event tomorrow!",
    created_date: '2024-08-04T12:30:00Z',
  },
  {
    id: 3,
    title: 'New Feature Update',
    message:
      "Check out the new features we've added in the latest update.Check out the new features we've added in the latest update.Check out the new features we've added in the latest update.",
    created_date: '2024-08-03T15:45:00Z',
  },
  {
    id: 4,
    title: 'Weekly Digest',
    message: "Here's a summary of what happened this week.",
    created_date: '2024-08-02T08:20:00Z',
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

//tab sections
const tabs = [
  {index: 0, name: 'Details'},
  {index: 1, name: 'Notification'},
  {index: 2, name: 'Participants'},
];

const ManageEventScreen = ({navigation}) => {
  const route = useRoute();
  const {theme} = useTheme(); //theme color
  const [eventDetails, setEventDetails] = useState(null); //store event details from api
  const {isVisible, showLoadingModal, hideLoadingModal} = loadingHook(); //get loading modal hook
  const [alertState, setAlertState] = useState(false); //for alert modal shown
  const pagerRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const handlePageChange = pageNumber => {
    setSelectedTab(pageNumber);
    pagerRef.current.setPage(pageNumber);
  };

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
          ToastAndroid.show('Please Try Again', ToastAndroid.SHORT);
        })
        .finally(() => hideLoadingModal());
    }
  }, [route.params]);

  const _exportCSV = async () => {
    showLoadingModal();
    const formattedDate = format(new Date(), 'yyyy_MM_dd_HH_mm');
    const filename = `${eventDetails.title.replace(/\s/g, '')}${formattedDate}`;
    const result = await createCSV(
      participants,
      ['id', 'name', 'email', 'gender'],
      filename,
    );
    if (result.success) {
      ToastAndroid.show(
        `Export CSV File Done. Please check at ${result.destination}`,
        ToastAndroid.SHORT,
      );
    } else {
      ToastAndroid.show(
        `Export CSV File Failed. Please try again later`,
        ToastAndroid.SHORT,
      );
    }
    hideLoadingModal();
  };

  //function to show alert
  const showAlert = () => {
    setAlertState(true);
  };

  //function to hide alert
  const hideAlert = isProceed => {
    setAlertState(false);
    if (isProceed) _exportCSV();
  };

  //fab function for each tab
  const fabFunction = tabIndex => {
    if (tabIndex === 2) {
      showAlert();
    } else {
      navigation.navigate('newNotification', {eventId: route.params.eventId});
    }
  };

  const dynamicStyles = StyleSheet.create({
    image: {
      backgroundColor: theme.cardBackground,
    },
    tabContainer: {
      backgroundColor: theme.cardBackground,
    },
    selectedTab: {
      borderBottomWidth: 3,
      borderBottomColor: theme.primary,
    },
    tabText: {
      fontSize: fontSizes.medium,
    },
    pagerView: {
      backgroundColor: theme.background,
    },
    participantBox: {
      backgroundColor: theme.cardBackground,
    },
  });

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View style={[globalStyle.header, dynamicStyles.tabContainer]}>
        <BackButton navigation={navigation} float={false} showBg={false} />
        <CustomText weight="bold" style={globalStyle.headerTitle}>
          Event
        </CustomText>
      </View>
      <LoadingModal text="loading" isVisible={isVisible} />

      {eventDetails && (
        <View style={{flex: 1}}>
          <View style={[styles.tabContainer, dynamicStyles.tabContainer]}>
            {tabs.map(tab => {
              return (
                <TouchableOpacity
                  style={[
                    styles.tab,
                    selectedTab === tab.index && dynamicStyles.selectedTab,
                  ]}
                  key={tab.index}
                  onPress={() => handlePageChange(tab.index)}>
                  <CustomText
                    weight="bold"
                    style={[styles.tabText, dynamicStyles.tabText]}>
                    {tab.name}
                  </CustomText>
                </TouchableOpacity>
              );
            })}
          </View>

          <PagerView
            style={dynamicStyles.pagerView}
            initialPage={0}
            ref={pagerRef}
            onPageSelected={e => setSelectedTab(e.nativeEvent.position)}>
            <ScrollView key="1">
              <Image
                style={[styles.image, dynamicStyles.image]}
                source={eventDetails.imagePath}
                resizeMode="cover"
              />
              {eventDetails && (
                <DetailTab
                  eventDetails={eventDetails}
                  participants={participants}
                />
              )}
            </ScrollView>
            <View key="2">
              <NotificationTab notificationList={notificationList} />
            </View>
            <ScrollView key="3" stickyHeaderIndices={[0]}>
              <View>
                <View style={styles.participantNumber}>
                  <Ionicons
                    name="person"
                    size={fontSizes.regular}
                    color={theme.text}
                  />
                  <CustomText>
                    {participants.length} / {eventDetails.participantsLimit}
                  </CustomText>
                </View>
              </View>

              {participants.map(p => {
                return (
                  <View
                    style={[
                      styles.participantBox,
                      dynamicStyles.participantBox,
                    ]}
                    key={p.id}>
                    <CustomText weight="semiBold">{p.name}</CustomText>
                    {p.gender !== 'prefer not to say' && (
                      <Ionicons
                        name={
                          p.gender === 'male'
                            ? 'male-outline'
                            : 'female-outline'
                        }
                        size={fontSizes.regular}
                        color={p.gender === 'male' ? 'blue' : 'pink'}
                      />
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </PagerView>
          {selectedTab !== 0 && (
            <FabButton
              theme="secondary"
              icon={
                <Ionicons
                  name={selectedTab === 2 ? 'download-outline' : 'add-outline'}
                  size={26}
                  color={theme.text}
                  onPress={() => fabFunction(selectedTab)}
                />
              }
            />
          )}
          <CustomModel
            title={`Are you sure to export CSV?`}
            themeColor={'bw'}
            isVisible={alertState}
            onClose={() => hideAlert(false)}
            onConfirm={() => hideAlert(true)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 6 / 3,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 0.33,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  tabText: {
    textAlign: 'center',
  },
  participantNumber: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
  },
  participantBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 6,
    gap: 5,
  },
});
export default ManageEventScreen;
