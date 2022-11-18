const BASE_URL = process.env.API_URL || null

interface RequestConfig {
    url: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    token?: string
    payload?: any
}

export const apiRequest = ({ url, method, token, payload }: RequestConfig) => {
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
