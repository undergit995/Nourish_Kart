

import React, { useEffect, useRef, useState } from "react";
import {
  Avatar, Box, Button, Typography, Paper, Divider, IconButton, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Chip
} from "@mui/material";
import Grid from "@mui/material/Grid"; 
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import api from "../../../api/axiosConfig";
import { deleteeditaddress, geteditaddress, getEditProfile, postCustomerPhoto, deleteCustomerPhoto } from "../../../Redux/Slices/CM_ProfileSlice";
import CustomerCardAuth from "./CustomerCardAuth";

function CustomerProfile({ onBack }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const editProfile = useSelector((state) => state.editprofile?.editprofile || {});
  const editAddress = useSelector((state) => state.editprofile?.editaddress || []);
  const customerPhoto = useSelector((state) => state.editprofile?.photo || "");
//console.log("customerPhoto :", customerPhoto)
  const [message, setMessage] = useState(location.state?.message || null);
  const [loading, setLoading] = useState(!editProfile?.name);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const { name = "", email = "", phone = "" } = editProfile;

  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.id || "6a2a987342fbcdfda0a5c5b0";
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
    return "6a2a987342fbcdfda0a5c5b0";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const id = getUserId();
      const response = await api.post(`/updateCustomerProfile/uploadPhoto/${id}`, uploadData);
      
      const imagePath =
        response.data?.photo?.url ||
        response.data?.user?.image ||
        response.data?.photo ||
        response.data?.path ||
        response.data?.photo?.path || "";

      dispatch(postCustomerPhoto(imagePath));
      setMessage({ text: "Profile picture updated successfully!", type: "success" });
    } catch (error) {
      console.error("Image upload failed:", error);
      setMessage({ text: "Failed to upload image", type: "error" });
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const id = getUserId();
      const response = await api.delete(`/updateCustomerProfile/deletePhoto/${id}`);
      dispatch(deleteCustomerPhoto(response.data));
      setMessage({ text: "Profile picture removed.", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to delete profile picture", type: "error" });
    }
  };

  const fetchCustomerPhoto = async () => {
    try {
      const id = getUserId();
      const response = await api.get(`/updateCustomerProfile/getPhoto/${id}`);
      console.log("response photos :", response.data);
      const imagePath =
        response.data?.image ||
        response.data?.user?.image ||
        response.data?.photo ||
        response.data?.path ||
        response.data?.photo?.path || "";
       // console.log("image path :", imagePath);
      dispatch(postCustomerPhoto(imagePath));
    } catch (err) {
      console.log("Error loading photo:", err);
    }
  };

  const fetchData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [profileRes, addressRes] = await Promise.all([
        api.get("/updateCustomerProfile/getProfile"),
        api.get("/updateCustomerProfile/getAddresses")
      ]);
      dispatch(getEditProfile(profileRes.data?.user || {}));
      dispatch(geteditaddress(Array.isArray(addressRes.data?.addresses) ? addressRes.data.addresses : []));
    } catch (err) {
      setMessage({ text: "Failed to load data", type: "error" });
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const setAsDefault = async (id) => {
    const updatedAddresses = editAddress.map((addr) => ({
      ...addr,
      isDefault: addr._id === id,
    }));
    dispatch(geteditaddress(updatedAddresses));

    try {
      await api.get(`/updateCustomerProfile/setDefaultAddress/${id}`);
      setMessage({ text: "Default address updated!", type: "success" });
    } catch (err) {
      fetchData(false);
      setMessage({ text: "Failed to set default address", type: "error" });
    }
  };

  const handleDeleteClick = (id) => setConfirmDelete({ open: true, id });

  const handleConfirmDelete = async () => {
    if (!confirmDelete.id) return;
    setDeletingId(confirmDelete.id);
    const targetId = confirmDelete.id;
    setConfirmDelete({ open: false, id: null });
    try {
      await api.delete(`/updateCustomerProfile/deleteAddress/${targetId}`);
      dispatch(deleteeditaddress(targetId));
      setMessage({ text: "Address deleted successfully", type: "success" });
    } catch (err) {
      setMessage({ text: "Failed to delete address", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true });
    }
    if (!editProfile?.name) {
      fetchData();
    }
    fetchCustomerPhoto();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getAddressIcon = (label) => {
    switch (label?.toUpperCase()) {
      case "HOME": return <HomeIcon fontSize="small" />;
      case "OFFICE": return <BusinessIcon fontSize="small" />;
      default: return <LocationOnIcon fontSize="small" />;
    }
  };

  const sortedAddresses = [...editAddress].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress thickness={4} size={45} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#fdfefe", minHeight: "100vh" }}>
      <CustomerCardAuth>
        <Paper 
          elevation={0} 
          sx={{ 
            maxWidth: '100%', 
            mx: "auto", 
            p: { xs: 2.5, sm: 5 }, 
            borderRadius: 4, 
            border: "1px solid #eaecf0",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.02)"
          }}
        >
          {message && (
            <Alert severity={message.type} variant="standard" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          {/* Profile Identity Header */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" }, 
            alignItems: "center", 
            textAlign: { xs: "center", sm: "left" },
            gap: 3, 
            mb: 5 
          }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar 
                  src={customerPhoto} 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: "primary.main", 
                    fontWeight: 700,
                    fontSize: "2.2rem", 
                    border: "3px solid #fff",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)"
                  }}
                >
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                
                <IconButton 
                  onClick={() => fileInputRef.current?.click()} 
                  sx={{ 
                    position: "absolute", 
                    bottom: 2, 
                    right: 2, 
                    bgcolor: "primary.main", 
                    color: "white",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
                    "&:hover": { bgcolor: "primary.dark" }
                  }} 
                  size="small"
                >
                  <PhotoCameraIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
              </Box>

              {customerPhoto && (
                <Button 
                  variant="text" 
                  color="error" 
                  startIcon={<DeleteIcon />} 
                  size="small"
                  onClick={handleDeletePhoto}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  Remove Photo
                </Button>
              )}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#101828', mb: 0.5 }}>{name || "User Account"}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>{email}</Typography>
            </Box>
          </Box>

          {/* Personal Information Details Grid */}
          <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ mb: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Personal Details
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: "#fcfcfc", borderColor: "#f2f4f7" }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>Full Name</Typography>
                <Typography fontWeight={600} color="#344054">{name || "—"}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>Email Address</Typography>
                <Typography fontWeight={600} color="#344054" sx={{ wordBreak: "break-all" }}>{email || "—"}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>Phone Number</Typography>
                <Typography fontWeight={600} color="#344054">{phone || "—"}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Button 
            variant="contained" 
            disableElevation
            startIcon={<EditIcon />} 
            onClick={() => navigate("/customer/editprofile")} 
            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600, px: 3, py: 1 }}
          >
            Edit Profile Credentials
          </Button>

          <Divider sx={{ my: 4, borderColor: "#eaecf0" }} />

          {/* Addresses Layout Section */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700} color="primary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              Saved Shipping Locations
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={() => navigate("/customer/editaddress")} 
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
            >
              Add New Address
            </Button>
          </Box>

          {sortedAddresses.length === 0 ? (
            <Typography color="text.secondary" align="center" py={5} variant="body2" fontWeight={500}>
              No addresses saved. Please map a primary shipping configuration.
            </Typography>
          ) : (
            sortedAddresses.map((addr) => (
              <Paper 
                key={addr._id} 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 3, 
                  borderColor: addr.isDefault ? "primary.main" : "#eaecf0",
                  borderWidth: addr.isDefault ? "1.5px" : "1px",
                  boxShadow: addr.isDefault ? "0px 4px 12px rgba(103, 58, 183, 0.04)" : "none",
                  bgcolor: '#fff',
                  transition: "all 0.2s ease"
                }}
              >
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 2, gap: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ color: "primary.main", display: "flex" }}>
                      {getAddressIcon(addr.label)}
                    </Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'uppercase', color: '#344054', letterSpacing: 0.5 }}>
                      {addr.label || 'Home'} Location
                    </Typography>
                  </Box>

                  {addr.isDefault && (
                    <Chip 
                      icon={<StarIcon sx={{ "&&": { color: "#eab308" } }} />} 
                      label="Primary Default Address" 
                      variant="baseline"
                      size="small" 
                      sx={{ bgcolor: "#fef9c3", color: "#713f12", fontWeight: 700, borderRadius: 1.5, fontSize: "0.75rem" }} 
                    />
                  )}
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>Street Area Details</Typography>
                    <Typography variant="body2" fontWeight={600} color="#475467">{addr.street}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>City</Typography>
                    <Typography variant="body2" fontWeight={600} color="#475467">{addr.city}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>State / Province</Typography>
                    <Typography variant="body2" fontWeight={600} color="#475467">{addr.state}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>ZIP / Pincode</Typography>
                    <Typography variant="body2" fontWeight={600} color="#475467">{addr.pincode}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>Country</Typography>
                    <Typography variant="body2" fontWeight={600} color="#475467">{addr.country}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "flex-end", mt: 2, flexWrap: "wrap" }}>
                  {!addr.isDefault && (
                    <Button 
                      variant="text" 
                      size="small" 
                      onClick={() => setAsDefault(addr._id)} 
                      sx={{ textTransform: 'none', fontWeight: 700 }}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    startIcon={deletingId === addr._id ? <CircularProgress size={14} color="inherit" /> : <DeleteIcon />} 
                    onClick={() => handleDeleteClick(addr._id)} 
                    disabled={deletingId === addr._id} 
                    sx={{ textTransform: 'none', borderRadius: 1.5 }}
                  >
                    Remove
                  </Button>
                  <Button 
                    variant="contained" 
                    disableElevation
                    size="small" 
                    startIcon={<EditIcon />} 
                    onClick={() => navigate(`/customer/editaddress/${addr._id}`)} 
                    sx={{ textTransform: 'none', borderRadius: 1.5, fontWeight: 600 }}
                  >
                    Modify
                  </Button>
                </Box>
              </Paper>
            ))
          )}

          <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #eaecf0' }}>
            <Button 
              variant="outlined" 
              color="inherit" 
              startIcon={<ArrowBackIcon />} 
              onClick={onBack || (() => navigate("/customer"))} 
              sx={{ textTransform: 'none', borderRadius: 2, color: "text.secondary", borderColor: "#d0d5dd" }}
            >
              Return to Dashboard
            </Button>
          </Box>
        </Paper>
      </CustomerCardAuth>

      {/* Action Dialog Container window */}
      <Dialog 
        open={confirmDelete.open} 
        onClose={() => setConfirmDelete({ open: false, id: null })}
        slotProps={{ backdrop: {}, paper: { sx: { borderRadius: 3, p: 1, maxWidth: 400 } } }}
      >
        <DialogTitle fontWeight={700} sx={{ pb: 1 }}>Delete Saved Address?</DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2" color="text.secondary">
            Are you sure you want to remove this delivery location? This action cannot be undone.
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
  );
}

export default CustomerProfile;