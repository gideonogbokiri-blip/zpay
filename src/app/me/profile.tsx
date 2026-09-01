import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Screen, Text, View } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/theme';
import { Icon } from '@/components/Icon';
import { Spacing } from '@/theme/tokens';

export default function ProfileScreen() {
  const colors = useTheme();
  const { user, setUser } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setAvatarUri(asset.uri);
      if (user) {
        setUser({ ...user, avatarUrl: asset.uri });
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to take a profile photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setAvatarUri(asset.uri);
      if (user) {
        setUser({ ...user, avatarUrl: asset.uri });
      }
    }
  };

  const showImageOptions = () => {
    Alert.alert('Change profile picture', 'Choose an option', [
      { text: 'Take photo', onPress: takePhoto },
      { text: 'Choose from library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Screen title="Profile" subtitle="Your personal information" back scroll>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: 'rgba(0,229,255,0.12)' }]}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text variant="display" style={{ color: colors.accent }}>
              {user?.fullName.charAt(0).toUpperCase() ?? 'Z'}
            </Text>
          )}
        </View>
        <Pressable
          style={[styles.cameraButton, { backgroundColor: colors.accent }]}
          onPress={showImageOptions}
          accessibilityRole="button"
          accessibilityLabel="Change profile picture">
          <Icon name="camera" size={16} color={colors.background} />
        </Pressable>
      </View>

      <View style={styles.fields}>
        <View style={styles.field}>
          <Text variant="small" color="textSecondary" style={styles.label}>Full name</Text>
          <Text variant="body">{user?.fullName ?? ''}</Text>
        </View>
        <View style={[styles.field, { borderTopColor: 'rgba(255,255,255,0.06)' }]}>
          <Text variant="small" color="textSecondary" style={styles.label}>Phone number</Text>
          <Text variant="body">{user?.phone ?? ''}</Text>
        </View>
        <View style={[styles.field, { borderTopColor: 'rgba(255,255,255,0.06)' }]}>
          <Text variant="small" color="textSecondary" style={styles.label}>Email</Text>
          <Text variant="body">{user?.email ?? ''}</Text>
        </View>
        <View style={[styles.field, { borderTopColor: 'rgba(255,255,255,0.06)' }]}>
          <Text variant="small" color="textSecondary" style={styles.label}>Verification tier</Text>
          <Text variant="body">
            {user?.verificationTier === 'verified'
              ? 'Verified'
              : user?.verificationTier === 'basic'
                ? 'Basic'
                : 'Unverified'}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
    width: 96,
    height: 96,
    alignSelf: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0a0f14',
  },
  fields: {
    gap: 0,
  },
  field: {
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  label: {
    marginBottom: Spacing.xs,
  },
});
