export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { currentAccount } from "@/lib/current-account";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> }
) {
  const { serverId } = await params; 
  const profile = await currentProfile();
  const account = await currentAccount();

  if (!profile || account?.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { name, imageUrl } = await req.json();

  const server = await db.server.update({
    where: { id: serverId, profileId: profile.id },
    data: { name, imageUrl },
  });

  return NextResponse.json(server);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ serverId: string }> } 
) {
  const { serverId } = await params; 
  const profile = await currentProfile();
  const account = await currentAccount();

  if (!profile || account?.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const server = await db.server.delete({
    where: { id: serverId, profileId: profile.id },
  });

  return NextResponse.json(server);
}
