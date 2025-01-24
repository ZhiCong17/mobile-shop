import { create } from 'zustand';

export const useUserStore = create((set) => {
  const storedUser = localStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: loggedInUser,
    login: (user) => {
      set({ user });
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: () => {
      set({ user: null });
      localStorage.removeItem('user');
    }
  }
})

export const useSearchStore = create((set) => {
  return {
    search: '',
    setSearch: (search) => set({ search }),
  }
})

export const useCategoryStore = create((set) => {
  return {
    category: '',
    setCategory: (category) => set({ category }),
  }
})

export const usePathStore = create((set) => {
  return {
    returnPath: '/',
    setReturnPath: (returnPath) => set({ returnPath }),
  }
})
