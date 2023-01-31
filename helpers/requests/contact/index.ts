import { apiRequest } from "..";

export const getContacts = (token: string) => {
  return apiRequest({
    url: `/users/contacts`,
    token,
    method: "GET",
  });
};

export const getContactMessages = (token: string, userId: string, params?: string[]|string|object) => {
  return apiRequest({
    url: `/users/${userId}/messages`,
    token,
	method: "GET",
	params
  });
};

export const sendContactMessage = (token: string, userId: string, content: string) => {
  return apiRequest({
	url: `/users/${userId}/messages`,
    token,
    method: "POST",
    payload: {
      content 
    },
  })
}
