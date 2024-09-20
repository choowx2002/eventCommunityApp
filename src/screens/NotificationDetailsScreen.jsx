import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../utils/themesUtil';
import CustomText from '../components/CustomText';
import { addHours } from 'date-fns';

const NotificationDetailsScreen = ({ route }) => {
  const { theme } = useTheme();
  const { notification } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <CustomText weight="bold" style={[styles.title, { color: theme.primaryBG }]}>
          {notification.title}
        </CustomText>
        <CustomText weight='semiBold' style={[styles.eventTitle, { color: theme.tertiaryText }]}>
          From: {notification.eventTitle}
        </CustomText>
        <CustomText weight='light' style={[styles.message, { color: theme.tertiaryText }]}>
          {notification.message}
        </CustomText>
        <CustomText weight='regular' style={[styles.time, { color: theme.tertiaryText }]}>
          Created: {addHours(new Date(notification.created_at), 8).toLocaleString()}
        </CustomText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationDetailsScreen;
