import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Chip,
  Button,
  Collapse,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination
} from "@mui/material"; 
import api from "../../../api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerOrder } from "../../../Redux/Slices/CustomerSlice/CustomerOrderSlice";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../socket";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const STEPS = [
  "order placed",
  "preparing order",
  "order shipped",
  "order delivered",
];

const getStatusStep = (status) => {
  switch (status?.toLowerCase()) {
    case "order placed": return 0;
    case "preparing order": return 1;
    case "order shipped": return 2;
    case "order delivered": return 3;
    default: return 0;
  }
};

const isCancellable = (status) => {
  const lowerStatus = status?.toLowerCase();
  return lowerStatus === "order placed" || lowerStatus === "preparing order";
};

function OrderList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.customerOrder.orderlist) || [];
  
  // 1. ALL HOOK INITIALIZATIONS DECLARED INVARIABLY AT THE TOP LEVEL
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState([]);
  
  // Pagination State parameters (Strictly locked to 10 limits)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  // States for Cancellation Reason Dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const triggerSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Sync state tracking datasets with parameterized page definitions
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await api.get(`/orders/getOrders?page=${currentPage}&limit=${itemsPerPage}`);
        
        const fallbackOrdersArray = response.data?.orders || [];
        // CRITICAL FIX: Extract metrics map accurately out of response backend metadata blocks
        const totalCount = response.data?.pagination?.totalOrders || response.data?.totalOrders || fallbackOrdersArray.length;
        
        setTotalOrdersCount(totalCount);
        dispatch(getCustomerOrder(fallbackOrdersArray));
      } catch (err) {
        console.error("Error fetching order history:", err);
        triggerSnackbar("Failed to sync historical orders list.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [dispatch, currentPage, itemsPerPage, triggerSnackbar]);

  // WebSocket event dynamic subscription configurations
  useEffect(() => {
    socket.connect();

    function onOrderUpdate(updatedOrder) {
      const isMyOrder = orders.some(o => o._id === updatedOrder._id);
      if (isMyOrder) {
        console.log('Real-time customer order update received:', updatedOrder);
        triggerSnackbar(`Your order #${updatedOrder._id.slice(-6)} has been updated!`, 'info');
        
        const updatedList = orders.map(order => 
          order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
        );
        dispatch(getCustomerOrder(updatedList));
      }
    }

    socket.on('orderUpdate', onOrderUpdate);
    return () => { socket.off('orderUpdate', onOrderUpdate); socket.disconnect(); };
  }, [dispatch, orders, triggerSnackbar]);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleOpenCancelDialog = (orderId) => {
    setOrderToCancel(orderId);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setOrderToCancel(null);
    setCancelReason("");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      triggerSnackbar("Please provide a reason for cancellation.", "warning");
      return;
    }

    try {
      const response = await api.post(`/orderStatus/customerCancelling/${orderToCancel}`, { reason: cancelReason });

      if (response.status === 200) {
        const updatedOrdersList = orders.map((o) => {
          if (o._id === orderToCancel) {
            return { 
              ...o, 
              orderStatus: "order cancelled",
              cancelReason: cancelReason,
              cancelledBy: "customer" 
            };
          }
          return o;
        });
        dispatch(getCustomerOrder(updatedOrdersList));
        triggerSnackbar("Order canceled successfully.", "warning");
        handleCloseCancelDialog();
      }
    } catch (err) {
      console.error("Cancellation routing error:", err);
      triggerSnackbar("Failed to request order cancellation.", "error");
    }
  };

  const handleNavigateToReview = (productId) => {
    if (productId) {
      navigate(`/customer/reviews/${productId}`);
    } else {
      triggerSnackbar("Product ID target is missing.", "error");
    }
  };

  const pageCount = Math.ceil(totalOrdersCount / itemsPerPage) || 1;

  // 2. CONDITIONAL RETURNS FOR LOADING UI PLACED SAFELY AFTER ALL HOOK INITIALIZATIONS
  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "70vh", gap: 2 }}>
        <CircularProgress size={40} thickness={4} sx={{ color: "#4f46e5" }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Syncing account orders...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", margin: "0 auto", minHeight: "100vh", bgcolor: '#f8fafc' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: "center", maxWidth: 500, margin: "40px auto", border: "2px dashed #e2e8f0", borderRadius: 4, bgcolor: "#fff" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#475569" }}>No Orders Tracked</Typography>
          <Typography variant="body2" color="text.secondary">Looks like your transaction history is empty.</Typography>
        </Paper>
      ) : (
        <>
          {orders.map((order) => {
            const isExpanded = expandedOrders.includes(order._id);
            const productsArray = order.products || [];
            const isCancelled = order.orderStatus?.toLowerCase() === "order cancelled";
            const isDelivered = order.orderStatus?.toLowerCase() === "order delivered";
            const firstProduct = productsArray[0];
            const remainingProducts = productsArray.slice(1);          
            const showReviewOption = isDelivered;

            if (!firstProduct) return null;

            const firstProductOriginalPrice = firstProduct.price || 0;
            const firstProductFinalPrice = firstProduct.discounted_price || firstProductOriginalPrice;
            const firstProductDiscountAmount = firstProductOriginalPrice - firstProductFinalPrice;

            const originalTotal = productsArray.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const finalTotal = order.final_price || order.total || 0;
            const totalSavings = originalTotal - finalTotal;

            return (
              <Paper
                key={order._id}
                elevation={0}
                sx={{ 
                  mb: 4, 
                  borderRadius: '24px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)', 
                  overflow: 'hidden', 
                  bgcolor: '#fff' 
                }}
              >
                {/* HEADER METADATA PANEL */}
                <Box sx={{ p: 3, bgcolor: "#f8fafc", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 3, borderBottom: "1px solid #e2e8f0" }}>
                  <Box sx={{ display: "flex", gap: { xs: 2.5, sm: 4 }, flexWrap: "wrap" }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", display: "block", mb: 0.5, letterSpacing: "0.5px" }}>Order ID</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "monospace", bgcolor: "#e2e8f0", px: 1.5, py: 0.5, borderRadius: '8px' }}>#{order._id.slice(-8).toUpperCase()}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", display: "block", mb: 0.5, letterSpacing: "0.5px" }}>Date Logged</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                        {order.createdAt ? order.createdAt.split("T")[0] : "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", display: "block", mb: 0.5, letterSpacing: "0.5px" }}>Price Details</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: "#4f46e5" }}>
                          ₹{finalTotal.toLocaleString()}
                        </Typography>
                        {totalSavings > 0 && (
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textDecoration: 'line-through' }}>
                            ₹{originalTotal.toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {order.coupon && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase", display: "block", mb: 0.5, letterSpacing: "0.5px" }}>Savings</Typography>
                        <Chip label={`${order.coupon.title} (${order.coupon.discount}%)`} size="small" sx={{ fontWeight: 800, bgcolor: "#fffbeb", color: "#b45309", border: "1px dashed #f59e0b", borderRadius: 1.5 }} />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", md: "auto" }, justifyContent: { xs: "space-between", md: "flex-end" } }}>
                    <Chip
                      label={order.orderStatus || "order placed"}
                      size="medium"
                      sx={{
                        fontWeight: 800,
                        borderRadius: 2.5,
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        px: 1,
                        bgcolor: isDelivered ? "#dcfce7" : isCancelled ? "#fee2e2" : "#e0e7ff",
                        color: isDelivered ? "#15803d" : isCancelled ? "#991b1b" : "#4338ca",
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {isCancellable(order.orderStatus) && (
                        <Button size="small" variant="contained" color="error" onClick={() => handleOpenCancelDialog(order._id)} sx={{ textTransform: "none", fontWeight: 700, borderRadius: '10px', boxShadow: "none", "&:hover": { bgcolor: "#dc2626", boxShadow: "none" } }}>
                          Cancel Order
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* STEPPER TRACKING / CANCELLED REASON DETAILS PANEL */}
                {!isCancelled ? (
                  <Box sx={{ p: {xs: 2.5, md: 4}, width: "100%", overflowX: "auto", bgcolor: "#fff" }}>
                    <Box sx={{ minWidth: 720 }}>
                      <Stepper activeStep={getStatusStep(order.orderStatus)} alternativeLabel>
                        {STEPS.map((label) => (
                          <Step key={label}>
                            <StepLabel sx={{ 
                              "& .MuiStepLabel-label": { fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, mt: 1 },
                              "& .Mui-active": { color: "#4f46e5 !important" },
                              "& .Mui-completed": { color: "#16a34a !important" }
                            }}>{label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 3, bgcolor: "#fff1f2", borderBottom: "1px solid #ffe4e6", display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography variant="body2" sx={{ color: "#c53030", fontWeight: 700 }}>
                      ✕ Order Cancelled By: {order.cancelledBy || "Customer"}
                    </Typography>
                    {order.cancelReason && (
                      <Typography variant="body2" sx={{ color: "#7f1d1d", fontWeight: 500 }}>
                        <strong>Reason for Cancellation:</strong> {order.cancelReason}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* TABULAR LAYOUT STRUCTURE */}
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, borderTop: "1px solid #e2e8f0" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="product items table">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: "#475569", width: "12%", py: 1.5 }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: "#475569", width: "45%", py: 1.5 }}>Product Details &amp; Price Breakdown</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: "13%", py: 1.5 }}>Quantity</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: "#475569", width: "15%", py: 1.5 }}>Total Cost</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: "#475569", width: "15%", pr: 3, py: 1.5 }}>
                          {productsArray.length > 1 ? (
                            <Button
                              size="small"
                              variant="text"
                              endIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              onClick={() => toggleOrderExpand(order._id)}
                              sx={{ textTransform: "none", fontWeight: 800, fontSize: "0.75rem", color: "#4f46e5", p: 0 }}
                            >
                              {isExpanded ? "Hide Items" : `+${remainingProducts.length} Items`}
                            </Button>
                          ) : (
                            "Action"
                          )}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    
                    <TableBody>
                      <TableRow sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                        <TableCell>
                          <Box component="img" src={firstProduct.image || "https://placehold.co/50x50.png"} alt="thumbnail" sx={{ width: 64, height: 64, borderRadius: '12px', border: "1px solid #e2e8f0", objectFit: "cover" }} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                            {firstProduct.product?.name || "Product Item Reference"}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                              Base Rate: <span style={{ textDecoration: firstProduct.discount > 0 ? "line-through" : "none", fontWeight: 600 }}>₹{firstProductOriginalPrice.toLocaleString()}</span>
                            </Typography>
                            {firstProduct.discount > 0 && (
                              <>
                                <Chip label={`${firstProduct.discount}% OFF`} size="small" sx={{ height: 18, fontSize: "0.62rem", fontWeight: 800, bgcolor: "#f0fdf4", color: "#16a34a", borderRadius: 1 }} />
                                <Typography variant="caption" sx={{ color: "#16a34a", fontWeight: 700 }}>(Saved ₹{firstProductDiscountAmount.toLocaleString()}/unit)</Typography>
                                <Typography variant="caption" sx={{ color: "#4f46e5", fontWeight: 700 }}>Active Rate: ₹{firstProductFinalPrice.toLocaleString()}</Typography>
                              </>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: "#334155" }}>
                          {firstProduct.quantity}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                              ₹{(firstProductFinalPrice * firstProduct.quantity).toLocaleString()}
                            </Typography>
                            {firstProduct.discount > 0 && (
                              <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#94a3b8", fontWeight: 500 }}>
                                ₹{(firstProductOriginalPrice * firstProduct.quantity).toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                          {showReviewOption && (
                            <Button
                              size="small"
                              variant="contained"
                              disableElevation
                              onClick={() => handleNavigateToReview(firstProduct.product?._id || firstProduct.product)}
                              sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.75rem", bgcolor: "#eef2ff", color: "#4338ca", borderRadius: '10px', boxShadow: 'none', '&:hover': { bgcolor: '#e0e7ff' } }}
                            >
                              Give Review
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* COLLAPSED EXPANSION RENDER BLOCK */}
                {productsArray.length > 1 && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, bgcolor: "#f8fafc", borderTop: "1px dashed #e2e8f0" }}>
                      <Table sx={{ minWidth: 650 }} size="small">
                        <TableBody>
                          {remainingProducts.map((item, index) => {
                            const itemOriginalPrice = item.price || 0;
                            const itemFinalPrice = item.discounted_price || itemOriginalPrice;
                            const itemDiscountAmount = itemOriginalPrice - itemFinalPrice;

                            return (
                              <TableRow key={item._id || index} sx={{ "&:hover": { bgcolor: "#f1f5f9" } }}>
                                <TableCell sx={{ width: "12%", pl: 3 }}>
                                  <Box component="img" src={item.image || "https://placehold.co/50x50.png"} alt="thumbnail" sx={{ width: 48, height: 48, borderRadius: '8px', border: "1px solid #e2e8f0", objectFit: "cover" }} />
                                </TableCell>
                                <TableCell sx={{ width: "45%" }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", mb: 0.5 }}>
                                    {item.product?.name || "Product Variant Item Asset"}
                                  </Typography>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                      Base: <span style={{ textDecoration: item.discount > 0 ? "line-through" : "none" }}>₹{itemOriginalPrice.toLocaleString()}</span>
                                    </Typography>
                                    {item.discount > 0 && (
                                      <>
                                        <Chip label={`${item.discount}% OFF`} size="small" sx={{ height: 16, fontSize: "0.58rem", fontWeight: 700, bgcolor: "#f0fdf4", color: "#16a34a", borderRadius: 0.5 }} />
                                        <Typography variant="caption" sx={{ color: "#16a34a", fontSize: "0.72rem" }}>(-₹{itemDiscountAmount.toLocaleString()})</Typography>
                                        <Typography variant="caption" sx={{ color: "#4f46e5", fontWeight: 600 }}>Now: ₹{itemFinalPrice.toLocaleString()}</Typography>
                                      </>
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ width: "13%", fontWeight: 600, color: "#475569" }}>
                                  {item.quantity}
                                </TableCell>
                                <TableCell align="right" sx={{ width: "15%" }}>
                                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                      ₹{(itemFinalPrice * item.quantity).toLocaleString()}
                                    </Typography>
                                    {item.discount > 0 && (
                                      <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "0.7rem" }}>
                                        ₹{(itemOriginalPrice * item.quantity).toLocaleString()}
                                      </Typography>
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ width: "15%", pr: 3 }}>
                                  {showReviewOption && (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      disableElevation
                                      onClick={() => handleNavigateToReview(item.product?._id || item.product)}
                                      sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.7rem", bgcolor: "#eef2ff", color: "#4338ca", borderRadius: '8px', boxShadow: 'none', '&:hover': { bgcolor: '#e0e7ff' } }}
                                    >
                                      Give Review
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Collapse>
                )}

                {/* SHIPPING & DESTINATION INFO */}
                <Divider />
                <Box sx={{ p: 3, bgcolor: "#f8fafc" }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    {order.shippingAddress && (
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 0.5, letterSpacing: "0.5px" }}>SHIPPING TO</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569", lineHeight: 1.5 }}>
                          {`${order.shippingAddress.label || "Address"}: ${order.shippingAddress.street || ""}, ${order.shippingAddress.city || ""}, ${order.shippingAddress.state || ""} - ${order.shippingAddress.pincode || ""}`}
                        </Typography>
                      </Box>
                    )}
                    {order.paymentID && (
                      <Box sx={{ textAlign: { sm: "right" } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: "block", mb: 0.5, letterSpacing: "0.5px" }}>TRANSACTION ID</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{order.paymentID}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Paper>
            );
          })}

          {/* MUI PAGINATION CONTROLLER ELEMENT BLOCK */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 4 }}>
            <Pagination 
              count={pageCount} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary"
              size="medium"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 700,
                  borderRadius: '10px'
                }
              }}
            />
          </Box>
        </>
      )}

      {/* CANCELLATION REASON INPUT PROMPT DIALOG */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1, color: '#1e293b' }}>Cancel Your Order</DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#f1f5f9" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please let us know why you are cancelling this order. This helps us improve our service.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="e.g., Ordered by mistake, found a better deal, etc."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            InputProps={{ sx: { borderRadius: '12px', fontSize: "0.9rem" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={handleCloseCancelDialog} color="inherit" sx={{ textTransform: "none", fontWeight: 700, borderRadius: '10px' }}>Keep Order</Button>
          <Button onClick={handleConfirmCancelOrder} variant="contained" color="error" disableElevation sx={{ textTransform: "none", fontWeight: 700, borderRadius: '10px' }}>Confirm Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* TOAST SYSTEM */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" elevation={6} sx={{ borderRadius: 3, fontWeight: 700, px: 2.5 }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default OrderList;
