import { NextResponse, NextRequest } from "next/server";
import getDB from "@/app/api/AstraClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDB();
    const collection = await db.collection(body.resource.collectionName);
    var data;
    if (body.method === "findOne")
      data = await collection.findOne({
        _id: body.params.id,
      });
    else if (body.method === "find")
      data = await collection
        .find(body.params.filter || {}, { limit: 20 })
        .toArray();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
