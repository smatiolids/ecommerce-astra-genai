/**
 * For modeling the queries for Stargate some metadata is needed
 * The information for tables and collection primary keys
 */

export const AstraResources = {
  product : {
    API: "JSON",
    key: ["_id"],
    collectionName: "ecommerce_products"
  }
  // assistants: {
  //   API: "REST",
  //   key: ["id"],
  //   fields: "id name instructions created_at model"
  // },
  // files: {
  //   API: "REST",
  //   key: ["id"],
  //   fields: "id filename format created_at status"
  // },
  // file_chunks: {
  //   API: "REST",
  //   key: ["file_id","chunk_id"],
  //   fields: "file_id chunk_id content created_at embedding"
  // },
  // threads: {
  //   API: "REST",
  //   key: ["id"],
  //   fields: "id created_at"
  // },
  // runs: {
  //   API: "REST",
  //   key: ["thread_id","id"],
  //   fields: "thread_id id created_at completed_at"
  // },
  // messages: {
  //   API: "REST",
  //   key: ["thread_id","id"],
  //   fields: "thread_id id created_at content"
  // },
  // alert: {
  //   API: "REST",
  //   key: ["organization_id", "device_id"],
  // },
  // resources: {
  //   API: "REST",
  //   key: ["organization_id", "resource_id"],
  // },
  // invoices: {
  //   API: "DOCUMENT",
  //   key: ["docuement_id"],
  // },
};
