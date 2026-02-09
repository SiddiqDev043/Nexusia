"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const safeData = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!e.key) return;

      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({ id, type }: { id: string; type: "channel" | "member" }) => {
    setOpen(false);

    const serverId = (params as any)?.serverId;
    if (!serverId) return;

    if (type === "member") {
      router.push(`/server/${serverId}/conversations/${id}`);
      return;
    }

    router.push(`/server/${serverId}/channels/${id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`
          group w-full rounded-xl px-3 py-2.5
          flex items-center gap-x-2
          transition
          border border-emerald-950/10 dark:border-emerald-400/10
          bg-gradient-to-r from-emerald-950/[0.04] to-transparent
          dark:from-emerald-400/[0.06] dark:to-transparent
          hover:from-emerald-950/[0.07] dark:hover:from-emerald-400/[0.09]
          hover:bg-zinc-700/5 dark:hover:bg-zinc-700/30
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-emerald-500/30 dark:focus-visible:ring-emerald-400/30
        `}
      >
        <span
          className={`
            inline-flex h-8 w-8 items-center justify-center rounded-lg
            bg-emerald-950/[0.05] dark:bg-emerald-400/[0.08]
            border border-emerald-950/10 dark:border-emerald-400/10
            transition
            group-hover:bg-emerald-950/[0.07] dark:group-hover:bg-emerald-400/[0.11]
          `}
        >
          <Search className="h-4 w-4 text-emerald-700/80 dark:text-emerald-300/80" />
        </span>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Search
          </span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          </span>
        </div>
        <kbd
          className={`
            ml-auto inline-flex h-6 select-none items-center gap-1 rounded-md px-2
            border border-emerald-950/10 dark:border-emerald-400/10
            bg-white/50 dark:bg-zinc-950/40
            text-[10px] font-mono font-medium
            text-zinc-600 dark:text-zinc-300
          `}
        >
          <span className="text-[10px]">CTRL</span>
          <span className="text-[10px]">K</span>
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <h2 className="sr-only">Search</h2>
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10" />
            <div className="absolute -bottom-24 left-1/3 h-48 w-72 rounded-full bg-emerald-900/10 blur-3xl dark:bg-emerald-950/30" />
          </div>

          <CommandInput placeholder="Cari semua forum dan anggota" />
          <CommandList className="py-1">
            <CommandEmpty>Tidak menemukan hasil</CommandEmpty>

            {safeData.map(({ label, type, data: items }) => {
              if (!items?.length) return null;

              return (
                <CommandGroup key={label} heading={label}>
                  {items.map(({ id, icon, name }) => (
                    <CommandItem
                      key={id}
                      onSelect={() => onClick({ id, type })}
                      className={`
                        flex items-center gap-2 rounded-xl px-3 py-2.5
                        transition
                        data-[selected=true]:bg-emerald-950/10 dark:data-[selected=true]:bg-emerald-400/10
                      `}
                    >
                      <span className="shrink-0">{icon}</span>
                      <span className="truncate">{name}</span>
                      <span className="ml-auto text-[10px] text-zinc-400 dark:text-zinc-500">
                        Enter
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
};
