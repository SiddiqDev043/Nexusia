// app/api/servers/join/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { invite } = await req.json();
    if (!invite) return new NextResponse("Invite is required", { status: 400 });

    let token = invite;
    try {
      const url = new URL(invite);
      token = url.pathname.split("/").pop() || token;
    } catch (e) {
    }

    const server = await db.server.findFirst({ where: { inviteCode: token } });
    if (!server) return new NextResponse("Invalid invite", { status: 404 });

    const profile = await db.profile.findUnique({ where: { userId } });
    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    const existing = await db.member.findFirst({
      where: { serverId: server.id, profileId: profile.id },
    });

    if (existing) {
      return NextResponse.json({ serverId: server.id, message: "Already joined" });
    }

    const role = profile.role === "DOSEN" ? "DOSEN" : "MAHASISWA";

    await db.member.create({
      data: {
        serverId: server.id,
        profileId: profile.id,
        role,
      },
    });

    return NextResponse.json({ serverId: server.id });
  } catch (err) {
    console.error("[JOIN_SERVER_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}