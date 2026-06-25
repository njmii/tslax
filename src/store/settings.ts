import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  agentName: string;
  agentId: string;
  agentIc: string;
  agentSignature: string; // Data URL
  witnessName: string;
  witnessIc: string;
  witnessSignature: string; // Data URL
  updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      agentName: '',
      agentId: '',
      agentIc: '',
      agentSignature: '',
      witnessName: '',
      witnessIc: '',
      witnessSignature: '',
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'tsla-settings-storage',
    }
  )
);
