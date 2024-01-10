import { Grid, Tooltip, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Button,
  NumberField,
  Show,
  TextField,
  WithRecord,
  useRecordContext,
} from "react-admin";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductGrid from "./ProductGrid";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export const ProductShow = (props: { id: string; vector: Number[] }) => {
  const record = useRecordContext();
  const [products, setProducts] = useState([]);

  return (
    <Show>
      <Grid container direction="column">
        <Grid item m={2}>
          <WithRecord
            render={(r) => (
              <Typography variant="subtitle1">
                HOME / {r.category} / {r.product_name}
              </Typography>
            )}
          />
        </Grid>

        <Grid container item xs={12} md={6} direction="row" spacing={3}>
          <Grid container item xs={12} md={8}>
            <WithRecord
              label="images"
              render={(record) => (
                <Carousel
                  transitionTime={3}
                  swipeable={false}
                  width="400px"
                  dynamicHeight={true}
                >
                  {record.images.map((URL: string, index: number) => (
                    <div className="slide max-h-128">
                      <img alt="sample_file" src={URL} key={index} />
                    </div>
                  ))}
                </Carousel>
              )}
            />
          </Grid>
          <Grid container item direction="column" xs={12} md={4}>
            <TextField source="_id" label="Id" variant="caption" />
            <TextField source="product_name" label="Name" variant="h4" mb={5} />
            <TextField
              source="description"
              label="Description"
              variant="body1"
              mb={5}
            />
            <NumberField
              source="discounted_price"
              label="Price"
              variant="h6"
              options={{
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }}
            />
            <Button variant="contained" label="Add To Cart" />
            <Typography mt={1} variant="h5">
              Specification
            </Typography>

            <WithRecord
              label="Specifications"
              render={(record) =>
                record.specification
                  ? record.specification.map((s: any, ix: number) => (
                      <div key={ix}>
                        <Typography variant="caption">
                          {s.key ? `${s.key}:` : null} {s.value}
                        </Typography>
                      </div>
                    ))
                  : null
              }
            />
          </Grid>
        </Grid>
        <WithRecord
          label="Specifications"
          render={(record) => (
            <ProductRecommendation id={record._id} vector={record["$vector"]} />
          )}
        />
      </Grid>
    </Show>
  );
};

const ProductRecommendation = (props: { id: string; vector: Number[] }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getRecommendation = async (id: string, vector: Number[]) => {
      const res = await fetch(`/api/search`, {
        method: "POST",
        body: JSON.stringify({
          vector: vector,
          n: 5,
        }),
      });

      const response = await res.json();
      setProducts(response.data.filter((d: any) => d._id !== id));
    };

    getRecommendation(props.id, props.vector);

    return () => {};
  }, []);

  return (
    <Grid container direction="column">
      <Grid item m={2}>
        <Typography variant="h4">
          <Tooltip title="Product recommendation based on similarity with current product">
            <AutoFixHighIcon color="primary" fontSize="large" />
          </Tooltip>
          We also recommend you
        </Typography>
      </Grid>
      <Grid item>
        {products && products.length > 0 && <ProductGrid data={products} key={1}/>}
      </Grid>
    </Grid>
  );
};
