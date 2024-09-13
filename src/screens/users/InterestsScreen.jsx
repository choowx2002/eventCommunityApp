import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllCategories } from '../../services/categoryApi.service';
import { useTheme } from '../../utils/themesUtil';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import { getUserCategories, updateUserCategories } from '../../services/userApi.service';
import { getData } from '../../utils/storageHelperUtil';

const InterestsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [cats, setCats] = useState([]);
  const [id, setId] = useState('');

  const toggleInterest = (interest) => {
    setSelectedInterests((prevSelected) => {
      const isSelected = prevSelected.some((i) => i.id === interest.id);

      if (isSelected) {
        return prevSelected.filter((i) => i.id !== interest.id);
      } else {
        return [...prevSelected, interest];
      }
    });
  };

  const isInterestSelected = (interestId) => {
    return selectedInterests.some((selectedInterest) => selectedInterest.id === interestId);
  };

  const addCategories = () => {
    console.log(
      id,
      ' cats ',
      selectedInterests.map((i) => i.id)
    );
    if (selectedInterests.length > 0) {
      updateUserCategories(id, { category_ids: selectedInterests.map((i) => i.id) }).then((res) => {
        if (!res) return;
        navigation.reset({
          index: 0,
          routes: [{ name: 'main' }],
        });
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'main' }],
      });
    }
  };

  useEffect(() => {
    setSelectedInterests([]);
    getData('userData').then((res) => {
      if (!res) return navigation.goBack();
      setId(res.id);
      getUserCategories(res.id).then((res) => {
        if (res) {
          setSelectedInterests(res.data.categories);
        }
      });
    });

    setCats([]);
    getAllCategories().then((res) => {
      if (!res) return;
      if (res?.data?.categories) {
        setCats(res.data.categories);
      }
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <CustomText style={styles.title}>PERSONAL INTERESTS</CustomText>
      <View style={styles.interestsContainer}>
        {cats.map((interest) => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestButton,
                { backgroundColor: isInterestSelected(interest.id) ? theme.primaryBG : theme.primaryText },
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <CustomText style={{ color: isInterestSelected(interest.id) ? theme.primaryText : theme.primaryBG }}>
                {interest.name}
              </CustomText>
            </TouchableOpacity>
          ))}
      </View>
      <CustomButton style={styles.doneButton} onPress={addCategories}>
        <CustomText style={styles.doneButtonText}>DONE</CustomText>
      </CustomButton>
      <TouchableOpacity
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'main' }],
          })
        }
      >
        <CustomText style={styles.link}>Skip</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  interestButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#1E90FF',
  },
  doneButton: {
    paddingVertical: 15,
    borderRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default InterestsScreen;
