import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const room = req.nextUrl.searchParams.get("room");
    const username = req.nextUrl.searchParams.get("username");

    if(!room) return NextResponse.json({ error: "Missing room" }, { status: 400 });
    if(!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });

    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;
    const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    const jwt = await at.toJwt();
    console.log("GENERATED JWT:", jwt);

    return new Response(jwt, {
        status: 200,
        headers: { "Content-Type": "text/plain" } 
    });
}
