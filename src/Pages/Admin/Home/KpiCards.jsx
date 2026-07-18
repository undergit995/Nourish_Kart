import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function KpiCards({ kpis }) {
  const cardData = [
    { label: 'Gross Net Revenue', val: `₹${(kpis.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <TrendingUpIcon />, color: '#10b981' },
    { label: 'Total Product Sales', val: kpis.totalProductsSold || 0, icon: <InventoryIcon />, color: '#ef4444' },
    { label: 'System Invoices', val: kpis.totalOrders || 0, icon: <ShoppingCartIcon />, color: '#3b82f6' },
    { label: 'Total Unique Clients', val: kpis.totalCustomers || 0, icon: <PeopleIcon />, color: '#8b5cf6' }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map((c, i) => (
        <Grid item xs={12} sm={6} lg={3} key={c.label}>
          <Card sx={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary" fontWeight="700" sx={{ textTransform: 'uppercase' }}>{c.label}</Typography>
                <Box sx={{ bgcolor: `${c.color}15`, color: c.color, p: 0.8, borderRadius: '6px', display: 'flex' }}>{c.icon}</Box>
              </Box>
              <Typography variant="h5" fontWeight="800">{c.val}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}