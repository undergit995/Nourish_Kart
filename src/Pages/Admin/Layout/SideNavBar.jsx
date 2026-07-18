
import React, { useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Tooltip, Drawer, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyInfo } from '../../../Redux/Slices/AdminSlice/CompanyInfoSlice';
const drawerWidth = 260;
const collapsedWidth = 80;

export default function Sidebar({ sidebarOpen, mobileOpen, onMobileClose, onLogout }) {
  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon /> },
    { text: 'Products', icon: <ShoppingBagIcon /> },
    { text: 'Orders', icon: <ReceiptLongIcon /> },
    { text: 'Customers', icon: <PeopleIcon /> },
    // { text: 'Analytics', icon: <BarChartIcon /> },
    { text: 'Info', icon: <BusinessIcon /> },
    { text: 'Coupons', icon: <ConfirmationNumberIcon /> },
    { text: 'Banners', icon: <AdUnitsIcon /> },
  ];

  const navigate = useNavigate();

  const company = useSelector((state) => state.companyInfo.info);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  const getDrawerContent = (isExpanded) => (
    <Box sx={{ height: '100%', bgcolor: '#1E1154', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: isExpanded ? 3 : 2, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
        {isExpanded ? (
          <><Box
              component="img"
              src={company?.companyImage}
              alt="DRC Logo"
              sx={{
                width: 36,
                height: 36,
                mr:'1px',
                objectFit: "cover",
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0px 6px 18px rgba(62, 26, 137, 0.15)",
              }}
            />
          
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => navigate('/admin')}
          >
             <span style={{ color: '#A78BFA' }}>  {company?.companyName}</span>
          </Typography></>
        ) : (
          <Tooltip title="PowerBites" placement="right">
            <Box
              component="img"
              src={company.companyImage}
              alt="DRC Logo"
              sx={{
                width: 36,
                height: 36,
                mr:'1px',
                objectFit: "cover",
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0px 6px 18px rgba(62, 26, 137, 0.15)",
              }}
            />
          </Tooltip>
        )}
      </Toolbar>

      <List sx={{ mt: 2, px: isExpanded ? 2 : 1, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            {isExpanded ? (
              <ListItemButton
                sx={{
                  borderRadius: '12px',
                  mb: 0.8,
                  px: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  '&.Mui-selected': { bgcolor: 'rgba(167, 139, 250, 0.15)' },
                }}
                onClick={() => navigate(`/admin/${item.text.toLowerCase()}`)}
                 
              >
                <ListItemIcon sx={{ color: '#C4B5FD', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ 
                    '& .MuiTypography-root': { 
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    } 
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={item.text} placement="right" arrow>
                <ListItemButton
                  sx={{
                    borderRadius: '12px',
                    mb: 0.8,
                    px: 1.5,
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                  onClick={() => navigate(`/admin/${item.text.toLowerCase()}`)}
                 
                >
                  <ListItemIcon sx={{ color: '#C4B5FD', minWidth: 40, display: 'flex', justifyContent: 'center' }}>
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>

      {/* Logout Button at Bottom */}
      <Box sx={{ p: isExpanded ? 2 : 1, pb: 3 }}>
        {isExpanded ? (
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: '12px',
              px: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              color: '#F87171',
            }}
          >
            <ListItemIcon sx={{ color: '#F87171', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
            />
          </ListItemButton>
        ) : (
          <Tooltip title="Logout" placement="right" arrow>
            <ListItemButton
              onClick={onLogout}
              sx={{
                borderRadius: '12px',
                px: 1.5,
                justifyContent: 'center',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              <ListItemIcon sx={{ color: '#F87171', minWidth: 40, display: 'flex', justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: sidebarOpen ? drawerWidth : collapsedWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {getDrawerContent(true)}
      </Drawer>

      {/* Permanent Drawer - Collapsible on Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? drawerWidth : collapsedWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
        open
      >
        {getDrawerContent(sidebarOpen)}
      </Drawer>
    </Box>
  );
}