import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";

const MainPage = async () => {
  const profile = await initialProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: { profileId: profile.id }
      }
    }
  });

  if (server) {
    redirect(`/server/${server.id}`);
  }

  redirect("/"); 
};

export default MainPage;