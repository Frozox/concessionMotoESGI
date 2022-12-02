import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../helpers/context/User";
import { NextPage } from "next";

const Logout: NextPage = () => {
    const router = useRouter();
    const { closeSession } = useAuth();
    useEffect(() => {
        if (router.pathname === '/logout') {
            closeSession();
            router.push('/');
        }
    }, [router.pathname]);

    return null;
}

export default Logout;