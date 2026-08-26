import type { User } from '@/lib/api';
import { useSessionStore } from '@/state/session';
import type { AuthStatus } from '@/state/session';

export interface UseAuthResult {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  signIn: (session: { token: string; user: User }) => void;
  signOut: () => void;
  setUser: (user: User) => void;
}

export function useAuth(): UseAuthResult {
  const hydrated = useSessionStore((s) => s.hydrated);
  const token = useSessionStore((s) => s.token);
  const user = useSessionStore((s) => s.user);
  const signIn = useSessionStore((s) => s.signIn);
  const signOut = useSessionStore((s) => s.signOut);
  const setUser = useSessionStore((s) => s.setUser);

  const status: AuthStatus = !hydrated ? 'loading' : token ? 'signedIn' : 'signedOut';

  return { status, token, user, signIn, signOut, setUser };
}