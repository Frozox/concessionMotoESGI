import { apiRequest } from ".."

export const getChannelById = (id: string, token: string) => {
    return apiRequest({
        url: `/channels/${id}`,
        method: 'GET',
        token
    })
}

export const getChannels = () => {
    return apiRequest({
        url: `/channels`,
        method: 'GET'
    })
}

export const createChannel = (data: any, token: string, ownerId: string) => {
    const { title, capacity } = data
    return apiRequest({
        url: `/channels`,
        method: 'POST',
        token,
        payload: {
            title,
            capacity: parseInt(capacity),
            ownerId
        }
    })
}

export const updateChannel = (data: any, token: string, channelId: string) => {
    const { title, capacity } = data
    return apiRequest({
        url: `/channels/${channelId}`,
        method: 'PATCH',
        token,
        payload: {
            title,
            capacity,

        }
    })
}

export const handleJoinChannel = (channelId: string, token: string) => {
    return apiRequest({
        url: `/channels/${channelId}/join`,
        method: 'PATCH',
        token
    })
}

export const handleLeaveChannel = (channelId: string, token: string) => {
    return apiRequest({
        url: `/channels/${channelId}/leave`,
        method: 'PATCH',
        token
    })
}