import { StyleSheet, View } from 'react-native';

import { Input, Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function ProfileScreen() {
  const colors = useTheme();
  const { user } = useAuth();

  return (
    <Screen title="Profile" subtitle="Your personal information" back scroll>
      <View style={styles.avatar}>
        <Text variant="display" style={{ color: colors.accent }}>
          {user?.fullName.charAt(0).toUpperCase() ?? 'Z'}
        </Text>
      </View>
      <Input label="Full name" value={user?.fullName ?? ''} editable={false} />
      <Input label="Phone number" value={user?.phone ?? ''} editable={false} />
      <Input label="Email" value={user?.email ?? ''} editable={false} />
      <Input
        label="Verification tier"
        value={user?.verificationTier === 'verified' ? 'Verified' : user?.verificationTier === 'basic' ? 'Basic' : 'Unverified'}
        editable={false}
      />
      <Text variant="caption" color="textMuted" style={styles.note}>
        Profile editing is not available in this demo.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(0,229,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  note: {
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});