import {Text} from '@rneui/themed';
import React from 'react';
import {View} from 'react-native';
import AppStyles from 'utils/styles';

type Props = {
  error?: string;
};

export default function Error({error}: Props) {
  if (!error) {
    return null;
  }

  return (
    <View
      style={[
        AppStyles.row,
        AppStyles.itemCenter,
        AppStyles.marginTopSmall,
        AppStyles.marginHorizontal,
      ]}>
      <Text
        style={[
          AppStyles.textSmall,
          AppStyles.textError,
          AppStyles.flex1,
          AppStyles.marginLeftSmall,
        ]}>
        {error}
      </Text>
    </View>
  );
}
