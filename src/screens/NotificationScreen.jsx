import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '../utils/themesUtil';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';
import { getNotificationByUserId } from '../services/notificationApi.service';
import { getEventById } from '../services/eventApi.service';
import { formatDistance, parseISO } from 'date-fns';

const NotificationScreen = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const userId = '43'; //testing purpose
      const response = await getNotificationByUserId(userId);
      let notifications = response.data.notifications || [];

      // Sort notifications by created_at date (most recent first)
      notifications = notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const notificationsWithEvents = await Promise.all(
        notifications.map(async notification => {
          const eventResponse = await getEventById(notification.event_id);
          const eventTitle = eventResponse.data?.event?.title || 'Unknown Event';
          return { ...notification, eventTitle };
        })
      );

      setNotifications(notificationsWithEvents);
    } catch (err) {
      setError('Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: theme.cardBackground }]}>
      <View style={styles.textContainer}>
        <CustomText weight='bold' style={[{ fontSize: fontSizes.header }, { color: theme.text }]}>{item.title}</CustomText>
        <CustomText weight='regular' style={[{ color: theme.text }]}>{`From ${item.eventTitle}`}</CustomText>
        <CustomText weight='light' style={[{ color: theme.text }]}>{item.message}</CustomText>
        <CustomText style={styles.time}>
          {formatDistance(parseISO(item.created_at), new Date())} ago
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <CustomText weight='bold' style={[{ fontSize: fontSizes.header }, { color: theme.text }]}>{error}</CustomText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.text]} // Customize the refresh control color
            tintColor={theme.text} // Customize the spinner color
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  textContainer: {
    justifyContent: 'center',
  },
  time: {
    marginTop: 5,
    textAlign: 'right',
    fontSize: fontSizes.small,
  }
});

export default NotificationScreen;
