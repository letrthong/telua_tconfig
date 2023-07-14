import {DefaultTheme, type Theme} from '@react-navigation/native';
import {type Colors as UIColors, createTheme, lightColors} from '@rneui/themed';
import {Platform, StyleSheet} from 'react-native';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';

type TStyleItem = {
  borderRadius?: number;
  fontSize?: number;
};

type TStyle = boolean | undefined | null | TStyleItem | TStyleItem[];

const Fonts = {};

const FontStyles = StyleSheet.create({
  bold: {
    fontWeight: Platform.select({ios: '700', android: undefined}),
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
});

const IconSizes = {
  small: 18,
  medium: 24,
  large: 32,
  veryLarge: 40,
  superLarge: 48,
};

const ButtonHeights = {
  verySmall: 44,
  small: 48,
  medium: 56,
  large: 64,
};

const FontSizes = {
  small: 12,
  medium: 14,
  large: 16,
};

const Gap = 16;

const GapSmall = 10;

const BorderRadiuses = {
  small: 5,
  medium: 10,
  large: 15,
  veryLarge: 20,
};

const LineHeight = 1.3;

const ButtonHeight = 56;

const ButtonNoFullWidth = 200;

export const getDefaultTextStyle = (defaultFontSize = FontSizes.medium) => {
  return {
    fontSize: defaultFontSize,
  };
};

export const getPropertyFromStyle = (
  _style: StyleProp<TextStyle> | StyleProp<ViewStyle>,
  type: keyof TStyleItem,
) => {
  const style = _style as TStyle;

  if (Array.isArray(style)) {
    const fontSizeStyle = style.find(obj => obj?.[type]);
    if (fontSizeStyle?.[type]) {
      return fontSizeStyle[type];
    }
  } else if (typeof style === 'object' && style?.[type]) {
    return style[type];
  }
};

export const getFontSize = (fontSize = FontSizes.medium) => {
  return {
    fontSize,
    lineHeight: fontSize * LineHeight,
  };
};

export const Colors: UIColors = {
  ...lightColors,
  transparent: 'transparent',
  primary: '#1469A0',
  primaryLight: '#FFEED9',
  secondary: '#5A8383',
  success: '#03CE12',
  warning: '#FFA600',
  error: '#FC132D',
  disabled: '#DEDEDE',
  grey0: '#000',
  grey1: '#181818',
  grey2: '#4F4F4F',
  grey3: '#828282',
  grey4: '#9C9C9C',
  grey5: '#DEDEDE',
  border: '#DFE8D7',
  placeholder: '#AEAEAE',
  background: '#ffffff',
  icon: '#000000',
  info: '#0079E9',
};

export const light = createTheme({
  lightColors: Colors,
  components: {
    Button: ({noFullWidth}) => ({
      titleStyle: [{fontSize: FontSizes.medium}, FontStyles.medium],
      buttonStyle: [
        {
          height: ButtonHeights.medium,
          borderRadius: BorderRadiuses.large,
        },
        noFullWidth && {minWidth: ButtonNoFullWidth},
      ],
      containerStyle: [noFullWidth && {alignSelf: 'center'}],
    }),
    Input: {
      inputStyle: [FontStyles.regular, {color: Colors.black}],
      labelStyle: {color: Colors.black},
      placeholderTextColor: Colors.grey3,
      containerStyle: {
        marginBottom: Gap,
      },
    },
    Overlay: {
      statusBarTranslucent: true,
      overlayStyle: {
        backgroundColor: Colors.transparent,
        elevation: 0,
        paddingVertical: 0,
      },
    },
    Divider: {
      color: '#F5F4F4',
    },
  },
});

export const navigationTheme: Theme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
  },
};

export default {
  Fonts,
  IconSizes,
  FontSizes,
  FontStyles,
  BorderRadiuses,
  ButtonHeight,
  ButtonNoFullWidth,
  ButtonHeights,
  Gap,
  GapSmall,
};
