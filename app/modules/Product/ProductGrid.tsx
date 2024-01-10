import React from "react";
import { Link } from "react-admin";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  CardActionArea,
} from "@mui/material";

const ProductGrid = (props: { data: any[] }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {props.data.map((record, ix) => (
        <Grid key={ix} xs={12} sm={6} md={4} lg={3} xl={2} item>
          <Card>
            <CardActionArea href={`#/product/${record._id}/show`}>
              <CardMedia image={`${record.images[0].replace('https://','http://')}`} sx={{ height: 140 }} />
              <CardContent sx={{ paddingBottom: "0.5em" }}>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {record.category}
                </Typography>
                <Typography>{record.product_name}</Typography>
                <Typography align="left">
                  {currencyFormat(record.discounted_price)}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Link to={`/product/${record._id}/show`}>See More</Link>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

function currencyFormat(num : Number) {
  return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export default ProductGrid;
