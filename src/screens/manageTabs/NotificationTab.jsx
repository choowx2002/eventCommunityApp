import {StyleSheet, View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {formatDistance, parseISO} from 'date-fns';
import CustomText from '../../components/CustomText';
import {useTheme} from '../../utils/themesChecker';
import fontSizes from '../../types/fontSize';
import {globalStyle} from '../../styles/globalStyles';

const NotificationTab = ({notificationList}) => {
  const {theme} = useTheme();

  const dynamicStyles = StyleSheet.create({
    noticeBox: {
      backgroundColor: theme.cardBackground,
    },
  });

  const _renderItem = ({item}) => (
    <View style={[dynamicStyles.noticeBox, styles.noticeBox]}>
      <CustomText weight="bold" numberOfLines={1} style={styles.noticeTitle}>
        {item.title}
      </CustomText>
      <CustomText numberOfLines={2}>{item.message}</CustomText>
      <CustomText style={styles.time}>
        {formatDistance(parseISO(item.created_date), new Date())} ago
      </CustomText>
    </View>
  );

  return (
    <View>
      {notificationList.length > 0 ? (
        <FlatList
          data={notificationList}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <CustomText style={globalStyle.centerText}>
          No Notification Yet.
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  }
});

export default NotificationTab;
