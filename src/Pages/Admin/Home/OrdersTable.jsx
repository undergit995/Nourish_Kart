import React, { useState, useMemo } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  IconButton, Chip, TablePagination, Box, TextField, FormControl, Select, MenuItem, Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

export default function OrdersTable({ orders }) {
  const navigate = useNavigate();
  const [globalSearch, setGlobalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [orderDirection, setOrderDirection] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredAndSortedOrders = useMemo(() => {
    let output = [...orders];
    if (globalSearch) {
      const term = globalSearch.toLowerCase().trim();
      output = output.filter(r => String(r._id).toLowerCase().includes(term) || String(r.customerName).toLowerCase().includes(term));
    }
    if (statusFilter && statusFilter !== 'All') {
      const target = statusFilter.toLowerCase().trim();
      output = output.filter(r => String(r.orderStatus).toLowerCase().includes(target));
    }
    return output.sort((a, b) => {
      let vA = a[orderBy], vB = b[orderBy];
      if (typeof vA === 'string') return orderDirection === 'asc' ? vA.localeCompare(vB) : vB.localeCompare(vA);
      return orderDirection === 'asc' ? vA - vB : vB - vA;
    });
  }, [orders, globalSearch, statusFilter, orderBy, orderDirection]);

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2, alignItems: { xs: 'stretch', md: 'center' } }}>
        <Typography variant="subtitle1" fontWeight="800">Operational Invoices Data Feed ({filteredAndSortedOrders.length} records)</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'stretch' }}>
          <TextField placeholder="Search Invoice ID / Customer..." size="small" value={globalSearch} onChange={(e) => { setGlobalSearch(e.target.value); setPage(0); }} sx={{ flexGrow: 1, bgcolor: 'white' }} />
          <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 }, bgcolor: 'white' }}>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
              <MenuItem value="All">All Order Statuses</MenuItem>
              <MenuItem value="order placed">Placed</MenuItem>
              <MenuItem value="preparing order">Preparing</MenuItem>
              <MenuItem value="order shipped">Shipped</MenuItem>
              <MenuItem value="order delivered">Delivered</MenuItem>
              <MenuItem value="order cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              {[{ id: '_id', label: 'Invoice ID' }, { id: 'customerName', label: 'Client Buyer' }, { id: 'createdAt', label: 'Timestamp Date' }, { id: 'orderStatus', label: 'Pipeline State' }, { id: 'final_price', label: 'Net Payment' }].map(col => (
                <TableCell key={col.id} sx={{ py: 2, fontWeight: 700 }}>
                  <TableSortLabel active={orderBy === col.id} direction={orderBy === col.id ? orderDirection : 'asc'} onClick={() => { setOrderDirection(orderBy === col.id && orderDirection === 'asc' ? 'desc' : 'asc'); setOrderBy(col.id); }}>
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row._id} hover>
                <TableCell sx={{ fontWeight: 600, color: '#0284c7', fontFamily: 'monospace' }}>#{row._id.substring(0, 8).toUpperCase()}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.customerName}</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                <TableCell><Chip label={row.orderStatus.toUpperCase()} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', borderRadius: '6px', bgcolor: row.orderStatus.includes('delivered') ? '#e8f5e9' : row.orderStatus.includes('cancelled') ? '#ffebee' : '#fff8e1', color: row.orderStatus.includes('delivered') ? '#2e7d32' : row.orderStatus.includes('cancelled') ? '#c62828' : '#f57f17' }} /></TableCell>
                <TableCell sx={{ fontWeight: 700 }}>₹{(row.final_price || 0).toFixed(2)}</TableCell>
                <TableCell align="center"><IconButton size="small" onClick={() => navigate(`/admin/orders/${row._id}`)}><VisibilityIcon fontSize="small" /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination rowsPerPageOptions={[10, 25, 50]} component="div" count={filteredAndSortedOrders.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
      </TableContainer>
    </>
  );
}