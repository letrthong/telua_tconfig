import {useAppState} from '@react-native-community/hooks';
import {Button, Text} from '@rneui/themed';
import {checkDeviceStatus} from 'api/device';
import LoadingModal from 'components/atoms/loading-modal';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Linking, View} from 'react-native';
import {openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {SafeAreaView} from 'react-native-safe-area-context';
import WifiManager from 'react-native-wifi-reborn';
import useStore from 'stores';
import {Gap} from 'utils';
import {checkCameraPermission} from 'utils/permissions';
import AppStyles from 'utils/styles';
import type {ComponentProps} from 'react';
import type {RootStackScreenProps} from 'typings/navigation';

type TQRCodeWifi = {
  wiFi: string;
  password: string;
};

type TQRCodeRegister = {
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

  const onReadWifi = async (data: TQRCodeWifi) => {
    const goToUrlPortal = () => {
      setSending(false);
      navigation.goBack();
      Linking.openURL(setting.url_portal);
    };

    try {
      setSending(true);
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
          await WifiManager.connectToProtectedSSID(
            data.wiFi,
            data.password,
            false,
            false,
          );
          canContinue = false;
          goToUrlPortal();
        } catch (error) {
          const e = error as Error & {code?: string};
          if (e?.code === 'userDenied') {
            canContinue = false;
            isSucess = true;
          }
          if (times === maxConnectWifiIntervalTimes - 1) {
            isSucess = false;
          }
        }
        if (!canContinue) {
          break;
        }
        await new Promise(resolve =>
          setTimeout(resolve, connectWifiIntervalTime),
        );
      }
      if (isSucess) {
        ref.current?.reactivate();
      } else {
        alert(t('home.no_match'));
      }
    } catch (error) {
    } finally {
      setSending(false);
    }
  };

  const onReadRegister = async (data: TQRCodeRegister) => {
    try {
      setSending(true);
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

        if (response.data.isOnline) {
          if (response.data.isRegister) {
            alert(t('scan_qr.is_registered'), true);
          } else {
            navigation.replace('AddDevice', {serialNumber: data.serialNumber});
          }
        } else {
          alert(t('scan_qr.device_is_offline'), true);
        }
      } else {
        if (
          response.problem === 'CONNECTION_ERROR' ||
          response.problem === 'NETWORK_ERROR'
        ) {
          alert(t('alert.error.network'));
        } else {
          alert(t('alert.error.default'));
        }
      }
    } catch (error) {
    } finally {
      setSending(false);
    }
  };

  const onRead: ComponentProps<typeof QRCodeScanner>['onRead'] = async e => {
    try {
      const type = e.type as typeof e.type | 'QR_CODE' | 'org.iso.QRCode';
      if (type !== 'QR_CODE' && type !== 'org.iso.QRCode') {
        alert(t('scan_qr.invalid'));
        return;
      }

      if (route.params.type === 'wifi') {
        const data = JSON.parse(e.data) as unknown as TQRCodeWifi;
        if (
          typeof data?.wiFi !== 'string' ||
          typeof data?.password !== 'string'
        ) {
          alert(t('scan_qr.invalid'));
          return;
        }
        onReadWifi(data);
      } else {
        const data = JSON.parse(e.data) as unknown as TQRCodeRegister;
        if (typeof data?.serialNumber !== 'string') {
          alert(t('scan_qr.invalid'));
          return;
        }
        onReadRegister(data);
      }
    } catch (error) {
      alert(t('scan_qr.invalid'));
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={AppStyles.flex1}>
      {cameraPermission ? (
        <>
          <QRCodeScanner ref={ref} onRead={onRead} />
          <Text
            style={[
              AppStyles.margin,
              AppStyles.textCenter,
              AppStyles.textLarge,
              {marginBottom: Gap * 2},
            ]}>
            {t('scan_qr.title')}
          </Text>
        </>
      ) : cameraPermission === false ? (
        <View style={[AppStyles.fullCenter, AppStyles.padding]}>
          <Text style={[AppStyles.textCenter, AppStyles.marginBottom]}>
            {t('scan_qr.no_camera_permission')}
          </Text>
          <Button onPress={openSettings}>{t('button.open_settings')}</Button>
        </View>
      ) : null}
      <LoadingModal isVisible={sending} />
    </SafeAreaView>
  );
}
