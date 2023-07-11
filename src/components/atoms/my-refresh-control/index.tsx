import React from 'react';
import {RefreshControl} from 'react-native';
import {Colors} from 'utils/themes';
import type {RefreshControlProps} from 'react-native';

export default function MyRefreshControl(props: RefreshControlProps) {
  return (
    <RefreshControl
      colors={[Colors.primary]}
      tintColor={Colors.primary}
      {...props}
    />
  );
}
