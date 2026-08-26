import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from './Icon';
import { Text } from './ui';
import { IconSize, Radii, Spacing, TouchTarget } from '@/theme/tokens';

export interface ServiceButtonProps {
  icon: IconName;
  label: string;
  color: string;
  onPress?: () => void;
  layout?: 'grid' | 'home';
}

export function ServiceButton({ icon, label, color, onPress, layout = 'grid' }: ServiceButtonProps) {
  const iconSize = layout === 'grid' ? IconSize.xxl : IconSize.xl;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, { backgroundColor: withAlpha(color, 0.18), width: iconSize + Spacing.xxxl, height: iconSize + Spacing.xxxl }]}>
        <Icon name={icon} size={iconSize} color={color} />
      </View>
      <Text variant={layout === 'grid' ? 'small' : 'caption'} numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: TouchTarget.large,
    flex: 1,
    maxWidth: 96,
  },
  iconWrap: {
    borderRadius: Radii.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});