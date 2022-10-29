import { useRouter } from "next/router";
import { useEffect } from "react";

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem("token");
        router.push("/");
    }, [router]);

    return null;
}

export default Logout;