import { currentProfile } from "./current-profile";
import { db } from "./db";

export async function currentAccount() {
  const profile = await currentProfile();
  if (!profile) return null;

  return db.account.findFirst({
    where: { email: profile.email },
  });
}