import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Chip, Divider, useTheme, ActivityIndicator, Menu } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data
const MOCK_INVENTORY = [
  { 
    id: '1', 
    name: 'Wireless Earbuds', 
    sku: 'WE-1001', 
    category: 'Electronics', 
    currentStock: 5, 
    minStock: 10, 
    status: 'low',
    lastUpdated: '2023-11-05T10:30:00Z'
  },
  { 
    id: '2', 
    name: 'Smart Watch', 
    sku: 'SW-2002', 
    category: 'Electronics', 
    currentStock: 15, 
    minStock: 5, 
    status: 'in-stock',
    lastUpdated: '2023-11-06T14:15:00Z'
  },
  { 
    id: '3', 
    name: 'Bluetooth Speaker', 
    sku: 'BS-3003', 
    category: 'Electronics', 
    currentStock: 28, 
    minStock: 10, 
    status: 'in-stock',
    lastUpdated: '2023-11-04T09:45:00Z'
  },
  { 
    id: '4', 
    name: 'Laptop Backpack', 
    sku: 'LB-4004', 
    category: 'Accessories', 
    currentStock: 2, 
    minStock: 5, 
    status: 'low',
    lastUpdated: '2023-11-06T16:20:00Z'
  },
  { 
    id: '5', 
    name: 'Wireless Mouse', 
    sku: 'WM-5005', 
    category: 'Accessories', 
    currentStock: 0, 
    minStock: 10, 
    status: 'out-of-stock',
    lastUpdated: '2023-11-01T11:10:00Z'
  },
];

const InventoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  // Load inventory data
  const loadInventory = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInventory(MOCK_INVENTORY);
      setFilteredInventory(MOCK_INVENTORY);
      setLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  // Initial load
  useEffect(() => {
    loadInventory();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...inventory];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.currentStock - b.currentStock;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortAsc ? comparison : -comparison;
    });
    
    setFilteredInventory(result);
  }, [inventory, statusFilter, categoryFilter, searchQuery, sortBy, sortAsc]);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadInventory();
  };

  // Get status chip props
  const getStatusChipProps = (status) => {
    switch (status) {
      case 'in-stock':
        return { label: 'In Stock', color: '#2E7D32', icon: 'check-circle' };
      case 'low':
        return { label: 'Low Stock', color: '#F57C00', icon: 'alert' };
      case 'out-of-stock':
        return { label: 'Out of Stock', color: '#C62828', icon: 'close-circle' };
      default:
        return { label: 'Unknown', color: '#757575', icon: 'help-circle' };
    }
  };

  // Get categories for filter
  const categories = ['all', ...new Set(inventory.map(item => item.category))];

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render inventory item
  const renderInventoryItem = ({ item }) => {
    const status = getStatusChipProps(item.status);
    
    return (
      <Card 
        style={styles.inventoryItem}
        onPress={() => navigation.navigate('InventoryDetail', { itemId: item.id })}
      >
        <Card.Content>
          <View style={styles.itemHeader}>
            <Title style={styles.itemName}>{item.name}</Title>
            <Chip 
              mode="outlined" 
              style={[styles.statusChip, { borderColor: status.color }]}
              textStyle={{ color: status.color, fontSize: 12 }}
              icon={({ size, color }) => (
                <MaterialCommunityIcons name={status.icon} size={14} color={status.color} />
              )}
            >
              {status.label}
            </Chip>
          </View>
          
          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="barcode" size={16} color="#757575" />
              <Paragraph style={styles.detailText}>{item.sku}</Paragraph>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="tag" size={16} color="#757575" />
              <Paragraph style={styles.detailText}>{item.category}</Paragraph>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="package" size={16} color="#757575" />
              <View style={styles.stockInfo}>
                <Paragraph style={styles.detailText}>
                  <Text style={{ fontWeight: 'bold' }}>{item.currentStock}</Text> in stock
                  {item.minStock > 0 && ` (Min: ${item.minStock})`}
                </Paragraph>
                {item.currentStock > 0 && (
                  <View style={styles.stockBarContainer}>
                    <View 
                      style={[
                        styles.stockBar, 
                        { 
                          width: `${Math.min(100, (item.currentStock / (item.minStock * 2)) * 100)}%`,
                          backgroundColor: item.status === 'low' ? '#FFA000' : '#4CAF50'
                        }
                      ]} 
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="update" size={16} color="#757575" />
              <Paragraph style={styles.detailText}>
                Updated {formatDate(item.lastUpdated)}
              </Paragraph>
            </View>
          </View>
          
          <View style={styles.itemActions}>
            <Button 
              mode="outlined" 
              compact 
              icon="plus"
              onPress={() => navigation.navigate('AdjustStock', { itemId: item.id, action: 'add' })}
              style={styles.actionButton}
            >
              Add Stock
            </Button>
            <Button 
              mode="outlined" 
              compact 
              icon="minus"
              onPress={() => navigation.navigate('AdjustStock', { itemId: item.id, action: 'remove' })}
              style={styles.actionButton}
              disabled={item.currentStock === 0}
            >
              Remove
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Render empty state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search inventory..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusFilterContainer}
          >
            <Chip
              mode={statusFilter === 'all' ? 'flat' : 'outlined'}
              selected={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
              style={styles.statusChip}
            >
              All Items
            </Chip>
            <Chip
              mode={statusFilter === 'in-stock' ? 'flat' : 'outlined'}
              selected={statusFilter === 'in-stock'}
              onPress={() => setStatusFilter('in-stock')}
              style={[styles.statusChip, { borderColor: '#2E7D32' }]}
              textStyle={{ color: statusFilter === 'in-stock' ? '#2E7D32' : undefined }}
              icon={({ size, color }) => (
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={16} 
                  color={statusFilter === 'in-stock' ? '#2E7D32' : '#757575'} 
                />
              )}
            >
              In Stock
            </Chip>
            <Chip
              mode={statusFilter === 'low' ? 'flat' : 'outlined'}
              selected={statusFilter === 'low'}
              onPress={() => setStatusFilter('low')}
              style={[styles.statusChip, { borderColor: '#F57C00' }]}
              textStyle={{ color: statusFilter === 'low' ? '#F57C00' : undefined }}
              icon={({ size, color }) => (
                <MaterialCommunityIcons 
                  name="alert" 
                  size={16} 
                  color={statusFilter === 'low' ? '#F57C00' : '#757575'} 
                />
              )}
            >
              Low Stock
            </Chip>
            <Chip
              mode={statusFilter === 'out-of-stock' ? 'flat' : 'outlined'}
              selected={statusFilter === 'out-of-stock'}
              onPress={() => setStatusFilter('out-of-stock')}
              style={[styles.statusChip, { borderColor: '#C62828' }]}
              textStyle={{ color: statusFilter === 'out-of-stock' ? '#C62828' : undefined }}
              icon={({ size, color }) => (
                <MaterialCommunityIcons 
                  name="close-circle" 
                  size={16} 
                  color={statusFilter === 'out-of-stock' ? '#C62828' : '#757575'} 
                />
              )}
            >
              Out of Stock
            </Chip>
          </ScrollView>
          
          <View style={styles.filterRow}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryFilterContainer}
            >
              {categories.map((category, index) => (
                <Chip
                  key={index}
                  mode={categoryFilter === category ? 'flat' : 'outlined'}
                  selected={categoryFilter === category}
                  onPress={() => setCategoryFilter(category)}
                  style={styles.categoryChip}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Chip>
              ))}
            </ScrollView>
            
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button 
                  mode="outlined" 
                  onPress={() => setMenuVisible(true)}
                  style={styles.sortButton}
                  icon="sort"
                >
                  Sort
                </Button>
              }
            >
              <Menu.Item 
                title="Sort by Name" 
                onPress={() => {
                  setSortBy('name');
                  setMenuVisible(false);
                }}
                titleStyle={sortBy === 'name' ? { fontWeight: 'bold' } : {}}
              />
              <Menu.Item 
                title="Sort by Stock Level" 
                onPress={() => {
                  setSortBy('stock');
                  setMenuVisible(false);
                }}
                titleStyle={sortBy === 'stock' ? { fontWeight: 'bold' } : {}}
              />
              <Menu.Item 
                title="Sort by Category" 
                onPress={() => {
                  setSortBy('category');
                  setMenuVisible(false);
                }}
                titleStyle={sortBy === 'category' ? { fontWeight: 'bold' } : {}}
              />
              <Divider />
              <Menu.Item 
                title={sortAsc ? 'Sort Ascending' : 'Sort Descending'} 
                onPress={() => {
                  setSortAsc(!sortAsc);
                  setMenuVisible(false);
                }}
                titleStyle={{ fontStyle: 'italic' }}
              />
            </Menu>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        {filteredInventory.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="package-variant-remove" size={64} color="#BDBDBD" />
            <Title style={styles.emptyStateTitle}>No items found</Title>
            <Paragraph style={styles.emptyStateText}>
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first inventory item to get started'}
            </Paragraph>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('AddInventoryItem')}
              style={styles.addButton}
            >
              Add Inventory Item
            </Button>
          </View>
        ) : (
          <FlatList
            data={filteredInventory}
            renderItem={renderInventoryItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.inventoryList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
          />
        )}
      </View>
      
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddInventoryItem')}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    elevation: 2,
  },
  searchBar: {
    marginBottom: 12,
    elevation: 1,
  },
  filterContainer: {
    marginTop: 8,
  },
  statusFilterContainer: {
    paddingVertical: 8,
  },
  statusChip: {
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  categoryFilterContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  sortButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inventoryList: {
    paddingBottom: 80,
  },
  inventoryItem: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  itemDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#424242',
  },
  stockInfo: {
    flex: 1,
    marginLeft: 8,
  },
  stockBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  stockBar: {
    height: '100%',
    borderRadius: 2,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 24,
  },
  addButton: {
    width: '70%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default InventoryScreen;
