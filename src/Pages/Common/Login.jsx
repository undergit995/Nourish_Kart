import React, { useState } from "react";
import { Box, Button, Typography, TextField, CircularProgress, Snackbar, Alert } from "@mui/material";
import { validateEmail, validatePassword, PasswordField } from "../utils/Validation";
import AuthCard from "./AuthCard";
import MainAuthCard from "./MainAuthCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import api from "../../api/axiosConfig";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

 


  // Validation Checks
  const emailError = formData.email ? validateEmail(formData.email) : "";
  const passwordError = formData.password ? validatePassword(formData.password) : "";

  // Form validity rule: fields must be filled and error-free
  const isFormValid = 
    formData.email && 
    formData.password && 
    !emailError && 
    !passwordError;

  const handleSubmit = async(event) => {
    event.preventDefault();
    
    if (!isFormValid) return;

    setLoading(true);
    try {
      formData.email =formData.email.toLowerCase();
      console.log("Logging in with:", formData);
      // TODO: Integrate your actual API Authentication call here
    let response = await api.post("/auth/login",formData);

    console.log("res data :",response.data)
    
    let token = response.data.token;
    console.log("token :",token);
    localStorage.setItem("token",response.data.token);
    const decoded = jwtDecode(token);
    console.log("decoded :",decoded)  
    // Dynamic reset after an API handshake (or keep for convenience)
    setFormData({ email: "", password: "" });

    if(decoded.role == "customer"){
      navigate("/Customer")
    }
    else if(decoded.role == "admin"){
      navigate("/admin")
    }
}
  catch(err){
    console.log("data ",err.response?.data); 
    console.log("error ",err); 
    if(err.response?.data?.isVerified === false){
      setSnackbar({ open: true, message: err.response?.data?.message || "Please verify your account before logging in.", severity: "error" });
      setTimeout(() => navigate(`/verifyOtp/${err.response?.data?.user}`), 1500);
    }
    else if(err.response?.data?.isUser === true){
      setSnackbar({ open: true, message: err.response?.data?.message || "Account not found. Please register.", severity: "error" });
      setTimeout(() => navigate("/register"), 1500);
    }
    else{
      setSnackbar({ open: true, message: err.response?.data?.message || "Login failed. Please check your credentials and try again.", severity: "error" });
    }
    
  } finally {
    setLoading(false);
  }
}

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
            <Typography variant="h6">Welcome Back!</Typography>
          </Box>
        } 
        rightContent={
          <AuthCard 
            title="Login" 
            sx={{
              width: '100%',
              boxShadow: 'none',
              bgcolor: 'transparent'
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
                autoComplete="email"
                margin="normal"
              />
              <PasswordField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="current-password"
                margin="normal"
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#4A1BF1",
                  display:'flex',
                  justifyContent:'flex-end',
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/forget")} // Assuming forget route name
              >
                Forget Password
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isFormValid || loading}
                sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </Box>
            
            <Box
              sx={{
                display: "flex",
                
                alignItems: "center",
                gap: "8px",
                mt: 3,
              }}
            >
              
              
              <Typography variant="body2" color="text.secondary">
                Don't have an account?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#4A1BF1",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/verify-email")} // Assuming register route name
              >
                Sign Up
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

export default Login;