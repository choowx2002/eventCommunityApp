import {StyleSheet} from 'react-native';

const FontUtils = StyleSheet.create({
  regular: {
    fontFamily: 'SF-Pro-Display-Black', //'Lora-Regular',
  },
  bold: {
    fontFamily: 'SF-Pro-Display-Bold', //'Lora-Bold',
  },
  italic: {
    fontFamily: 'SF-Pro-Display-BlackItalic', //'Lora-Italic',
  },
  boldItalic: {
    fontFamily: 'SF-Pro-Display-BoldItalic', //'Lora-BoldItalic',
  },
  light: {
    fontFamily: 'SF-Pro-Display-Light', //'Lora-Light',
  },
  medium: {
    fontFamily: 'SF-Pro-Display-Medium', //'Lora-Medium',
  },
  semiBold: {
    fontFamily: 'SF-Pro-Display-Semibold', //'Lora-SemiBold',
  },
  semiBoldItalic: {
    fontFamily: 'SF-Pro-Display-SemiboldItalic', //'Lora-SemiBoldItalic',
  },
});

export const getFontFamily = weight => {
  switch (weight) {
    case 'bold':
      return FontUtils.bold;
    case 'italic':
      return FontUtils.italic;
    case 'boldItalic':
      return FontUtils.boldItalic;
    case 'light':
      return FontUtils.light;
    case 'medium':
      return FontUtils.medium;
    case 'semiBold':
      return FontUtils.semiBold;
    case 'semiBoldItalic':
      return FontUtils.semiBoldItalic;
    default:
      return FontUtils.regular;
  }
};

export default FontUtils;
