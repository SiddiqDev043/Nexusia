import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUserId = user.id;
    const clerkEmail = user.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase();
    if (!clerkEmail) return NextResponse.json({ error: "Email tidak ditemukan" }, { status: 400 });

    const { npm, code } = await req.json();
    if (!npm || !code) return NextResponse.json({ error: "NPM dan OTP wajib diisi" }, { status: 400 });

    const account = await db.account.findUnique({ where: { npm } });
    if (!account) return NextResponse.json({ error: "NPM tidak terdaftar" }, { status: 403 });

    if (account.email?.trim().toLowerCase() !== clerkEmail)
      return NextResponse.json({ error: "Email Google tidak cocok dengan akun NPM" }, { status: 403 });

    const otp = await db.loginOtp.findFirst({
      where: { npm, email: account.email, code, expiresAt: { gt: new Date() } },
    });
    if (!otp) return NextResponse.json({ error: "OTP salah atau kadaluarsa" }, { status: 400 });

    await db.loginOtp.delete({ where: { id: otp.id } });

    await db.account.update({
      where: { npm },
      data: { verifiedAt: new Date(), clerkUserId },
    });

    const existingProfile = await db.profile.findUnique({ where: { userId: clerkUserId } });
    if (!existingProfile) {
      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User";
      await db.profile.create({
        data: { userId: clerkUserId, name: fullName, email: account.email, imageUrl: user.imageUrl ?? "" },
      });
    }

    const res = NextResponse.json({ ok: true, role: account.role });
    res.cookies.set({
      name: "otpVerified",
      value: "true",
      httpOnly: false, 
      path: "/",
      maxAge: 60 * 60, 
    });

    return res;
  } catch (err) {
    console.error("verify-otp ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}