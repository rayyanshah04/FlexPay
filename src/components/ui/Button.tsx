// src/components/ui/Button.tsx
import React from 'react';
import {
  Button as PaperButton,
  ButtonProps as RNPButtonProps,
} from 'react-native-paper';
import { colors } from '../../theme/style';
import { StyleProp, ViewStyle } from 'react-native';

interface AppButtonProps extends RNPButtonProps {
  // We will define 'primary' and 'secondary' as our main variants
  variant?: 'primary' | 'secondary';
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
    // This is our "Frosted Glass" button
    mode = 'outlined'; // Use outlined to remove Paper's default bg
    buttonColor = 'transparent'; // We set bg color in the style override
    textColor = colors.white;
    customStyle = {
      borderRadius: 999,
      backgroundColor: colors.buttonSecondaryBg,
      borderColor: colors.buttonSecondaryBorder,
      borderWidth: 1,
    };
  }
  // All other cases default to 'primary' (solid pink)

  return (
    <PaperButton
      mode={mode}
      style={[
        { width: '85%', alignSelf: 'center', borderRadius: 999 }, // Universal size and centering
        customStyle, // Apply our custom frosted glass style
        style,
      ]}
      contentStyle={[
        {
          paddingVertical: 10,
          borderRadius: 120,
        },
        contentStyle,
      ]}
      buttonColor={buttonColor}
      textColor={textColor}
      labelStyle={{ fontSize: 18, fontWeight: '600' }} // Match mock
      {...rest}
    />
  );
};
