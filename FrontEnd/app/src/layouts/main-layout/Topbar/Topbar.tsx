import {
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Box,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { drawerCloseWidth, drawerOpenWidth } from '..';
import UserDropdown from './UserDropdown';
import { useBreakpoints } from 'providers/BreakpointsProvider';

const Topbar = ({
  open,
  handleDrawerToggle,
}: {
  open: boolean;
  handleDrawerToggle: () => void;
}): ReactElement => {
  const { down } = useBreakpoints();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobileScreen = down('sm');

  const quickLinks = [
    { label: 'Resumen', path: '/dashboard', icon: 'mingcute:home-1-fill' },
    { label: 'Productos & Stock', path: '/dashboard/products', icon: 'lets-icons:bag-alt-duotone' },
    { label: 'Pagos', path: '/dashboard/payments', icon: 'mdi:credit-card-check-outline' },
    { label: 'Pedidos', path: '/my-orders', icon: 'icon-park-solid:transaction-order' },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        left: 0,
        ml: isMobileScreen ? 0 : open ? `${drawerOpenWidth}px` : `${drawerCloseWidth}px`,
        width: isMobileScreen
          ? 1
          : open
          ? `calc(100% - ${drawerOpenWidth}px)`
          : `calc(100% - ${drawerCloseWidth}px)`,
        paddingRight: '0 !important',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'none',
      }}
    >
      <Toolbar
        component={Stack}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          bgcolor: 'background.default',
          height: 96,
          px: { xs: 2, sm: 3.5 },
        }}
      >
        <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
          <IconButton
            color="inherit"
            aria-label="Alternar menú lateral"
            onClick={handleDrawerToggle}
            edge="start"
          >
            <IconifyIcon
              icon={open ? 'ri:menu-unfold-4-line' : 'ri:menu-unfold-3-line'}
              color="common.white"
            />
          </IconButton>

          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {quickLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  size="small"
                  variant={active ? 'contained' : 'outlined'}
                  color={active ? 'primary' : 'inherit'}
                  onClick={() => navigate(item.path)}
                  startIcon={<IconifyIcon icon={item.icon} width={16} height={16} />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: active ? 700 : 500,
                    px: 1.75,
                    py: 0.75,
                    borderColor: active ? 'primary.main' : 'rgba(255,255,255,0.12)',
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Stack>

        <Stack direction="row" gap={2} alignItems="center" justifyContent="flex-end">
          <Tooltip
            title="Arquitectura Spring Boot activa: API Gateway (:8080), Auth (:8081), Product (:8082), Inventory (:8083), Order (:8084), Payment (:8085)"
            arrow
          >
            <Chip
              icon={
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#28c76f',
                    ml: 1,
                    boxShadow: '0 0 8px #28c76f',
                  }}
                />
              }
              label="6/6 Microservicios Activos"
              size="small"
              sx={{
                display: { xs: 'none', lg: 'inline-flex' },
                bgcolor: 'rgba(40, 199, 111, 0.12)',
                color: '#28c76f',
                fontWeight: 700,
                border: '1px solid rgba(40, 199, 111, 0.3)',
                px: 0.5,
              }}
            />
          </Tooltip>

          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/')}
            startIcon={<IconifyIcon icon="mdi:storefront-outline" width={17} height={17} />}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Ver Tienda
          </Button>

          <UserDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
