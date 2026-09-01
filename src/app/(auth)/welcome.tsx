import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ZpayMark } from '@/components/ZpayMark';
import { Button, Screen, Text, View } from '@/components/ui';
import { Spacing } from '@/theme/tokens';

export default function WelcomeScreen() {
  return (
    <Screen title={undefined} scroll={false} contentStyle={styles.content}>
      <View style={styles.brand}>
        <ZpayMark size={108} />
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
