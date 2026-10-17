import { Menu, Avatar, Button, Tooltip, MenuItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import profile from 'assets/Images/account/Profile.png';
import { useState, MouseEvent, useCallback, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import userMenuItems from 'data/usermenu-items';
import { useAuth } from 'context/AuthContext';

const UserDropdown = (): ReactElement => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleUserClick = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleUserClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMenuItemClick = useCallback((path?: string, action?: string) => {
    handleUserClose();
    if (action === 'logout') {
      logout();
    }
    if (path) {
      navigate(path);
    }
  }, [navigate, handleUserClose, logout]);

  return (
    <>
      <Button
        color="inherit"
        variant="text"
        id="account-dropdown-menu"
        aria-controls={menuOpen ? 'account-dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={handleUserClick}
        disableRipple
        sx={{
          borderRadius: 2,
          gap: 1.5,
          px: { xs: 0, sm: 1 },
          py: 0.625,
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
      >
        <Tooltip title={user?.name || "Admin D'Karito"} arrow placement="bottom">
          <Avatar src={user?.picture || profile} sx={{ width: 40, height: 40 }} />
        </Tooltip>
        <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
          <Typography variant="subtitle2" color="common.white" lineHeight={1.2}>
            {user?.name || "Admin D'Karito"}
          </Typography>
          <Typography variant="caption" color="primary.main">
            {user?.roles?.includes('ADMIN') ? 'Administrador' : 'Cliente'}
          </Typography>
        </Box>
        <IconifyIcon
          color="common.white"
          icon="mingcute:down-fill"
          width={20}
          height={20}
          sx={(theme) => ({
            transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: theme.transitions.create('all', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.short,
            }),
          })}
        />
      </Button>
      <Menu
        id="account-dropdown-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleUserClose}
        MenuListProps={{
          'aria-labelledby': 'account-dropdown-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {userMenuItems.map((userMenuItem) => (
          <MenuItem key={userMenuItem.id} onClick={() => handleMenuItemClick(userMenuItem.path, userMenuItem.action)}>
            <ListItemIcon
              sx={{
                minWidth: '0 !important',
                color: userMenuItem.color,
                width: 16,
                height: 12,
                mb: 1.5,
                mr: 1.5,
              }}
            >
              <IconifyIcon icon={userMenuItem.icon} color={userMenuItem.color} />
            </ListItemIcon>
            <ListItemText
              sx={(theme) => ({
                color: userMenuItem.color,
                '& .MuiListItemText-primary': {
                  fontSize: theme.typography.subtitle2.fontSize,
                  fontFamily: theme.typography.subtitle2.fontFamily,
                  fontWeight: theme.typography.subtitle2.fontWeight,
                },
              })}
            >
              {userMenuItem.title}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default UserDropdown;
