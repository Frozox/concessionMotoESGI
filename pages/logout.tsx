import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "../helpers/hooks/User/session";
import { useAuth } from "../helpers/context/User";
import { NextPage } from "next";

const Logout: NextPage = () => {
    const router = useRouter();
    const { closeSession } = useSession();
    useEffect(() => {
        if (router.pathname === '/logout') {
            closeSession();
            router.push('/');
        }
    }, [router.pathname]);

    return null;
}

export default Logout;