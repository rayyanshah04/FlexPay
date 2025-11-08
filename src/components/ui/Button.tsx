// src/components/ui/Button.tsx
import React from 'react';
import {
  Button as PaperButton,
  ButtonProps as RNPButtonProps,
  useTheme,
} from 'react-native-paper';
import { themeStyles } from '../../theme/style';
import { StyleProp, ViewStyle } from 'react-native';

interface AppButtonProps extends RNPButtonProps {
  // We will define 'primary' and 'secondary' as our main variants
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<AppButtonProps> = ({
  variant = 'primary', // Default to solid pink
  fullWidth = false,
  style,
  contentStyle,
  ...rest
}) => {
  const theme = useTheme();

  let mode: 'contained' | 'outlined' = 'contained';
  let buttonColor = theme.colors.primary;
  let textColor = theme.colors.onPrimary; // White
  let customStyle: StyleProp<ViewStyle> = {};

  // --- Rayyan Theme Button Logic ---
  if (variant === 'secondary') {
    // This is our "Frosted Glass" button
    mode = 'outlined'; // Use outlined to remove Paper's default bg
    buttonColor = 'transparent'; // We set bg color in the style override
    textColor = 'white';
    customStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 1,
    };
  }
  // All other cases default to 'primary' (solid pink)

  return (
    <PaperButton
      mode={mode}
      style={[
        fullWidth && { width: '100%' },
        { borderRadius: 12 }, // Enforce rounded corners
        customStyle, // Apply our custom frosted glass style
        style,
      ]}
      contentStyle={[{ ...themeStyles.button }, contentStyle]}
      buttonColor={buttonColor}
      textColor={textColor}
      labelStyle={{ fontSize: 18, fontWeight: '600' }} // Match mock
      {...rest}
    />
  );
};