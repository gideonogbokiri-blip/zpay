import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { AuthSession, User } from '@/lib/api';

export type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

interface SessionState {
  hydrated: boolean;
  token: string | null;
  user: User | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
  setUser: (user: User) => void;
  setHydrated: (value: boolean) => void;
}

const secureSessionStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) =>
    SecureStore.setItemAsync(name, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

const webSessionStorage: StateStorage = {
  getItem: (name) => Promise.resolve(globalThis.localStorage?.getItem(name) ?? null),
  setItem: (name, value) => {
    globalThis.localStorage?.setItem(name, value);
    return Promise.resolve();
  },
  removeItem: (name) => {
    globalThis.localStorage?.removeItem(name);
    return Promise.resolve();
  },
};

const sessionStorage = Platform.OS === 'web' ? webSessionStorage : secureSessionStorage;

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      hydrated: false,
      token: null,
      user: null,
      signIn: (session) =>
        set({ token: session.token, user: session.user, hydrated: true }),
      signOut: () => set({ token: null, user: null }),
      setUser: (user) => set({ user }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'zpay.session.v1',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          useSessionStore.setState({ hydrated: true });
          return;
        }
        state?.setHydrated(true);
      },
    }
  )
);
