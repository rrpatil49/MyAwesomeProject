import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import ProductList from '../components/ProductList';
import {useProducts} from '../hooks/useProducts';

const ProductsScreen = ({navigation}) => {
  const {isLoading} = useProducts();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ProductList navigation={navigation} />;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductsScreen;
