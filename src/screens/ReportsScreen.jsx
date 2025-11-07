import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, SegmentedButtons, useTheme, ActivityIndicator, Caption } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock data
const MOCK_SALES_DATA = {
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [1200, 1900, 1500, 2000, 2200, 3000, 2800],
  },
  weekly: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [8500, 9200, 7800, 10500],
  },
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [32000, 35000, 38000, 42000, 45000, 48000, 50000, 52000, 48000, 55000, 58000, 62000],
  },
};

const MOCK_TOP_PRODUCTS = [
  { name: 'Wireless Earbuds', sales: 125, revenue: 9987.5 },
  { name: 'Smart Watch', sales: 89, revenue: 17791.1 },
  { name: 'Bluetooth Speaker', sales: 76, revenue: 4559.24 },
  { name: 'Laptop Backpack', sales: 64, revenue: 3199.36 },
  { name: 'Wireless Mouse', sales: 52, revenue: 1559.48 },
];

const MOCK_CATEGORY_DISTRIBUTION = [
  { name: 'Electronics', sales: 68, color: '#4CAF50', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  { name: 'Accessories', sales: 32, color: '#2196F3', legendFontColor: '#7F7F7F', legendFontSize: 12 },
];

const ReportsScreen = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('weekly');
  const [activeChart, setActiveChart] = useState('revenue');
  const [loading, setLoading] = useState(true);
  
  // Chart configuration
  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Get current sales data based on time range
  const currentSalesData = MOCK_SALES_DATA[timeRange];
  const screenWidth = Dimensions.get('window').width - 40;

  // Calculate metrics
  const totalRevenue = currentSalesData.data.reduce((sum, value) => sum + value, 0);
  const avgDailyRevenue = Math.round(totalRevenue / currentSalesData.data.length);
  const growthPercentage = Math.round(((currentSalesData.data[currentSalesData.data.length - 1] - 
    currentSalesData.data[0]) / currentSalesData.data[0]) * 100);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Title style={styles.title}>Analytics Dashboard</Title>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Summary Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryContainer}
      >
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryHeader}>
              <View style={[styles.summaryIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="currency-usd" size={20} color="#2E7D32" />
              </View>
              <Title style={styles.summaryTitle}>Total Revenue</Title>
            </View>
            <Title style={styles.summaryValue}>
              ${totalRevenue.toLocaleString()}
            </Title>
            <View style={styles.summaryFooter}>
              <Caption style={styles.summaryChange}>
                <MaterialCommunityIcons 
                  name={growthPercentage >= 0 ? 'arrow-up' : 'arrow-down'} 
                  size={14} 
                  color={growthPercentage >= 0 ? '#2E7D32' : '#D32F2F'} 
                />
                {Math.abs(growthPercentage)}% from last period
              </Caption>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryHeader}>
              <View style={[styles.summaryIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="chart-line" size={20} color="#1976D2" />
              </View>
              <Title style={styles.summaryTitle}>Avg. Daily</Title>
            </View>
            <Title style={styles.summaryValue}>
              ${avgDailyRevenue.toLocaleString()}
            </Title>
            <View style={styles.summaryFooter}>
              <Caption style={styles.summaryChange}>
                Based on {timeRange} data
              </Caption>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryHeader}>
              <View style={[styles.summaryIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="package-variant" size={20} color="#F57C00" />
              </View>
              <Title style={styles.summaryTitle}>Top Product</Title>
            </View>
            <Title style={styles.summaryValue}>
              {MOCK_TOP_PRODUCTS[0].name}
            </Title>
            <View style={styles.summaryFooter}>
              <Caption style={styles.summaryChange}>
                {MOCK_TOP_PRODUCTS[0].sales} units sold
              </Caption>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Revenue Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Title>Revenue Overview</Title>
            <SegmentedButtons
              value={activeChart}
              onValueChange={setActiveChart}
              buttons={[
                { value: 'revenue', label: 'Revenue' },
                { value: 'units', label: 'Units' },
              ]}
              style={styles.chartToggle}
              density="small"
            />
          </View>
          
          <LineChart
            data={{
              labels: currentSalesData.labels,
              datasets: [
                {
                  data: currentSalesData.data,
                  color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            fromZero
          />
        </Card.Content>
      </Card>

      <View style={styles.row}>
        {/* Top Products */}
        <Card style={[styles.halfCard, { marginRight: 8 }]}>
          <Card.Content>
            <Title>Top Products</Title>
            <View style={styles.productsList}>
              {MOCK_TOP_PRODUCTS.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {index + 1}. {product.name}
                    </Text>
                    <Text style={styles.productSales}>
                      {product.sales} units • ${product.revenue.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.productProgressContainer}>
                    <View 
                      style={[
                        styles.productProgressBar,
                        { 
                          width: `${(product.sales / MOCK_TOP_PRODUCTS[0].sales) * 100}%`,
                          backgroundColor: index % 2 === 0 ? '#4CAF50' : '#8BC34A',
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Category Distribution */}
        <Card style={[styles.halfCard, { marginLeft: 8 }]}>
          <Card.Content>
            <Title>Sales by Category</Title>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={MOCK_CATEGORY_DISTRIBUTION}
                width={screenWidth / 2 - 40}
                height={150}
                chartConfig={chartConfig}
                accessor="sales"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
              <View style={styles.legendContainer}>
                {MOCK_CATEGORY_DISTRIBUTION.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View 
                      style={[
                        styles.legendColor, 
                        { backgroundColor: item.color }
                      ]} 
                    />
                    <Text style={styles.legendText}>
                      {item.name} ({item.sales}%)
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Activity */}
      <Card style={styles.activityCard}>
        <Card.Content>
          <Title>Recent Transactions</Title>
          <View style={styles.activityList}>
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <MaterialCommunityIcons 
                    name="receipt" 
                    size={20} 
                    color="#757575" 
                  />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityTitle}>
                    Sale #{1000 + item} • ${(Math.random() * 200 + 50).toFixed(2)}
                  </Text>
                  <Text style={styles.activityTime}>
                    {item} hour{item !== 1 ? 's' : ''} ago • 3 items
                  </Text>
                </View>
                <MaterialCommunityIcons 
                  name="chevron-right" 
                  size={24} 
                  color="#BDBDBD" 
                />
              </View>
            ))}
          </View>
          <Button 
            mode="text" 
            onPress={() => {}}
            style={styles.viewAllButton}
          >
            View All Transactions
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  summaryContainer: {
    paddingVertical: 8,
  },
  summaryCard: {
    width: 220,
    marginRight: 12,
    borderRadius: 12,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#757575',
    margin: 0,
    lineHeight: 20,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryChange: {
    color: '#757575',
    fontSize: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartCard: {
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartToggle: {
    width: 200,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 16,
  },
  halfCard: {
    flex: 1,
    borderRadius: 12,
    elevation: 2,
  },
  productsList: {
    marginTop: 8,
  },
  productItem: {
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    flex: 1,
    fontSize: 13,
    marginRight: 8,
  },
  productSales: {
    fontSize: 12,
    color: '#757575',
  },
  productProgressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  productProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendContainer: {
    flex: 1,
    marginLeft: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#424242',
  },
  activityCard: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 12,
    elevation: 2,
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#757575',
  },
  viewAllButton: {
    marginTop: 8,
  },
});

export default ReportsScreen;
