import { create } from 'zustand';

const useReturnPathStore = create((set) => ({
  returnPath: '/',
  setReturnPath: (returnPath) => set({ returnPath }),
}))

export default useReturnPathStore;
