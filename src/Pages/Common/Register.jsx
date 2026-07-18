
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, CircularProgress, Snackbar, Alert, Stack, Button } from "@mui/material";
import {
  validatePassword, validatePhone, validateName, validateConfirmPassword, PasswordField
} from "../utils/Validation";
import { useNavigate } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import AuthCard from "./AuthCard";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";

function Register() {
  const navigate = useNavigate();
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    const securityToken = localStorage.getItem("powerbites_auth_handshake_token");
    console.log("securityToken :",securityToken)
    if (!securityToken) {
      setSnackbar({ open: true, message: "Session tracing timeline invalid. Re-routing to entry.", severity: "error" });
      setTimeout(() => navigate("/verify-email"), 2000);
    } else {
      // Decode the token to get the email
      const decodedToken = jwtDecode(securityToken);
      const activeEmail = decodedToken.email;
      setVerifiedEmail(activeEmail);
    }
  }, [navigate]);

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nameError = formData.name ? validateName(formData.name) : "";
  const passwordError = formData.password ? validatePassword(formData.password) : "";
  const confirmPasswordError = formData.confirmPassword ? validateConfirmPassword(formData.confirmPassword) : "";
  const phoneError = formData.phone ? validatePhone(formData.phone) : "";

  const isFormValid =
    formData.name &&
    formData.phone &&
    formData.password &&
    formData.confirmPassword &&
    !nameError &&
    !phoneError &&
    !passwordError &&
    !confirmPasswordError;

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return showToast("Passwords do not match.", "error");
    }

    setLoading(true);
    try {
      const registrationPayload = {
        name: formData.name,
        email: verifiedEmail,
        phone: formData.phone,
        password: formData.password,
      };

      let res = await api.post("/auth/register", registrationPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("powerbites_auth_handshake_token")}`,
        },
      });
      console.log("register :",res)
      showToast("Account created successfully!", "success");
      
      // Complete cleanup of temporary storage keys
      localStorage.removeItem("powerbites_auth_handshake_token");

      setFormData({ name: "", password: "", confirmPassword: "", phone: "" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Account creation failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh', 
        background: 'linear-gradient(180deg, #3519B3 0%, #1E1154 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: { xs: 2, sm: 3 }
      }}
    >
      <MainAuthCard 
        leftContent={
          <Stack sx={{ maxWidth: 350, width: "100%", textAlign: "center", color: "#fff", px: 2 }} spacing={2}>
            <Typography variant="h3" fontWeight={800}>PowerBites</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#4ade80' }}>
              Finalize Your Profile
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
              Your communication email channel has been successfully confirmed. Wrap up your basic profile data parameters below.
            </Typography>
          </Stack>
        }
        rightContent={
          <AuthCard title="Create Profile" sx={{ width: "100%", boxShadow: "none", bgcolor: "transparent" }}>
            <Box component="form" onSubmit={handleProfileSubmit} noValidate sx={{ mt: 1 }}>
              
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={verifiedEmail}
                disabled
                margin="normal"
              />

              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!nameError}
                helperText={nameError}
                autoComplete="name"
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                error={!!phoneError}
                helperText={phoneError}
                autoComplete="tel"
                margin="normal"
                required
              />

              <PasswordField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="new-password"
                margin="normal"
                required
              />
              
              <PasswordField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                autoComplete="new-password"
                margin="normal"
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading}
                sx={{ mt: 4, py: 1.3, fontWeight: "bold", borderRadius: 2, bgcolor: '#4A1BF1' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Complete Registration"}
              </Button>
            </Box>
          </AuthCard>
        }
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%", borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;
