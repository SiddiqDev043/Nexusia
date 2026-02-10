export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { currentAccount } from "@/lib/current-account";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const account = await currentAccount();

    if (!profile || !account) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ❗ BLOK MAHASISWA
    if (account.role === "MAHASISWA") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_INVITE_CODE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}