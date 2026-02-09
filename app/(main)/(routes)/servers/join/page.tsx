"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinServerPage() {
  const [invite, setInvite] = useState("");
  const router = useRouter();

  const joinServer = async () => {
    let code = invite.trim();

    try {
      const url = new URL(code);
      code = url.pathname.split("/").pop() || code;
    } catch {
    }

    if (!code) {
      alert("Invite is required");
      return;
    }

    const res = await fetch("/api/servers/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/server/${data.serverId}`);
    } else {
      const msg = await res.text();
      alert(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>Masukkan Link/Kode Invite Server</h1>
      <input
        value={invite}
        onChange={(e) => setInvite(e.target.value)}
        className="border p-2 my-2"
        placeholder="Link atau kode invite"
      />
      <button
        onClick={joinServer}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Join Server
      </button>
    </div>
  );
}