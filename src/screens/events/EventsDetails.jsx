import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';

const EventsDetails = () => {
  const route = useRoute();
  const [eventId, setEventId] = useState(null);

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
