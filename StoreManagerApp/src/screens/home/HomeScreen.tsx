import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import { useStore } from '../../context/StoreContext';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { products, loadingProducts } = useStore();

  const featured = products.slice(0, 4);

  return (
    <View style={styles.container}>
      <AppHeader isHome />
      <ScrollView>
      <Text style={styles.subtitle}>Quick overview of your inventory</Text>

      {/* Loader */}
      {loadingProducts && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Product Grid */}
      {!loadingProducts && (
        <FlatList
          data={featured}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('ProductDetail', { product: item })
              }
            >
              <Image
                source={{
                  uri:
                    item.image ||
                    `https://via.placeholder.com/150x150.png?text=${item.name}`,
                }}
                style={styles.image}
              />

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}</Text>

              <Text
                style={[
                  styles.stock,
                  item.quantity < 5 ? styles.lowStock : styles.inStock,
                ]}
              >
                Stock: {item.quantity}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loadingProducts && (
              <Text style={styles.emptyText}>No products available</Text>
            )
          }
          ListFooterComponent={
            featured.length > 0 ? (
              <TouchableOpacity
                style={styles.viewMore}
                onPress={() => navigation.navigate('Products')}
              >
                <Text style={styles.viewMoreText}>View All Products →</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fafafa',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },

  iconBtn: {
    padding: 6,
    backgroundColor: '#eef6ff',
    borderRadius: 8,
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    fontSize: 14,
  },

  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },

  image: { width: 100, height: 100, borderRadius: 8, marginBottom: 10 },

  name: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },

  price: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '700',
    marginTop: 4,
  },

  stock: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  inStock: { color: 'green' },
  lowStock: { color: '#d9534f' },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },

  viewMore: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  viewMoreText: { color: '#fff', fontWeight: 'bold' },
});
