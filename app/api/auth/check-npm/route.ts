import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = user.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email invalid" }, { status: 400 });

    const { npm, role } = await req.json();
    if (!npm) return NextResponse.json({ error: "NPM wajib" }, { status: 400 });
    if (!role) return NextResponse.json({ error: "Role wajib" }, { status: 400 });

    const account = await db.account.findUnique({ where: { npm } });
    if (!account) return NextResponse.json({ error: "NPM tidak terdaftar" }, { status: 403 });

    if (account.email?.trim().toLowerCase() !== email)
      return NextResponse.json({ error: "Email Google tidak cocok dengan NPM ini." }, { status: 403 });

    const inputRole = role.toUpperCase() as MemberRole;
    if (account.role !== inputRole)
      return NextResponse.json({ error: "Role tidak sesuai dengan database." }, { status: 403 });

    if (!account.clerkUserId) {
      await db.account.update({
        where: { npm },
        data: { clerkUserId: user.id },
      });
    }

    return NextResponse.json({ ok: true, role: account.role });
  } catch (err) {
    console.error("check-npm ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}