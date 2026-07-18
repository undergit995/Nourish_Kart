import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export default function CouponTopBar(){
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "transparent",
        backdropFilter: "blur(10px)",
        boxShadow: "none",
        color: "#3E1A89",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ color: "#3E1A89" }}
        >
          Coupon Management
        </Typography>

        <Box>
          <Button
            onClick={() => navigate("/admin/handlecoupon/new")}
            startIcon={<AddIcon />}
            sx={{
              background: "#3E1A89",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "12px",
              px: 3,
              py: 1,
              boxShadow: "0px 10px 25px rgba(62, 26, 137, 0.2)",
              "&:hover": {
                background: "#2d1266",
              },
            }}
          >
            Add Coupon
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
