import {Text} from '@rneui/themed';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GapSmall} from 'utils';
import AppStyles from 'utils/styles';

type Props = {
  title?: string;
  TitleComponent?: React.ReactNode;
  HeaderRightComponent?: React.ReactNode;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
});

export default function Header({
  title,
  TitleComponent,
  HeaderRightComponent,
}: Props) {
  return (
    <View
      style={[
        AppStyles.row,
        AppStyles.itemCenter,
        AppStyles.marginHorizontal,
        {marginVertical: GapSmall},
      ]}>
      <View style={AppStyles.flex1}>
        {TitleComponent ? (
          TitleComponent
        ) : (
          <Text
            style={[
              AppStyles.textGrey2,
              AppStyles.textUpperCase,
              AppStyles.textBold,
              styles.title,
            ]}>
            {title}
          </Text>
        )}
      </View>
      {HeaderRightComponent}
    </View>
  );
}
