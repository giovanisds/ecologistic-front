import { useMutation, useQuery } from "@tanstack/react-query";

import { createUseGetPointsKey } from "./keys";

import { apiMaps } from "../../libs/axios";
import parseResponseData from "../../utils/parsers/parseResponseData";

const useGetPoints = (userKey) => {
  return useQuery({
    queryKey: createUseGetPointsKey(userKey),
    queryFn: () => apiMaps.get(`/api/ponto/${userKey}`).then(parseResponseData),
  });
};

const useSavePoint = () => {
  return useMutation({
    mutationFn: (payload) =>
      apiMaps.post(`/api/ponto`, payload).then(parseResponseData),
  });
};

export { useGetPoints, useSavePoint };
