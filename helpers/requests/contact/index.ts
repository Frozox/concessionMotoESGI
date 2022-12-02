import { apiRequest } from "..";

export const getContacts = (token: string) => {
  return apiRequest({
    url: `/users/contacts`,
    token,
    method: "GET",
  });
};

export const getContactMessages = (token: string, $userId: string) => {
  return apiRequest({
    url: `/users/${$userId}/messages`,
    token,
    method: "GET",
  });
};