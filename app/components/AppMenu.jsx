import { Menu } from "react-admin";
import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
export const AppMenu = (props) => (
  <Menu {...props}>
    <Menu.DashboardItem
      primaryText="Multimodal Search"
      leftIcon={<ImageSearchOutlinedIcon />}
    />
    <Menu.Item
      to="/catalog"
      primaryText="Catalog"
      leftIcon={<FeaturedPlayListOutlinedIcon />}
    />
  </Menu>
);
