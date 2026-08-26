import { Alert, StyleSheet, View } from 'react-native';

import { StatusBadge } from '@/components/ui';
import { Button, Screen, Text } from '@/components/ui';
import { useKyc } from '@/hooks/queries';
import { Spacing } from '@/theme/tokens';
import { useTheme } from '@/theme';

export default function KycScreen() {
  const colors = useTheme();
  const { data: kyc, isLoading } = useKyc();

  const startVerification = () => {
    Alert.alert(
      'KYC verification',
      'Identity verification is not available in this demo. Your account is already usable.'
    );
  };

  return (
    <Screen title="KYC" subtitle="Identity verification" back scroll>
      {isLoading ? (
        <Text variant="small" color="textMuted">
          Loading...
        </Text>
      ) : (
        <>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
            <View style={styles.row}>
              <Text variant="body" color="textSecondary">
                Current tier
              </Text>
              <StatusBadge
                status={kyc?.tier === 'verified' ? 'success' : kyc?.tier === 'basic' ? 'info' : 'pending'}
                label={kyc?.tier === 'verified' ? 'Verified' : kyc?.tier === 'basic' ? 'Basic' : 'Unverified'}
              />
            </View>
            <View style={styles.row}>
              <Text variant="body" color="textSecondary">
                Status
              </Text>
              <Text variant="bodyBold">{kyc?.status === 'completed' ? 'Completed' : 'Not started'}</Text>
            </View>
          </View>
          <Text variant="small" color="textSecondary" style={styles.info}>
            Completing KYC verification raises your account tier and transaction limits. In this demo your account is
            already usable without verification.
          </Text>
          <Button label="Start verification" onPress={startVerification} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: Spacing.md,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
});