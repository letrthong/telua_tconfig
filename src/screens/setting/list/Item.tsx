import ArrowRight from 'assets/svgs/arrow-right.svg';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {DefaultIconProps, Gap} from 'utils';
import AppStyles from 'utils/styles';
import {Colors} from 'utils/themes';
import type {SvgProps} from 'react-native-svg';
import {Text} from '@rneui/themed';

type Props = {
  Icon: React.FC<SvgProps>;
  title: string;
  onPress?: () => void;
};

export default function Item({Icon, title, onPress}: Props) {
  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[
        AppStyles.row,
        AppStyles.itemCenter,
        AppStyles.marginBottomSmall,
        AppStyles.backgroundWhite,
        AppStyles.paddingHorizontal,
        {paddingVertical: Gap * 0.75},
      ]}
      onPress={onPress}>
      <Icon {...DefaultIconProps} color={Colors.primary} />
      <Text
        style={[
          AppStyles.flex1,
          AppStyles.marginHorizontal,
          AppStyles.textGrey2,
          AppStyles.textLarge,
        ]}>
        {title}
      </Text>
      <ArrowRight {...DefaultIconProps} />
    </TouchableOpacity>
  );
}
