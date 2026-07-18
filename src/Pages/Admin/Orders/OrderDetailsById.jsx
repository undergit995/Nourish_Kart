
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   Box, Typography, Divider, Stepper, Step, StepLabel, 
//   Avatar, Chip, Stack, Paper, Button, Snackbar, CircularProgress,
//   Alert as MuiAlert, Dialog, DialogTitle, DialogContent, DialogActions, TextField
// } from '@mui/material';
// import Grid from '@mui/material/Grid';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import FastfoodIcon from '@mui/icons-material/Fastfood';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import RefundIcon from '@mui/icons-material/AttachMoney';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../../api/axiosConfig';
// import { socket } from '../../../socket';
// import { getOrder } from '../../../Redux/Slices/AdminSlice/OrderListSlice';

// const BASE_STEPS = ["order placed", "preparing order", "order shipped", "order delivered", "completed"];

// const STEP_LABELS_MAP = {
//   "order placed": "Order Placed",
//   "preparing order": "Preparing Order",
//   "order shipped": "Order Shipped",
//   "order delivered": "Order Delivered",
//   "completed": "Order Completed",
//   "order cancelled": "Order Cancelled", 
//   "refund pending": "Refund Pending",
//   "refunded": "Refund Processed"
// };

// export default function OrderRecordsDashboardById() {
//   const { id: routeOrderId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const [loading, setLoading] = useState(false);
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [cancelReasonInput, setCancelReasonInput] = useState("");
//   const [isRefunding, setIsRefunding] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

//   // Wrapped in useCallback to prevent unnecessary re-renders of components that use it.
//   const triggerSnackbar = useCallback((message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   }, []);

//   const rawOrderList = useSelector((state) => state.orderlist?.orderlist || []);
//   const activeBackendOrder = rawOrderList.find(o => o._id === routeOrderId);

//   const activeOrder = activeBackendOrder ? {
//     _id: activeBackendOrder._id,
//     name: activeBackendOrder.customer?.name || "Unknown Customer",
//     email: activeBackendOrder.customer?.email || "No email linked",
//     orderStatus: activeBackendOrder.orderStatus ? activeBackendOrder.orderStatus.toLowerCase() : "", 
//     historyStatuses: Array.isArray(activeBackendOrder.historyStatuses) 
//       ? activeBackendOrder.historyStatuses.map(s => s.toLowerCase()) 
//       : [],
//     cancelledBy: activeBackendOrder.cancelledBy || "system",
//     cancelReason: activeBackendOrder.cancelReason || "",
//     addressObj: activeBackendOrder.shippingAddress || {},
//     finalPrice: activeBackendOrder.final_price || activeBackendOrder.total || 0,
//     products: Array.isArray(activeBackendOrder.products) ? activeBackendOrder.products.map((p, pIndex) => ({
//       id: p._id || `prod-${pIndex}`,
//       name: p.product?.name || "Unknown Item",
//       quantity: p.quantity || 1,
//       discounted_price: p.discounted_price || p.price || 0,
//       category: p.product?.category || "Food Item",
//       image: p.image ? p.image.replace(/\\/g, '/') : ""
//     })) : []
//   } : null;

//   const isCancelled = ["order cancelled", "refund pending", "refunded"].includes(activeOrder?.orderStatus);
//   const isRefundPending = activeOrder?.orderStatus === "refund pending";
//   // Allow cancellation only in early stages.
//   const canCancel = ["order placed", "preparing order"].includes(activeOrder?.orderStatus || "");

//   const getWorkflowSteps = () => {
//     if (!activeOrder) return BASE_STEPS;
    
//     if (isCancelled) {
//       const stepsBeforeCancellation = BASE_STEPS.filter(s => 
//         activeOrder.historyStatuses.includes(s) || s === "order placed"
//       );
//       return [...stepsBeforeCancellation, "order cancelled", "refund pending", "refunded"];
//     }
    
//     return BASE_STEPS;
//   };

//   const workflowSteps = getWorkflowSteps();

//   useEffect(() => {
//     if (rawOrderList.length === 0) {
//       const fetchFromBackend = async () => {
//         try {
//           setLoading(true);
//           const response = await api.get("/orders/admin/getAllOrders");
//           dispatch(getOrder(response.data.orders || response.data || []));
//         } catch (err) {
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchFromBackend();
//     }
//   }, [dispatch, rawOrderList.length]);

