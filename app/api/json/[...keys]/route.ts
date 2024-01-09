import { NextResponse, NextRequest } from "next/server";
import db  from "@/app/provider/AstraJSON"; 
// import { AstraDB } from "@datastax/astra-db-ts";

// const ASTRA_DB_API_ENDPOINT = process.env["ASTRA_DB_API_ENDPOINT"];
// const ASTRA_DB_APPLICATION_TOKEN = process.env["ASTRA_DB_APPLICATION_TOKEN"];
// const db = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("Astra Json Req Body", body);

    const collection = await db.collection(body.resource.collectionName);
    var data;
    if (body.method === "findOne")
      data = await collection.findOne({
        _id: body.params.id,
      });

    // console.log("data", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}

// export async function POST_OLD(req: NextRequest) {
//   const body = await req.json();
//   console.log(body);

//   const requestUrl = `${process.env.ASTRA_DB_API_ENDPOINT}/api/json/v1/${process.env.ASTRA_DB_KEYSPACE}/${body.resource.collectionName}`;

//   const options: Record<string, any> = {
//     method: "POST",
//     headers: {
//       Token: process.env.ASTRA_DB_APPLICATION_TOKEN,
//       "Content-Type": "application/json",
//     },
//   };

//   console.log(requestUrl);

//   if (req.body) {
//     options.body = JSON.stringify({
//       findOne: {
//         filter: {
//           _id: body.params.id,
//         },
//       },
//     });
//   }

//   const response = await fetch(requestUrl, options);
//   const data = await response.json();
//   return NextResponse.json(data, { status: response.status });
// }
