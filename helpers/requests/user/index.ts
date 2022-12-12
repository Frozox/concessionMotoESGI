import { apiRequest } from "..";

export const getUsers = (token: string, match: string) => {
  return apiRequest({
    url: `/users`,
    token,
    method: "GET",
    params: {
        match,
    },
  });
};