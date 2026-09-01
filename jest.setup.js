globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockSecureStore = new Map();

jest.mock('expo-secure-store', () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
  getItemAsync: jest.fn((key) => Promise.resolve(mockSecureStore.get(key) ?? null)),
  setItemAsync: jest.fn((key, value) => {
    mockSecureStore.set(key, value);
    return Promise.resolve();
  }),
  deleteItemAsync: jest.fn((key) => {
    mockSecureStore.delete(key);
    return Promise.resolve();
  }),
  __clear: () => mockSecureStore.clear(),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: {
    SHA256: 'SHA-256',
  },
  getRandomBytesAsync: jest.fn((length) => Promise.resolve(new Uint8Array(Array.from({ length }, (_, index) => index + 1)))),
  digestStringAsync: jest.fn((_algorithm, value) => Promise.resolve(`hashed:${value}`)),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: (props: object) => React.createElement(View, props),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
