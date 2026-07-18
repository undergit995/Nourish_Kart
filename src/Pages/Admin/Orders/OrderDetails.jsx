// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   Box, Typography, Avatar, Chip, Paper, IconButton, 
//   TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Snackbar, Alert as MuiAlert, Tooltip,
//   TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, TableSortLabel
// } from '@mui/material';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import { useDispatch, useSelector } from 'react-redux';
// import { socket } from '../../../socket';
// import { useNavigate } from 'react-router-dom';
// import api from '../../../api/axiosConfig';
// import { getOrder } from '../../../Redux/Slices/AdminSlice/OrderListSlice';

// export default function OrderRecordsTable() {
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const rawOrderList = useSelector((state) => state.orderlist?.orderlist || []);

//   // States for filtering and sorting
//   const [globalSearch, setGlobalSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [orderBy, setOrderBy] = useState('createdAt');
//   const [orderDirection, setOrderDirection] = useState('desc');

//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   const triggerSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const parseData = (rawOrders) => {
//     if (!Array.isArray(rawOrders)) return [];
//     return rawOrders.map(order => {
//       const addr = order.shippingAddress;
//       const formattedAddress = addr
//         ? `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.pincode ? `- ${addr.pincode}` : ''}`.replace(/^,\s*,?/, '').trim()
//         : "No address attached";

//       return {
//         _id: order._id,
//         email: order.customer?.email || "No email linked",
//         name: order.customer?.name || "Unknown Customer",
//         orderStatus: order.orderStatus || "order placed",
//         finalPrice: order.final_price || order.total || 0,
//         fullShippingAddress: formattedAddress || "N/A",
//         city: addr?.city || "N/A",
//         addressLabel: addr?.label?.toUpperCase() || "HOME",
//         createdAt: order.createdAt 
//           ? new Date(order.createdAt).toLocaleDateString('en-US', {
//               year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//             }) 
//           : "N/A",
//       };
//     });
//   };

//   const parsedOrders = useMemo(() => parseData(rawOrderList), [rawOrderList]);

//   const filteredAndSortedOrders = useMemo(() => {
//     let filtered = [...parsedOrders];

//     // Global Search
//     if (globalSearch) {
//       const term = globalSearch.toLowerCase();
//       filtered = filtered.filter(row =>
//         Object.values(row).some(val => String(val).toLowerCase().includes(term))
//       );
//     }

//     // Status Filter
//     if (statusFilter !== 'All') {
//       filtered = filtered.filter(row => 
//         row.orderStatus.toLowerCase() === statusFilter.toLowerCase()
//       );
//     }

//     // Sorting
//     return filtered.sort((a, b) => {
//       let valA = a[orderBy], valB = b[orderBy];
//       // Handle date sorting for 'createdAt'
//       if (orderBy === 'createdAt') {
//         valA = new Date(a.createdAt);
//         valB = new Date(b.createdAt);
//       }
//       return orderDirection === 'asc' ? (valA > valB ? 1 : -1) : (valB > valA ? 1 : -1);
//     });
//   }, [parsedOrders, globalSearch, statusFilter, orderBy, orderDirection]);

//   useEffect(() => {
//     async function fetchFromBackend() {
//       try {
//         setLoading(true);
//         const response = await api.get("/orders/admin/getAllOrders"); 
//         const backendOrders = response.data.orders || response.data || [];
        
//         dispatch(getOrder(backendOrders));
//       } catch (err) {
//         console.error("Backend connection fetch error:", err);
//         triggerSnackbar("Failed to download historical logistics data.", "error");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchFromBackend();
//   }, [dispatch]);

//   // WebSocket listener for real-time order updates
//   useEffect(() => {
//     socket.connect();

//     function onOrderUpdate(updatedOrder) {
//       console.log('Real-time admin order update received:', updatedOrder);
//       triggerSnackbar(`Order #${updatedOrder._id.slice(-6)} was updated!`, 'info');
      
//       // Update the order in the Redux store
//       const updatedList = rawOrderList.map(order => 
//         order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
//       );
//       dispatch(getOrder(updatedList));
//     }

//     socket.on('orderUpdate', onOrderUpdate);

//     // Clean up the listener and disconnect when the component unmounts
//     return () => { socket.off('orderUpdate', onOrderUpdate); socket.disconnect(); };
//   }, [dispatch, rawOrderList]);

