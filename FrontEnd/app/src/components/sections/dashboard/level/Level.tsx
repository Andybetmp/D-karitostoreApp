import { Box, Button, Divider, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { ReactElement, useEffect, useRef } from 'react';
import LevelChart from './LevelChart';
import { levelData } from 'data/chart-data/level';

const Level = (): ReactElement => {
  const theme = useTheme();
  const chartRef = useRef<EChartsReactCore | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 6 }, height: 1 }}>
      <Typography variant="h4" color="common.white" gutterBottom>
        Rotación de Stock
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        Almacén Arequipa vs Despachos
      </Typography>
      <LevelChart
        chartRef={chartRef}
        data={levelData}
        sx={{ height: '181px !important', flexGrow: 1 }}
      />
      <Stack
        direction="row"
        justifyContent="space-around"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: alpha(theme.palette.common.white, 0.06), height: 1 }}
          />
        }
        px={2}
        pt={3}
      >
        <Button
          variant="text"
          sx={{
            justifyContent: 'flex-start',
            p: 0.5,
            borderRadius: 1,
            gap: 1.5,
            color: 'text.disabled',
            fontSize: 'body2.fontSize',
            alignItems: 'baseline',
            '&:hover': { bgcolor: 'transparent' },
            '& .MuiButton-startIcon': { mx: 0 },
          }}
          disableRipple
          startIcon={
            <Box sx={{ width: 8, height: 8, mb: 1, bgcolor: 'primary.main', borderRadius: 400 }} />
          }
        >
          Stock Disponible
        </Button>
        <Button
          variant="text"
          sx={{
            justifyContent: 'flex-start',
            p: 0.5,
            borderRadius: 1,
            gap: 1.5,
            color: 'text.disabled',
            fontSize: 'body2.fontSize',
            alignItems: 'baseline',
            '&:hover': { bgcolor: 'transparent' },
            '& .MuiButton-startIcon': { mx: 0 },
          }}
          disableRipple
          startIcon={
            <Box sx={{ width: 8, height: 8, mb: 1, bgcolor: 'grey.800', borderRadius: 400 }} />
          }
        >
          Despachados
        </Button>
      </Stack>
    </Paper>
  );
};

export default Level;
