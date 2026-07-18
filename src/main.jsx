import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./Components/Theme/Theme.js";
import { Provider } from "react-redux";
import store from "./Redux/Store/Store.js";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <StrictMode>
          <App />
        </StrictMode>
      </ThemeProvider>
    </SnackbarProvider>
  </Provider>,
);
