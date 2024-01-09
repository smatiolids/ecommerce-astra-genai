import { AstraDB } from "@datastax/astra-db-ts";

const ASTRA_DB_API_ENDPOINT = process.env["ASTRA_DB_API_ENDPOINT"];
const ASTRA_DB_APPLICATION_TOKEN = process.env["ASTRA_DB_APPLICATION_TOKEN"];
const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT);

export default db