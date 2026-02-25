"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        Profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "MAHASISWA": null,
    "DOSEN": <ShieldCheck className="h-4 w-4 ml-2 text-green-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const [showActions, setShowActions] = useState(false);
    const pressTimer = useRef<NodeJS.Timeout | null>(null);

    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const handleTouchStart = () => {
        pressTimer.current = setTimeout(() => {
            setShowActions(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    useEffect(() => {
        if (showActions) {
            const timer = setTimeout(() => {
                setShowActions(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showActions]);

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return;
        }

        router.push(`/server/${params?.serverId}/conversations/${member.id}`);
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          const url = qs.stringifyUrl({
            url: `${socketUrl}/${id}`,
            query: socketQuery,
          })

          await axios.patch(url, values);

          form.reset();
          setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        form.reset({
            content: content,
        })
    }, [content]);

    let imageUrl: string | null = null;
    let fileType: string | null = null;

    if (fileUrl) {
        try {
            if (fileUrl.trim().startsWith("{")) {
                const parsed = JSON.parse(fileUrl);
                imageUrl = parsed.url;
                fileType = parsed.type;
            } else {
                imageUrl = fileUrl;
                const ext = fileUrl.split(".").pop()?.toLowerCase();
                if (ext === "pdf") fileType = "application/pdf";
                else fileType = `image/${ext}`;
            }
        } catch {
            imageUrl = null;
            fileType = null;
        }
    }

    const isImage = imageUrl && fileType?.startsWith("image/");
    const isPDF = fileType === "application/pdf";

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isDosen = currentMember.role === MemberRole.DOSEN;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isDosen || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;

    return (
        <div className="relative w-full px-4 py-1">
            <div
                className="group relative flex gap-x-4 items-start w-full rounded-xl p-3 transition-all duration-200 hover:bg-zinc-200/40 dark:hover:bg-zinc-900/40 hover:backdrop-blur-[2px]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => setShowActions(false)}
            >
                <div onClick={onMemberClick} className="shrink-0 pt-0.5">
                    <UserAvatar
                        src={member.Profile.imageUrl}
                        className="ring-1 ring-green-400/40 group-hover:ring-green-400/70 transition"
                    />
                </div>

                <div className="flex flex-col w-full min-w-0">
                    <div className="flex items-center justify-between gap-x-2">
                        <div className="flex items-center gap-x-2 min-w-0">
                            <p onClick={onMemberClick} className="truncate font-medium text-sm text-zinc-900 dark:text-zinc-100 hover:text-green-600 dark:hover:text-green-400 cursor-pointer transition">
                                {member.Profile.name}
                                <span className="ml-2 text-xs font-normal text-green-500/90">
                                    #{member.Profile.npm}
                                </span>
                            </p>
                            <ActionTooltip label={member.role}>
                                <span onClick={onMemberClick} className="text-green-500 dark:text-green-400 shrink-0">
                                    {roleIconMap[member.role]}
                                </span>
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-500/80">
                            {timestamp}
                        </span>
                    </div>

                    {isImage && imageUrl && (
                        <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                                src={imageUrl}
                                alt={content}
                                fill
                                className="object-cover"
                            />
                        </a>
                    )}

                    {isPDF && imageUrl && (
                        <div className="relative inline-flex w-fit items-center gap-2 p-3 mt-2 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            <FileIcon className="h-10 w-10 text-green-500" strokeWidth={2.2} />
                            <a
                                href={imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-zinc-800 dark:text-zinc-200 hover:underline truncate max-w-[260px]"
                            >
                                Buka File PDF
                            </a>
                        </div>
                    )}

                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (Diedit)
                                </span>
                            )}
                        </p>
                    )}

                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form 
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <div className="relative w-full">
                                                        <Input
                                                            disabled={isLoading}
                                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                            placeholder="Edit Pesan"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={isLoading} size="sm" variant="primary">
                                        Simpan
                                    </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Pencet ESC untuk membatalkan, enter untuk menyimpan.
                            </span>
                        </Form>
                    )}
                </div>

                {(canDeleteMessage || canEditMessage) && (
                <div
                    className={cn(
                        "items-center gap-x-2 absolute p-1 -top-2 right-2 bg-white dark:bg-zinc-800 border rounded-sm",
                        showActions
                          ? "flex"
                          : "hidden md:flex md:group-hover:flex"
                    )}
                >
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <div className="p-1 rounded cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                                <Edit
                                    onClick={() => setIsEditing(true)}
                                    className="w-4 h-4 text-zinc-500 dark:text-zinc-300"
                                /> 
                            </div>
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Hapus">
                        <div className="p-1 rounded cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
                            <Trash 
                                onClick={() => onOpen("deleteMessage", {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery,
                                })}
                                className="w-4 h-4 text-zinc-500 dark:text-zinc-300"
                            />
                        </div> 
                    </ActionTooltip>
                </div>
                )}
            </div>
        </div>
    );
};