import type { Notification, Transaction, Wallet } from '../types';

export type MockWallet = Wallet;

interface StoreState {
  wallets: Map<string, MockWallet>;
  transactions: Transaction[];
  notifications: Map<string, Notification[]>;
  idempotency: Map<string, Transaction>;
  tokenUser: Map<string, string>;
}

export const store: StoreState = {
  wallets: new Map(),
  transactions: [],
  notifications: new Map(),
  idempotency: new Map(),
  tokenUser: new Map(),
};

export const INITIAL_BALANCE = 25000;

export function registerSession(token: string, userId: string): void {
  store.tokenUser.set(token, userId);
  if (!store.wallets.has(userId)) {
    store.wallets.set(userId, { balance: INITIAL_BALANCE, currency: 'NGN' });
    seedNotifications(userId);
  }
}

export function resolveUserId(token: string): string | undefined {
  return store.tokenUser.get(token);
}

export function getWallet(userId: string): MockWallet {
  if (!store.wallets.has(userId)) {
    store.wallets.set(userId, { balance: 0, currency: 'NGN' });
  }
  return store.wallets.get(userId)!;
}

export function creditWallet(userId: string, amount: number): MockWallet {
  const wallet = getWallet(userId);
  wallet.balance += amount;
  return wallet;
}

export function debitWallet(userId: string, amount: number): MockWallet {
  const wallet = getWallet(userId);
  wallet.balance -= amount;
  return wallet;
}

export function addTransaction(transaction: Transaction): void {
  store.transactions.unshift(transaction);
}

export function transactionsFor(userId: string): Transaction[] {
  return store.transactions.filter((tx) => tx.userId === userId);
}

export function getTransactionById(id: string): Transaction | undefined {
  return store.transactions.find((tx) => tx.id === id);
}

export function storeIdempotent(userId: string, key: string, transaction: Transaction): void {
  store.idempotency.set(`${userId}:${key}`, transaction);
}

export function findIdempotent(userId: string, key: string): Transaction | undefined {
  return store.idempotency.get(`${userId}:${key}`);
}

export function notificationsFor(userId: string): Notification[] {
  if (!store.notifications.has(userId)) {
    store.notifications.set(userId, []);
  }
  return store.notifications.get(userId)!;
}

export function pushNotification(userId: string, notification: Notification): void {
  notificationsFor(userId).unshift(notification);
}

export function generateReference(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  return `${prefix}-${random}${time}`;
}

function seedNotifications(userId: string): void {
  const now = Date.now();
  pushNotification(userId, {
    id: generateReference('ntf'),
    type: 'account',
    title: 'Welcome to ZPAY',
    message: 'Your wallet is ready. Fund it to start paying bills.',
    readAt: null,
    createdAt: new Date(now).toISOString(),
  });
}

export function __resetStore(): void {
  store.wallets.clear();
  store.transactions.length = 0;
  store.notifications.clear();
  store.idempotency.clear();
  store.tokenUser.clear();
}