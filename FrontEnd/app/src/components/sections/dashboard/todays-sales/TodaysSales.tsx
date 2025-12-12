import { ReactElement } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { dashboardService, TodayStats } from 'services/dashboardService';
import { currencyFormat } from 'helpers/format-functions';
import SaleCard from './SaleCard';

const TodaysSales = (): ReactElement => {
  const [stats, setStats] = useState<TodayStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getTodayStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching today stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Transform API data to current UI Component format
  // Assuming SaleCard expects specific props, we'll adapt purely for visual compatibility or reuse existing structure.
  // The existing salesData was a list. Let's create a list based on our stats.

  const salesItems = [
    {
      id: 1,
      icon: 'assets/images/sales.png',
      amount: `$${currencyFormat(stats?.totalSales || 0, { useGrouping: true, notation: 'compact' })}`, // Format currency
      title: 'Total Sales',
      subtitle: 'Today',
      color: 'primary.main',
      increment: 0,
    },
    {
      id: 2,
      icon: 'assets/images/order.png',
      amount: `${stats?.orderCount || 0}`,
      title: 'Total Orders',
      subtitle: 'Today',
      color: 'warning.main',
      increment: 0,
    },
  ];

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={1.25}>
        Today’s Sales
      </Typography>
      <Typography variant="subtitle2" color="text.disabled" mb={6}>
        Sales Summary
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={{ xs: 4, sm: 6 }}>
        {salesItems.map((saleItem) => (
          <Box key={saleItem.id} gridColumn={{ xs: 'span 12', sm: 'span 6', lg: 'span 3' }}>
            <SaleCard saleItem={saleItem} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default TodaysSales;
