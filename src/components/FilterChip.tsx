import { Pressable, StyleSheet } from 'react-native';

import { Text } from './ui';
import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function FilterChip({ label, selected = false, onPress }: FilterChipProps) {
  const colors = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.surfaceElevated,
          borderColor: selected ? colors.accent : colors.border,
        },
        pressed && styles.pressed,
      ]}>
      <Text
        variant="small"
        style={{ color: selected ? colors.background : colors.textSecondary, fontWeight: selected ? '600' : '400' }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});