import React from 'react'
import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";



export const validateEmail =(email)=>{
    if(!email) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(email) ? "" : "Invalid email format";
};

export const validatePassword = (password) => {
    if (!password) return "Password is required";
    const valid = 
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return valid ? 
    "" :
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
};
export const validateConfirmPassword = (confirmpassword) => {
    if (!confirmpassword) return "Password is required";
    const valid = 
    confirmpassword.length >= 8 &&
    /[a-z]/.test(confirmpassword) &&
    /[A-Z]/.test(confirmpassword) &&
    /[0-9]/.test(confirmpassword) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(confirmpassword);

    return valid ? 
    "" :
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character";
};

export const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) ? "" : "Invalid phone number format";
};

export const validateName = (name) => {
    if (!name) return "Name is required";
    const nameRegex = /^[a-zA-Z ]+$/;
    return nameRegex.test(name) ? "" : "Invalid name format";
};

export const validateOtp = (otp) => {
    if (!otp) return "OTP is required";
    const otpRegex = /^\d{4}$/;
    return otpRegex.test(otp) ? "" : "Invalid OTP format";
};


export const PasswordField = ({
  label,
  value,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
  {...props}
  fullWidth
  label={label}
  value={value}
  onChange={onChange}
  type={showPassword ? "text" : "password"}
  margin="normal"
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }
  }}
/>

  );
};