//   const getStatusChipColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'order delivered': return 'success';
//       case 'order shipped': return 'info';
//       case 'preparing order': return 'warning';
//       case 'order cancelled': return 'error';
//       default: return 'primary';
//     }
//   };

//   const handleSortRequest = useCallback((property) => {
//     const isAsc = orderBy === property && orderDirection === 'asc';
//     setOrderDirection(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   }, [orderBy, orderDirection]);

//   if (loading) return <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}><CircularProgress size={40} thickness={4} sx={{ color: '#3B82F6' }} /></Box>;

//   return (
//     <Box sx={{ p: { xs: 1.5, sm: 3, md: 4 }, bgcolor: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
//       {/* Header Profile Section */}
//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
//         <Box>
//           <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
//             Master Enterprise Logistics Dashboard
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
//             Monitoring total ledger pipeline containing <strong style={{ color: '#3B82F6' }}>{filteredAndSortedOrders.length}</strong> indices safely routed.
//           </Typography>
//         </Box>
//         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
//           <TextField
//             placeholder="Search orders..."
//             size="small"
//             value={globalSearch}
//             onChange={(e) => setGlobalSearch(e.target.value)}
//             InputProps={{
//               startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
//               sx: { borderRadius: '12px' }
//             }}
//             sx={{ width: 280 }}
//           />
//           <FormControl size="small" sx={{ minWidth: 180 }}>
//             <InputLabel>Status</InputLabel>
//             <Select 
//               value={statusFilter} 
//               label="Status" 
//               onChange={(e) => setStatusFilter(e.target.value)}
//               sx={{ borderRadius: '12px' }}
//             >
//               <MenuItem value="All">All Statuses</MenuItem>
//               <MenuItem value="order placed">Placed</MenuItem>
//               <MenuItem value="preparing order">Preparing</MenuItem>
//               <MenuItem value="order shipped">Shipped</MenuItem>
//               <MenuItem value="order delivered">Delivered</MenuItem>
//               <MenuItem value="order cancelled">Cancelled</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>
//       </Box>
      
//       {/* Table Container surface */}
//       <TableContainer 
//         component={Paper} 
//         elevation={0}
//         variant="outlined" 
//         sx={{ 
//           borderRadius: '16px', 
//           borderColor: '#E2E8F0', 
//           overflowX: 'auto', 
//           bgcolor: '#FFFFFF',
//           boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.03)'
//         }}
//       >
//         <Table sx={{ minWidth: { xs: 700, md: '100%' }, tableLayout: 'auto' }}>
//           <ThemeHeadTable order={orderDirection} orderBy={orderBy} onRequestSort={handleSortRequest} />
//           <TableBody>
//             {filteredAndSortedOrders.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
//                   <Typography variant="subtitle1" color="text.secondary">No orders match the current filters.</Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredAndSortedOrders.map((order) => (
//               <TableRow 
//                 key={order._id} 
//                 sx={{ 
//                   '&:last-child td, &:last-child th': { border: 0 }, 
//                   transition: 'background-color 0.15s ease',
//                   '&:hover': { bgcolor: '#F8FAFC', cursor: 'pointer' } 
//                 }}
//                 onClick={() => navigate(`/admin/orders/${order._id}`)}
//               >
//                 {/* Order ID Reference */}
//                 <TableCell sx={{ py: 2 }}>
//                   <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748B', fontWeight: 700 }}>
//                     #{order._id.slice(-6).toUpperCase()}
//                   </Typography>
//                 </TableCell>

//                 {/* Customer Identity */}
//                 <TableCell sx={{ py: 2 }}>
//                   <Box display="flex" alignItems="center" gap={1.5}>
//                     <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 34, height: 34, fontSize: '13px', fontWeight: 700 }}>
//                       {order.name.charAt(0).toUpperCase()}
//                     </Avatar>
//                     <Box sx={{ maxWidth: { xs: '110px', sm: '150px' } }}>
//                       <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B', noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                         {order.name}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary" display="block" sx={{ noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                         {order.email}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>

//                 {/* Highly Compressed Address Column (Saves massive space) */}
//                 <TableCell sx={{ py: 2 }}>
//                   <Tooltip title={`Full Destination: ${order.fullShippingAddress}`} arrow placement="top">
//                     <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
//                       <LocationOnIcon sx={{ color: '#94A3B8', fontSize: 16, flexShrink: 0 }} />
//                       {order.addressLabel && <Chip 
//                         label={order.addressLabel.toUpperCase()} 
//                         size="small" 
//                         variant="soft"
//                         color="secondary"
//                         sx={{ 
//                           fontSize: '9px', 
//                           height: '18px', 
//                           fontWeight: 800, 
//                           bgcolor: '#F1F5F9', 
//                           color: '#475569',
//                           borderRadius: '4px'
//                         }}
//                       />}
//                       <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, fontSize: '13px' }}>
//                         {order.city}
//                       </Typography>
//                     </Box>
//                   </Tooltip>
//                 </TableCell>

