import {View, StyleSheet} from 'react-native';
import React from 'react';
import CustomText from '../../components/CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {format, parse} from 'date-fns';
import fontSizes from '../../types/fontSize';
import {useTheme} from '../../utils/themesUtil';

const DetailTab = ({eventDetails}) => {
  const {theme} = useTheme();
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
          {format(eventDetails.start_date, 'yyyy-MM-dd')} -{' '}
          {format(eventDetails.end_date, 'yyyy-MM-dd')}
        </CustomText>
      </View>

      {/* event time */}
      <View style={styles.info}>
        <Ionicons name={'time'} color={theme.text} size={fontSizes.xlarge} />
        <CustomText>
          {format(
            parse(eventDetails.start_time, 'HH:mm:ss', new Date()),
            'hh:mm a',
          )}{' '}
          -{' '}
          {format(
            parse(eventDetails.end_time, 'HH:mm:ss', new Date()),
            'hh:mm a',
          )}
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
        {eventDetails.address}, {eventDetails.postcode},{' '}
        {eventDetails.city}, {eventDetails.state}
        </CustomText>
      </View>

      {/* event participants */}
      <View style={styles.info}>
        <Ionicons name={'person'} color={theme.text} size={fontSizes.xlarge} />
        <CustomText>
        {eventDetails.participants} /{' '}
        {eventDetails.participants_limit}
        </CustomText>
      </View>
      <CustomText style={styles.title}>Description</CustomText>

      <View style={styles.detailContainer}>
        {/* event description scroll view */}
        <CustomText style={{lineHeight: 24}}>
          {eventDetails.description}
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
});

export default DetailTab;
