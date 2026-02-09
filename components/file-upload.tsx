"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (value: string) => void;
  value?: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [mime, setMime] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setFileUrl(null);
      setMime(null);
      return;
    }

    try {
      if (value.startsWith("{")) {
        const parsed = JSON.parse(value);
        setFileUrl(parsed.url ?? null);
        setMime(parsed.type ?? null);
      } else {
        setFileUrl(value);
        setMime(null);
      }
    } catch {
      setFileUrl(null);
      setMime(null);
    }
  }, [value]);

  const isPdf =
    mime === "application/pdf" ||
    fileUrl?.toLowerCase().endsWith(".pdf");

  const isImage =
    mime?.startsWith("image/") ||
    /\.(png|jpg|jpeg|gif|webp)$/i.test(fileUrl ?? "");

  if (fileUrl && isImage) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={fileUrl}
          alt="Upload"
          className="rounded-full object-cover"
        />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (fileUrl && isPdf) {
    return (
      <div className="relative flex items-center gap-2 p-3 mt-2 rounded-md bg-zinc-100 dark:bg-zinc-900 border">
        <FileIcon className="h-10 w-10 text-green-500" />
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline truncate max-w-[260px]"
        >
          Buka PDF
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-3 -right-2"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone<OurFileRouter, typeof endpoint>
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const file = res?.[0];

        if (file?.url && file?.type) {
          onChange(
            JSON.stringify({
              url: file.url,
              type: file.type,
            })
          );
        }
      }}
      onUploadError={(error) => {
        console.error("UPLOAD ERROR:", error);
      }}
    />
  );
};
