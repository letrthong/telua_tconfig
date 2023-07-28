import {useAppState} from '@react-native-community/hooks';
import {Button} from '@rneui/themed';
import {checkDeviceStatus} from 'api/device';
import MyActivityIndicator from 'components/atoms/my-activity-indicator';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Text, View} from 'react-native';
import {openSettings} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {checkCameraPermission} from 'utils/permissions';
import AppStyles from 'utils/styles';
import type {ComponentProps} from 'react';

type TQRCode = {
  serialNumber: string;
  wiFi: string;
  password: string;
};

export default function ScanQRScreen() {
  const {t} = useTranslation();
  const appState = useAppState();
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
    const data = JSON.parse(e.data) as unknown as TQRCode;

    const alert = (message: string) => {
      Alert.alert(t('util.error'), message, [
        {
          text: t('button.ok'),
          onPress: ref.current?.reactivate,
        },
      ]);
    };

    const connectWifi = async () => {};

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
        if (!response.data?.validID) {
          alert(t('scan_qr.invalid_serial_number'));
          return;
        }
        if (response.data.isOnline) {
        } else {
          connectWifi();
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
            Không có quyền truy cập camera
          </Text>
          <Button onPress={openSettings}>{t('button.open_settings')}</Button>
        </View>
      ) : null}
      {sending && (
        <View
          style={[
            AppStyles.fullAbsolute,
            AppStyles.center,
            AppStyles.backdrop,
          ]}>
          <MyActivityIndicator />
        </View>
      )}
    </View>
  );
}
