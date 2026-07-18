
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Snackbar, Alert, Paper, Stack } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input"; // Imported native package hook
import { useNavigate } from "react-router-dom";
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import api from "../../api/axiosConfig";

function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleOtpChange = (newValue) => {
    // Basic regex validation check mapping numerical characters only
    const cleanValue = newValue.replace(/[^0-9]/g, "");
    setOtp(cleanValue);
  };

  const isFormValid = otp.length === 4;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/verifyOtp", { otp });
      
      localStorage.setItem("powerbites_auth_handshake_token", response.data.token);
      
      setOtp("");
      setSnackbar({ open: true, message: "Security pass authenticated! Loading registration workspace...", severity: "success" });
      
      setTimeout(() => navigate("/register"), 1500);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.response?.data?.message || "Invalid or expired code token.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: { xs: 2, sm: 3 },
        background: "linear-gradient(135deg, #3654F4 0%, #4A1BF1 40%, #3C1A77 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 460,
          width: "100%",
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          bgcolor: "background.paper",
          boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.25)",
          textAlign: "center"
        }}
      >
        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Box sx={{ p: 2, bgcolor: "rgba(74, 27, 241, 0.08)", color: "#4A1BF1", borderRadius: "50%", display: "flex",justifyContent:'center',gap:2 }}>
            <MarkEmailReadOutlinedIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={800} sx={{ color: "#101828"  }}>
            Verify Your Email
          </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ px: { sm: 2 }, lineHeight: 1.5 }}>
            We sent a verification passcode code to <br />
            <strong style={{ color: "#344054" }}>{targetEmail || "your inbox"}</strong>.
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleOtpSubmit} noValidate>
          
          {/* Integrated Clean Package Implementation Component */}
          <MuiOtpInput
            value={otp}
            onChange={handleOtpChange}
            length={4}
            validateChar={(val) => !isNaN(Number(val))} // Block non-numeric data types directly
            sx={{
              gap: { xs: 1, sm: 1.5 },
              my: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                height: { xs: 46, sm: 54 },
                bgcolor: "#fff",
                transition: "all 0.15s ease",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4A1BF1",
                  borderWidth: "2px",
                  boxShadow: "0px 0px 0px 4px rgba(74, 27, 241, 0.12)"
                }
              },
              "& .MuiOutlinedInput-input": {
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#101828",
                p: 0
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isFormValid || loading}
            sx={{ mt: 2, py: 1.3, fontWeight: 700, borderRadius: 2, textTransform: "none", bgcolor: '#4A1BF1' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Continue"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.5, mt: 4 }}>
          <Typography variant="body2" color="text.secondary">Mistyped your email address?</Typography>
          <Typography
            variant="body2"
            sx={{ color: "#4A1BF1", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            onClick={() => navigate("/verify-email")}
          >
            Change Email
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default VerifyOtp;