//   // WebSocket listener for real-time updates
//   useEffect(() => {
//     socket.connect();

//     function onOrderUpdate(updatedOrder) {
//       if (updatedOrder._id === routeOrderId) {
//         triggerSnackbar(`Order status updated to: ${updatedOrder.orderStatus}`, 'info');
        
//         const updatedList = rawOrderList.map(order => 
//           order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
//         );
//         dispatch(getOrder(updatedList));
//       }
//     }

//     socket.on('orderUpdate', onOrderUpdate);

//     return () => { 
//       socket.off('orderUpdate', onOrderUpdate); 
//       socket.disconnect(); 
//     };
//   }, [dispatch, rawOrderList, routeOrderId, triggerSnackbar]);

//   // Function to handle the manual refund process.
//   const handleManualRefund = async () => {
//     try {
//       setIsRefunding(true);
//       await api.post(`/orderStatus/manualRefund/${routeOrderId}`);
//       triggerSnackbar("Manual refund processed successfully", "success");
//     } catch (err) {
//       triggerSnackbar("Failed to complete manual refund", "error");
//     } finally {
//       setIsRefunding(false);
//     }
//   };

//   const handleConfirmCancelOrder = async () => {
//     if (!cancelReasonInput.trim()) return triggerSnackbar("Please provide a reason", "warning");

//     try {
//       await api.post(`/orderStatus/adminCancelling/${routeOrderId}`, { reason: cancelReasonInput.trim() });
      
//       const updatedList = rawOrderList.map(order => 
//         order._id === routeOrderId 
//           ? { 
//               ...order, 
//               orderStatus: "refund pending", // Transition to refund pending after cancellation
//               cancelledBy: "admin", 
//               cancelReason: cancelReasonInput.trim(),
//               historyStatuses: Array.isArray(order.historyStatuses) ? [...order.historyStatuses] : ["order placed"]
//             } 
//           : order
//       );
//       dispatch(getOrder(updatedList));
      
//       setCancelDialogOpen(false);
//       triggerSnackbar("Order cancelled successfully. Refund pipeline initialized.", "success");
//     } catch (err) {
//       triggerSnackbar("Failed to cancel order", "error");
//     }
//   };

//   const handleUpdateStatus = async (orderId, targetStatus) => {
//     if (isCancelled) return; // Prevent status updates on a cancelled order.

//     try {
//       await api.post(`/orderStatus/updateStatus/${orderId}`, { status: targetStatus });
      
//       const updatedList = rawOrderList.map(order => {
//         if (order._id === orderId) {
//           const current = Array.isArray(order.historyStatuses) ? [...order.historyStatuses] : [];
//           if (!current.map(s => s.toLowerCase()).includes(targetStatus)) {
//             current.push(targetStatus);
//           }
//           return { ...order, orderStatus: targetStatus, historyStatuses: current };
//         }
//         return order;
//       });

//       dispatch(getOrder(updatedList));
//       triggerSnackbar(`Status updated to ${STEP_LABELS_MAP[targetStatus]}`, "success");
//     } catch (err) {
//       triggerSnackbar("Failed to update status", "error");
//     }
//   };

//   const renderCustomStepIcon = (stepKey) => {
//     // Find the index of the current active status in the workflow.
//     const activeStatusIndex = workflowSteps.indexOf(activeOrder?.orderStatus);
//     // Find the index of the step currently being rendered.
//     const currentStepIndex = workflowSteps.indexOf(stepKey);
    
//     // A step is considered "completed" if its index is less than or equal to the active status's index.
//     const isCompleted = currentStepIndex <= activeStatusIndex;
    
//     if (isCompleted) {
//       if (stepKey === "order cancelled") return <CancelIcon sx={{ color: '#EF4444', fontSize: 28 }} />;
//       return <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28 }} />;
//     }

//     if (stepKey === "order cancelled") {
//       return <CancelIcon sx={{ color: '#EF4444', fontSize: 28 }} />;
//     } else if (["refund pending", "refunded"].includes(stepKey)) {
//       // Use a different color for pending vs. completed refund icon if not checked
//       return <RefundIcon sx={{ color: '#64748B', fontSize: 28 }} />;
//     }
    
//     // Default icon for steps that are not completed and not special cases
//     return <Box sx={{ width: 26, height: 26, borderRadius: '50%', border: '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px', fontWeight: 700, bgcolor: '#fff' }}>{BASE_STEPS.indexOf(stepKey) + 1}</Box>;
//   };

