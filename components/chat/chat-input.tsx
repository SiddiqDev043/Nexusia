"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";



interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput = ({
    apiUrl,
    query,
    name,
    type,
}: ChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            let fileUrl: string | undefined;
            let fileType: string | undefined;

            const file = query?.file;

            if (file) {
                const parsed = JSON.parse(file);
                fileUrl = parsed.url;
                fileType = parsed.type;
            }

            await axios.post(url, {
                content: values.content,
                fileUrl,
                fileType,
            });

            form.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <div className="relative px-4 py-3">
                                <button
                                    type="button"
                                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                                >
                                    <Plus className="h-4 w-4 text-white dark:text-[#313338]" />
                                </button>
                                <Input
                                    disabled={isLoading}
                                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                    {...field}
                                />
                                <div className="absolute top-7 right-8">
                                    <EmojiPicker 
                                        onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                                    />
                                </div>
                            </div>
                        </FormControl>
                    </FormItem>
                )}
                />
            </form>
        </Form>

    )
}