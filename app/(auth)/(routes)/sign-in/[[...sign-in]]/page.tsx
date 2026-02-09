"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { AuthCard } from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Step = "GOOGLE" | "NPM_ROLE" | "OTP";
type Role = "ADMIN" | "DOSEN" | "MAHASISWA";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Terjadi kesalahan.";
}

export default function SignInPage() {
  const router = useRouter();
  const { openSignIn } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  const [step, setStep] = useState<Step>("GOOGLE");
  const [npm, setNpm] = useState("");
  const [role, setRole] = useState<Role>("MAHASISWA");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setStep("NPM_ROLE");
      setMsg(`Selamat datang, ${user?.firstName || "Student"}!`);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) return null;

  const validateNpmRole = async () => {
    setLoading(true);
    setMsg("Memverifikasi NPM dan Role...");
    try {
      const res = await fetch("/api/auth/check-npm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npm: npm.trim(), role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal verifikasi NPM & Role.");
      setMsg("NPM & Role valid. Pilih VERIFIKASI OTP.");
      setStep("OTP");
    } catch (e: unknown) {
      setMsg(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    setMsg("Mengirim OTP ke email...");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npm: npm.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal mengirim OTP.");
      setMsg("OTP berhasil dikirim. Cek inbox / spam Gmail.");
    } catch (e: unknown) {
      setMsg(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMsg("Memverifikasi OTP...");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npm: npm.trim(), code: otp.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "OTP salah atau kadaluarsa.");

      if (data.role === "ADMIN") {
        window.location.href = "/";
      } else {
        router.push("/servers/join");
      }
    } catch (e: unknown) {
      setMsg(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      {step === "GOOGLE" && (
        <div className="w-full max-w-md">
          <Button type="button" variant="primary" className="w-full" onClick={() => openSignIn()}>
            WELCOME STUDENT
          </Button>
        </div>
      )}

      {step !== "GOOGLE" && (
        <AuthCard
          className="text-center"
          title={user ? `WELCOME, ${user.firstName || ""}!` : "WELCOME!"}
          description={
            step === "NPM_ROLE"
              ? "Verifikasi NPM & Role kamu."
              : "Masukkan kode OTP."
          }
        >
          {msg && <div className="mb-4 rounded-md border border-border bg-muted px-3 py-2 text-sm">{msg}</div>}

          {step === "NPM_ROLE" && (
            <div className="space-y-3">
              <Input placeholder="Masukkan NPM" value={npm} onChange={(e) => setNpm(e.target.value)} />
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full p-2 border rounded hover:bg-indigo-300 text-green-600 font-bold transition">
                <option value="ADMIN">ADMIN</option>
                <option value="DOSEN">DOSEN</option>
                <option value="MAHASISWA">MAHASISWA</option>
              </select>
              <Button type="button" variant="primary" className="w-full" onClick={validateNpmRole} disabled={loading || !npm.trim()}>
                {loading ? "Memproses..." : "Verifikasi NPM & Role"}
              </Button>
            </div>
          )}

          {step === "OTP" && (
            <div className="space-y-3">
              <Button type="button" variant="outline" className="w-full" onClick={sendOtp} disabled={loading}>
                {loading ? "Mengirim..." : "Kirim OTP ke Email"}
              </Button>
              <Input placeholder="Masukkan kode OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <Button type="button" variant="primary" className="w-full" onClick={verifyOtp} disabled={loading || !otp.trim()}>
                {loading ? "Memverifikasi..." : "Verifikasi OTP & Masuk"}
              </Button>
              <p className="text-xs text-muted-foreground">Kode OTP berlaku 5 menit. Jika tidak masuk, cek folder spam.</p>
            </div>
          )}
        </AuthCard>
      )}
    </div>
  );
}