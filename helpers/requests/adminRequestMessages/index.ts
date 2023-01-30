import { apiRequest } from "..";

export const getAdminRequestMessages = (
  token: string,
  adminRequestId: string
) => {
  return apiRequest({
    url: `/users/adminRequests/${adminRequestId}/messages`,
    token,
    method: "GET",
  });
};

export const sendAdminRequestMessages = (
  token: string,
  adminRequestId: string,
  payload: any
) => {
  return apiRequest({
    url: `/users/adminRequests/${adminRequestId}/messages`,
    token,
    payload,
    method: "POST",
  });
};
