import {Overlay} from '@rneui/themed';
import React from 'react';
import {Pressable, TouchableWithoutFeedback, View} from 'react-native';
import {
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import AppStyles from 'utils/styles';
import type {OverlayProps} from '@rneui/themed';

type Props = OverlayProps & {
  isBottom?: boolean;
  dismissable?: boolean;
};

export default function MyModal({
  children,
  isBottom,
  dismissable = true,
  ...props
}: Props) {
  return (
    <Overlay
      onBackdropPress={dismissable ? props.onDismiss : undefined}
      {...props}>
      <TouchableWithoutFeedback
        onPress={dismissable ? props.onDismiss : undefined}>
        <View
          style={[
            {
              width: responsiveScreenWidth(100),
              height: responsiveHeight(100),
            },
            AppStyles.justifyCenter,
            isBottom && AppStyles.justifyEnd,
          ]}>
          <Pressable
            style={
              isBottom && [
                {
                  maxHeight: responsiveHeight(80),
                },
                AppStyles.backgroundWhite,
              ]
            }>
            {children}
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Overlay>
  );
}
