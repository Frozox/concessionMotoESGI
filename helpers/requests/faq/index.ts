import { apiRequest } from ".."

export const getFAQs = () => {
    return apiRequest({
        url: '/faq',
        method: 'GET',
    })
}