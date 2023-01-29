import { adminRequest } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../../../helpers/context/User";
import { getAdminRequestById } from "../../../helpers/requests/adminRequest";

const AdminRequest: NextPage = () => {
    const router = useRouter();
    const { adminRequestId } = router.query as { adminRequestId: string };
    const { token, socket } = useAuth();
    const [adminRequest, setAdminRequest] = React.useState(null);

    React.useEffect(() => {
        if (!token || !adminRequestId) return;
        if (adminRequest) return;
        getAdminRequestById(token, adminRequestId)
            .then((res) => res.json())
            .then(request => {
                if (request.status !== 'accepted') {
                    router.push('/messages');
                    return;
                }
            })
            .catch(err => {
                router.push('/messages');
            })
    }, [adminRequest, adminRequestId, token, router]);

    React.useEffect(() => {
        if (!socket) return;
        if (!token) return;

        socket.removeListener('admin_request_status');
        socket.on('admin_request_status', (method: string, request: adminRequest) => {
            if (method === "PATCH" && request.status === 'closed') {
                return router.push('/messages');
            }
        });
    }, [router, socket, token])

    React.useEffect(() => {
        console.log(adminRequest);
    }, [adminRequest]);

    return (
        <>
            <span>Page de communication admin / user</span>
        </>
    )
}
export default AdminRequest