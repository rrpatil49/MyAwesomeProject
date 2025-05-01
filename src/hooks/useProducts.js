import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { PRODUCTS } from '../api/endPoints';
import useProductStore from '../store/productStore';

const fetchProducts = async () => {
  const response = await apiClient.get(PRODUCTS.ALL);
  console.log('PRODUCTS.ALL...', response);

  return response.data.products;
};

export const useProducts = () => {
  const { products, setProducts } = useProductStore();

  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    onSuccess: data => {
      setProducts(data);
    },
    enabled: products.length === 0, // Only fetch if store is empty
  });
};
