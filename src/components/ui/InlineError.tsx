import { Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';
import { Text } from './Text';
import { View } from './View';

export interface InlineErrorProps {
  message?: string | null;
}

export function InlineError({ message }: InlineErrorProps) {
  const colors = useTheme();
  if (!message) {
    return null;
  }
  return (
    <View style={{ backgroundColor: colors.dangerSoft, borderRadius: Radii.md, padding: Spacing.md }}>
      <Text variant="small" color="danger">
        {message}
      </Text>
    </View>
  );
}