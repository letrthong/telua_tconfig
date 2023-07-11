import {Input} from '@rneui/themed';
import React, {forwardRef, useEffect, useState} from 'react';
import type {InputProps} from '@rneui/themed';

type Props = Omit<InputProps, 'value' | 'onChangeText'> & {
  value: number;
  maxValue?: number;
  type?: 'int' | 'float';
  maxDigitsAfterDot?: number;
  toggleForceSetValue?: boolean;
  onChangeText: (value: number) => void;
};

const NumberTextInput = forwardRef(
  (
    {
      value,
      maxValue,
      type = 'int',
      toggleForceSetValue,
      maxDigitsAfterDot,
      onChangeText,
      ...props
    }: Props,
    ref,
  ) => {
    const [_value, _setValue] = useState(`${value}`);

    useEffect(() => {
      if (toggleForceSetValue !== undefined) {
        _setValue(`${value}`);
      }
    }, [toggleForceSetValue]);

    const _onChangeText = (text: string) => {
      if (text === '' || text === '0') {
        _setValue('0');
        onChangeText(0);
        return;
      }
      if (type === 'int') {
        text = text.trim().replace(/^0/, '');
        if (
          new RegExp(/^([0-9]+)$/).test(text) &&
          (!maxValue || parseInt(text, 10) <= maxValue)
        ) {
          _setValue(text);
          onChangeText(parseInt(text, 10) || 0);
        }
      } else {
        text = text
          .trim()
          .replace(/^0/, '')
          .replace(/,/, '.')
          .replace(/^\./, '0.');
        if (
          new RegExp(/^([0-9]+(\.[0-9]*)?|\.[0-9]+)$/).test(text) &&
          (!maxValue || parseFloat(text) <= maxValue)
        ) {
          if (maxDigitsAfterDot && maxDigitsAfterDot >= 0) {
            const parts = text.split('.');
            // TH có số thập phân sau dấu chấm
            if (parts.length === 2) {
              const numbersOfDigitsAfterDot = parts[1].length;
              if (numbersOfDigitsAfterDot <= maxDigitsAfterDot) {
                _setValue(text);
                onChangeText(parseFloat(text) || 0);
              }
            } else {
              _setValue(text);
              onChangeText(parseFloat(text) || 0);
            }
          } else {
            _setValue(text);
            onChangeText(parseFloat(text) || 0);
          }
        }
      }
    };

    return (
      <Input
        keyboardType="decimal-pad"
        textAlign="center"
        value={`${_value}`}
        onChangeText={_onChangeText}
        {...props}
        // @ts-ignore
        ref={ref}
      />
    );
  },
);

export default NumberTextInput;
