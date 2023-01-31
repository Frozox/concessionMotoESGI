import { adminRequest } from "@prisma/client"
import { useRouter } from "next/router"
import React from "react"
import { useAuth } from "../../helpers/context/User"
import { getInitial } from "../../helpers/helper"
import { getAdminRequests, toogleMyAvailability, updateAdminRequestById } from "../../helpers/requests/adminRequest"
import { getUserById } from "../../helpers/requests/user"
import { LayoutAdmin } from "./layout"

const AdminHelp = () => {
    const router = useRouter();
    const { socket, token, user } = useAuth();

    type adminRequestWithUser = adminRequest & {
        user: {
            firstName: string,
            lastName: string,
            email: string
        }, requestApprover: {
            firstName: string,
            lastName: string,
            email: string
        }
    }

    const [adminRequests, setAdminRequests] = React.useState<adminRequestWithUser[]>([])
    const [myAvailibility, setmyAvailibility] = React.useState<boolean>(false)


    const statusList = [
        { slug: "pending", status: 'En attente', color: 'bg-yellow-200 text-yellow-800' },
        { slug: "accepted", status: 'Accepté', color: 'bg-green-200 text-green-800' },
        { slug: "declined", status: 'Refusé', color: 'bg-red-200 text-red-800' },
        { slug: "cancelled", status: 'Annulé', color: 'bg-gray-200 text-gray-800' },
        { slug: "closed", status: 'Cloturé', color: 'bg-blue-200 text-blue-800' }
    ]

    React.useEffect(() => {
        if (adminRequests.length === 0 && token) {
            getAdminRequests(token)
                .then(res => res.json())
                .then(adminRequest => setAdminRequests(adminRequest))
        }
    }, [adminRequests.length, token])

    React.useEffect(() => {
        if (!socket) return;
        socket.removeListener('admin_notifications_in_tab');
        socket.on('admin_notifications_in_tab', (method: string, request: adminRequestWithUser) => {
            if (method === "POST") {
                setAdminRequests(prev => [request, ...prev])
            } else if (method === "PATCH") {
                setAdminRequests(adminRequests.map(adminRequest => {
                    if (adminRequest.id === request.id) {
                        return request;
                    }
                    return adminRequest;
                }))
            }
        });
        if (!token || !user) return;
        getUserById(token, user.id).then(res => res.json()).then(user => setmyAvailibility(user.isAvailable))
    }, [socket, adminRequests, token, user])

    const handleSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, requestId: string, action: string, status: string) => {
        if (!token || !user) return;
        if (action === 'close' && status === 'accepted') {
            return updateAdminRequestById(token, requestId, { status: 'closed' })
        }
        if(!myAvailibility) return;
        if (status !== 'pending') return;
        if (action === 'accept') {
            updateAdminRequestById(token, requestId, { status: 'accepted', requestApproverId: user.id })
            console.log('Vous allez être redirigé vers la page de la demande dans 5 secondes');
            setTimeout(() => {
                router.push(`/messages/admin-request/${requestId}`);
            }, 5000)
        } else if (action === 'decline') {
            updateAdminRequestById(token, requestId, { status: 'declined', requestApproverId: user.id })
        }
    }

    const handleChangeAvailaibility = () => {
        if (!token) return;
        toogleMyAvailability(token)
            .then(res => res.json())
            .then(available => setmyAvailibility(available))
    }

    return (
        <LayoutAdmin>
            <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-end">
                    <div className="flex items-center space-x-2">
                        <div className="text-sm font-semibold">Ma disponibilité</div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={myAvailibility} onClick={handleChangeAvailaibility} onChange={() => {}} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
                <div className="space-y-2">
                    {adminRequests.map((request, index) => {
                        return (
                            <div key={index} className="bg-white rounded-md p-2">
                                <div className="flex justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-1xl font-semibold text-gray-600">{getInitial(request.user.firstName + ' ' + request.user.lastName)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold">{request.user.firstName} {request.user.lastName}</div>
                                            <div className="text-xs text-gray-500">{request.user.email}</div>
                                            <div className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className={`inline-flex items-center w-[90px] px-2 py-1 text-sm font-medium rounded justify-center ${statusList.find(status => status.slug === request.status)?.color}`}>{statusList.find(status => status.slug === request.status)?.status}</div>
                                    </div>
                                    <div className="flex justify-between items-center p-3 space-x-2 w-full">
                                        {request.status === 'cancelled' && (
                                            <div className="flex space-x-2">
                                                <span className="text-xs text-gray-500 items-center justify-center flex">{"Annulé par l'utilisateur"}</span>
                                            </div>
                                        )}
                                        {request.requestApprover && (
                                            <div className="flex space-x-2">
                                                <span className="text-xs text-gray-500 items-center justify-center flex">Conseiller associé</span>
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-1xl font-semibold text-gray-600">{getInitial(request.requestApprover.firstName + ' ' + request.requestApprover.lastName)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="text-sm font-semibold">{request.requestApprover.firstName} {request.requestApprover.lastName}</div>
                                                    <div className="text-xs text-gray-500">{request.requestApprover.email}</div>
                                                </div>
                                            </div>
                                        ) || <div />}
                                        <div className="flex space-x-2">
                                            {request.status === 'accepted' && (
                                                <div className="text-white rounded-md px-2 py-1 bg-blue-500 hover:cursor-pointer" onClick={(e) => handleSelect(e, request.id, "close", request.status)}>Cloturer la demande</div>
                                            )}
                                            {request.status === 'pending' && (
                                                <>
                                                    <div className={`text-white rounded-md px-2 py-1 ${myAvailibility ? 'bg-green-500 hover:cursor-pointer' : 'bg-gray-500'}`} onClick={(e) => handleSelect(e, request.id, "accept", request.status)}>Accepter</div>
                                                    <div className={`text-white rounded-md px-2 py-1 ${myAvailibility ? 'bg-red-500 hover:cursor-pointer' : 'bg-gray-500'}`} onClick={(e) => handleSelect(e, request.id, "decline", request.status)}>Refuser</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </LayoutAdmin>
    )
}

export default AdminHelp