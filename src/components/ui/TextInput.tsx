import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../theme/style';
import HideIcon from '../../assets/icons/hide.svg';
import ShowIcon from '../../assets/icons/show.svg';

interface AppTextInputProps extends TextInputProps {
  isFocused?: boolean;
  isValid?: boolean | null;
  isPassword?: boolean;
  onToggleVisibility?: () => void;
}

export const TextInput: React.FC<AppTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onFocus,
  onBlur,
  isFocused,
  keyboardType,
  autoCapitalize,
  isPassword,
  onToggleVisibility,
  isValid,
  style,
  ...props
}) => {
  const getBorderColor = () => {
    if (isValid === false) {
      return colors.error; // Red for invalid
    }
    if (isFocused) {
      return colors.primary; // Purple for active
    }
    if (isValid === true) {
      return '#00B37E'; // Green for valid and not focused
    }
    return colors.buttonSecondaryBorder; // Default inactive
  };

  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderColor: getBorderColor(),
        },
        style, // Allow overriding styles
      ]}
    >
      <RNTextInput
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={colors.placeholder}
        selectionColor={colors.white}
        cursorColor={colors.white}
        tintColor={colors.white}
        {...props}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={onToggleVisibility}
          style={styles.eyeIcon}
        >
          {secureTextEntry ? (
            <HideIcon width={22} height={22} fill={colors.icon} />
          ) : (
            <ShowIcon width={22} height={22} fill={colors.icon} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '85%', // Standardized width
    alignSelf: 'center', // Standardized centering
    height: 55,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'transparent',
    paddingHorizontal: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.inputText,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
});

export default TextInput;