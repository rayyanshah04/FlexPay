import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface HeadingProps extends TextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  style,
  children,
  ...props
}) => {
  const headingStyles = [styles[`h${level}` as keyof typeof styles], style];

  return (
    <Text style={headingStyles} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '700' },
  h2: { fontSize: 28, fontWeight: '600' },
  h3: { fontSize: 22, fontWeight: '500' },
  h4: { fontSize: 18, fontWeight: '500' },
  h5: { fontSize: 16, fontWeight: '400' },
  h6: { fontSize: 14, fontWeight: '400' },
});
