import { delay } from '../../mock/delay';
import { ApiError } from '../errors';
import type {
  DataBundle,
  FundWalletPayload,
  KycStatus,
  Notification,
  Paginated,
  PayServicePayload,
  Provider,
  RegisterServicePayload,
  ServiceApplication,
  ServiceDescriptor,
  ServiceType,
  Transaction,
  TvPackage,
  User,
  VerifiedCustomer,
  Wallet,
} from '../types';
import { mockAuthApi } from './auth.mock';
import {
  addTransaction,
  creditWallet,
  debitWallet,
  findIdempotent,
  generateReference,
  getTransactionById,
  getWallet,
  notificationsFor,
  pushNotification,
  resolveUserId,
  storeIdempotent,
  transactionsFor,
} from './store';

async function requireUser(token: string | null): Promise<User> {
  if (!token) {
    throw new ApiError(
      { code: 'UNAUTHENTICATED', message: 'Your session has expired. Please log in again.', retryable: false },
      'authentication'
    );
  }
  return mockAuthApi.getMe(token);
}

function requireUserId(token: string | null): string {
  if (!token) {
    throw new ApiError(
      { code: 'UNAUTHENTICATED', message: 'Your session has expired. Please log in again.', retryable: false },
      'authentication'
    );
  }
  const userId = resolveUserId(token);
  if (!userId) {
    throw new ApiError(
      { code: 'UNAUTHENTICATED', message: 'Your session has expired. Please log in again.', retryable: false },
      'authentication'
    );
  }
  return userId;
}

const SERVICES: ServiceDescriptor[] = [
  { type: 'ELECTRICITY', name: 'Electricity', order: 1 },
  { type: 'AIRTIME', name: 'Airtime', order: 2 },
  { type: 'DATA', name: 'Data', order: 3 },
  { type: 'TV', name: 'TV', order: 4 },
  { type: 'WAEC', name: 'WAEC', order: 5 },
  { type: 'JAMB', name: 'JAMB', order: 6 },
  { type: 'NECO', name: 'NECO', order: 7 },
];

const SERVICE_NAMES: Record<ServiceType, string> = {
  ELECTRICITY: 'Electricity',
  AIRTIME: 'Airtime',
  DATA: 'Data',
  TV: 'TV',
  WAEC: 'WAEC',
  JAMB: 'JAMB',
  NECO: 'NECO',
};

const PROVIDERS: Provider[] = [
  { id: 'ekedc', service: 'ELECTRICITY', name: 'EKEDC', fee: 100 },
  { id: 'ikedc', service: 'ELECTRICITY', name: 'IKEDC', fee: 100 },
  { id: 'phedc', service: 'ELECTRICITY', name: 'PHEDC', fee: 100 },
  { id: 'aedc', service: 'ELECTRICITY', name: 'AEDC', fee: 100 },
  { id: 'mtn', service: 'AIRTIME', name: 'MTN', fee: 0 },
  { id: 'airtel', service: 'AIRTIME', name: 'Airtel', fee: 0 },
  { id: 'glo', service: 'AIRTIME', name: 'Glo', fee: 0 },
  { id: '9mobile', service: 'AIRTIME', name: '9mobile', fee: 0 },
  { id: 'mtn-data', service: 'DATA', name: 'MTN', fee: 0 },
  { id: 'airtel-data', service: 'DATA', name: 'Airtel', fee: 0 },
  { id: 'glo-data', service: 'DATA', name: 'Glo', fee: 0 },
  { id: '9mobile-data', service: 'DATA', name: '9mobile', fee: 0 },
  { id: 'dstv', service: 'TV', name: 'DSTV', fee: 200 },
  { id: 'gotv', service: 'TV', name: 'GOtv', fee: 150 },
  { id: 'startimes', service: 'TV', name: 'StarTimes', fee: 150 },
];

