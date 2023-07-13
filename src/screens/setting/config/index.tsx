import React from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AppStyles from 'utils/styles';
import {Gap, getInputError, getInputPlacehoder} from 'utils';
import {useForm, Controller} from 'react-hook-form';
import useStore, {setSetting} from 'stores';
import {Button, Input} from '@rneui/themed';
import {useTranslation} from 'react-i18next';
import Space from 'components/atoms/space';
import {showMessage} from 'react-native-flash-message';
import {RootStackScreenProps} from 'typings/navigation';

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
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        AppStyles.paddingHorizontal,
        AppStyles.paddingTop,
        {paddingBottom: Gap + bottom},
      ]}>
      <Controller
        control={control}
        name="prefix"
        render={({field: {onChange, onBlur, value, ref}}) => (
          <Input
            ref={ref}
            errorMessage={errors.prefix?.message}
            placeholder={getInputPlacehoder(t('setting.prefix'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            label={t('setting.prefix')}
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
            placeholder={getInputPlacehoder(t('setting.password'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            label={t('setting.password')}
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
            placeholder={getInputPlacehoder(t('setting.url_portal'))}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            label={t('setting.url_portal')}
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

const styles = StyleSheet.create({});
