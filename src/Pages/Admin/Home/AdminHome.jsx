import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import api from '../../../api/axiosConfig';
import KpiCards from './KpiCards';
import OrdersTable from './OrdersTable';
import LineChartComponent from './LineChartComponent';
import PieChartComponent from './PieChartComponent';
import BarChartComponent from './BarChartComponent';

export default function AdminHome() {
  const year = new Date().getFullYear().toString();

  // Global Context State (Metrics Card + Data Table Feed)
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [kpis, setKpis] = useState({ totalRevenue: 0, totalCustomers: 0, totalOrders: 0, totalProductsSold: 0, deliveredOrders: 0, cancelledOrders: 0 });
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await api.get(`/adminAnalytics/dashboard-summary?year=${year}&timeframe=month`);
        setKpis(res.data.kpis);
        setOrdersList(res.data.orders);
      } catch (err) {
        console.error("Summary execution failed:", err);
      } finally {
        setSummaryLoading(false);
      }
    }
    loadSummary();
  }, [year]);

  if (summaryLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary" fontWeight="600">Syncing Corporate Operations Desk...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" color="#0f172a">PowerBites Business Suite</Typography>
        <Typography variant="body2" color="textSecondary">Enterprise Data Ledger & Analytics Operations Desk</Typography>
      </Box>

      <KpiCards kpis={kpis} />

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid size ={{xs:12,md:6 }} ><BarChartComponent type="top" year={year} /></Grid>
        <Grid size ={{xs:12,md:6 }} ><BarChartComponent type="least" year={year} /></Grid>
        <Grid size ={{xs:12,md:6 }}><PieChartComponent year={year} /></Grid>
        <Grid size ={{xs:12,md:6 }}><LineChartComponent year={year} /></Grid>
      </Grid>

      <OrdersTable orders={ordersList} />
    </Box>
  );
}