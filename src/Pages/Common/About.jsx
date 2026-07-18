import { Box, Stack, Typography, Chip } from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { fetchCompanyInfo } from "../../Redux/Slices/AdminSlice/CompanyInfoSlice";
import { PrimaryButton } from "../../Components/Common/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function About() {
  const [developers, setDevelopers] = useState([]);
  const company = useSelector((state) => state.companyInfo.info);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const firstDeveloper = async () => {
    try {
      let res = await api.get("/developer");
      setDevelopers(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    firstDeveloper();
    dispatch(fetchCompanyInfo());
  }, [dispatch]);

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "#fff",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            width: 500,
            zIndex: -11,
            height: 500,
            bgcolor: "#F3EDFF",
            borderRadius: "50%",
            top: -220,
            right: -180,
          },

          "&::after": {
            content: '""',
            position: "absolute",
            width: 350,
            height: 350,
            zIndex: -11,
            bgcolor: "#F8F5FF",
            borderRadius: "45% 55% 60% 40%",
            bottom: -120,
            left: -100,
          },
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 42,
              md: 64,
            },
            fontWeight: 900,
            zIndex: 134,
            letterSpacing: -2,
          }}
        >
          Powerbites
        </Typography>

        <Typography
          sx={{
            mt: 2,
            opacity: 0.85,
            fontSize: 20,
            maxWidth: 650,
          }}
        >
          {company?.customFields?.tags}
        </Typography>
        <Box
          sx={{
            bgcolor: "#F8F5FF",

            p: 6,

            borderRadius: "24px 90px 24px 90px",

            border: "1px solid #EEE7FF",

            boxShadow: "0 15px 50px rgba(62,26,137,.08)",

            position: "relative",

            overflow: "hidden",

            "&::before": {
              content: '""',
              position: "absolute",
              width: 250,
              height: 250,
              zIndex: -11,
              bgcolor: "#EFE7FF",
              borderRadius: "50%",
              top: -120,
              right: -120,
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#3E1A89", fontWeight: 700, mb: 3 }}
          >
            About Us
          </Typography>

          <Typography variant="body1" color="initial">
            {company?.customFields?.moreDescription}
          </Typography>
          <Box
            sx={{
              height: 120,
              zIndex: -11,
              bgcolor: "#F8F5FF",

              borderRadius: "120px 120px 0 0",

              mt: -4,

              mb: -4,
            }}
          />
          {company?.certification?.map((cert) => (
            <Chip
              key={cert}
              label={cert}
              sx={{
                bgcolor: "#3E1A89",
                color: "#fff",

                fontWeight: 700,
                my: 1,
                px: 1,

                height: 46,

                borderRadius: "18px 40px 18px 40px",

                boxShadow: "0 12px 25px rgba(62,26,137,.25)",

                transition: ".3s",

                "&:hover": { transform: "translateY(-5px) rotate(-2deg)" },
              }}
            />
          ))}

          <Box
            sx={{
              mt: 5,

              p: 5,

              bgcolor: "#fff",

              borderRadius: "60px 18px 60px 18px",

              border: "2px dashed #3E1A89",

              position: "relative",

              boxShadow: "0 20px 60px rgba(62,26,137,.08)",

              "&::before": {
                content: '""',
                position: "absolute",
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: "#F3EDFF",
                top: -20,
                right: -20,
              },
            }}
          >
            <Typography sx={{ color: "#3E1A89", fontWeight: 700 }}>
              {" "}
              Business License{" "}
            </Typography>{" "}
            <Typography sx={{ color: "#3E1A89", mt: 1 }}>
              {" "}
              {company?.licence || "Not Available"}{" "}
            </Typography>
            <Box
              sx={{
                position: "absolute",

                width: 120,

                height: 120,
                zIndex: -11,

                borderRadius: "50%",

                bgcolor: "rgba(62,26,137,.05)",

                bottom: -40,

                right: -40,
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "#F8F5FF",

            p: 6,

            borderRadius: "24px 90px 24px 90px",

            border: "1px solid #EEE7FF",

            boxShadow: "0 15px 50px rgba(62,26,137,.08)",

            position: "relative",

            overflow: "hidden",

            "&::before": {
              content: '""',
              position: "absolute",
              width: 250,
              height: 250,
              zIndex: -11,
              bgcolor: "#EFE7FF",
              borderRadius: "50%",
              top: -120,
              right: -120,
            },
          }}
        >
          {company?.customFields && Object.keys(company.customFields).length > 0 && (
            <>
            {Object.keys(company.customFields).map((key) => {
              return (
                <Box
                  key={key}
                  sx={{
                    mt: 5,

                    p: 5,

                    bgcolor: "#fff"}}>

              <Typography variant="h4" sx={{ color: "#3E1A89", fontWeight: 700, mb: 3 }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>

              <Typography variant="body1" color="initial">
              {company.customFields[key]}
              </Typography>
              </Box>
              )
            }) }
            </>)
          }
        </Box>

        <Box
          sx={{
            mt: 10,
            p: 5,
            borderRadius: 6,
            background: "#e7e6e9",
            color: "#141517",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: "center",
            }}
          >
            Website Developed By
          </Typography>

          <Stack spacing={4} alignItems="center">
            {developers &&
              developers?.map((dev, index) => {
                const imageFirst = index % 2 === 0;

                return (
                  <Box
                    key={dev.email}
                    sx={{
                      mb: 8,
                      p: 4,
                      borderRadius: 6,
                      background:
                        "linear-gradient(135deg,#3E1A89 0%, #5222B5 100%)",
                      color: "#fff",
                    }}
                  >
                    <Stack
                      direction={{
                        xs: "column",
                        md: imageFirst ? "row" : "row-reverse",
                      }}
                      spacing={5}
                      alignItems="center"
                    >
                      <Box
                        component="img"
                        src={`${dev.image}`}
                        alt={dev.name}
                        sx={{
                          width: 220,
                          height: 220,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "5px solid #fff",
                          flexShrink: 0,
                          boxShadow: "0 10px 30px rgba(0,0,0,.2)",
                        }}
                      />

                      <Box flex={1}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                          }}
                        >
                          {dev?.name}
                        </Typography>

                        <Typography
                          variant="h6"
                          sx={{
                            opacity: 0.9,
                            mb: 2,
                          }}
                        >
                          {dev.role ?? "Developer"}
                        </Typography>

                        <Typography sx={{ mb: 1 }}>
                          📧 {dev.email ?? "Not Available"}
                        </Typography>

                        <Typography sx={{ mb: 3 }}>📞 {dev.phone}</Typography>

                        <Stack
                          direction="row"
                          spacing={2}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <PrimaryButton
                            href={`mailto:${dev.email}`}
                            target="_blank"
                            sx={{
                              bgcolor: "#fff",
                              color: "#3E1A89",
                            }}
                          >
                            Email
                          </PrimaryButton>

                          <PrimaryButton
                            href={`tel:${dev.phone}`}
                            sx={{
                              bgcolor: "#fff",
                              color: "#3E1A89",
                            }}
                          >
                            Call
                          </PrimaryButton>

                          {dev.github && (
                            <PrimaryButton
                              href={dev.github}
                              target="_blank"
                              sx={{
                                borderColor: "#fff",
                                color: "#fff",
                              }}
                            >
                              GitHub
                            </PrimaryButton>
                          )}

                          {dev.linkedin && (
                            <PrimaryButton
                              href={dev.linkedin}
                              target="_blank"
                              sx={{
                                borderColor: "#fff",
                                color: "#fff",
                              }}
                            >
                              LinkedIn
                            </PrimaryButton>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
