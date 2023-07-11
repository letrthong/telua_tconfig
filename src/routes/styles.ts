import {StyleSheet} from 'react-native';
import AppStyles from 'utils/styles';
import {getFontSize} from 'utils/themes';

export const styles = StyleSheet.create({
  headerTitle: {
    ...getFontSize(20),
    ...AppStyles.textBold,
    textTransform: 'uppercase',
  },
});
