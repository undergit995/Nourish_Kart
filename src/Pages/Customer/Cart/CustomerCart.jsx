import { Alert } from "@mui/material";
import Grid2 from "@mui/material/Grid"; // Uses updated MUI Grid2 layout system
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {
  posteditaddress,
  updateeditaddress,
} from "../../../Redux/Slices/CM_ProfileSlice";
import {
  Box,
  Card,
  Chip,
  CardContent,
  IconButton,
  CardMedia,
  Grid,
  MenuItem,
  Select,
  Stack,
  Paper,
  Typography,
  Button,
  Checkbox,
  Skeleton,
  Modal,
  FormControl,
  TextField,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState, lazy, Suspense } from "react";
import api from "../../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar, SnackbarProvider, useSnackbar } from "notistack";
import { EditNotificationsSharp } from "@mui/icons-material";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../Components/Common/Buttons";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  addToCart,
  addValue,
  getItems,
  removeCartItem,
  updateCartQuantity,
  allApplyCoupon,
  removeCoupon,
} from "../../../Redux/Slices/CM_CartSlice";
import PaymentButton from "../Payments/PaymentButton";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomerCardAuth from "../Profile/CustomerCardAuth";
const AddressModal = lazy(() => import("../Cart/DeliveryAddress"));

const cartCardAnimation = {
  "@keyframes cartCard": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.03)" },
    "100%": { transform: "scale(1)" },
  },
};

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

