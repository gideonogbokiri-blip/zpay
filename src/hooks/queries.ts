import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type {
  DataBundle,
  PayServicePayload,
  RegisterServicePayload,
  ServiceType,
  Transaction,
  TvPackage,
} from '@/lib/api';
import { useAuth } from './use-auth';

export function useWallet() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['wallet', token],
    queryFn: () => api.getWallet(token),
    enabled: Boolean(token),
  });
}

export function invalidateWallet(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: ['wallet'] });
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.getServices(),
  });
}

export function useProviders(service: ServiceType) {
  return useQuery({
    queryKey: ['providers', service],
    queryFn: () => api.getProviders(service),
    enabled: Boolean(service),
  });
}

export function useProducts(service: ServiceType, providerId: string | null) {
  return useQuery({
    queryKey: ['products', service, providerId],
    queryFn: () => api.getBundles(service, providerId!),
    enabled: Boolean(providerId) && (service === 'DATA' || service === 'TV'),
  });
}

export function useRegistrationFee(service: ServiceType) {
  return useQuery({
    queryKey: ['registration-fee', service],
    queryFn: () =>
      api.getRegistrationFee(service as 'WAEC' | 'JAMB' | 'NECO'),
    enabled: service === 'WAEC' || service === 'JAMB' || service === 'NECO',
  });
}

export function useElectricityQuickAmounts() {
  return useQuery({
    queryKey: ['electricity-quick-amounts'],
    queryFn: () => api.getElectricityQuickAmounts(),
  });
}

export type TransactionFilter = {
  service?: ServiceType | 'WALLET' | 'ALL';
  status?: Transaction['status'] | 'ALL';
};

export function useTransactions(filter: TransactionFilter) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['transactions', token, filter.service ?? 'ALL', filter.status ?? 'ALL'],
    queryFn: () => api.listTransactions(token, { ...filter, page: 1 }),
    enabled: Boolean(token),
  });
}

export function useTransaction(id: string | string[] | undefined) {
  const { token } = useAuth();
  const txId = Array.isArray(id) ? id[0] : id;
  return useQuery({
    queryKey: ['transaction', token, txId],
    queryFn: () => api.getTransaction(token, txId!),
    enabled: Boolean(token) && Boolean(txId),
  });
}

export function usePayService() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (payload: PayServicePayload) => api.payService(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useRegisterService() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (payload: RegisterServicePayload) => api.registerService(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useFundWallet() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (payload: { amount: number; method: string; idempotencyKey: string }) =>
      api.fundWallet(token, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

export function useNotifications() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['notifications', token],
    queryFn: () => api.listNotifications(token),
    enabled: Boolean(token),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (id: string) => api.markNotificationRead(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: () => api.markAllNotificationsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useKyc() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['kyc', token],
    queryFn: () => api.getKyc(token),
    enabled: Boolean(token),
  });
}

export type Product = DataBundle | TvPackage;