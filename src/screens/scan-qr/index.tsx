import {useAppState} from '@react-native-community/hooks';
import {Button} from '@rneui/themed';
import {checkDeviceStatus} from 'api/device';
import LoadingModal from 'components/atoms/loading-modal';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking, Text, View} from 'react-native';
import {openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import WifiManager from 'react-native-wifi-reborn';
import useStore from 'stores';
import {goToUrlPortalDelay} from 'utils';
import {checkCameraPermission} from 'utils/permissions';
import AppStyles from 'utils/styles';
import {connectWifi} from 'utils/wifi';
import type {ComponentProps} from 'react';
import type {RootStackScreenProps} from 'typings/navigation';

type TQRCode = {
  serialNumber: string;
  wiFi: string;
  password: string;
};

const connectWifiIntervalTime = 15 * 1000;
const maxConnectWifiIntervalTimes = 3;

export default function ScanQRScreen({
  navigation,
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

  const onRead: ComponentProps<typeof QRCodeScanner>['onRead'] = async e => {
    const type = e.type as typeof e.type | 'QR_CODE';
    const data = JSON.parse(e.data || '{}') as unknown as TQRCode;

    const alert = (message: string, isInfo = false) => {
      Alert.alert(isInfo ? t('util.info') : t('util.error'), message, [
        {
          text: t('button.ok'),
          onPress: () => ref.current?.reactivate(),
        },
      ]);
    };

    if (
      type !== 'QR_CODE' ||
      typeof data?.serialNumber !== 'string' ||
      typeof data?.wiFi !== 'string' ||
      typeof data?.password !== 'string'
    ) {
      alert(t('scan_qr.invalid'));
      return;
    }

    try {
      setSending(true);
      const response = await checkDeviceStatus({
        serialNumber: data.serialNumber,
      });
      if (
        response.ok &&
        response.data?.validID !== undefined &&
        response.data?.isOnline !== undefined &&
        response.data?.isRegister !== undefined
      ) {
        const goToUrlPortal = () => {
          setSending(false);
          if (response.data?.isRegister) {
            navigation.goBack();
          } else {
            navigation.replace('AddDevice', {serialNumber: data.serialNumber});
          }
          Linking.openURL(setting.url_portal);
        };

        if (!response.data?.validID) {
          alert(t('scan_qr.invalid_serial_number'));
          return;
        }

        if (response.data.isOnline) {
          if (response.data.isRegister) {
            alert(t('scan_qr.device_is_online'), true);
          } else {
            navigation.replace('AddDevice', {serialNumber: data.serialNumber});
          }
          return;
        }

        try {
          const currentSSID = await WifiManager.getCurrentWifiSSID();
          if (currentSSID === data.wiFi) {
            goToUrlPortal();
            return;
          }
        } catch (error) {}

        let isSucess = true;
        for await (const times of Array.from({
          length: maxConnectWifiIntervalTimes,
        }).map((_, i) => i)) {
          let canContinue = true;
          try {
            await connectWifi({
              ssid: data.wiFi,
              password: data.password,
              onSetLoading: setSending,
              onTimeout: () => {
                if (times === maxConnectWifiIntervalTimes - 1) {
                  isSucess = false;
                }
                alert(t('alert.error.default'));
              },
              onSucess: async ssid => {
                canContinue = false;
                if (ssid === data.wiFi) {
                  await new Promise(r => setTimeout(r, goToUrlPortalDelay));
                  goToUrlPortal();
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
          alert(t('alert.error.default'));
        }
      } else {
        alert(t('alert.error.default'));
      }
    } catch (error) {
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={AppStyles.flex1}>
      {cameraPermission ? (
        <QRCodeScanner ref={ref} onRead={onRead} />
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
