// theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#3E1A89",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
      contrastText: "#3E1A89",
    },
    background: {
      default: "#f7f4ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#3E1A89",
      secondary: "#6b5d8d",
    },
  },
});