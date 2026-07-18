import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Snackbar,
  Paper,
  OutlinedInput,
  Select,
  Switch,
  Typography,
  Skeleton,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import React, { lazy, useCallback, useEffect, useMemo, useState,Suspense } from "react";
import { addToCart, getItems } from "../../../Redux/Slices/CM_CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../../Components/Common/Buttons";
import { jwtDecode } from "jwt-decode";
import api from "../../../api/axiosConfig";
import { useTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import { enqueueSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
const ItemCard = lazy(() => import("../CustomerProducts/ItemCard"))

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const names = ["item1"];

export default function CustomerProducts() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [category, setCategory] = React.useState([]);
  const [currentImage, setCurrentImage] = useState({});
  const [photos, setPhotos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [inStockOnly, setInStockOnly] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartSnackbar, setCartSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setInStockOnly("all");
    setPage(1);
  };

  const theme = useTheme();
  function getStyles(name, category, theme) {
    return {
      fontWeight: "medium",
    };
  }

  const cartItems = useSelector((state) => state.cart.items);


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(typeof value === "string" ? value.split(",") : value);
  };

  let token = localStorage.getItem("token");
  let decodeId = jwtDecode(token).id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addItem = useCallback(
    async (productId) => {
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      if (product.stock <= 0) {
        enqueueSnackbar("This product is out of stock", {
          variant: "warning",
        });
        return;
      }

      try {
        dispatch(
          addToCart({ customer: decodeId, product: productId, quantity: 1 })
        );
        dispatch(getItems());
        setCartSnackbar(true);
      } catch (error) {
        enqueueSnackbar("Failed to add item to cart", { variant: "error" });
      }
    },
    [decodeId, dispatch, products],
  );

  const getProducts = useCallback(async (currentPage) => {
    try {
      setLoading(true);
      const res = await api.get(`/products/all?page=${currentPage}&limit=10`);
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (error) {
      console.log(error);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);
  const getCategory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/category/allCategories");
      setCategory(response.data.categories || []);
    } catch (error) {
      console.log(error);
    }
  };
  const cartMap = new Set(
    cartItems?.map((i) => String(i?.product?._id || i?.product)),
  );
  let displayProducts = useMemo(() => {
    let filtered = [...products];
    if (search.trim()) {
      filtered = filtered.filter((product) =>
        product?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category?._id === selectedCategory,
      );
    }

    if (inStockOnly === "in") {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (inStockOnly === "out") {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    if (minPrice !== "") {
      filtered = filtered.filter(
        (product) => Number(product.price) >= Number(minPrice),
      );
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(
        (product) => Number(product.price) <= Number(maxPrice),
      );
    }

    switch (sortBy) {
      case "low":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "high":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "stock":
        filtered.sort((a, b) => {
          return (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0);
        });
        break;

      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "":
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        break;
    }

    return filtered;
  }, [
    products,
    search,
    selectedCategory,
    inStockOnly,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    getProducts(page);
    dispatch(getItems());
    getCategory();
  }, [page, getProducts, dispatch]);

  return (
    <Box>
      <Grid
        container
        spacing={3}
        sx={{
          mb: 3,
          p: 2,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            display="flex"
            gap={2}
            justifyContent={{ xs: "center", md: "flex-start" }}
          >
            <FormControl sx={{ minWidth: 180, mr: 1 }}>
              <InputLabel>Category</InputLabel>

              <Select
                sx={{ minWidth: 160, borderRadius: "16px" }}
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {category.map(
                  (cat) =>
                    cat.isAvailable && (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ),
                )}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160, borderRadius: "16px" }}>
              <Select
                value={sortBy}
                sx={{ minWidth: 160, borderRadius: "16px" }}
                displayEmpty
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="">Sort By</MenuItem>
                <MenuItem value="low">Low → High</MenuItem>
                <MenuItem value="high">High → Low</MenuItem>
                <MenuItem value="stock">Stock</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <OutlinedInput
              value={search}
              placeholder="Search products..."
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              }
              sx={{
                height: 50,
                borderRadius: 99,
                bgcolor: "#fafafa",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ddd",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7C4DFF",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7C4DFF",
                  borderWidth: 2,
                },
              }}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            display="flex"
            gap={2}
            sx={{
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <Select
              sx={{ minWidth: 160, borderRadius: "16px" }}
              value={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.value)}
            >
              <MenuItem value="all">All Products</MenuItem>

              <MenuItem value="in">In Stock</MenuItem>

              <MenuItem value="out">Out of Stock</MenuItem>
            </Select>

            <Button
              variant="outlined"
              color="primary"
              onClick={clearFilters}
              sx={{
                borderRadius: 99,
                px: 3,
                ml: 1,
                height: 42,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
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
            backgroundColor: "#35b247",
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

      <Grid container spacing={2}>
        {loading ? (
          Array.from(new Array(8)).map((_, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              key={index}
            >
              <Skeleton variant="rectangular" sx={{
                width: '100%',
                maxWidth: 340,
                height: 350,
                borderRadius: 5
              }} />
              <Skeleton variant="text" sx={{
                width: '100%',
                maxWidth: 340,
                height: 50,
                borderRadius: 5
              }} />
            </Grid>
          ))
        ) : displayProducts.length === 0 ? (
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              py: 6,
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">Nothing here</Typography>

            <Typography variant="body2">
              Try changing filters or clearing search
            </Typography>

            <Button
              onClick={clearFilters}
              sx={{ mt: 2, textTransform: "none" }}
            >
              Reset Filters
            </Button>
          </Box>
        ) : (
          displayProducts.map((item) => {
            const cartBtn = cartMap?.has(String(item._id));
            const imagePath = item.image[0]
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
            return (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                key={item._id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
                <ItemCard
                  addItem={addItem}
                  setCurrentImage={setCurrentImage}
                  item={item}
                  currentImage={currentImage}
                  cartBtn={cartBtn}
                  imagePath={imagePath}
                />
                </Suspense>
              </Grid>
            );
          })
        )}
      </Grid>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, pb: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
