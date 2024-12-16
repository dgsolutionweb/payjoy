import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar,
  Divider,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from './Logo';
import { Sale } from '../types';
import PaymentReminder from './PaymentReminder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface HeaderProps {
  pendingSales?: Sale[];
}

const Header = ({ pendingSales = [] }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(true);
  };

  const handleNotificationsClose = () => {
    setShowNotifications(false);
  };

  const getTodayPayments = () => {
    const today = new Date().toISOString().split('T')[0];
    return pendingSales.filter(
      (sale) => 
        sale.status === 'pending' &&
        sale.payment_due_date.split('T')[0] === today
    ).length;
  };

  const notificationCount = getTodayPayments();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const buttonStyle = (path: string) => ({
    color: isActive(path) ? 'primary.main' : 'grey.700',
    bgcolor: isActive(path) ? 'primary.100' : 'transparent',
    '&:hover': {
      bgcolor: isActive(path) ? 'primary.200' : 'grey.100',
    },
    px: 2,
    py: 1.5,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    width: '100%',
    justifyContent: 'flex-start',
    transition: 'all 0.2s ease-in-out',
  });

  const navigationItems = [
    { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/sales/new', icon: <AddCircleIcon />, label: 'Nova Venda' },
    { path: '/sales', icon: <HistoryIcon />, label: 'Histórico' },
    { path: '/payments', icon: <AttachMoneyIcon />, label: 'Pagamentos' },
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <AccountCircleIcon />
        </Avatar>
        <Box>
          <Logo size="small" />
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ px: 2, mb: 1 }}>
            <Button
              component={RouterLink}
              to={item.path}
              sx={buttonStyle(item.path)}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 'auto', 
                  color: isActive(item.path) ? 'primary.main' : 'grey.600'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 500,
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                }}
              />
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0} 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'grey.200',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ 
          px: { xs: 2, sm: 3 },
          height: 64,
          display: 'flex', 
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '100%'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none' }}>
              <Logo size={isMobile ? 'small' : 'medium'} />
            </RouterLink>
          </Box>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="medium"
                color="inherit"
                onClick={handleNotificationsClick}
                sx={{ 
                  bgcolor: 'grey.100',
                  '&:hover': { bgcolor: 'grey.200' },
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ 
                  bgcolor: 'grey.100',
                  '&:hover': { bgcolor: 'grey.200' },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={buttonStyle(item.path)}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  size="medium"
                  color="inherit"
                  onClick={handleNotificationsClick}
                  sx={{ 
                    bgcolor: 'grey.100',
                    '&:hover': { bgcolor: 'grey.200' },
                  }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.100',
                    color: 'primary.main',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'primary.200' },
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </Box>
            </Box>
          )}
        </Toolbar>

        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              boxShadow: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>

      {/* Notifications Dialog */}
      {showNotifications && (
        <PaymentReminder
          sales={pendingSales}
          onClose={handleNotificationsClose}
        />
      )}
    </>
  );
};

export default Header; 