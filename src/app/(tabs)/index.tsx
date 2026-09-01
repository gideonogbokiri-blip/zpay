import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ServiceButton } from '@/components/ServiceButton';
import { TransactionRow } from '@/components/TransactionRow';
import { WalletCard } from '@/components/WalletCard';
import { Screen, Text } from '@/components/ui';
import { ACTIVE_SERVICES, SERVICE_META, SERVICE_NAMES } from '@/constants/services';
import { useNotifications, useServices, useTransactions, useWallet } from '@/hooks/queries';
import { useAuth } from '@/hooks/use-auth';
import { formatNaira } from '@/lib/format';
import { useTheme } from '@/theme';
import { IconSize, Radii, Shadow, Spacing } from '@/theme/tokens';

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

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'there';

  return (
    <Screen title={undefined} scroll>
      <View style={styles.header}>
        <View style={styles.brandBlock}>
          <View style={styles.brandRow}>
            <View style={[styles.mark, { backgroundColor: colors.accent }]}>
              <Icon name="card" size={IconSize.sm} color={colors.background} />
            </View>
            <View>
              <Text variant="smallBold" style={styles.brand}>
                ZPAY
              </Text>
              <Text variant="caption" color="textMuted">
                Personal • NGN
              </Text>
            </View>
          </View>
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
              <Text variant="smallBold" style={styles.avatarText}>
                {firstName[0]?.toUpperCase() ?? 'U'}
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.greeting}>
        <View style={styles.greetingLeft}>
          <Text variant="title" style={styles.greetingText}>
            Hi, {firstName}
          </Text>
          <Text variant="small" color="textMuted">
            Make today count
          </Text>
        </View>
        <View style={styles.greetingRight}>
          <View style={styles.starPill}>
            <Icon name="sparkles" size={IconSize.sm} color="#FFB020" />
            <Text variant="caption" color="textSecondary" style={styles.starText}>
              Smart spending
            </Text>
          </View>
        </View>
      </View>

      <WalletCard
        balance={wallet?.balance ?? 0}
        loading={walletLoading}
        onFundPress={() => router.push('/wallet/fund')}
        onHistoryPress={() => router.push('/history')}
        onPress={() => router.push('/wallet/fund')}
      />
      {wallet && !walletLoading ? (
        <View style={styles.balanceNote}>
          <Icon name="wallet-outline" size={IconSize.sm} color={colors.textMuted} />
          <Text variant="caption" color="textMuted">
            Available balance {formatNaira(wallet.balance)}
          </Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="title">Services</Text>
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
          <View style={[styles.emptyCard, Shadow]}>
            <Icon name="receipt-outline" size={IconSize.xl} color={colors.textMuted} />
            <Text variant="small" color="textMuted" style={styles.emptyText}>
              No transactions yet. Pay a bill to get started.
            </Text>
          </View>
        ) : (
          <View style={[styles.card, Shadow]}>
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
  mark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F4FE',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  brand: {
    letterSpacing: 2,
    fontSize: 15,
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
    backgroundColor: 'rgba(0,244,254,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,244,254,0.4)',
  },
  avatarText: {
    color: '#8FF7FF',
  },
  pressed: {
    opacity: 0.7,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  greetingLeft: {
    gap: Spacing.xxs,
  },
  greetingText: {
    fontSize: 24,
    letterSpacing: -0.4,
  },
  greetingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,176,32,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,176,32,0.25)',
  },
  starText: {
    fontWeight: '600',
  },
  balanceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
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
  card: {
    borderRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  emptyCard: {
    borderRadius: 24,
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  emptyText: {
    textAlign: 'center',
  },
});