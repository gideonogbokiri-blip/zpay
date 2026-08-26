import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { BorderWidth, Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { Text } from './Text';

export interface PinInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  label?: string;
  autoFocus?: boolean;
}

export function PinInput({
  length,
  value,
  onChange,
  error,
  label,
  autoFocus = true,
}: PinInputProps) {
  const colors = useTheme();
  const ref = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const handlePress = () => ref.current?.focus();
  const handleChange = (text: string) => {
    onChange(text.replace(/\D/g, '').slice(0, length));
  };

  const boxes = Array.from({ length }, (_, index) => {
    const filled = index < value.length;
    const current = focused && index === value.length;
    return (
      <View
        key={index}
        style={[
          styles.box,
          {
            borderColor: error ? colors.danger : current ? colors.accent : colors.border,
            backgroundColor: colors.input,
          },
        ]}>
        <Text variant="title" style={{ color: filled ? colors.text : 'transparent' }}>
          {filled ? '\u2022' : ' '}
        </Text>
      </View>
    );
  });

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="label" color="textSecondary">
          {label}
        </Text>
      ) : null}
      <Pressable style={styles.row} onPress={handlePress} accessibilityLabel={label ?? 'Code entry'}>
        {boxes}
      </Pressable>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        textContentType="oneTimeCode"
        testID="pin-input"
        style={styles.hiddenInput}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  box: {
    width: 52,
    height: 60,
    borderRadius: Radii.md,
    borderWidth: BorderWidth.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});