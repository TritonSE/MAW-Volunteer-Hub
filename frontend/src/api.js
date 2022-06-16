/**
 * api.js: API interfacing
 */
import axios from "axios";
import qs from "qs";

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
    use_qs = false,
  } = {}
) {
  let has_attached = false;

  function progress_handler({ currentTarget }) {
    if (!has_attached) {
      has_attached = true;
      currentTarget.onprogress = (e) =>
        onProgress(e.total === 0 ? "indeterminate" : (e.loaded / e.total) * 100);
      currentTarget.onload = async () => onProgress("done");
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
    if (use_qs) options.data = qs.stringify(data);
    else {
      if (type === "multipart/form-data") options.data = new FormData();
      else options.data = new URLSearchParams();
      Object.keys(data).forEach((key) => options.data.append(key, data[key]));
    }
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
const api_validtoken = async () => (document.cookie ? api_call(API_ENDPOINTS.TOKEN) : false);

/**
 * LOGIN/SIGNUP
 */
const api_login = async ({ email, password, remember }) =>
  (await api_call(API_ENDPOINTS.LOGIN, { data: { email, password, remember } })) ?? {
    error: "Unable to connect to server, please try again.",
  };

const api_signup = async ({ name, email, password }) =>
  (await api_call(API_ENDPOINTS.SIGNUP, { data: { name, email, password } })) ?? {
    error: "Unable to connect to server, please try again.",
  };

const api_signout = async () => api_call(API_ENDPOINTS.SIGNOUT);

/**
 * FILES
 */
const api_file_upload = async (file, name, category, onProgress) =>
  api_call(API_ENDPOINTS.FILE_UPLOAD, {
    data: { file, name, category },
    method: "POST",
    type: "multipart/form-data",
    onProgress,
  });

const api_file_delete = async (id) =>
  api_call(`${API_ENDPOINTS.FILE_DELETE}/${id}`, { method: "DELETE" });

const api_file_update = async (id, file, name, onProgress) =>
  api_call(`${API_ENDPOINTS.FILE_UPDATE}/${id}`, {
    data: { file, updated_file_name: name },
    method: "PATCH",
    type: "multipart/form-data",
    onProgress,
  });

const api_file_search = async (name) =>
  api_call(`${API_ENDPOINTS.FILE_SEARCH}/${name}`, { method: "GET" });

const api_file_all = async () => api_call(`${API_ENDPOINTS.FILE_ALL}`, { method: "GET" });

/**
 * CATEGORIES
 */
const api_category_delete = async (category) =>
  api_call(`${API_ENDPOINTS.CATEGORY_DELETE}/${category}`, { method: "DELETE" });

const api_category_all = async (parent) =>
  api_call(`${API_ENDPOINTS.CATEGORY_ALL}${parent ? "/" + parent : ""}`, {
    method: "GET",
  });

const api_category_one = async (category) =>
  api_call(`${API_ENDPOINTS.CATEGORY_ONE}/${category}`, { method: "GET" });

const api_category_create = async (name, parent) =>
  api_call(API_ENDPOINTS.CATEGORY_CREATE, {
    data: {
      name,
      parent,
    },
  });

const api_category_update = async (category, name) =>
  api_call(`${API_ENDPOINTS.CATEGORY_UPDATE}/${category}`, {
    data: { updated_name: name },
    method: "PATCH",
  });

const api_category_download = async (id, onProgress) =>
  api_call(`${API_ENDPOINTS.CATEGORY_DOWNLOAD}/${id}`, {
    method: "GET",
    blob: true,
    onProgress,
  });

/**
 * USER / PROFILE PICTURES
 */
const api_user_info = (id) => api_call(`${API_ENDPOINTS.USER_INFO}/${id}`, { method: "GET" });

const api_user_all = () => api_call(API_ENDPOINTS.USER_ALL, { method: "GET" });

const api_user_verify = (id) => api_call(`${API_ENDPOINTS.USER_VERIFY}/${id}`, { method: "PUT" });

const api_user_promote = (id) => api_call(`${API_ENDPOINTS.USER_PROMOTE}/${id}`, { method: "PUT" });

const api_user_delete = (id) =>
  api_call(`${API_ENDPOINTS.USER_DELETE}/${id}`, { method: "DELETE" });

const api_user_updatepass = (old_pass, new_pass) =>
  api_call(API_ENDPOINTS.USER_UPDATE_PASS, {
    method: "PUT",
    data: { old_pass, new_pass },
  });

const api_user_edit = (id) => api_call(`${API_ENDPOINTS.USER_EDIT}/${id}`, { method: "PUT" });

const api_user_activate = (id, active) =>
  api_call(`${API_ENDPOINTS.USER_ACTIVATE}/${id}`, {
    data: { active },
  });

const api_pfp_upload = (pfp, crop) =>
  api_call(API_ENDPOINTS.PFP_UPLOAD, {
    data: { pfp, crop },
    method: "POST",
    type: "multipart/form-data",
  });

/**
 * CALENDAR
 */
const api_calendar_all = () => api_call(API_ENDPOINTS.CALENDAR_ALL, { method: "GET" });

const api_calendar_new = (data) =>
  api_call(API_ENDPOINTS.CALENDAR_NEW, {
    data,
    method: "PUT",
    type: "application/x-www-form-urlencoded",
    use_qs: true,
  });

const api_calendar_delete = (id) =>
  api_call(`${API_ENDPOINTS.CALENDAR_DELETE}/${id}`, {
    method: "DELETE",
  });

const api_calendar_update = (id, data) =>
  api_call(`${API_ENDPOINTS.CALENDAR_UPDATE}/${id}`, {
    data,
    method: "PATCH",
    type: "application/x-www-form-urlencoded",
    use_qs: true,
  });

const api_calendar_respond = (id, going, date, guests, response) =>
  api_call(`${API_ENDPOINTS.CALENDAR_RESPOND}/${id}`, {
    data: {
      going,
      date,
      guests: JSON.stringify(guests),
      response,
    },
    method: "POST",
  });

/*
 * WISH WEDNESDAY
 */
const api_wish_wednesday = () => api_call(API_ENDPOINTS.WISH_WEDNESDAY, { method: "GET" });

const api_wish_wednesday_add = (message) =>
  api_call(API_ENDPOINTS.WISH_WEDNESDAY_ADD, { method: "POST", data: { message } });

/**
 * MESSAGING EMAILS
 */
const api_message_email = (roles, html, text, subject) =>
  api_call(API_ENDPOINTS.MESSAGE, {
    data: { roles, html, text, subject },
    method: "POST",
  });

/*
 * ROLES AND MANUAL EVENTS
 */
const api_update_roles = async (id, roles, admin) =>
  api_call(`${API_ENDPOINTS.SET_ROLES}/${id}`, {
    data: { roles, admin },
    method: "PATCH",
    type: "application/json",
  });

const api_add_event = async (id, date, title, hours) =>
  api_call(`${API_ENDPOINTS.ADD_EVENT}/${id}`, {
    data: { date, title, hours },
    method: "POST",
    type: "application/json",
  });

const api_edit_event = async (id, event_id, date, title, hours) =>
  api_call(`${API_ENDPOINTS.EDIT_EVENT}/${id}/${event_id}`, {
    data: { date, title, hours },
    method: "PATCH",
    type: "application/json",
  });

const api_delete_event = async (id, event_id) =>
  api_call(`${API_ENDPOINTS.DELETE_EVENT}/${id}/${event_id}`, {
    method: "DELETE",
    type: "application/json",
  });

export {
  api_validtoken,
  api_login,
  api_signup,
  api_signout,
  api_file_upload,
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
  api_user_activate,
  api_pfp_upload,
  api_calendar_all,
  api_calendar_new,
  api_calendar_delete,
  api_calendar_update,
  api_calendar_respond,
  api_wish_wednesday,
  api_wish_wednesday_add,
  api_message_email,
  api_update_roles,
  api_add_event,
  api_edit_event,
  api_delete_event,
};
