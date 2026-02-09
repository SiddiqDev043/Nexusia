import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ServerSidebar } from "@/components/server/server-sidebar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
};

const ServerIdLayout = async ({ children, params }: Props) => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const { serverId } = await params;

  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findFirst({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="h-full w-full min-w-0">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>

      <main className="h-full w-full md:pl-60 min-w-0 flex flex-col min-h-0">
        {children}
      </main>
    </div>
  );
};

export default ServerIdLayout;