const DATA_BUNDLES: DataBundle[] = [
  { id: 'mtn-500mb', providerId: 'mtn-data', name: 'Daily 500MB', size: '500MB', price: 300, validity: '1 day' },
  { id: 'mtn-1gb', providerId: 'mtn-data', name: 'Weekly 1GB', size: '1GB', price: 500, validity: '7 days' },
  { id: 'mtn-2gb', providerId: 'mtn-data', name: 'Monthly 2GB', size: '2GB', price: 900, validity: '30 days' },
  { id: 'mtn-5gb', providerId: 'mtn-data', name: 'Monthly 5GB', size: '5GB', price: 2000, validity: '30 days' },
  { id: 'airtel-500mb', providerId: 'airtel-data', name: 'Daily 500MB', size: '500MB', price: 300, validity: '1 day' },
  { id: 'airtel-1gb', providerId: 'airtel-data', name: 'Weekly 1GB', size: '1GB', price: 500, validity: '7 days' },
  { id: 'airtel-2gb', providerId: 'airtel-data', name: 'Monthly 2GB', size: '2GB', price: 900, validity: '30 days' },
  { id: 'glo-500mb', providerId: 'glo-data', name: 'Daily 500MB', size: '500MB', price: 300, validity: '1 day' },
  { id: 'glo-1gb', providerId: 'glo-data', name: 'Weekly 1GB', size: '1GB', price: 500, validity: '7 days' },
  { id: 'glo-2gb', providerId: 'glo-data', name: 'Monthly 2GB', size: '2GB', price: 900, validity: '30 days' },
  { id: '9m-500mb', providerId: '9mobile-data', name: 'Daily 500MB', size: '500MB', price: 300, validity: '1 day' },
  { id: '9m-1gb', providerId: '9mobile-data', name: 'Weekly 1GB', size: '1GB', price: 500, validity: '7 days' },
  { id: '9m-2gb', providerId: '9mobile-data', name: 'Monthly 2GB', size: '2GB', price: 900, validity: '30 days' },
];

const TV_PACKAGES: TvPackage[] = [
  { id: 'dstv-padi', providerId: 'dstv', name: 'Padi', price: 2900, duration: '1 month' },
  { id: 'dstv-yanga', providerId: 'dstv', name: 'Yanga', price: 4500, duration: '1 month' },
  { id: 'dstv-confam', providerId: 'dstv', name: 'Confam', price: 6500, duration: '1 month' },
  { id: 'dstv-compact', providerId: 'dstv', name: 'Compact', price: 9600, duration: '1 month' },
  { id: 'gotv-smallie', providerId: 'gotv', name: 'Smallie', price: 1500, duration: '1 month' },
  { id: 'gotv-jinja', providerId: 'gotv', name: 'Jinja', price: 2500, duration: '1 month' },
  { id: 'gotv-max', providerId: 'gotv', name: 'Max', price: 4000, duration: '1 month' },
  { id: 'startimes-nova', providerId: 'startimes', name: 'Nova', price: 1200, duration: '1 month' },
  { id: 'startimes-basic', providerId: 'startimes', name: 'Basic', price: 1900, duration: '1 month' },
];

const ELEC_QUICK_AMOUNTS = [1000, 2000, 5000, 10000];

const REGISTRATION_FEE: Record<'WAEC' | 'JAMB' | 'NECO', number> = {
  WAEC: 12000,
  JAMB: 7500,
  NECO: 13500,
};

function providerFee(providerId?: string): number {
  const provider = PROVIDERS.find((p) => p.id === providerId);
  return provider?.fee ?? 0;
}

