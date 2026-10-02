import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const client = createClient<paths>({ baseUrl: "http://127.0.0.1:8000" });

// Add interceptor to attach JWT token
client.use({
  onRequest({ request }) {
    const token = localStorage.getItem("access_token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  }
});
