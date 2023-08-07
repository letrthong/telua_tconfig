import {useAppState} from '@react-native-community/hooks';
import {Button, Text} from '@rneui/themed';
import {checkDeviceStatus} from 'api/device';
import LoadingModal from 'components/atoms/loading-modal';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking, View} from 'react-native';
import {openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import WifiManager from 'react-native-wifi-reborn';
import useStore from 'stores';
import {goToUrlPortalDelay} from 'utils';
import {
  checkCameraPermission,
  checkFineLocationPermission,
} from 'utils/permissions';
import AppStyles from 'utils/styles';
import {connectWifi} from 'utils/wifi';
import type {CheckDeviceStatusResponse} from 'api/device';
import type {ComponentProps} from 'react';
import type {RootStackScreenProps} from 'typings/navigation';

type TQRCodeWifi = {
  wiFi: string;
  password: string;
};

type TQRCodeRegister = {
  serialNumber: string;
};

type TQRCode = {
  wiFi: string;
  password: string;
  serialNumber: string;
};

const connectWifiIntervalTime = 15 * 1000;
const maxConnectWifiIntervalTimes = 3;

export default function ScanQRScreen({
  navigation,
  route,
}: RootStackScreenProps<'ScanQR'>) {
  const {t} = useTranslation();
  const appState = useAppState();
  const {setting} = useStore();
  const [cameraPermission, setCameraPermission] = useState<boolean>();
  const [sending, setSending] = useState(false);
  const ref = useRef<QRCodeScanner>(null);

  useEffect(() => {
    const checkPermission = async () => {
      const permission = await checkCameraPermission();
      setCameraPermission(permission);
    };
    if (appState === 'active') {
      checkPermission();
    }
  }, [appState]);

  const alert = (message: string, isInfo = false) => {
    Alert.alert(isInfo ? t('util.info') : t('util.error'), message, [
      {
        text: t('button.ok'),
        onPress: () => ref.current?.reactivate(),
      },
    ]);
  };

  const goToUrlPortal = async () => {
    await new Promise(r => setTimeout(r, goToUrlPortalDelay));
    setSending(false);
    navigation.goBack();
    Linking.openURL(setting.url_portal);
  };

  const onReadWifi = async (
    dataQR: TQRCodeWifi,
    dataResponse: CheckDeviceStatusResponse,
  ) => {
    if (dataResponse.isOnline) {
      alert(t('scan_qr.device_is_online'), true);
      return;
    }

    let isSucess = true;
    for await (const times of Array.from({
      length: maxConnectWifiIntervalTimes,
    }).map((_, i) => i)) {
      let canContinue = true;
      try {
        await connectWifi({
          ssid: dataQR.wiFi,
          password: dataQR.password,
          onSetLoading: setSending,
          onTimeout: () => {
            if (times === maxConnectWifiIntervalTimes - 1) {
              isSucess = false;
            }
            alert(t('alert.error.default'));
          },
          onSucess: async ssid => {
            canContinue = false;
            if (ssid === dataQR.wiFi) {
              await goToUrlPortal();
            } else {
              setSending(false);
              alert(t('home.wifi_was_saved'));
            }
          },
        });
      } catch (error) {
        if (times === maxConnectWifiIntervalTimes - 1) {
          isSucess = false;
        }
      }
      await new Promise(resolve =>
        setTimeout(resolve, connectWifiIntervalTime),
      );
      if (!canContinue) {
        break;
      }
    }
    if (!isSucess) {
      alert(t('home.no_match'));
    }
  };

  const onReadRegister = async (
    dataQR: TQRCodeRegister,
    dataResponse: CheckDeviceStatusResponse,
  ) => {
    if (dataResponse.isOnline) {
      if (dataResponse.isRegister) {
        alert(t('scan_qr.is_registered'), true);
      } else {
        navigation.replace('AddDevice', {
          serialNumber: dataQR.serialNumber,
        });
      }
    } else {
      alert(t('scan_qr.device_is_offline'), true);
    }
  };

  const onRead: ComponentProps<typeof QRCodeScanner>['onRead'] = async e => {
    try {
      const type = e.type as typeof e.type | 'QR_CODE';
      const data = JSON.parse(e.data) as TQRCode;
      if (
        type !== 'QR_CODE' ||
        typeof data?.wiFi !== 'string' ||
        typeof data?.password !== 'string' ||
        typeof data?.serialNumber !== 'string'
      ) {
        alert(t('scan_qr.invalid'));
        return;
      }

      try {
        setSending(true);
        if (route.params.type === 'wifi') {
          const fineLocationPermision = await checkFineLocationPermission(true);
          if (!fineLocationPermision) {
            return;
          }
          try {
            const currentSSID = await WifiManager.getCurrentWifiSSID();
            if (currentSSID === data.wiFi) {
              await goToUrlPortal();
              return;
            }
          } catch (error) {}
        }
        const response = await checkDeviceStatus({
          serialNumber: data.serialNumber,
        });
        if (
          response.ok &&
          response.data?.validId !== undefined &&
          response.data?.isOnline !== undefined &&
          response.data?.isRegister !== undefined
        ) {
          if (!response.data?.validId) {
            alert(t('scan_qr.invalid_serial_number'));
            return;
          }

          if (route.params.type === 'wifi') {
            await onReadWifi(data, response.data);
          } else {
            await onReadRegister(data, response.data);
          }
        } else if (
          response.problem === 'CONNECTION_ERROR' ||
          response.problem === 'NETWORK_ERROR'
        ) {
          alert(t('alert.error.network'));
        } else {
          alert(t('alert.error.default'));
        }
      } catch (error) {
      } finally {
        setSending(false);
      }
    } catch (error) {
      alert(t('scan_qr.invalid'));
    }
  };

  return (
    <View style={[AppStyles.flex1, AppStyles.justifyCenter]}>
      {cameraPermission ? (
        <View style={AppStyles.itemCenter}>
          <View
            style={[
              {width: responsiveScreenWidth(80)},
              AppStyles.ratio1,
              AppStyles.selfCenter,
              AppStyles.overflowHidden,
            ]}>
            <QRCodeScanner
              ref={ref}
              cameraStyle={AppStyles.full}
              onRead={onRead}
            />
          </View>
          <Text
            style={[
              AppStyles.textCenter,
              AppStyles.textLarge,
              AppStyles.marginTop,
              {marginHorizontal: responsiveWidth(10)},
            ]}>
            {route.params.type === 'wifi'
              ? t('scan_qr.wifi_content')
              : t('scan_qr.register_content')}
          </Text>
        </View>
      ) : cameraPermission === false ? (
        <View style={[AppStyles.fullCenter, AppStyles.padding]}>
          <Text style={[AppStyles.textCenter, AppStyles.marginBottom]}>
            {t('scan_qr.no_camera_permission')}
          </Text>
          <Button onPress={openSettings}>{t('button.open_settings')}</Button>
        </View>
      ) : null}
      <LoadingModal isVisible={sending} />
    </View>
  );
}
