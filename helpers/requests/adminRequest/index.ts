import { apiRequest } from "..";

export const getAdminRequests = (token: string) => {
  return apiRequest({
    url: `/users/adminRequests`,
    token,
    method: "GET",
  });
};

export const sendAdminRequest = (token: string) => {
  return apiRequest({
    url: `/users/adminRequests`,
    token,
    method: "POST",
  });
};

export const getAdminRequestById = (token: string, id: string) => {
  return apiRequest({
    url: `/users/adminRequests/${id}`,
    token,
    method: "GET",
  });
};

export const updateAdminRequestById = (
  token: string,
  id: string,
  payload: any
) => {
  return apiRequest({
    url: `/users/adminRequests/${id}`,
    token,
    method: "PATCH",
    payload,
  });
};

export const cancelAdminRequest = (token: string) => {
  return apiRequest({
    url: `/users/adminRequests/cancel`,
    token,
    method: "POST",
  });
};

export const getMyAdminRequests = (token: string) => {
  return apiRequest({
    url: `/users/adminRequests/my`,
    token,
    method: "GET",
  });
};

export const toogleMyAvailability = (token: string) => {
  return apiRequest({
    url: `/users/adminAvailable`,
    token,
    method: "PATCH",
  });
};

export const getAdminAvailable = (token: string) => {
  return apiRequest({
    url: `/users/adminAvailable`,
    token,
    method: "POST",
  });
};
