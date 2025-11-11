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
import { globalStyles } from '../../styles/globalStyles';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { products, loadingProducts } = useStore();

  const featured = products.slice(0, 4);

  return (
    <View style={styles.container}>
      <AppHeader isHome />
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
      >

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
    backgroundColor: '#0f1115',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },

  iconBtn: {
    padding: 8,
    backgroundColor: '#171a21',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },

  card: {
    backgroundColor: '#171a21',
    width: '48%',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2f3a',
  },

  image: { 
    width: 140, 
    height: 100, 
    borderRadius: 12, 
    marginBottom: 12,
    backgroundColor: '#0f1115',
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 4,
  },

  price: {
    fontSize: 16,
    color: '#4f8cff',
    fontWeight: '700',
    marginTop: 2,
  },

  stock: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  inStock: { color: '#4caf50' },
  lowStock: { color: '#ff5252' },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#b6c0cf',
    fontSize: 15,
  },

  viewMore: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1b5e20',
  },

  viewMoreText: { 
    color: '#ffffff', 
    fontWeight: '600',
    fontSize: 15,
  },
});
