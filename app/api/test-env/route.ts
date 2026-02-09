import { NextResponse } from "next/server";

export async function GET() {
  console.log("UPLOADTHING_TOKEN:", process.env.UPLOADTHING_TOKEN ? "ADA" : "KOSONG");
  return NextResponse.json({
    status: "OK",
    tokenPresent: !!process.env.UPLOADTHING_TOKEN
  });
}
