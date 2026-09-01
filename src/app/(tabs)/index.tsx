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
import { useTheme } from '@/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

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
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text variant="smallBold" style={styles.avatarText}>
              {firstName[0]?.toUpperCase() ?? 'U'}
            </Text>
          </View>
          <Text style={styles.logo}>ZPAY</Text>
        </View>
        <Link href="/notifications" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={({ pressed }) => [styles.bell, pressed && styles.pressed]}>
            <Icon name="notifications-outline" size={20} color={colors.text} />
            {unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
          </Pressable>
        </Link>
      </View>

      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>{getGreeting()}, {firstName}</Text>
        <Text style={styles.greetingSubtitle}>Ready to manage your finances today?</Text>
      </View>

      <WalletCard
        balance={wallet?.balance ?? 0}
        loading={walletLoading}
        onFundPress={() => router.push('/wallet/fund')}
        onTransferPress={() => router.push('/history')}
        onPress={() => router.push('/wallet/fund')}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Services</Text>
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
        <View style={styles.txHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Link href="/history" asChild>
            <Pressable accessibilityRole="button">
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </Link>
        </View>
        {recent.length === 0 ? (
          <View style={styles.emptyCard}>
            <Icon name="receipt-outline" size={32} color={colors.textMuted} />
            <Text variant="small" color="textMuted" style={styles.emptyText}>
              No transactions yet. Pay a bill to get started.
            </Text>
          </View>
        ) : (
          <View style={styles.txList}>
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#00e5ff',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#ffffff',
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4d6a',
  },
  pressed: {
    opacity: 0.7,
  },
  greeting: {
    paddingVertical: 12,
    paddingBottom: 20,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#8b9aab',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
    columnGap: 12,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  txHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  seeAll: {
    fontSize: 13,
    color: '#00e5ff',
    fontWeight: '500',
  },
  txList: {
    gap: 12,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#121a23',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  emptyText: {
    textAlign: 'center',
  },
});