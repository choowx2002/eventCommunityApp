import { StyleSheet, ScrollView, View, Image, Pressable, ToastAndroid, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { findPostcode } from 'malaysia-postcodes';
import { format, parse, parseISO } from 'date-fns';
//components
import CustomButton, { BackButton } from '../../components/CustomButton';
import { LoadingModal, loadingHook } from '../../components/LoadingModal';
import { formData } from '../../components/FormHook';
import CustomInput from '../../components/CustomInput';
import CustomText from '../../components/CustomText';
import CustomModel from '../../components/AlertModal';
//others
import fontSizes from '../../types/fontSize';
import { useTheme } from '../../utils/themesUtil';
import { globalStyle } from '../../styles/globalStyles';
import { getAllCategories } from '../../services/categoryApi.service';
import { uploadImage } from '../../services/api';
import { createEventApi } from '../../services/eventApi.service';
import { getData } from '../../utils/storageHelperUtil';

const CreateEventScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { isVisible, showLoadingModal, hideLoadingModal } = loadingHook(); //get loading modal hook
  const [alertState, setAlertState] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [UID, setUserID] = useState(null);
  const [formValues, handleFormValueChange, validateForm] = formData({
    data: {
      title: '',
      category_id: '1',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      address: '',
      postcode: '',
      description: '',
      image_path: '',
      participants_limit: '10',
    },
    requiredData: [
      'title',
      'category_id',
      'start_date',
      'end_date',
      'start_time',
      'end_time',
      'address',
      'postcode',
      'participants_limit',
    ],
    error: {},
  });

  const themeStyles = StyleSheet.create({
    page: {
      backgroundColor: theme.background,
    },
    headerTitle: {
      fontSize: fontSizes.xxlarge,
    },
    labelText: {
      fontSize: fontSizes.medium,
    },
    previewImage: {
      borderColor: theme.description,
      backgroundColor: theme.themedBackground,
    },
    imgRemoveBtn: {
      backgroundColor: theme.dangerBg,
    },
    pickerBox: {
      backgroundColor: theme.themedBackground,
      color: theme.primaryText,
    },
    picker: {
      fontSize: fontSizes.regular,
    },
    errorText: {
      fontSize: fontSizes.small,
      color: theme.dangerBg,
    },
  });

  //query api
  const _query = () => {
    getAllCategories()
      .then((res) => {
        const categories = res?.data?.categories;
        if (categories.length > 0) setCategories(categories);
      })
      .catch((err) => {
        console.log('get categories failed.', err);
      });
  };

  useEffect(() => {
    getData('userData').then((res) => {
      if (!res) navigation.reset({
        index: 1,
        routes: [{ name: 'main' }, {name: "login"}],
      });
      setUserID(res.id);
      _query();
    })
  }, []);

  // get image from gallery
  const _pickImage = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 300,
      maxWidth: 600,
    });
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      const imageAsset = response.assets?.[0];
      if (imageAsset && imageAsset.fileSize <= 2097152) {
        const imageUri = imageAsset.uri;
        const imageName = imageAsset.fileName;
        const imageType = imageAsset.type;
        setSelectedImage({ imageUri, imageName, imageType });
      } else {
        Alert.alert('Image size exceeds 2 MB limit');
      }
    }
  };

  //remove the image
  const removeImage = () => {
    setSelectedImage(null);
  };

  //show create toast
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  //validate event form
  const validateEventForm = () => {
    console.log(formValues);
    if (!validateForm())
      return Alert.alert('Form is not complete! ∑(O_O；)', 'Please fill in required fields and check form again.');
    setAlertState(true);
  };

  //get city and state
  const getCityState = (postcode) => {
    const result = findPostcode(postcode);
    return { state: result.state, city: result.city };
  };

  //create event and route
  const createEvent = async () => {
    showLoadingModal();
    const event = await {
      title: formValues.data.title,
      description: formValues.data.description,
      start_time: format(formValues.data.start_time, 'HH:mm:ss'),
      end_time: format(formValues.data.end_time, 'HH:mm:ss'),
      start_date: format(parse(formValues.data.start_date, 'M/d/yyyy', new Date()), 'yyyy-MM-dd'),
      end_date: format(parse(formValues.data.end_date, 'M/d/yyyy', new Date()), 'yyyy-MM-dd'),
      image_path: await uploadImage(selectedImage),
      admin_id: UID,
      participants_limit: formValues.data.participants_limit,
      address: formValues.data.address,
      postcode: formValues.data.postcode,
      state: getCityState(formValues.data.postcode).state,
      city: getCityState(formValues.data.postcode).city,
      category_id: formValues.data.category_id,
    };
    setAlertState(false);
    createEventApi(event)
      .then(() => {
        showToast('Event created successfully!');
        navigation.goBack();
      })
      .catch((err) => {
        showToast('Something get wrong. Please try later.');
      })
      .finally(() => {
        hideLoadingModal();
      });
  };

  return (
    <View style={[styles.page, themeStyles.page]}>
      <LoadingModal text="loading" isVisible={isVisible} />
      <View style={globalStyle.header}>
        <BackButton navigation={navigation} float={false} showBg={false} />
        <CustomText weight="bold" style={[styles.headerTitle, themeStyles.headerTitle, {color: theme.description}]}>
          Create Event
        </CustomText>
      </View>
      <ScrollView>
        {/* image picker */}
        <View style={{ padding: !selectedImage ? 10 : 0 }}>
          <Pressable style={[styles.previewImage, themeStyles.previewImage]} onPress={_pickImage}>
            {selectedImage ? (
              <View style={styles.image}>
                <Image source={{ uri: selectedImage.imageUri }} style={styles.image} resizeMode="cover" />
                <CustomButton
                  style={[styles.imgRemoveBtn, themeStyles.imgRemoveBtn]}
                  onPress={removeImage}
                  icon={<Ionicons name="trash" size={18} color={theme.dangerText} />}
                ></CustomButton>
              </View>
            ) : (
              <View>
                <CustomText style={[styles.imageText, {color: theme.primaryText}]}>Upload Banner Image</CustomText>
                <CustomText weight="light" style={[styles.imageText, globalStyle.smallText, {color: theme.primaryText}]}>
                  Recommend Dimension: 600 x 300. Max Size: 2MB
                </CustomText>
              </View>
            )}
          </Pressable>
        </View>

        {/* title input */}
        <CustomInput
          label="Title: "
          formKey="title"
          placeholder="Event's title"
          textInputProps={{
            maxLength: 50,
            autoCapitalize: 'none',
          }}
          handleFormValueChange={handleFormValueChange}
        />
        {formValues?.errors?.title?.length > 0 &&
          formValues?.errors?.title?.map((value, key) => {
            return (
              <CustomText style={[styles.errorText, themeStyles.errorText, {color: theme.description}]} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}

        {/* category picker */}
        <CustomText style={[styles.labelText, themeStyles.labelText, {color: theme.tertiaryText}]} weight="semiBold">
          Category:
        </CustomText>
        <Picker
          selectedValue={formValues.data.category_id}
          onValueChange={(itemValue, itemIndex) => {
            handleFormValueChange('category_id', itemValue, 'category_id');
          }}
          dropdownIconColor={theme.primaryText}
          style={[styles.pickerBox, themeStyles.pickerBox]}
        >
          {categories.length > 0 &&
            categories.map((item, key) => {
              return (
                <Picker.Item style={[styles.picker, themeStyles.picker]} label={item.name} value={item.id} key={key} />
              );
            })}
        </Picker>

        {/* limit input */}
        <CustomInput
          label="Participants limit: "
          formKey="participants_limit"
          textInputProps={{
            inputMode: 'numeric',
          }}
          defaultValue={formValues?.data?.participants_limit}
          handleFormValueChange={handleFormValueChange}
        />
        {formValues?.errors?.participants_limit?.length > 0 &&
          formValues?.errors?.participants_limit?.map((value, key) => {
            return (
              <CustomText style={[styles.errorText, themeStyles.errorText, {color: theme.description}]} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}

        {/* date picker start */}
        <CustomText style={[styles.labelText, themeStyles.labelText, {color:theme.tertiaryText}]} weight="semiBold">
          Date:
        </CustomText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CustomInput
            showLabel={false}
            label="Start Date: "
            formKey="start_date"
            placeholder="Event's start date"
            pickerType={'date'}
            formValues={formValues}
            handleFormValueChange={handleFormValueChange}
          />
          <CustomText>—</CustomText>
          <CustomInput
            showLabel={false}
            label="End Date: "
            formKey="end_date"
            placeholder="Event's end date"
            pickerType={'date'}
            formValues={formValues}
            handleFormValueChange={handleFormValueChange}
          />
        </View>
        {formValues?.errors?.date?.length > 0 &&
          formValues?.errors?.date?.map((value, key) => {
            return (
              <CustomText style={[styles.errorText, themeStyles.errorText]} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}
        {/* date picker end*/}

        {/* time picker start */}
        <CustomText style={[styles.labelText, themeStyles.labelText, {color:theme.tertiaryText}]} weight="semiBold">
          Time:
        </CustomText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CustomInput
            showLabel={false}
            label="Start Time"
            formKey="start_time"
            placeholder="Event's start time"
            pickerType={'time'}
            formValues={formValues}
            handleFormValueChange={handleFormValueChange}
          />
          <CustomText>—</CustomText>
          <CustomInput
            showLabel={false}
            label="End Time"
            formValues={formValues}
            formKey="end_time"
            placeholder="Event's end time"
            pickerType={'time'}
            handleFormValueChange={handleFormValueChange}
          />
        </View>
        {formValues?.errors?.time?.length > 0 &&
          formValues?.errors?.time?.map((value, key) => {
            return (
              <CustomText style={[styles.errorText, themeStyles.errorText]} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}
        {/* time picker end */}

        {/* address input */}
        <CustomInput
          label="Address: "
          formKey="address"
          placeholder="Event's address"
          handleFormValueChange={handleFormValueChange}
        />
        {formValues?.errors?.address?.length > 0 &&
          formValues?.errors?.address?.map((value, key) => {
            return (
              <CustomText style={[styles.errorText, themeStyles.errorText]} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}

        {/* postcode input */}
        <CustomInput
          label="Postcode: "
          formKey="postcode"
          placeholder="example: 47170"
          textInputProps={{
            maxLength: 5,
            inputMode: 'numeric',
          }}
          handleFormValueChange={handleFormValueChange}
        />
        {formValues?.errors?.postcode?.length > 0 &&
          formValues?.errors?.postcode?.map((value, key) => {
            return (
              <CustomText style={[styles.errorText, themeStyles.errorText]} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}

        {/* description */}
        <CustomInput
          label="Description: "
          formKey="description"
          placeholder="Put some event's description/info here!"
          textInputProps={{
            rows: 10,
            multiline: true,
          }}
          inputStyle={{
            borderWidth: 1,
            marginVertical: 10,
            paddingVertical: 10,
            verticalAlign: 'top',
            borderRadius: 5,
          }}
          handleFormValueChange={handleFormValueChange}
        />
      </ScrollView>
      <CustomButton style={styles.button} theme="primary" onPress={validateEventForm}>
        Create
      </CustomButton>
      <CustomModel
        title={`Are you sure to create this event?`}
        themeColor={'primary'}
        isVisible={alertState}
        onClose={() => setAlertState(false)}
        onConfirm={createEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  headerTitle: {
    lineHeight: 30,
  },
  labelText: {
    marginBottom: 0,
    marginLeft: 10,
    marginTop: 10,
  },
  button: {
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 0,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 2 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageText: {
    textAlign: 'center',
  },
  imgRemoveBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    paddingVertical: 4,
    paddingRight: 2,
    paddingLeft: 10,
  },
  pickerBox: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    fontFamily: 'Lora-Regular',
  },
  errorText: {
    marginLeft: 10,
  },
});

export default CreateEventScreen;
