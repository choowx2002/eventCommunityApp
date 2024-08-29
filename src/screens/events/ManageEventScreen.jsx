import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useRoute} from '@react-navigation/native';
import {LoadingModal, loadingHook} from '../../components/LoadingModal';
import CustomText from '../../components/CustomText';
import fontSizes from '../../types/fontSize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../utils/themesUtil';
import {BackButton, FabButton} from '../../components/CustomButton';
import CustomModel from '../../components/AlertModal';
import PagerView from 'react-native-pager-view';
import DetailTab from '../manageTabs/DetailTab';
import NotificationTab from '../manageTabs/NotificationTab';
import {globalStyle} from '../../styles/globalStyles';
import {createCSV} from '../../utils/createCSV';
import {format} from 'date-fns';
import {
  getEventById,
  getParticipantsById,
} from '../../services/eventApi.service';
import {getNotificationByEventId} from '../../services/notificationApi.service'
import {getHostName} from '../../services/api';

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
  const [eParticipants, setParticipants] = useState(null);
  const [notifications, setNotifications] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const handlePageChange = pageNumber => {
    setSelectedTab(pageNumber);
    pagerRef.current.setPage(pageNumber);
  };

  useEffect(() => {
    const {eventId: routeId} = route.params || {}; // Get eventId from route parameters
    if (!routeId) {
      navigation.goBack();
      return ToastAndroid.show('Please Try Again', ToastAndroid.SHORT);
    }
    showLoadingModal();
    fetchEventDetails(routeId).finally(()=>hideLoadingModal())
  }, [route.params]);

  //get data from db
  const fetchEventDetails = async eventId => {
    try {
      let uid = 51; // testing purpose
      const res = await getEventById(eventId);
      const participantList = await  getParticipants(eventId)
      const notificationList = await getNotification(eventId)
      setEventDetails(res?.data?.event);
      setParticipants(participantList);
      setNotifications(notificationList)
    } catch (error) {
      console.log(error)
      navigation.goBack();
      return ToastAndroid.show('Please Try Again', ToastAndroid.SHORT);
    }

  };

  // get participants details
  const getParticipants = async eventId => {
     return getParticipantsById(eventId)
      .then(res => {
        return res.data;
      })
      .catch(error => {
        throw new Error(error);
      });
  };

  //get notifications list
  const getNotification = async eventId => {
    return getNotificationByEventId(eventId)
      .then(res => {
        return res.data?.notifications;
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  const onRefresh = async (type) => {
    if(refreshing) return
    if(!route.params.eventId) return 
    try {
      setRefreshing(true);
      if (type==="participants") {
        const participantList = await  getParticipants(route.params.eventId)
        setParticipants(participantList);
        console.log("refresh participants list")
        return
      } else if(type === "notification"){
        const newNotifications = await  getNotification(route.params.eventId)
        setNotifications(newNotifications);
        console.log("refresh Notifications list")
        return
      }
      await fetchEventDetails(route.params.eventId);
      console.log("refresh all")
    } catch (error) {
      ToastAndroid.show('Something get wrong! Please Try Again', ToastAndroid.SHORT);
    } finally { 
      setRefreshing(false)
    }
  };

  const _exportCSV = async () => {
    if(!eParticipants) return
    showLoadingModal();
    const formattedDate = format(new Date(), 'yyyy_MM_dd_HH_mm');
    const filename = `${eventDetails.title.replace(/\s/g, '')}${formattedDate}`;
    const result = await createCSV(
      eParticipants.participants,
      ['id', 'first_name', 'last_name',  'gender', 'email'],
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
      navigation.navigate('newNotification', {eventId: route.params.eventId, refresh:()=>onRefresh("notification")});
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
            <ScrollView key="1" refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={()=>onRefresh()} />
            }>
              <Image
                style={[styles.image, dynamicStyles.image]}
                source={
                  eventDetails.image_path
                    ? {uri: `${getHostName()}${eventDetails.image_path}`}
                    : require('../../assets/images/example.jpeg')
                }
                resizeMode="cover"
              />
              {eventDetails && <DetailTab eventDetails={eventDetails} />}
            </ScrollView>
            <View key="2" >
              <NotificationTab notificationList={notifications} onRefresh={()=>onRefresh("notification")} />
            </View>
            <ScrollView key="3" stickyHeaderIndices={[0]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={()=>onRefresh("participants")} />
            }>
              {eParticipants && (
                <View>
                  <View style={styles.participantNumber}>
                    <Ionicons
                      name="person"
                      size={fontSizes.regular}
                      color={theme.text}
                    />
                    <CustomText>
                      {eParticipants.count} / {eventDetails.participants_limit}
                    </CustomText>
                  </View>
                </View>
              )}
              {eParticipants &&
                eParticipants.participants.map(p => {
                  return (
                    <View
                      style={[
                        styles.participantBox,
                        dynamicStyles.participantBox,
                      ]}
                      key={p.id}>
                      <CustomText weight="semiBold">
                        {p.first_name}
                        {p.last_name}
                      </CustomText>
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