export default function CustomerCart() {
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const cartTotals = useSelector((state) => state.cart.totals);
  const quantity = useSelector((state) => state.cart.cartValue);

  let token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let decodeId = jwtDecode(token).id;
  const [addresses, setAddress] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const [open, setOpen] = React.useState(false);
  const [updateAddress, setUpdateAddress] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeId, setRemoveId] = useState("");

  const {enqueueSnackbar} = useSnackbar();

  const handleAddress = () => {
    setIsModalOpen(true);
  };
  const handleAddressOpen = () => setAddressModalOpen(true);
  const handleAddressClose = () => setAddressModalOpen(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveCoupon = async () => {
    try {
      let res = await api.delete("/cart/remove-coupon");
      dispatch(removeCoupon());
    } catch (error) {
      console.error("Failed to remove coupon:", error);
    }
  };

  const subtotal = cartItems.reduce((total, item) => {
    const discountedPrice =
      Number(
        item.product.price - (item.product.price * item.product.discount) / 100,
      ) * 100;
    const itemTotal = discountedPrice * item.quantity;
    return total + itemTotal;
  }, 0);

  const coupon = cartItems[0]?.coupon;
  const formatPrice = (amountInPaise) => (amountInPaise / 100).toFixed(2);
  let couponDiscountAmount = 0;

  if (coupon) {
    const calculatedDiscount = (subtotal / 100) * (coupon.discount / 100);
    couponDiscountAmount = Math.min(calculatedDiscount, coupon.max_discount);
  }

  const shipping = formatPrice(subtotal) <= 1000 ? 0 : 0;

  const grandTotal =
    Number(formatPrice(subtotal)) + Number(shipping) - couponDiscountAmount;
  //update quantity
  function handleChange(cartId, quantity) {
    if (quantity > 0) {
      dispatch(updateCartQuantity({ cartId, quantity }));
    } else {
      dispatch(removeCartItem(cartId));
    }
  }
  async function saveForLater(cartId) {
    try {
      const res = await api.post(`/cart/later/${cartId}`);
      enqueueSnackbar("Saved for later", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Failed to save item", {
        variant: "error",
      });
    }
  }

  function deleteModal(params) {
    setOpenDeleteDialog(true);
    setRemoveId(params);
  }

  //delete cart
  function deleteCart() {
    dispatch(removeCartItem(removeId)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        enqueueSnackbar("Item removed", {
          variant: "success"
        });
      }
    });
    setOpenDeleteDialog(false);
  }
  //get Customer Address
  async function getAddress() {
    try {
      const res = await api.get("/updateCustomerProfile/getAddresses");

      const addressList = res.data.addresses;

      setAddress(addressList);
      const defaultAddress =
        addressList.find((item) => item.isDefault) || addressList[0];
      setUpdateAddress(defaultAddress);
    } catch (error) {
      console.error("Failed to get address:", error);
    }
  }

  //delete cart
  function deleteCart() {
    dispatch(removeCartItem(removeId)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        enqueueSnackbar("Item removed", {
          variant: "success",
        });
      }
    });
    setOpenDeleteDialog(false);
  }

  async function changeAddress(params) {
    try {
      let res = await api.put(`/customer/cart/getAddress/${decodeId}`);
      dispatch(address(res.data.address));
    } catch (error) {
      enqueueSnackbar("failed to update address", { variant: "error" });
    }
  }
  async function orderPayment(params) {}
  let address =
    updateAddress && Object.keys(updateAddress).length
      ? updateAddress
      : addresses || [];

  useEffect(() => {
    if (cartStatus === "idle") dispatch(getItems());
  }, [cartStatus, dispatch]);
  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    if (coupon && subtotal / 100 < coupon.min_order_value) {
      handleRemoveCoupon();
      enqueueSnackbar(
        `Coupon removed as order total is below ₹${coupon.min_order_value}`,
        { variant: "warning" },
      );
    }
  }, [cartItems, subtotal]);
  useEffect(() => {
    if (addresses.length && !updateAddress) {
      const defaultAddress =
        addresses.find((item) => item.isDefault) || addresses[0];
      setUpdateAddress(defaultAddress);
    }
  }, [addresses]);
  if (cartStatus === "loading") {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container>
          <Grid size={{ xs: 12, sm: 8, md: 8 }}>
            <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={120} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Skeleton variant="rectangular" height={200} sx={{ ml: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (cartItems?.length <= 0) {
    return (
      <Box sx={{ width: "screen", p: 3 }}>
        <Typography
          align="center"
          variant="h4"
          color="text.primary"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: "#3E1A89",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingCartOutlinedIcon
            sx={{
              fontSize: 100,
              color: "#3E1A89",
              opacity: 0.2,
              mb: 2,
            }}
          />
          Your Cart is Empty
        </Typography>
        <Typography
          align="center"
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          <SecondaryButton onClick={() => navigate("/customer/products")}>
            Browse Items
          </SecondaryButton>
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        color="text.primary"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        My Cart
      </Typography>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#3E1A89",
          }}
        >
          Remove Item
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to remove this item from your cart?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>

          <Button color="error" variant="contained" onClick={deleteCart}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 8, md: 8 }}>
          <Stack>
            {cartStatus === "loading" ? (
              <Skeleton variant="rectangular" />
            ) : (
              <Suspense
                fallback={
                  <>
                    <Skeleton variant="rectangular" />
                    <Skeleton variant="text" />
                  </>
                }
              >
                <AddressModal
                  addresses={addresses}
                  setAddress={setAddress}
                  setUpdateAddress={setUpdateAddress}
                  open={addressModalOpen}
                  onClose={() => setAddressModalOpen(false)}
                />
              </Suspense>
            )}
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
              paperprops={{
                sx: {
                  width: "100%",
                  maxWidth: 600,
                  margin: "auto",
                  p: 2,
                },
              }}
            >
              <DialogTitle
                component="div"
                sx={{
                  p: 3,
                  background:
                    "linear-gradient(to right, rgba(255,255,255,0.8), rgba(240,244,248,0.5))",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: "-0.5px",
                      color: "text.primary",
                    }}
                  >
                    Delivery Address
                  </Typography>

                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    color="primary"
                    onClick={() => {
                      handleClose();
                      setAddressModalOpen(true);
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                    }}
                  >
                    + Add New Address
                  </Button>
                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 400 }}
                >
                  Select one from your saved profiles below, or click the button
                  above to add a new destination.
                </Typography>
              </DialogTitle>
              <DialogContent dividers>
                {addresses.length > 0 ? (
                  addresses.map((item) => (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      <Checkbox
                        checked={updateAddress?._id === item._id}
                        onChange={() => setUpdateAddress(item)}
                      />
                      <DialogContentText sx={{ color: "text.primary" }}>
                        {item.street}, {item.city}, {item.state}, {item.pincode}
                      </DialogContentText>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    No Saved Addresses Found.
                  </Typography>
                )}
              </DialogContent>

              <DialogActions>
                <Button variant="contained" autoFocus onClick={handleClose}>
                  Done
                </Button>
              </DialogActions>
            </Dialog>
            {cartItems?.map((item) => (
              <Card
                key={item._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  borderRadius: 4,
                  p: 1.5,
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: 2,
                  background: "linear-gradient(135deg,#fff,#f8f9ff)",
                  border: "1px solid rgba(62,26,137,0.10)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 18px 40px rgba(62,26,137,0.12)",
                  },
                }}
              >
                <Stack>
                  <Box
                    component="img"
                    src={
                      item?.product?.image?.[0]
                        ? `${item.product.image[0]
                            .replace(/\\/g, "/")
                            .replace(/^\/+/, "")}`
                        : "/no-image.png"
                    }
                    alt="No-img"
                    loading="lazy"
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: 3,
                      objectFit: "cover",
                      border: "2px solid rgba(62,26,137,0.08)",
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1.5px solid rgba(62,26,137,.15)",
                      width: 90,
                      borderRadius: 3,
                      bgcolor: "#fff",
                      boxShadow: "0 4px 12px rgba(62,26,137,.08)",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        item.quantity > 1 &&
                        handleChange(item._id, item.quantity - 1)
                      }
                      sx={{
                        color: "#3E1A89",
                        borderRadius: 0,
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography
                      sx={{
                        minWidth: 22,
                        textAlign: "center",
                        fontWeight: 700,
                        color: "#3E1A89",
                      }}
                    >
                      {item.quantity}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => handleChange(item._id, item.quantity + 1)}
                      sx={{
                        color: "#3E1A89",
                        borderRadius: 0,
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Stack>
                <Stack sx={{ flexDirection: "row", flex: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack>
                      <Chip
                        size="small"
                        color={item?.product?.isAvailable ? "success" : "error"}
                        label={
                          item.product.isAvailable
                            ? "Available"
                            : "Out of Stock"
                        }
                        sx={{
                          fontWeight: 600,
                          width: 80,
                        }}
                      />
                      <Typography variant="h6" fontWeight={700} color="#1f2937">
                        {item.product.name}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      {item?.product?.description}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ mt: 1 }}
                    >
                      <Chip
                        size="small"
                        label="In Cart"
                        sx={{
                          bgcolor: "rgba(62,26,137,0.08)",
                          color: "#3E1A89",
                          fontWeight: 600,
                        }}
                      />

                      {item?.product?.rating > 0 && (
                        <Chip
                          size="small"
                          icon={
                            item?.product?.rating && (
                              <StarIcon sx={{ fontSize: 16 }} />
                            )
                          }
                          label={`${item?.product?.rating}`}
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexGrow: "initial",
                      flexDirection: { sm: "column", md: "row" },
                      alignItems: "center",
                      gap: { xs: 1, sm: 2 },
                      minWidth: { sm: 100 },
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#6B7280",
                          fontWeight: 600,
                        }}
                      >
                        Price
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: 600,
                          textDecoration: "line-through",
                          color: "#3E1A89",
                        }}
                      >
                        ₹{(item?.product?.price * item?.quantity).toFixed(2)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          color: "#3E1A89",
                        }}
                      >
                        ₹
                        {((item?.product?.price -
                          (item?.product?.price * item?.product?.discount) /
                            100) *
                          item?.quantity).toFixed(2)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        sx={{
                          borderRadius: 99,
                          textTransform: "none",
                          fontSize: "0.8rem",
                          px: 2,
                        }}
                        onClick={() => deleteModal(item?._id)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background: "linear-gradient(to bottom, #ffffff, #fcfcfc)",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 4,
                background: "linear-gradient(90deg, #4CAF50, #2E7D32)",
              }}
            />

            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="text.primary"
                sx={{
                  mb: 2.5,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                }}
              >
                Price Details
              </Typography>

              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography color="text.secondary" variant="body2">
                    Subtotal ({quantity} items)
                  </Typography>

                  <Typography
                    color="text.primary"
                    fontWeight={500}
                    variant="body2"
                  >
                    ₹{formatPrice(subtotal)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography color="text.secondary" variant="body2">
                    Shipping
                  </Typography>

                  <Chip
                    icon={<LocalShippingIcon
                          style={{ fontSize: "14px", color: "#1b5e20" }}
                        />}
                    label={"FREE"}
                    size="small"
                    sx={{
                      backgroundColor: "#e8f5e9",
                      color: "#1b5e20",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #c8e6c9",
                    }}
                  />
                </Box>

                {cartItems[0]?.coupon && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#f1f8e9",
                      border: "1px solid #c5e1a5",
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          color="success.dark"
                        >
                          Coupon Applied: {cartItems[0].coupon.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {cartItems[0].coupon.discount}% OFF
                        </Typography>
                        <Typography
                          variant="body2"
                          color="success.dark"
                          fontWeight={600}
                        >
                          - ₹{couponDiscountAmount.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4, md: 4 }} sx={{ textAlign: "right" }}>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={handleRemoveCoupon}
                          sx={{ textTransform: "none" }}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    color="text.primary"
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color="primary.main"
                  >
                    ₹{formatPrice(grandTotal * 100)}
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ mt: 3, mb: 2, display: "flex", gap: 1 }}>
                <Box
                  sx={{
                    borderRadius: "9px",
                    position: "relative",
                    overflow: "hidden",
                    px: 1,
                    py: 0.5,
                    background: "linear-gradient(145deg, #2c22e3, #3726cf)",
                    boxShadow: `
                      inset 0 2px 4px rgba(255,255,255,0.4),
                      inset 0 -4px 8px rgba(0,0,0,0.2),
                      0 6px 15px rgba(50, 37, 33, 0.35)
                    `,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 4,
                      left: 8,
                      width: "40%",
                      height: "25%",
                      background: "rgba(255,255,255,0.45)",
                      borderRadius: "50%",
                      filter: "blur(6px)",
                      pointerEvents: "none",
                    },
                    "& :hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate(`/customer/coupon`)}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: 1,
                    }}
                  >
                    coupon
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={2}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="text.primary">
                      Saved Address
                    </Typography>

                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {updateAddress ? (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          key={updateAddress._id}
                        >
                          {`${updateAddress.street}, ${updateAddress.city}, ${updateAddress.state}, ${updateAddress.country}, ${updateAddress.pincode}`}
                        </Typography>
                      ) : (
                        "No Address Found"
                      )}

                      {updateAddress ? (
                        <IconButton onClick={() => handleClickOpen()}>
                          <EditIcon />
                        </IconButton>
                      ) : (
                        <PrimaryButton
                          onClick={() => setAddressModalOpen(true)}
                        >
                          <AddIcon/>
                        </PrimaryButton>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>

              <Box sx={{ mt: 1 }}>
                <PaymentButton
                  addressId={updateAddress?._id}
                  amount={formatPrice(grandTotal * 100)}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

{
  /* 
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      borderRadius: 99,
                      textTransform: "none",
                      fontSize: "0.75rem",
                      px: 2,
                      bgcolor: "#3E1A89",
                      "&:hover": { bgcolor: "#2C1265" },
                    }}
                    onClick={() => saveForLater(item._id)}
                  >
                    Save
                  </Button> */
}
/* {
              
           */