//   if (loading) return <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><CircularProgress size={40} /></Box>;
//   if (!activeOrder) return <Box sx={{ p: 6, textAlign: 'center' }}><Typography color="text.secondary">Order not found</Typography></Box>;

//   return (
//     <Box sx={{ p: { xs: 2, sm: 3, md: 5 }, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      
//       {/* Header Container Area */}
//       <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 5, bgcolor: '#fff', p: 2.5, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ fontWeight: 700, color: '#475569', textTransform: 'none', '&:hover': { bgcolor: '#f1f5f9' } }}>
//           Back to Orders List
//         </Button>
        
//         <Stack direction="row" spacing={2} alignItems="center">
//           <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', color: '#64748B', bgcolor: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '8px', border: '1px solid #e2e8f0' }}>
//             #{activeOrder._id.toUpperCase()}
//           </Typography>
//           {canCancel && (
//             <Button 
//               variant="contained" 
//               color="error" 
//               onClick={() => setCancelDialogOpen(true)}
//               sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', px: 2.5 }}
//             >
//               Cancel Order
//             </Button>
//           )}
//           {isRefundPending && (
//             <Button
//               variant="contained"
//               color="success"
//               onClick={handleManualRefund}
//               disabled={isRefunding}
//               startIcon={isRefunding ? <CircularProgress size={18} color="inherit" /> : <RefundIcon />}
//               sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, boxShadow: 'none', px: 2.5 }}
//             >
//               {isRefunding ? 'Processing...' : 'Process Refund'}
//             </Button>
//           )}
//         </Stack>
//       </Box>

//       <Grid container spacing={4}>
//         {/* Left Grid Side Container */}
//         <Grid item xs={12} lg={7}>
//           <Stack spacing={4}>
//             <Paper sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
//               <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
//                 <Typography variant="h6" fontWeight="800" color="#1e293b">Order Items</Typography>
//               </Box>
//               {activeOrder.products.map((item, idx) => (
//                 <Box key={item.id}>
//                   <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:hover': { bgcolor: '#FAFAFA' } }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
//                       <Avatar src={item.image} variant="rounded" sx={{ width: 72, height: 72, borderRadius: '12px', bgcolor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#4f46e5' }}>
//                         {!item.image && <FastfoodIcon />}
//                       </Avatar>
//                       <Box>
//                         <Typography variant="h6" fontWeight="700" color="#0f172a">{item.name}</Typography>
//                         <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Qty: {item.quantity}</Typography>
//                       </Box>
//                     </Box>
//                     <Typography variant="h6" fontWeight="800" color="#0F172A">
//                       ₹{(item.discounted_price * item.quantity).toLocaleString('en-IN')}
//                     </Typography>
//                   </Box>
//                   {idx < activeOrder.products.length - 1 && <Divider />}
//                 </Box>
//               ))}
//             </Paper>

//             <Paper sx={{ p: 4, borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', bgcolor: '#4f46e5' }}>
//               <Typography color="rgba(255,255,255,0.7)" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>Total Amount</Typography>
//               <Typography variant="h3" fontWeight="900" color="#fff" sx={{ mt: 1 }}>
//                 ₹{activeOrder.finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//               </Typography>
//             </Paper>
//           </Stack>
//         </Grid>

//         {/* Right Grid Side Container */}
//         <Grid item xs={12} lg={5}>
//           <Stack spacing={4}>
//             <Paper sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
//               <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
//                 <Typography variant="h6" fontWeight="800" color="#1e293b">Customer & Delivery</Typography>
//               </Box>
//               <Box sx={{ p: 3.5 }}>
//                 <Typography variant="subtitle1" fontWeight="700" color="#0f172a">{activeOrder.name}</Typography>
//                 <Typography color="text.secondary" sx={{ fontWeight: 500 }}>{activeOrder.email}</Typography>
//                 <Divider sx={{ my: 3 }} />
//                 <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Address</Typography>
//                 <Typography sx={{ mt: 1, fontWeight: 600, color: '#475569', lineHeight: 1.6 }}>
//                   {activeOrder.addressObj?.street || "N/A"}, {activeOrder.addressObj?.city || ""}<br />
//                   {activeOrder.addressObj?.state || ""} - {activeOrder.addressObj?.pincode || ""}
//                 </Typography>
//               </Box>
//             </Paper>

