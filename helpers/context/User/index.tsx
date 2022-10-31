import jwt_decode from "jwt-decode";
import { Role, User } from "@prisma/client"
import React from "react";

export type UserJWT = User & {
    roles: Role[];
};

const AuthContext = React.createContext<{ user: UserJWT | null, token: string | null, isAdmin: boolean | undefined }>({
    user: null,
    token: null,
    isAdmin: undefined
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = React.useState<string | null>(null)
    const [user, setUser] = React.useState<UserJWT | null>(null)
    const valueToWatch = typeof window !== 'undefined' && localStorage.getItem('token')
    const isAdmin = user?.roles?.map((role) => role.name).includes('ADMIN') || undefined

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const local_token = localStorage.getItem('token')
            setToken(local_token)
            const decoded = token && jwt_decode<UserJWT>(token) || null
            setUser(decoded)
        } else {
            setUser(null)
        }
    }, [valueToWatch, typeof window, token])


    return (
        <AuthContext.Provider value={{ user, token, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
};

const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth }
