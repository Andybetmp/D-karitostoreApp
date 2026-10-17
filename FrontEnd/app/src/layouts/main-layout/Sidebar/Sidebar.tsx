import { ReactElement } from 'react';
import { Box, Chip, List, Stack, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import navItems from 'data/nav-items';
import NavItem from './NavItem';
import { drawerCloseWidth, drawerOpenWidth } from '..';
import { rootPaths } from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

const Sidebar = ({ open }: { open: boolean }): ReactElement => {
  const navigate = useNavigate();

  return (
    <>
      <Toolbar
        sx={{
          position: 'fixed',
          height: 96,
          zIndex: 2,
          bgcolor: 'background.default',
          px: 2,
          justifyContent: 'center',
          width: open ? drawerOpenWidth - 1 : drawerCloseWidth - 1,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          onClick={() => navigate(rootPaths.homeRoot)}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: 'rgba(169, 223, 216, 0.14)',
              border: '1px solid rgba(169, 223, 216, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            <IconifyIcon icon="mdi:star-four-points-outline" width={22} height={22} />
          </Box>
          {open && (
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Kaushan Script", cursive',
                  color: 'common.white',
                  lineHeight: 1.1,
                  letterSpacing: '0.02em',
                }}
              >
                D&apos;KaritoStore
              </Typography>
              <Chip
                label="ADMIN ERP • MS"
                size="small"
                sx={{
                  mt: 0.4,
                  height: 18,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  bgcolor: 'rgba(169, 223, 216, 0.12)',
                  color: 'primary.main',
                }}
              />
            </Box>
          )}
        </Stack>
      </Toolbar>
      <div style={{ maxHeight: '100vh', overflow: 'auto' }}>
        <List
          component="nav"
          sx={{
            mt: 22,
            py: 2.5,
            px: 1,
            height: 680,
            justifyContent: 'space-between',
          }}
        >
          {navItems.map((navItem) => (
            <NavItem key={navItem.id} navItem={navItem} open={open} />
          ))}
        </List>
      </div>
    </>
  );
};

export default Sidebar;
