import { Layout } from "react-admin";
import AppBar from "./AppBar";
import { AppMenu } from "./AppMenu";

const AppLayout = (props) => <Layout {...props} appBar={AppBar} menu={AppMenu}/>;

export default AppLayout;
