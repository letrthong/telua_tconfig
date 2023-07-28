import TetheringManager from '@react-native-tethering/wifi';
import {Text} from '@rneui/themed';
import Scan from 'assets/svgs/scan.svg';
import Search from 'assets/svgs/search.svg';
import Setting from 'assets/svgs/setting.svg';
import SignIn from 'assets/svgs/sign-in.svg';
import LoadingModal from 'components/atoms/loading-modal';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking, Platform, TouchableOpacity, View} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import useStore, {addLastScanTime} from 'stores';
import {Gap, IconSizes, goToUrlPortalDelay, maxScanTime} from 'utils';
import AppStyles from 'utils/styles';
import {Colors} from 'utils/themes';
import {checkWifiEnabled, connectWifi, disconnectWifi} from 'utils/wifi';
import type {FC} from 'react';
import type {SvgProps} from 'react-native-svg';
import type {MainTabScreenProps} from 'typings/navigation';

// TODO: search more
const hasPasswordcapabilityKeys = ['WPA', 'WPA2', 'WEP'];
/** seconds */
const limitTime = 2 * 60;

type ItemProps = {
  Icon: FC<SvgProps>;
  title: string;
  count?: number;
  onPress: () => void;
};

const signInUrl = 'https://telua.co/aiot';

const Item = ({Icon, title, count, onPress}: ItemProps) => {
  return (
    <TouchableOpacity
      disabled={!!count}
      style={[
        AppStyles.flex1,
        AppStyles.itemCenter,
        !!count && AppStyles.opacityHalf,
        {marginBottom: Gap * 2},
      ]}
      onPress={onPress}>
      <Icon
        color={Colors.primary}
        height={IconSizes.veryLarge}
        style={AppStyles.marginBottomSmall}
        width={IconSizes.veryLarge}
      />
      <Text>
        {title}
        {count ? ` (${count})` : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({navigation}: MainTabScreenProps<'Home'>) {
  const {t} = useTranslation();
  const {setting, lastScanTimeList} = useStore();
  // starting android 9, it's only allowed to scan 4 times per 2 minuts in a foreground app.
  const [remainTime, setRemainTime] = useState(() => {
    if (lastScanTimeList.length === maxScanTime) {
      const diffTime = Math.abs(
        dayjs(lastScanTimeList[1]).diff(dayjs(), 'seconds'),
      );
      return diffTime > limitTime ? 0 : limitTime - diffTime;
    }
    return 0;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConfig();
  }, []);

  useEffect(() => {
    const isAndroid9AndAbove =
      Platform.OS === 'android' && Platform.Version >= 28;
    if (!isAndroid9AndAbove) {
      return;
    }

    const interval = setInterval(() => {
      if (lastScanTimeList.length === maxScanTime) {
        const diffTime = Math.abs(
          dayjs(lastScanTimeList[1]).diff(dayjs(), 'seconds'),
        );
        setRemainTime(diffTime > limitTime ? 0 : limitTime - diffTime);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [lastScanTimeList]);

  const checkConfig = () => {
    if (!setting.prefix || !setting.password || !setting.url_portal) {
      Alert.alert(t('util.info'), t('home.enter_config'));
      navigation.navigate('SettingConfig');
      return false;
    }
    return true;
  };

  const onPressScan = async () => {
    const isMatchedSsid = (ssid: string) => {
      return ssid.toLowerCase().startsWith(setting.prefix.toLowerCase());
    };

    const goToUrlPortal = () => {
      setLoading(false);
      Linking.openURL(setting.url_portal);
    };

    if (!checkConfig()) {
      return;
    }

    setLoading(true);

    try {
      await checkWifiEnabled(setLoading);

      try {
        const currentSSID = await WifiManager.getCurrentWifiSSID();
        if (isMatchedSsid(currentSSID)) {
          goToUrlPortal();
          return;
        }
      } catch (error) {}

      addLastScanTime();
      const wifiList = await TetheringManager.getWifiNetworks(true);
      const matchedWifiList = wifiList.filter(wifi => isMatchedSsid(wifi.ssid));
      if (!matchedWifiList.length) {
        setLoading(false);
        Alert.alert(t('util.error'), t('home.no_match'));
        return;
      }

      await disconnectWifi();

      let hasValidWifi = false;
      for await (const mathchedWifi of matchedWifiList) {
        const mathchedWifiResult = await new Promise(async resolve => {
          const hasPasswordWifi = hasPasswordcapabilityKeys.some(key =>
            mathchedWifi.capabilities.includes(key),
          );
          try {
            await connectWifi({
              ssid: mathchedWifi.ssid,
              password: hasPasswordWifi ? setting.password : undefined,
              onSetLoading: setLoading,
              onTimeout: () => resolve(true),
              onSucess: async ssid => {
                if (isMatchedSsid(ssid)) {
                  await new Promise(r => setTimeout(r, goToUrlPortalDelay));
                  goToUrlPortal();
                } else {
                  Alert.alert(t('util.error'), t('home.wifi_was_saved'));
                  setLoading(false);
                }
                resolve(true);
              },
            });
          } catch (error) {
            resolve(false);
          }
        });
        if (mathchedWifiResult) {
          hasValidWifi = true;
          break;
        }
      }
      setLoading(false);
      if (!hasValidWifi) {
        Alert.alert(t('util.error'), t('alert.error.default'));
      }
    } catch (e) {
      setLoading(false);
      Alert.alert(t('util.error'), e?.toString());
    }
  };

  const onPressSetting = () => navigation.navigate('SettingList');

  const onPressScanQR = () => navigation.navigate('ScanQR');

  const onPressSignIn = () => Linking.openURL(signInUrl);

  return (
    <View style={[AppStyles.flex1, AppStyles.padding]}>
      <View style={AppStyles.row}>
        <Item
          count={remainTime}
          Icon={Search}
          title={t('home.menu.scan')}
          onPress={onPressScan}
        />
        <Item
          Icon={Setting}
          title={t('home.menu.setting')}
          onPress={onPressSetting}
        />
      </View>
      <View style={AppStyles.row}>
        <Item
          Icon={Scan}
          title={t('home.menu.scan_qr')}
          onPress={onPressScanQR}
        />
        <Item
          Icon={SignIn}
          title={t('home.menu.sign_in')}
          onPress={onPressSignIn}
        />
      </View>
      <LoadingModal isVisible={loading} />
    </View>
  );
}
