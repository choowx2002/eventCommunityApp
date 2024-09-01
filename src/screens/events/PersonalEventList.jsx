import { RefreshControl, View, StyleSheet, Pressable, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { format, parse } from 'date-fns';
//components
import CustomButton, { BackButton } from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import { LoadingModal, loadingHook } from '../../components/LoadingModal';
//others
import { useTheme } from '../../utils/themesUtil';
import { globalStyle } from '../../styles/globalStyles';
import fontSizes from '../../types/fontSize';
import { getFontFamily } from '../../types/customFonts';
import { getUserEvents } from '../../services/userApi.service';

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

const PersonalEventList = ({ navigation }) => {
  const route = useRoute();
  const { listType } = route.params;
  const { isVisible, showLoadingModal, hideLoadingModal } = loadingHook();
  const { theme } = useTheme();
  const [constantText, setConstantText] = useState(groups['active']);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const themeStyles = StyleSheet.create({
    page: {
      backgroundColor: theme.background,
    },
    eventItem: {
      backgroundColor: theme.cardBackground,
    },
  });

  //error toast
  const showErrorToast = (message, goBack = fasle) => {
    if (goBack) navigation.goBack();
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  // set the type of list page
  // if no type or wrong declare will show toast and route back
  useEffect(() => {
    showLoadingModal();
    if (!groups[listType]) return showErrorToast('Please Try Again Later(ง •_•)ง', true);
    setConstantText(groups[listType]);
    _fetchEventDetails(listType == 'manage' ? 'own' : listType);
  }, [listType]);

  const _fetchEventDetails = (eventType) => {
    getUserEvents({ userId: 51, eventType }) //testing purpose
      .then((res) => {
        if (!res) return showErrorToast('Please Try Again Later(ง •_•)ง', true);
        setEvents(res?.data?.userEvents);
      })
      .catch((err) => {
        console.log('error', err);
        return showErrorToast('Please Try Again Later(ง •_•)ง', true);
      })
      .finally(() => {
        if (refreshing) setRefreshing(false);
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
        if (id === null) return ToastAndroid.show('Please Try Again', ToastAndroid.SHORT);
        console.log(action, id);
        navigation.navigate(listType === 'manage' ? 'manageEvent' : 'eDetails', {
          eventId: id,
        });
        break;
      case 'list':
        navigation.navigate(listType === 'manage' ? 'create' : 'Events');
        break;
      default:
        break;
    }
  };

  //refresh the manage list
  const onRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      _fetchEventDetails(listType == 'manage' ? 'own' : listType);
    }
  };

  //used for render items
  const EventItem = ({ event }) => {
    return (
      <Pressable style={[styles.eventItem, themeStyles.eventItem]} onPress={() => routeTo('detail', event.id)}>
        {/* title */}
        <CustomText style={[styles.eventTitle, getFontFamily('bold')]} numberOfLines={1}>
          {event.title}
        </CustomText>

        {/* show event's date */}
        <View style={styles.eventMeta}>
          <Ionicons name={'calendar-outline'} color={theme.text} size={fontSizes.regular} />
          <CustomText>
            {format(event.start_date, 'yyyy-MM-dd')} - {format(event.end_date, 'yyyy-MM-dd')}
          </CustomText>
        </View>

        {/* show event's time */}
        <View style={styles.eventMeta}>
          <Ionicons name={'time-outline'} color={theme.text} size={fontSizes.regular} />
          <CustomText>
            {format(parse(event.start_time, 'HH:mm:ss', new Date()), 'hh:mm a')} -{' '}
            {format(parse(event.end_time, 'HH:mm:ss', new Date()), 'hh:mm a')}
          </CustomText>
        </View>

        <View style={styles.eventInfo}>
          {/* show event's location state/city */}
          <View style={[styles.eventMeta, { width: '75%' }]}>
            <Ionicons name={'location-outline'} color={theme.text} size={fontSizes.regular} />
            <CustomText numberOfLines={2}>
              {event.address}, {event.postcode}, {event.city}, {event.state}
            </CustomText>
          </View>

          {/* show event's participants */}
          <View style={[styles.eventMeta, styles.eventParticipants]}>
            <Ionicons name={'person-outline'} color={theme.text} size={fontSizes.regular} />
            <CustomText>
              {event.participants}/{event.participants_limit}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.page, themeStyles.page]}>
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
            renderItem={({ item }) => <EventItem event={item} />}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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

const styles = StyleSheet.create({
  page: {
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
    alignItems: 'flex-end',
  },
});

export default PersonalEventList;
