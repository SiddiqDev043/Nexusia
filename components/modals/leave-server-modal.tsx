"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";



export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          z-[60] p-0 overflow-hidden
          border-0 bg-transparent shadow-none
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          duration-300
        "
      >
        {/* CAPEK KALI ANJIRR NGURUSIN STYLING CARD KELUAR INI */}
        <div className="relative mx-auto w-full sm:max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#313338]/95 text-white shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="aurora aurora-1" />
              <div className="aurora aurora-2" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.12) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
            </div>
            <div className="relative px-4 sm:px-6 pt-5 sm:pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#2B2D31]/70">
                  <div className="h-5 w-5 rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400" />
                </div>
                <div className="flex-1">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                      Keluar Server
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-zinc-300">
                      Kenapa keluar bang? Yakin mau keluar dari{" "}
                      <span className="font-semibold text-white">{server?.name}</span>?
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </div>
            </div>
            <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="relative px-4 sm:px-6 py-4 sm:py-5">
              <div className="rounded-xl border border-white/10 bg-[#2B2D31]/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.65)]" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Akses kamu ke channel & member list akan dicabut.
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Kamu tetap bisa join lagi kalau punya invite. Riwayat chat/file tidak hilang.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-[11px] text-zinc-500">
                Kalau kamu cuma ingin “mute” notifikasi, lebih aman atur notification settings.
              </div>
            </div>
            <div className="relative flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-[#2B2D31]/40 px-4 sm:px-6 py-4">
              <Button
                disabled={isLoading}
                type="button"
                onClick={onClose}
                variant="ghost"  
                className="w-full sm:w-auto group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 transition active:scale-[0.98]"
              >
                Batal
              </Button>
              <Button
                disabled={isLoading}
                type="button"  //fungsi button keluar
                variant="primary"
                onClick={onClick}
                className="w-full sm:w-auto group relative overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 transition active:scale-[0.98]"
              >
                <span className="relative z-10">Keluar</span>
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                  <span className="absolute -inset-6 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-2xl" />
                </span>
              </Button>
            </div>
          </div>
      </DialogContent>
    </Dialog>

  )
}
