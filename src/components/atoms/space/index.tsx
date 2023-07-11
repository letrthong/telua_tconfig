import React from 'react';
import {View} from 'react-native';
import {Gap} from 'utils';

type Props = {
  height?: number;
  width?: number;
};

const Space = ({height = Gap, width}: Props) => {
  return <View style={{height, width}} />;
};

export default Space;
