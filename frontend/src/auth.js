/**
 * auth.js: Auth utilities
 *
 * If we're concerned about browser support with fetch, Github
 *   wrote its own polyfill:  https://github.com/github/fetch.
 */
import { API_ENDPOINTS } from "./constants/links";

/**
 * TOKEN UTILITIES
 */
function token_get() {
  return sessionStorage.getItem("token") ?? localStorage.getItem("token");
}
function token_set(token, remember = true) {
  if (remember) localStorage.setItem("token", token);
  else sessionStorage.setItem("token", token);
}
function token_clear() {
  sessionStorage.removeItem("token");
  localStorage.removeItem("token");
}

/**
 * GENERAL API CALL UTIL
 */
async function api_call(endpoint, data = {}) {
  const body = [];
  Object.keys(data).forEach((key) =>
    body.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
  );

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "bearer " + token_get(),
      },
      body: body.join("&"),
    });
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * SPECIFIC API CALLS
 */
async function api_validtoken() {
  if (!token_get()) return false;

  const res = await api_call(API_ENDPOINTS.TOKEN);
  return res;
}
async function api_login({ email, password }) {
  const res = await api_call(API_ENDPOINTS.LOGIN, { email, password });
  return res;
}

async function api_signup({ name, email, password }) {
  const res = await api_call(API_ENDPOINTS.SIGNUP, { name, email, password });
  return res && !res.error;
}

export { token_get, token_set, token_clear, api_validtoken, api_login, api_signup };
