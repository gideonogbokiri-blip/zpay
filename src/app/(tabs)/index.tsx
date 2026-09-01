import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ServiceButton } from '@/components/ServiceButton';
import { TransactionRow } from '@/components/TransactionRow';
import { WalletCard } from '@/components/WalletCard';
import { ZpayMark } from '@/components/ZpayMark';
import { Screen, Text } from '@/components/ui';
import { ACTIVE_SERVICES, SERVICE_META, SERVICE_NAMES } from '@/constants/services';
import { useNotifications, useServices, useTransactions, useWallet } from '@/hooks/queries';
import { useAuth } from '@/hooks/use-auth';
import { formatNaira } from '@/lib/format';
import { useTheme } from '@/theme';
import { IconSize, Radii, Spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const colors = useTheme();
  const { user } = useAuth();
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: services } = useServices();
  const { data: transactions } = useTransactions({ service: 'ALL', status: 'ALL' });

  const serviceOrder = services?.map((s) => s.type) ?? ACTIVE_SERVICES;
  const recent = transactions?.items.slice(0, 5) ?? [];
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.readAt).length ?? 0;

  return (
    <Screen title={undefined} scroll>
      <View style={styles.header}>
        <View style={styles.brandBlock}>
          <View style={styles.brandRow}>
            <ZpayMark size={34} />
            <Text variant="title" style={styles.brand}>
              ZPAY
            </Text>
          </View>
          <Text variant="caption" color="textMuted">
            {user?.fullName ? `Hi, ${user.fullName.split(' ')[0]}` : 'Welcome back'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Link href="/notifications" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Icon name="notifications-outline" size={IconSize.lg} color={colors.text} />
              {unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
            </Pressable>
          </Link>
          <Link href="/me" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Profile"
              style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}>
              <Icon name="person" size={IconSize.md} color={colors.accent} />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.heroPanel}>
        <View style={styles.heroBadge}>
          <Text variant="smallBold" color="textSecondary">
            Smart spending
          </Text>
        </View>
        <Text variant="heading" style={styles.heroTitle}>
          Your money, in motion.
        </Text>
        <Text variant="small" color="textMuted">
          Track bills, move funds, and stay ahead of every payment.
        </Text>
      </View>

      <WalletCard
        balance={wallet?.balance ?? 0}
        loading={walletLoading}
        onFundPress={() => router.push('/wallet/fund')}
        onHistoryPress={() => router.push('/history')}
        onPress={() => router.push('/wallet/fund')}
      />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="title">Quick services</Text>
          <Link href="/service" asChild>
            <Pressable accessibilityRole="button">
              <Text variant="smallBold" color="accent">
                See all
              </Text>
            </Pressable>
          </Link>
        </View>
        <View style={styles.grid}>
          {serviceOrder.map((type) => (
            <ServiceButton
              key={type}
              icon={SERVICE_META[type].icon}
              label={SERVICE_NAMES[type]}
              color={SERVICE_META[type].color}
              layout="home"
              onPress={() => router.push(`/services/${type.toLowerCase()}`)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="title">Recent transactions</Text>
          <Link href="/history" asChild>
            <Pressable accessibilityRole="button">
              <Text variant="smallBold" color="accent">
                View all
              </Text>
            </Pressable>
          </Link>
        </View>
        {recent.length === 0 ? (
          <Text variant="small" color="textMuted" style={styles.empty}>
            No transactions yet. Pay a bill to get started.
          </Text>
        ) : (
          <View style={styles.list}>
            {recent.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onPress={() => router.push(`/tx/${tx.id}`)}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.placeholderNote}>
        <Text variant="caption" color="textMuted">
          {wallet ? `Available balance ${formatNaira(wallet.balance)}` : ' '}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  brandBlock: {
    gap: Spacing.xxs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brand: {
    letterSpacing: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: IconSize.xxl,
    height: IconSize.xxl,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(128,128,128,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF453A',
  },
  avatar: {
    width: IconSize.xxl,
    height: IconSize.xxl,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(0,244,254,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  heroPanel: {
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(0,244,254,0.08)',
  },
  heroTitle: {
    maxWidth: 250,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  section: {
    marginTop: Spacing.xxl,
    gap: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.xl,
    columnGap: Spacing.md,
    justifyContent: 'space-between',
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  empty: {
    paddingVertical: Spacing.md,
  },
  placeholderNote: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
});
