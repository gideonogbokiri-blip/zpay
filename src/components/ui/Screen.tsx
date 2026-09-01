import { router } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { ThemeProvider, useTheme, type ThemeVariant } from '@/theme';
import { IconSize, MaxContentWidth, Radii, Spacing } from '@/theme/tokens';
import { Text } from './Text';
import { View } from './View';

export interface ScreenProps extends PropsWithChildren {
  variant?: ThemeVariant;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  scroll?: boolean;
  back?: boolean;
  contentStyle?: ViewStyle;
}

export function Screen({
  variant = 'dark',
  title,
  subtitle,
  headerRight,
  scroll = true,
  back = false,
  contentStyle,
  children,
}: ScreenProps) {
  return (
    <ThemeProvider variant={variant}>
      <ScreenInner
        title={title}
        subtitle={subtitle}
        headerRight={headerRight}
        scroll={scroll}
        back={back}
        contentStyle={contentStyle}>
        {children}
      </ScreenInner>
    </ThemeProvider>
  );
}

function ScreenInner({
  title,
  subtitle,
  headerRight,
  scroll,
  back,
  contentStyle,
  children,
}: Omit<ScreenProps, 'variant'>) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.screen, contentStyle]}>
        {title ? (
          <View style={[styles.header, { paddingTop: insets.top > 0 ? Spacing.sm : Spacing.xl }]}>
            {back ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={Spacing.md}
                onPress={() => router.back()}
                style={styles.backButton}>
                <BackIcon />
              </Pressable>
            ) : null}
            <View style={styles.headerText}>
              <Text variant="title">{title}</Text>
              {subtitle ? (
                <Text variant="small" color="textSecondary">
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {headerRight}
          </View>
        ) : null}
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, styles.content]}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
}

function BackIcon() {
  const colors = useTheme();
  return <Icon name="chevron-back" size={IconSize.lg} color={colors.text} />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  backButton: {
    width: IconSize.xxl,
    height: IconSize.xxl,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.12)',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
});
