import MyActivityIndicator from 'components/atoms/my-activity-indicator';
import React from 'react';
import {View} from 'react-native';
import AppStyles from 'utils/styles';
import type {ViewProps} from 'react-native';

type Props = {
  style?: ViewProps['style'];
};

export default function LoadingView({style}: Props) {
  return (
    <View
      style={[
        AppStyles.fullAbsolute,
        AppStyles.center,
        AppStyles.backdrop,
        style,
      ]}>
      <MyActivityIndicator size="large" />
    </View>
  );
}
