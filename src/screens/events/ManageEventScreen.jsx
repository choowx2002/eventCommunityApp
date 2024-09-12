import { View, Image, StyleSheet, ScrollView, ToastAndroid, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PagerView from 'react-native-pager-view';
//components
import { LoadingModal, loadingHook } from '../../components/LoadingModal';
import CustomText from '../../components/CustomText';
import { BackButton, FabButton } from '../../components/CustomButton';
import CustomModel from '../../components/AlertModal';
import DetailTab from '../manageTabs/DetailTab';
import NotificationTab from '../manageTabs/NotificationTab';
//others
import { globalStyle } from '../../styles/globalStyles';
import fontSizes from '../../types/fontSize';
import { createCSV } from '../../utils/createCSV';
import { useTheme } from '../../utils/themesUtil';
import { getEventById, getParticipantsById } from '../../services/eventApi.service';
import { getNotificationByEventId } from '../../services/notificationApi.service';
import { getHostName } from '../../services/api';

//tab sections
const tabs = [
  { index: 0, name: 'Details' },
  { index: 1, name: 'Notification' },
  { index: 2, name: 'Participants' },
];

const ManageEventScreen = ({ navigation }) => {
  const route = useRoute();
  const { theme } = useTheme(); //theme color
  const { isVisible, showLoadingModal, hideLoadingModal } = loadingHook(); //get loading modal hook
  const pagerRef = useRef(null);
  const [eventDetails, setEventDetails] = useState(null); //store event details from api
  const [alertState, setAlertState] = useState(false); //for alert modal shown
  const [selectedTab, setSelectedTab] = useState(0);
  const [eParticipants, setParticipants] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const dynamicStyles = StyleSheet.create({
    image: {
      backgroundColor: theme.background,
    },
    tabContainer: {
      backgroundColor: theme.background,
    },
    selectedTab: {
      borderBottomWidth: 3,
      borderBottomColor: theme.primaryBG,
    },
    tabText: {
      fontSize: fontSizes.medium,
    },
    pagerView: {
      backgroundColor: theme.background,
    },
    participantBox: {
      backgroundColor: theme.background,
    },
  });

  //layout function
  //listner for page change between tab
  const handlePageChange = (pageNumber) => {
    setSelectedTab(pageNumber);
    pagerRef.current.setPage(pageNumber);
  };

  //error toast
  const showErrorToast = (message, goBack = fasle) => {
    if (goBack) navigation.goBack();
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  useEffect(() => {
    const { eventId: routeId } = route.params || {}; // Get eventId from route parameters
    if (!routeId) return showErrorToast('Please Try Again Later(ง •_•)ง', true);
    showLoadingModal();
    fetchEventDetails(routeId).finally(() => hideLoadingModal());
  }, [route.params]);

  //get data from db
  const fetchEventDetails = async (eventId) => {
    try {
      const event = await getEventById(eventId);
      const participantList = await getParticipants(eventId);
      const notificationList = await getNotification(eventId);
      if (!event || !participantList || !notificationList)
        return showErrorToast('Please Try Again Later(ง •_•)ง', true);
      setEventDetails(event?.data?.event);
      setParticipants(participantList);
      setNotifications(notificationList);
    } catch (error) {
      console.log(error);
      return showErrorToast('Please Try Again Later(ง •_•)ง', true);
    }
  };

  // get participants details
  const getParticipants = async (eventId) => {
    return getParticipantsById(eventId)
      .then((res) => {
        return res?.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  //get notifications list
  const getNotification = async (eventId) => {
    return getNotificationByEventId(eventId)
      .then((res) => {
        return res?.data?.notifications;
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const onRefresh = async (type) => {
    if (refreshing) return;
    if (!route.params.eventId) return;
    try {
      setRefreshing(true);
      if (type === 'participants') {
        const participantList = await getParticipants(route.params.eventId);
        if (participantList) setParticipants(participantList);
        return;
      } else if (type === 'notification') {
        const newNotifications = await getNotification(route.params.eventId);
        if (newNotifications) setNotifications(newNotifications);
        return;
      }
      await fetchEventDetails(route.params.eventId);
    } catch (error) {
      showErrorToast('Something get wrong! Please Try Again(ง •_•)ง', false);
    } finally {
      setRefreshing(false);
    }
  };

  const _exportCSV = () => {
    if (!eParticipants) return;
    showLoadingModal();
    const formattedDate = format(new Date(), 'yyyy_MM_dd_HH_mm');
    const filename = `${eventDetails.title.replace(/\s/g, '')}${formattedDate}`;
    createCSV(eParticipants.participants, ['id', 'first_name', 'last_name', 'gender', 'email'], filename)
      .then((result) => {
        if (result.success) {
          showErrorToast(`٩( ᐛ )و Export Success. Please check at ${result.destination}`, false);
        } else {
          showErrorToast('Something get wrong! Please Try Again(ง •_•)ง', false);
        }
      })
      .catch((err) => {
        console.log(err);
        showErrorToast('Something get wrong! Please Try Again(ง •_•)ง', false);
      })
      .finally(() => hideLoadingModal());
  };

  //function to hide alert
  const hideAlert = (isProceed) => {
    setAlertState(false);
    if (isProceed) _exportCSV();
  };

  //fab function for each tab
  const fabFunction = (tabIndex) => {
    if (tabIndex === 2) {
      setAlertState(true);
    } else {
      navigation.navigate('newNotification', {
        eventId: route.params.eventId,
        refresh: () => onRefresh('notification'),
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[globalStyle.header, dynamicStyles.tabContainer]}>
        <BackButton navigation={navigation} float={false} showBg={false} />
        <CustomText weight="bold" style={globalStyle.headerTitle}>
          Event
        </CustomText>
      </View>
      <LoadingModal text="loading" isVisible={isVisible} />

      {eventDetails && (
        <View style={{ flex: 1 }}>
          <View style={[styles.tabContainer, dynamicStyles.tabContainer]}>
            {tabs.map((tab) => {
              return (
                <TouchableOpacity
                  style={[styles.tab, selectedTab === tab.index && dynamicStyles.selectedTab]}
                  key={tab.index}
                  onPress={() => handlePageChange(tab.index)}
                >
                  <CustomText weight="bold" style={[styles.tabText, dynamicStyles.tabText]}>
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
            onPageSelected={(e) => setSelectedTab(e.nativeEvent.position)}
          >
            <ScrollView
              key="1"
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />}
            >
              <Image
                style={[styles.image, dynamicStyles.image]}
                source={
                  eventDetails.image_path
                    ? { uri: `${getHostName()}${eventDetails.image_path}` }
                    : require('../../assets/images/example.jpeg')
                }
                resizeMode="cover"
              />
              {eventDetails && <DetailTab eventDetails={eventDetails} />}
            </ScrollView>
            <NotificationTab key="2" notificationList={notifications} onRefresh={() => onRefresh('notification')} />
            <ScrollView
              key="3"
              stickyHeaderIndices={[0]}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefresh('participants')} />}
            >
              {eParticipants && (
                <View>
                  <View style={styles.participantNumber}>
                    <Ionicons name="person" size={fontSizes.regular} color={theme.primaryBG} />
                    <CustomText>
                      {eParticipants.count} / {eventDetails.participants_limit}
                    </CustomText>
                  </View>
                </View>
              )}
              {eParticipants &&
                eParticipants.participants.map((p) => {
                  return (
                    <View style={[styles.participantBox, dynamicStyles.participantBox]} key={p.id}>
                      <CustomText weight="semiBold">
                        {p.first_name}
                        {p.last_name}
                      </CustomText>
                      {p.gender !== 'prefer not to say' && (
                        <Ionicons
                          name={p.gender === 'male' ? 'male-outline' : 'female-outline'}
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
                  color={theme.primaryBG}
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
