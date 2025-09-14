import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await request.blob(); // ensures full upload
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Netspeed API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
