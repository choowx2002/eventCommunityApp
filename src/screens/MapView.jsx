import { StyleSheet, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { createMapLink } from 'react-native-open-maps';
import { WebView } from 'react-native-webview';
//components
import { BackButton } from '../components/CustomButton';
import { LoadingModal } from '../components/LoadingModal';
import CustomText from '../components/CustomText';
// others
import fontSizes from '../types/fontSize';
import { useTheme } from '../utils/themesUtil';

const MapView = ({ navigation }) => {
  const { theme } = useTheme();
  const route = useRoute();
  const deviceHeight = Dimensions.get('window').height;
  const deviceWidth = Dimensions.get('window').width;
  const [currentP, setCurrentP] = useState('');
  const [isVisible, setisVisible] = useState(true);
  const [geo, setGeo] = useState(false);

  useEffect(() => {
    if (!route.params.data) return;
    getUserLocation();
  }, []);

  //get user location
  const getUserLocation = async () => {
    Geolocation.getCurrentPosition(async info => {
      try {
        setCurrentP(`ll${info.coords.longitude},${info.coords.latitude}`);
      } finally {
        setGeo(true)
      }
    }, err => {
      if (err.PERMISSION_DENIED) return setGeo(true)
    },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },);
  };

  //create map link
  const getDirectionLink = current => {
    const address = route.params.data;
    if (!current) return createMapLink({ provider: 'yandex', query: `${address.address}, ${address.postcode}, ${address.city}, ${address.state}` });
    return createMapLink({
      provider: 'yandex',
      start: current,
      end: `${address.address}, ${address.postcode}, ${address.city}, ${address.state}`,
      travelType: 'drive',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LoadingModal text="loading" isVisible={isVisible} />
      {route.params?.data && (
        <View style={{ marginHorizontal: 5, marginVertical: 10 }}>
          <CustomText
            weight="bold"
            style={[{
              fontSize: fontSizes.xlarge,
              alignItems: 'center',
              textAlign: 'center',
            }, {
              color: theme.primaryBG
            }
            ]}>
            {route.params.data?.title}
          </CustomText>
          <CustomText
            style={[{
              fontSize: fontSizes.regular,
              alignItems: 'center',
            }, {
              color: theme.tertiaryText
            }
            ]}>
            {route.params.data.address}, {route.params.data.postcode},{' '}
            {route.params.data.city}, {route.params.data.state}
          </CustomText>
        </View>
      )}
      {geo && (
        <WebView
          onLoad={() => setisVisible(false)}
          source={{ uri: getDirectionLink(currentP) }}
          style={{
            width: deviceWidth,
            height: deviceHeight * 0.9,
            backgroundColor: theme.background,
          }}
          scalesPageToFit={true}
        />
      )}
      {/* back button */}
      <BackButton navigation={navigation} showBg={false} />
    </View>
  );
};

export default MapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
