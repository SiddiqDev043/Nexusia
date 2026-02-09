"use client";

import dynamic from "next/dynamic";
import type React from "react";
import { UserButton as UserButtonType } from "@clerk/nextjs";

// Ambil tipe props dari UserButton versi kamu
type Props = React.ComponentProps<typeof UserButtonType>;

const UserButton = dynamic<Props>(
  () => import("@clerk/nextjs").then((m) => m.UserButton),
  { ssr: false }
);

export default function UserButtonClient(props: Props) {
  return <UserButton {...props} />;
}