/**
 * auth.js: Auth utilities
 *
 * If we're concerned about browser support with fetch, Github
 *   wrote its own polyfill:  https://github.com/github/fetch.
 */
export default async function api_call(endpoint, data = {}) {
  const body = [];
  Object.keys(data).forEach((key) =>
    body.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
  );
  body.push("token=" + encodeURIComponent(localStorage.getItem("token")));

  try {
    const res = await fetch(`${endpoint}?${body.join("&")}`, { method: "POST" });
    return await res.json();
  } catch {
    return null;
  }
}
