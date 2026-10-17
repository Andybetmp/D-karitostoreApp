export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}

const navItems: NavItem[] = [
  {
    id: 1,
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 2,
    path: '/dashboard/products',
    title: 'Productos & Stock',
    icon: 'lets-icons:bag-alt-light',
    active: true,
  },
  {
    id: 3,
    path: '/dashboard/payments',
    title: 'Pagos & Órdenes',
    icon: 'mdi:credit-card-check-outline',
    active: true,
  },
  {
    id: 4,
    path: '/my-orders',
    title: 'Mis Pedidos',
    icon: 'ant-design:shopping-cart-outlined',
    active: true,
  },
  {
    id: 5,
    path: '/checkout',
    title: 'Pasarela Checkout',
    icon: 'mdi:cash-fast',
    active: true,
  },
  {
    id: 6,
    path: '/',
    title: 'Ver Tienda 3D',
    icon: 'mdi:storefront-outline',
    active: true,
  },
  {
    id: 7,
    path: '/login',
    title: 'Cambiar Cuenta',
    icon: 'tabler:login',
    active: true,
  },
];

export default navItems;
