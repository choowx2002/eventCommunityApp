import React, {useState} from 'react';
import {useTheme} from '../utils/themesUtil';
import {StyleSheet, View, Modal, Dimensions} from 'react-native';
import CustomText from './CustomText';
import fontSizes from '../types/fontSize';
import CustomButton from '../components/CustomButton';

/**
 * CustomModal component to display a modal dialog with customizable title, description, and buttons.
 *
 * @param {string} title - title
 * @param {string} message - message
 * @param {function} onConfirm - confirm button
 * @param {function} onClose - close button
 * @param {string}  okText - The text for the confirm button.
 * @param {string}  cancelText - The text for the cancel button.
 * @param {boolean} imageShown - Whether to show an image in the modal.
 * @param {string} themeColor - bw(default), primary, secondary, danger
 * @param {boolean} isVisible - Whether the modal is visible.
 * @param {Object} props - Additional props to pass to the Modal component.
 */
const CustomModel = ({
  title,
  message,
  onConfirm,
  onClose,
  okText = 'Confirm',
  cancelText = 'Cancel',
  imageShown,
  themeColor='bw',
  isVisible = true,
  ...props
}) => {
  const {theme} = useTheme();
  const {width: vw} = Dimensions.get('window');
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      {...props}>
      <View style={style.modalScreen}>
        <View
          style={[
            style.modalBox,
            {maxWidth: (vw * 4) / 5, backgroundColor: theme.cardBackground},
          ]}>
          <CustomText weight="bold" style={{fontSize: fontSizes.xlarge}}>
            {title}
          </CustomText>
          <CustomText>
            {message}
          </CustomText>
          <View style={style.buttonBox}>
            <CustomButton theme={themeColor} onPress={onConfirm}>
              {okText}
            </CustomButton>
            <CustomButton theme="bw2" style={{elevation: 0}} onPress={onClose}>
              {cancelText}
            </CustomButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  modalScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#06080f80',
  },
  modalBox: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonBox: {
    flexDirection: 'row-reverse',
    gap: 20,
    marginTop: 30,
  }
});

export default CustomModel;
