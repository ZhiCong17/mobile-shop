import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartProductCount: 0,
  setCartProductCount: (count) => set({ cartProductCount: count }),
  addCountToCart: () => {
    const newCount = get().cartProductCount + 1;
    set({ cartProductCount: newCount });
  }
}))

export default useCartStore;
