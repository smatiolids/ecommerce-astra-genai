import { VertexAI } from "@google-cloud/vertexai";
import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

const projectId = process.env.GCP_PROJECT_ID;
const location = process.env.GCP_REGION;
const vertexAI = new VertexAI({ project: projectId, location: location });

export async function MultiModalPrompt(
  file: string | null,
  fileType: string,
  prompt: text | null
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
            inlineData: {
              data: file,
              mimeType: fileType
            },
          },
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  // console.log(JSON.stringify(request))

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
  const body = { instances: [{}] };

  if (file)
    body.instances[0]["image"] = {
      bytesBase64Encoded: file,
    };

  if (text) body.instances[0]["text"] = text;

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
  console.log("Res GCP: ", data);

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
