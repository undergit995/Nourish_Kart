import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  Stack,
  Button,
  OutlinedInput,
  InputAdornment,
  Pagination,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../Redux/Slices/productSlice";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function HomemadeFoodGrid() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products) || [];

  const cart =useSelector((state)=>state.cart.cartValue)
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/products/all?page=${page}&limit=${productsPerPage}`
        );
        dispatch(getProducts(response.data.data));
        setPageCount(response.data.totalPages);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, dispatch]);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().startsWith(search.toLowerCase())
  );

   const handleViewProduct = () => {
    navigate("/login");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        mt:2
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#2D1457",
              mb: 1,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Explore Products
          </Typography>

          <Typography
            sx={{
              color: "#6B6280",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            Fresh and homemade products for you
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <OutlinedInput
            fullWidth
            placeholder="Search products"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            startAdornment={
              <InputAdornment position="start">🔍</InputAdornment>
            }
            sx={{
              backgroundColor: "#fff",
              borderRadius: "14px",
            }}
          />
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="stretch">
  {loading ? (
    Array.from(new Array(productsPerPage)).map((_, index) => (
      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
        <Skeleton variant="rectangular" height={450} sx={{ borderRadius: "18px" }} />
      </Grid>
    ))
  ) : filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
  <Grid size={{ xs: 12, sm: 6, md: 4,  }} key={product._id}>
  <Card
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "18px",
      overflow: "hidden",
      transition: "0.3s ease",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 16px 30px rgba(62,26,137,0.16)",
      },
    }}
  >
    <Box
      sx={{
        width: "100%",
        height: 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f8fb",
      }}
    >
      <CardMedia
        component="img"
        src={product.image[0]}
        alt={product.name}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Box>

    <CardContent
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#2D1457",
            fontSize: "1rem",
            minHeight: 48,
          }}
        >
          {product.name}
        </Typography>
      </Stack>

      <Typography
        sx={{
          color: "#6c6480",
          fontSize: "0.92rem",
          mt: 1,
          minHeight: 50,
          overflow: "hidden",
        }}
      >
        {product.description}
      </Typography>

      <Typography
        sx={{
          mt: 2,
          fontSize: "1.2rem",
          fontWeight: 800,
          color: "#3E1A89",
        }}
      >
        ₹{product?.price}
      </Typography>
      
      <Box
        sx={{
          bgcolor: product?.isAvailable ? "#E8F5E9" : "#FEE2E2",
          color: product?.isAvailable ? "#2E7D32" : "#C62828",
          py: 1,
          borderRadius: 2,
          textAlign: "center",
          fontWeight: 700,
          fontSize: ".9rem",
        }}
      >
        {product?.isAvailable ? "● Available Now" : "● Out of Stock"}
      </Box>
      <Button
        fullWidth
        variant="contained"
        onClick={handleViewProduct}
        sx={{
          mt: "auto",
          borderRadius: "12px",
          textTransform: "none",
          backgroundColor: "#3E1A89",
          fontWeight: 700,
          py: 1.1,
          "&:hover": {
            backgroundColor: "#2f1368",
          },
        }}
      >
        View Product
      </Button>
    </CardContent>
  </Card>
</Grid>
    ))
  ) : (
    <Grid size={{ xs: 12 }} sx={{justifyContent:'center'}}>
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          borderRadius: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h6" sx={{ color: "#3E1A89", mb: 1 }}>
          No products found
        </Typography>
        <Typography sx={{ color: "#7a738f" }}>
          Try a different search value
        </Typography>
      </Box>
    </Grid>
  )}
</Grid>
        {pageCount > 1 && (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mt: 5,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              borderRadius: 4,
              background: "linear-gradient(145deg, #f5f7fa, #ffffff)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Page {page} of {pageCount}
            </Typography>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size={window.innerWidth < 600 ? "medium" : "large"}
              showFirstButton
              showLastButton
            />
          </Paper>
        )}
      </Container>
    </Box>
  );
}