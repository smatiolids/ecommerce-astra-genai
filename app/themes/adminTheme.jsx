import { defaultTheme } from "react-admin";
import deepPurple from "@mui/material/colors/deepPurple";
import pink from "@mui/material/colors/pink";
export const adminTheme = {
  ...defaultTheme,
  palette: {
    mode: "dark",
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
};

export const darkTheme = {
  ...adminTheme,
  palette: {
    mode: "dark",
    primary: pink,
    secondary: deepPurple,
  },
};

export const lightTheme = {
  ...adminTheme,
  palette: {
    mode: "light",
    primary: deepPurple,
    secondary: deepPurple,
  },
};
