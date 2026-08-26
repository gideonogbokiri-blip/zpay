import { StyleSheet, type ViewProps } from 'react-native';

import { Radii, Shadow, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { View } from './View';

export interface CardProps extends ViewProps {
  elevated?: boolean;
  pressed?: boolean;
}

export function Card({ elevated = false, style, ...rest }: CardProps) {
  const colors = useTheme();
  return (
    <View
      surface={elevated ? 'surfaceElevated' : 'surface'}
      style={[styles.base, { borderColor: colors.border }, elevated && Shadow, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
  },
});