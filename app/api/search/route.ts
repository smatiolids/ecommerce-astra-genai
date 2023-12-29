import { NextResponse, NextRequest } from "next/server";
import { GetMultimodalEmbedding, MultiModalPrompt } from "./vertex";

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
      searchEmbedding = await GetMultimodalEmbedding(
        null,
        post["query"]
      );
      console.log("Generating embedding for query: DONE");

    }

    if (post["n"]) n = post["n"];
  } else {
    const body = await req.json();
    if (body.vector) searchEmbedding = body.vector;
    if (body.n) n = body.n;
  }

  console.log("Searching on Astra");

  const requestUrl = `${process.env.ASTRA_DB_API_ENDPOINT}/api/json/v1/default_keyspace/ecommerce_products`;

  const options: Record<string, any> = {
    method: "POST",
    headers: {
      Token: process.env.ASTRA_DB_APPLICATION_TOKEN,
      "Content-Type": "application/json",
    },
  };

  if (req.body) {
    options.body = JSON.stringify({
      find: {
        sort: {
          $vector: searchEmbedding,
        },
        options: {
          limit: n,
          includeSimilarity: true,
        },
      },
    });
  }

  const response = await fetch(requestUrl, options);
  const data = await response.json();
  console.log("Searching on Astra: DONE");

  return NextResponse.json(
    { ...data, promptDescription: description },
    { status: response.status }
  );
}
