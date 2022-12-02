import jwt_decode from "jwt-decode";
import { Role, User } from "@prisma/client"
import React, { useCallback } from "react";

export type UserJWT = User & {
    roles: Role[];
};

export type AuthContextType = {
    user: UserJWT | null;
    token: string | null;
    isAdmin: boolean;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    setUser: React.Dispatch<React.SetStateAction<UserJWT | null>>;
    closeSession: () => void;
};


const AuthContext = React.createContext<AuthContextType>({
    user: null,
    token: null,
    isAdmin: false,
    setToken: () => null,
    setUser: () => null,
    closeSession: () => null,
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = React.useState<string | null>(null)
    const [user, setUser] = React.useState<UserJWT | null>(null)
    const valueToWatch = typeof window !== 'undefined' && localStorage.getItem('token')
    const isAdmin = user?.roles?.map((role) => role.name).includes('ADMIN') || false

    const closeSession = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
    }, [])

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const local_token = localStorage.getItem('token')
            setToken(local_token)
            const decoded = token && jwt_decode<UserJWT>(token) || null
            setUser(decoded)
        } else {
            setUser(null)
            setToken(null)
        }
    }, [valueToWatch, typeof window, token])

    const value = React.useMemo(() => ({
        user,
        token,
        isAdmin,
        setToken,
        setUser,
        closeSession,
    }), [user, token, isAdmin, setToken, setUser, closeSession])

    return (
        <AuthContext.Provider value={value}>
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
