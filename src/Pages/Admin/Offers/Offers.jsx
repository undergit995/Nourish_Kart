import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api/axiosConfig";
import OfferPreviewBanner from "./AllBanners";

const backgroundOptions = [
  {
    id: 1,
    name: "Purple Night",
    bg: "linear-gradient(135deg, #4b1d95 0%, #7b2cbf 50%, #c77dff 100%)",
    textColor: "#ffffff",
    subTextColor: "#f3e8ff",
    offerBg: "#ffffff",
    offerText: "#4b1d95",
    chipBg: "rgba(255,255,255,0.15)",
    chipColor: "#ffffff",
    borderColor: "#c77dff",
  },
  {
    id: 2,
    name: "Ocean Blue",
    bg: "linear-gradient(135deg, #003566 0%, #00509d 50%, #4cc9f0 100%)",
    textColor: "#ffffff",
    subTextColor: "#dff6ff",
    offerBg: "#ffffff",
    offerText: "#003566",
    chipBg: "rgba(255,255,255,0.15)",
    chipColor: "#ffffff",
    borderColor: "#4cc9f0",
  },
  {
    id: 3,
    name: "Sunset Orange",
    bg: "linear-gradient(135deg, #9a031e 0%, #fb8b24 55%, #ffb703 100%)",
    textColor: "#ffffff",
    subTextColor: "#fff1d6",
    offerBg: "#fff8e8",
    offerText: "#9a031e",
    chipBg: "rgba(255,255,255,0.18)",
    chipColor: "#ffffff",
    borderColor: "#ffb703",
  },
  {
    id: 4,
    name: "Emerald Green",
    bg: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #95d5b2 100%)",
    textColor: "#ffffff",
    subTextColor: "#eafff3",
    offerBg: "#f3fff8",
    offerText: "#1b4332",
    chipBg: "rgba(255,255,255,0.18)",
    chipColor: "#ffffff",
    borderColor: "#95d5b2",
  },
  {
    id: 5,
    name: "Dark Premium",
    bg: "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    textColor: "#ffffff",
    subTextColor: "#e5e7eb",
    offerBg: "#ffffff",
    offerText: "#111827",
    chipBg: "rgba(255,255,255,0.14)",
    chipColor: "#ffffff",
    borderColor: "#9ca3af",
  },
];

