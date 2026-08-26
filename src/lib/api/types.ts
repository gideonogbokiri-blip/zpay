export type VerificationTier = 'unverified' | 'basic' | 'verified';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  pinSet: boolean;
  verificationTier: VerificationTier;
  avatarUrl?: string | null;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface SignupPayload {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface OtpVerificationPayload {
  verificationId: string;
  code: string;
}

export interface PinPayload {
  pin: string;
}

export type ServiceType = 'ELECTRICITY' | 'AIRTIME' | 'DATA' | 'TV' | 'WAEC' | 'JAMB' | 'NECO';

export type TransactionStatus = 'pending' | 'successful' | 'failed' | 'cancelled';

export type PaymentMethod = 'wallet';

export type RegistrationStatus =
  | 'draft'
  | 'awaiting_payment'
  | 'payment_pending'
  | 'paid'
  | 'registration_pending'
  | 'registered'
  | 'failed';

export interface ServiceDescriptor {
  type: ServiceType;
  name: string;
  order: number;
}

export interface Provider {
  id: string;
  service: ServiceType;
  name: string;
  fee: number;
}

export interface DataBundle {
  id: string;
  providerId: string;
  name: string;
  size: string;
  price: number;
  validity: string;
}

export interface TvPackage {
  id: string;
  providerId: string;
  name: string;
  price: number;
  duration: string;
}

export interface VerifiedCustomer {
  customerName: string;
  customerAddress?: string;
}

export interface Wallet {
  balance: number;
  currency: 'NGN';
}

export interface Transaction {
  id: string;
  reference: string;
  userId: string;
  service: ServiceType | 'WALLET';
  serviceName: string;
  amount: number;
  fee: number;
  total: number;
  currency: 'NGN';
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  providerReference?: string | null;
  customerIdentifier?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'payment' | 'funding' | 'service' | 'registration' | 'account';
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  hasMore: boolean;
}

export interface KycStatus {
  tier: VerificationTier;
  status: 'not_started' | 'in_progress' | 'completed';
  verifiedAt?: string | null;
}

export interface InsufficientFundsData {
  balance: number;
  required: number;
  needed: number;
}

export interface PayServicePayload {
  service: ServiceType;
  providerId?: string;
  customerIdentifier?: string;
  amount: number;
  pin: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
}

export interface ServiceApplication {
  id: string;
  reference: string;
  service: ServiceType;
  paymentStatus: TransactionStatus;
  registrationStatus: RegistrationStatus;
  fee: number;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterServicePayload {
  service: ServiceType;
  pin: string;
  idempotencyKey: string;
  amount: number;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface FundWalletPayload {
  amount: number;
  method: string;
  idempotencyKey: string;
}