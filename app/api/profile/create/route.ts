export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    const { name, npm, role, imageUrl } = await req.json();

    if (!name || !npm || !role) {
      return NextResponse.json({ error: "Data belum lengkap" }, { status: 400 });
    }

    const account = await db.account.findUnique({ where: { npm } });
    if (!account) {
      return NextResponse.json(
        { error: "NPM tidak terdaftar" },
        { status: 403 }
      );
    }

    if (account.email !== email) {
      return NextResponse.json(
        { error: "NPM tidak sesuai dengan akun ini" },
        { status: 403 }
      );
    }

    const existing = await db.profile.findUnique({
      where: { userId: user.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Profile sudah ada" },
        { status: 400 }
      );
    }

    const profile = await db.profile.create({
        data: {
        userId: user.id,
        name,
        email,
        npm: String(npm).trim(),
        imageUrl: user.imageUrl ?? "", 
    },
    });

    return NextResponse.json(profile);
  } catch (e) {
    console.error("CREATE PROFILE ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}