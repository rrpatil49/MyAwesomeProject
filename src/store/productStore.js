import {create} from 'zustand';

const useProductStore = create(set => ({
  products: [],
  setProducts: products => set({products}),
  addProduct: product =>
    set(state => ({products: [...state.products, product]})),
}));

export default useProductStore;
