import React from "react";
import { useAuth } from "../../context/User";

export const useSession = () => {
    const { auth: { user, token, isAdmin } } = useAuth();
    const [session, setSession] = React.useState({ user, token, isAdmin })
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        while (user === null) {
            return
        }
        if (user) {
            setLoading(false)
            setSession({ user, token, isAdmin })
        }
    }, [user, token, isAdmin])

    const closeSession = () => {
        localStorage.removeItem('token')
        setSession({ user: null, token: null, isAdmin: false })
    }

    return { session, loading, closeSession };
}