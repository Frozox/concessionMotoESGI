import { apiRequest } from ".."

export const sendCommercialNotification = (token:string, payload: any) => {
    return apiRequest({
        url: '/notifs',
        method: 'POST',
        token,  
        payload
    })
}