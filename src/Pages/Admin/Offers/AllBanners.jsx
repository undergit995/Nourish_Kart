import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import React from 'react'
import { AutoCarousel } from './Offers';
import LocalOfferIcon from "@mui/icons-material/LocalOffer";


export default function OfferPreviewBanner({
    backgroundOptions,
  offer,
  actions,
  editable = false,
  existingImages = [],
  onRemoveExistingImage = () => {},
  onRemoveNewImage = () => {},
}) {
  const selectedBg =
    backgroundOptions?.find((item) => item?.bg === offer?.background) || backgroundOptions[0];


  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        background: selectedBg.bg,
        boxShadow: "0 12px 35px rgba(0,0,0,0.10)",
        mt: 0,
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
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent={{ xs: "center", md: "flex-start" }}
            sx={{ mb: 2 }}
          >
            <Chip
              icon={
                <LocalOfferIcon
                  sx={{ color: `${selectedBg.chipColor} !important` }}
                />
              }
              label={offer?.status || "inactive"}
              sx={{
                bgcolor: selectedBg.chipBg,
                color: selectedBg.chipColor,
                fontWeight: 700,
              }}
            />
            {/* <Chip
              label={offer?.background || selectedBg.name}
              sx={{
                bgcolor: selectedBg.chipBg,
                color: selectedBg.chipColor,
                fontWeight: 700,
              }}
            /> */}
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: "2rem", sm: "2.6rem", md: "3.4rem" },
              fontWeight: 800,
              color: selectedBg.textColor,
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            {offer?.title || "Special Offer Title"}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.7rem", md: "2rem" },
              fontWeight: 700,
              color: selectedBg.subTextColor,
              mb: 3,
            }}
          >
            {offer?.description || "Offer description will appear here."}
          </Typography>

          <Box
            sx={{
              display: "inline-block",
              backgroundColor: selectedBg.offerBg,
              color: selectedBg.offerText,
              px: { xs: 2.5, sm: 3.5, md: 4 },
              py: { xs: 1.5, sm: 2, md: 2.2 },
              borderRadius: 3,
              boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.4rem", sm: "1.9rem", md: "2rem" },
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              Use Code: {offer?.code || "SAVE20"}
            </Typography>
          </Box>

          {actions && (
            <Stack
              direction="row"
              spacing={1.5}
              flexWrap="wrap"
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{ mt: 3 }}
            >
              {actions}
            </Stack>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 2, sm: 3, },
            pb: { xs: 4, md: 0 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%"},
            }}
          >
            <AutoCarousel
              images={offer?.images || []}
              editable={editable}
              existingImages={existingImages}
              onRemoveExistingImage={onRemoveExistingImage}
              onRemoveNewImage={onRemoveNewImage}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}


/* {offers.length > 0 ? (
            offers.map((offer) => (
              <OfferPreviewBanner
                backgroundOptions={backgroundOptions}
                key={offer._id}
                offer={{
                  title: offer.title,
                  description: offer.description,
                  code: offer.code,
                  status: offer.status,
                  background: offer.background,
                  images: Array.isArray(offer.image) ? offer.image : [],
                }}
                actions={
                  <>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEdit(offer)}
                      sx={{ borderRadius: 2.5, textTransform: "none" }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineIcon />}
                      onClick={() => {
                        setSelectedUserId(offer._id);
                        setOpenDelete(true);
                      }}
                      sx={{ borderRadius: 2.5, textTransform: "none" }}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => handleStatusToggle(offer)}
                      sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.35)",
                      }}
                    >
                      {offer.status === "active"
                        ? "Set Inactive"
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
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                {loading ? "Loading offers..." : "No offers yet"}
              </Typography>
              <Typography color="text.secondary">
                Create your first offer banner to display it here.
              </Typography>
            </Paper>

 setLoading(false);
    }
  };
  const handleStatusToggle = async (offer) => {
    const nextStatus = offer.status === "active" ? "inactive" : "active";

    try {
      setLoading(true);

      const res = await api.put(`/banner/bannerStatus/${offer._id}`, {
        status: nextStatus,
      });

      const updatedOffer = res?.data?.offer || res?.data?.status;
      await fetchBanners();
      // if (updatedOffer) {
      //   dispatch(updateOfferAction(updatedOffer));
      // }

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
          Banner Management
          Offer Banner Management
        </Typography>

        {!!errorText && (
            >
              <Stack spacing={2.5}>
                <Typography variant="h6" fontWeight={800}>
                  Create Banner
                  Create Offer
                </Typography>

                <ThemeSelectorRow
                  disabled={loading}
                  sx={{ borderRadius: 3, py: 1.3, textTransform: "none" }}
                >
                  {loading ? "Saving..." : "Save Banner"}
                  {loading ? "Saving..." : "Save Offer"}
                </Button>
              </Stack>
            </Paper>
        </Typography>

      <Stack spacing={4}>
           {/*  {offers.length > 0 ? (
            {offers.length > 0 ? (
            offers.map((offer) => (
              <OfferPreviewBanner
                backgroundOptions={backgroundOptions}
                Create your first offer banner to display it here.
              </Typography> */