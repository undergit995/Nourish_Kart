import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

// style Buttons
export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: "20px",
  width: "150px",
  padding: "10px",
  height: "40px",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const SecondaryButton = styled(PrimaryButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));