import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../utils/themesUtil';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';

const notifications = [
  {
    id: '1',
    title: 'Placeholder 1',
    dateTime: '2024-08-24 10:00 AM',
    message: 'This is a placeholder message 1.',
  },
  {
    id: '2',
    title: 'Placeholder 2',
    dateTime: '2024-08-24 05:00 PM',
    message: 'This is a placeholder message 2.',
  },
  {
    id: '3',
    title: 'Placeholder 3',
    dateTime: '2024-08-25 11:00 AM',
    message: 'This is a placeholder message 3.',
  },
  {
    id: '4',
    title: 'Placeholder 4',
    dateTime: '2024-08-26 09:00 AM',
    message: 'This is a placeholder message 4.',
  },
  {
    id: '5',
    title: 'Placeholder 5',
    dateTime: '2024-08-27 02:00 PM',
    message: 'This is a placeholder message 5.',
  },
  {
    id: '6',
    title: 'Placeholder 6',
    dateTime: '2024-08-27 02:00 PM',
    message: 'This is a placeholder message 6.',
  },
  {
    id: '7',
    title: 'Placeholder 7',
    dateTime: '2024-08-27 02:00 PM',
    message: 'This is a placeholder message 7.',
  },
];

const NotificationScreen = () => {
  const { theme } = useTheme();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.item, { backgroundColor: theme.themedBackground }]}>
      <View style={styles.textContainer}>
        <CustomText weight='bold' style={[{fontSize: fontSizes.header}, { color: theme.primaryText }]}>{item.title}</CustomText>
        <CustomText weight='regular' style={[{ color: theme.primaryText }]}>{item.dateTime}</CustomText>
        <CustomText weight='light' style={[{ color: theme.primaryText }]}>{item.message}</CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
  }
});

export default NotificationScreen;