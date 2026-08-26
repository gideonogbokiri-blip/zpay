import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Button, Screen, Text } from '@/components/ui';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '@/hooks/queries';
import { formatDateTime } from '@/lib/format';
import { IconSize, Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function NotificationsScreen() {
  const colors = useTheme();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter((n) => !n.readAt).length ?? 0;

  return (
    <Screen
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up'}
      back
      headerRight={
        unreadCount > 0 ? (
          <Button
            label="Mark all read"
            variant="ghost"
            fullWidth={false}
            onPress={() => markAllRead.mutate()}
          />
        ) : undefined
      }>
      {isLoading ? (
        <Text variant="small" color="textMuted" style={styles.empty}>
          Loading notifications...
        </Text>
      ) : notifications && notifications.length === 0 ? (
        <Text variant="small" color="textMuted" style={styles.empty}>
          No notifications yet.
        </Text>
      ) : (
        <View style={styles.list}>
          {notifications?.map((notification) => {
            const unread = !notification.readAt;
            return (
              <Pressable
                key={notification.id}
                onPress={() => {
                  if (unread) markRead.mutate(notification.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={notification.title}
                style={({ pressed }) => [
                  styles.row,
                  {
                    backgroundColor: unread ? colors.accentSoft : colors.surface,
                    borderColor: colors.border,
                  },
                  pressed && styles.pressed,
                ]}>
                <View style={styles.rowIcon}>
                  <Icon name={iconFor(notification.type)} size={IconSize.md} color={unread ? colors.accent : colors.textMuted} />
                </View>
                <View style={styles.rowMain}>
                  <Text variant="bodyBold" color={unread ? 'accent' : 'text'}>
                    {notification.title}
                  </Text>
                  <Text variant="small" color="textSecondary" numberOfLines={2}>
                    {notification.message}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {formatDateTime(notification.createdAt)}
                  </Text>
                </View>
                {unread ? <View style={[styles.dot, { backgroundColor: colors.accent }]} /> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

function iconFor(type: string): IconName {
  switch (type) {
    case 'payment':
      return 'card-outline';
    case 'funding':
      return 'wallet-outline';
    case 'registration':
      return 'school-outline';
    case 'service':
      return 'flash-outline';
    default:
      return 'notifications-outline';
  }
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  rowIcon: {
    width: IconSize.xxl,
    height: IconSize.xxl,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(128,128,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowMain: {
    flex: 1,
    gap: Spacing.xxs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: Spacing.sm,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.xxl,
  },
  pressed: {
    opacity: 0.7,
  },
});