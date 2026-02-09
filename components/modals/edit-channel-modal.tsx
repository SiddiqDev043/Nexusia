"use client"

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChannelType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useEffect } from "react";


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nama forum harus diisi lah." 
  }).refine(
    name => name !== "general",
    {
      message: "Nama forum tidak boleh 'general'"
    }
  ),
  type: z.nativeEnum(ChannelType)
})

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editChannel";
  const { channel, server } = data;


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    }
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [form, channel]);

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      });
      await axios.patch(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  const handleClose = () => {
    form.reset();
    onClose();
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="
          z-[60] p-0 border-0 bg-transparent shadow-none
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          duration-200
        "
      >
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/90 text-white shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <DialogHeader className="relative px-6 pt-7 pb-2">
            <DialogTitle className="text-center text-xl font-semibold tracking-tight">
              Edit Forum
            </DialogTitle>
          </DialogHeader>
          <div className="relative px-6 pb-6 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Nama Forum
                      </FormLabel>
                      <FormControl>
                        <input
                          disabled={isLoading}
                          placeholder="Enter Nama Forum bebas"
                          {...field}
                          className="
                            h-11 w-full rounded-xl
                            bg-white/[0.06] px-4 text-white
                            placeholder:text-white/30
                            border border-white/10
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40
                            focus-visible:ring-offset-0
                            disabled:opacity-60
                          "
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-rose-300" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Forum Type
                      </FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="
                              h-11 rounded-xl
                              bg-white/[0.06] text-white
                              border border-white/10
                              focus:ring-2 focus:ring-emerald-500/40
                              ring-offset-0 focus:ring-offset-0
                              capitalize
                            "
                          >
                            <SelectValue placeholder="Pilih tipe forum" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[9999]">
                          {Object.values(ChannelType).map((t) => (
                            <SelectItem key={t} value={t} className="capitalize">
                              {t.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs text-rose-300" />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-2 flex gap-2 px-0">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isLoading}
                    onClick={handleClose}
                    className="h-11 flex-1 rounded-xl bg-white/5 text-white hover:bg-white/10"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="
                      h-11 flex-1 rounded-xl
                      bg-emerald-500 text-black
                      hover:bg-emerald-400
                      disabled:opacity-60
                    "
                  >
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
