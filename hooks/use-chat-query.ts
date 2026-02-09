import { useEffect } from "react";
import qs from "query-string";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  const fetchMessages = async ({ pageParam }: { pageParam: string | null }) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
      }
    }, { skipNull: true });

    const res = await fetch(url);
    return res.json();
  };

  const query = useInfiniteQuery({
    queryKey: [queryKey],
    initialPageParam: null,
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => {
      console.log("nextCursor:", lastPage?.nextCursor);
      return lastPage?.nextCursor ?? undefined;
    },
    refetchInterval: isConnected ? false : 1000,
  });

  useEffect(() => {
    if (!socket) return;

    socket.on("message:new", () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    });

    socket.on("message:update", () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    });

    socket.on("message:delete", () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    });

    return () => {
      socket.off("message:new");
      socket.off("message:update");
      socket.off("message:delete");
    };
  }, [socket, queryClient, queryKey]);

  return query;
};
