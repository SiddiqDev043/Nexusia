"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/get-error-message";

export default function SignUpProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [npm, setNpm] = useState("");
  const [role, setRole] = useState("MAHASISWA");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, npm, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/");
      router.refresh();
    } catch (e: unknown) {
      setMsg(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Lengkapi Profile"
      description="Data ini diperlukan untuk melanjutkan."
    >
      {msg && (
        <div className="mb-4 rounded-md border bg-muted px-3 py-2 text-sm">
          {msg}
        </div>
      )}

      <div className="space-y-4">
        <Input
          placeholder="Nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="NPM"
          value={npm}
          onChange={(e) => setNpm(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-9 w-full rounded-md border bg-transparent px-3 text-sm"
        >
          <option value="MAHASISWA">Mahasiswa</option>
          <option value="DOSEN">Dosen</option>
        </select>

        <Button
          className="w-full"
          variant="primary"
          onClick={submit}
          disabled={loading || !name || !npm}
        >
          {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
        </Button>
      </div>
    </AuthCard>
  );
}