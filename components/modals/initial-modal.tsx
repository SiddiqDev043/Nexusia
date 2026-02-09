"use client"

import axios from "axios";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(1, { message: "Diisi dulu lah nama grub nya." }),
  imageUrl: z.string().min(1, { message: "Gambar Grub wajib Diisi." }),
})

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values);

      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  if (!isMounted) return null

  return (
    <Dialog open>
      <DialogContent className="z-[60] p-0 overflow-hidden">
        <div className="w-full max-w-lg rounded-lg bg-white text-black">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              CUSTOM GRUB DISINI
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Buat Grub disini kayak nama dan image yang bisa selalu diubah nantinya
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-2 uppercase text-xs font-bold text-zinc-500">
                        Nama Grub
                      </FormLabel>
                      <FormControl>
                        <input
                          disabled={isLoading}
                          className="w-full rounded-md bg-zinc-300/50 px-3 py-2 border-0 focus-visible:outline-none focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter Group Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary" disabled={isLoading}>
                  Buat Sekarang
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
