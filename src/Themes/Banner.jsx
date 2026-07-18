import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Paper, Container, Button, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchBanners } from "../Redux/Slices/BannerSlice";

const banne = [
  {
    title: "Exclusive",
    subtitle: "Homemade food offer for you!",
    discount: "Flat 10% Off",
    limit: "Up to ₹100",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Special Deal",
    subtitle: "Fresh sweets made with love!",
    discount: "Flat 15% Off",
    limit: "Up to ₹150",
    images: [
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Festival Offer",
    subtitle: "Delicious homemade snacks for every occasion!",
    discount: "Flat 20% Off",
    limit: "Up to ₹200",
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Healthy Picks",
    subtitle: "Nutritious homemade bites just for you!",
    discount: "Flat 12% Off",
    limit: "Up to ₹120",
    images: [
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    title: "Weekend Combo",
    subtitle: "Enjoy your weekend with homemade flavors!",
    discount: "Flat 18% Off",
    limit: "Up to ₹180",
    images: [
      "https://images.unsplash.com/photo-1504674900247-ec6bf583e71b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

function HomemadeFoodBanner() {
  const dispatch = useDispatch();
  const { items: activeBanners, status } = useSelector((state) => state.banners);
  const banners = activeBanners.filter((item) => item.status === 'Active')
  
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(null);
    
  const activeBanner = banners[currentBanner];
  const isPaused = pausedUntil && Date.now() < pausedUntil;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBanners());
    }
  }, [status, dispatch]);

  const bannerRef = useRef(currentBanner);
  const imageRef = useRef(currentImage);

useEffect(() => {
  bannerRef.current = currentBanner;
}, [currentBanner]);

useEffect(() => {
  imageRef.current = currentImage;
}, [currentImage]);

    useEffect(() => {
  if (isPaused || banners.length === 0) return;

  const timer = setInterval(() => {
    const banner = banners[bannerRef.current];

    if (!banner?.image?.length) return;

    if (imageRef.current < banner.image.length - 1) {
      setCurrentImage(prev => prev + 1);
    } else {
      setCurrentImage(0);
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }
  }, 2500);

  return () => clearInterval(timer);
}, [isPaused, banners]);

  useEffect(() => {
    if (!pausedUntil) return;

    const remainingTime = pausedUntil - Date.now();
    if (remainingTime <= 0) {
      setPausedUntil(null);
      return;
    }

    const timeout = setTimeout(() => {
      setPausedUntil(null);
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [pausedUntil]);

  const pauseSlider = () => {
    setPausedUntil(Date.now() + 30000);
  };

  const handleBannerChange = (bannerIndex) => {
    setCurrentBanner(bannerIndex);
    setCurrentImage(0);
    pauseSlider();
  };

  const handleImageClick = (index) => {
    setCurrentImage(index);
    pauseSlider();
  };

  
  if (status === 'loading' || status === 'idle' || !activeBanner) {
    return (
      <Box>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" width="100%" sx={{ mt: 2, borderRadius: 1, minHeight: { xs: "auto", md: 360 } }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            height: { xs: "auto", md: '100%' },
            overflow: "hidden",
            background: activeBanner?.color || "linear-gradient(135deg, #5014d1 0%, #3e3d3f 100%)",
            boxShadow: "0 12px 35px rgba(0,0,0,0.10)",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: { xs: "auto", md: 360 },
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: "100%",
                px: { xs: 3, sm: 5, md: 7 },
                py: { xs: 4, sm: 5, md: 4 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "2rem", sm: "2.6rem", md: "3.4rem" },
                  fontWeight: 800,
                  color: "primary.contrastText",
                  lineHeight: 1.1,
                  mb: 1,
                  minHeight: { md: 120 },
                }}
              >
                {activeBanner?.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.7rem", md: "2.2rem" },
                  fontWeight: 700,
                  color: "secondary.main",
                  mb: 3,
                  minHeight: { md: 100 },
                }}
              >
                {activeBanner?.description}
              </Typography>

              <Box
                sx={{
                  display: "inline-block",
                  backgroundColor: "secondary.main",
                  color: "secondary.contrastText",
                  px: { xs: 2.5, sm: 3.5, md: 4 },
                  py: { xs: 1.5, sm: 2, md: 2.2 },
                  borderRadius: 3,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1.4rem", sm: "1.9rem", md: "2.4rem" },
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  {`Flat ${activeBanner?.coupon?.discount || 'N'}% Off`}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1.2rem", md: "1.5rem" },
                    fontWeight: 600,
                    mt: 0.5,
                  }}
                >
                  {`Up to ₹${activeBanner?.coupon?.max_discount || 'N'}`}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    backgroundColor: "secondary.main",
                    color: "secondary.contrastText",
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "background.paper",
                      boxShadow: "none",
                    },
                  }}
                >
                  Order Now
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 3,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                {banners.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => handleBannerChange(index)}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      cursor: "pointer",
                      backgroundColor:
                        currentBanner === index
                          ? "secondary.main"
                          : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 4, md: 0 },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: { xs: "100%", sm: 420, md: 500 },
                }}
              >
                <Box
                  onClick={pauseSlider}
                  sx={{
                    width: "100%",
                    height: { xs: 240, sm: 300, md: 320 },
                    borderRadius: 4,
                    overflow: "hidden",
                    backgroundColor: "background.paper",
                    boxShadow: "0 14px 35px rgba(0,0,0,0.18)",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    component="img"
                    src={activeBanner?.image[currentImage]}
                    alt={`banner ${currentBanner + 1} image ${currentImage + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                    mb: 1,
                  }}
                >
                  {activeBanner?.image?.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => handleImageClick(index)}
                      sx={{
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        cursor: "pointer",
                        backgroundColor:
                          currentImage === index
                            ? "secondary.main"
                            : "rgba(255,255,255,0.35)",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default HomemadeFoodBanner;