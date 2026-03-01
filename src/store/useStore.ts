import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AppState {
  user: User | null;
  isAdmin: boolean;
  dataList: any[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setDataList: (dataList: any[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isAdmin: false,
  dataList: [],
  isLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setDataList: (dataList) => set({ dataList }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
