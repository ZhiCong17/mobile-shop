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

export const usePathStore = create((set) => {
  return {
    returnPath: '/',
    setReturnPath: (returnPath) => set({ returnPath }),
  }
})

export const useCartStore = create((set, get) => {
  return {
    productCountInCart: null,
    setProductCountInCart: (productCountInCart) => set({ productCountInCart }),
    addCountToCart: () => {
      const newCount = get().productCountInCart + 1;
      set({ productCountInCart: newCount });
    }
  }
})
