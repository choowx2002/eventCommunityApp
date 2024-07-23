import {StyleSheet} from 'react-native';

const FontUtils = StyleSheet.create({
  regular: {
    fontFamily: 'Lora-Regular',
  },
  bold: {
    fontFamily: 'Lora-Bold',
  },
  italic: {
    fontFamily: 'Lora-Italic',
  },
  boldItalic: {
    fontFamily: 'Lora-BoldItalic',
  },
  light: {
    fontFamily: 'Lora-Light',
  },
  medium: {
    fontFamily: 'Lora-Medium',
  },
  semiBold: {
    fontFamily: 'Lora-SemiBold',
  },
  semiBoldItalic: {
    fontFamily: 'Lora-SemiBoldItalic',
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
