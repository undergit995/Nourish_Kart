import React, { useState } from "react";
import { 
  Box, Typography, TextField, CircularProgress, Snackbar, Alert, Button, Stack
} from "@mui/material";
import { validateEmail } from "../utils/Validation";
import { useNavigate } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import AuthCard from "./AuthCard";
import api from "../../api/axiosConfig";

function EmailVerify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const emailError = email ? validateEmail(email) : "";
  const isFormValid = email && !emailError;

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await api.post("/auth/verifyEmail", { email });
      showToast("Verification code dispatched to your inbox!", "success");
      
      setTimeout(() => navigate("/verify-otp"), 1200);
    } catch (err) {
      console.error(err);

      showToast(err.response?.data?.message || "Failed sending verification OTP code.", "error");
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
          <Stack sx={{ maxWidth: 360, width: "100%", textAlign: "center", color: "#fff", px: 2 }} spacing={2}>
            <Typography variant="h3" fontWeight={800} letterSpacing={-0.5}>PowerBites</Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#facc15' }}>
              Let's Secure Your Account
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.6 }}>
              Discover premium dry fruits and healthy snacks, delivered fresh to your door. Enter your email address to get started.
            </Typography>
          </Stack>
        }
        rightContent={
          <AuthCard title="Verify Email" sx={{ width: "100%", boxShadow: "none", bgcolor: "transparent" }}>
            <Box component="form" onSubmit={handleEmailSubmit} noValidate sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please share your email address to receive your 6-digit dynamic authentication pass.
              </Typography>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                autoComplete="email"
                margin="normal"
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading}
                sx={{ mt: 3, py: 1.3, fontWeight: 700, bgcolor: '#4A1BF1', textTransform: 'none', borderRadius: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Send Verification Pass"}
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mt: 4 }}>
              <Typography variant="body2" color="text.secondary">Already have an account?</Typography>
              <Typography
                variant="body2"
                sx={{ color: "#4A1BF1", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
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

export default EmailVerify;
