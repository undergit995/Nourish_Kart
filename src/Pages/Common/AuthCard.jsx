import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

function AuthCard({ title, children, sx }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 350,
          borderRadius: 3,
          boxShadow: 5,
          ...sx
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1, sm: 2 },
          }}
        >
          <Typography 
          variant="h4" 
          align="center" 
          
          >
            {title}
        </Typography>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuthCard;
