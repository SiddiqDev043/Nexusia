import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ServerIdPageProps {
  params: Promise<{
    serverId: string;
  }>;
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const { serverId } = await params; 

  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: { name: "general" },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!server) {
    return redirect("/servers/join");
  }

  const initialChannel = server.channels[0];

  if (!initialChannel) {
    return redirect("/");
  }

  return redirect(`/server/${serverId}/channels/${initialChannel.id}`);
};

export default ServerIdPage;