function ThemeSelectorRow({
  selectedBg,
  setSelectedBg,
  selectedCoupon,
  coupons,
  handleCouponSelect,
}) {
  return (
    <Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
          Select Theme
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {backgroundOptions.map((item) => {
            const active = selectedBg?.id === item.id;

            return (
              <Card
                key={item.id}
                onClick={() => setSelectedBg(item)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  background: item.bg,
                  color: item.textColor,
                  border: active
                    ? `3px solid ${item.borderColor}`
                    : "1px solid #e5e7eb",
                  transition: "all 0.25s ease",
                  overflow: "hidden",
                  minHeight: 80,
                }}
              >
                <CardContent>
                  <Typography
                    fontWeight={800}
                    sx={{
                      wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {item.name}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight={800} mb={2}>
          Available Coupons
        </Typography>

        <Grid container spacing={2}>
          {coupons?.map((coupon) => {
            const selected = selectedCoupon === coupon?._id;
            return (
              <Grid item xs={12} sm={6} md={4} key={coupon?._id}>
                <Card
  onClick={() => handleCouponSelect(coupon)}
  sx={{
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    borderRadius: 4,
    border: selected ? "2px solid #3E1A89" : "1px solid rgba(62,26,137,0.15)",
    background: "#fff",
    transition: "all 0.25s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",

    boxShadow: selected
      ? "0 15px 40px rgba(62,26,137,0.25)"
      : "0 8px 25px rgba(62,26,137,0.08)",
    transition: "all 0.25s ease",
    "&:hover": {
      boxShadow: "0 18px 45px rgba(62,26,137,0.18)",
      transform: "translateY(-2px)",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "40%",
      background:
        "linear-gradient(180deg, rgba(62,26,137,0.15), rgba(255,255,255,0))",
      pointerEvents: "none",
    },

    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      boxShadow: selected
        ? "inset 0 0 0 1px rgba(62,26,137,0.4)"
        : "none",
      pointerEvents: "none",
    },
  }}
>
  <CardContent
    sx={{
      position: "relative",
      zIndex: 1,
      py: 3,
    }}
  >
    <Typography
      fontWeight={800}
      sx={{
        fontSize: "1.1rem",
        color: "#3E1A89",
        letterSpacing: 0.5,
      }}
    >
      {coupon?.title}
    </Typography>

    <Typography
      mt={1.5}
      sx={{
        fontSize: "0.9rem",
        color: "#3E1A89",
      }}
    >
      Code:{" "}
      <strong
        style={{
          color: "#3E1A89",
          padding: "2px 8px",
          borderRadius: "6px",
          fontWeight: 700,
        }}
      >
        {coupon?.code}
      </strong>
    </Typography>

    <Typography
      mt={2}
      sx={{
        fontWeight: 400,
        color: "#3E1A89",
      }}
    >
      {coupon?.discount}% OFF
    </Typography>

    {coupon?.max_discount && (
      <Typography
        mt={1}
        sx={{
          fontSize: "0.85rem",
          color: "#3E1A89",
          opacity: 0.8,
        }}
      >
        Max Savings: ₹{coupon?.max_discount}
      </Typography>
    )}
  </CardContent>
</Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export function AutoCarousel({
  images = [],
  editable = false,
  existingImages = [],
  onRemoveExistingImage,
  onRemoveNewImage,
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    setCurrent(0);
  }, [editable, existingImages.length, images.length]);

  if (!images.length) {
    return (
      <Box
        sx={{width: { xs: "100%" }, 
        height: { xs: 240, sm: 300 },
        display: 'flex',
        alignItems: 'center',
          justifyContent: "center",
          textAlign: "center",
          // px: 3,
          boxShadow: "0 14px 35px rgba(0,0,0,0.18)",
        }}
      >
        <Typography color="text.secondary"  fontWeight={700} sx={{color:'#fff',width:'100%',fontSize:30}}>
          Upload images to preview the banner
        </Typography>
      </Box>
    );
  }

  const isExisting = current < existingImages.length;
  const newIndex = current - existingImages.length;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 240, sm: 300, md: 320 },
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: "#fff",
        boxShadow: "0 14px 35px rgba(0,0,0,0.18)",
        cursor: "pointer",
      }}
    >
      <Box
        component="img"
        src={images[current]}
        alt={`slide-${current}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {editable && isExisting && (
        <IconButton
          onClick={() => onRemoveExistingImage(current)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "rgba(255,255,255,0.95)",
            "&:hover": { bgcolor: "#fff" },
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      )}

      {editable && !isExisting && newIndex >= 0 && (
        <IconButton
          onClick={() => onRemoveNewImage(newIndex)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "rgba(255,255,255,0.95)",
            "&:hover": { bgcolor: "#fff" },
          }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      )}

      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            justifyContent: "center",
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrent(index)}
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                cursor: "pointer",
                backgroundColor:
                  current === index ? "#ffb703" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function Banners() {
  const theme = useTheme();
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  const offers = useSelector((state) => state.Offer.offers) || [];

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("inActive");
  const [selectedBg, setSelectedBg] = useState(backgroundOptions[0]);
  const [images, setImages] = useState([]);

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [banners,setBanners] = useState([]);
console.log(banners);


  const handleCouponSelect = (coupon) => {
     const isSelected = selectedCoupon === coupon._id;

  if (isSelected) {
    setSelectedCoupon(null);
    setTitle("");
    setDescription("");
    setCode("");
    return;
  }

  setSelectedCoupon(coupon._id);
  setTitle(coupon.title ?? "");
  setDescription(coupon.description  ?? "");
  setCode(coupon.code ?? "");
  };

  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const previewUrls = useMemo(() => {
    return images.map((file) => URL.createObjectURL(file));
  }, [images]);

  const editPreviewUrls = useMemo(() => {
    return newImages.map((file) => URL.createObjectURL(file));
  }, [newImages]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    return () => {
      editPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [editPreviewUrls]);

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const res = await api.get("/offer/getOffers");
      const fetchedOffers = res?.data?.offers || res?.data?.data || [];

      dispatch(getOffer(fetchedOffers));
    } catch (error) {
      console.error("GET ERROR:", error?.response?.data || error.message);
      setErrorText(error?.response?.data?.message || "Failed to load offers");
      dispatch(getOffer([]));
    } finally {
      setLoading(false);
    }
  };
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const res = await api.get("/coupon/getCoupons");
      const fetchedCoupons = res?.data?.coupons || res?.data?.data || [];
      
      setCoupons(p=>fetchedCoupons.filter((coupon) => coupon.status === "Active"));
    } catch (error) {
      setErrorText(error?.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setErrorText("");

      const res = await api.get("/banner/allBanners");
      const fetchedB = res?.data?.banners || res?.data?.data || [];

      setBanners(fetchedB);
    } catch (error) {
      setErrorText(error?.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchBanners();
  }, []);

  const resetCreateForm = () => {
    setTitle("");
    setDescription("");
    setCode("");
    setStatus("inActive");
    setSelectedCoupon(null)
    setImages([]);
    setSelectedBg(backgroundOptions[0]);
  };

  const resetEditForm = () => {
    setOpenEdit(false);
    setEditId(null);
    setExistingImages([]);
    setNewImages([]);
    setTitle("");
    setDescription("");
    setCode("");
    setImages([]);
    setSelectedCoupon(null)
    setStatus("inActive");
    setSelectedBg(backgroundOptions[0]);
  };

  const handleCreateImages = (e) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/"),
    );

    const merged = [...images, ...files].slice(0, 5);

    if (images.length + files.length > 5) {
      showToast("You can upload up to 5 images only", "error");
    }

    setImages(merged);
    e.target.value = "";
  };

  const removeCreateImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || !code) {
      showToast("Please fill title, description and code", "error");
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one image", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("code", code);
      formData.append("status", status);
      formData.append("color", selectedBg.bg);
      formData.append("coupon", selectedCoupon);
      images.forEach((file) => {
        formData.append("file", file);
      });
      const res = await api.post("/banner/setBanner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      resetCreateForm();
      showToast("Banner created successfully");
      await fetchBanners();
    } catch (error) {
      console.error("CREATE ERROR:", error?.response?.data || error.message);
      showToast(
        error?.response?.data?.message || "Failed to create banner",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/banner/deleteBanner/${id}`);
      showToast("Banner deleted successfully");
      await fetchBanners();
    } catch (error) {
      console.error("DELETE ERROR:", error?.response?.data || error.message);
      showToast(
        error?.response?.data?.message || "Failed to delete banner",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (banner) => {
    setEditId(banner._id);
    setTitle(banner.title || "");
    setDescription(banner.description || "");
    setCode(banner?.coupon?.code || "");
    setStatus((banner.status || "inActive"));
    setSelectedBg(
      backgroundOptions.find((bg) => bg.name === banner.background) ||
        backgroundOptions[0],
    );
    setExistingImages(Array.isArray(banner.image) ? banner.image : []);
    setNewImages([]);
    setOpenEdit(true);
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/"),
    );

    const total = existingImages.length + newImages.length + files.length;

    if (total > 5) {
      showToast("You can upload up to 5 images only", "error");
      e.target.value = "";
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeEditNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleUpdateBanner = async () => {
    if (!title || !description || !code) {
      showToast("Please fill title, description and code", "error");
      return;
    }

    if (existingImages.length + newImages.length === 0) {
      showToast("At least one image is required", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("code", code);
      formData.append("status", status);
      formData.append("color", selectedBg.bg);
      formData.append("existingImages", JSON.stringify(existingImages));

      newImages.forEach((file) => {
        formData.append("file", file);
      });

      const res = await api.put(`/banner/updateBanner/${editId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      resetEditForm();
      showToast("Banner updated successfully");
      await fetchBanners();
    } catch (error) {
      console.error("UPDATE ERROR:", error?.response?.data || error.message);
      showToast(
        error?.response?.data?.message || "Failed to update banner",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleStatusToggle = async (offer) => {
    const nextStatus = offer.status === "Active" ? "inActive" : "Active";

    try {
      setLoading(true);

      const res = await api.put(`/banner/bannerStatus/${offer._id}`, {
        status: nextStatus,
      });

      const updatedOffer = res?.data?.offer || res?.data?.status;
      await fetchBanners();

      showToast("Status updated successfully");
    } catch (error) {
      console.error("STATUS ERROR:", error?.response?.data || error.message);
      showToast(
        error?.response?.data?.message || "Failed to update status",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const createPreviewOffer = {
    title,
    description,
    code,
    status,
    background: selectedBg.name,
    images: previewUrls,
  };

  const editPreviewOffer = {
    title,
    description,
    code,
    status,
    background: selectedBg.name,
    images: [...existingImages, ...editPreviewUrls],
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={900} sx={{ mb: 1, color: "text.primary" }}>
          Banner Management
        </Typography>

        {!!errorText && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {errorText}
          </Alert>
        )}

        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={5} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: "1px solid #e7e9f0",
                bgcolor: "#fff",
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="h6" fontWeight={800} sx={{ color: "text.primary" }}>
                  Create Banner
                </Typography>

                <ThemeSelectorRow
                  selectedBg={selectedBg}
                  setSelectedBg={setSelectedBg}
                  selectedCoupon={selectedCoupon}
                  coupons={coupons}
                  handleCouponSelect={handleCouponSelect}
                />

                <Divider />

                <TextField
                  fullWidth
                  label="Banner Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <TextField
                  fullWidth
                  label="Banner Code"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/\s+/g, "");
                    setCode(value);
                  }}
                  inputProps={{
                    maxLength: 20,
                    style: { textTransform: "uppercase" },
                    pattern: "\\S+",
                  }}
                  helperText="Only uppercase letters/numbers, no spaces allowed"
                />

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="inActive">InActive</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ borderRadius: 3, textTransform: "none", py: 1.2 }}
                >
                  Upload Images
                  <input
                    hidden
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={handleCreateImages}
                  />
                </Button>

                <Typography variant="body2" color="text.secondary">
                  You can upload up to 5 images. Selected: {images.length}/5
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ borderRadius: 3, py: 1.3, textTransform: "none" }}
                >
                  {loading ? "Saving..." : "Save Banner"}
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={12} >
            <Box
              sx={{ position: 'sticky', top: 80 }}
            >
              <OfferPreviewBanner
                backgroundOptions={backgroundOptions}
                offer={createPreviewOffer}
                editable
                existingImages={[]}
                onRemoveExistingImage={() => {}}
                onRemoveNewImage={removeCreateImage}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        <Typography variant="h5" fontWeight={900} sx={{ mb: 3 }}>
          Saved Banners & Offers
        </Typography>

      <Stack spacing={4}>
          {banners.length > 0 ? (
            banners?.map((banner) => (
              <OfferPreviewBanner
                backgroundOptions={backgroundOptions}
                key={banner._id}
                offer={{
                  title: banner?.title,
                  description: banner?.description,
                  code: banner?.coupon?.code ?? banner?.code,
                  status: banner?.status,
                  background: banner?.color,
                  images: Array.isArray(banner?.image) ? banner?.image : [],
                }}
                actions={
                  <>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEdit(banner)}
                      sx={{ borderRadius: 2.5, textTransform: "none" }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => {
                        setSelectedUserId(banner?._id);
                        setOpenDelete(true);
                      }}
                      sx={{ borderRadius: 2.5, textTransform: "none" }}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => handleStatusToggle(banner)}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        color: "#fff",
                        bgcolor:banner?.status === "Active"
                        ? "rgba(37, 179, 61, 0.91)"
                        : "rgba(88, 93, 94, 0.91)",
                        border: "1px solid rgba(255,255,255,0.35)",
                      }}
                    >
                      {banner?.status === "Active"
                        ? "Set inActive"
                        : "Set Active"}
                    </Button>
                  </>
                }
              />
            ))
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 4,
                textAlign: "center",
                border: "1px solid #e7e9f0",
                bgcolor: "#fff",
              }}
            >
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1, color: "text.primary" }}>
                {loading ? "Loading banners..." : "No Banners yet"}
              </Typography>
              <Typography color="text.secondary">
                Create your first banner to display it here.
              </Typography>
            </Paper>
          )}
        </Stack>

        <Dialog
          open={openEdit}
          onClose={resetEditForm}
          fullWidth
          maxWidth="lg"
          fullScreen={fullScreenDialog}
        >
          <DialogTitle>Edit Banner</DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                  <ThemeSelectorRow
                    selectedBg={selectedBg}
                    setSelectedBg={setSelectedBg}
                    selectedCoupon={selectedCoupon}
                    coupons={coupons}
                    handleCouponSelect={handleCouponSelect}
                  />

                  <TextField
                    fullWidth
                    label="Banner Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <TextField
                  fullWidth
                  label="Banner Code"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/\s+/g, "");
                    setCode(value);
                  }}
                  inputProps={{
                    maxLength: 20,
                    style: { textTransform: "uppercase" },
                    pattern: "\\S+",
                  }}
                  helperText="Only uppercase letters/numbers, no spaces allowed"
                />

                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      label="Status"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="inActive">InActive</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ borderRadius: 3, textTransform: "none" }}
                  >
                    Add More Images
                    <input
                      hidden
                      multiple
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                    />
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    You can upload up to 5 images total. Current total:{" "}
                    {existingImages.length + newImages.length}/5
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={8}>
                <OfferPreviewBanner
                  backgroundOptions={backgroundOptions}
                  offer={editPreviewOffer}
                  editable
                  existingImages={existingImages}
                  onRemoveExistingImage={removeExistingImage}
                  onRemoveNewImage={removeEditNewImage}
                />

                {[...existingImages, ...editPreviewUrls].length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mt: 2 }}
                  >
                    {[...existingImages, ...editPreviewUrls].map(
                      (img, index) => (
                        <Box
                          key={index}
                          component="img"
                          src={img}
                          alt={`preview-${index}`}
                          sx={{
                            width: 72,
                            height: 72,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      ),
                    )}
                  </Stack>
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={resetEditForm}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleUpdateBanner}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Banner"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          fullScreen={fullScreenDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Delete Banner?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this banner? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                handleDeleteBanner(selectedUserId);
                setOpenDelete(false);
              }}
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={toast.open}
          autoHideDuration={2500}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
