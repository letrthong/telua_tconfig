import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Gap, IconSizes} from 'utils';
import AppStyles, {getRounedStyle} from 'utils/styles';
import {Colors} from 'utils/themes';
import type {FC, ReactNode} from 'react';
import type {ViewProps} from 'react-native';
import type {SvgProps} from 'react-native-svg';

type Props = {
  data: {
    Icon?: FC<SvgProps>;
    color?: string;
    backdrop?: boolean;
    size?: 'medium' | 'large';
    iconSize?: 'medium' | 'large';
    CustomIcon?: ReactNode;
    onPress?: () => void;
  }[];
  style?: ViewProps['style'];
};

export default function HeaderRight({data, style}: Props) {
  return (
    <View style={[AppStyles.row, {gap: Gap / 2}, style]}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          disabled={!item.onPress}
          style={[
            !!item.Icon &&
              getRounedStyle(
                item.size === 'large' ? IconSizes.veryLarge : IconSizes.large,
              ),
            AppStyles.center,
            item.backdrop && AppStyles.backgroundPrimaryLight,
          ]}
          onPress={item.onPress}>
          {item.CustomIcon ? (
            item.CustomIcon
          ) : item.Icon ? (
            <item.Icon
              color={item.color || Colors.secondary}
              height={
                item.iconSize === 'large' ? IconSizes.large : IconSizes.medium
              }
              width={
                item.iconSize === 'large' ? IconSizes.large : IconSizes.medium
              }
            />
          ) : null}
        </TouchableOpacity>
      ))}
    </View>
  );
}
