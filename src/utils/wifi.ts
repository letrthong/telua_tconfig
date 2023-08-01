import TetheringManager from '@react-native-tethering/wifi';
import i18n from 'locales';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

const checkCurrentSSIDIntervalTime = 1000;
const maxCheckCurrentSSIDIntervalTimes = 10;
const isAndroid10AndAbove = Platform.OS === 'android' && Platform.Version >= 29;

/** Need try catch */
export const checkWifiEnabled = async (
  onSetLoading?: (value: boolean) => void,
) => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    onSetLoading?.(false);
    Alert.alert(i18n.t('util.error'), i18n.t('alert.permission.location'));
    return;
  }

  const isWifiEnabled = await TetheringManager.isWifiEnabled();
  if (!isWifiEnabled) {
    // TODO: if user don't press enable wifi button,
    // next code will bot be executed,
    // except next time user press enable button, this (previous) code will be executed,

    /**
     * In android 10 and above, you cannot enable WiFi programmatically,
     * so a popup will be shown to the user to enable it manually.
     * If user don't press enable button, next code will not be executed,
     * except next time user press enable wifi button,
     * this (previous) code will be executed,
     * so we need hide loading modal here
     */
    onSetLoading?.(false);
    await TetheringManager.setWifiEnabled();
  }
  // Contiunue show loading modal if user press enable wifi button
  onSetLoading?.(true);
};

/** Need try catch */
export const disconnectWifi = async () => {
  // TODO: if new network was saved and has current network,
  // can not disconnect from current network

  /**
   * Need disconnect from current network to connect to new network
   * TetheringManager.disconnectFromNetwork only work on android 10 and above
   */
  if (isAndroid10AndAbove) {
    await TetheringManager.disconnectFromNetwork();
  } else {
    await WifiManager.disconnect();
  }
};

/** Need try catch */
export const connectWifi = async ({
  ssid,
  password,
  onSetLoading,
  onTimeout,
  onSucess,
}: {
  ssid: string;
  password?: string;
  onSetLoading?: (value: boolean) => void;
  onTimeout?: () => void;
  onSucess?: (ssid: string) => Promise<void>;
}) => {
  /**
   *  TetheringManager.connectToNetwork only work on android 10 and above
   *  TetheringManager.saveNetworkInDevice only work on android 10 and above
   */
  if (isAndroid10AndAbove) {
    await TetheringManager.connectToNetwork({
      ssid,
      password,
    });
    try {
      /**
       * If user don't press save button, next code will not be executed,
       * so we need hide loading modal here
       */
      onSetLoading?.(false);
      await TetheringManager.saveNetworkInDevice({
        ssid,
        password,
      });
    } catch (error) {}
    // Contiunue show loading modal if user press save wifi button
    onSetLoading?.(true);
  } else {
    await WifiManager.connectToProtectedSSID(
      ssid,
      password || null,
      true,
      false,
    );
  }

  for await (const i of Array.from({
    length: maxCheckCurrentSSIDIntervalTimes,
  }).map((_, index) => index)) {
    try {
      const currentSSID = await WifiManager.getCurrentWifiSSID();
      await onSucess?.(currentSSID);
      break;
    } catch (error) {}
    await new Promise(resolve =>
      setTimeout(resolve, checkCurrentSSIDIntervalTime),
    );
    if (i === maxCheckCurrentSSIDIntervalTimes - 1) {
      onSetLoading?.(false);
      Alert.alert(i18n.t('util.error'), i18n.t('alert.error.default'));
      onTimeout?.();
    }
  }
};
