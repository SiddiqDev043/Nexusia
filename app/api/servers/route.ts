import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { currentAccount } from "@/lib/current-account";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const account = await currentAccount();
    if (!account || account.role !== "ADMIN") {
      return new NextResponse("Admin only", { status: 403 });
    }

    const { name, imageUrl } = await req.json();

    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels: {
          create: [{ 
            name: "general", 
            profileId: profile.id 
        }],
        },
        members: {
          create: [{ 
            profileId: profile.id, 
            role: "ADMIN" 
        }],
        },
      },
    });

    return NextResponse.json(server);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}