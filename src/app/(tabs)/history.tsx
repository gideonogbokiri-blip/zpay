import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FilterChip } from '@/components/FilterChip';
import { TransactionRow } from '@/components/TransactionRow';
import { Screen, Text } from '@/components/ui';
import { ACTIVE_SERVICES, SERVICE_NAMES } from '@/constants/services';
import { useTransactions } from '@/hooks/queries';
import type { ServiceType, Transaction } from '@/lib/api';
import { Spacing } from '@/theme/tokens';

const SERVICE_FILTERS: (ServiceType | 'WALLET' | 'ALL')[] = ['ALL', ...ACTIVE_SERVICES, 'WALLET'];
const STATUS_FILTERS: (Transaction['status'] | 'ALL')[] = ['ALL', 'successful', 'pending', 'failed'];

const SERVICE_LABELS: Record<string, string> = {
  ALL: 'All',
  WALLET: 'Wallet',
  ...SERVICE_NAMES,
};

export default function HistoryScreen() {
  const [service, setService] = useState<ServiceType | 'WALLET' | 'ALL'>('ALL');
  const [status, setStatus] = useState<Transaction['status'] | 'ALL'>('ALL');

  const { data, isLoading } = useTransactions({ service, status });
  const groups = useMemo(() => groupByDate(data?.items ?? []), [data]);

  return (
    <Screen title="History" subtitle="Your payment activity" scroll={false}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <View style={styles.chipRow}>
          {SERVICE_FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={SERVICE_LABELS[filter] ?? filter}
              selected={service === filter}
              onPress={() => setService(filter)}
            />
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <View style={styles.chipRow}>
          {STATUS_FILTERS.map((filter) => (
            <FilterChip
              key={filter}
              label={filter === 'ALL' ? 'All statuses' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              selected={status === filter}
              onPress={() => setStatus(filter)}
            />
          ))}
        </View>
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <Text variant="small" color="textMuted" style={styles.empty}>
            Loading transactions...
          </Text>
        ) : groups.length === 0 ? (
          <Text variant="small" color="textMuted" style={styles.empty}>
            No transactions found for this filter.
          </Text>
        ) : (
          groups.map((group) => (
            <View key={group.label} style={styles.group}>
              <Text variant="label" color="accent">
                {group.label}
              </Text>
              {group.items.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  transaction={tx}
                  onPress={() => router.push(`/tx/${tx.id}`)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

type Group = { label: string; items: Transaction[] };

function groupByDate(items: Transaction[]): Group[] {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const buckets = new Map<string, Transaction[]>();
  for (const tx of items) {
    const date = new Date(tx.createdAt);
    let label: string;
    if (isSameDay(date, today)) label = 'TODAY';
    else if (isSameDay(date, yesterday)) label = 'YESTERDAY';
    else label = date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
    const bucket = buckets.get(label) ?? [];
    bucket.push(tx);
    buckets.set(label, bucket);
  }
  return [...buckets.entries()].map(([label, items]) => ({ label, items }));
}

const styles = StyleSheet.create({
  chipScroll: {
    flexGrow: 0,
    marginHorizontal: -Spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  content: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  group: {
    gap: Spacing.xs,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.xxl,
  },
});