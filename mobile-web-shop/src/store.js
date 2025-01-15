import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
}))
