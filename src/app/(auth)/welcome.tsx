import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Button, Screen, Text, View } from '@/components/ui';
import { IconSize, Spacing } from '@/theme/tokens';

export default function WelcomeScreen() {
  return (
    <Screen title={undefined} scroll={false} contentStyle={styles.content}>
      <View style={styles.brand}>
        <View style={styles.logo} />
        <Text variant="display" style={styles.logoText}>
          ZPAY
        </Text>
        <Text variant="body" color="textSecondary" style={styles.tagline}>
          Pay bills, buy airtime and register for exams in one place.
        </Text>
      </View>

      <View style={styles.actions}>
        <Link href="/login" asChild>
          <Button label="Log in" />
        </Link>
        <Link href="/signup" asChild>
          <Button label="Create account" variant="secondary" />
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
  },
  logo: {
    width: IconSize.xxl * 1.5,
    height: IconSize.xxl * 1.5,
    borderRadius: Spacing.xxl,
    backgroundColor: 'rgba(0, 244, 254, 0.15)',
  },
  logoText: {
    letterSpacing: 4,
  },
  tagline: {
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
});