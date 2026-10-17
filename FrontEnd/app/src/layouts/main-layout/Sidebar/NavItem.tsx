import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { NavItem as NavItemProps } from 'data/nav-items';
import { useLocation, useNavigate } from 'react-router-dom';

const NavItem = ({ navItem, open }: { navItem: NavItemProps; open: boolean }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSelected = pathname === navItem.path;

  return (
    <ListItem
      disablePadding
      sx={(theme) => ({
        display: 'block',
        px: 5,
        borderRight: !open
          ? isSelected
            ? `3px solid ${theme.palette.primary.main}`
            : '3px solid transparent'
          : '',
      })}
    >
      <ListItemButton
        onClick={() => {
          if (navItem.path && navItem.path !== '#!') {
            navigate(navItem.path);
          }
        }}
        sx={{
          opacity: navItem.active ? 1 : 0.6,
          bgcolor: isSelected ? (open ? 'primary.main' : '') : 'background.default',
          '&:hover': {
            bgcolor: isSelected
              ? open
                ? 'primary.dark'
                : 'background.paper'
              : 'background.paper',
          },
          '& .MuiTouchRipple-root': {
            color: isSelected ? 'primary.main' : 'text.disabled',
          },
        }}
      >
        <ListItemIcon
          sx={{
            width: 20,
            height: 20,
            mr: open ? 'auto' : 0,
            color: isSelected
              ? open
                ? 'background.default'
                : 'primary.main'
              : 'text.primary',
          }}
        >
          <IconifyIcon icon={navItem.icon} width={1} height={1} />
        </ListItemIcon>
        <ListItemText
          primary={navItem.title}
          sx={{
            display: open ? 'inline-block' : 'none',
            opacity: open ? 1 : 0,
            color: isSelected ? 'background.default' : '',
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem;
