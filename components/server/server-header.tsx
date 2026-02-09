"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { 
    ChevronDown, 
    LogOut, 
    PlusCircle, 
    Settings, 
    Trash, 
    UserPlus, 
    Users
} from "lucide-react";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
};

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isDosen = isAdmin || role === MemberRole.DOSEN;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none" 
                asChild
            >
                <button
                    className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {isDosen && (
                    <DropdownMenuItem
                     onClick={() => onOpen("undang", { server })}
                     className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer" 
                    >
                        Undang Rekan
                        <UserPlus className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("editServer", { server })}
                     className="px-3 py-2 text-sm cursor-pointer" //kustom style dropdownmenuitems
                    >
                        Kelola Server Grub
                        <Settings className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                     onClick={() => onOpen("members", { server })}
                     className="px-3 py-2 text-sm cursor-pointer" 
                    >
                        Kelola Anggota
                        <Users className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isDosen && (
                    <DropdownMenuItem
                     onClick={() => onOpen("createChannel")}
                     className="px-3 py-2 text-sm cursor-pointer" 
                    >
                        Buat Forum
                        <PlusCircle className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isDosen && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem
                     onClick={() => onOpen("deleteServer", { server })}
                     className="text-rose-500 px-3 py-2 text-sm cursor-pointer" 
                    >
                        Hapus Server
                        <Trash className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem
                     onClick={() => onOpen("leaveServer", { server })}
                     className="text-rose-500 px-3 py-2 text-sm cursor-pointer" 
                    >
                        Keluar Server
                        <LogOut className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}