//             {/* PROGRESS AND TIMELINE OVERRIDE STEPPER BLOCK */}
//             <Paper sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
//               <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
//                 <Typography variant="h6" fontWeight="800" color="#1e293b">Order Progress</Typography>
//               </Box>
//               <Box sx={{ p: 4, bgcolor: '#fff' }}>
//                 {isCancelled && (
//                   <Box sx={{ mb: 3, p: 2, bgcolor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
//                     <Typography variant="body2" sx={{ color: '#92400e', fontWeight: 700, textTransform: 'capitalize' }}>
//                       Order Cancelled by: {activeOrder.cancelledBy}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: '#b45309', display: 'block', mt: 0.5, fontSize: '0.85rem' }}>
//                       {activeOrder.cancelReason || "No descriptive context reason compiled."}
//                     </Typography>
//                   </Box>
//                 )}

//                 <Stepper orientation="vertical">
//                   {workflowSteps.map((stepKey) => {
//                     const activeStatusIndex = workflowSteps.indexOf(activeOrder?.orderStatus);
//                     const currentStepIndex = workflowSteps.indexOf(stepKey);
//                     const isCompleted = currentStepIndex <= activeStatusIndex;
                    
//                     // A step is clickable only if it's not a special final state (like refund)
//                     // AND it has not already been completed. This locks previous steps.
//                     const isClickable = !isCancelled && 
//                                         !["refund pending", "refunded", "order cancelled"].includes(stepKey) &&
//                                         !isCompleted;

//                     return (
//                       <Step key={stepKey} completed={isCompleted}>
//                         <StepLabel 
//                           StepIconComponent={() => renderCustomStepIcon(stepKey)}
//                           onClick={() => isClickable && handleUpdateStatus(activeOrder._id, stepKey)}
//                           sx={{ 
//                             cursor: isClickable ? 'pointer' : 'default',
//                             py: 1.5,
//                             borderRadius: '8px',
//                             px: 1,
//                             '&:hover': { bgcolor: isClickable ? '#F8FAFC' : 'transparent' }
//                           }}
//                         >
//                           <Typography 
//                             fontWeight={isCompleted ? 800 : 600}
//                             color={stepKey === "order cancelled" ? "error.main" : 
//                                    stepKey === "refunded" ? "success.main" :
//                                    stepKey === "refund pending" ? "warning.dark" : "#334155"}
//                           >
//                             {STEP_LABELS_MAP[stepKey]}
//                           </Typography>
//                         </StepLabel>
//                       </Step>
//                     );
//                   })}
//                 </Stepper>
//               </Box>
//             </Paper>
//           </Stack>
//         </Grid>
//       </Grid>

//       {/* Cancellation Handler Modal */}
//       <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
//         <DialogTitle sx={{ fontWeight: 800 }}>Cancel Order & Process Refund</DialogTitle>
//         <DialogContent dividers>
//           <TextField
//             autoFocus
//             fullWidth
//             multiline
//             rows={4}
//             placeholder="Provide a mandatory reason for stopping fulfillment..."
//             value={cancelReasonInput}
//             onChange={(e) => setCancelReasonInput(e.target.value)}
//             InputProps={{ sx: { borderRadius: '12px' } }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={() => setCancelDialogOpen(false)} color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>Dismiss</Button>
//           <Button onClick={handleConfirmCancelOrder} variant="contained" color="error" disableElevation sx={{ fontWeight: 700, textTransform: 'none', borderRadius: '10px' }}>
//             Confirm Cancellation
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Notification Toast Layer */}
//       <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar(p => ({...p, open: false}))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//         <MuiAlert severity={snackbar.severity} variant="filled" elevation={6} sx={{ borderRadius: '12px', fontWeight: 700 }}>
//           {snackbar.message}
//         </MuiAlert>
//       </Snackbar>
//     </Box>
//   );
// }


import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Divider, Stepper, Step, StepLabel,
  Avatar, Stack, Paper, Button, Snackbar, CircularProgress,
  Alert as MuiAlert, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RefundIcon from '@mui/icons-material/AttachMoney';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosConfig';
import { socket } from '../../../socket';
import { getOrder } from '../../../Redux/Slices/AdminSlice/OrderListSlice';

const BASE_STEPS = ["order placed", "preparing order", "order shipped", "order delivered"];

