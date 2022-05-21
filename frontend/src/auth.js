/**
 * auth.js: Auth utilities
 */
import axios from "axios";

import { API_ENDPOINTS } from "./constants/links";

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
    headers: {},
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
  const res = await api_call(API_ENDPOINTS.TOKEN);
  return res;
}

/**
 * LOGIN/SIGNUP
 */
async function api_login({ email, password, remember }) {
  return (
    (await api_call(API_ENDPOINTS.LOGIN, { data: { email, password, remember } })) ?? {
      error: "Unable to reach server, please try again.",
    }
  );
}

async function api_signup({ name, email, password }) {
  return (
    (await api_call(API_ENDPOINTS.SIGNUP, { data: { name, email, password } })) ?? {
      error: "Unable to reach server, please try again.",
    }
  );
}

async function api_signout() {
  const res = await api_call(API_ENDPOINTS.SIGNOUT);
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

/**
 * USER / PROFILE PICTURES
 */
async function api_user_info(id) {
  return api_call(`${API_ENDPOINTS.USER_INFO}/${id}`, { method: "GET" });
}

async function api_user_all() {
  return api_call(API_ENDPOINTS.USER_ALL, { method: "GET" });
}

async function api_user_verify(id) {
  return api_call(`${API_ENDPOINTS.USER_VERIFY}/${id}`, { method: "PUT" });
}

async function api_user_promote(id) {
  return api_call(`${API_ENDPOINTS.USER_PROMOTE}/${id}`, { method: "PUT" });
}

async function api_user_delete(id) {
  return api_call(`${API_ENDPOINTS.USER_DELETE}/${id}`, { method: "DELETE" });
}

async function api_user_updatepass(old_pass, new_pass) {
  return api_call(API_ENDPOINTS.USER_UPDATE_PASS, {
    method: "PUT",
    data: { old_pass, new_pass },
  });
}

async function api_user_edit(id) {
  return api_call(`${API_ENDPOINTS.USER_EDIT}/${id}`, { method: "PUT" });
}

async function api_pfp_upload(pfp, crop) {
  const res = await api_call(API_ENDPOINTS.PFP_UPLOAD, {
    data: { pfp, crop },
    method: "POST",
    type: "multipart/form-data",
  });
  return res;
}

async function api_update_roles(id, roles) {
  const res = await api_call(`${API_ENDPOINTS.SET_ROLES}/${id}`, {
    data: { roles },
    method: "PATCH",
    type: "application/json",
  });
  return res;
}

async function api_add_event(id, date, title, hours) {
  const res = await api_call(`${API_ENDPOINTS.ADD_EVENT}/${id}`, {
    data: { date, title, hours },
    method: "POST",
    type: "application/json",
  });
  return res;
}

async function api_edit_event(id, event_id, date, title, hours) {
  const res = await api_call(`${API_ENDPOINTS.EDIT_EVENT}/${id}/${event_id}`, {
    data: { date, title, hours },
    method: "PATCH",
    type: "application/json",
  });
  return res;
}

async function api_delete_event(id, event_id) {
  const res = await api_call(`${API_ENDPOINTS.DELETE_EVENT}/${id}/${event_id}`, {
    method: "DELETE",
    type: "application/json",
  });
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
  api_user_info,
  api_user_all,
  api_user_verify,
  api_user_promote,
  api_user_delete,
  api_user_updatepass,
  api_user_edit,
  api_pfp_upload,
  api_update_roles,
  api_add_event,
  api_edit_event,
  api_delete_event,
};
