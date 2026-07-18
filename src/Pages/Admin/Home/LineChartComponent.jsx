import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Select, MenuItem, CircularProgress } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import api from '../../../api/axiosConfig';

export default function LineChartComponent({ year }) {
  const [filter, setFilter] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      try {
        const res = await api.get(`/adminAnalytics/businessTrends?year=${year}&timeframe=${filter}`);
        const trendsData = Array.isArray(res.data.trends) ? res.data.trends : [];
        const dataWithExpenses = trendsData.map(d => ({
          ...d,
          expenses: (d.revenue || 0) - (d.profit || 0)
        }));
        setData(dataWithExpenses);
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchTrends();
  }, [filter, year]);

  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="800">Financial Growth Trajectory</Typography>
          <Select size="small" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ height: 30, borderRadius: '6px', fontSize: '0.75rem' }}>
            <MenuItem value="week">Weekly Window</MenuItem>
            <MenuItem value="month">Monthly Window</MenuItem>
            <MenuItem value="year">Annual Summary</MenuItem>
          </Select>
        </Box>
        <Box sx={{ height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {loading ? <CircularProgress size={20} /> : (data.length > 0 ?
            <LineChart
              dataset={data}
              xAxis={[{
                scaleType: 'point',
                dataKey: 'periodLabel'
              }]}
              series={[
                { dataKey: 'revenue', label: 'Revenue (₹)', color: '#3b82f6' }, 
                { dataKey: 'profit', label: 'Profit (₹)', color: '#10b981' },
                { dataKey: 'expenses', label: 'Expenses (₹)', color: '#ef4444' }
              ]}
              height={220}
            /> :
            <Typography variant="caption" color="textSecondary">No trend data available for this period.</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}