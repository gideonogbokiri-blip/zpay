import { delay } from '../../mock/delay';
import { ApiError } from '../errors';
import type {
  AuthSession,
  LoginPayload,
  OtpVerificationPayload,
  PinPayload,
  SignupPayload,
  User,
} from '../types';
import { __resetStore, registerSession } from './store';

interface MockUserRecord {
  user: User;
  password: string;
}

interface PendingVerification {
  phone: string;
  email: string;
  code: string;
}

const users = new Map<string, MockUserRecord>();
const pendingVerifications = new Map<string, PendingVerification>();

function logOtp(phone: string, code: string, resent = false): void {
  if (process.env.EXPO_PUBLIC_DEBUG_OTP === 'true') {
    console.log(`[mock-auth] ${resent ? 'New OTP' : 'OTP'} for ${phone}: ${code}`);
  }
}

function generateId(): string {
  return `usr_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function generateReference(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10).toUpperCase()}${Date.now()
    .toString(36)
    .toUpperCase()}`;
}

function requireUser(token: string | null): User {
  const record = token ? users.get(token) : undefined;
  if (!record) {
    throw new ApiError(
      { code: 'UNAUTHENTICATED', message: 'Your session has expired. Please log in again.', retryable: false },
      'authentication'
    );
  }
  return record.user;
}

function issueSession(record: MockUserRecord): AuthSession {
  const token = generateReference('sess');
  users.set(token, record);
  registerSession(token, record.user.id);
  return { token, user: record.user };
}

export const mockAuthApi = {
  async signup(payload: SignupPayload): Promise<{ verificationId: string }> {
    await delay(900);
    const existing = [...users.values()].find(
      (r) => r.user.email.toLowerCase() === payload.email.toLowerCase() || r.user.phone === payload.phone
    );
    if (existing) {
      throw new ApiError(
        {
          code: 'ACCOUNT_EXISTS',
          message: 'An account already exists for this email or phone number.',
          retryable: false,
        },
        'validation'
      );
    }
    const verificationId = generateId();
    const code = String(Math.floor(100000 + Math.random() * 900000));
    pendingVerifications.set(verificationId, {
      phone: payload.phone,
      email: payload.email,
      code,
    });
    users.set(payload.phone, { password: payload.password, user: mockUser(payload) });
    logOtp(payload.phone, code);
    return { verificationId };
  },

  async verifyOtp(payload: OtpVerificationPayload): Promise<AuthSession> {
    await delay(800);
    const pending = pendingVerifications.get(payload.verificationId);
    if (!pending) {
      throw new ApiError(
        { code: 'OTP_EXPIRED', message: 'This verification code has expired. Request a new one.', retryable: false },
        'validation'
      );
    }
    if (payload.code !== pending.code) {
      throw new ApiError(
        { code: 'OTP_INVALID', message: 'The code you entered is incorrect. Try again.', retryable: true },
        'validation'
      );
    }
    const record = users.get(pending.phone);
    pendingVerifications.delete(payload.verificationId);
    if (!record) {
      throw new ApiError(
        { code: 'ACCOUNT_NOT_FOUND', message: 'Account not found. Please sign up again.', retryable: false },
        'validation'
      );
    }
    return issueSession(record);
  },

  async resendOtp(verificationId: string): Promise<{ verificationId: string }> {
    await delay(600);
    const pending = pendingVerifications.get(verificationId);
    if (!pending) {
      throw new ApiError(
        { code: 'OTP_EXPIRED', message: 'This verification session has expired. Please sign up again.', retryable: false },
        'validation'
      );
    }
    pending.code = String(Math.floor(100000 + Math.random() * 900000));
    logOtp(pending.phone, pending.code, true);
    return { verificationId };
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    await delay(900);
    const identifier = payload.identifier.trim().toLowerCase();
    const record = [...users.values()].find(
      (r) => r.user.email.toLowerCase() === identifier || r.user.phone === identifier
    );
    if (!record || record.password !== payload.password) {
      throw new ApiError(
        { code: 'INVALID_CREDENTIALS', message: 'Incorrect phone/email or password.', retryable: true },
        'authentication'
      );
    }
    return issueSession(record);
  },

  async createPin(token: string, payload: PinPayload): Promise<{ user: User }> {
    await delay(700);
    const user = requireUser(token);
    const record = users.get(user.id) ?? users.get(token);
    if (record) {
      record.user = { ...record.user, pinSet: true };
    }
    return { user: record?.user ?? user };
  },

  async getMe(token: string): Promise<User> {
    await delay(400);
    return requireUser(token);
  },
};

function mockUser(payload: SignupPayload): User {
  return {
    id: generateId(),
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    pinSet: false,
    verificationTier: 'unverified',
  };
}

export function __getMockOtpCode(verificationId: string): string | undefined {
  return pendingVerifications.get(verificationId)?.code;
}

export function __resetMockAuth(): void {
  users.clear();
  pendingVerifications.clear();
  __resetStore();
}
