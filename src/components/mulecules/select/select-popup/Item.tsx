import {Text} from '@rneui/themed';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Gap} from 'utils';
import AppStyles from 'utils/styles';

type Props = {
  item: TSelectPopup;
  onPress: () => void;
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: Gap,
    paddingVertical: Gap,
  },
});

export default function Item({item, onPress}: Props) {
  return (
    <TouchableOpacity
      style={[AppStyles.row, AppStyles.itemCenter, styles.item]}
      onPress={onPress}>
      <Text
        style={[
          AppStyles.flex1,
          AppStyles.textLarge,
          item.selected && [AppStyles.textPrimary],
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
}
