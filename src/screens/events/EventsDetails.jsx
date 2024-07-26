import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  hideTabBarAndHeader,
  showTabBarAndHeader,
} from '../../utils/NavigationUtils';
import {useRoute} from '@react-navigation/native';

const EventsDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    hideTabBarAndHeader(navigation);// as name hide the tab header and bar
    return () => {
      showTabBarAndHeader(navigation);// show back when going out
    };
  }, [navigation]);

  useEffect(() => {
    const { eventId: routeId } = route.params || {}; // Get eventId from route parameters
    if (routeId) setEventId(routeId); // Set eventId if it exists
  }, [route.params]);

  return (
    <View>
      <Text>Event Screen</Text>
      <Text>Event ID: {eventId}</Text>
    </View>
  );
};

export default EventsDetails;
