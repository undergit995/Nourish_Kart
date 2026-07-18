import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Chip } from "@mui/material";

const pages = [
  {
    name: "Products",
    path: "/customer/products",
    icon: <RestaurantMenuIcon fontSize="small" />,
  },
  {
    name: "Orders",
    path: "/customer/orderlist",
    icon: <InfoOutlinedIcon fontSize="small" />,
  },
  {
    name: "Cart",
    path: "/customer/cart",
    icon: <ShoppingCartIcon fontSize="small" />,
  },
  {
    name: "Home",
    path: "/customer",
    icon: <HomeIcon fontSize="small" />,
  },
];

function ResponsiveAppBar({company}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();
  const cartValue = useSelector((state) => state.cart.cartValue || 0);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoRefresh = () => {
    navigate("/customer");
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate("/customer/profile");
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "primary.main",
        borderRadius: { xs: 0, sm: 3 },
        mt: { xs: 0, sm: 1 },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 62, sm: 70 },
            px: { xs: 1, sm: 2 },
          }}
        >
          <Box
    component="img"
    src={company?.companyImage}
    alt="PW"
    sx={{
      width: 36,
      height: 36,
      mr:'3px',
      objectFit: "cover",
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0px 6px 18px rgba(62, 26, 137, 0.15)",
    }}
  />

          <Typography
            onClick={handleLogoRefresh}
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              letterSpacing: ".08rem",
              color: "primary.contrastText",
              cursor: "pointer",
              fontSize: { md: "1.1rem", lg: "1.2rem" },
            }}
          >
           {company?.companyName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ color: "primary.contrastText" }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiPaper-root": {
                  borderRadius: 3,
                  mt: 1,
                  minWidth: 210,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                  bgcolor: "background.paper",
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    textDecoration: "none",
                    color: "text.primary",
                    py: 1.2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                    {page.name === "Cart" ? (
                      <Badge badgeContent={cartValue} color="error">
                        <ShoppingCartIcon fontSize="small" />
                      </Badge>
                    ) : (
                      page.icon
                    )}
                  </ListItemIcon>

                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        sx={{
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          color: "text.primary",
                        }}
                      >
                        {page.name}
                      </Typography>
                    }
                  />
                </MenuItem>
              ))}

              <MenuItem onClick={handleProfile}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            onClick={handleLogoRefresh}
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              letterSpacing: ".12rem",
              color: "primary.contrastText",
              cursor: "pointer",
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
            }}
          >
            {company?.companyName}
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "right",
              alignItems: "center",
              gap: 1,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                startIcon={
                  page.name === "Cart" ? (
                    <Badge badgeContent={cartValue} color="error">
                      <ShoppingCartIcon fontSize="small" />
                    </Badge>
                  ) : (
                    page.icon
                  )
                }
                sx={{
                  my: 2,
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  textTransform: "none",
                  fontSize: "0.96rem",
                  fontWeight: 600,
                  px: 2,
                  borderRadius: 2,
                  textDecoration: "none",
                  "&:hover": {
                    backgroundColor: "secondary.main",
                    color: "secondary.contrastText",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5, ml: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 36,
                    height: 36,
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;