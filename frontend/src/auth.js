/**
 * auth.js: Auth utilities
 */
import axios from "axios";

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
 * GENERAL API CALL UTILS
 */
async function api_call(
  endpoint,
  {
    data = null,
    method = "POST",
    type = "application/x-www-form-urlencoded",
    blob = false,
    onProgress = null,
  } = {}
) {
  let has_attached = false;

  function progress_handler({ currentTarget }) {
    if (!has_attached) {
      has_attached = true;
      currentTarget.onprogress = (e) =>
        onProgress(e.total === 0 ? "indeterminate" : (e.loaded / e.total) * 100);
      currentTarget.onload = () => onProgress("done");
    }
  }

  const options = {
    method,
    url: endpoint,
    headers: {
      Authorization: "bearer " + token_get(),
    },
    responseType: blob ? "blob" : "json",
    onUploadProgress: onProgress ? (e) => onProgress((e.loaded / e.total) * 100) : null,
    onDownloadProgress: onProgress ? progress_handler : null,
  };
  if (type === "application/x-www-form-urlencoded") {
    options.headers["Content-Type"] = type;
  }
  if (data && Object.keys(data)) {
    if (type === "multipart/form-data") options.data = new FormData();
    else options.data = new URLSearchParams();
    Object.keys(data).forEach((key) => options.data.append(key, data[key]));
  }

  try {
    const res = await axios(options);
    return res && res.data ? res.data : null;
  } catch (e) {
    if (e.response && e.response.data && e.response.data.error) return e.response.data;
    return null;
  }
}

/**
 * TOKEN VALIDATION
 */
async function api_validtoken() {
  if (!token_get()) return false;

  const res = await api_call(API_ENDPOINTS.TOKEN);
  return res;
}

/**
 * LOGIN/SIGNUP
 */
async function api_login({ email, password }) {
  const res = await api_call(API_ENDPOINTS.LOGIN, { data: { email, password } });
  return res ?? {};
}

async function api_signup({ name, email, password }) {
  const res = await api_call(API_ENDPOINTS.SIGNUP, { data: { name, email, password } });
  return res && !res.error;
}

/**
 * FILES
 */
async function api_file_upload(file, name, category, onProgress) {
  const res = await api_call(API_ENDPOINTS.FILE_UPLOAD, {
    data: { file, name, category },
    method: "POST",
    type: "multipart/form-data",
    onProgress,
  });
  return res;
}

async function api_file_display(id, onProgress) {
  const res = await api_call(`${API_ENDPOINTS.FILE_DISPLAY}/${id}`, {
    method: "GET",
    blob: true,
    onProgress,
  });
  return res;
}

async function api_file_delete(id) {
  const res = await api_call(`${API_ENDPOINTS.FILE_DELETE}/${id}`, { method: "DELETE" });
  return res;
}

async function api_file_update(id, file, name, onProgress) {
  const res = await api_call(`${API_ENDPOINTS.FILE_UPDATE}/${id}`, {
    data: { file, updated_file_name: name },
    method: "PATCH",
    type: "multipart/form-data",
    onProgress,
  });
  return res;
}

async function api_file_search(name) {
  const res = await api_call(`${API_ENDPOINTS.FILE_SEARCH}/${name}`, { method: "GET" });
  return res;
}

async function api_file_all() {
  const res = await api_call(`${API_ENDPOINTS.FILE_ALL}`, { method: "GET" });
  return res;
}

/**
 * CATEGORIES
 */
async function api_category_delete(category) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_DELETE}/${category}`, { method: "DELETE" });
  return res;
}

async function api_category_all(parent) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_ALL}${parent ? "/" + parent : ""}`, {
    method: "GET",
  });
  return res;
}

async function api_category_one(category) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_ONE}/${category}`, { method: "GET" });
  return res;
}

async function api_category_create(name, parent) {
  const res = await api_call(API_ENDPOINTS.CATEGORY_CREATE, {
    data: {
      name,
      parent,
    },
  });
  return res;
}

async function api_category_update(category, name) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_UPDATE}/${category}`, {
    data: { updated_name: name },
    method: "PATCH",
  });
  return res;
}

async function api_category_download(id, onProgress) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_DOWNLOAD}/${id}`, {
    method: "GET",
    blob: true,
    onProgress,
  });
  return res;
}

async function api_get_users() {
  const res = await api_call(`${API_ENDPOINTS.USER_ALL}`, {
    method: "GET",
  });
  return res;
}

async function api_verify_user(id) {
  const res = await api_call(`${API_ENDPOINTS.USER_VERIFY}/${id}`, {
    method: "PUT",
  });
  return res;
}
/**
 * USER
 */
async function api_user(id) {
  const res = await api_call(`${API_ENDPOINTS.USER}/${id}`, { method: "GET" });
  return res;
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
  api_file_search,
  api_file_all,
  api_category_delete,
  api_category_all,
  api_category_one,
  api_category_create,
  api_category_update,
  api_category_download,
  api_get_users,
  api_verify_user,
  api_user,
};
