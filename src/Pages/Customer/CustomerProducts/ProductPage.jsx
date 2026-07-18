import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../Components/Common/Buttons";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  getItems,
  updateCartQuantity,
  removeCartItem,
} from "../../../Redux/Slices/CM_CartSlice";
import {
  Box,
  Card,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Dialog,
  Paper,
  Stack,
  Typography,
  Chip,
  Rating,
  Snackbar,
  Button,
} from "@mui/material";
import { Add, DeleteOutlineRounded, Remove } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { jwtDecode } from "jwt-decode";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomerReview from "./CustomerReview";

export default function ProductPage() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [cartSnackbar, setCartSnackbar] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => String(item?.product?._id ?? item?.product) === String(id)),
  );

  const quantity = cartItem?.quantity ?? 0;
  const isInCart = !!cartItem;
  const handleOpenImageModal = (index = 0) => {
    setActiveImageIndex(index);
    setImageModalOpen(true);
  };

  let token = localStorage.getItem("token");
  let decodeId = jwtDecode(token).id;

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  async function getProduct() {
    try {
      setLoading(true);
      const res = await api.get(`/filter-products/getprd/${id}`);
      setProduct(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const dispatch = useDispatch();

  const discountedPrice =
    product?.price - (product?.price * product?.discount) / 100;

  const addItem = async () => {
    if (product.stock <= 0) {
      return;
    }

    try {
      if (isInCart) {
        dispatch(
          updateCartQuantity({
            cartId: cartItem._id,
            quantity: cartItem.quantity + 1,
          }),
        );
      } else {
        dispatch(addToCart({ product: id, customer: decodeId, quantity: 1 }));
      }
      setCartSnackbar(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handleIncrease = () => {
  if (!cartItem) return;
  dispatch(
    updateCartQuantity({
      cartId: cartItem._id,
      quantity: cartItem.quantity + 1,
    })
  );
};

  const handleDecrease = async () => {
    if (isInCart) {
      if (cartItem.quantity > 1) {
        dispatch(
          updateCartQuantity({
            cartId: cartItem._id,
            quantity: cartItem.quantity - 1,
          }),
        );
      } else {
        dispatch(removeCartItem(cartItem._id));
      }
    }
  };

  async function checkOutPage() {
    if (product.stock <= 0) {
      return;
    }

    if (!isInCart) {
      await addItem();
      navigate("/customer/cart");
      return;
    }

    navigate("/customer/cart");
  }
  console.log(cartItem);
  
  useEffect(() => {
    getProduct();
    dispatch(getItems());
  }, [id,dispatch]);
  
  useEffect(() => {
    setImageLoading(true);
  }, []);

  const images =
    product?.image?.map(
      (img) => `${img.replace(/\\/g, "/").replace(/^\/+/, "")}`,
    ) || [];

  return (
    <Box sx={{ p: { xs: 2, md: 4, transition: "0.3s" } }}>
      <Snackbar
        open={cartSnackbar}
        autoHideDuration={5000}
        onClose={() => setCartSnackbar(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          top: "200px !important",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography fontWeight={600}>Added to cart ✓</Typography>

          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/customer/cart")}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Go to Cart
          </Button>
        </Paper>
      </Snackbar>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Card
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
            }}
          > 
            {loading ? (
              <Skeleton variant="rectangular" height={450} />
            ) : (
              <Box
                component="img"
                src={images[selectedImage] || "/no-image.png"}
                alt={product?.name}                
                loading="lazy"
                sx={{
                  width: "100%",
                  height: { xs: 320, md: 550 },
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            )}
          </Card>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 2,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {loading
              ? Array.from(new Array(4)).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width={70}
                    height={70}
                    sx={{ borderRadius: 2, flexShrink: 0 }}
                  />
                ))
              : images.map((img, index) => {
                  return (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: 2,
                        flexShrink: 0,
                        borderColor:
                          selectedImage === index ? "primary.main" : "divider",
                        position: "relative",
                      }}
                    >
                      <Box
                        component="img"
                        src={img}
                        loading="lazy"
                        sx={{
                          borderColor:
                            selectedImage === index
                              ? "primary.main"
                              : "divider",
                          transition: "all 0.2s ease",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  );
                })}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
          <Stack spacing={3}>
            {loading ? (
              <>
                <Skeleton variant="text" width="80%" height={45} />
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="rounded" width={100} height={24} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="60%" height={50} sx={{mt: 2}}/>
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={700}>
                  {product?.name}
                </Typography>

                <Stack direction="row" spacing={2}>
                  {product.rating > 0 ? (
                    <>
                      <Rating
                        value={product.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2">
                        ({product.rating})
                      </Typography>
                    </>
                  ) : (
                    <Chip
                      label="New"
                      color="primary"
                      size="small"
                      variant="filled"
                    />
                  )}
                </Stack>

                <Stack spacing={2}>
                  <Chip
                    label={
                      product.stock > 10
                        ? "In Stock"
                        : product.stock > 0
                        ? "Low Stock"
                        : "Out of Stock"
                    }
                    color={product?.stock > 0 ? "success" : "error"}
                    sx={{
                      width: "fit-content",
                    }}
                  />

                  <Typography
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.8,
                    }}
                  >
                    {product?.description}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ alignItems: "end" }}>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color="primary.main"
                  >
                    ₹{discountedPrice.toFixed(2)}
                  </Typography>

                  {product?.discount > 0 && (
                    <>
                      <Typography
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                        }}
                      >
                        ₹{product.price.toFixed(2)}
                      </Typography>

                      <Chip
                        label={`${product.discount}% OFF`}
                        color="secondary"
                        size="small"
                      />
                    </>
                  )}
                </Stack>
              </>
            )}

            <Divider />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {loading ? (
                <>
                  <Skeleton variant="rectangular" height={50} />
                  <Skeleton variant="rectangular" height={50} />
                </>
              ) : !isInCart ? (
                <PrimaryButton
                  disabled={product.stock <= 0}
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "primary",
                    color: "#fff",
                    py: 1.1,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#10003c",
                      boxShadow: "none",
                    },
                  }}
                  onClick={addItem}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </PrimaryButton>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #e5e7eb",
                    borderRadius: 3,
                    px: 1,
                    py: 0.5,
                    width: "100%",
                  }}
                >
                  <IconButton onClick={handleDecrease}>
                    {quantity === 1 ? (
                      <DeleteOutlineRounded color="error" />
                    ) : (
                      <RemoveIcon />
                    )}
                  </IconButton>

                  <Typography fontWeight={600}>{quantity}</Typography>

                  <IconButton onClick={handleIncrease}>
                    <AddIcon />
                  </IconButton>
                </Box>
              )}

              {loading ? null : (
                <PrimaryButton
                  size="large"
                  fullWidth
                  onClick={checkOutPage}
                  disabled={product.stock <= 0}
                >
                  Buy Now
                </PrimaryButton>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Paper
        elevation={2}
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          Product Specifications
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            {loading ? (
              <>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={150} />
              </>
            ) : (
              <>
                <Typography fontWeight={600}>Category</Typography>
                <Typography color="text.secondary">
                  {product?.category?.name || "N/A"}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={2}>
          Key Features
        </Typography>

        {loading ? (
          <Stack spacing={1}>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Stack>
        ) : product?.features?.length > 0 ? (
          <ul>
            {product.features.map((item, index) => (
              <li key={index}>
                <Typography>{item}</Typography>
              </li>
            ))}
          </ul>
        ) : (
          <Typography color="text.secondary">No features available</Typography>
        )}
      </Paper>
      <CustomerReview id={{ id: product?._id }} />
    </Box>
  );
}

/* <Dialog
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            width: "80vw",
            height: "80vh",
            maxWidth: "80vw",
            maxHeight: "80vh",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#000",
          },
        }}
      >
        <Box sx={{ position: "relative", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={images[activeImageIndex]}
              style={{
                maxHeight: "70vh",
                maxWidth: "100%",
                borderRadius: 10,
              }}
            />
          </Box>

          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)",
              color: "primary",
            }}
          >
            ‹
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)",
              color: "primary",
            }}
          >
            ›
          </IconButton>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          ></Box>
        </Box>
      </Dialog> */