import {Text} from '@rneui/themed';
import React from 'react';
import {useTranslation} from 'react-i18next';
import AppStyles from 'utils/styles';

type Props = {
  children?: string;
};

export default function Empty({children}: Props) {
  const {t} = useTranslation();

  return (
    <Text style={[AppStyles.padding, AppStyles.textCenter]}>
      {children || t('alert.info.no_data')}
    </Text>
  );
}
