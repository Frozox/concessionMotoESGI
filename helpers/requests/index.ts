const BASE_URL = process.env.API_URL || null

interface RequestConfig {
    url: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    token?: string
    payload?: string
}

export const apiRequest = ({ url, method, token, payload }: RequestConfig) => {
    console.log('apiRequest', BASE_URL, url)
    return fetch(`${BASE_URL}${url}`, {
        method,
        headers: token ? {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        } : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    })
}
