interface UserMenuItem {
  id: number;
  title: string;
  icon: string;
  color?: string;
  path?: string;
}

const userMenuItems: UserMenuItem[] = [
  {
    id: 1,
    title: 'View Profile',
    icon: 'mingcute:user-2-fill',
    color: 'text.primary',
    path: '/profile',
  },
  {
    id: 2,
    title: 'Account Settings',
    icon: 'material-symbols:settings-account-box-rounded',
    color: 'text.primary',
    path: '/settings',
  },
  {
    id: 11,
    title: 'My Orders',
    icon: 'icon-park-solid:transaction-order',
    color: 'text.primary',
    path: '/my-orders',
  },
  {
    id: 3,
    title: 'Notifications',
    icon: 'ion:notifications',
    color: 'text.primary',
  },
  {
    id: 4,
    title: 'Switch Account',
    icon: 'material-symbols:switch-account',
    color: 'text.primary',
  },
  {
    id: 5,
    title: 'Help Center',
    icon: 'material-symbols:live-help',
    color: 'text.primary',
  },
  {
    id: 6,
    title: 'Logout',
    icon: 'material-symbols:logout',
    color: 'error.main',
    path: '/',
  },
];

export default userMenuItems;