const STEP_LABELS_MAP = {
  "order placed": "Order Placed",
  "preparing order": "Preparing Order",
  "order shipped": "Order Shipped",
  "order delivered": "Order Delivered",
  "order cancelled": "Order Cancelled",
  "refund pending": "Refund Pending",
  "refunded": "Refund Processed"
};

const statusChipStyles = {
  "order placed": { bgcolor: "#EFF6FF", color: "#1D4ED8" },
  "preparing order": { bgcolor: "#FFF7ED", color: "#C2410C" },
  "order shipped": { bgcolor: "#EEF2FF", color: "#4F46E5" },
  "order delivered": { bgcolor: "#ECFDF5", color: "#059669" },
  "order cancelled": { bgcolor: "#FEF2F2", color: "#DC2626" },
  "refund pending": { bgcolor: "#FFFBEB", color: "#B45309" },
  "refunded": { bgcolor: "#ECFDF5", color: "#047857" },
};

export default function OrderRecordsDashboardById() {
  const { id: routeOrderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState("");
  const [isRefunding, setIsRefunding] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const triggerSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const rawOrderList = useSelector((state) => state.orderlist?.orderlist || []);
  const activeBackendOrder = rawOrderList.find(o => o._id === routeOrderId);

  const activeOrder = activeBackendOrder ? {
    _id: activeBackendOrder._id,
    name: activeBackendOrder.customer?.name || "Unknown Customer",
    email: activeBackendOrder.customer?.email || "No email linked",
    orderStatus: activeBackendOrder.orderStatus ? activeBackendOrder.orderStatus.toLowerCase() : "",
    historyStatuses: Array.isArray(activeBackendOrder.historyStatuses)
      ? activeBackendOrder.historyStatuses.map(s => s.toLowerCase())
      : [],
    cancelledBy: activeBackendOrder.cancelledBy || "system",
    cancelReason: activeBackendOrder.cancelReason || "",
    addressObj: activeBackendOrder.shippingAddress || {},
    finalPrice: activeBackendOrder.final_price || activeBackendOrder.total || 0,
    products: Array.isArray(activeBackendOrder.products)
      ? activeBackendOrder.products.map((p, pIndex) => ({
          id: p._id || `prod-${pIndex}`,
          name: p.product?.name || "Unknown Item",
          quantity: p.quantity || 1,
          discounted_price: p.discounted_price || p.price || 0,
          category: p.product?.category || "Food Item",
          image: p.image ? p.image.replace(/\\/g, '/') : ""
        }))
      : []
  } : null;

  const isCancelled = ["order cancelled", "refund pending", "refunded"].includes(activeOrder?.orderStatus);
  const isRefundPending = activeOrder?.orderStatus === "refund pending";
  const canCancel = ["order placed", "preparing order"].includes(activeOrder?.orderStatus || "");

  const getWorkflowSteps = () => {
    if (!activeOrder) return BASE_STEPS;
    if (isCancelled) {
      const stepsBeforeCancellation = BASE_STEPS.filter(s =>
        activeOrder.historyStatuses.includes(s) || s === "order placed"
      );
      return [...stepsBeforeCancellation, "order cancelled", "refund pending", "refunded"];
    }
    return BASE_STEPS;
  };

  const workflowSteps = getWorkflowSteps();

  useEffect(() => {
    if (rawOrderList.length === 0) {
      const fetchFromBackend = async () => {
        try {
          setLoading(true);
          const response = await api.get("/orders/admin/getAllOrders");
          dispatch(getOrder(response.data.orders || response.data || []));
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchFromBackend();
    }
  }, [dispatch, rawOrderList.length]);

  useEffect(() => {
    socket.connect();

    function onOrderUpdate(updatedOrder) {
      if (updatedOrder._id === routeOrderId) {
        triggerSnackbar(`Order status updated to: ${updatedOrder.orderStatus}`, 'info');
        const updatedList = rawOrderList.map(order =>
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        );
        dispatch(getOrder(updatedList));
      }
    }

    socket.on('orderUpdate', onOrderUpdate);

    return () => {
      socket.off('orderUpdate', onOrderUpdate);
      socket.disconnect();
    };
  }, [dispatch, rawOrderList, routeOrderId, triggerSnackbar]);

  const handleManualRefund = async () => {
    try {
      setIsRefunding(true);
      await api.post(`/orderStatus/manualRefund/${routeOrderId}`);
      triggerSnackbar("Manual refund processed successfully", "success");
    } catch (err) {
      triggerSnackbar("Failed to complete manual refund", "error");
    } finally {
      setIsRefunding(false);
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelReasonInput.trim()) return triggerSnackbar("Please provide a reason", "warning");

    try {
      await api.post(`/orderStatus/adminCancelling/${routeOrderId}`, { reason: cancelReasonInput.trim() });

      const updatedList = rawOrderList.map(order =>
        order._id === routeOrderId
          ? {
              ...order,
              orderStatus: "refund pending",
              cancelledBy: "admin",
              cancelReason: cancelReasonInput.trim(),
              historyStatuses: Array.isArray(order.historyStatuses) ? [...order.historyStatuses] : ["order placed"]
            }
          : order
      );
      dispatch(getOrder(updatedList));

      setCancelDialogOpen(false);
      triggerSnackbar("Order cancelled successfully. Refund pipeline initialized.", "success");
    } catch (err) {
      triggerSnackbar("Failed to cancel order", "error");
    }
  };

  const handleUpdateStatus = async (orderId, targetStatus) => {
    if (isCancelled) return;

    try {
      await api.post(`/orderStatus/updateStatus/${orderId}`, { status: targetStatus });

      const updatedList = rawOrderList.map(order => {
        if (order._id === orderId) {
          const current = Array.isArray(order.historyStatuses) ? [...order.historyStatuses] : [];
          if (!current.map(s => s.toLowerCase()).includes(targetStatus)) {
            current.push(targetStatus);
          }
          return { ...order, orderStatus: targetStatus, historyStatuses: current };
        }
        return order;
      });

      dispatch(getOrder(updatedList));
      triggerSnackbar(`Status updated to ${STEP_LABELS_MAP[targetStatus]}`, "success");
    } catch (err) {
      triggerSnackbar("Failed to update status", "error");
    }
  };

  const renderCustomStepIcon = (stepKey) => {
    const activeStatusIndex = workflowSteps.indexOf(activeOrder?.orderStatus);
    const currentStepIndex = workflowSteps.indexOf(stepKey);
    const isCompleted = currentStepIndex <= activeStatusIndex;

    if (isCompleted) {
      if (stepKey === "order cancelled") return <CancelIcon sx={{ color: '#EF4444', fontSize: 28 }} />;
      return <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28 }} />;
    }

    if (stepKey === "order cancelled") return <CancelIcon sx={{ color: '#EF4444', fontSize: 28 }} />;
    if (["refund pending", "refunded"].includes(stepKey)) return <RefundIcon sx={{ color: '#64748B', fontSize: 28 }} />;

    return (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '2px solid #CBD5E1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B',
          fontSize: '13px',
          fontWeight: 800,
          bgcolor: '#fff',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)'
        }}
      >
        {BASE_STEPS.indexOf(stepKey) + 1}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!activeOrder) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">Order not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 1.25, sm: 2, md: 4, lg: 5 },
        overflowX: 'hidden',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)'
      }}
    >
      <Box
        sx={{
          mb: 4,
          p: { xs: 1.5, sm: 2.5, md: 3 },
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
          backdropFilter: 'blur(10px)',
          minWidth: 0
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          gap={2}
          flexDirection={{ xs: 'column', md: 'row' }}
          sx={{ width: '100%', minWidth: 0 }}
        >
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                fontWeight: 800,
                color: '#475569',
                textTransform: 'none',
                px: 0,
                mb: 1,
                '&:hover': { bgcolor: 'transparent', color: '#1E293B' }
              }}
            >
              Back to Orders List
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                fontSize: { xs: '1.35rem', sm: '1.8rem', md: '2.2rem' },
                wordBreak: 'break-word',
                overflowWrap: 'anywhere'
              }}
            >
              Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 600, overflowWrap: 'anywhere' }}>
              Manage status, refund flow, and customer delivery information.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"

            useFlexGap
            sx={{
              width: '100%',
              justifyContent: { xs: 'flex-start' },
              flexDirection: { xs: 'column', sm: 'row' },
              minWidth: 0
            }}
          >
            <Chip
              label={`#${activeOrder._id.toUpperCase()}`}
              sx={{
                fontWeight: 800,
                borderRadius: '999px',
                bgcolor: '#EEF2FF',
                color: '#4338CA',
                border: '1px solid #C7D2FE',
                maxWidth: '100%'
              }}
            />
            <Chip
              label={STEP_LABELS_MAP[activeOrder.orderStatus] || activeOrder.orderStatus}
              sx={{
                fontWeight: 800,
                borderRadius: '999px',
                px: 1,
                ...statusChipStyles[activeOrder.orderStatus],
                maxWidth: '100%'
              }}
            />
            {canCancel && (
              <Button
                fullWidth={{ xs: true, sm: false }}
                variant="contained"
                color="error"
                onClick={() => setCancelDialogOpen(true)}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 800,
                  px: 2.5,
                  boxShadow: '0 10px 18px rgba(239,68,68,0.18)'
                }}
              >
                Cancel Order
              </Button>
            )}
            {isRefundPending && (
              <Button
                fullWidth={{ xs: true, sm: false }}
                variant="contained"
                color="success"
                onClick={handleManualRefund}
                disabled={isRefunding}
                startIcon={isRefunding ? <CircularProgress size={18} color="inherit" /> : <RefundIcon />}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 800,
                  px: 2.5,
                  boxShadow: '0 10px 18px rgba(16,185,129,0.18)'
                }}
              >
                {isRefunding ? 'Processing...' : 'Process Refund'}
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3.5 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3.5} sx={{ minWidth: 0 }}>
            <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)', border: '1px solid rgba(226, 232, 240, 0.95)', minWidth: 0 }}>
              <Box sx={{ p: { xs: 2, sm: 3 }, background: 'linear-gradient(90deg, #F8FAFC 0%, #FFFFFF 100%)', borderBottom: '1px solid #E2E8F0' }}>
                <Typography variant="h6" fontWeight="900" color="#0F172A">Order Items</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {activeOrder.products.length} item(s) in this order
                </Typography>
              </Box>

              {activeOrder.products.map((item, idx) => (
                <Box key={item.id} sx={{ minWidth: 0 }}>
                  <Box
                    sx={{
                      p: { xs: 2, sm: 3 },
                      display: 'flex',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                      flexDirection: { xs: 'column', sm: 'row' },
                      transition: 'all 0.2s ease',
                      '&:hover': { bgcolor: '#F8FAFC' },
                      minWidth: 0
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, width: '100%', minWidth: 0 }}>
                      <Avatar
                        src={item.image}
                        variant="rounded"
                        sx={{
                          width: { xs: 58, sm: 76 },
                          height: { xs: 58, sm: 76 },
                          borderRadius: '18px',
                          bgcolor: '#EEF2FF',
                          border: '1px solid #E2E8F0',
                          color: '#4F46E5',
                          boxShadow: '0 8px 18px rgba(79,70,229,0.08)',
                          flexShrink: 0
                        }}
                      >
                        {!item.image && <FastfoodIcon />}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight="800"
                          color="#0F172A"
                          sx={{
                            lineHeight: 1.2,
                            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere'
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.8, flexWrap: 'wrap' }}>
                          <Chip
                            label={`Qty ${item.quantity}`}
                            size="small"
                            sx={{ fontWeight: 700, bgcolor: '#F1F5F9', color: '#475569', borderRadius: '999px' }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {item.category}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, width: { xs: '100%', sm: 'auto' }, minWidth: 0 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Item Total
                      </Typography>
                      <Typography variant="h6" fontWeight="900" color="#0F172A" sx={{ wordBreak: 'break-word' }}>
                        ₹{(item.discounted_price * item.quantity).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Box>
                  {idx < activeOrder.products.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>

            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                boxShadow: '0 16px 34px rgba(79,70,229,0.22)',
                minWidth: 0
              }}
            >
              <Typography color="rgba(255,255,255,0.75)" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                Total Amount
              </Typography>
              <Typography variant="h3" fontWeight="900" color="#fff" sx={{ mt: 1, fontSize: { xs: '1.9rem', sm: '2.4rem', md: '3rem' }, wordBreak: 'break-word' }}>
                ₹{activeOrder.finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </Typography>
              <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                Final billed amount for this order
              </Typography>
            </Paper>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3.5} sx={{ minWidth: 0 }}>
            <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)', border: '1px solid rgba(226, 232, 240, 0.95)', minWidth: 0 }}>
              <Box sx={{ p: { xs: 2, sm: 3 }, background: 'linear-gradient(90deg, #F8FAFC 0%, #FFFFFF 100%)', borderBottom: '1px solid #E2E8F0' }}>
                <Typography variant="h6" fontWeight="900" color="#0F172A">Customer & Delivery</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Recipient and shipping details
                </Typography>
              </Box>
              <Box sx={{ p: { xs: 2.5, sm: 3.5 }, minWidth: 0 }}>
                <Typography variant="h6" fontWeight="800" color="#0F172A" sx={{ wordBreak: 'break-word' }}>
                  {activeOrder.name}
                </Typography>
                <Typography color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {activeOrder.email}
                </Typography>
                <Divider sx={{ my: 2.5 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Delivery Address
                </Typography>
                <Typography sx={{ mt: 1, fontWeight: 600, color: '#475569', lineHeight: 1.7, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {activeOrder.addressObj?.street || "N/A"}, {activeOrder.addressObj?.city || ""}<br />
                  {activeOrder.addressObj?.state || ""} - {activeOrder.addressObj?.pincode || ""}
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)', border: '1px solid rgba(226, 232, 240, 0.95)', minWidth: 0 }}>
              <Box sx={{ p: { xs: 2, sm: 3 }, background: 'linear-gradient(90deg, #F8FAFC 0%, #FFFFFF 100%)', borderBottom: '1px solid #E2E8F0' }}>
                <Typography variant="h6" fontWeight="900" color="#0F172A">Order Progress</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Track fulfillment and completion
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 2, sm: 2.5, md: 4 }, bgcolor: '#fff', minWidth: 0 }}>
                {isCancelled && (
                  <Box sx={{ mb: 3, p: 2.2, bgcolor: '#FFFBEB', borderLeft: '4px solid #F59E0B', borderRadius: '14px', minWidth: 0 }}>
                    <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 800, textTransform: 'capitalize', wordBreak: 'break-word' }}>
                      Order Cancelled by: {activeOrder.cancelledBy}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#B45309', display: 'block', mt: 0.75, fontSize: '0.9rem', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {activeOrder.cancelReason || "No descriptive context reason compiled."}
                    </Typography>
                  </Box>
                )}

                <Stepper orientation="vertical" sx={{ minWidth: 0 }}>
                  {workflowSteps.map((stepKey) => {
                    const activeStatusIndex = workflowSteps.indexOf(activeOrder?.orderStatus);
                    const currentStepIndex = workflowSteps.indexOf(stepKey);
                    const isCompleted = currentStepIndex <= activeStatusIndex;

                    const isClickable = !isCancelled &&
                      !["refund pending", "refunded", "order cancelled"].includes(stepKey) &&
                      !isCompleted;

                    return (
                      <Step key={stepKey} completed={isCompleted}>
                        <StepLabel
                          StepIconComponent={() => renderCustomStepIcon(stepKey)}
                          onClick={() => isClickable && handleUpdateStatus(activeOrder._id, stepKey)}
                          sx={{
                            cursor: isClickable ? 'pointer' : 'default',
                            py: 1.4,
                            px: 1.25,
                            borderRadius: '14px',
                            transition: 'all 0.2s ease',
                            '&:hover': { bgcolor: isClickable ? '#F8FAFC' : 'transparent' },
                            minWidth: 0
                          }}
                        >
                          <Typography
                            fontWeight={isCompleted ? 900 : 700}
                            sx={{
                              color:
                                stepKey === "order cancelled" ? "#DC2626" :
                                stepKey === "refunded" ? "#059669" :
                                stepKey === "refund pending" ? "#B45309" : "#334155",
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere'
                            }}
                          >
                            {STEP_LABELS_MAP[stepKey]}
                          </Typography>
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '22px', overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, bgcolor: '#FEF2F2', color: '#991B1B' }}>
          Cancel Order & Process Refund
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            A reason is required before cancellation is submitted.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            placeholder="Provide a mandatory reason for stopping fulfillment..."
            value={cancelReasonInput}
            onChange={(e) => setCancelReasonInput(e.target.value)}
            InputProps={{ sx: { borderRadius: '16px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: '#FAFAFA' }}>
          <Button onClick={() => setCancelDialogOpen(false)} color="inherit" sx={{ fontWeight: 800, textTransform: 'none', borderRadius: '12px' }}>
            Dismiss
          </Button>
          <Button onClick={handleConfirmCancelOrder} variant="contained" color="error" disableElevation sx={{ fontWeight: 800, textTransform: 'none', borderRadius: '12px', px: 2.5 }}>
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert severity={snackbar.severity} variant="filled" elevation={6} sx={{ borderRadius: '14px', fontWeight: 700 }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

