import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';
import { themeStyles } from '../../theme/style';

interface textInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const TextInput: React.FC<textInputProps> = ({
  value,
  onChangeText,
  placeholder,
  style,
  ...props
}) => {
  return (
    <RNTextInput
      placeholder={placeholder}
      style={[themeStyles.input, style]}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#ccc"
      {...props}
    />
  );
};

export default TextInput;
