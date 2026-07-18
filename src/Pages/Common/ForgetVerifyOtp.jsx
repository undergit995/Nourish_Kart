import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { validateOtp } from "../utils/Validation";
import AuthCard from "./AuthCard";
import { useNavigate, useParams } from "react-router-dom";
import MainAuthCard from "./MainAuthCard";
import axios from "axios";
import api from "../../api/axiosConfig";
function ForgotVerifyOtp() {
  const [otp, setotp] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const userId = useParams().id;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setotp(value);
  };


   const otpError = otp ? validateOtp(otp) : "";

    // Evaluates to true only if OTP is typed and contains zero validation errors
    const isFormValid = otp && !otpError;

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      return setSnackbar({ open: true, message: "Please enter a 4-digit OTP", severity: "error" });
    }

    setLoading(true);
    try {
      let res = await api.post(`/resetPass/VerifyOtp`,{otp},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("forgetToken")}`,
        },
      });
      console.log("res data :",res.data)

      if (res.status !== 200) {
        setSnackbar({ open: true, message: "Invalid OTP. Please check the code and try again.", severity: "error" });
        return;
      }

      setVerified(true);
      setSnackbar({ open: true, message: "OTP verified! You can now reset your password.", severity: "success" });
      setTimeout(() => navigate(`forget/forgetverifyOtp/resetpassword`), 1500);
    } catch(err) {
      console.log(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Verification failed. Please try again.", severity: "error" });
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
            title="Verify OTP"
            sx={{
              width: "100%",
              boxShadow: "none",
              bgcolor: "transparent",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                A verification code has been generated. Please enter it below to verify your account.
              </Typography>

              <TextField
                fullWidth
                label="Enter OTP"
                name="otp"
                value={otp}
                onChange={handleChange}
                error={!!otpError} // FIX: Changed from !!otp so it doesn't stay red continuously
                helperText={otpError} // Displays your custom validation message
                autoComplete="one-time-code"
                margin="normal"
                slotProps={{ htmlInput: { maxLength: 6 } }} // Limits standard input length if needed
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading} // Safe button lockout if checks fail
                sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
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
                Back to sign up?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4A1BF1",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/register")} // Safely fall back if they want to escape
              >
                Register
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

export default ForgotVerifyOtp;