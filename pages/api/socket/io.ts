import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: {
      server: NetServer & {
        io?: ServerIO;
      };
    };
  }
) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...");

    const io = new ServerIO(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
  }

  res.end();
}