import React, { useEffect, useState } from 'react';
import { View, LogBox, Image, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format, parse } from 'date-fns';
// components
import CustomText from '../../components/CustomText';
import CustomButton, { BackButton, NaviagteMapButton } from '../../components/CustomButton';
import CustomModel from '../../components/AlertModal';
import { LoadingModal, loadingHook } from '../../components/LoadingModal';
//others
import { checkEventById, insertEvent, removeEvents } from '../../services/sqliteServices';
import { subscribe_notification, unsubscribe_notification } from '../../services/socket';
import {
  checkLatestById,
  getEventById,
  getParticipantsById,
  joinEventById,
  leaveEventById,
} from '../../services/eventApi.service';
import { getHostName } from '../../services/api';
import { useTheme } from '../../utils/themesUtil';
import fontSizes from '../../types/fontSize';
import { themeStyles } from '../../styles/globalStyles';
import { getData } from '../../utils/storageHelperUtil';

const EventsDetails = ({ navigation }) => {
  const route = useRoute();
  const { theme } = useTheme(); //theme color
  const { isVisible, showLoadingModal, hideLoadingModal } = loadingHook(); //get loading modal hook
  const [eventDetails, setEventDetails] = useState(null); //store event details from api
  const [isSticky, setIsSticky] = useState(false); // set style
  const [containerY, setContainerY] = useState(null); // get position for styling purpose
  const [alertState, setAlertState] = useState(false); //for alert modal shown
  const [isJoin, setIsJoin] = useState(false);
  const [participants, setParticipants] = useState({});
  const [UID, setUserID] = useState(null);
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']); //ignore warning

  //Layout Functions
  //get detail layout Y
  const savePosition = (event) => {
    setContainerY(event.nativeEvent.layout.y);
  };

  // calculate the offset is it meet the detail Y which means stick to header or not
  // if meet then add the padding for route back
  const handleScroll = (event) => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    setIsSticky(scrollOffsetY > containerY - 20);
  };

  //error toast
  const showErrorToast = (message, goBack = fasle) => {
    if (goBack) navigation.goBack();
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  //init
  useEffect(() => {
    showLoadingModal();
    const { eventId } = route.params || {}; // Get eventId from route parameters
    if (eventId) {
      let uid = '';
      getData('userData').then((res) => {
        if (!res) return;
        setUserID(res.id);
        uid = res.id;
      });
      getParticipants(eventId);
      checkEventById(eventId) //check event is that exists in local sqlite
        .then(({ isJoined, event }) => {
          setIsJoin(isJoined);
          checkLatestUpdate(eventId, event.updated_at, event); // check update from db
        })
        .catch((err) => {
          if (err?.isJoined === 'false') {
            // if not exists then we fetch from db
            fetchEventDetails(eventId, uid);
          }
        })
        .finally(() => {
          hideLoadingModal();
        });
    }
  }, [route.params]);

  //check event latest info
  const checkLatestUpdate = (event_id, updated_at, event) => {
    const param = {
      updated_at: updated_at,
    };
    checkLatestById(event_id, param)
      .then((res) => {
        // if is latest then use cache event if not then use return back result
        // latest is true will only not bring back event to reduce cost
        if (!res) {
          showErrorToast('Please Try Again Later(ง •_•)ง', true);
        }
        if (!res?.data?.isLatest) {
          setEventDetails(res.data.event);
          insertEventCache(res.data.event);
        } else {
          setEventDetails(event);
        }
      })
      .catch((error) => console.log(error));
  };

  //get event by id from server db
  const fetchEventDetails = async (eventId, uid) => {
    getEventById(eventId, { user_id: uid })
      .then((res) => {
        if (res?.data?.event) {
          setEventDetails(res.data.event);
          if (res.data?.isJoined) {
            // check is user exists or not
            insertEventCache(res.data.event);
            setIsJoin(res.data?.isJoined);
          }
        } else {
          showErrorToast('Please Try Again Later(ง •_•)ง', true);
        }
      })
      .catch((error) => {
        console.log(error);
        showErrorToast('Please Try Again Later(ง •_•)ง', true);
      });
  };

  const getParticipants = (eid) => {
    getParticipantsById(eid)
      .then((res) => {
        if (res) return setParticipants(res.data);
      })
      .catch((error) => console.log(error));
  };

  //join event, send api to db
  const joinEvent = async () => {
    if (!eventDetails.id) return showErrorToast('Please Try Again Later(ง •_•)ง', false);
    joinEventById({
      user_id: UID,
      event_id: eventDetails.id,
    }).then((res) => {
      if (!res) return showErrorToast('Please Try Again Later(ง •_•)ง', false);
      if (res.status === 'success') {
        insertEventCache(eventDetails);
      } else {
        if (res?.data?.message) {
          showErrorToast(res.data.message, false);
          setAlertState(false);
        }
      }
    });
  };

  //add event details to joined_events table
  const insertEventCache = async (e) => {
    const event = {
      id: e.id,
      title: e.title,
      desc: e.description,
      start_time: e.start_time,
      end_time: e.end_time,
      start_date: e.start_date,
      end_date: e.end_date,
      image_path: e.image_path,
      admin_id: e.admin_id,
      participants_limit: e.participants_limit,
      address: e.address,
      postcode: e.postcode,
      state: e.state,
      city: e.city,
      category_id: e.category_id,
      created_at: e.created_at,
      updated_at: e.updated_at,
      deleted_at: null,
    };
    const isInsert = await insertEvent(event);
    if (isInsert) {
      const result = await subscribe_notification(e.id.toString());
      if (alertState && result.success) {
        setAlertState(false);
        setIsJoin(true);
        getParticipants(e.id);
      }
      console.log('Event was successfully inserted.');
    } else {
      console.log('Failed to insert the event.');
    }
  };

  //remove events form joined_events table
  const removeEvent = async () => {
    const params = {
      user_id: UID,
      event_id: eventDetails.id,
    };
    leaveEventById(params).then((res) => {
      if (!res) return showErrorToast('Please Try Again Later(ง •_•)ง', false);
      if (res.status === 'success') {
        removeEvents(eventDetails.id).then((removed) => {
          if (removed) {
            unsubscribe_notification(eventDetails.id.toString());
            setAlertState(false);
            setIsJoin(false);
            getParticipants(eventDetails.id);
          }
        });
      } else {
        return showErrorToast('Please Try Again Later(ง •_•)ง', false);
      }
    });
  };

  //function to hide alert
  const backfunction = () => {
    console.log('refresh home page');
    if (route.params.refresh) route.params.refresh();
    navigation.pop();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LoadingModal text="loading" isVisible={isVisible} />
      {eventDetails && (
        <View style={{ flex: 1 }}>
          <ScrollView stickyHeaderIndices={[1]} contentContainerStyle={{ paddingBottom: 80 }} onScroll={handleScroll}>
            {/* event banner image */}
            <Image
              style={[styles.image, { backgroundColor: theme.themedBackground }]}
              source={
                eventDetails.image_path
                  ? { uri: `${getHostName()}${eventDetails.image_path}` }
                  : require('../../assets/images/example.jpeg')
              }
              resizeMode="cover"
            />
            <View
              onLayout={savePosition}
              style={[
                styles.detailContainer,
                {
                  backgroundColor: theme.background,
                  paddingTop: isSticky ? 50 : 0,
                },
              ]}
            >
              {/* event's title */}
              <CustomText weight="bold" style={[styles.title, { color: theme.tertiaryText }]} numberOfLines={1}>
                {eventDetails.title}
              </CustomText>

              {/* event date */}
              <View style={styles.info}>
                <Ionicons name={'calendar'} color={theme.primaryBG} size={fontSizes.xlarge} />
                <CustomText style={{ color: theme.tertiaryText }}>
                  {format(eventDetails.start_date, 'yyyy-MM-dd')} - {format(eventDetails.end_date, 'yyyy-MM-dd')}
                </CustomText>
              </View>

              {/* event time */}
              <View style={styles.info}>
                <Ionicons name={'time'} color={theme.primaryBG} size={fontSizes.xlarge} />
                <CustomText style={{ color: theme.tertiaryText }}>
                  {format(parse(eventDetails.start_time, 'HH:mm:ss', new Date()), 'hh:mm a')} -{' '}
                  {format(parse(eventDetails.end_time, 'HH:mm:ss', new Date()), 'hh:mm a')}
                </CustomText>
              </View>

              {/* event location */}
              <View style={styles.info}>
                <Ionicons name={'location'} color={theme.primaryBG} size={fontSizes.xlarge} />
                <CustomText style={[{ lineHeight: 20 }, { color: theme.tertiaryText }]}>
                  {eventDetails.address}, {eventDetails.postcode}, {eventDetails.city}, {eventDetails.state}
                </CustomText>
              </View>

              {/* event participants */}
              <View style={styles.info}>
                <Ionicons name={'person'} color={theme.primaryBG} size={fontSizes.xlarge} />
                <CustomText style={{ color: theme.tertiaryText }}>
                  {participants.count} / {eventDetails.participants_limit}
                </CustomText>
              </View>
              <CustomText style={[styles.title, { color: theme.tertiaryText }]}>Description</CustomText>
            </View>
            <View style={[styles.detailContainer]}>
              {/* event description scroll view */}
              <CustomText style={[{ lineHeight: 24 }, { color: theme.tertiaryText }]}>
                {eventDetails.description}
              </CustomText>
            </View>
          </ScrollView>

          {/* button for join */}
          <CustomButton
            style={styles.button}
            theme={isJoin ? 'danger' : 'primary'}
            onPress={() => {
              if (!UID) return showErrorToast('Please Login First! (*/ω＼*)', false);
              setAlertState(true);
            }}
          >
            {isJoin ? 'LEAVE' : 'JOIN'}
          </CustomButton>

          {/* back button */}
          <BackButton navigation={navigation} showBg={false} onPressFc={backfunction} />

          {/* map button */}
          <NaviagteMapButton navigation={navigation} showBg={false} data={eventDetails} />

          {/* promp when click join/leave */}
          <CustomModel
            title={
              isJoin ? `Are you sure to leave ${eventDetails.title}` : `Are you sure to join ${eventDetails.title}?`
            }
            themeColor={isJoin ? 'danger' : 'bw'}
            isVisible={alertState}
            onClose={() => setAlertState(false)}
            onConfirm={isJoin ? removeEvent : joinEvent}
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
