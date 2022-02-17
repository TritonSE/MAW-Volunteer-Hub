/**
 * auth.js: Auth utilities
 */
import { API_ENDPOINTS } from "./constants/links";

/**
 * TOKEN UTILITIES
 */
function token_get() {
  return sessionStorage.getItem("token") ?? localStorage.getItem("token");
}
function token_set(token, remember = false) {
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
async function api_call(
  endpoint,
  data = {},
  method = "POST",
  type = "application/x-www-form-urlencoded"
) {
  const options = {
    method,
    headers: {
      Authorization: "bearer " + token_get(),
    },
  };
  if (type === "application/x-www-form-urlencoded") {
    options.headers["Content-Type"] = type;
  }
  if (data && Object.keys(data)) {
    if (type === "multipart/form-data") options.body = new FormData();
    else options.body = new URLSearchParams();
    Object.keys(data).forEach((key) => options.body.append(key, data[key]));
  }

  try {
    const res = await fetch(endpoint, options);
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * TOKEN VALIDATION
 */
async function api_validtoken() {
  if (!token_get()) return false;

  const res = await api_call(API_ENDPOINTS.TOKEN);
  return res && res.valid;
}

/**
 * LOGIN/SIGNUP
 */
async function api_login({ email, password }) {
  const res = await api_call(API_ENDPOINTS.LOGIN, { email, password });
  return (res ?? {}).token;
}

async function api_signup({ name, email, password }) {
  const res = await api_call(API_ENDPOINTS.SIGNUP, { name, email, password });
  return res && !res.error;
}

/**
 * FILES
 */
async function api_file_upload(file, name, category) {
  const res = await api_call(
    API_ENDPOINTS.FILE_UPLOAD,
    { file, name, category },
    "POST",
    "multipart/form-data"
  );
  return res && !res.error;
}

async function api_file_display(id) {
  const res = await api_call(API_ENDPOINTS.FILE_DISPLAY, { id }, "GET");
  return res && !res.error;
}

async function api_file_delete(id) {
  const res = await api_call(API_ENDPOINTS.FILE_DELETE, { id }, "DELETE");
  return res && !res.error;
}

async function api_file_update(id) {
  const res = await api_call(API_ENDPOINTS.FILE_UPDATE, { id }, "PATCH", "multipart/form-data");
  return res && !res.error;
}

/**
 * CATEGORIES
 */
async function api_category_delete(category) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_DELETE}/${category}`, null, "DELETE");
  return res && !res.error;
}

async function api_category_all(parent) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_ALL}/${parent}`, null, "GET");
  return res;
}

async function api_category_one(category) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_ONE}/${category}`, null, "GET");
  return res;
}

async function api_category_create(name, parent) {
  const res = await api_call(API_ENDPOINTS.CATEGORY_CREATE, {
    name,
    parent,
  });
  return res && !res.error;
}

async function api_category_update(category, name) {
  const res = await api_call(
    `${API_ENDPOINTS.CATEGORY_UPDATE}/${category}`,
    { updated_name: name },
    "PATCH"
  );
  return res && !res.error;
}

export {
  token_get,
  token_set,
  token_clear,
  api_validtoken,
  api_login,
  api_signup,
  api_file_upload,
  api_file_display,
  api_file_delete,
  api_file_update,
  api_category_delete,
  api_category_all,
  api_category_one,
  api_category_create,
  api_category_update,
};
