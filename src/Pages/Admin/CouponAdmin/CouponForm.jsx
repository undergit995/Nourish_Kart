import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
  Select,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    transition: "all 0.2s ease-in-out",
    backgroundColor: "rgba(255, 255, 255, 1)",
    "& fieldset": {
      borderColor: "rgba(62, 26, 137, 0.15)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(62, 26, 137, 0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3E1A89",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(62, 26, 137, 0.6)",
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#3E1A89",
    },
  },
};
export default function CouponForm({ getCoupons }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialCoupon = {
    title: "",
    description: "",
    code: "",
    discount: "",
    max_discount: "",
    status: "",
    min_order_value: "",
    starts_At: "",
    ends_At: "",
  };

  const [couponForm, setCouponForm] = useState(initialCoupon);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (editingCoupon) {
        await api.put(`/coupon/updateCoupon/${editingCoupon._id}`, couponForm);
        enqueueSnackbar("Coupon updated successfully", { variant: "success" });
      } else {
        let res = await api.post("/coupon/setCoupon", couponForm);
        console.log(res.data);

        enqueueSnackbar("Coupon created successfully", { variant: "success" });
      }
      navigate("/admin/coupons");

      setCouponForm(initialCoupon);
      setEditingCoupon(null);

      if (typeof getCoupons === "function") getCoupons();
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message ||
          "Something went wrong while processing the layout.",
        { variant: "error" },
      );
    }
  };
  useEffect(() => {
    const fetchSingleCoupon = async () => {
      if (id) {
        try {
          setLoading(true);
          const res = await api.get(`/coupon/getCoupons`);
          const allCoupons = res?.data?.coupons || [];

          const targetCoupon = allCoupons.find((c) => c._id === id);
          if (targetCoupon) {
            setEditingCoupon(targetCoupon);
            setCouponForm({
              title: targetCoupon.title || "",
              description: targetCoupon.description || "",
              code: targetCoupon.code || "",
              discount: targetCoupon.discount || "",
              status: targetCoupon.status || "",
              max_discount: targetCoupon.max_discount || "",
              min_order_value: targetCoupon.min_order_value || "",
              starts_At: targetCoupon.starts_At
                ? targetCoupon.starts_At.slice(0, 16)
                : "",
              ends_At: targetCoupon.ends_At
                ? targetCoupon.ends_At.slice(0, 16)
                : "",
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setCouponForm(initialCoupon);
        setEditingCoupon(null);
      }
    };

    fetchSingleCoupon();
  }, [id]);
  return (
    <Card
      sx={{
        p: { xs: 3, sm: 4, md: 5 },
        borderRadius: "24px",
        mb: 4,
        background: "#fff",
        border: "1px solid rgba(62, 26, 137, 0.08)",
        boxShadow:
          "0px 20px 50px rgba(62, 26, 137, 0.04), 0px 4px 12px rgba(0, 0, 0, 0.01)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SnackbarProvider />

      <Button
        onClick={() => window.history.back()}
        sx={{
          position: "relative",
          minWidth: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "#fff",
          border: "1px solid rgba(62, 26, 137, 0.2)",
          color: "#3E1A89",
          fontWeight: 700,
          boxShadow: "0px 8px 20px rgba(62, 26, 137, 0.08)",
          "&:hover": {
            background: "#3E1A89",
            color: "#fff",
          },
        }}
      >
        ←
      </Button>

      <Typography
        variant="h5"
        fontWeight={800}
        mb={5}
        sx={{
          color: "#3E1A89",
          letterSpacing: "-0.5px",
          textAlign: "center",
        }}
      >
        {editingCoupon ? "Modify Coupon Parameters" : "Provision New Coupon"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
          gap: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="Title"
              value={couponForm.title}
              onChange={(e) =>
                setCouponForm({ ...couponForm, title: e.target.value })
              }
              sx={inputStyles}
            />
            <TextField
              fullWidth
              label="Banner Code"
              label="Coupon Code"
              value={couponForm.code}
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  code: e.target.value.toUpperCase().replace(/\s+/g, ""),
                })
              }
              sx={inputStyles}
              inputProps={{
                maxLength: 20,
                style: { textTransform: "uppercase" },
                pattern: "\\S+",
              }}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={couponForm.description}
            onChange={(e) =>
              setCouponForm({ ...couponForm, description: e.target.value })
            }
            sx={inputStyles}
          />

          <TextField
            fullWidth
            type="number"
            label="Minimum Order Value"
            value={couponForm.min_order_value}
            onChange={(e) =>
              setCouponForm({ ...couponForm, min_order_value: e.target.value })
            }
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Discount (%)"
            value={couponForm.discount}
            onChange={(e) =>
              setCouponForm({ ...couponForm, discount: e.target.value })
            }
            sx={inputStyles}
          />

          <TextField
            fullWidth
            type="number"
            label="Maximum Discount"
            value={couponForm.max_discount}
            onChange={(e) =>
              setCouponForm({ ...couponForm, max_discount: e.target.value })
            }
            sx={inputStyles}
          />
          <FormControl fullWidth sx={inputStyles}>
            <InputLabel>Status</InputLabel>

            <Select
              value={couponForm.status}
              label="Status"
              onChange={(e) =>
                setCouponForm({
                  ...couponForm,
                  status: e.target.value,
                })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="inActive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={inputStyles}>
            <InputLabel shrink sx={{ color: "#3E1A89" }}>
              Starts At
            </InputLabel>

            <OutlinedInput
              type="datetime-local"
              value={couponForm.starts_At}
              onChange={(e) =>
                setCouponForm({ ...couponForm, starts_At: e.target.value })
              }
              label="Starts At"
              sx={{
                color: "#3E1A89",
                "& input": {
                  padding: "14px",
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth sx={inputStyles}>
            <InputLabel shrink sx={{ color: "#3E1A89" }}>
              Ends At
            </InputLabel>

            <OutlinedInput
              type="datetime-local"
              value={couponForm.ends_At}
              onChange={(e) =>
                setCouponForm({ ...couponForm, ends_At: e.target.value })
              }
              label="Starts At"
              sx={{
                color: "#3E1A89",
                "& input": {
                  padding: "14px",
                },
              }}
            />
          </FormControl>
        </Box>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row-reverse" }}
        spacing={2}
        justifyContent="center"
        mt={5}
      >
        <Button
          fullWidth={{ xs: true, sm: false }}
          variant="contained"
          onClick={handleSubmit}
          sx={{
            minWidth: "200px",
            bgcolor: "#3E1A89",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "14px",
            py: 1.8,
            boxShadow: "0px 10px 25px rgba(62, 26, 137, 0.25)",
            "&:hover": {
              bgcolor: "#2d1266",
            },
          }}
        >
          {editingCoupon ? "Update Coupon" : "Publish Coupon"}
        </Button>

        {editingCoupon && (
          <Button
            fullWidth={{ xs: true, sm: false }}
            variant="outlined"
            onClick={() => {
              setEditingCoupon(null);
              setCouponForm(initialCoupon);
            }}
            sx={{
              borderColor: "rgba(62, 26, 137, 0.3)",
              color: "#3E1A89",
              fontWeight: 700,
              borderRadius: "14px",
              textTransform: "none",
              px: 4,
              "&:hover": {
                background: "rgba(62, 26, 137, 0.05)",
                borderColor: "#3E1A89",
              },
            }}
          >
            Cancel
          </Button>
        )}
      </Stack>
    </Card>
  );
}
