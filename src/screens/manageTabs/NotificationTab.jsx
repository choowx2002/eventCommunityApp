import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { formatDistance, parseISO } from 'date-fns';
import CustomText from '../../components/CustomText';
import { useTheme } from '../../utils/themesUtil';
import fontSizes from '../../types/fontSize';
import { globalStyle } from '../../styles/globalStyles';

const NotificationTab = ({ notificationList, onRefresh }) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const dynamicStyles = StyleSheet.create({
    noticeBox: {
      backgroundColor: theme.background,
    },
  });

  useEffect(() => {
    if (refreshing) setRefreshing(false);
  }, [notificationList]);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    onRefresh();
  };

  const _renderItem = ({ item }) => (
    <View style={[dynamicStyles.noticeBox, styles.noticeBox]} key={item.id.toString()}>
      <CustomText weight="bold" numberOfLines={1} style={[styles.noticeTitle, {color: theme.tertiaryText}]}>
        {item.title}
      </CustomText>
      <CustomText numberOfLines={2} style={{color: theme.tertiaryText}}>{item.message}</CustomText>
      <CustomText style={[styles.time, {color: theme.tertiaryText}]}>{formatDistance(parseISO(item.created_at), new Date())} ago</CustomText>
    </View>
  );

  return (
    <ScrollView style={styles.page} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      {notificationList.length > 0 ? (
        notificationList.map((item) => {
          return _renderItem({ item });
        })
      ) : (
        <CustomText style={[globalStyle.centerText, , {color: theme.tertiaryText}]}>No Notification Yet.</CustomText>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page:{
    height:"90%",
  },
  noticeBox: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  noticeTitle: {
    fontSize: fontSizes.medium,
    marginBottom: 10,
  },
  time: {
    marginTop: 5,
    textAlign: 'right',
    fontSize: fontSizes.small,
  },
});

export default NotificationTab;
