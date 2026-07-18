import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosConfig";
import { getEditProfile } from "../../../Redux/Slices/CM_ProfileSlice";
import { PasswordField, validatePassword } from "../../utils/Validation";
import { jwtDecode } from "jwt-decode";
import CustomerCardAuth from "./CustomerCardAuth";

function CustomerEditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editProfile = useSelector((state) => state.editprofile.editprofile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (editProfile) {
      setProfileForm({
        name: editProfile.name || "",
        email: editProfile.email || "",
        phone: editProfile.phone || "",
        password: editProfile.password || "",
      });
    }
  }, [editProfile]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const isPasswordChanged = profileForm.password !== editProfile?.password;
  const passwordError =
    isPasswordChanged && profileForm.password
      ? validatePassword(profileForm.password)
      : "";

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (passwordError) return;

    setSavingProfile(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const payload = {
        name: profileForm.name,
        phone: profileForm.phone,
      };

      if (isPasswordChanged && profileForm.password?.trim() !== "") {
        payload.password = profileForm.password;
      }

      const res = await api.put(
        `/updateCustomerProfile/updateProfile/${userId}`,
        payload
      );
      
      const updatedFullProfile = { ...editProfile, ...res.data.user };
      dispatch(getEditProfile(updatedFullProfile));
      
      navigate("/customer/profile", { 
        state: { message: { text: "Profile updated successfully!", type: "success" } } 
      });
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      setMessage({ text: "Failed to update profile", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      <CustomerCardAuth>
        <Paper
          elevation={0}
          sx={{
            maxWidth: '100%',
            mx: "auto",
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Edit Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Manage your personal account credentials
          </Typography>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleUpdateProfile}>
            <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  autoComplete="name"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileForm.email}
                  disabled
                  autoComplete="username"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  autoComplete="tel"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <PasswordField
                  fullWidth
                  label="Password"
                  name="password"
                  value={profileForm.password}
                  onChange={handleProfileChange}
                  error={!!passwordError}
                  helperText={passwordError}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: { xs: "column-reverse", sm: "row" },
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/customer/profile")}
                fullWidth={{ xs: true, sm: false }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={savingProfile ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={savingProfile}
                fullWidth={{ xs: true, sm: false }}
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </Button>
            </Box>
          </form>
        </Paper>
      </CustomerCardAuth>
    </Box>
  );
}

export default CustomerEditProfile;