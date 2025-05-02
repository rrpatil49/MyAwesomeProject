import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import ProductList from '../components/ProductList';
import { useProducts } from '../hooks/useProducts';
import useProductStore from '../store/productStore';

const ProductsScreen = ({ navigation }) => {
  const { data, isLoading, isError } = useProducts(); // Use data directly from React Query (recommended for UI)
  // OR
  const products = useProductStore(state => state.products); //  Use products from Zustand (better for global state access)

  console.log('PRODUCTS:--', products, data);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error while fetching data...</Text>
      </View>
    );
  }

  return <ProductList navigation={navigation} productList={data} />;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsScreen;
