import { apiRequest } from "..";

export const getChannelById = (id: string, token: string) => {
  return apiRequest({
    url: `/channels/${id}`,
    method: "GET",
    token,
  });
};

export const getChannels = () => {
  return apiRequest({
    url: `/channels`,
    method: "GET",
  });
};

export const getChannelMessages = (
  id: string,
  token: string,
  params?: string[] | string | object
) => {
  return apiRequest({
    url: `/channels/${id}/messages`,
    method: "GET",
    token,
    params,
  });
};

export const createChannel = (data: any, token: string, ownerId: string) => {
  const { title, capacity } = data;
  return apiRequest({
    url: `/channels`,
    method: "POST",
    token,
    payload: {
      title,
      capacity: parseInt(capacity),
      ownerId,
    },
  });
};

export const createMessage = (data: any, token: string, channelId: string) => {
  const { content } = data;
  return apiRequest({
    url: `/channels/${channelId}/messages`,
    method: "POST",
    token,
    payload: {
      content,
    },
  });
};

export const updateChannel = (
  payload: any,
  token: string,
  channelId: string
) => {
  return apiRequest({
    url: `/channels/${channelId}`,
    method: "PATCH",
    token,
    payload,
  });
};

export const deleteChannel = (channelId: string, token: string) => {
  return apiRequest({
    url: `/channels/${channelId}`,
    method: "DELETE",
    token,
  });
};

export const handleJoinChannel = (channelId: string, token: string) => {
  return apiRequest({
    url: `/channels/${channelId}/join`,
    method: "PATCH",
    token,
  });
};

export const handleLeaveChannel = (channelId: string, token: string) => {
  return apiRequest({
    url: `/channels/${channelId}/leave`,
    method: "PATCH",
    token,
  });
};
