export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Email invalid" }, { status: 400 });

    const { npm } = await req.json();
    if (!npm) return NextResponse.json({ error: "NPM wajib" }, { status: 400 });

    const account = await db.account.findUnique({ where: { npm } });
    if (!account) return NextResponse.json({ error: "NPM tidak terdaftar" }, { status: 403 });

    if (account.email !== email) {
      return NextResponse.json({ error: "Email tidak cocok" }, { status: 403 });
    }

    await db.account.update({
      where: { npm },
      data: {
        verifiedAt: new Date(),
        clerkUserId: user.id,
      },
    });

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      await db.profile.create({
        data: {
          userId: user.id,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email,
          imageUrl: user.imageUrl ?? "",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}