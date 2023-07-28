import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {Button, Input} from '@rneui/themed';
import {type AddDeviceBody, addDevice} from 'api/device';
import LoadingModal from 'components/atoms/loading-modal';
import Space from 'components/atoms/space';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Gap, getInputError, getInputPlacehoder} from 'utils';
import AppStyles from 'utils/styles';
import type {RootStackScreenProps} from 'typings/navigation';

type FormData = Pick<AddDeviceBody, 'accountId' | 'pincode'>;

export default function AddDeviceScreen({
  route,
  navigation,
}: RootStackScreenProps<'AddDevice'>) {
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation();
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      accountId: '',
      pincode: '',
    },
  });
  const [sending, setSending] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setSending(true);
      const response = await addDevice({
        serialNumber: route.params.serialNumber,
        accountId: data.accountId.trim(),
        pincode: data.pincode,
      });
      if (response.ok && response.data) {
        if (response.data.returnCode === 3) {
          showMessage({
            type: 'danger',
            message: response.data.returnCodeName,
          });
          return;
        }
        showMessage({
          type: 'success',
          message: t('add_device.success'),
        });
        navigation.goBack();
      } else {
        showMessage({
          type: 'danger',
          message: t('alert.error.default'),
        });
      }
    } catch (error) {
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        AppStyles.paddingHorizontal,
        AppStyles.paddingTop,
        {paddingBottom: Gap + bottom},
      ]}
      keyboardShouldPersistTaps="handled">
      <Input
        disabled
        defaultValue={route.params.serialNumber}
        label={t('add_device.serial_number')}
      />
      <Controller
        control={control}
        name="accountId"
        render={({field: {onChange, onBlur, value, ref}}) => (
          <Input
            ref={ref}
            autoFocus
            errorMessage={errors.accountId?.message}
            label={t('add_device.account_id')}
            placeholder={getInputPlacehoder(t('add_device.account_id'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          validate: value =>
            !!value.trim() || getInputError(t('add_device.account_id')),
        }}
      />
      <Controller
        control={control}
        name="pincode"
        render={({field: {onChange, onBlur, value, ref}}) => (
          <Input
            ref={ref}
            errorMessage={errors.pincode?.message}
            label={t('add_device.pin_code')}
            placeholder={getInputPlacehoder(t('add_device.pin_code'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          required: getInputError(t('add_device.pin_code')),
        }}
      />

      <Space />
      <Button onPress={handleSubmit(onSubmit)}>{t('button.save')}</Button>
      <LoadingModal isVisible={sending} />
    </KeyboardAwareScrollView>
  );
}
