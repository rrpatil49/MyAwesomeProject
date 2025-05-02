// store/productStore.js
import { create } from 'zustand';

const useProductStore = create(set => ({
  products: [],
  setProducts: products => set({ products }),
  clearProducts: () => set({ products: [] }),
}));

export default useProductStore;
