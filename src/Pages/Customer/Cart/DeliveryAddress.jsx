import { Alert } from "@mui/material";
import Grid2 from "@mui/material/Grid"; // Uses updated MUI Grid2 layout system
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import {
  Box,
  IconButton,
  Grid,
  MenuItem,
  Select,
  Stack,
  Paper,
  Typography,
  Button,
  Skeleton,
  Modal,
  FormControl,
  TextField,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CustomerCardAuth from "../Profile/CustomerCardAuth";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 9,
  pt: 2,
  px: 4,
  pb: 3,
};
const countriesData = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ],
};

export default function AddressModal({
  open,
  onClose,
  setAddress,
  addresses,
  setUpdateAddress,
}) {
  const [message, setMessage] = useState(null);
  const editProfile = useSelector((state) => state.editprofile.editprofile);

  const editAddress = useSelector((state) => state.editprofile.editaddress);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [otherLabel, setOtherLabel] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    _id: "",
    isDefault: false,
  });

  const editaddressId = useParams().id || "";

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((prev) => ({ ...prev, [name]: value }));

    if (name === "country") {
      setAddressForm((prev) => ({ ...prev, state: "" }));
    }
  };

  const dispatch = useDispatch();

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const finalLabel =
        addressForm.label === "OTHER" ? otherLabel : addressForm.label;
      const payload = { ...addressForm, label: finalLabel, userId };
      if (!payload._id) delete payload._id;
      if (["HOME"].includes(finalLabel)) {
        const existingLabel = addresses.find(
          (addr) => addr.label === finalLabel,
        );
        if (existingLabel) {
          enqueueSnackbar(
            `An address with the Address type "${finalLabel}" already exists.`,
            {
              variant: "warning",
            },
          );
          setSavingAddress(false);
          return;
        }
      }
      let response;

      response = await api.post(
        `/updateCustomerProfile/addAddress/${userId}`,
        payload,
      );
      console.log(response.data);

      setUpdateAddress(response.data.address);
      if (setAddress) {
        setAddress((prevAddresses) => [
          ...prevAddresses,
          response.data.address,
        ]);
      }
      onClose();
      enqueueSnackbar("Address added successfully!", {
        variant: "success",
      });

      setAddressForm({
        label: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        _id: "",
        isDefault: false,
      });
      setOtherLabel("");

      setMessage({
        text: "Address added!",
        type: "success",
      });
    } catch (err) {
      console.error("Address save error:", err.response?.data || err.message);
      enqueueSnackbar(`${err.response?.data || err.message}`, {
        variant: "error",
      });
      setMessage({ text: "Failed to save address", type: "error" });
    } finally {
      setSavingAddress(false);
    }
  };

  const availableStates = countriesData[addressForm.country] || [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <Box
          sx={{
            p: { xs: 2, sm: 4 },
            bgcolor: "#fdfefe",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CustomerCardAuth>
            <Paper
              elevation={0}
              sx={{
                maxWidth: "100%",
                mx: "auto",
                p: { xs: 2.5, sm: 5 },
                borderRadius: 4,
                border: "1px solid #eaecf0",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Box
                  sx={{
                    p: 1,
                    bgcolor: "primary.light",
                    borderRadius: 2,
                    display: "flex",
                    color: "primary.main",
                  }}
                >
                  <LocationOnOutlinedIcon fontSize="medium" />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ color: "#101828" }}
                  >
                    {editaddressId ? "Edit Address" : "Add New Address"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure your accurate location configuration details
                    below.
                  </Typography>
                </Box>
              </Stack>

              {message && (
                <Alert
                  severity={message.type}
                  variant="standard"
                  sx={{ mt: 3, mb: 1, borderRadius: 2 }}
                >
                  {message.text}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSaveAddress} sx={{ mt: 4 }}>
                <Grid2 container spacing={2.5}>
                  <Grid2
                    size={{
                      xs: 12,
                      sm: addressForm.label === "OTHER" ? 6 : 12,
                    }}
                  >
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="address-type-label">
                        Address Type
                      </InputLabel>
                      <Select
                        labelId="address-type-label"
                        name="label"
                        value={addressForm.label}
                        onChange={handleAddressChange}
                        label="Address Type"
                        required
                      >
                        <MenuItem value="" disabled>
                          Select Type
                        </MenuItem>
                        <MenuItem value="HOME">🏠 Home</MenuItem>
                        <MenuItem value="OFFICE">🏢 Office</MenuItem>
                        <MenuItem value="OTHER">📍 Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid2>

                  {addressForm.label === "OTHER" && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="customLabel"
                        label="Specify Address Type"
                        value={otherLabel}
                        onChange={(e) => setOtherLabel(e.target.value)}
                        variant="outlined"
                        fullWidth
                        required
                      />
                    </Grid2>
                  )}

                  <Grid2 size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Street Address / Locality / Apartment"
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressChange}
                      required
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="country-label">Country</InputLabel>
                      <Select
                        labelId="country-label"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        label="Country"
                        required
                      >
                        <MenuItem value="" disabled>
                          Select Country
                        </MenuItem>
                        {Object.keys(countriesData).map((country) => (
                          <MenuItem key={country} value={country}>
                            {country}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControl
                      fullWidth
                      disabled={
                        !addressForm.country || availableStates.length === 0
                      }
                    >
                      <InputLabel id="state-label">State / Province</InputLabel>
                      <Select
                        labelId="state-label"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        label="State / Province"
                        required
                      >
                        <MenuItem value="" disabled>
                          Select State
                        </MenuItem>
                        {availableStates.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </Grid2>

                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Pincode / ZIP Code"
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressChange}
                      required
                    />
                  </Grid2>
                </Grid2>

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ mt: 5 }}
                >
                  <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={onClose}
                    sx={{ color: "text.secondary", px: 3, py: 1.2 }}
                    fullWidth={{ xs: true, sm: false }}
                  >
                    Back to Profile
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    startIcon={
                      savingAddress ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={savingAddress}
                    sx={{ px: 4, py: 1.2, fontWeight: 600, borderRadius: 2 }}
                    fullWidth={{ xs: true, sm: false }}
                  >
                    {savingAddress
                      ? "Saving Details..."
                      : editaddressId
                        ? "Update Address"
                        : "Save Location"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </CustomerCardAuth>
        </Box>
      </DialogContent>
    </Dialog>
  );
}