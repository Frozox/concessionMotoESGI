import { apiRequest } from ".."

export const postNotifs = (message: string, type: string) => {
    return apiRequest({
        url: '/notifs',
        method: 'POST',
        payload: {
            message,
            type,
        }
    })
}