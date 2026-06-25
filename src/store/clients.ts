import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Client {
  id: string;
  name: string;
  icNo: string;
  telNumber: string;
  address: string;
  email: string;
  bankName: string;
  bankNumber: string;
  signature: string; // Data URL of processed signature
}

export interface ClientState {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, updatedClient: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      clients: [],
      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
      updateClient: (id, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...updatedClient } : c)),
        })),
      deleteClient: (id) =>
        set((state) => ({ clients: state.clients.filter((c) => c.id !== id) })),
    }),
    {
      name: 'tsla-clients-storage',
    }
  )
);
