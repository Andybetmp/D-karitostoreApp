import { ReactElement, useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { dashboardService, TodayStats, SummaryStats } from 'services/dashboardService';
import SaleCard from './SaleCard';
import totalSalesIcon from 'assets/Images/todays-sales/total-sales.png';
import totalOrderIcon from 'assets/Images/todays-sales/total-order.png';
import productSoldIcon from 'assets/Images/todays-sales/product-sold.png';
import newCustomerIcon from 'assets/Images/todays-sales/new-customer.png';

const TodaysSales = (): ReactElement => {
  const [stats, setStats] = useState<TodayStats | null>(null);
  const [summary, setSummary] = useState<SummaryStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [todayRes, summaryRes] = await Promise.all([
          dashboardService.getTodayStats(),
          dashboardService.getSummaryStats(),
        ]);
        setStats(todayRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const salesItems = [
    {
      id: 1,
      icon: totalSalesIcon,
      title: `$${Number(stats?.totalSales || 0).toFixed(2)}`,
      subtitle: 'Ventas de Hoy',
      color: 'warning.main',
      increment: 12,
    },
    {
      id: 2,
      icon: totalOrderIcon,
      title: `${stats?.orderCount || 0}`,
      subtitle: 'Pedidos de Hoy',
      color: 'primary.main',
      increment: 8,
    },
    {
      id: 3,
      icon: productSoldIcon,
      title: `${summary?.totalOrders || 0}`,
      subtitle: 'Total Órdenes',
      color: 'secondary.main',
      increment: 15,
    },
    {
      id: 4,
      icon: newCustomerIcon,
      title: `${summary?.deliveredOrders || 0}`,
      subtitle: 'Órdenes Completadas',
      color: 'info.main',
      increment: 10,
    },
  ];

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={1.25}>
        Resumen de Ventas y Operaciones
      </Typography>
      <Typography variant="subtitle2" color="text.disabled" mb={6}>
        Métricas en tiempo real del ecosistema D'Karito Store
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
