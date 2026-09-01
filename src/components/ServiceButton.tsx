import { Pressable, StyleSheet, View } from 'react-native';

import { TouchTarget } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './ui';

export interface ServiceButtonProps {
  icon: IconName;
  label: string;
  color: string;
  onPress?: () => void;
  layout?: 'grid' | 'home';
}

export function ServiceButton({ icon, label, color, onPress, layout = 'grid' }: ServiceButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={24} color="#ffffff" />
      </View>
      <Text variant="caption" numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: TouchTarget.large,
    flex: 1,
    maxWidth: 96,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151e28',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  label: {
    textAlign: 'center',
    color: '#8b9aab',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});