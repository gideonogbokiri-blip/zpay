import { mockAuthApi } from './mock/auth.mock';
import { backendApi } from './mock/backend.mock';
import { realAuthApi, realApi } from './real';

export * from './errors';
export * from './types';

const useMock = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

export const authApi = useMock ? mockAuthApi : realAuthApi;
export const api = useMock ? backendApi : realApi;