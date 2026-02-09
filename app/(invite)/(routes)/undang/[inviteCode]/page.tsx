import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const { inviteCode } = await params; 

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const profile = await currentProfile();
  if (!profile) redirect("/sign-in");

  if (!inviteCode) redirect("/sign-in");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    redirect(`/server/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: {
          profileId: profile.id,
        },
      },
    },
  });

  redirect(`/server/${server.id}`);
};

export default InviteCodePage;
