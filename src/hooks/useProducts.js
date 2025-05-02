import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { PRODUCTS } from '../api/endPoints';
import useProductStore from '../store/productStore';

// Pure API function (no side effects)
export const fetchProducts = async () => {
  const response = await apiClient.get(PRODUCTS.ALL);
  return response.data?.products;
};

export const useProducts = () => {
  const setProducts = useProductStore(state => state.setProducts);

  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    onSuccess: data => {
      // Update Zustand store when data is successfully fetched
      setProducts(data);
    },
    onError: error => {
      console.error('Failed to fetch products:', error);
    },
  });
};
