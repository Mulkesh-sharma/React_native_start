import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Text, DataTable, Portal, Modal, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data
const MOCK_PRODUCTS = [
  { id: '1', name: 'Wireless Earbuds', price: 79.99, stock: 45 },
  { id: '2', name: 'Smart Watch', price: 199.99, stock: 12 },
  { id: '3', name: 'Bluetooth Speaker', price: 59.99, stock: 28 },
  { id: '4', name: 'Laptop Backpack', price: 49.99, stock: 35 },
  { id: '5', name: 'Wireless Mouse', price: 29.99, stock: 0 },
];

const SalesScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountTendered, setAmountTendered] = useState('');

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  const change = paymentMethod === 'cash' && amountTendered ? (parseFloat(amountTendered) - total).toFixed(2) : 0;

  // Load products
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setFilteredProducts(MOCK_PRODUCTS);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increase quantity if already in cart
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...currentCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      setCart(currentCart => currentCart.filter(item => item.id !== productId));
    } else {
      // Update quantity
      setCart(currentCart =>
        currentCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const processPayment = () => {
    // In a real app, this would process the payment through a payment gateway
    console.log('Processing payment:', { cart, total, paymentMethod, amountTendered });
    
    // Show success message
    alert('Payment processed successfully!');
    
    // Reset cart and close modal
    setCart([]);
    setPaymentModalVisible(false);
    setAmountTendered('');
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.productItem, !item.stock && styles.outOfStockItem]}
      onPress={() => item.stock > 0 && addToCart(item)}
      disabled={!item.stock}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Text style={[styles.stockText, { color: item.stock ? '#2E7D32' : '#D32F2F' }]}>
        {item.stock ? `${item.stock} in stock` : 'Out of stock'}
      </Text>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell style={styles.cartItemName}>
        <Text>{item.name}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} each</Text>
      </DataTable.Cell>
      <DataTable.Cell numeric style={styles.quantityCell}>
        <View style={styles.quantityControl}>
          <IconButton
            icon="minus"
            size={16}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.quantityButton}
          />
          <TextInput
            style={styles.quantityInput}
            value={item.quantity.toString()}
            onChangeText={(text) => {
              const num = parseInt(text) || 0;
              updateQuantity(item.id, num);
            }}
            keyboardType="numeric"
          />
          <IconButton
            icon="plus"
            size={16}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
          />
        </View>
      </DataTable.Cell>
      <DataTable.Cell numeric style={styles.cartItemTotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </DataTable.Cell>
      <DataTable.Cell>
        <IconButton
          icon="close"
          size={20}
          onPress={() => removeFromCart(item.id)}
          style={styles.removeButton}
        />
      </DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <View style={styles.container}>
      <View style={styles.productsContainer}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <ScrollView style={styles.productsList}>
          {filteredProducts.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.productItem, !item.stock && styles.outOfStockItem]}
              onPress={() => item.stock > 0 && addToCart(item)}
              disabled={!item.stock}
            >
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <Text style={[styles.stockText, { color: item.stock ? '#2E7D32' : '#D32F2F' }]}>
                {item.stock ? `${item.stock} in stock` : 'Out of stock'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.cartContainer}>
        <Title style={styles.cartTitle}>Current Sale</Title>
        
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <MaterialCommunityIcons name="cart-remove" size={48} color="#BDBDBD" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>Add items to get started</Text>
          </View>
        ) : (
          <>
            <View style={styles.cartItems}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} × {item.quantity}</Text>
                  </View>
                  <View style={styles.cartItemActions}>
                    <Text style={styles.cartItemTotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                    <IconButton
                      icon="close"
                      size={16}
                      onPress={() => removeFromCart(item.id)}
                      style={styles.removeButton}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.totalsContainer}>
              <View style={styles.totalsRow}>
                <Text>Subtotal:</Text>
                <Text>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text>Tax (8%):</Text>
                <Text>${tax.toFixed(2)}</Text>
              </View>
              <View style={[styles.totalsRow, styles.totalRow]}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={() => setPaymentModalVisible(true)}
              style={styles.checkoutButton}
              labelStyle={styles.checkoutButtonLabel}
            >
              Process Payment
            </Button>
          </>
        )}
      </View>

      {/* Payment Modal */}
      <Portal>
        <Modal
          visible={paymentModalVisible}
          onDismiss={() => setPaymentModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Process Payment</Title>
          
          <View style={styles.paymentTotal}>
            <Text style={styles.paymentTotalLabel}>Total Amount:</Text>
            <Text style={styles.paymentTotalAmount}>${total.toFixed(2)}</Text>
          </View>

          <View style={styles.paymentMethodContainer}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethods}>
              <TouchableOpacity 
                style={[
                  styles.paymentMethod, 
                  paymentMethod === 'cash' && styles.paymentMethodSelected
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <MaterialCommunityIcons 
                  name="cash" 
                  size={24} 
                  color={paymentMethod === 'cash' ? theme.colors.primary : '#757575'} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === 'cash' && styles.paymentMethodTextSelected
                ]}>
                  Cash
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.paymentMethod, 
                  paymentMethod === 'card' && styles.paymentMethodSelected
                ]}
                onPress={() => setPaymentMethod('card')}
              >
                <MaterialCommunityIcons 
                  name="credit-card" 
                  size={24} 
                  color={paymentMethod === 'card' ? theme.colors.primary : '#757575'} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === 'card' && styles.paymentMethodTextSelected
                ]}>
                  Card
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {paymentMethod === 'cash' && (
            <View style={styles.amountTenderedContainer}>
              <Text style={styles.sectionTitle}>Amount Tendered</Text>
              <TextInput
                style={styles.amountInput}
                value={amountTendered}
                onChangeText={setAmountTendered}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#9E9E9E"
              />
              {amountTendered > 0 && (
                <View style={styles.changeContainer}>
                  <Text>Change Due:</Text>
                  <Text style={styles.changeAmount}>
                    ${change >= 0 ? change : '0.00'}
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setPaymentModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={processPayment}
              style={styles.confirmButton}
              disabled={paymentMethod === 'cash' && (!amountTendered || parseFloat(amountTendered) < total)}
            >
              {paymentMethod === 'cash' ? 'Process Payment' : 'Charge Card'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  productsContainer: {
    flex: 2,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  productsList: {
    flex: 1,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
  },
  outOfStockItem: {
    opacity: 0.6,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  stockText: {
    fontSize: 12,
  },
  cartContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  cartTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyCartText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyCartSubtext: {
    color: '#757575',
    marginTop: 4,
  },
  cartItems: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#757575',
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemTotal: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  removeButton: {
    margin: 0,
  },
  totalsContainer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E7D32',
  },
  checkoutButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkoutButtonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  paymentTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  paymentTotalLabel: {
    fontSize: 16,
    color: '#757575',
  },
  paymentTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  paymentMethodContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  paymentMethods: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paymentMethod: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 8,
  },
  paymentMethodSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  paymentMethodText: {
    marginTop: 8,
    color: '#757575',
  },
  paymentMethodTextSelected: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  amountTenderedContainer: {
    marginBottom: 24,
  },
  amountInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  changeAmount: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#E0E0E0',
  },
  confirmButton: {
    flex: 2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    margin: 0,
    width: 32,
    height: 32,
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 4,
  },
});

export default SalesScreen;
