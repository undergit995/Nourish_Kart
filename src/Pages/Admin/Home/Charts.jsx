import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

// 1. Define your Top 5 products data
const topProductsData = [
  { productName: 'Wireless Earbuds', revenue: 12500 },
  { productName: 'Mechanical Keyboard', revenue: 9800 },
  { productName: 'Smart Watch Series 5', revenue: 8400 },
  { productName: 'Ergonomic Office Chair', revenue: 7200 },
  { productName: '4K UltraHD Monitor', revenue: 6100 },
];

export default function Charts() {
  return (
    <Card sx={{ maxWidth: 650, boxShadow: 3, borderRadius: 2, p: 1 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          Top 5 Best Selling Products
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Performance ranking based on total revenue ($ USD)
        </Typography>

        <Box sx={{ width: '100%', height: 350 }}>
          <BarChart
            // Pass the data array
            dataset={topProductsData}
            
            // To make it HORIZONTAL, place your product names as the Y-Axis band scale
            yAxis={[{ 
              scaleType: 'band', 
              dataKey: 'productName',
              // Adds padding so bars look nicely separated
              categoryGapRatio: 0.3 
            }]}
            
            // The X-Axis becomes the numerical scale
            xAxis={[{ 
              label: 'Revenue ($)',
              // Formats the axis labels (e.g., 12000 -> $12k)
              valueFormatter: (value) => `$${value / 1000}k` 
            }]}
            
            // Track the specific data key you want to draw bars for
            series={[
              { 
                dataKey: 'revenue', 
                label: 'Total Revenue', 
                color: '#2e7d32' // Professional green palette for revenue
              }
            ]}
            
            // Shift margins so the product names don't get cut off on the left side
            margin={{ left: 150, right: 20, top: 20, bottom: 40 }}
            
            // Makes the chart expand to its parent container sizing 
            layout="horizontal"
          />
        </Box>
      </CardContent>
    </Card>
  );
}