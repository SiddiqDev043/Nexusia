import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses?.[0]?.emailAddress ?? "";
  if (!email) return null;

  const account = await db.account.findUnique({ where: { email } });
  if (!account) return null;

  if (!account.verifiedAt) return null;

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  return profile; 
};