import {
  Box,
  Chip,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axiosConfig";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { PrimaryButton } from "../../../Components/Common/Buttons";

const labels = {
  0.5: "Useless",

  1: "Useless+",

  1.5: "Poor",

  2: "Poor+",

  2.5: "Ok",

  3: "Ok+",

  3.5: "Good",

  4: "Good+",

  4.5: "Excellent",

  5: "Excellent+",
};

export default function AdminProductPage() {
  const [product, setProduct] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  
  const ratingValue = Math.round((product?.rating || 0) * 2) / 2;

  const getItemData = async () => {
    try {
      let res = await api.get(`/filter-products/getprd/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  

  useEffect(() => {
    getItemData();
  }, []);
  return (
    <div>
      <Box sx={{ width: "100%",position:'relative' }}>
        <SnackbarProvider />
        <PrimaryButton onClick={()=>navigate(`/admin/products`)}
        sx={{ml:'screen'}}
        >
          Back
        </PrimaryButton>
        <Typography
          align="center"
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 800,
            color: "#3E1A89",
            mb: 2,
          }}
        >
          Product Details
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 7 }}>
            <ImageList
              sx={{ width: '100%', height: 'auto' }}
              variant="woven"
              cols={3}
              gap={8}
            >
              {product?.image?.map((item) => (
                <ImageListItem key={item.img}>
                  <img src={item} alt={item.title} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          <Grid size={{ xs: 12,sm: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid rgba(62,26,137,0.12)",
                height: "100%",
              }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Product Name
                  </Typography>

                  <Typography fontWeight={700}>{product?.name}</Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>

                  <Typography fontWeight={600}>
                    {product?.category?.name}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>

                  <Typography>{product?.description}</Typography>
                </Box>

                <Divider />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Price
                    </Typography>

                    <Typography fontWeight={700}>₹{product?.price}</Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Discount
                    </Typography>

                    <Typography fontWeight={700}>
                      {product?.discount}%
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Stock
                    </Typography>

                    <Typography
                      fontWeight={700}
                      color={product?.stock > 0 ? "success.main" : "error.main"}
                    >
                      {product?.stock}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Rating
                    </Typography>

                    <Box
                      sx={{
                        mt: 0.5,
                      }}
                    >
                      <Rating
                        value={ratingValue}
                        readOnly
                        precision={0.5}
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.4 }}
                            fontSize="inherit"
                          />
                        }
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({product?.rating || 0})
                      </Typography>
                    </Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#3E1A89",
                        }}
                      >
                        {product?.rating ? null :"No Ratings"}
                      </Typography>
                  </Grid>
                </Grid>

                <Divider />

                <Stack direction="row" spacing={1}>
                  <Chip
                  sx={{'& :hover':{cursor:'default'}}}
                    label={product?.stock > 0? "Available" : "Unavailable"}
                    color={product?.stock > 0? "success" : "error"}
                  />

                  <Chip
                    label={`${product?.image?.length || 0} Images`}
                    sx={{
                      bgcolor: "rgba(62,26,137,.08)",
                      color: "#3E1A89",
                    }}
                  />
                </Stack>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>

                  <Typography>
                    {new Date(product?.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>

                  <Typography>
                    {new Date(product?.updatedAt).toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Product ID
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      wordBreak: "break-all",
                    }}
                  >
                    {product?._id}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        
        <PrimaryButton onClick={()=>navigate(`/admin/products/updateProduct/${id}`)}
        sx={{ml:'full'}}
        >
          Update
        </PrimaryButton>
      </Box>
    </div>
  );
}
