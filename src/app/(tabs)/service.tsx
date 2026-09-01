import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ServiceButton } from '@/components/ServiceButton';
import { Screen, Text } from '@/components/ui';
import { ACTIVE_SERVICES, SERVICE_META, SERVICE_NAMES } from '@/constants/services';
import { useNotifications, useServices } from '@/hooks/queries';
import { IconSize, Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function ServiceScreen() {
  const colors = useTheme();
  const { data: services } = useServices();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.readAt).length ?? 0;
  const serviceOrder = services?.map((s) => s.type) ?? ACTIVE_SERVICES;

  return (
    <Screen title={undefined} scroll>
      <View style={styles.header}>
        <Text variant="title" style={styles.brand}>
          ZPAY
        </Text>
        <Link href="/notifications" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <Icon name="notifications-outline" size={IconSize.lg} color={colors.text} />
            {unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
          </Pressable>
        </Link>
      </View>

      <Text variant="heading" style={styles.title}>
        Service
      </Text>
      <Text variant="small" color="textSecondary" style={styles.subtitle}>
        Select a service to continue
      </Text>

      <View style={styles.grid}>
        {serviceOrder.map((type, index) => {
          const isLastOdd = index === serviceOrder.length - 1 && serviceOrder.length % 2 === 1;
          const content = (
            <ServiceButton
              icon={SERVICE_META[type].icon}
              label={SERVICE_NAMES[type]}
              color={SERVICE_META[type].color}
              onPress={() => router.push(`/services/${type.toLowerCase()}`)}
            />
          );
          return (
            <View key={type} style={[styles.gridItem, isLastOdd && styles.gridItemFull]}>
              {content}
            </View>
          );
        })}
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
  brand: {
    letterSpacing: 2,
  },
  iconButton: {
    width: IconSize.xxl,
    height: IconSize.xxl,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
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
    backgroundColor: '#ff4d6a',
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    marginTop: Spacing.lg,
  },
  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: Spacing.xl,
  },
  gridItem: {
    width: '50%',
    alignItems: 'center',
  },
  gridItemFull: {
    width: '100%',
    alignItems: 'center',
  },
});