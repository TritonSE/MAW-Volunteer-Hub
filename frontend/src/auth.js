/**
 * auth.js: Auth utilities
 */
import { API_ENDPOINTS } from "./constants/links";

/**
 * GENERAL API CALL UTILS
 */
async function api_call(
  endpoint,
  { data = null, method = "POST", type = "application/x-www-form-urlencoded", blob = false } = {}
) {
  const options = {
    method,
    headers: {},
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
    return await (blob ? res.blob() : res.json());
  } catch {
    return null;
  }
}

/**
 * TOKEN VALIDATION
 */
async function api_validtoken() {
  const res = await api_call(API_ENDPOINTS.TOKEN);
  return res;
}

/**
 * LOGIN/SIGNUP
 */
async function api_login({ email, password, remember }) {
  const res = await api_call(API_ENDPOINTS.LOGIN, { data: { email, password, remember } });
  return (res ?? {}).success;
}

async function api_signup({ name, email, password }) {
  const res = await api_call(API_ENDPOINTS.SIGNUP, { data: { name, email, password } });
  return res && !res.error;
}

async function api_signout() {
  const res = await api_call(API_ENDPOINTS.SIGNOUT);
  return res && !res.error;
}

/**
 * FILES
 */
async function api_file_upload(file, name, category) {
  const res = await api_call(API_ENDPOINTS.FILE_UPLOAD, {
    data: { file, name, category },
    method: "POST",
    type: "multipart/form-data",
  });
  return res && !res.error;
}

async function api_file_display(id) {
  const res = await api_call(`${API_ENDPOINTS.FILE_DISPLAY}/${id}`, { method: "GET", blob: true });
  return res;
}

async function api_file_delete(id) {
  const res = await api_call(`${API_ENDPOINTS.FILE_DELETE}/${id}`, { method: "DELETE" });
  return res && !res.error;
}

async function api_file_update(id, file, name) {
  const res = await api_call(`${API_ENDPOINTS.FILE_UPDATE}/${id}`, {
    data: { file, updated_file_name: name },
    method: "PATCH",
    type: "multipart/form-data",
  });
  return res && !res.error;
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
  return res && !res.error;
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
  return res && !res.error;
}

async function api_category_update(category, name) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_UPDATE}/${category}`, {
    data: { updated_name: name },
    method: "PATCH",
  });
  return res && !res.error;
}

async function api_category_download(id) {
  const res = await api_call(`${API_ENDPOINTS.CATEGORY_DOWNLOAD}/${id}`, {
    method: "GET",
    blob: true,
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
 * USER / PROFILE PICTURES
 */
async function api_user(id) {
  const res = await api_call(`${API_ENDPOINTS.USER}/${id}`, { method: "GET" });
  return res;
}

async function api_pfp_upload(pfp, crop) {
  const res = await api_call(API_ENDPOINTS.PFP_UPLOAD, {
    data: { pfp, crop },
    method: "POST",
    type: "multipart/form-data",
  });
  return res;
}

export {
  api_validtoken,
  api_login,
  api_signup,
  api_signout,
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
  api_pfp_upload,
};
