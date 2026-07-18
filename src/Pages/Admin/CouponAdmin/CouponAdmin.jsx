import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogContentText,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from 'react'
import api from "../../../api/axiosConfig";
import CouponTopBar from "./CouponBar";
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function AllCoupon() {

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();


  const getCoupons = async () => {
  try {
    setLoading(true);

    const res = await api.get("/coupon/getCoupons");
    setCoupons(res?.data?.coupons || []);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};


const handleConfirmDelete = async () => {
    if (!confirmDelete.couponId) return;
    setConfirmDelete({ open: false, couponId: null });
  try {
    await api.delete(`/coupon/deleteCoupon/${confirmDelete.couponId}`);
    setCoupons(p=>p.filter((i)=>i._id!==confirmDelete.couponId));
  } catch (err) { enqueueSnackbar(err?.response?.data?.message,{variant:'error'});
  }
};
const statusUpdate = async (id, status) => {
  try {
    await api.put(`/coupon/couponStatus/${id}`, { status });
    setCoupons(p=>p.map((i)=>i._id===id?{...i,status}:i));
  }
  catch(err){
    enqueueSnackbar(err?.response?.data?.message,{variant:'info'})
console.log(err?.response.data.message);

  }}


useEffect(() => {
  getCoupons();
}, []);
  return (
    <>
    <CouponTopBar />
    <SnackbarProvider/>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 3,
        width: '100%',
        p: 1,
      }}
    >
      {coupons.map((coupon) => {
        const isActive = coupon.status === "Active";

        return (
          <Card
            key={coupon._id}
            sx={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(62, 26, 137, 0.08)',
              boxShadow: '0px 12px 30px rgba(62, 26, 137, 0.03)',
              position: 'relative',
              overflow: 'visible',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 20px 40px rgba(62, 26, 137, 0.08)',
                borderColor: 'rgba(62, 26, 137, 0.2)',
              },
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '145px', // Aligns directly with the inner divider line
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#f8f9fa', 
                border: '1px solid rgba(62, 26, 137, 0.08)',
                zIndex: 2,
              },
              '&::before': { left: '-9px', boxThickness: 'inset' },
              '&::after': { right: '-9px' },
            }}
          >
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                <Typography 
                  variant="h6" 
                  fontWeight={800} 
                  sx={{ color: '#3E1A89', letterSpacing: '-0.3px', lineHeight: 1.2 }}
                >
                  {coupon.title}
                </Typography>
                <Chip
                  label={coupon.status}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    bgcolor: isActive ? 'rgba(46, 125, 50, 0.09)' : 'rgba(0, 0, 0, 0.05)',
                    color: isActive ? '#2e7d32' : '#666',
                    border: `1px solid ${isActive ? 'rgba(46, 125, 50, 0.2)' : 'transparent'}`,
                  }}
                />
              </Stack>

              <Typography
                variant="body2"
                sx={{ color: 'rgba(0, 0, 0, 0.55)', mt: 1, mb: 2, minHeight: '40px', lineClamp: 2 }}
              >
                {coupon.description}
              </Typography>

              <Box 
                sx={{ 
                  borderTop: '2px dashed rgba(62, 26, 137, 0.12)', 
                  mx: -3, 
                  my: 1, 
                  position: 'relative' 
                }} 
              />

              <Box
                sx={{
                  mt: 2,
                  mb: 2,
                  p: 1.5,
                  borderRadius: '10px',
                  background: 'rgba(62, 26, 137, 0.04)',
                  border: '1px dashed rgba(62, 26, 137, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="caption" fontWeight={700} sx={{ color: 'rgba(62, 26, 137, 0.6)', textTransform: 'uppercase' }}>
                  Use Promo Code
                </Typography>
                <Typography variant="body1" fontWeight={800} sx={{ color: '#3E1A89', letterSpacing: '1px' }}>
                  {coupon.code}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>Discount</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#3E1A89' }}>{coupon.discount}% Off</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>Max Value</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{coupon.max_discount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)' }}>Min Spend</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{coupon.min_order_value}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)' }}>
                    <b>Valid:</b> {new Date(coupon.starts_At).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)' }}>
                    <b>Expires:</b> {new Date(coupon.ends_At).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>

              <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={1}
                sx={{ mt: 'auto' }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(`/admin/handlecoupon/${coupon._id}`)}
                  sx={{
                    borderColor: 'rgba(62, 26, 137, 0.15)',
                    color: '#3E1A89',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#3E1A89',
                      bgcolor: 'rgba(62, 26, 137, 0.02)'
                    }
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setConfirmDelete({ open: true, couponId: coupon._id})}
                  sx={{
                    minWidth: '50px',
                    borderRadius: '10px',
                    textTransform: 'none',
                    borderColor: 'rgba(211, 47, 47, 0.2)',
                    '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' }
                  }}
                >
                  Delete
                </Button>

                <Button
                  fullWidth
                  variant={isActive ? "contained" : "outlined"}
                  onClick={() => statusUpdate(coupon._id, isActive ? "inActive" : "Active")}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: isActive ? '#3E1A89' : 'transparent',
                    color: isActive ? '#fff' : '#3E1A89',
                    borderColor: isActive ? 'transparent' : '#3E1A89',
                    boxShadow: isActive ? '0px 4px 12px rgba(62, 26, 137, 0.2)' : 'none',
                    '&:hover': {
                      bgcolor: isActive ? '#2d1266' : 'rgba(62, 26, 137, 0.05)',
                      borderColor: isActive ? 'transparent' : '#3E1A89',
                    }
                  }}
                >
                  {isActive ? "Deactivate" : "Activate"}
                </Button>
              </Stack>

            </CardContent>
          </Card>
        );
      })}<Dialog
              open={confirmDelete.open} 
              onClose={() => setConfirmDelete({ open: false, id: null })}
              slotProps={{ backdrop: {}, paper: { sx: { borderRadius: 3, p: 1, maxWidth: 400 } } }}
            >
              <DialogTitle fontWeight={700} sx={{ pb: 1 }}>Delete Coupon?</DialogTitle>
              <DialogContent>
                <DialogContentText variant="body2" color="text.secondary">
                  Are you sure you want to delete this coupon? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Button onClick={() => setConfirmDelete({ open: false, id: null })} sx={{ textTransform: 'none', color: "text.secondary" }}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="error" variant="contained" disableElevation sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}>
                  Confirm Delete
                </Button>
              </DialogActions>
            </Dialog>
    </Box>
</>  
)
}
