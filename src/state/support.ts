import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import type { Transaction } from '@/lib/api';
import { buildSupportText } from '@/lib/receipt';

export type SupportTicketStatus = 'open' | 'in_review' | 'resolved';

export interface SupportTicket {
  id: string;
  reference: string;
  status: SupportTicketStatus;
  title: string;
  message: string;
  transactionId?: string;
  transactionReference?: string;
  serviceName?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateSupportTicketInput {
  title: string;
  message: string;
  transactionId?: string;
  transactionReference?: string;
  serviceName?: string;
}

interface SupportState {
  tickets: SupportTicket[];
  createTicket: (input: CreateSupportTicketInput) => SupportTicket;
  createTransactionTicket: (transaction: Transaction) => SupportTicket;
  setTicketStatus: (id: string, status: SupportTicketStatus) => void;
}

const supportStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) =>
    SecureStore.setItemAsync(name, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

function buildTicketReference() {
  return `ZP-${Date.now().toString(36).toUpperCase()}`;
}

function findExistingTransactionTicket(tickets: SupportTicket[], transaction: Transaction) {
  return tickets.find(
    (ticket) =>
      ticket.transactionId === transaction.id &&
      ticket.status !== 'resolved'
  );
}

export const useSupportStore = create<SupportState>()(
  persist(
    (set, get) => ({
      tickets: [],
      createTicket: (input) => {
        const now = new Date().toISOString();
        const ticket: SupportTicket = {
          id: `ticket_${Date.now()}`,
          reference: buildTicketReference(),
          status: 'open',
          createdAt: now,
          updatedAt: now,
          ...input,
        };

        set((state) => ({
          tickets: [ticket, ...state.tickets].slice(0, 25),
        }));

        return ticket;
      },
      createTransactionTicket: (transaction) => {
        const existingTicket = findExistingTransactionTicket(get().tickets, transaction);

        if (existingTicket) {
          return existingTicket;
        }

        return get().createTicket({
          title: `${transaction.serviceName} support request`,
          message: buildSupportText(transaction),
          transactionId: transaction.id,
          transactionReference: transaction.reference,
          serviceName: transaction.serviceName,
        });
      },
      setTicketStatus: (id, status) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id
              ? { ...ticket, status, updatedAt: new Date().toISOString() }
              : ticket
          ),
        })),
    }),
    {
      name: 'zpay.support-tickets.v1',
      storage: createJSONStorage(() => supportStorage),
    }
  )
);
