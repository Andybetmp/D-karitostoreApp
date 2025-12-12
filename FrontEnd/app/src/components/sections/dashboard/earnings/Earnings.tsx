import { Box, Paper, Typography } from '@mui/material';
import EarningsChart from './EarningsChart';
import { ReactElement, useEffect, useRef } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { currencyFormat } from 'helpers/format-functions';

import { dashboardService } from 'services/dashboardService';
import { useState } from 'react';

const Earnings = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await dashboardService.getTodayStats();
        setTotalEarnings(response.data.totalSales || 0);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      }
    };
    fetchEarnings();

    const handleResize = () => {
      if (chartRef.current) {
        const echartsInstance = chartRef.current.getEchartsInstance();
        echartsInstance.resize({ width: 'auto', height: 'auto' });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={2.5}>
        Ventas de Hoy
      </Typography>
      <Typography variant="body1" color="text.primary" mb={4.5}>
        Ganancias Totales (24h)
      </Typography>
      <Typography
        variant="h1"
        color="primary.main"
        mb={4.5}
        fontSize={{ xs: 'h2.fontSize', sm: 'h1.fontSize' }}
      >
        {currencyFormat(totalEarnings, { useGrouping: true })}
      </Typography>
      <Typography variant="body1" color="text.primary" mb={15}>
        Calculado en tiempo real
      </Typography>
      <Box
        flex={1}
        sx={{
          position: 'relative',
        }}
      >
        <EarningsChart
          chartRef={chartRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flex: '1 1 0%',
            maxHeight: 152,
          }}
        />
        <Typography
          variant="h1"
          color="common.white"
          textAlign="center"
          mx="auto"
          position="absolute"
          left={0}
          right={0}
          bottom={0}
        >
          80%
        </Typography>
      </Box>
    </Paper>
  );
};

export default Earnings;
