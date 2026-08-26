import { StyleSheet, View as RNView, type ViewProps } from 'react-native';

import { useTheme } from '@/theme';

export type Surface = 'background' | 'surface' | 'surfaceElevated' | 'input';

export interface ZpayViewProps extends ViewProps {
  surface?: Surface;
}

export function View({ surface = 'background', style, ...rest }: ZpayViewProps) {
  const colors = useTheme();
  return <RNView style={[{ backgroundColor: colors[surface] }, style]} {...rest} />;
}

export function Row({ style, ...rest }: ViewProps) {
  return <RNView style={[styles.row, style]} {...rest} />;
}

export function Center({ style, ...rest }: ViewProps) {
  return <RNView style={[styles.center, style]} {...rest} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});