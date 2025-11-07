import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
  const theme = useTheme();
  
  const stats = [
    { title: 'Total Sales', value: '$12,540', icon: 'currency-usd', color: '#4CAF50' },
    { title: 'Total Orders', value: '245', icon: 'shopping', color: '#2196F3' },
    { title: 'Products', value: '1,250', icon: 'package-variant', color: '#FF9800' },
    { title: 'Low Stock', value: '12', icon: 'alert', color: '#F44336' },
  ];

  const quickActions = [
    { title: 'New Sale', icon: 'point-of-sale', screen: 'NewSale' },
    { title: 'Add Product', icon: 'plus-box', screen: 'AddProduct' },
    { title: 'Inventory', icon: 'warehouse', screen: 'Inventory' },
    { title: 'Reports', icon: 'chart-bar', screen: 'Reports' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Dashboard</Title>
        <Button mode="contained" onPress={() => navigation.navigate('NewSale')}>
          New Sale
        </Button>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Card key={index} style={[styles.statCard, { backgroundColor: stat.color }]}>
            <Card.Content style={styles.statCardContent}>
              <MaterialCommunityIcons 
                name={stat.icon} 
                size={32} 
                color="white" 
                style={styles.statIcon} 
              />
              <View>
                <Paragraph style={styles.statTitle}>{stat.title}</Paragraph>
                <Title style={styles.statValue}>{stat.value}</Title>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Title style={styles.sectionTitle}>Quick Actions</Title>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <MaterialCommunityIcons 
                  name={action.icon} 
                  size={28} 
                  color={theme.colors.primary} 
                />
              </View>
              <Paragraph style={styles.actionText}>{action.title}</Paragraph>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Title style={styles.sectionTitle}>Recent Activity</Title>
        <Card style={styles.activityCard}>
          <Card.Content>
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
              <View style={styles.activityText}>
                <Paragraph>New sale #ORD-1001</Paragraph>
                <Paragraph style={styles.activityTime}>2 minutes ago</Paragraph>
              </View>
              <Paragraph style={styles.activityAmount}>$125.00</Paragraph>
            </View>
            <View style={styles.divider} />
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="package-variant" size={20} color="#2196F3" />
              <View style={styles.activityText}>
                <Paragraph>Stock updated: iPhone 13 Pro</Paragraph>
                <Paragraph style={styles.activityTime}>1 hour ago</Paragraph>
              </View>
              <Paragraph style={styles.activityAmount}>+25 units</Paragraph>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statIcon: {
    marginRight: 12,
  },
  statTitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },
  statValue: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  quickActions: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityCard: {
    borderRadius: 12,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityAmount: {
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
});

export default DashboardScreen;
