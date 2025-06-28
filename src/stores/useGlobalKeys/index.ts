import { create, StoreApi } from "zustand";
import { persist } from "zustand/middleware";

import { GlobalState, Key } from "./types";

const store = (set: StoreApi<GlobalState>["setState"]): GlobalState => {
  const setUserKey = (userKey: Key) =>
    set({
      userKey,
    });

  const setUserName = (userName: Key) =>
    set({
      userName,
    });

  return {
    userKey: ``,
    setUserKey,
    userName: ``,
    setUserName,
  };
};

export const useGlobalKeys = create<
  GlobalState,
  [["zustand/persist", GlobalState]]
>(
  persist(store, {
    name: `credentials`,
  })
);
