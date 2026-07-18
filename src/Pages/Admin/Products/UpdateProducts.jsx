import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SnackbarContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Switch,
  Typography,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Checkbox,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../Components/Common/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { updateProduct } from "../../../Redux/Slices/ProductSlice";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import api from "../../../api/axiosConfig";
import { getProducts } from "../../../Redux/Slices/ProductSlice";
import { Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function UpdateProducts() {
  let allProducts = useSelector((state) => state?.product?.products);
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editCategories, setEditCategories] = useState(null);
  const [categoryDescription, setCategoryDescription] = useState("");
  const mountedRef = useRef(true);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    discount: 0,
    isAvailable: false,
    sendUpdates: false,
    category: "", 
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenAddCategory = () => {
    setEditCategories(null);
    setCategoryName("");
    setOpenCategoryModal(true);
  };
  const handleEditCategory = (category) => {
    setEditCategories(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setOpenCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
    setCategoryName("");
    setCategoryDescription("");
    setEditCategories(null);
  };
  const openAddProductModal = () => {
    setOpenModal(true);
  };

  const closeAddProductModal = () => {
    setOpenModal(false);

    setProductData({
      name: "",
      description: "",
      price: "",
      stock: "",
      sendUpdates: false,
      category: "",
      discount: 0,
      isAvailable: true,
    });

    setPhotos([]);
  };
  console.log(productData);

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      setLoading(true);

      if (editCategories) {
        await api.put(`/category/updateProductCategory/${editCategories._id}`, {
          name: categoryName,

          description: categoryDescription,
        });
      } else {
        await api.post("/category/addProductCategory", {
          name: categoryName,

          description: categoryDescription,
        });
      }
      await getCategories();
      handleCloseCategoryModal();
    } catch (error) {
      console.error(error.message);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };
  const handleDeleteCategory = async () => {
    const category = categories.find((c) => {
      return String(c._id) === String(productData.category) ? true : false;
    });
    console.log(category);

    if (!category) return;
    try {
      setLoading(true);
      await api.delete(`/category/deleteProductCategory/${category._id}`);

      await getCategories();

      setProductData((prev) => ({
        ...prev,
        category: "",
      }));
    } catch (error) {
      console.loh(error.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [String(c._id), c]));
  }, [categories]);

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/category/allCategories");
      setCategories(p=>response?.data?.categories?.filter((i)=>{
        return i.isAvailable?i:null;
      }) || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [filteredFile, setFilteredFile] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  let token = localStorage.getItem("token");

  let dispatch = useDispatch();

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const imgFile = Array.from(files);
      setPhotos((prev) => {
        const newFiles = imgFile.filter(
          (file) =>
            !prev.some(
              (p) => p.file.name === file.name && p.file.size === file.size,
            ),
        );
        return [
          ...prev,
          ...newFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          })),
        ];
      });
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function removeFile(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }
  function removeExisting(index) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  }
  const navigate = useNavigate();

  async function updateProducts(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("stock", productData.stock);
    formData.append("discount", productData.discount);
    formData.append("isAvailable", productData.isAvailable);
    formData.append("category", productData.category);
    formData.append("sendUpdates", productData.sendUpdates);
    formData.append("existingPhotos", JSON.stringify(existingPhotos));

    photos.forEach((photo) => {
      formData.append("file", photo.file);
    });

    try {
      let response = await api.put(`products/updateProduct/${id}`, formData);

      if (response.status === 200) {
        console.log(response.data.data);
        dispatch(updateProduct(response.data.data));
        enqueueSnackbar("Product updated successfully", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        navigate("/admin/products");
      }
    } catch (error) {
      console.log(error.message);

      enqueueSnackbar("Failed to update", { variant: "error" });
    }
  }
  async function getById() {
    try {
      let response = await api.get(`filter-products/getprd/${id}`);

      const product = response.data.data;

      setProductData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        discount: product.discount,
        isAvailable: product.isAvailable,
        sendUpdates: false,
        category: product?.category?._id || "",
      });

      setExistingPhotos(product.image || []);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getById();
    getCategories();
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    getCategories();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <Box>
      <Box sx={{ width: "80%", margin: "auto", padding: "20px" }}>
        <SnackbarProvider />
        <Typography align="center" variant="h4" gutterBottom>
          Update Product Details
        </Typography>
        <Stack component="form" onSubmit={updateProducts}>
          <FormControl fullWidth margin="normal">
            <InputLabel shrink htmlFor="name">
              Product Name
            </InputLabel>
            <OutlinedInput
              id="name"
              label="Product Name"
              type="text"
              value={productData.name}
              onChange={handleChange}
              name="name"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel shrink htmlFor="description">
              Description
            </InputLabel>
            <OutlinedInput
              id="description"
              type="text"
              value={productData.description}
              onChange={handleChange}
              name="description"
              label="Description"
              multiline
              rows={4}
            />
          </FormControl>
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Images
            <VisuallyHiddenInput
              type="file"
              key="photo-input"
              name="photo"
              onChange={handleChange}
              multiple
            />
          </Button>
          {
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                py: 1,
              }}
            >
              <Stack
                direction="row"
                flexwrap="nowrap"
                gap={1}
                sx={{
                  width: "80%",
                  height: "115px",
                  maxHeight: "145px",
                  overflowX: "scroll",
                  overflowY: "hidden",
                  py: 0.5,

                  "&::-webkit-scrollbar": {
                    height: "8px",
                    display: "block !important",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#3E1A89",
                    borderRadius: "4px",
                  },
                  scrollbarWidth: "thin",
                }}
              >
                {existingPhotos.map((img, index) => {
                  // img = img.replace(/\\/g, "/").replace(/^\/+/, "")
                  return (
                    <ImageListItem
                      key={`new-${index}`}
                      sx={{
                        minWidth: "120px",
                        maxWidth: "120px",
                        width: "120px",
                        border: "1px solid #2196f3",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={img}
                        alt="Upload"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onLoad={() => URL.revokeObjectURL(img)}
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            sx={{
                              color: "#fff",
                              backgroundColor: "rgba(0,0,0,0.5)",
                              m: 0.5,
                            }}
                            size="small"
                            onClick={() => removeExisting(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  );
                })}
                {photos.length > 0 &&
                  photos.map((file, index) => {
                    return (
                      <ImageListItem
                        key={`new-${index}`}
                        sx={{
                          minWidth: "120px",
                          maxWidth: "120px",
                          width: "120px",
                          height: "120px",
                          border: "1px solid #2196f3",
                          borderRadius: "8px",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={file.preview}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <ImageListItemBar
                          position="top"
                          actionIcon={
                            <IconButton
                              sx={{
                                color: "#fff",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                m: 0.5,
                              }}
                              size="small"
                              onClick={() => removeFile(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    );
                  })}
              </Stack>
            </Box>
          }

          {/* <Box
  sx={{
    display: "flex",
    alignItems: "center",
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
  }}
>

  <FormControl fullWidth>
  <Select
    name="category"
    value={productData.category ?? ""}
    onChange={handleChange}
    displayEmpty
    sx={{
      "& fieldset": {
        border: "none",
      },
    }}
  >
    <MenuItem value="">
      --Select Category--
    </MenuItem>

    {categories.map((item) => (      
      <MenuItem key={item._id} value={item._id}>
        {item.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
  <Divider orientation="vertical" flexItem />

  <IconButton
    color="primary"
    onClick={handleOpenAddCategory}
  >
    <AddIcon />
  </IconButton>

  <IconButton
    color="rgba(23, 75, 231, 0.8)"
    disabled={!productData.category}
    onClick={() => {
      const category = categories.find(
        (c) => c._id === productData.category
      );

      if (category) {
        handleEditCategory(category);
      }
    }}
  >
    <EditIcon />
  </IconButton>

  <IconButton
    color="error"
    disabled={!productData.category}
    onClick={() =>
      handleDeleteCategory(productData.category)
    }
  >
    <DeleteIcon />
  </IconButton>
</Box> */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <FormControl fullWidth>
              <Select
                name="category"
                value={productData.category || ""}
                onChange={handleChange}
                displayEmpty
                sx={{
                  "& fieldset": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="">--Select Category--</MenuItem>

                {categories.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider orientation="vertical" flexItem />

            <IconButton color="primary" onClick={handleOpenAddCategory}>
              <AddIcon />
            </IconButton>

            <IconButton
              color="rgba(23, 75, 231, 0.8)"
              disabled={!productData.category}
              onClick={() => {
                const category = categoryMap.get(String(productData.category));

                if (category) {
                  handleEditCategory(category);
                }
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              disabled={!productData.category}
              onClick={handleDeleteCategory}
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Dialog
            open={openCategoryModal}
            onClose={handleCloseCategoryModal}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {editCategories ? "Update Category" : "Add Category"}
            </DialogTitle>

            <DialogContent>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                sx={{ mt: 1 }}
              />
              <TextField
                fullWidth
                label="Category Description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                sx={{ mt: 2 }}
                multiline
                rows={3}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseCategoryModal} disabled={loading}>
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveCategory}
                disabled={loading || !categoryName.trim()}
              >
                {loading ? "Saving..." : editCategories ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink htmlFor="price">
                  Price
                </InputLabel>
                <OutlinedInput
                  id="price"
                  type="number"
                  onChange={handleChange}
                  value={productData.price}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  inputProps={{ min: 0 }}
                  name="price"
                  label="Price"
                />
              </FormControl>
            </Grid>
            <Grid xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel shrink>Discount</InputLabel>
                <OutlinedInput
                  type="number"
                  name="discount"
                  value={productData.discount}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  endAdornment={
                    <InputAdornment position="end">
                      <span style={{ color: "#3E1A89" }}>%</span>
                    </InputAdornment>
                  }
                  label="Discount"
                />
              </FormControl>
            </Grid>
          </Grid>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="Stock Available"
              control={
                <Android12Switch
                  checked={productData.isAvailable}
                  onChange={() =>
                    setProductData({
                      ...productData,
                      isAvailable: !productData.isAvailable,
                    })
                  }
                  name="isAvailable"
                />
              }
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel shrink htmlFor="stock">
              Stock
            </InputLabel>
            <OutlinedInput
              id="stock"
              type="number"
              label="Stock"
              inputProps={{ min: 0 }}
              onWheel={(e) => e.target.value}
              value={productData.stock}
              onChange={handleChange}
              name="stock"
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                name="sendUpdates"
                onChange={handleChange}
              />
            }
            label="Send updates to Customers"
          />
          <Stack direction={"row"} sx={{ mt: 2, gap: 1 }}>
            <SecondaryButton
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/admin/products")}
            >
              Back
            </SecondaryButton>
            <PrimaryButton type="submit">Update</PrimaryButton>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
