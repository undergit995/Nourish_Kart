import React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import { deleteProducts } from "../../../Redux/Slices/ProductSlice";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import axios from "axios";
import { PrimaryButton } from "../../../Components/Common/Buttons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, Stack } from "@mui/material";
import api from "../../../api/axiosConfig";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function ProductCard({ product }) {
  const [open, setOpen] = React.useState(false);
  const [deleteState, setDeleteState] = React.useState("");
  const [isBannerCreated, setIsBannerCreated] = React.useState(false);

  const handleClickOpen = (params) => {
    setOpen(true);
    setDeleteState(params);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let token = localStorage.getItem("token");
  const navigate = useNavigate();
  let dispatch = useDispatch();
  let toggleUpdate = () => {
    navigate(`updateProduct/${product?._id}`);
  };
  const handleCreateBanner = async () => {
    try {
      let response = await api.post("banner/setbanner", {
        productId: product?._id,bannerType:"product"
      });
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar("Banner created successfully!", { variant: "success" });
        setIsBannerCreated(true);
      }
    } catch (error) {
      enqueueSnackbar(error?.response?.data, { variant: "error" });
    }
  };

  let handleDelete = async (params) => {
    try {
      let response = await api.delete(`/products/deleteProduct/${params}`);
      dispatch(deleteProducts(params));
      enqueueSnackbar("Product deleted successfully", { variant: "success" });
    } catch (error) {
      console.log(error.message);

      enqueueSnackbar("Failed to delete ", { variant: "error" });
    }
  };
  return (
    <Grid size={{ xs: 12, sm: 4 }}>
      <Card sx={{ maxWidth: "100%", maxHeight: 390 }}>
        <SnackbarProvider />
          <CardMedia
            component="img"
            height="140"
            image={
              product
                ? product?.image[0].replace(/\\/g, "/").replace(/^\/+/, "")
                : ""
            }
            alt="No Image Found"
            sx={{ objectFit: "cover", cursor: "pointer" }}
            onClick={() =>
              navigate(`/admin/productlist/${product?._id}`, { state: product })
            }
          />
          <CardContent sx={{cursor: "pointer"}} onClick={() =>
              navigate(`/admin/productlist/${product?._id}`, { state: product })
            }>
            <Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  spacing={2}
  sx={{
    width: "100%",
    mb: 2,
  }}
>
  <Typography
    variant="h5"
    component="div"
    sx={{
      fontSize: {
        xs: "1rem",
        sm: "1.25rem",
        md: "1.5rem",
      },
      fontWeight: 600,
      flex: 1,
      width: '100%',
      pr: 1,
    }}
  >
    {product?.name}
  </Typography>

  <Button
    onClick={(e) => {
        e.stopPropagation();
        handleCreateBanner();
      }}
    disabled={isBannerCreated}
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "12px",
      textTransform: "none",
      whiteSpace: "nowrap",

      px: { xs: 1.5, sm: 2, md: 2.5 },
      py: { xs: 0.6, sm: 0.8 },
      minWidth: { xs: 100 },
        height: 50,

      fontSize: {
        xs: "0.75rem",
        sm: "0.85rem",
        md: "0.95rem",
      },
      fontWeight: 600,

      color: "#fff",
      background:
        "linear-gradient(135deg, #1e00ff 0%, #7B61FF 100%)",

      boxShadow: "0 4px 16px rgba(123, 97, 255, 0.35)",

      "&:hover": {
        background:
          "linear-gradient(135deg, #0015ff 0%, #7B61FF 100%)",
        boxShadow: "0 6px 20px rgba(123, 97, 255, 0.45)",
      },

      "&::before": {
        content: '""',
        position: "absolute",
        top: "4px",
        left: "6px",
        width: "35%",
        height: "60%",
        borderRadius: "10px",
        filter: "blur(10px)",
        background:
          "linear-gradient(to bottom right, rgba(255,255,255,0.45), transparent)",
        pointerEvents: "none",
      },
    }}
  >
    {isBannerCreated ? "Banner Created" : "Create Banner"}
  </Button>
</Stack>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {product?.description}
            </Typography>
            <Stack direction={"row"}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                ₹{product?.price}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  ml: 1,
                  p: "2px",
                  borderRadius: 1,
                  color: "secondary.main",
                  backgroundColor: "primary.main",
                }}
              >
                {product.discount}% off
              </Typography>
            </Stack>
          </CardContent>
        <CardActions>
          <PrimaryButton
            onClick={() => toggleUpdate(product?._id)}
            size="small"
            color="primary"
          >
            Update
          </PrimaryButton>
          <PrimaryButton
            onClick={() => {
              handleClickOpen(product?._id);
            }}
            size="small"
            color="primary"
          >
            Delete
          </PrimaryButton>
        </CardActions>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-adminProductDelete"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDelete(deleteState)} autoFocus>
            Confirm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
