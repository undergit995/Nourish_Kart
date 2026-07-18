import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosConfig";
import { Category } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

export default function AboutAndFooter({company}) {

  const [categories, setCategories] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  let decodeRole = {};

  if (token) {
    try {
      decodeRole = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token in Footer", error);
    }
  }

  const getCategories = async () => {
      try {
        const response = await api.get("/category/allCategories");
        setCategories(p=>response?.data?.categories?.filter((cat)=>cat.isAvailable===true) || []);
      } catch (error) {
        console.log(error.message);
      }
    };
  useEffect(() => {
    getCategories();
  }, []);

  
  return (
    <>
      <Box
        sx={{ py: { xs: 6, md: 10 }, backgroundColor: "background.default" }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid xs={12} md={6}>
              <Typography
                onClick={() => decodeRole?.role === "customer" ? navigate("/customer/about"): navigate("/about")}
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  mb: 1,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontSize: "0.9rem",
                }}
              >
                About Us
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  mb: 2,
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                }}
              >
                {company?.companyName}
              </Typography>


              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: "1rem",
                }}
              >{company?.customFields?.companyTag}
              </Typography>

              <Button
                variant="contained"
                onClick={() => decodeRole?.role === "customer" ? navigate("/customer/products"): navigate("/login")}
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderRadius: 2.5,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "text.primary",
                    boxShadow: "none",
                  },
                }}
              >
                Explore Products
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          pt: 6,
          pb: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, mb: 2, color: "primary.contrastText" }}
              >
                {company?.companyName}
              </Typography>

              <Typography
                sx={{
                  color: "secondary.main",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >                
                {company?.companyDescription}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 2.5 }}>
              <Typography
                sx={{ fontWeight: 700, mb: 2, color: "primary.contrastText" }}
              >
                Quick Links
              </Typography>
              <Stack spacing={1}>                
                <Link
                  href={ decodeRole?.role === "customer" ? "/customer/about": "/about"}
                  underline="none"
                  color="secondary.main"
                >
                  About
                </Link>
                <Link
                  href={ decodeRole?.role === "customer" ? "/customer/products": "/login"}
                  underline="none"
                  color="secondary.main"
                >
                  Products
                </Link>
                <Link href="#" underline="none" color="secondary.main">
                  Contact
                </Link>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 2.5 }}>
              <Typography
                sx={{ fontWeight: 700, mb: 2, color: "primary.contrastText" }}
              >
                Categories
              </Typography>
              <Stack spacing={1}>
                {categories?.map((category) =>(<Link
                  href={ decodeRole?.role === "customer" ? "/customer/about": "/login"}
                  underline="none"
                  color="secondary.main"
                  key={category._id}
                >
                  {category.name}
                </Link>))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography
                sx={{ fontWeight: 700, mb: 2, color: "primary.contrastText" }}
              >
                Contact
              </Typography>
              <Stack spacing={1}>
                <Typography
                  sx={{ color: "secondary.main", fontSize: "0.95rem" }}
                >
                  {company?.phone}
                </Typography>
                <Typography
                  component="a"
                  href={`mailto:${company?.email}?subject=Inquiry&body=Hello, I would like to know more about your services.`}
                  sx={{
                    color: "secondary.main",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Email: {company?.email}
                </Typography>
                <Typography
                  sx={{ color: "secondary.main", fontSize: "0.95rem" }}
                >
                  Address:{company?.customFields?.address}
                </Typography>
                {company?.licence && (
                  <Typography
                    sx={{ color: "secondary.main", fontSize: "0.95rem" }}
                  >
                    License: {company?.licence}
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                {(company?.socialMedia || []).map((social, index) => {                  
                  const icons = {
                    FacebookIcon,
                    InstagramIcon,
                    YouTubeIcon,
                    TwitterIcon,
                    LinkedInIcon,
                  };
                  const Icon = icons[`${social.platform}Icon`] || LanguageIcon;

                  return (
                    <IconButton
                      key={index}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "primary.main",
                        backgroundColor: "secondary.main",
                        "&:hover": {
                          backgroundColor: "primary.contrastText",
                        },
                      }}
                    >
                      <Icon />
                    </IconButton>
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              {company?.certification?.length > 0 && (
                <>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Typography
                    
                sx={{ fontWeight: 700, color: "primary.contrastText" }}
                  >
                    Certifications
                  </Typography>

                    {company.certification.map((cert) => (
                      <Chip
                        key={cert}
                        label={cert}
                        size="small"
                        sx={{
                          bgcolor: "secondary.main",
                          color: "primary.main",
                        }}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.20)", my: 4 }} />

          <Typography
            sx={{
              color: "secondary.main",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            © 2026 Homemade Foods. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
