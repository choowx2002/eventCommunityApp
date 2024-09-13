import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useTheme } from '../utils/themesUtil';
import CustomText from '../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fontSizes from '../types/fontSize';
import { getNotificationByUserId } from '../services/notificationApi.service';
import { getEventById } from '../services/eventApi.service';
import { formatDistance, parseISO } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CustomModal from '../components/AlertModal';
import { getData } from '../utils/storageHelperUtil';

const NotificationScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [clearTime, setClearTime] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const CLEAR_TIME_KEY = 'notification_clear_time';

  // Retrieve clear time on app start
  useEffect(() => {
    const loadClearTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem(CLEAR_TIME_KEY);
        if (storedTime) {
          setClearTime(new Date(storedTime));
        }
      } catch (error) {
        console.error('Error retrieving clear time', error);
      }
    };

    loadClearTime();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const user = await getData("userData");
      const response = await getNotificationByUserId(user.id);
      let notifications = response.data.notifications || [];

      // Sort notifications by created_at date (most recent first)
      notifications = notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const notificationsWithEvents = await Promise.all(
        notifications.map(async (notification) => {
          if (!notification.eventTitle) {
            const eventResponse = await getEventById(notification.event_id);
            const eventTitle = eventResponse.data?.event?.title || 'Unknown Event';
            return { ...notification, eventTitle };
          }
          return notification;
        })
      );

      // Filter notifications based on clearTime stored in memory
      if (clearTime) {
        const filteredNotifications = notificationsWithEvents.filter(
          (notification) => new Date(notification.created_at) > clearTime
        );
        setNotifications(filteredNotifications);
      } else {
        setNotifications(notificationsWithEvents);
      }
    } catch (err) {
      setError('Failed to load notifications');
    }
  };

  // Clear notifications and update clearTime
  const clearNotifications = async () => {
    const currentTime = new Date();
    setClearTime(currentTime);
    await AsyncStorage.setItem(CLEAR_TIME_KEY, currentTime.toISOString());
    setNotifications([]);
    setModalVisible(false);
  };

  const confirmClearNotifications = () => {
    setModalVisible(true);
  };

  // Refetch notifications when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [clearTime])
  );

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  // Navigate to NotificationDetails screen with the notification details
  const openNotificationDetails = (notification) => {
    navigation.navigate('notificationDetails', { notification });
  };

  // Render notification item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: theme.background }]}
      onPress={() => openNotificationDetails(item)}
    >
      <View style={styles.textContainer}>
        <CustomText weight="bold" style={[{ fontSize: fontSizes.header }, { color: theme.secondaryText }]}>
          {item.title}
        </CustomText>
        <CustomText weight="regular" style={[{ color: theme.tertiaryText }]}>{`From ${item.eventTitle}`}</CustomText>
        {/* Limit message to one line and truncate with "..." */}
        <CustomText
          weight="light"
          style={[{ color: theme.tertiaryText }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.message}
        </CustomText>
        <CustomText style={styles.time}>
          {formatDistance(parseISO(item.created_at), new Date())} ago
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
        <CustomText style={[styles.headerTitle, {color: theme.primaryBG}]} weight="bold">
          Notifications ({notifications.length})
        </CustomText>
        <Ionicons
          name="trash-outline"
          color={theme.primaryBG}
          size={26}
          onPress={confirmClearNotifications}
        />
      </View>

      <CustomModal
        title="Confirm Clear"
        message="Are you sure you want to clear all notifications?"
        isVisible={isModalVisible}
        onConfirm={clearNotifications}
        onClose={() => setModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
      />

      {error ? (
        <View style={styles.errorContainer}>
          <CustomText weight="bold" style={[{ fontSize: fontSizes.header }, { color: theme.tertiaryText }]}>
            {error}
          </CustomText>
        </View>
      ) : (
        <FlatList
          style={{ padding: 10 }}
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primaryBG]}
              tintColor={theme.primaryBG}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerTitle: {
    fontSize: fontSizes.header,
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
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default NotificationScreen;