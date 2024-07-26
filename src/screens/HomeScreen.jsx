import React from 'react';
import {View, Dimensions, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../utils/ThemesChecker';
import Carousel from 'react-native-snap-carousel';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';

const {width: viewportWidth} = Dimensions.get('window');// used to get the vw of window 

const HomeScreen = ({navigation}) => {
  const {theme} = useTheme();

  const events = [
    {
      id: '1',
      title: 'Music Therapy Workshop',
      participants: '50/100',
      dateTime: '2024-08-15 10:00 AM',
      location: 'Community Center',
      imageUrl: 'https://picsum.photos/500/250',
    },
    {
      id: '2',
      title: 'Group Session',
      participants: '20/30',
      dateTime: '2024-08-20 02:00 PM',
      location: 'Library Hall',
      imageUrl: 'https://picsum.photos/600/250',
    },
    {
      id: '3',
      title: 'One-on-One Therapy',
      participants: '1/1',
      dateTime: '2024-08-25 11:00 AM',
      location: 'Therapy Room 3',
      imageUrl: 'https://picsum.photos/500/240',
    },
  ];

  //navigate to event detail page with id
  const navigateToEventsDetails = id => {
    navigation.navigate('eDetails', {eventId: id});
  };

  //the child template in carousel components
  const swiperChild = ({item, index}) => (
    <TouchableOpacity
      onPress={()=>navigateToEventsDetails(item.id)}
      style={{
        backgroundColor: theme.cardBackground,
        borderRadius: 5,
        height: (viewportWidth - 20) / 2 + 65,
        marginLeft: 5,
        marginTop: 10,
        marginRight: 5,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 10,
      }}>
      <Image
        style={{
          width: '100%',
          height: (viewportWidth - 20) / 2,
        }}
        source={{
          uri: item.imageUrl,
        }}
      />
      <View style={{paddingHorizontal: 10, paddingVertical: 5, rowGap: 5}}>
        <CustomText style={{fontSize: fontSizes.large}}>
          {item.title}
        </CustomText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <CustomText weight={'light'} style={{fontSize: fontSizes.regular}}>
            {item.dateTime}
          </CustomText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 2,
            }}>
            <Ionicons
              name={'person'}
              color={theme.text}
              size={fontSizes.regular}
            />
            <CustomText weight={'light'} style={{fontSize: fontSizes.regular}}>
              {item.participants}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.pageContainer, {backgroundColor: theme.background}]}>

      {/* banner for upcoming events */}
      <View style={styles.swiperHeadar}>
        <CustomText weight="bold" style={{fontSize: fontSizes.header}}>
          Upcoming Events
        </CustomText>
        <CustomText
          weight="light"
          onPress={() => navigation.navigate('Events')}>
          View All
        </CustomText>
      </View>

      <Carousel
        loop={true}
        data={events}
        renderItem={swiperChild}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth - 20}
        autoplay={true}
        autoplayDelay={10000}
      />
      {/* banner for upcoming events (ends) */}

    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
  },
  swiperHeadar: {
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HomeScreen;
