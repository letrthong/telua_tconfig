import TetheringManager from '@react-native-tethering/wifi';
import {Text} from '@rneui/themed';
import Search from 'assets/svgs/search.svg';
import Setting from 'assets/svgs/setting.svg';
import LoadingModal from 'components/atoms/loading-modal';
import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {SvgProps} from 'react-native-svg';
import WifiManager from 'react-native-wifi-reborn';
import useStore from 'stores';
import {MainTabScreenProps} from 'typings/navigation';
import {IconSizes} from 'utils';
import AppStyles from 'utils/styles';
import {Colors} from 'utils/themes';

type ItemProps = {
  Icon: FC<SvgProps>;
  title: string;
  onPress: () => void;
};

const Item = ({Icon, title, onPress}: ItemProps) => {
  return (
    <TouchableOpacity
      style={[AppStyles.flex1, AppStyles.itemCenter]}
      onPress={onPress}>
      <Icon
        width={IconSizes.veryLarge}
        height={IconSizes.veryLarge}
        color={Colors.primary}
        style={AppStyles.marginBottomSmall}
      />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const checkCurrentSSIDIntervalTime = 1000;
const maxCheckCurrentSSIDIntervalTimes = 10;

export default function HomeScreen({navigation}: MainTabScreenProps<'Home'>) {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const {setting} = useStore();

  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = () => {
    if (!setting.prefix || !setting.password || !setting.url_portal) {
      Alert.alert(t('util.error'), t('home.enter_config'));
      onPressSetting();
      return false;
    }
    return true;
  };

  const onPressScan = async () => {
    if (!checkConfig()) {
      return;
    }

    setLoading(true);
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        try {
          try {
            const currentSSID = await WifiManager.getCurrentWifiSSID();
            if (currentSSID === setting.prefix) {
              setLoading(false);
              Linking.openURL(setting.url_portal);
              return;
            }
          } catch (error) {}

          const isWifiEnabled = await TetheringManager.isWifiEnabled();
          if (!isWifiEnabled) {
            // TODO: if user don't press enable wifi button,
            // next code will bot be executed,
            // except next time user press enable button, this (previous) code will be executed,

            /** In android 10 and above, you cannot enable WiFi programmatically,
             * so a popup will be shown to the user to enable it manually.
             * If user don't press enable button, next code will not be executed,
             * except next time user press enable wifi button,
             * this (previous) code will be executed,
             * so we need hide loading modal here
             */
            setLoading(false);
            await TetheringManager.setWifiEnabled();
          }
          /** Contiunue show loading modal if user press enable wifi button */
          setLoading(true);
          // TODO: if new network was saved and has current network,
          // can not disconnect from current network

          /** Need disconnect from current network to connect to new network */
          await TetheringManager.disconnectFromNetwork();
          await TetheringManager.connectToNetwork({
            ssid: setting.prefix,
            password: setting.password,
          });
          try {
            /** If user don't press save button, next code will not be executed,
             * so we need hide loading modal here
             */
            setLoading(false);
            await TetheringManager.saveNetworkInDevice({
              ssid: setting.prefix,
              password: setting.password,
            });
          } catch (error) {}
          /** Contiunue show loading modal if user press save wifi button */
          setLoading(true);

          let checkCurrentSSIDIntervalTimes = 0;
          const checkCurrentSSIDInterval = setInterval(async () => {
            if (
              checkCurrentSSIDIntervalTimes >= maxCheckCurrentSSIDIntervalTimes
            ) {
              setLoading(false);
              clearInterval(checkCurrentSSIDInterval);
              Alert.alert(t('util.error'), t('alert.error.default'));
              return;
            } else {
              checkCurrentSSIDIntervalTimes++;
              try {
                const currentSSID = await WifiManager.getCurrentWifiSSID();
                setLoading(false);
                clearInterval(checkCurrentSSIDInterval);
                if (currentSSID === setting.prefix) {
                  Linking.openURL(setting.url_portal);
                } else {
                  Alert.alert(t('util.error'), t('home.wifi_was_saved'));
                }
              } catch (error) {}
            }
          }, checkCurrentSSIDIntervalTime);
        } catch (e) {
          setLoading(false);
          Alert.alert(t('util.error'), e?.toString());
        }
      } else {
        setLoading(false);
        Alert.alert(t('util.error'), t('alert.permission.location'));
      }
    } else {
      setLoading(false);
    }
  };

  const onPressSetting = () => navigation.navigate('SettingList');

  return (
    <View style={[AppStyles.flex1, AppStyles.padding]}>
      <View style={[AppStyles.row]}>
        <Item Icon={Search} title={t('home.menu.scan')} onPress={onPressScan} />
        <Item
          Icon={Setting}
          title={t('home.menu.setting')}
          onPress={onPressSetting}
        />
      </View>
      <LoadingModal isVisible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({});
