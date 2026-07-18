import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Select, MenuItem, CircularProgress, Grid } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import api from '../../../api/axiosConfig';

export default function BarChartComponent({ type, year }) {
  const [filter, setFilter] = useState('month');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const path = type === 'top' ? 'bestSoldProducts' : 'leastSoldProducts';
        const res = await api.get(`/adminAnalytics/${path}?year=${year}&timeframe=${filter}`);
        const total = res.data.data.reduce((sum, item) => sum + Number(item.totalQuantitySold || 0), 0);
        setData(res.data.data.map((item, idx) => ({
          label: item.productName,
          value: total > 0 ? Number(((item.totalQuantitySold / total) * 100).toFixed(1)) : 0,
          units: item.totalQuantitySold
        })));
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    fetchProducts();
  }, [filter, type, year]);

  return (
    <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="800" color={type === 'top' ? '#1e3a8a' : '#7f1d1d'}>
            {type === 'top' ? '🌟 Top Performing Catalog Assets' : '⚠️ Lowest Velocity Inventory Liabilities'}
          </Typography>
          <Select size="small" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ height: 30, borderRadius: '6px', fontSize: '0.75rem' }}>
            <MenuItem value="week">Weekly</MenuItem>
            <MenuItem value="month">Monthly</MenuItem>
            <MenuItem value="year">Annual</MenuItem>
          </Select>
        </Box>
        <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={20} /></Box>
          ) : data.length > 0 ? (
            <Grid container spacing={2} alignItems="center" sx={{display:'flex',justifyContent:'space-around'}} >
              <Grid item xs={7}>
                <BarChart layout="horizontal" dataset={data} yAxis={[{ scaleType: 'band', dataKey: 'label' }]} xAxis={[{ label: 'Share %' }]} series={[{ dataKey: 'value', color: type === 'top' ? '#3b82f6' : '#f43f5e', valueFormatter: (value) => `${(value || 0).toLocaleString()}%` }]} width={280} height={200}  />
              </Grid>
              <Grid item xs={5}>
                {data.map((item, i) => (<Box key={i} sx={{ borderBottom: '1px dashed #e2e8f0', pb: 0.5, mb: 0.5, display: 'flex', justifyContent: 'space-between' }}><Typography variant="caption" fontWeight="700" color="textSecondary" noWrap sx={{ maxWidth: 80 }}>{item.label}</Typography><Typography variant="caption" fontWeight="800">{item.units} units</Typography></Box>))}
              </Grid>
            </Grid>
          ) : (<Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center' }}>No log streams found.</Typography>)}
        </Box>
      </CardContent>
    </Card>
  );
}