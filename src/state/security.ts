import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

interface SecurityPreferencesState {
  accountFrozen: boolean;
  biometricsEnabled: boolean;
  recentEvents: SecurityEvent[];
  setAccountFrozen: (value: boolean) => void;
  setBiometricsEnabled: (value: boolean) => void;
  recordSecurityEvent: (event: SecurityEventInput) => void;
}

export type SecurityEventType =
  | 'login'
  | 'otp_login'
  | 'logout'
  | 'biometrics_enabled'
  | 'password_updated'
  | 'pin_created'
  | 'pin_updated'
  | 'account_frozen'
  | 'account_unfrozen';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  title: string;
  createdAt: string;
  detail?: string;
}

export interface SecurityEventInput {
  type: SecurityEventType;
  title: string;
  detail?: string;
}

const securePreferencesStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) =>
    SecureStore.setItemAsync(name, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const useSecurityPreferences = create<SecurityPreferencesState>()(
  persist(
    (set) => ({
      accountFrozen: false,
      biometricsEnabled: false,
      recentEvents: [],
      setAccountFrozen: (value) => set({ accountFrozen: value }),
      setBiometricsEnabled: (value) => set({ biometricsEnabled: value }),
      recordSecurityEvent: (event) =>
        set((state) => ({
          recentEvents: [
            {
              id: `${event.type}_${Date.now()}`,
              createdAt: new Date().toISOString(),
              ...event,
            },
            ...state.recentEvents,
          ].slice(0, 8),
        })),
    }),
    {
      name: 'zpay.security-preferences.v1',
      storage: createJSONStorage(() => securePreferencesStorage),
    }
  )
);
