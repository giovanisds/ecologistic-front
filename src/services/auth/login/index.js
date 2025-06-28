import { useMutation } from "@tanstack/react-query";
import { apiMaps } from "../../../libs/axios";
import parseResponseData from "../../../utils/parsers/parseResponseData";

const login = ({ email, senha }) =>
  apiMaps.post("/api/login", { email, senha }).then(parseResponseData);

const signUp = ({ nome, email, senha }) =>
  apiMaps.post("/api/users", { nome, email, senha }).then(parseResponseData);

const useLogin = () =>
  useMutation({
    mutationFn: login,
  });

const useSignUp = () =>
  useMutation({
    mutationFn: signUp,
  });

export { useLogin, useSignUp };
