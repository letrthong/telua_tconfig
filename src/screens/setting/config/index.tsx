import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {Button, Input} from '@rneui/themed';
import Space from 'components/atoms/space';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useStore, {setSetting} from 'stores';
import {Gap, getInputError, getInputPlacehoder} from 'utils';
import AppStyles from 'utils/styles';
import type {RootStackScreenProps} from 'typings/navigation';

export default function SettingConfigScreen({
  navigation,
}: RootStackScreenProps<'SettingConfig'>) {
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation();
  const {setting} = useStore();
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm<TSetting>({
    defaultValues: {
      ...setting,
    },
  });

  const onSubmit = (data: TSetting) => {
    setSetting({
      prefix: data.prefix.trim(),
      password: data.password,
      url_portal: data.url_portal.trim(),
    });
    showMessage({
      type: 'success',
      message: t('alert.success.update'),
    });
    navigation.goBack();
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        AppStyles.paddingHorizontal,
        AppStyles.paddingTop,
        {paddingBottom: Gap + bottom},
      ]}
      keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="prefix"
        render={({field: {onChange, onBlur, value, ref}}) => (
          <Input
            ref={ref}
            errorMessage={errors.prefix?.message}
            label={t('setting.prefix')}
            placeholder={getInputPlacehoder(t('setting.prefix'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          validate: value =>
            !!value.trim() || getInputError(t('setting.prefix')),
        }}
      />
      <Controller
        control={control}
        name="password"
        render={({field: {onChange, onBlur, value, ref}}) => (
          <Input
            ref={ref}
            errorMessage={errors.password?.message}
            label={t('setting.password')}
            placeholder={getInputPlacehoder(t('setting.password'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          required: getInputError(t('setting.password')),
        }}
      />
      <Controller
        control={control}
        name="url_portal"
        render={({field: {onChange, onBlur, value, ref}}) => (
          <Input
            ref={ref}
            errorMessage={errors.url_portal?.message}
            label={t('setting.url_portal')}
            placeholder={getInputPlacehoder(t('setting.url_portal'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
        rules={{
          validate: value =>
            !!value.trim() || getInputError(t('setting.url_portal')),
        }}
      />
      <Space />
      <Button onPress={handleSubmit(onSubmit)}>{t('button.save')}</Button>
    </KeyboardAwareScrollView>
  );
}
