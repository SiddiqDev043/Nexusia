import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile = await initialProfile();
  if (!profile) return redirect("/sign-in");

  const account = await db.account.findFirst({
    where: { clerkUserId: profile.userId },
  });

  if (!account) return redirect("/sign-in");

  if (account.role === "ADMIN") {
    const server = await db.server.findFirst({
      where: {
        members: { some: { profileId: profile.id } },
      },
    });

    if (server) {
      return redirect(`/server/${server.id}`);
    }

    return <InitialModal />;
  }

  return redirect("/servers/join");
};

export default SetupPage;