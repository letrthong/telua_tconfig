import i18n from 'locales';
import {Linking, Platform} from 'react-native';
import {Alert} from 'react-native';
import {PERMISSIONS, check, request} from 'react-native-permissions';

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

export const checkCameraPermission = async (alert?: boolean) => {
  const permission =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.CAMERA
      : PERMISSIONS.IOS.CAMERA;
  let status = false;
  const checkedStatus = await check(permission);
  if (checkedStatus === 'granted') {
    status = true;
  } else if (checkedStatus === 'denied') {
    const requestedStatus = await request(permission);
    status = requestedStatus === 'granted';
  }
  if (alert && !status) {
    alertFunc(i18n.t('alert.permission.camera'));
  }
  return status;
};
