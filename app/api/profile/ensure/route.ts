export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const userId = user.id;
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) return new NextResponse("Email not found", { status: 400 });

    const account = await db.account.findUnique({ where: { email } });
    if (!account) return new NextResponse("Account not found", { status: 404 });

    let profile = await db.profile.findUnique({ where: { userId } });

    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId,
          role: account.role,
          npm: account.npm,
          email,
          name: user.firstName ?? "", 
          imageUrl: user.imageUrl ?? "",
        },
      });
    } else if (!profile.role || !profile.npm) {
      profile = await db.profile.update({
        where: { userId },
        data: {
          role: account.role,
          npm: account.npm,
        },
      });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error("[PROFILE_ENSURE_ERROR]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}