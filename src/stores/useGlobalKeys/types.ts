export type Key = string;

export type GlobalState = {
  userKey: Key;
  setUserKey: (payload: Key) => void;
  userName: Key;
  setUserName: (payload: Key) => void;
};
