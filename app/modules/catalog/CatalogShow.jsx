import {
  Show,
  TextField,
  TabbedShowLayout,
  List,
  Datagrid,
  NumberField,
  ImageField,
  TextInput,
  FunctionField,
  ArrayField,
} from "react-admin";
import { useRecordContext } from "react-admin";

export const CatalogShow = (props) => (
  <Show>
    <TabbedShowLayout syncWithLocation={false}>
      <TabbedShowLayout.Tab label="Product">
        <TextField source="category" />
        <TextField source="product_name" />
        <NumberField source="retail_price" />
        <NumberField source="discounted_price" />
        <TextField source="description" />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Specification">
        <Specifications />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Images">
        <ImageList />
      </TabbedShowLayout.Tab>
      <TabbedShowLayout.Tab label="Vector">
        <Vector />
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>
);

const ImageList = () => {
  const record = useRecordContext();
  return (
    <>
      <ul>
        {record.images.map((e, ix) => (
          <li key={`img-${ix}`} className="p-2">
            <img src={e} className="w-1/2" />
          </li>
        ))}
      </ul>
    </>
  );
};

const Vector = () => {
  const record = useRecordContext();
  return (
    <div className="max-w-screen-lg">
      <FunctionField
        label="Vector Size"
        render={(record) => `Vector Dimensions: ${record["$vector"].length}`}
      />
      <div className="w-full">
        {record.$vector.map((e) => (
          <span className="p-1">{e}</span>
        ))}
      </div>
    </div>
  );
};

const Specifications = () => {
  const record = useRecordContext();
  return (
    <List>
      <Datagrid data={record.specification} bulkActionButtons={false}>
        <TextField source="key" />
        <TextField source="value" />
      </Datagrid>
    </List>
  );
};
