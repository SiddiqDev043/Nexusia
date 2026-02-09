"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface ServerMemberProps {
    member: Member & { Profile: Profile };
    server: Server;
}
//icon role untuk anggota/member
const roleIconMap = {
    [MemberRole.MAHASISWA]: null,
    [MemberRole.DOSEN]: <ShieldCheck className="h-4 w-4 ml-2 text-green-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
}

export const ServerMember = ({
    member,
    server
}: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/server/${params?.serverId}/conversations/${member.id}`)

    }

    const textClass = cn(
    "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
    params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
  );

return (
    <button
        onClick={onClick}
        className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
        )}
        >
        <UserAvatar
            src={member.Profile.imageUrl}
            className="h-8 w-8 md:h-8 md:w-8"
        />
        <div className="min-w-0 flex-1 flex flex-col gap-0.5">
            <p className={cn(textClass, "truncate leading-tight",
                params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {member.Profile.name}
            </p>
                {member.Profile.npm && (
                    <p
                        className={cn(
                            textClass,
                            "text-xs font-medium text-zinc-400 dark:text-zinc-500 leading-tight",
                            params?.memberId === member.id
                        )}
                    >
                        {member.Profile.npm}
                    </p>
                )}
        </div>
        {icon}
    </button>
  );
};