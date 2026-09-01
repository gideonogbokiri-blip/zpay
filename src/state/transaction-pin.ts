import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export type PinVerificationResult = 'verified' | 'missing' | 'invalid';

interface StoredPin {
  salt: string;
  hash: string;
  updatedAt: string;
}

interface TransactionPinState {
  pinsByUserId: Record<string, StoredPin>;
  hasPin: (userId: string | undefined | null) => boolean;
  setPin: (userId: string, pin: string) => Promise<void>;
  verifyPin: (userId: string | undefined | null, pin: string) => Promise<PinVerificationResult>;
  changePin: (userId: string, currentPin: string, nextPin: string) => Promise<PinVerificationResult>;
  clearPin: (userId: string) => void;
}

const transactionPinStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) =>
    SecureStore.setItemAsync(name, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function makeSalt(): Promise<string> {
  return bytesToHex(await Crypto.getRandomBytesAsync(16));
}

async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

export const useTransactionPinStore = create<TransactionPinState>()(
  persist(
    (set, get) => ({
      pinsByUserId: {},
      hasPin: (userId) => Boolean(userId && get().pinsByUserId[userId]),
      setPin: async (userId, pin) => {
        const salt = await makeSalt();
        const hash = await hashPin(pin, salt);
        const updatedAt = new Date().toISOString();

        set((state) => ({
          pinsByUserId: {
            ...state.pinsByUserId,
            [userId]: { salt, hash, updatedAt },
          },
        }));
      },
      verifyPin: async (userId, pin) => {
        if (!userId) return 'missing';
        const storedPin = get().pinsByUserId[userId];
        if (!storedPin) return 'missing';

        const hash = await hashPin(pin, storedPin.salt);
        return hash === storedPin.hash ? 'verified' : 'invalid';
      },
      changePin: async (userId, currentPin, nextPin) => {
        const result = await get().verifyPin(userId, currentPin);
        if (result !== 'verified') {
          return result;
        }

        await get().setPin(userId, nextPin);
        return 'verified';
      },
      clearPin: (userId) =>
        set((state) => {
          const nextPins = { ...state.pinsByUserId };
          delete nextPins[userId];
          return { pinsByUserId: nextPins };
        }),
    }),
    {
      name: 'zpay.transaction-pins.v1',
      storage: createJSONStorage(() => transactionPinStorage),
      partialize: (state) => ({ pinsByUserId: state.pinsByUserId }),
    }
  )
);

export function transactionPinErrorMessage(result: PinVerificationResult): string {
  if (result === 'missing') {
    return 'Set your transaction PIN again on this device before making payments.';
  }

  if (result === 'invalid') {
    return 'Incorrect transaction PIN.';
  }

  return '';
}
