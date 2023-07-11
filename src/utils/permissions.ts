import i18n from 'locales';
import {Linking} from 'react-native';
import {Alert} from 'react-native';

export const alertFunc = (message: string | null) => {
  Alert.alert('', message || '', [
    {
      text: i18n.t('button.open_settings'),
      onPress: Linking.openSettings,
    },
    {
      text: i18n.t('button.skip'),
      onPress: () => {},
      style: 'cancel',
    },
  ]);
};
