import { apiRequest } from ".."

export const loginRequest = (data: any) => {
    const { email, password } = data
    return apiRequest({
        url: '/login',
        method: 'POST',
        payload: {
            email,
            password
        }
    })
}

export const registerRequest = (data: any) => {
    const { email, password, firstName, lastName } = data
    return apiRequest({
        url: '/users',
        method: 'POST',
        payload: {
            email,
            password,
            firstName,
            lastName
        }
    })
}