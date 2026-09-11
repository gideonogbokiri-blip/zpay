import { Link } from 'expo-router';
import { Image, StyleSheet, View as RNView } from 'react-native';

import { ZpayMark } from '@/components/ZpayMark';
import { Button, Screen, Text, View } from '@/components/ui';
import { Spacing } from '@/theme/tokens';

export default function WelcomeScreen() {
  return (
    <Screen title={undefined} scroll={false} contentStyle={styles.content}>
      {/* Hero section with gradient background */}
      <RNView style={styles.heroGradient} />

      {/* Top brand mark */}
      <View style={styles.topBrand}>
        <ZpayMark size={40} />
        <Text style={styles.brandName}>ZPAY</Text>
      </View>

      {/* Central hero area */}
      <View style={styles.heroArea}>
        {/* Hero text */}
        <View style={styles.heroText}>
          <Text variant="display" style={styles.headline}>
            Your Money,{`\n`}Your Way.
          </Text>
          <Text variant="body" color="textSecondary" style={styles.tagline}>
            Pay bills, buy airtime and register{`\n`}for exams — all in one place.
          </Text>

          {/* Trust badges */}
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeDot}>●</Text>
              <Text style={styles.badgeText}>Secure Payments</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeDot}>●</Text>
              <Text style={styles.badgeText}>Instant Transfer</Text>
            </View>
          </View>
        </View>

        {/* Professional woman image */}
        <Image
          source={require('../../../assets/images/woman-hero.jpg')}
          style={styles.heroImage}
          resizeMode="contain"
          accessibilityLabel="Professional woman using ZPAY app"
        />
      </View>

      {/* Accent line */}
      <View style={styles.accentLine} />

      {/* CTA Buttons */}
      <View style={styles.actions}>
        <Link href="/login" asChild>
          <Button label="Log in to your account" />
        </Link>
        <Link href="/signup" asChild>
          <Button label="Create a free account" variant="secondary" />
        </Link>
        <Text variant="caption" color="textMuted" style={styles.terms}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: 'relative',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0f14',
  },
  topBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#ffffff',
  },
  heroArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
  },
  heroText: {
    flex: 1,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  headline: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  tagline: {
    lineHeight: 22,
    fontSize: 13,
    color: '#8b9aab',
  },
  badges: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeDot: {
    color: '#00e5ff',
    fontSize: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#8b9aab',
    fontWeight: '500',
  },
  heroImage: {
    width: 170,
    height: 230,
    marginBottom: -4,
  },
  accentLine: {
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  actions: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  terms: {
    textAlign: 'center',
    marginTop: Spacing.xs,
    fontSize: 11,
  },
});
