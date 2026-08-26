import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);