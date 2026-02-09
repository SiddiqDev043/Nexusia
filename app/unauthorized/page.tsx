"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    signOut({ redirectUrl: "/sign-in" });
  }, [signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-semibold">Akun tidak diizinkan</h1>
        <p className="text-sm text-muted-foreground">
          Kamu akan diarahkan ke halaman login.
        </p>
      </div>
    </div>
  );
}
