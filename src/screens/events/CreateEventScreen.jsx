import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Pressable,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '../../utils/themesChecker';
import CustomButton, {BackButton} from '../../components/CustomButton';
import {globalStyle} from '../../styles/globalStyles';
import CustomText from '../../components/CustomText';
import fontSizes from '../../types/fontSize';
import {formData} from '../../components/FormHook';
import CustomInput from '../../components/CustomInput';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import CustomModel from '../../components/AlertModal';

const categories = [
  {name: 'Badminton', id: '1'},
  {name: 'Music', id: '2'},
  {name: 'Marathon', id: '3'},
  {name: 'E-sport', id: '4'},
];

const CreateEventScreen = ({navigation}) => {
  const {theme} = useTheme();
  const [alertState, setAlertState] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formValues, handleFormValueChange, validateForm] = formData({
    data: {
      title: '',
      categoryId: '1',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      address: '',
      postcode: '',
      description: '',
      imagePath: '',
      limit: '10',
    },
    requiredData: [
      'title',
      'categoryId',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'address',
      'postcode',
      'limit',
    ],
    error: {},
  });

  const styles = StyleSheet.create({
    page: {
      backgroundColor: theme.background,
      flex: 1,
    },
    headerTitle: {
      fontSize: fontSizes.xxlarge,
      lineHeight: 30,
    },
    labelText: {
      fontSize: fontSizes.medium,
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
      borderColor: theme.text,
      borderStyle: 'dashed',
      overflow: 'hidden',
      backgroundColor: theme.cardBackground,
    },
    previewImageContainer: {
      padding: 10,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageText: {
      textAlign: 'center',
    },
    pickerBox: {
      backgroundColor: theme.cardBackground,
      color: theme.text,
      marginHorizontal: 10,
      marginBottom: 15,
    },
    picker: {
      fontFamily: 'Lora-Regular',
      fontSize: fontSizes.regular,
    },
    errorText: {
      fontSize: fontSizes.small,
      color: theme.dangerBg,
      marginLeft: 10,
    },
  });

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
        let imageUri = imageAsset.uri;
        setSelectedImage(imageUri);
      } else {
        console.log('Image size exceeds 2 MB limit');
      }
    }
  };

  //remove the image
  const removeImage = () => {
    setSelectedImage(null);
  };

  //show create toast
  const showToast = message => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  //validate event form
  const validateEventForm = () => {
    console.log(formValues);
    if (!validateForm()) return showToast('Form is not completed!');
    setAlertState(true);
  };

  //create event and route
  const createEvent = () => {
    setAlertState(false);
    showToast('Event created successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <View style={globalStyle.header}>
        <BackButton navigation={navigation} float={false} showBg={false} />
        <CustomText weight="bold" style={styles.headerTitle}>
          Create Event
        </CustomText>
      </View>
      <ScrollView>
        {/* image picker */}
        <View style={!selectedImage && styles.previewImageContainer}>
          <Pressable style={styles.previewImage} onPress={_pickImage}>
            {selectedImage ? (
              <View style={styles.image}>
                <Image
                  source={{uri: selectedImage}}
                  style={styles.image}
                  resizeMode="contain"
                />
                <CustomButton
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    paddingVertical: 4,
                    paddingRight: 2,
                    paddingLeft: 10,
                    backgroundColor: theme.dangerBg,
                  }}
                  onPress={removeImage}
                  icon={
                    <Ionicons name="trash" size={18} color={theme.dangerText} />
                  }></CustomButton>
              </View>
            ) : (
              <View>
                <CustomText style={styles.imageText}>
                  Upload Banner Image
                </CustomText>
                <CustomText
                  weight="light"
                  style={[styles.imageText, globalStyle.smallText]}>
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
              <CustomText style={styles.errorText} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}

        {/* category picker */}
        <CustomText style={styles.labelText} weight="semiBold">
          Category:
        </CustomText>
        <Picker
          selectedValue={formValues.data.categoryId}
          onValueChange={(itemValue, itemIndex) => {
            handleFormValueChange('categoryId', itemValue, 'categoryId');
          }}
          dropdownIconColor={theme.text}
          style={styles.pickerBox}>
          {categories.length > 0 &&
            categories.map((item, key) => {
              return (
                <Picker.Item
                  style={styles.picker}
                  label={item.name}
                  value={item.id}
                  key={key}
                />
              );
            })}
        </Picker>

        {/* limit input */}
        <CustomInput
          label="Participants limit: "
          formKey="limit"
          textInputProps={{
            inputMode: 'numeric',
          }}
          defaultValue={formValues?.data?.limit}
          handleFormValueChange={handleFormValueChange}
        />
        {formValues?.errors?.limit?.length > 0 &&
          formValues?.errors?.limit?.map((value, key) => {
            return (
              <CustomText style={styles.errorText} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}

        {/* date picker start */}
        <CustomText style={styles.labelText} weight="semiBold">
          Date:
        </CustomText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomInput
            showLabel={false}
            label="Start Date: "
            formKey="startDate"
            placeholder="Event's start date"
            pickerType={'date'}
            formValues={formValues}
            handleFormValueChange={handleFormValueChange}
          />
          <CustomText>—</CustomText>
          <CustomInput
            showLabel={false}
            label="End Date: "
            formKey="endDate"
            placeholder="Event's end date"
            pickerType={'date'}
            formValues={formValues}
            handleFormValueChange={handleFormValueChange}
          />
        </View>
        {formValues?.errors?.date?.length > 0 &&
          formValues?.errors?.date?.map((value, key) => {
            return (
              <CustomText style={styles.errorText} weight="semiBold" key={key}>
                {value}
              </CustomText>
            );
          })}
        {/* date picker end*/}

        {/* time picker start */}
        <CustomText style={styles.labelText} weight="semiBold">
          Time:
        </CustomText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomInput
            showLabel={false}
            label="Start Time"
            formKey="startTime"
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
            formKey="endTime"
            placeholder="Event's end time"
            pickerType={'time'}
            handleFormValueChange={handleFormValueChange}
          />
        </View>
        {formValues?.errors?.time?.length > 0 &&
          formValues?.errors?.time?.map((value, key) => {
            return (
              <CustomText style={styles.errorText} weight="semiBold" key={key}>
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
              <CustomText style={styles.errorText} weight="semiBold" key={key}>
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
              <CustomText style={styles.errorText} weight="semiBold" key={key}>
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
      <CustomButton
        style={styles.button}
        theme="primary"
        onPress={validateEventForm}>
        Create
      </CustomButton>
      <CustomModel
        title={`Are you sure to create this event?`}
        themeColor={'bw'}
        isVisible={alertState}
        onClose={createEvent}
        onConfirm={createEvent}
      />
    </View>
  );
};

export default CreateEventScreen;
