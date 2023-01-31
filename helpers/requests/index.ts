const BASE_URL = process.env.API_URL || null

interface RequestConfig {
    url: string
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    token?: string
    payload?: any
    params?: any
}

export const apiRequest = ({ url, method, token, payload, params }: RequestConfig) => {
    const searchUrl = new URL(`${BASE_URL}${url}`);
    if (params) {
        searchUrl.search = new URLSearchParams(params).toString();
    }
    return fetch(searchUrl, {
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
