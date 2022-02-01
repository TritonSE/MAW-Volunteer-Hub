/**
 * auth.js: Auth utilities
 *
 * If we're concerned about browser support with fetch, Github
 *   wrote its own polyfill:  https://github.com/github/fetch.
 */
import { API_ENDPOINTS } from "./constants/links";

export default async function api_call(endpoint = API_ENDPOINTS.TOKEN, data = {}) {
  const body = [];
  Object.keys(data).forEach((key) =>
    body.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
  );
  body.push(
    "secret_token=" +
      encodeURIComponent(sessionStorage.getItem("token") ?? localStorage.getItem("token"))
  );

  try {
    const res = await fetch(`${endpoint}?${body.join("&")}`, { method: "POST" });
    return await res.json();
  } catch {
    return null;
  }
}
