import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { BorderWidth, FontSize, Radii, Spacing, TouchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { Text } from './Text';
import { View } from './View';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  hint?: string | null;
  right?: React.ReactNode;
}

export function Input({ label, error, hint, right, style, onFocus, onBlur, ...rest }: InputProps) {
  const colors = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.accent : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="label" color="textSecondary" style={styles.label}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.inputShell, { borderColor, backgroundColor: colors.input }]}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {right}
      </View>
      {error ? (
        <Text variant="caption" color="danger" style={styles.feedback}>
          {error}
        </Text>
      ) : hint ? (
        <Text variant="caption" color="textMuted" style={styles.feedback}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },
  label: {
    marginBottom: Spacing.xxs,
  },
  inputShell: {
    minHeight: TouchTarget.standard,
    borderRadius: Radii.md,
    borderWidth: BorderWidth.thin,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    paddingVertical: Spacing.sm,
  },
  feedback: {
    marginTop: Spacing.xxs,
  },
});