//                 {/* System Process Date */}
//                 <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
//                   <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500, fontSize: '13px' }}>
//                     {order.createdAt}
//                   </Typography>
//                 </TableCell>

//                 {/* Current Status Mapping */}
//                 <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
//                   <Chip 
//                     label={order.orderStatus.toUpperCase()} 
//                     size="small" 
//                     color={getStatusChipColor(order.orderStatus)} 
//                     sx={{ fontSize: '10px', fontWeight: 800, borderRadius: '6px' }} 
//                   />
//                 </TableCell>

//                 {/* Price Metrics */}
//                 <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
//                   <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A' }}>
//                     ₹{order.finalPrice.toLocaleString('en-IN')}
//                   </Typography>
//                 </TableCell>

//                 {/* Inspect Action Trigger */}
//                 <TableCell align="center" sx={{ py: 2 }} onClick={(e) => e.stopPropagation()}>
//                   <IconButton 
//                     size="small" 
//                     color="primary" 
//                     onClick={() => navigate(`/admin/orders/${order._id}`)}
//                     sx={{ 
//                       backgroundColor: '#F0F9FF', 
//                       border: '1px solid #E0F2FE', 
//                       '&:hover': { backgroundColor: '#0284C7', '& .MuiSvgIcon-root': { color: '#FFFFFF' } } 
//                     }}
//                   >
//                     <VisibilityIcon fontSize="small" sx={{ color: '#0284C7' }} />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             )))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
//         <MuiAlert severity={snackbar.severity} variant="filled" elevation={4} sx={{ borderRadius: 2, fontWeight: 600 }}>{snackbar.message}</MuiAlert>
//       </Snackbar>
//     </Box>
//   );
// }

// function ThemeHeadTable({ order, orderBy, onRequestSort }) {
//   const headCells = [
//     { id: '_id', label: 'ID' },
//     { id: 'name', label: 'Customer' },
//     { id: 'city', label: 'Destination' },
//     { id: 'createdAt', label: 'Date' },
//     { id: 'orderStatus', label: 'Status' },
//     { id: 'finalPrice', label: 'Total' },
//   ];

//   return (
//     <TableHead sx={{ bgcolor: '#F1F5F9' }}>
//       <TableRow>
//         {headCells.map((cell) => (
//           <TableCell key={cell.id} sortDirection={orderBy === cell.id ? order : false} sx={{ color: '#475569', fontWeight: 700, fontSize: '13px' }}>
//             <TableSortLabel active={orderBy === cell.id} direction={orderBy === cell.id ? order : 'asc'} onClick={() => onRequestSort(cell.id)}>
//               {cell.label}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//         <TableCell align="center" sx={{ color: '#475569', fontWeight: 700, fontSize: '13px' }}>Actions</TableCell>
//       </TableRow>
//     </TableHead>
//   );
// }


import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box, Typography, Avatar, Chip, Paper, IconButton, 
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Snackbar, Alert as MuiAlert, Tooltip,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, TableSortLabel, Pagination
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../socket';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { getOrder } from '../../../Redux/Slices/AdminSlice/OrderListSlice';

