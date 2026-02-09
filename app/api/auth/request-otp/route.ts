export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMailjetClient } from "@/lib/mailjet";

type Body = {
  npm: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function generateOtp6(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(
  req: Request
) {
  try {
    console.log("/api/auth/request-otp called");

    const body = (await req.json()) as Partial<Body>;
    const npm = (body.npm ?? "").trim();

    if (!npm) return jsonError("NPM wajib diisi", 400);

    const account = await db.account.findUnique({ where: { npm } });
    console.log("Account:", account);

    if (!account) return jsonError("NPM tidak terdaftar", 403);

    if (!account.clerkUserId) {
      return jsonError("Akun belum login via Google/Clerk. Silakan login Google dulu.", 403);
    }


    const email = account.email?.trim();
    if (!email) return jsonError("Email akun tidak ditemukan", 400);

    const today = new Date();
      today.setHours(0, 0, 0, 0);
      const otpCountToday = await db.loginOtp.count({
        where: {
          email,
          npm,
          createdAt: { gte: today },
        },
      });

      if (otpCountToday >= 5) {
        return jsonError("HAHAHA GAK BISA SPAM", 429);
      }
    const lastOtp = await db.loginOtp.findFirst({
      where: { email, npm },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp) {
      const diff = Date.now() - lastOtp.createdAt.getTime();
      if (diff < 60_000) {
        return jsonError("OTP baru bisa diminta setelah 60 detik", 429);
      }
    }

    await db.loginOtp.deleteMany({
      where: { email, npm },
    });

    const code = generateOtp6();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    await db.loginOtp.create({
      data: { email, npm, code, expiresAt },
    });

    console.log("OTP generated:", { email, npm, code, expiresAt });

    const fromEmail = process.env.OTP_FROM_EMAIL;
    const fromName = process.env.OTP_FROM_NAME ?? "OTP";

    if (!fromEmail) {
      return jsonError("OTP_FROM_EMAIL_ERROR", 500);
    }

    const mailjet = getMailjetClient();

    const subject = "Kode OTP Login";
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Kode OTP Login</h2>
        <p>Gunakan kode berikut untuk login. Kode berlaku <b>5 menit</b>.</p>
        <div style="font-size:28px;letter-spacing:4px;font-weight:bold;margin:16px 0">${code}</div>
        <p>Jika kamu tidak meminta OTP, abaikan email ini.</p>
      </div>
    `;
    const text = `Kode OTP login kamu: ${code}. Berlaku 5 menit.`;

    const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: { Email: fromEmail, Name: fromName },
            To: [{ Email: email }],
            Subject: subject,
            TextPart: text,
            HTMLPart: html,
          },
        ],
      });

    console.log("Mailjet result:", result?.body);

    const messages = (result.body as { Messages?: Array<{ Status?: string; Errors?: unknown }> }).Messages;
    const status = messages?.[0]?.Status;

    if (status && status !== "success") {
      console.error("Mailjet send failed:", result.body);
      return jsonError("Gagal mengirim OTP (Mailjet)", 502);
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("🔥 request-otp ERROR:", err);
    return jsonError("Server error saat mengirim OTP", 500);
  }
}
