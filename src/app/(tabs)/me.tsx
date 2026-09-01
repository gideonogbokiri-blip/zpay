import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useKyc, useNotifications } from '@/hooks/queries';
import { useSecurityPreferences } from '@/state/security';
import { IconSize, Radii, Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function MeScreen() {
  const colors = useTheme();
  const { user, signOut } = useAuth();
  const recordSecurityEvent = useSecurityPreferences((state) => state.recordSecurityEvent);
  const { data: kyc } = useKyc();
  const { data: notifications } = useNotifications();
  const unread = notifications?.filter((n) => !n.readAt).length ?? 0;

  const confirmLogout = () => {
    Alert.alert('Log out?', 'You will need to log in again to use ZPAY.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          recordSecurityEvent({
            type: 'logout',
            title: 'Logged out',
            detail: user?.email,
          });
          signOut();
        },
      },
    ]);
  };

  return (
    <Screen title="Me" subtitle="Account and settings">
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Icon name="person" size={IconSize.xxl} color={colors.accent} />
        </View>
        <Text variant="heading">{user?.fullName}</Text>
        <Text variant="small" color="textSecondary">
          {user?.phone}
        </Text>
        <View style={[styles.tier, { backgroundColor: colors.accentSoft }]}>
          <Text variant="caption" style={{ color: colors.accent }}>
            {kyc?.tier === 'verified' ? 'Verified' : kyc?.tier === 'basic' ? 'Basic tier' : 'Unverified'}
          </Text>
        </View>
      </View>

      <View style={styles.menu}>
        <MenuItem icon="person-outline" label="Profile" onPress={() => router.push('/me/profile')} />
        <MenuItem icon="shield-checkmark-outline" label="KYC" onPress={() => router.push('/me/kyc')} />
        <MenuItem icon="lock-closed-outline" label="Security" onPress={() => router.push('/me/security')} />
        <MenuItem icon="keypad-outline" label="PIN" onPress={() => router.push('/me/pin')} />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          badge={unread > 0 ? String(unread) : undefined}
          onPress={() => router.push('/notifications')}
        />
        <MenuItem icon="chatbubble-ellipses-outline" label="Support" onPress={() => router.push('/support')} />
        <MenuItem icon="settings-outline" label="Settings" onPress={() => router.push('/me/settings')} />
      </View>

      <Pressable
        onPress={confirmLogout}
        accessibilityRole="button"
        style={({ pressed }) => [styles.logout, { backgroundColor: colors.dangerSoft }, pressed && styles.pressed]}>
        <Icon name="log-out-outline" size={IconSize.md} color={colors.danger} />
        <Text variant="bodyBold" style={{ color: colors.danger }}>
          Log out
        </Text>
      </Pressable>
    </Screen>
  );
}

interface MenuItemProps {
  icon: IconName;
  label: string;
  badge?: string;
  onPress: () => void;
}

function MenuItem({ icon, label, badge, onPress }: MenuItemProps) {
  const colors = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.menuItem, { borderBottomColor: colors.border }, pressed && styles.pressed]}>
      <View style={styles.menuLeft}>
        <View style={[styles.menuIcon, { backgroundColor: 'rgba(128,128,128,0.12)' }]}>
          <Icon name={icon} size={IconSize.md} color={colors.text} />
        </View>
        <Text variant="body">{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: colors.danger }]}>
            <Text variant="caption" style={{ color: '#FFFFFF' }}>
              {badge}
            </Text>
          </View>
        ) : null}
        <Icon name="chevron-forward" size={IconSize.sm} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(0,229,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  tier: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.full,
    marginTop: Spacing.xs,
  },
  menu: {
    marginTop: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    width: IconSize.xxl,
    height: IconSize.xxl,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: Radii.md,
    marginTop: Spacing.xxxl,
  },
  pressed: {
    opacity: 0.7,
  },
});