export default function OrderRecordsTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rawOrderList = useSelector((state) => state.orderlist?.orderlist || []);

  // 1. ALL HOOKS PLACED AT THE TOP LEVEL OF THE COMPONENT BODY
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [orderDirection, setOrderDirection] = useState('desc');
  
  // Pagination State Variables (Explicitly set to 10 items)
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const triggerSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Helper mapping routine to parse raw complex database documents cleanly
  const parseData = (rawOrders) => {
    if (!Array.isArray(rawOrders)) return [];
    return rawOrders.map(order => {
      const addr = order.shippingAddress;
      const formattedAddress = addr
        ? `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.pincode ? `- ${addr.pincode}` : ''}`.replace(/^,\s*,?/, '').trim()
        : "No address attached";

      return {
        _id: order._id,
        email: order.customer?.email || "No email linked",
        name: order.customer?.name || "Unknown Customer",
        orderStatus: order.orderStatus || "order placed",
        finalPrice: order.final_price || order.total || 0,
        fullShippingAddress: formattedAddress || "N/A",
        city: addr?.city || "N/A",
        addressLabel: addr?.label?.toUpperCase() || "HOME",
        rawCreatedAt: order.createdAt || "", 
        createdAt: order.createdAt 
          ? new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) 
          : "N/A",
      };
    });
  };

  const parsedOrders = useMemo(() => parseData(rawOrderList), [rawOrderList]);

  // Client Side Filter & Flawless Data Chronological Sorting Computation
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...parsedOrders];

    // Global Search Logic Filter Block
    if (globalSearch) {
      const term = globalSearch.toLowerCase();
      filtered = filtered.filter(row =>
        row._id.toLowerCase().includes(term) ||
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.city.toLowerCase().includes(term) ||
        row.fullShippingAddress.toLowerCase().includes(term)
      );
    }

    // Status Filter Selection mapping
    if (statusFilter !== 'All') {
      filtered = filtered.filter(row => 
        row.orderStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Table Column Sorting Realizations
    return filtered.sort((a, b) => {
      let valA = a[orderBy], valB = b[orderBy];
      
      if (orderBy === 'createdAt') {
        valA = a.rawCreatedAt ? new Date(a.rawCreatedAt).getTime() : 0;
        valB = b.rawCreatedAt ? new Date(b.rawCreatedAt).getTime() : 0;
      }

      if (typeof valA === 'string') {
        return orderDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      return orderDirection === 'asc' ? (valA > valB ? 1 : -1) : (valB > valA ? 1 : -1);
    });
  }, [parsedOrders, globalSearch, statusFilter, orderBy, orderDirection]);

  // Fetch from backend payload effect listener mapping
  useEffect(() => {
    async function fetchFromBackend() {
      try {
        setLoading(true);
        const response = await api.get(`/orders/admin/getAllOrders?page=${page}&limit=${itemsPerPage}`); 
        const backendOrders = response.data.orders || [];
        
        // Target response.data.pagination.totalOrders cleanly
        const totalCount = response.data?.pagination?.totalOrders || response.data?.totalOrders || backendOrders.length;
        
        setTotalOrdersCount(totalCount);
        dispatch(getOrder(backendOrders));
      } catch (err) {
        console.error("Backend connection fetch error:", err);
        triggerSnackbar("Failed to download historical logistics data.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchFromBackend();
  }, [dispatch, page, itemsPerPage, triggerSnackbar]);

  // Real-time WebSocket dynamic interface synchronization adjustments
  useEffect(() => {
    socket.connect();

    function onOrderUpdate(updatedOrder) {
      console.log('Real-time admin order update received:', updatedOrder);
      triggerSnackbar(`Order #${updatedOrder._id.slice(-6)} was updated!`, 'info');
      
      const updatedList = rawOrderList.map(order => 
        order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
      );
      dispatch(getOrder(updatedList));
    }

    socket.on('orderUpdate', onOrderUpdate);
    return () => { socket.off('orderUpdate', onOrderUpdate); socket.disconnect(); };
  }, [dispatch, rawOrderList, triggerSnackbar]);

  const handleSearchChange = (e) => {
    setGlobalSearch(e.target.value);
    setPage(1); // Safely reset back to page index 1
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Safely reset back to page index 1
  };

  const handleSortRequest = useCallback((property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [orderBy, orderDirection]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'order delivered': return 'success';
      case 'order shipped': return 'info';
      case 'preparing order': return 'warning';
      case 'order cancelled': return 'error';
      default: return 'primary';
    }
  };

  const pageCount = Math.ceil(totalOrdersCount / itemsPerPage) || 1;

  // 2. CONDITIONAL RETURN (IF LOADING) IS PLACED SAFELY *AFTER* ALL HOOK INITIALIZATIONS
  if (loading) {
    return (
      <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={40} thickness={4} sx={{ color: '#3B82F6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3, md: 4 }, bgcolor: '#F8FAFC', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Table Global Controls Header Box */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
            Master Enterprise Logistics Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
            Showing page {page} of tracking ledger logs containing <strong style={{ color: '#3B82F6' }}>{filteredAndSortedOrders.length}</strong> indices.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search matching items..."
            size="small"
            value={globalSearch}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
              sx: { borderRadius: '12px' }
            }}
            sx={{ width: 280 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select 
              value={statusFilter} 
              label="Status" 
              onChange={handleStatusFilterChange}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="order placed">Placed</MenuItem>
              <MenuItem value="preparing order">Preparing</MenuItem>
              <MenuItem value="order shipped">Shipped</MenuItem>
              <MenuItem value="order delivered">Delivered</MenuItem>
              <MenuItem value="order cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Table Layout Render Block Area */}
      <TableContainer 
        component={Paper} 
        elevation={0}
        variant="outlined" 
        sx={{ 
          borderRadius: '16px', 
          borderColor: '#E2E8F0', 
          overflowX: 'auto', 
          bgcolor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.03)'
        }}
      >
        <Table sx={{ minWidth: { xs: 700, md: '100%' }, tableLayout: 'auto' }}>
          <ThemeHeadTable order={orderDirection} orderBy={orderBy} onRequestSort={handleSortRequest} />
          <TableBody>
            {filteredAndSortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Typography variant="subtitle1" color="text.secondary">No orders match the current filters.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedOrders.map((order) => (
                <TableRow 
                  key={order._id} 
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 }, 
                    transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: '#F8FAFC', cursor: 'pointer' } 
                  }}
                  onClick={() => navigate(`/admin/orders/${order._id}`)}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748B', fontWeight: 700 }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ bgcolor: '#EFF6FF', color: '#2563EB', width: 34, height: 34, fontSize: '13px', fontWeight: 700 }}>
                        {order.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ maxWidth: { xs: '110px', sm: '150px' } }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B', noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Tooltip title={`Full Destination: ${order.fullShippingAddress}`} arrow placement="top">
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon sx={{ color: '#94A3B8', fontSize: 16, flexShrink: 0 }} />
                        {order.addressLabel && <Chip 
                          label={order.addressLabel} 
                          size="small" 
                          sx={{ 
                            fontSize: '9px', 
                            height: '18px', 
                            fontWeight: 800, 
                            bgcolor: '#F1F5F9', 
                            color: '#475569',
                            borderRadius: '4px'
                          }}
                        />}
                        <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600, fontSize: '13px' }}>
                          {order.city}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500, fontSize: '13px' }}>
                      {order.createdAt}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Chip 
                      label={order.orderStatus.toUpperCase()} 
                      size="small" 
                      color={getStatusChipColor(order.orderStatus)} 
                      sx={{ fontSize: '10px', fontWeight: 800, borderRadius: '6px' }} 
                    />
                  </TableCell>

                  <TableCell sx={{ py: 2, whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      ₹{order.finalPrice.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      sx={{ 
                        backgroundColor: '#F0F9FF', 
                        border: '1px solid #E0F2FE', 
                        '&:hover': { backgroundColor: '#0284C7', '& .MuiSvgIcon-root': { color: '#FFFFFF' } } 
                      }}
                    >
                      <VisibilityIcon fontSize="small" sx={{ color: '#0284C7' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modern Center Controlled Stepped Pagination Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <Pagination 
          count={pageCount} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
          size="medium"
          sx={{
            '& .MuiPaginationItem-root': {
              fontWeight: 700,
              borderRadius: '8px'
            }
          }}
        />
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <MuiAlert severity={snackbar.severity} variant="filled" elevation={4} sx={{ borderRadius: 2, fontWeight: 600 }}>{snackbar.message}</MuiAlert>
      </Snackbar>
    </Box>
  );
}

// 3. SECURE SUB-COMPONENT IMPLEMENTATION COMPILING PERFECT CAPITALIZED NAMING STYLES
function ThemeHeadTable({ order, orderBy, onRequestSort }) {
  const headCells = [
    { id: '_id', label: 'ID' },
    { id: 'name', label: 'Customer' },
    { id: 'city', label: 'Destination' },
    { id: 'createdAt', label: 'Date' },
    { id: 'orderStatus', label: 'Status' },
    { id: 'finalPrice', label: 'Total' },
  ];

  return (
    <TableHead sx={{ bgcolor: '#F1F5F9' }}>
      <TableRow>
        {headCells.map((cell) => (
          <TableCell key={cell.id} sortDirection={orderBy === cell.id ? order : false} sx={{ color: '#475569', fontWeight: 700, fontSize: '13px' }}>
            <TableSortLabel active={orderBy === cell.id} direction={orderBy === cell.id ? order : 'asc'} onClick={() => onRequestSort(cell.id)}>
              {cell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="center" sx={{ color: '#475569', fontWeight: 700, fontSize: '13px' }}>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}
