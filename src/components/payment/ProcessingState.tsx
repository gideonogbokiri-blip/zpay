import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Icon } from '../Icon';
import { Text } from '../ui';
import { IconSize, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export interface ProcessingStateProps {
  title?: string;
  message?: string;
  stages?: string[];
}

export function ProcessingState({
  title = 'Processing payment',
  message = 'Processing your payment...',
  stages,
}: ProcessingStateProps) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text variant="heading" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color="textSecondary" style={styles.message}>
        {message}
      </Text>
      {stages && stages.length > 0 ? (
        <View style={styles.stages}>
          {stages.map((stage, index) => (
            <View key={`${stage}-${index}`} style={styles.stageRow}>
              <Icon
                name={index === 0 ? 'ellipse' : 'ellipse-outline'}
                size={IconSize.xs}
                color={index === 0 ? colors.accent : colors.textMuted}
              />
              <Text
                variant="small"
                color={index === 0 ? 'text' : 'textMuted'}
                style={styles.stageText}>
                {stage}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text variant="caption" color="textMuted" style={styles.hint}>
        Do not close the app or press back
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    fontSize: IconSize.lg,
  },
  stages: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    alignSelf: 'stretch',
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stageText: {
    flex: 1,
  },
  hint: {
    textAlign: 'center',
  },
});