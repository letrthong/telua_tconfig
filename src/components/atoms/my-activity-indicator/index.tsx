import React from 'react';
import {ActivityIndicator} from 'react-native';
import AppStyles from 'utils/styles';
import {Colors} from 'utils/themes';
import type {ActivityIndicatorProps} from 'react-native';

export default function MyActivityIndicator({
  style,
  ...props
}: ActivityIndicatorProps) {
  return (
    <ActivityIndicator
      color={Colors.primary}
      {...props}
      style={[AppStyles.padding, style]}
    />
  );
}
