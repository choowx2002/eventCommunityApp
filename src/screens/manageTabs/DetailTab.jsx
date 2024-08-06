import {View, StyleSheet} from 'react-native';
import React from 'react';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatDate, formatTime } from '../../utils/dateTimeFormatter';
import fontSizes from '../../types/fontSize';
import { useTheme } from '../../utils/themesChecker';

const DetailTab = ({eventDetails, participants}) => {
  const {theme} = useTheme()
  return (
    <View>
      {/* event's title */}
      <CustomText weight="bold" style={styles.title} numberOfLines={1}>
        {eventDetails.title}
      </CustomText>

      {/* event date */}
      <View style={styles.info}>
        <Ionicons
          name={'calendar'}
          color={theme.text}
          size={fontSizes.xlarge}
        />
        <CustomText>
          {formatDate(eventDetails.startdate)} -{' '}
          {formatDate(eventDetails.endDate)}
        </CustomText>
      </View>

      {/* event time */}
      <View style={styles.info}>
        <Ionicons name={'time'} color={theme.text} size={fontSizes.xlarge} />
        <CustomText>
          {formatTime(eventDetails.starttime)} -{' '}
          {formatTime(eventDetails.endtime)}
        </CustomText>
      </View>

      {/* event location */}
      <View style={styles.info}>
        <Ionicons
          name={'location'}
          color={theme.text}
          size={fontSizes.xlarge}
        />
        <CustomText style={{lineHeight: 20}}>
          {eventDetails.address}, {eventDetails.postcode}, {eventDetails.city},{' '}
          {eventDetails.state}
        </CustomText>
      </View>

      {/* event participants */}
      <View style={styles.info}>
        <Ionicons name={'person'} color={theme.text} size={fontSizes.xlarge} />
        <CustomText>
          {participants.length} / {eventDetails.participantsLimit}
        </CustomText>
      </View>
      <CustomText style={styles.title}>Description</CustomText>

      <View style={styles.detailContainer}>
        {/* event description scroll view */}
        <CustomText style={{lineHeight: 24}}>
          {eventDetails.longDescription}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: fontSizes.header,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  descTitle: {
    fontSize: fontSizes.header,
    marginHorizontal: 10,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginBottom: 5,
    marginHorizontal: 10,
  },
})

export default DetailTab;
