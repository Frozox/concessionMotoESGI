import { apiRequest } from ".."

export const getChannelById = (id: string, token: string) => {
    return apiRequest({
        url: `/channels/${id}`,
        method: 'GET',
        token
    })
}