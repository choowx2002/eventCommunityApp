import React from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../utils/themesChecker';
import Carousel from 'react-native-snap-carousel';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';
import Geolocation from '@react-native-community/geolocation';

const {width: viewportWidth} = Dimensions.get('window'); // used to get the vw of window

// Geolocation.setRNConfiguration(config);
Geolocation.getCurrentPosition(info => console.log(info));

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

  const userInterest = [
    {name: 'Badminton', id: '1'},
    {name: 'Music', id: '2'},
    {name: 'Marathon', id: '3'},
    {name: 'E-sport', id: '4'},
  ];

  const interestEvent = [
    {
      category_id: 1,
      category_name: 'Category 1',
      events: [
        {id: 1, title: 'Event 1', imageUrl: 'https://picsum.photos/600/300'},
        {id: 2, title: 'Event 2', imageUrl: 'https://picsum.photos/600/300'},
      ],
    },
    {
      category_id: 2,
      category_name: 'Category 2',
      events: [
        {id: 3, title: 'Event 3', imageUrl: 'https://picsum.photos/600/300'},
        {id: 4, title: 'Event 4', imageUrl: ''},
      ],
    },
    {
      category_id: 3,
      category_name: 'Category 3',
      events: [
        {id: 5, title: 'Event 5', imageUrl: 'https://picsum.photos/600/300'},
      ],
    },
  ];

  //navigate to event detail page with id
  const navigateToEventsDetails = id => {
    navigation.navigate('eDetails', {eventId: id});
  };

  //the child template in carousel components for upcoming banner
  const _bannerChild = ({item, index}) => (
    <TouchableOpacity
      onPress={() => navigateToEventsDetails(item.id)}
      style={{
        backgroundColor: theme.cardBackground,
        borderRadius: 5,
        height: (viewportWidth - 20) / 2 + 65,
        marginHorizontal: 5,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 10,
      }}>
      <Image
        style={{
          width: '100%',
          height: (viewportWidth - 10) / 2,
        }}
        source={
          item.imageUrl
            ? {uri: item.imageUrl}
            : require('../assets/images/example.jpeg')
        }
      />
      <View style={{paddingHorizontal: 10, paddingVertical: 5, rowGap: 5}}>
        <CustomText style={{fontSize: fontSizes.large}} numberOfLines={1}>
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

  //the child template in carousel components for normal slider
  const _slideChild = ({item, index}) => (
    <TouchableOpacity
      onPress={() => navigateToEventsDetails(item.id)}
      style={{
        backgroundColor: theme.cardBackground,
        borderRadius: 5,
        height: (viewportWidth * 0.75) / 2 + 35,
        marginHorizontal: 5,
        marginTop: 10,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 1,
      }}>
      <Image
        style={{
          width: '100%',
          height: (viewportWidth * 0.75) / 2,
        }}
        source={
          item.imageUrl
            ? {uri: item.imageUrl}
            : require('../assets/images/example.jpeg')
        }
      />
      <View style={{paddingHorizontal: 10, paddingVertical: 5}}>
        <CustomText style={{fontSize: fontSizes.large}} numberOfLines={1}>
          {item.title}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.pageContainer, {backgroundColor: theme.background}]}>
      {/* banner for upcoming events */}
      <View style={styles.moduleContainer}>
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
          renderItem={_bannerChild}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth - 10}
          autoplay={true}
          autoplayDelay={10000}
        />
      </View>

      {/* events nearby user (need to check permission>location) */}
      <View style={styles.moduleContainer}>
        <View style={styles.swiperHeadar}>
          <CustomText weight="bold" style={{fontSize: fontSizes.header}}>
            Nearby Events
          </CustomText>
          <CustomText
            weight="light"
            onPress={() => navigation.navigate('Events')}>
            View All
          </CustomText>
        </View>
        <Carousel
          data={events}
          renderItem={_slideChild}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth * 0.75}
          contentContainerCustomStyle={styles.carouselContainerLeft}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
        />
      </View>

      {/* categories slider */}
      {interestEvent.length > 0 &&
        interestEvent.map((item, key) => {
          return (
            <View style={styles.moduleContainer} key={key}>
              <View style={styles.swiperHeadar}>
                <CustomText weight="bold" style={{fontSize: fontSizes.header}}>
                  {item.category_name}
                </CustomText>
                <CustomText
                  weight="light"
                  onPress={() =>
                    navigation.navigate('Events', {
                      category: {id: category_id, name: category_name},
                    })
                  }>
                  View All
                </CustomText>
              </View>
              <Carousel
                data={item.events}
                renderItem={_slideChild}
                sliderWidth={viewportWidth}
                itemWidth={viewportWidth * 0.75}
                contentContainerCustomStyle={styles.carouselContainerLeft}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
              />
            </View>
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    height: '100%',
  },
  moduleContainer: {
    paddingBottom: 20,
  },
  swiperHeadar: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carouselContainerLeft: {
    paddingLeft: 10,
  },
});

export default HomeScreen;
