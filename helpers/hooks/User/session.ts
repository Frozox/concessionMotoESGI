import React from "react";
import { useAuth } from "../../context/User";

export const useSession = () => {
    const { user, token, isAdmin } = useAuth()
    const [session, setSession] = React.useState({ user, token, isAdmin })
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        while (user === undefined) {
            return
        }
        if (user) {
            setLoading(false)
            setSession({ user, token, isAdmin })
        }
    }, [user, token, isAdmin])
    return { session, loading };
}