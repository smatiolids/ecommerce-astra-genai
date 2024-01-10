import { VertexAI } from "@google-cloud/vertexai";
import { GoogleAuth } from "google-auth-library";
import * as fs from 'fs';
import * as path from 'path';

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"]
});

const projectId: string = process.env.GCP_PROJECT_ID as string;
const location: string = process.env.GCP_REGION as string;

function setCredentialsFile(): void {
  if (!fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS as string)) {
      fs.writeFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS as string, process.env.CREDS as string, 'utf-8');
      console.log(`File '${process.env.GOOGLE_APPLICATION_CREDENTIALS}' created with content from environment variable.`);
  } else {
      console.log(`File '${process.env.GOOGLE_APPLICATION_CREDENTIALS}' already exists.`);
  }
}

setCredentialsFile()

const vertexAI = new VertexAI({ project: projectId, location: location });

export async function MultiModalPrompt(
  file: string | null,
  fileType: string,
  prompt: string | null
) {
  const model = "gemini-pro-vision";
  const generativeVisionModel = vertexAI.preview.getGenerativeModel({
    model: model,
  });

  const request = {
    contents: [
      {
        role: "user",
        parts: [
          {
            inline_data: {
              data: file as string,
              mime_type: fileType,
            },
          },
          {
            text: prompt as string,
          },
        ],
      },
    ],
  };

  // Create the response
  const response = await generativeVisionModel.generateContent(request);
  // Wait for the response to complete
  const aggregatedResponse = await response.response;
  // Select the text from the response
  const fullTextResponse =
    aggregatedResponse.candidates[0].content.parts[0].text;

  return fullTextResponse;
}

export async function GetMultimodalEmbedding(
  file: string | null,
  text: string | null
) {
  /**
   * Generating Multimodal Embedding is not available yoe on thr SDK. Then, I had to generate it using REST.
   */
  const model = "multimodalembedding@001";
  const requestUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

  var obj: {[k: string]: any} = {};

  if (file)
    obj.image = {
      bytesBase64Encoded: file as string,
    };

  if (text) obj.text = text;

  const body = { instances: [obj] };

  const options: Record<string, any> = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await auth.getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(requestUrl, options);
  const data = await response.json();

  // Balance both embeddings
  if (data.predictions[0].textEmbedding && data.predictions[0].imageEmbedding) {
    const imageEmbeddingArray = new Float32Array(
      data.predictions[0].imageEmbedding
    );
    const textEmbeddingArray = new Float32Array(
      data.predictions[0].textEmbedding
    );

    const averageEmbedding = Array.from(imageEmbeddingArray).map(
      (value, index) => (value + textEmbeddingArray[index]) / 2
    );

    return averageEmbedding;
  } else if (data.predictions[0].textEmbedding)
    return data.predictions[0].textEmbedding;
  else return data.predictions[0].imageEmbedding;
}
