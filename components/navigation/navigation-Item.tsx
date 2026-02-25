"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
}

export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    let parsedImageUrl: string | null = null;
    try {
        if (imageUrl?.startsWith("{")) {
            const parsed = JSON.parse(imageUrl);
            parsedImageUrl = parsed.url;
        } else {
            parsedImageUrl = imageUrl;
        }
    } catch (err) {
        console.warn("NavigationItem: gagal parse imageUrl", imageUrl, err);
        parsedImageUrl = null;
    }

    const onClick = () => {
        router.push(`/server/${id}`);
    }

    return (
        <ActionTooltip 
            side="right"
            align="center"
            label={name}
        >
            <button
                onClick={onClick}
                className="group relative flex items-center"
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )}/>
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    {parsedImageUrl && (
                        <Image
                            src={parsedImageUrl}
                            alt={name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>
            </button>
        </ActionTooltip>
    )
}
