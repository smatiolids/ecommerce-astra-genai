import { ToggleThemeButton, AppBar } from "react-admin";
import { Typography } from "@mui/material";

const AppBarCustom = (props) => (
  <AppBar {...props}>
    <Typography flex="1" variant="h6" id="react-admin-title">

    </Typography>
    <div class="px-2">
      <img src="datastax-logo.svg" width="230" height="50" />
    </div>
  </AppBar>
);

export default AppBarCustom;