function shaStable(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function mockCustomerName(identifier: string): string {
  const names = ['OKEKE MARY', 'ADEWALE K. P.', 'MUSA IBRAHIM', 'NGOZI CHIDI', 'BALOGUN TUNDE'];
  return names[shaStable(identifier) % names.length];
}

export const backendApi = {
  async getWallet(token: string | null): Promise<Wallet> {
    await delay(350);
    const userId = requireUserId(token);
    return { ...getWallet(userId) };
  },

  async fundWallet(
    token: string | null,
    payload: FundWalletPayload
  ): Promise<{ wallet: Wallet; transaction: Transaction }> {
    await delay(1200);
    const userId = requireUserId(token);
    if (payload.amount <= 0) {
      throw new ApiError(
        { code: 'INVALID_AMOUNT', message: 'Enter an amount greater than zero.', retryable: false },
        'validation'
      );
    }
    const wallet = creditWallet(userId, payload.amount);
    const transaction: Transaction = {
      id: generateReference('tx'),
      reference: generateReference('ZP'),
      userId,
      service: 'WALLET',
      serviceName: 'Wallet Funding',
      amount: payload.amount,
      fee: 0,
      total: payload.amount,
      currency: 'NGN',
      paymentMethod: 'wallet',
      status: 'successful',
      providerReference: generateReference('GTW'),
      customerIdentifier: null,
      metadata: { fundingMethod: payload.method },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTransaction(transaction);
    pushNotification(userId, {
      id: generateReference('ntf'),
      type: 'funding',
      title: 'Wallet funded',
      message: `Your wallet was funded with NGN ${payload.amount}.`,
      readAt: null,
      createdAt: new Date().toISOString(),
    });
    return { wallet: { ...wallet }, transaction };
  },

  async getServices(): Promise<ServiceDescriptor[]> {
    await delay(200);
    return SERVICES.map((s) => ({ ...s }));
  },

  async getProviders(service: ServiceType): Promise<Provider[]> {
    await delay(250);
    return PROVIDERS.filter((p) => p.service === service).map((p) => ({ ...p }));
  },

  async getBundles(service: ServiceType, providerId: string): Promise<DataBundle[] | TvPackage[]> {
    await delay(300);
    if (service === 'DATA') {
      return DATA_BUNDLES.filter((b) => b.providerId === providerId).map((b) => ({ ...b }));
    }
    if (service === 'TV') {
      return TV_PACKAGES.filter((p) => p.providerId === providerId).map((p) => ({ ...p }));
    }
    return [];
  },

  async verifyMeter(providerId: string, meterNumber: string): Promise<VerifiedCustomer> {
    await delay(800);
    if (!/^\d{6,}$/.test(meterNumber)) {
      throw new ApiError(
        { code: 'INVALID_METER', message: 'Enter a valid meter number.', retryable: false },
        'validation'
      );
    }
    return { customerName: mockCustomerName(meterNumber) };
  },

  async verifyCustomer(providerId: string, smartcardNumber: string): Promise<VerifiedCustomer> {
    await delay(800);
    if (!/^\d{6,}$/.test(smartcardNumber)) {
      throw new ApiError(
        { code: 'INVALID_SMARTCARD', message: 'Enter a valid smartcard / IUC number.', retryable: false },
        'validation'
      );
    }
    return { customerName: mockCustomerName(smartcardNumber) };
  },

  async listTransactions(
    token: string | null,
    filter: { service?: ServiceType | 'WALLET' | 'ALL'; status?: Transaction['status'] | 'ALL'; page?: number }
  ): Promise<Paginated<Transaction>> {
    await delay(450);
    const userId = requireUserId(token);
    const page = filter.page ?? 1;
    const pageSize = 20;
    const filtered = storeTransactions(userId).filter((tx) => {
      const matchesService = !filter.service || filter.service === 'ALL' || tx.service === filter.service;
      const matchesStatus = !filter.status || filter.status === 'ALL' || tx.status === filter.status;
      return matchesService && matchesStatus;
    });
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      page,
      hasMore: start + pageSize < filtered.length,
    };
  },

  async getTransaction(token: string | null, id: string): Promise<Transaction> {
    await delay(300);
    const userId = requireUserId(token);
    const tx = getTransactionById(id);
    if (!tx || tx.userId !== userId) {
      throw new ApiError(
        { code: 'NOT_FOUND', message: 'Transaction not found.', retryable: false },
        'validation'
      );
    }
    return { ...tx };
  },

  async payService(token: string | null, payload: PayServicePayload): Promise<Transaction> {
    await delay(1400);
    const user = await requireUser(token);
    const userId = user.id;
    if (!user.pinSet || !/^\d{4}$/.test(payload.pin)) {
      throw new ApiError(
        { code: 'PIN_INVALID', message: 'Enter your 4-digit transaction PIN.', retryable: false },
        'validation'
      );
    }
    const existing = findIdempotent(userId, payload.idempotencyKey);
    if (existing) {
      return { ...existing };
    }
    const fee = providerFee(payload.providerId);
    const total = payload.amount + fee;
    const wallet = getWallet(userId);
    if (wallet.balance < total) {
      throw new ApiError(
        {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient wallet balance.',
          retryable: false,
          data: { balance: wallet.balance, required: total, needed: total - wallet.balance },
        },
        'insufficient_funds'
      );
    }
    const createdAt = new Date().toISOString();
    const transaction: Transaction = {
      id: generateReference('tx'),
      reference: generateReference('ZP'),
      userId,
      service: payload.service,
      serviceName: SERVICE_NAMES[payload.service],
      amount: payload.amount,
      fee,
      total,
      currency: 'NGN',
      paymentMethod: 'wallet',
      status: 'pending',
      providerReference: null,
      customerIdentifier: payload.customerIdentifier ?? null,
      metadata: payload.metadata ?? null,
      createdAt,
      updatedAt: createdAt,
    };
    addTransaction(transaction);
    storeIdempotent(userId, payload.idempotencyKey, transaction);

    const providerFailed = payload.metadata?.simulateProviderFailure === true;
    if (providerFailed) {
      transaction.status = 'failed';
      transaction.updatedAt = new Date().toISOString();
      pushNotification(userId, {
        id: generateReference('ntf'),
        type: 'payment',
        title: 'Payment failed',
        message: `Your ${SERVICE_NAMES[payload.service]} payment could not be completed. No funds were charged.`,
        readAt: null,
        createdAt: new Date().toISOString(),
      });
      return { ...transaction };
    }

    debitWallet(userId, total);
    transaction.status = 'successful';
    transaction.providerReference = generateReference('PRV');
    transaction.updatedAt = new Date().toISOString();
    pushNotification(userId, {
      id: generateReference('ntf'),
      type: 'payment',
      title: 'Payment successful',
      message: `Your ${SERVICE_NAMES[payload.service]} payment of NGN ${total} was successful.`,
      readAt: null,
      createdAt: new Date().toISOString(),
    });
    return { ...transaction };
  },

  async registerService(
    token: string | null,
    payload: RegisterServicePayload
  ): Promise<{ transaction: Transaction; application: ServiceApplication }> {
    await delay(1600);
    const user = await requireUser(token);
    const userId = user.id;
    if (!user.pinSet || !/^\d{4}$/.test(payload.pin)) {
      throw new ApiError(
        { code: 'PIN_INVALID', message: 'Enter your 4-digit transaction PIN.', retryable: false },
        'validation'
      );
    }
    const existing = findIdempotent(userId, payload.idempotencyKey);
    const fee = 0;
    const total = payload.amount + fee;
    const wallet = getWallet(userId);
    if (wallet.balance < total) {
      throw new ApiError(
        {
          code: 'INSUFFICIENT_FUNDS',
          message: 'Insufficient wallet balance.',
          retryable: false,
          data: { balance: wallet.balance, required: total, needed: total - wallet.balance },
        },
        'insufficient_funds'
      );
    }
    if (existing) {
      return {
        transaction: { ...existing },
        application: {
          id: generateReference('app'),
          reference: existing.reference,
          service: payload.service,
          paymentStatus: existing.status,
          registrationStatus: existing.status === 'successful' ? 'registered' : 'payment_pending',
          fee,
          metadata: payload.payload,
          createdAt: existing.createdAt,
          updatedAt: existing.updatedAt,
        },
      };
    }
    const createdAt = new Date().toISOString();
    const transaction: Transaction = {
      id: generateReference('tx'),
      reference: generateReference('ZP'),
      userId,
      service: payload.service,
      serviceName: SERVICE_NAMES[payload.service],
      amount: payload.amount,
      fee,
      total,
      currency: 'NGN',
      paymentMethod: 'wallet',
      status: 'pending',
      providerReference: null,
      customerIdentifier: null,
      metadata: payload.metadata ?? null,
      createdAt,
      updatedAt: createdAt,
    };
    addTransaction(transaction);
    storeIdempotent(userId, payload.idempotencyKey, transaction);

    debitWallet(userId, total);
    transaction.status = 'successful';
    transaction.providerReference = generateReference('PRV');
    transaction.updatedAt = new Date().toISOString();
    pushNotification(userId, {
      id: generateReference('ntf'),
      type: 'registration',
      title: 'Registration paid',
      message: `Payment for your ${SERVICE_NAMES[payload.service]} registration was successful.`,
      readAt: null,
      createdAt: new Date().toISOString(),
    });

    const application: ServiceApplication = {
      id: generateReference('app'),
      reference: transaction.reference,
      service: payload.service,
      paymentStatus: transaction.status,
      registrationStatus: 'registered',
      fee,
      metadata: payload.payload,
      createdAt,
      updatedAt: transaction.updatedAt,
    };
    return { transaction, application };
  },

  async getRegistrationFee(service: 'WAEC' | 'JAMB' | 'NECO'): Promise<{ fee: number }> {
    await delay(200);
    return { fee: REGISTRATION_FEE[service] };
  },

  async getElectricityQuickAmounts(): Promise<number[]> {
    await delay(100);
    return [...ELEC_QUICK_AMOUNTS];
  },

  async listNotifications(token: string | null): Promise<Notification[]> {
    await delay(400);
    const userId = requireUserId(token);
    return notificationsFor(userId).map((n) => ({ ...n }));
  },

  async markNotificationRead(token: string | null, id: string): Promise<Notification> {
    await delay(150);
    const userId = requireUserId(token);
    const notification = notificationsFor(userId).find((n) => n.id === id);
    if (!notification) {
      throw new ApiError(
        { code: 'NOT_FOUND', message: 'Notification not found.', retryable: false },
        'validation'
      );
    }
    notification.readAt = notification.readAt ?? new Date().toISOString();
    return { ...notification };
  },

  async markAllNotificationsRead(token: string | null): Promise<void> {
    await delay(200);
    const userId = requireUserId(token);
    for (const n of notificationsFor(userId)) {
      n.readAt = n.readAt ?? new Date().toISOString();
    }
  },

  async getKyc(token: string | null): Promise<KycStatus> {
    await delay(300);
    const user = await requireUser(token);
    const completed = user.verificationTier !== 'unverified';
    return {
      tier: user.verificationTier,
      status: completed ? 'completed' : 'not_started',
      verifiedAt: completed ? new Date().toISOString() : null,
    };
  },
};

function storeTransactions(userId: string): Transaction[] {
  return transactionsFor(userId);
}

export { mockAuthApi as authApi };
export { ELEC_QUICK_AMOUNTS as electricityQuickAmounts };