import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ShowButton,
  NumberField,
} from "react-admin";
export const CatalogList = (props) => (
  <List queryOptions={{ key: props.key }}>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="category" />
      <TextField source="product_name" />
      <NumberField source="retail_price" />
      <NumberField source="discounted_price" />
      <ShowButton />
    </Datagrid>
  </List>
);
