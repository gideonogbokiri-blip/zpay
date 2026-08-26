import { http } from './client';
import type {
  AuthSession,
  DataBundle,
  FundWalletPayload,
  KycStatus,
  Notification,
  OtpVerificationPayload,
  Paginated,
  PayServicePayload,
  PinPayload,
  Provider,
  RegisterServicePayload,
  ServiceApplication,
  ServiceDescriptor,
  ServiceType,
  SignupPayload,
  Transaction,
  TvPackage,
  User,
  VerifiedCustomer,
  Wallet,
} from './types';

export const realApi = {
  async getWallet(token: string | null): Promise<Wallet> {
    return http.get<Wallet>('/wallet', token);
  },

  async fundWallet(
    token: string | null,
    payload: FundWalletPayload
  ): Promise<{ wallet: Wallet; transaction: Transaction }> {
    return http.post<{ wallet: Wallet; transaction: Transaction }>('/wallet/fund', payload, token);
  },

  async getServices(): Promise<ServiceDescriptor[]> {
    return http.get<ServiceDescriptor[]>('/services');
  },

  async getProviders(service: ServiceType): Promise<Provider[]> {
    return http.get<Provider[]>(`/services/providers/${service}`);
  },

  async getBundles(service: ServiceType, providerId: string): Promise<DataBundle[] | TvPackage[]> {
    return http.get<DataBundle[] | TvPackage[]>(`/services/products/${service}/${providerId}`);
  },

  async verifyMeter(providerId: string, meterNumber: string): Promise<VerifiedCustomer> {
    return http.post<VerifiedCustomer>('/services/verify-meter', { providerId, meterNumber });
  },

  async verifyCustomer(providerId: string, smartcardNumber: string): Promise<VerifiedCustomer> {
    return http.post<VerifiedCustomer>('/services/verify-customer', { providerId, smartcardNumber });
  },

  async listTransactions(
    token: string | null,
    filter: { service?: ServiceType | 'WALLET' | 'ALL'; status?: Transaction['status'] | 'ALL'; page?: number }
  ): Promise<Paginated<Transaction>> {
    const params = new URLSearchParams();
    if (filter.service && filter.service !== 'ALL') params.set('service', filter.service);
    if (filter.status && filter.status !== 'ALL') params.set('status', filter.status);
    if (filter.page) params.set('page', String(filter.page));
    const qs = params.toString();
    return http.get<Paginated<Transaction>>(`/transactions${qs ? '?' + qs : ''}`, token);
  },

  async getTransaction(token: string | null, id: string): Promise<Transaction> {
    return http.get<Transaction>(`/transactions/${id}`, token);
  },

  async payService(token: string | null, payload: PayServicePayload): Promise<Transaction> {
    return http.post<Transaction>('/transactions/pay', payload, token);
  },

  async registerService(
    token: string | null,
    payload: RegisterServicePayload
  ): Promise<{ transaction: Transaction; application: ServiceApplication }> {
    return http.post<{ transaction: Transaction; application: ServiceApplication }>(
      '/transactions/register',
      payload,
      token
    );
  },

  async getRegistrationFee(service: 'WAEC' | 'JAMB' | 'NECO'): Promise<{ fee: number }> {
    return http.get<{ fee: number }>(`/services/registration-fee/${service}`);
  },

  async getElectricityQuickAmounts(): Promise<number[]> {
    return http.get<number[]>('/services/electricity/quick-amounts');
  },

  async listNotifications(token: string | null): Promise<Notification[]> {
    return http.get<Notification[]>('/notifications', token);
  },

  async markNotificationRead(token: string | null, id: string): Promise<Notification> {
    return http.put<Notification>(`/notifications/${id}/read`, {}, token);
  },

  async markAllNotificationsRead(token: string | null): Promise<void> {
    return http.put<void>('/notifications/read-all', {}, token);
  },

  async getKyc(token: string | null): Promise<KycStatus> {
    return http.get<KycStatus>('/kyc', token);
  },
};

export const realAuthApi = {
  async signup(payload: SignupPayload): Promise<{ verificationId: string }> {
    return http.post<{ verificationId: string }>('/auth/signup', payload);
  },

  async verifyOtp(payload: OtpVerificationPayload): Promise<AuthSession> {
    return http.post<AuthSession>('/auth/verify-otp', payload);
  },

  async resendOtp(verificationId: string): Promise<{ verificationId: string }> {
    return http.post<{ verificationId: string }>('/auth/resend-otp', { verificationId });
  },

  async login(payload: { identifier: string; password: string }): Promise<AuthSession> {
    return http.post<AuthSession>('/auth/login', payload);
  },

  async createPin(token: string, payload: PinPayload): Promise<{ user: User }> {
    return http.post<{ user: User }>('/auth/create-pin', payload, token);
  },

  async getMe(token: string): Promise<User> {
    return http.get<User>('/auth/me', token);
  },
};