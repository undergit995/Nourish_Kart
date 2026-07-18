import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Grid,
  Paper,
  Drawer
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Sidebar from './SideNavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import CompanyInfo from '../MyCompany/CompanyInfo';

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log("admin")

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/");
    console.log("Logged out");
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Sidebar - Handles both Mobile and Desktop Drawers */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        mobileOpen={mobileOpen} 
        onMobileClose={handleDrawerToggle} 
        onLogout={handleLogout} 
      />

      {/* Top Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          color: '#1E1154',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(12px)',
          transition: 'width 0.3s ease, margin-left 0.3s ease',
          width: { xs: '100%', md: sidebarOpen ? 'calc(100% - 260px)' : 'calc(100% - 80px)' },
          ml: { xs: 0, md: sidebarOpen ? '260px' : '80px' },
        }}
      >
        <Toolbar sx={{ minHeight: 76, px: { xs: 2, sm: 4 } }}>
          {/* Mobile Menu Button - Mobile Only (xs only) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Sidebar Toggle Button - Tablet & Desktop Only (md+) */}
          <IconButton
            color="inherit"
            onClick={handleSidebarToggle}
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              flexGrow: 1,
              color: '#1E1154',
              letterSpacing: '-0.5px',
            }}
          >
            Dashboard Overview
          </Typography>

          {/* Quick Navigation Icons - Desktop Only */}
          {/* <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 2 }}>
            {[
              { icon: <DashboardIcon />, tooltip: 'Dashboard' },
              { icon: <ShoppingBagIcon />, tooltip: 'Products' },
              { icon: <ReceiptLongIcon />, tooltip: 'Orders' },
              { icon: <PeopleIcon />, tooltip: 'Customers' },
              { icon: <BarChartIcon />, tooltip: 'Analytics' },
            ].map((item, index) => (
              <Tooltip title={item.tooltip} key={index}>
                <IconButton
                  color="inherit"
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(107, 45, 212, 0.08)',
                      color: '#6B2DD4',
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box> */}

          {/* User Profile Section */}
          <Box>
            <Tooltip title="Account Profile">
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  borderRadius: 3,
                  p: 1,
                  '&:hover': {
                    bgcolor: '#F8FAFC',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#6B2DD4',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(107, 45, 212, 0.2)',
                  }}
                >
                  AD
                </Avatar>

                <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    Admin Name
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Administrator
                  </Typography>
                </Box>
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: { sx: {
                  mt: 1,
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  minWidth: 180,
                },
              }}}
            >
              <MenuItem onClick={handleClose}>My Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: '100%', md: sidebarOpen ? 'calc(100% - 260px)' : 'calc(100% - 80px)' },
          mt: '76px', // Align with AppBar minHeight
          transition: 'width 0.3s ease',
        }}
      >
        {/* <Grid container spacing={3}>
          
          {['Total Sales', 'Active Orders', 'Total Products', 'Total Revenue'].map((title, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  border: '1px solid #E5E7EB',
                  bgcolor: '#ffffff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E1154',fontSize:{xs:10,sm:30} }}>
                  {index === 3 ? '$24,500' : Math.floor(Math.random() * 800) + 120}
                </Typography>
                <Typography variant="caption" color="#22C55E" sx={{ fontWeight: 600 }}>
                  +12.5% from last month
                </Typography>
              </Paper>
            </Grid>
          ))}

          
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '20px',
                border: '1px solid #E5E7EB',
                bgcolor: '#ffffff',
                minHeight: '420px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1E1154' }}>
                Recent Orders
              </Typography>
              <Typography color="text.secondary">
                Your data tables, charts, or custom components will go here.
              </Typography>
            </Paper>
          </Grid>
        </Grid> */}
        <Outlet/>
      </Box>
    </Box>
  );
}