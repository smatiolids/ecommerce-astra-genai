import { Admin, CustomRoutes, Resource } from "react-admin";
import Dashboard from "../modules/dashboard";
import { darkTheme, lightTheme } from "../themes/adminTheme";
import AppLayout from "../components/AppLayout";
import AstraDataProvider from "../provider/AstraDataProvider";
import { ProductShow } from "../modules/Product/ProductShow";

const AdminApp = () => (
  <Admin
    title="Ecommerce com IA Generativa"
    dashboard={Dashboard}
    dataProvider={AstraDataProvider}
    layout={AppLayout}
    lightTheme={lightTheme}
    darkTheme={darkTheme}
  >
    <Resource name="product" show={ProductShow} />
  </Admin>
);

export default AdminApp;
