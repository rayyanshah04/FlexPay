// src/components/ui/Button.tsx
import React from 'react';
import {
  Button as PaperButton,
  ButtonProps as RNPButtonProps,
} from 'react-native-paper';
import { colors } from '../../theme/style';
import { StyleProp, ViewStyle } from 'react-native';

interface AppButtonProps extends RNPButtonProps {
  variant?: 'primary' | 'secondary' | 'white';
}

export const Button: React.FC<AppButtonProps> = ({
  variant = 'primary',
  style,
  contentStyle,
  ...rest
}) => {
  let mode: 'contained' | 'outlined' = 'contained';
  let buttonColor = colors.primary;
  let textColor = colors.white;
  let customStyle: StyleProp<ViewStyle> = {};

  // --- Button Logic ---
  if (variant === 'secondary') {
    mode = 'outlined';
    buttonColor = 'transparent';
    textColor = colors.white;
    customStyle = {
      borderRadius: 999,
      backgroundColor: colors.buttonSecondaryBg,
      borderColor: colors.buttonSecondaryBorder,
      borderWidth: 1,
    };
  }

  // --- White Button Variant ---
  if (variant === 'white') {
    mode = 'contained';
    buttonColor = colors.white;
    textColor = colors.black;
    customStyle = {
      borderRadius: 999,
      backgroundColor: colors.white,
      borderColor: colors.white,
      borderWidth: 1,
    };
  }

  return (
    <PaperButton
      mode={mode}
      style={[
        { width: '85%', alignSelf: 'center', borderRadius: 999 },
        customStyle,
        style,
      ]}
      contentStyle={[
        { paddingVertical: 10, borderRadius: 120 },
        contentStyle,
      ]}
      buttonColor={buttonColor}
      textColor={textColor}
      labelStyle={{ fontSize: 18, fontWeight: '600' }}
      {...rest}
    />
  );
};
