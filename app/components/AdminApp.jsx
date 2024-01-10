import { Admin, Resource } from "react-admin";
import Dashboard from "../modules/dashboard";
import { darkTheme, lightTheme } from "../themes/adminTheme";
import AppLayout from "../components/AppLayout";
import AstraDataProvider from "../provider/AstraDataProvider";
import { ProductShow } from "../modules/Product/ProductShow";
import { authProvider } from "../provider/authProvider";
import AstraLoginPage from "../AstraLogin";
import { CatalogList } from "../modules/catalog/CatalogList";
import { CatalogShow } from "../modules/catalog/CatalogShow";
import { AstraResources } from "../provider/AstraResources";

const AdminApp = () => (
  <Admin
    title="Ecommerce com IA Generativa"
    dashboard={Dashboard}
    dataProvider={AstraDataProvider}
    layout={AppLayout}
    lightTheme={lightTheme}
    darkTheme={darkTheme}
    authProvider={authProvider}
    loginPage={AstraLoginPage}
  >
    <Resource name="product" show={ProductShow} />
    <Resource
      name="catalog"
      list={CatalogList}
      show={CatalogShow}
      options={{ key: AstraResources.product.key, label: "Product Catalog" }}
    />
  </Admin>
);

export default AdminApp;
