import { Box, Typography } from "@mui/material";
import React from "react";

function CustomerCardAuth({ title, children, sx }) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...sx,
      }}
    >
      {title && (
        <Typography variant="h4" align="center" gutterBottom>{title}</Typography>
      )}
      {children}
    </Box>
  );
}

export default CustomerCardAuth;