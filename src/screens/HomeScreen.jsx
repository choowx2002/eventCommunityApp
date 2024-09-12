import React, { useState, useEffect, useCallback } from 'react';
import { View, Dimensions, TouchableOpacity, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../utils/themesUtil';
import Carousel from 'react-native-snap-carousel';
import CustomText from '../components/CustomText';
import fontSizes from '../types/fontSize';
import Geolocation from '@react-native-community/geolocation';
import { get, getHostName, getLocationAddress } from '../services/api';
import { format, parse } from 'date-fns';
import { getUserCategories } from '../services/userApi.service';
import { getEventByCatId, getEventByState, getEvents } from '../services/eventApi.service';

const { width: viewportWidth } = Dimensions.get('window'); // used to get the vw of window

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [upEvents, setUpEvents] = useState([]);
  const [nearEvents, setNearEvents] = useState([]);
  const [catsEvents, setCatsEvents] = useState([]);
  const [apiCallMax, setApiCallMax] = useState(2);
  const [apiCall, setApiCall] = useState(0);
  const [currentState, setCurrentState] = useState('');

  const _getEvents = () => {
    //get events
    getEvents()
      .then((res) => {
        if (res?.data.events.length > 0) setUpEvents(res.data.events);
      })
      .finally(() => setApiCall((prevCount) => prevCount + 1));
    
    //get nearby events
    Geolocation.requestAuthorization(() => {
      Geolocation.getCurrentPosition(
        async (info) => {
          try {
            const state = await getLocationAddress(info.coords.latitude, info.coords.longitude);
            if(state) {
              setApiCallMax((prevCount) => prevCount + 1);
              setCurrentState(state);
              const result = await getEventByState({ state: state, limit: 3 });
              if (result?.data?.events?.length > 0) setNearEvents(result.data.events);
            }
          } finally {
            setApiCall((prevCount) => prevCount + 1);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });

    //get categories events
    getUserCategories(51).then((res) => {
      //testing purpose id
      if (!res?.data?.categories) return;
      let interestEvents = [];
      let promises = [];
      const cat_ids = res.data.categories;
      for (const { id, name } of cat_ids) {
        promises.push(
          new Promise(async (resolve) => {
            const res = await getEventByCatId({
              category_id: id,
              limit: 3,
            });
            if (res?.data.events.length > 0) {
              interestEvents.push(res.data);
              resolve();
            } else resolve();
          })
        );
      }
      Promise.all(promises)
        .then(() => {
          setCatsEvents(interestEvents);
        })
        .finally(() => setApiCall((prevCount) => prevCount + 1));
    });
  };

  useEffect(() => {
    _getEvents();
  }, []);

  //navigate to event detail page with id
  const navigateToEventsDetails = (id) => {
    navigation.navigate('eDetails', { eventId: id, refresh: _getEvents });
  };

  //the child template in carousel components for upcoming banner
  const _bannerChild = ({ item, index }) => (
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
      }}
    >
      <Image
        style={{
          width: '100%',
          height: (viewportWidth - 10) / 2,
        }}
        source={
          item.image_path ? { uri: `${getHostName()}${item.image_path}` } : require('../assets/images/example.jpeg')
        }
      />
      <View style={{ paddingHorizontal: 10, paddingVertical: 5, rowGap: 5 }}>
        <CustomText style={{ fontSize: fontSizes.large }} numberOfLines={1}>
          {item.title}
        </CustomText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <CustomText weight={'light'} style={{ fontSize: fontSizes.regular }}>
            {format(item.start_date, 'yyyy-MM-dd')} {format(parse(item.start_time, 'HH:mm:ss', new Date()), 'hh:mm a')}
          </CustomText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 2,
            }}
          >
            <Ionicons name={'person'} color={theme.text} size={fontSizes.regular} />
            <CustomText weight={'light'} style={{ fontSize: fontSizes.regular }}>
              {item.participants}/{item.participants_limit}
            </CustomText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  //the child template in carousel components for normal slider
  const _slideChild = ({ item, index }) => (
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
      }}
    >
      <Image
        style={{
          width: '100%',
          height: (viewportWidth * 0.75) / 2,
        }}
        source={
          item.image_path ? { uri: `${getHostName()}${item.image_path}` } : require('../assets/images/example.jpeg')
        }
      />
      <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
        <CustomText style={{ fontSize: fontSizes.large }} numberOfLines={1}>
          {item.title}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(() => {
    if (!refreshing) {
      setRefreshing(true);
      _getEvents();
    }
    while (apiCall < apiCallMax) {
      return;
    }
    setApiCall(0);
    setRefreshing(false);
  }, [apiCall]);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      style={[styles.pageContainer, { backgroundColor: theme.background }]}
    >
      {/* banner for upcoming events */}
      <View style={styles.moduleContainer}>
        <View style={styles.swiperHeadar}>
          <CustomText weight="bold" style={{ fontSize: fontSizes.header }}>
            Upcoming Events
          </CustomText>
          <CustomText weight="light" onPress={() => navigation.navigate('Events', { type: 'all' })}>
            View All
          </CustomText>
        </View>
        <Carousel
          loop={true}
          data={upEvents}
          renderItem={_bannerChild}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth - 10}
          autoplay={true}
          autoplayDelay={10000}
        />
      </View>

      {/* events nearby user (need to check permission>location) */}
      {nearEvents?.length > 0 && (
        <View style={styles.moduleContainer}>
          <View style={styles.swiperHeadar}>
            <CustomText weight="bold" style={{ fontSize: fontSizes.header }}>
              Nearby Events
            </CustomText>
            <CustomText
              weight="light"
              //routing for eventsScreen
              onPress={() => navigation.navigate('Events', { type: 'Location', value: currentState })}
            >
              View All
            </CustomText>
          </View>
          <Carousel
            data={nearEvents}
            renderItem={_slideChild}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth * 0.75}
            contentContainerCustomStyle={styles.carouselContainerLeft}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
          />
        </View>
      )}

      {/* categories slider */}
      {catsEvents.length > 0 &&
        catsEvents.map((item, key) => {
          return (
            <View style={styles.moduleContainer} key={key}>
              <View style={styles.swiperHeadar}>
                <CustomText weight="bold" style={{ fontSize: fontSizes.header }}>
                  {item.category.name}
                </CustomText>
                <CustomText
                  weight="light"
                  onPress={
                    () =>
                      navigation.navigate('Events', {
                        type: 'Categories',
                        value: {
                          id: item.category.id,
                          name: item.category.name,
                        },
                      }) //routing for eventsScreen
                  }
                >
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
