import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Image,
  Pressable,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import CustomButton, {BackButton} from '../../components/CustomButton';
import {getFontFamily} from '../../types/customFonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../utils/themesUtil';
import fontSizes from '../../types/fontSize';
import {FlatList} from 'react-native-gesture-handler';
import CustomText from '../../components/CustomText';
import {globalStyle} from '../../styles/globalStyles';
import {searchEventApi} from '../../services/eventApi.service';
import {getHostName} from '../../services/api';
import {format} from 'date-fns';

const SearchScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [events, setEvents] = useState([]);
  const deviceWidth = Dimensions.get('window').width;

  // get event from api
  const searchEvents = () => {
    Keyboard.dismiss();
    if (!searchTerm) {
      ToastAndroid.showWithGravity(
        'Search must not be empty!',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
      setSearched(false);
      return;
    }

    searchEventApi({title: searchTerm}).then(res => {
      setEvents(res.data.events);
    });
    setSearched(true);
  };

  //styles
  const styles = StyleSheet.create({
    searchInputBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      paddingHorizontal: 10,
      gap: 5,
      borderWidth: 1,
      borderRadius: 30,
      borderColor: theme.text,
      backgroundColor: theme.cardBackground,
    },
    inputBox: {
      flex: 1,
      color: theme.text,
      paddingVertical: 5,
    },
    searchButton: {
      marginVertical: 5,
      paddingVertical: 5,
      paddingHorizontal: 20,
      elevation: 0,
      lineHeight: '100%',
    },
    image: {
      width: deviceWidth - 20,
      height: deviceWidth * 0.5,
      borderRadius: 10,
    },
    eventItem: {
      backgroundColor: theme.cardBackground,
      marginBottom: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    eventInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    eventMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    title: {
      fontSize: fontSizes.large,
      marginBottom: 2,
    },
    flatList: {
      paddingBottom: 50,
    },
    noEventsBox: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    noEventsText: {
      fontSize: fontSizes.xxlarge,
      textAlign: 'center',
      marginHorizontal: 30,
    },
  });

  //used for render items
  const EventItem = ({event}) => {
    return (
      <Pressable
        style={styles.eventItem}
        onPress={() => navigation.navigate('eDetails', {eventId: event.id})}>
        <Image
          source={
            event.image_path
              ? {uri: `${getHostName()}${event.image_path}`}
              : require('../../assets/images/example.jpeg')
          }
          style={styles.image}          
        />
        <CustomText
          style={[styles.title, getFontFamily('bold')]}
          numberOfLines={1}>
          {event.title}
        </CustomText>
        <View style={styles.eventInfo}>
          <View style={styles.eventMeta}>
            <Ionicons
              name={'calendar'}
              color={theme.text}
              size={fontSizes.regular}
            />
            <CustomText>{format(event.start_date, 'yyyy-MM-dd')}</CustomText>
          </View>
          <View style={styles.eventMeta}>
            <Ionicons
              name={'person'}
              color={theme.text}
              size={fontSizes.regular}
            />
            <CustomText>
              {event.participants}/{event.participants_limit}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View style={[globalStyle.header, {}]}>
        <BackButton navigation={navigation} float={false} showBg={false} />
        <View style={styles.searchInputBox}>
          <Ionicons name="search-outline" color={theme.text} size={18} />
          <TextInput
            style={[getFontFamily('regular'), styles.inputBox]}
            onChangeText={setSearchTerm}
            value={searchTerm}
            placeholder="search"
            autoFocus={true}
            onFocus={() => {
              setIsFocus(true);
            }}
            onEndEditing={() => {
              setIsFocus(false);
            }}
            returnKeyType="search"
            onSubmitEditing={searchEvents}
          />
          {isFocus && (
            <Ionicons
              name="close-outline"
              color={theme.text}
              size={18}
              onPress={() => setSearchTerm('')}
            />
          )}
        </View>
        <CustomButton
          theme="bw"
          style={styles.searchButton}
          textSize={fontSizes.small}
          onPress={searchEvents}>
          SEARCH
        </CustomButton>
      </View>

      {events.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={events}
          renderItem={({item}) => <EventItem event={item} />}
          keyExtractor={item => item.id}
        />
      ) : searched ? (
        <View style={styles.noEventsBox}>
          <CustomText weight="italic" style={styles.noEventsText}>
            No Similar Events. Try Others =。=?
          </CustomText>
        </View>
      ) : (
        <View style={styles.noEventsBox}>
          <CustomText weight="italic" style={styles.noEventsText}>
            Search Some Events!
          </CustomText>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
