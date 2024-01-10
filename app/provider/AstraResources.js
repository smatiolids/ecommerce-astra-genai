/**
 * For modeling the queries for Stargate some metadata is needed
 * The information for tables and collection primary keys
 */

export const AstraResources = {
  product : {
    API: "JSON",
    key: ["_id"],
    collectionName: "ecommerce_products"
  },
  catalog : {
    API: "JSON",
    key: ["_id"],
    collectionName: "ecommerce_products"
  }
};
