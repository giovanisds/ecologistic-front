import axios from "axios";

import { setupInterceptors } from "./interceptors";

export const apiMaps = axios.create({
  baseURL: "https://vulnerable-heida-giovanisds-9e823a5b.koyeb.app",
});
setupInterceptors(apiMaps);
