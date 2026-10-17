interface UserMenuItem {
  id: number;
  title: string;
  icon: string;
  color?: string;
  path?: string;
  action?: string;
}

const userMenuItems: UserMenuItem[] = [
  {
    id: 1,
    title: 'Panel Principal (Dashboard)',
    icon: 'mingcute:home-1-fill',
    color: 'text.primary',
    path: '/dashboard',
  },
  {
    id: 2,
    title: 'Gestión de Productos y Stock',
    icon: 'lets-icons:bag-alt-light',
    color: 'text.primary',
    path: '/dashboard/products',
  },
  {
    id: 3,
    title: 'Gestión de Pagos y Órdenes',
    icon: 'mdi:credit-card-check-outline',
    color: 'text.primary',
    path: '/dashboard/payments',
  },
  {
    id: 4,
    title: 'Mis Pedidos',
    icon: 'icon-park-solid:transaction-order',
    color: 'text.primary',
    path: '/my-orders',
  },
  {
    id: 5,
    title: 'Ir a la Tienda',
    icon: 'mdi:storefront-outline',
    color: 'text.primary',
    path: '/',
  },
  {
    id: 6,
    title: 'Cerrar Sesión',
    icon: 'material-symbols:logout',
    color: 'error.main',
    path: '/login',
    action: 'logout',
  },
];

export default userMenuItems;
