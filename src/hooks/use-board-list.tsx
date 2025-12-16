"use client";

import { useTRPC, type RouterInputs } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export function useBoardList(input: RouterInputs["board"]["list"]) {
  const trpc = useTRPC();
  const { boardId } = useParams<{ boardId?: string }>();

  // --- Fetch boards ---
  const { data: boards, ...queryState } = useSuspenseQuery(
    trpc.board.list.queryOptions(input),
  );

  // --- Local UI state: open/closed boards ---
  const [openBoards, setOpenBoards] = useState<Record<string, boolean>>({});

  // --- Initialize open state based on URL / default board ---
  useEffect(() => {
    if (!boards) return;

    setOpenBoards(() => {
      const state: Record<string, boolean> = {};

      // If boardId exists in URL → only open that
      if (boardId) {
        boards.forEach((b) => {
          state[b.id] = b.id === boardId;
        });
        return state;
      }

      // No URL board → open the first one
      boards.forEach((b, index) => {
        state[b.id] = index === 0;
      });

      return state;
    });
  }, [boards, boardId]);

  // --- Toggle a board open/close ---
  const toggleBoard = useCallback((boardId: string) => {
    setOpenBoards((prev) => ({
      ...prev,
      [boardId]: !prev[boardId],
    }));
  }, []);

  // --- Merge open state into board list ---
  const boardsWithState = boards.map((b) => ({
    ...b,
    open: openBoards[b.id] ?? false,
  }));

  return {
    ...queryState,
    boards: boardsWithState,
    toggleBoard,
  };
}
