import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Modal,
  Dimensions,
} from 'react-native';
import CustomText from './CustomText';
import fontSizes from '../types/fontSize';
import {useTheme} from '../utils/themesUtil';

// Custom hook for managing loading modal visibility
const loadingHook = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showLoadingModal = () => setIsVisible(true); // call to open loading modal
  const hideLoadingModal = () => setIsVisible(false); // call to close loading modal

  return {
    isVisible,
    showLoadingModal,
    hideLoadingModal,
  };
};

/**
 * 
 * @param {string} text - text will show in loading modal 
 * @param isVisible - set as 'isVisible' to hook with the loadingHook isVisible variable
 * @returns 
 */
const LoadingModal = ({isVisible, text, ...props}) => {
  const {theme} = useTheme();
  const {width: vw} = Dimensions.get('window');

  return (
    <Modal transparent={true} animationType="fade" visible={isVisible} {...props}>
      <View style={loadingStyle.loadingScreen}>
        <View
          style={[
            loadingStyle.loadingBox,
            {width: (vw * 50) / 100, backgroundColor: theme.cardBackground},
          ]}>
          <ActivityIndicator size="large" color={theme.primary} />
          {text && (
            <CustomText weight="bold" style={{fontSize: fontSizes.medium, marginTop: 10 }}>
              {text}
            </CustomText>
          )}
        </View>
      </View>
    </Modal>
  );
};

const loadingStyle = StyleSheet.create({
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#06080f40',
  },
  loadingBox: {
    aspectRatio: 1 / 0.6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {LoadingModal, loadingHook};
