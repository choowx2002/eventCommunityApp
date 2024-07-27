import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {LoadingModal, loadingHook} from '../../components/LoadingModal';

const mockEventsData = [
  {
    ids: 1,
    title: 'Healing Through Music Workshop',
    desc: 'Join us for an interactive workshop exploring the healing power of music.',
    starttime: '2024-08-05T10:00:00Z',
    endtime: '2024-08-05T12:00:00Z',
    startdate: '2024-08-05',
    endDate: '2024-08-05',
    imagePath: '/images/events/music_workshop.jpg',
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
    starttime: '2024-08-10T14:00:00Z',
    endtime: '2024-08-10T15:30:00Z',
    startdate: '2024-08-10',
    endDate: '2024-08-10',
    imagePath: '/images/events/mindfulness_session.jpg',
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
    starttime: '2024-08-15T11:00:00Z',
    endtime: '2024-08-15T16:00:00Z',
    startdate: '2024-08-15',
    endDate: '2024-08-15',
    imagePath: '/images/events/family_day.jpg',
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
    starttime: '2024-08-20T18:00:00Z',
    endtime: '2024-08-20T20:00:00Z',
    startdate: '2024-08-20',
    endDate: '2024-08-20',
    imagePath: '/images/events/anxiety_relief.jpg',
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
    starttime: '2024-08-25T17:00:00Z',
    endtime: '2024-08-25T19:00:00Z',
    startdate: '2024-08-25',
    endDate: '2024-08-25',
    imagePath: '/images/events/rhythm_movement.jpg',
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
      console.log(event);
      if (event) resolve(event);
      else reject('no data');
    }, 10000); // Simulate network delay
  });
};

const EventsDetails = () => {
  const route = useRoute();
  const [eventDetails, setEventDetails] = useState(null);
  const {isVisible, showLoadingModal, hideLoadingModal} = loadingHook();

  useEffect(() => {
    showLoadingModal();
    const {eventId: routeId} = route.params || {}; // Get eventId from route parameters
    if (routeId) {
      fetchEventDetails(routeId)
        .then(event => {
          setEventDetails(event); // Set fetched event details
        })
        .catch(error => {
          console.error('Error fetching event details:', error);
        })
        .finally(() => hideLoadingModal());
    }
  }, [route.params]);

  return (
    <View>
      <LoadingModal text="loading" isVisible={isVisible} />
      {eventDetails && (
        <View>
          <Text>Event Screen</Text>
          <Text>Event ID: {eventDetails.ids}</Text>
        </View>
      )}
    </View>
  );
};

export default EventsDetails;
