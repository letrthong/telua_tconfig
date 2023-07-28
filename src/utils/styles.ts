import {StyleSheet} from 'react-native';
import {Gap} from 'utils';
import themes, {Colors} from './themes';

export const getRounedStyle = (size: number, borderRadius?: number) => ({
  width: size,
  height: size,
  borderRadius: borderRadius || size / 2,
});

const AppStyles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  background: {
    backgroundColor: Colors.background,
  },
  backgroundBlack: {
    backgroundColor: Colors.black,
  },
  backgroundDisabled: {
    backgroundColor: Colors.disabled,
  },
  backgroundError: {
    backgroundColor: Colors.error,
  },
  backgroundGrey0: {
    backgroundColor: Colors.grey0,
  },
  backgroundGrey1: {
    backgroundColor: Colors.grey1,
  },
  backgroundGrey2: {
    backgroundColor: Colors.grey2,
  },
  backgroundGrey3: {
    backgroundColor: Colors.grey3,
  },
  backgroundGrey4: {
    backgroundColor: Colors.grey4,
  },
  backgroundGrey5: {
    backgroundColor: Colors.grey5,
  },
  backgroundInfo: {
    backgroundColor: Colors.info,
  },
  backgroundPrimary: {
    backgroundColor: Colors.primary,
  },
  backgroundPrimaryLight: {
    backgroundColor: Colors.primaryLight,
  },
  backgroundSecondary: {
    backgroundColor: Colors.secondary,
  },
  backgroundSuccess: {
    backgroundColor: Colors.success,
  },
  backgroundTransparent: {
    backgroundColor: Colors.transparent,
  },
  backgroundWarning: {
    backgroundColor: Colors.warning,
  },
  backgroundWhite: {
    backgroundColor: Colors.white,
  },
  border: {
    borderColor: Colors.border,
    borderWidth: 1,
  },
  borderBlack: {
    borderColor: Colors.black,
  },
  borderError: {
    borderColor: Colors.error,
  },
  borderGrey0: {
    borderColor: Colors.grey0,
  },
  borderGrey1: {
    borderColor: Colors.grey1,
  },
  borderGrey2: {
    borderColor: Colors.grey2,
  },
  borderGrey3: {
    borderColor: Colors.grey3,
  },
  borderGrey4: {
    borderColor: Colors.grey4,
  },
  borderGrey5: {
    borderColor: Colors.grey5,
  },
  borderInfo: {
    borderColor: Colors.info,
  },
  borderPrimary: {
    borderColor: Colors.primary,
  },
  borderRadiusLarge: {
    borderRadius: themes.BorderRadiuses.large,
  },
  borderRadiusMedium: {
    borderRadius: themes.BorderRadiuses.medium,
  },
  borderRadiusSmall: {
    borderRadius: themes.BorderRadiuses.small,
  },
  borderRadiusVeryLarge: {
    borderRadius: themes.BorderRadiuses.veryLarge,
  },
  borderSecondary: {
    borderColor: Colors.secondary,
  },
  borderSuccess: {
    borderColor: Colors.success,
  },
  borderTransparent: {
    borderColor: Colors.transparent,
  },
  borderWarning: {
    borderColor: Colors.warning,
  },
  borderWhite: {
    borderColor: Colors.white,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  collumnGap: {
    columnGap: Gap,
  },
  collumnGapSmall: {
    columnGap: Gap / 2,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  full: {
    height: '100%',
    width: '100%',
  },
  fullAbsolute: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  fullCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  fullHeight: {
    height: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  gap: {
    gap: Gap,
  },
  gapSmall: {
    gap: Gap / 2,
  },
  itemCenter: {
    alignItems: 'center',
  },
  itemEnd: {
    alignItems: 'flex-end',
  },
  itemStart: {
    alignItems: 'flex-start',
  },
  justifyAround: {
    justifyContent: 'space-around',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  margin: {
    margin: Gap,
  },
  marginBottom: {
    marginBottom: Gap,
  },
  marginBottomSmall: {
    marginBottom: Gap / 2,
  },
  marginHorizontal: {
    marginHorizontal: Gap,
  },
  marginHorizontalSmall: {
    marginHorizontal: Gap / 2,
  },
  marginLeft: {
    marginLeft: Gap,
  },
  marginLeftSmall: {
    marginLeft: Gap / 2,
  },
  marginRight: {
    marginRight: Gap,
  },
  marginRightSmall: {
    marginRight: Gap / 2,
  },
  marginSmall: {
    margin: Gap / 2,
  },
  marginSmallSmall: {
    margin: Gap / 2,
  },
  marginTop: {
    marginTop: Gap,
  },
  marginTopSmall: {
    marginTop: Gap / 2,
  },
  marginVertical: {
    marginVertical: Gap,
  },
  marginVerticalSmall: {
    marginVertical: Gap / 2,
  },
  noBorder: {
    borderWidth: 0,
  },
  noBottomRadius: {
    borderRadius: 0,
  },
  opacityHalf: {
    opacity: 0.5,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  padding: {
    padding: Gap,
  },
  paddingBottom: {
    paddingBottom: Gap,
  },
  paddingBottomSmall: {
    paddingBottom: Gap / 2,
  },
  paddingHorizontal: {
    paddingHorizontal: Gap,
  },
  paddingHorizontalSmall: {
    paddingHorizontal: Gap / 2,
  },
  paddingLeft: {
    paddingLeft: Gap,
  },
  paddingLeftSmall: {
    paddingLeft: Gap / 2,
  },
  paddingRight: {
    paddingRight: Gap,
  },
  paddingRightSmall: {
    paddingRight: Gap / 2,
  },
  paddingSmall: {
    padding: Gap / 2,
  },
  paddingTop: {
    paddingTop: Gap,
  },
  paddingTopSmall: {
    paddingTop: Gap / 2,
  },
  paddingVertical: {
    paddingVertical: Gap,
  },
  paddingVerticalSmall: {
    paddingVertical: Gap / 2,
  },
  ratio1: {
    aspectRatio: 1,
  },
  row: {
    flexDirection: 'row',
  },
  rowGap: {
    rowGap: Gap,
  },
  rowGapSmall: {
    rowGap: Gap / 2,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  seftEnd: {
    alignSelf: 'flex-end',
  },
  selfCenter: {
    alignSelf: 'center',
  },
  selfStart: {
    alignSelf: 'flex-start',
  },
  textBlack: {
    color: Colors.black,
  },
  textBold: themes.FontStyles.bold,
  textCapitalize: {
    textTransform: 'capitalize',
  },
  textCenter: {
    textAlign: 'center',
  },
  textDisabled: {
    color: Colors.disabled,
  },
  textError: {
    color: Colors.error,
  },
  textGrey1: {
    color: Colors.grey1,
  },
  textGrey2: {
    color: Colors.grey2,
  },
  textGrey3: {
    color: Colors.grey3,
  },
  textGrey4: {
    color: Colors.grey4,
  },
  textGrey5: {
    color: Colors.grey5,
  },
  textInfo: {
    color: Colors.info,
  },
  textLarge: {
    fontSize: 16,
  },
  textLowerCase: {
    textTransform: 'lowercase',
  },
  textMedium: themes.FontStyles.medium,
  textNone: {
    textTransform: 'none',
  },
  textNormal: {
    fontSize: 14,
  },
  textPrimary: {
    color: Colors.primary,
  },
  textPrimaryLight: {
    color: Colors.primaryLight,
  },
  textRegular: themes.FontStyles.regular,
  textRight: {
    textAlign: 'right',
  },
  textSecondary: {
    color: Colors.secondary,
  },
  textSmall: {
    fontSize: 12,
  },
  textSuccess: {
    color: Colors.success,
  },
  textSuperLarge: {
    fontSize: 20,
  },
  textSuperSmall: {
    fontSize: 8,
  },
  textTransparent: {
    color: Colors.transparent,
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
  textUpperCase: {
    textTransform: 'uppercase',
  },
  textVeryLarge: {
    fontSize: 18,
  },
  textVerySmall: {
    fontSize: 10,
  },
  textWarning: {
    color: Colors.warning,
  },
  textWhite: {
    color: Colors.white,
  },
});

export default AppStyles;
