import {Dialog, Text} from '@rneui/themed';
import Space from 'components/atoms/space';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native';
import AppStyles from 'utils/styles';
import {Colors} from 'utils/themes';
import type {DialogProps} from '@rneui/base';

type Props = DialogProps & {
  text?: string;
};

export default function LoadingModal({overlayStyle, text, ...props}: Props) {
  const {t} = useTranslation();

  return (
    <Dialog
      {...props}
      statusBarTranslucent
      overlayStyle={[AppStyles.backgroundWhite, overlayStyle]}>
      <ActivityIndicator
        color={Colors.primary}
        size="small"
        style={AppStyles.selfCenter}
      />
      <Space />
      <Text style={AppStyles.textCenter}>
        {text || t('alert.info.loading')}
      </Text>
    </Dialog>
  );
}
