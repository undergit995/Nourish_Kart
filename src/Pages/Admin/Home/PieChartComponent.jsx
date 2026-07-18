import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Select, MenuItem, CircularProgress } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import api from '../../../api/axiosConfig';

export default function PieChartComponent({ year }) {
  const [filter, setFilter] = useState('month');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFulfillmentData() {
      setLoading(true);
      try {
        const res = await api.get(`/adminAnalytics/dashboard-summary?year=${year}&timeframe=${filter}`);
        const { deliveredOrders = 0, cancelledOrders = 0 } = res.data.kpis || {};
        setData([
          { id: 0, value: deliveredOrders, label: 'Delivered', color: '#10b981' },
          { id: 1, value: cancelledOrders, label: 'Cancelled', color: '#ef4444' }
        ]);
      } catch (err) {
        console.error("Pie chart data fetch failed:", err);
        setData([]);
      }
      setLoading(false);
    }
    fetchFulfillmentData();
  }, [filter, year]);

  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="800">System Fulfillment Effectiveness</Typography>
          <Select size="small" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ height: 30, borderRadius: '6px', fontSize: '0.75rem' }}>
            <MenuItem value="week">Weekly</MenuItem>
            <MenuItem value="month">Monthly</MenuItem>
            <MenuItem value="year">Annual</MenuItem>
          </Select>
        </Box>
        <Box sx={{ height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {loading ? <CircularProgress size={20} /> : (data.reduce((sum, item) => sum + item.value, 0) > 0 ? (
            <PieChart series={[{ data, innerRadius: 60, outerRadius: 90, paddingAngle: 2, cornerRadius: 5 }]} height={200} />
          ) : (
            <Typography variant="caption" color="textSecondary">No fulfillment data for this period.</Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
