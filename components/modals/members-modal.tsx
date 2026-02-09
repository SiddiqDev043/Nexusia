"use client";

import axios from "axios";
import qs from "query-string";
import { useState } from "react";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const roleMeta: Record<
  MemberRole,
  { label: string; badge: string; icon: React.ReactNode }
> = {
  MAHASISWA: {
    label: "Mahasiswa",
    badge: "bg-white/5 text-white/70 border-white/10",
    icon: null,
  },
  DOSEN: {
    label: "Dosen",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    icon: <ShieldCheck className="h-4 w-4 text-emerald-300" />,
  },
  ADMIN: {
    label: "Admin",
    badge: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    icon: <ShieldAlert className="h-4 w-4 text-rose-300" />,
  },
};

export const MembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const [loadingId, setLoadingId] = useState("");
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: { serverId: server?.id },
      });

      const response = await axios.patch(url, { role });

      onOpen("members", { server: response.data });
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };
  const membersCount = server?.members?.length ?? 0;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="z-[60] p-0 border-0 bg-transparent shadow-none">
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/90 text-white shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <DialogHeader className="relative px-6 pt-7 pb-4">
            <DialogTitle className="text-center text-xl font-semibold tracking-tight">
              Kelola Anggota
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-white/60">
              {membersCount} anggota
            </DialogDescription>
          </DialogHeader>
          <div className="relative px-3 pb-4">
            <ScrollArea className="max-h-[420px] pr-3">
              <div className="space-y-2 px-3">
                {server?.members?.map((member) => {
                  const isOwner = server?.profileId === member.profileId;
                  const isRowLoading = loadingId === member.id;
                  const meta = roleMeta[member.role];
                  return (
                    <div
                      key={member.id}
                      className="
                        group flex items-start gap-3 rounded-xl
                        border border-white/10 bg-white/[0.03]
                        px-3 py-3
                        hover:bg-white/[0.06]
                        transition
                      "
                    >
                      <UserAvatar src={member.Profile.imageUrl} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {member.Profile.name}
                          </p>
                          <span
                            className={[
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                              meta.badge,
                            ].join(" ")}
                          >
                            {meta.icon}
                            <span className="capitalize">{meta.label}</span>
                          </span>
                          {isOwner && (
                            <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 border border-emerald-500/20">
                              Owner
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-white/55">
                          <span className="text-white/70">NPM:</span>{" "}
                          {member.Profile.npm ?? "-"}
                          <span className="mx-2 text-white/20">•</span>
                          <span className="text-white/70">Email:</span>{" "}
                          {member.Profile.email}
                        </p>
                      </div>
                      {!isOwner && (
                        <div className="ml-2 flex items-center">
                          {isRowLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                          ) : (
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className="
                                    inline-flex h-9 w-9 items-center justify-center
                                    rounded-lg border border-white/10 bg-white/[0.04]
                                    text-white/70
                                    hover:bg-white/[0.08] hover:text-white
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500/30
                                    transition
                                  "
                                  aria-label="Aksi anggota"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                side="left"
                                align="start"
                                sideOffset={10}
                                className="z-[9999] w-52 border-white/10 bg-[#0B1220]/95 text-white shadow-xl backdrop-blur-xl"
                              >
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="flex items-center">
                                    <ShieldQuestion className="mr-2 h-4 w-4 text-white/70" />
                                    <span>Status</span>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuPortal>
                                    <DropdownMenuSubContent className="z-[9999] w-48 border-white/10 bg-[#0B1220]/95 text-white shadow-xl backdrop-blur-xl">
                                      <DropdownMenuItem
                                        onClick={() => onRoleChange(member.id, "DOSEN")}
                                        className="flex items-center"
                                      >
                                        <ShieldCheck className="mr-2 h-4 w-4 text-emerald-300" />
                                        DOSEN
                                        {member.role === "DOSEN" && (
                                          <Check className="ml-auto h-4 w-4 text-emerald-300" />
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onRoleChange(member.id, "MAHASISWA")
                                        }
                                        className="flex items-center"
                                      >
                                        <Shield className="mr-2 h-4 w-4 text-emerald-300" />
                                        MAHASISWA
                                        {member.role === "MAHASISWA" && (
                                          <Check className="ml-auto h-4 w-4 text-emerald-300" />
                                        )}
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                  onClick={() => onKick(member.id)}
                                  className="text-rose-300 focus:text-rose-200"
                                >
                                  <Gavel className="mr-2 h-4 w-4" />
                                  Keluarkan
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <div className="relative flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-xs text-white/50">
              ayo kick semua hahaha
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
