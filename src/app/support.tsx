import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Screen, Text } from '@/components/ui';
import { copyToClipboard } from '@/lib/clipboard';
import { formatDateTime } from '@/lib/format';
import { type SupportTicket, useSupportStore } from '@/state/support';
import { IconSize, Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function SupportScreen() {
  const colors = useTheme();
  const tickets = useSupportStore((state) => state.tickets);

  return (
    <Screen title="Support" subtitle="Help and transaction reports" back>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
          <Icon name="chatbubble-ellipses-outline" size={IconSize.xl} color={colors.accent} />
        </View>
        <View style={styles.headerText}>
          <Text variant="bodyBold">We keep every issue tied to a traceable ticket.</Text>
          <Text variant="small" color="textSecondary">
            Report from a transaction detail page so support has the reference, amount, and service context.
          </Text>
        </View>
      </View>

      {tickets.length === 0 ? (
        <View style={[styles.empty, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text variant="bodyBold">No support tickets yet</Text>
          <Text variant="small" color="textSecondary" style={styles.centerText}>
            When a payment needs attention, open it from History and create a report.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </View>
      )}
    </Screen>
  );
}

function TicketItem({ ticket }: { ticket: SupportTicket }) {
  const colors = useTheme();

  const copyReference = async () => {
    await copyToClipboard(ticket.reference);
    Alert.alert('Ticket reference copied', ticket.reference);
  };

  return (
    <View style={[styles.ticket, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.ticketTop}>
        <View style={styles.ticketTitle}>
          <Text variant="bodyBold">{ticket.title}</Text>
          <Text variant="caption" color="textMuted">
            {formatDateTime(ticket.createdAt)}
          </Text>
        </View>
        <StatusBadge status={ticket.status} />
      </View>

      <View style={styles.meta}>
        <Text variant="small" color="textSecondary">
          Ticket: {ticket.reference}
        </Text>
        {ticket.transactionReference ? (
          <Text variant="small" color="textSecondary">
            Transaction: {ticket.transactionReference}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Copy ticket reference"
        onPress={copyReference}
        style={({ pressed }) => [styles.copyRow, pressed && styles.pressed]}>
        <Icon name="copy-outline" size={IconSize.sm} color={colors.accent} />
        <Text variant="small" style={{ color: colors.accent }}>
          Copy reference
        </Text>
      </Pressable>
    </View>
  );
}

function StatusBadge({ status }: { status: SupportTicket['status'] }) {
  const colors = useTheme();
  const label = status === 'in_review' ? 'In review' : status === 'resolved' ? 'Resolved' : 'Open';
  const backgroundColor =
    status === 'resolved' ? colors.successSoft : status === 'in_review' ? colors.accentSoft : 'rgba(255,176,32,0.14)';
  const textColor = status === 'resolved' ? colors.success : status === 'in_review' ? colors.accent : colors.warning;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text variant="caption" style={{ color: textColor }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
  },
  centerText: {
    textAlign: 'center',
  },
  list: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  ticket: {
    borderWidth: 1,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  ticketTitle: {
    flex: 1,
    gap: Spacing.xxs,
  },
  meta: {
    gap: Spacing.xs,
  },
  badge: {
    minHeight: 26,
    borderRadius: Radii.full,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    minHeight: 32,
  },
  pressed: {
    opacity: 0.7,
  },
});
