"use client"

import qs from "query-string";
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



export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        }
      })

      await axios.delete(url);

      onClose();
      router.refresh();
      router.push(`/server/${server?.id}`);
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/45" />
          </div>
          <div className="relative px-4 sm:px-6 pt-5 sm:pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#2B2D31]/70">
                <div className="h-5 w-5 rounded-md bg-gradient-to-br from-rose-400 to-orange-400" />
              </div>
              <div className="flex-1">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold tracking-tight">
                    Hapus Forum Permanen
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-zinc-300">
                    Ini aksi <span className="font-semibold text-white">tidak bisa dibatalkan</span>.
                    Forum diskusi{" "}
                    <span className="font-semibold text-white">
                      #{channel?.name}
                    </span>{" "}
                    akan dihapus permanen.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>
          <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="relative px-4 sm:px-6 py-4 sm:py-5 space-y-3">
            <div className="rounded-xl border border-white/10 bg-[#2B2D31]/60 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.65)]" />
                <div>
                  <p className="text-sm font-medium text-white">
                    Kamu benar-benar yakin ingin menghapus forum?
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Semua file didalamnya akan ikut terhapus dari sistem.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-zinc-500">
              Semoga harimu tidak menyenangkan dan senin terus.
            </div>
          </div>
          <div className="relative flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 bg-[#2B2D31]/40 px-4 sm:px-6 py-4">
            <Button
              disabled={isLoading}
              type="button"
              onClick={onClose}
              variant="ghost"
              className="
                w-full sm:w-auto
                rounded-lg px-4 py-2 text-sm font-semibold
                text-zinc-200 hover:text-white
                hover:bg-white/5
              "
            >
              Batal
            </Button>
            <Button
              disabled={isLoading || !server?.id}
              type="button"
              variant="primary"
              onClick={onClick}
              className="
                w-full sm:w-auto group relative overflow-hidden
                rounded-lg px-4 py-2 text-sm font-semibold text-white
                bg-gradient-to-r from-rose-500 to-orange-500
                hover:opacity-95 transition active:scale-[0.98]
              "
            >
              <span className="relative z-10">
                {isLoading ? "Menghapus..." : "Hapus Permanen"}
              </span>
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <span className="absolute -inset-6 bg-gradient-to-r from-rose-500/20 to-orange-500/20 blur-2xl" />
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
