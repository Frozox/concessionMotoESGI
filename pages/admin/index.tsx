import { useRouter } from "next/router"
import React from "react"


const AdminTableSlug = () => {
    const router = useRouter()

    React.useEffect(() => {
        if (router.pathname === '/admin') {
            router.push('/admin/channels')
        }
    }, [router.pathname])
}

export default AdminTableSlug