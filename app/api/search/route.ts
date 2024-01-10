import { NextResponse, NextRequest } from "next/server";
import { GetMultimodalEmbedding, MultiModalPrompt } from "./vertex";
import getDB from "@/app/api/AstraClient";

export async function POST(req: NextRequest) {
  /**
   * Perform the embedding generation, then the vector search on astra
   */
  var searchEmbedding;
  var n = 10;
  var description;

  const contentType: string = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    const file: File | null = formData.get("file") as File;
    const post = JSON.parse(formData.get("post") as string);
    var imageb64: string | null;

    if (file) {
      imageb64 = Buffer.from(await file.arrayBuffer()).toString("base64");

      console.log("Generating image description");

      description = await MultiModalPrompt(
        imageb64,
        file.type,
        "Describe in less than 20 words only the main object in the image"
      );
      console.log("Generating image description: DONE");
      console.log("Generating embedding");
      // Generate the Embedding
      searchEmbedding = await GetMultimodalEmbedding(
        imageb64,
        post["query"] || null
      );
      console.log("Generating embedding: DONE");
    } else {
      console.log("Generating embedding for query");
      searchEmbedding = await GetMultimodalEmbedding(null, post["query"]);
      console.log("Generating embedding for query: DONE");
    }

    if (post["n"]) n = post["n"];
  } else {
    const body = await req.json();
    if (body.vector) searchEmbedding = body.vector;
    if (body.n) n = body.n;
  }

  console.log("Searching on Astra");
  const db = await getDB();
  const collection = await db.collection("ecommerce_products");

  const data = await collection
    .find(
      {},
      {
        sort: {
          $vector: searchEmbedding,
        },
        limit: n,
        includeSimilarity: true,
      }
    )
    .toArray();
  console.log("Searching on Astra: DONE");

  return NextResponse.json(
    { data, promptDescription: description },
    { status: 200 }
  );
}
