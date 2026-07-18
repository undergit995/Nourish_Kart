
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import {
  validatePassword,
  validateConfirmPassword,
  PasswordField,
} from "../utils/Validation";
import AuthCard from "./AuthCard";
import { useNavigate, useParams } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import axios from "axios";
import api from "../../api/axiosConfig";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const userId = useParams().id

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation Checks using your centralized utility functions
  const passwordError = formData.password ? validatePassword(formData.password) : "";
  const confirmPasswordError = formData.confirmPassword 
    ? validateConfirmPassword(formData.confirmPassword, formData.password) 
    : "";

  // Evaluates to true only if both fields are filled AND contain zero validation errors
  const isFormValid =
    formData.password &&
    formData.confirmPassword &&
    !passwordError &&
    !confirmPasswordError;

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setSnackbar({ open: true, message: "Passwords do not match. Please try again.", severity: "error" });
    }

    setLoading(true);
    try {
      let password = formData.password;
      let response = await api.post(`/resetPass/resetpassword`,{password},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("forgetToken")}`,
        },
      });

      if (response.status != 200) {
        return setSnackbar({ open: true, message: response.data.message || "Failed to reset password. Please try again.", severity: "error" });
      }
      setSnackbar({ open: true, message: "Password updated successfully! Redirecting to login...", severity: "success" });

      // Clear form fields
      setFormData({ password: "", confirmPassword: "" });

      // Automatically route them back to login page upon success
      setTimeout(() => navigate("/login"), 1500);
    } catch(err) {
      console.log(err.response?.data?.message);
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to reset password. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        background: 'linear-gradient(135deg, #3654F4 0%, #4A1BF1 40%, #3C1A77 100%)',
        boxShadow: 'inset 0px 4px 20px rgba(74, 27, 241, 0.3)',
      }}
    >
      <MainAuthCard 
        leftContent={
          <Box 
            sx={{
               width: "100%",
              height: "100%", 
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              p: 4,
              // bgcolor: 'rgba(255, 192, 203, 0.15)', 
               color: 'white'
            }}
          >
            <Typography variant="h4" fontWeight="bold">PowerBites</Typography>
            <Typography variant="h6">Welcome to PowerBites</Typography>
          </Box>
        } 
        rightContent={
          <AuthCard 
            title="Reset Password" 
            sx={{
              width: '100%',
              boxShadow: 'none',
              bgcolor: 'transparent'
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              
              <PasswordField
                fullWidth
                label="New Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="new-password"
                margin="normal"
              />

              <PasswordField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                autoComplete="new-password"
                margin="normal"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading} // Safe button lockout if checks fail
                sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Save Password"}
              </Button>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                mt: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Remember your credentials?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4A1BF1",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Typography>
            </Box>
          </AuthCard>
        } 
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResetPassword;
