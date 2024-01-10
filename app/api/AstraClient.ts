import { AstraDB } from "@datastax/astra-db-ts";

const ASTRA_DB_API_ENDPOINT = process.env["ASTRA_DB_API_ENDPOINT"];
const ASTRA_DB_APPLICATION_TOKEN = process.env["ASTRA_DB_APPLICATION_TOKEN"];
var db: AstraDB;

// export default db
const getDB = async (): Promise<AstraDB> => {
  if (!db) {
    db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT);
  }
  return db;
};

export default getDB;
