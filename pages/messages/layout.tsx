import { adminRequest, User } from "@prisma/client";
import { ContactComponent } from "../../components/Contact"
import { useEffect, useState } from "react";
import { getContacts, sendContactMessage } from "../../helpers/requests/contact";
import { useAuth } from "../../helpers/context/User";
import { getUsers } from "../../helpers/requests/user";
import { ChatInput } from "../../components/ChatInput";
import { cancelAdminRequest, getAdminAvailable, getMyAdminRequests, sendAdminRequest } from "../../helpers/requests/adminRequest";
import { useRouter } from "next/router";

const LayoutMessages = ({ children, userIdSelected }: { children: JSX.Element, userIdSelected: string | null }) => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const searchRegex = new RegExp(searchValue, 'i');
    const [contacts, setContacts] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [chatInputValue, setChatInputValue] = useState<string>('');
    const [triggerOnce, setTriggerOnce] = useState<boolean>(false);
    const [adminRequest, setAdminRequest] = useState<adminRequest | null>();
    const [adminAvailable, setAdminAvailable] = useState<boolean>(false);
    const { token, user, socket } = useAuth()

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

    const sendMessage = () => {
        if (token && userIdSelected) {
            sendContactMessage(token, userIdSelected, chatInputValue);
            setChatInputValue('');
        }
    }

    useEffect(() => {
        if (contacts.length < 1 && token) {
            getContacts(token).then(res => res.json().then(data => {
                if (res.ok) {
                    setContacts(data)
                }
            }))
        }
    }, [contacts.length, token]);

    useEffect(() => {
        if (searchValue.length > 0 && token && user) {
            getUsers(token, searchValue).then(res => res.json().then(data => {
                if (res.ok) {
                    setUsers(data.filter((item: User) => !contacts.some((contact: User) => contact.id === item.id) && item.id !== user.id))
                }
            }))
        }
        else if (searchValue.length === 0) {
            setUsers([])
        }
    }, [searchValue, users.length, token, user, contacts]);

    useEffect(() => {
        if (!socket) return;
        if (!token || !user) return;
        if (user.roles.some((role) => role.name === 'ADMIN')) return;

        socket.removeListener('admin_request_status');
        socket.on('admin_request_status', (method: string, request: adminRequestWithUser) => {
            if (method === "POST" || method === "PATCH") {
                setAdminRequest(request);
                if (request.status === "declined" || request.status === "cancelled") {
                    setTimeout(() => {
                        setAdminRequest(null);
                    }, 8000);
                }
                if (request.status === "accepted") {
                    setTimeout(() => {
                        setAdminRequest(null);
                        router.push(`/messages/admin-request/${request.id}`);
                    }, 5000);
                }
            }
        });

        socket.removeListener('admin_available');
        socket.on('admin_available', (available: boolean) => {
            setAdminAvailable(available);
        })
    }, [router, socket, token, user])

    useEffect(() => {
        if (triggerOnce) return;
        if (adminRequest) return;
        if (!token) return;
        getMyAdminRequests(token)
            .then(res => res.json()).then(requests => {
                setAdminRequest(requests.find((request: adminRequest) => request.status === "pending"));
                setTriggerOnce(true);
            })
        getAdminAvailable(token)
            .then(res => res.json()).then(admins => {
                setAdminAvailable(admins._count.id > 0);
            })
    }, [adminRequest, token, triggerOnce])

    const handleAdminRequest = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!token) return;
        if (!adminRequest) return sendAdminRequest(token);
        if (adminRequest.status === "pending") {
            cancelAdminRequest(token);
        }
    }

    return (
        <div className="w-full h-full pt-5 flex justify-start items-center relative">
            <div className="w-full h-full space-y-3 flex justify-start flex-col m-5">
                <div className="grid md:h-[75vh] h-5/6 grid-cols-[minmax(150px,_20%)_10px_minmax(60%,_80%)]">
                    <div className="md:h-[75vh] h-5/6 overflow-y-auto space-y-2 flex flex-col">
                        <div className="flex flex-col h-full">
                            <input type="text" className="w-full p-3 bg-transparent border rounded-md focus:outline-none" placeholder="Rechercher/lancer une discussion" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                            <p className="uppercase" hidden={(users && users.length <= 0)}>Nouvelle discussion</p>
                            {users && users.filter((item) => searchRegex.test(`(${item.firstName})|(${item.lastName})`)).map((user) => (
                                <ContactComponent key={user.id} user={user} isSelected={userIdSelected === user.id} />
                            ))}
                            <p className="uppercase">Mes discussions</p>
                            {contacts && contacts.length > 0 && contacts.filter((item) => searchRegex.test(`(${item.firstName})|(${item.lastName})`)).map((contact) => (
                                <ContactComponent key={contact.id} user={contact} isSelected={userIdSelected === contact.id} />
                            ))}
                            {contacts && contacts.filter((item) => searchRegex.test(`(${item.firstName})|(${item.lastName})`)).length <= 0 && (
                                <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none"><p className="text-center">Aucune discussion</p></div>
                            )}
                        </div>
                        {!user?.roles.some((role) => role.name === 'ADMIN') && (
                            <>
                                {adminAvailable && (
                                    adminRequest && (
                                        adminRequest.status === "pending" && (
                                            <>
                                                <div className="w-full p-3 border rounded-md focus:outline-none text-center bg-gray-200 hover:cursor-pointer items-center justify-center flex flex-row" onClick={handleAdminRequest}>
                                                    <span className="text-gray-800">Annuler ma demande ⚠️</span>
                                                </div>
                                                <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center bg-stone-900 hover:cursor-not-allowed items-center justify-center flex flex-row">
                                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                    </svg>
                                                    {"En attente d'un conseiller"}
                                                </div>
                                            </>
                                        ) || adminRequest.status === "declined" && (
                                            <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center bg-stone-900 hover:cursor-not-allowed flex flex-col justify-end">{"votre demande n'a pas été accepetée 🙁"}</div>
                                        ) || adminRequest.status === "cancelled" && (
                                            <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center bg-stone-900 hover:cursor-not-allowed flex flex-col justify-end">{"votre demande a été annulée 🙁"}</div>
                                        ) || adminRequest.status === "accepted" && (
                                            <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center bg-stone-900 hover:cursor-not-allowed items-center justify-center flex flex-row">
                                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                                Vous allez être redirigé vers le chat...
                                            </div>
                                        )
                                    ) || (
                                        <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center hover:bg-stone-900 hover:cursor-pointer flex flex-col justify-end" onClick={handleAdminRequest}>Contacter un conseiller</div>
                                    )
                                ) || (
                                        <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center bg-stone-900 hover:cursor-not-allowed flex flex-col justify-end">Aucun conseiller disponible 🙁</div>
                                    )}
                            </>
                        )}
                    </div>
                    <div />
                    <div className="grid grid-rows-[minmax(70%,90%)_10%] w-full md:h-[75vh] h-5/6 bg-transparent border rounded items-center text-black p-3 focus:outline-none">
                        {children}
                        {
                            userIdSelected && (
                                <ChatInput
                                    placeholder="Contenu du message"
                                    btnName="Envoyer"
                                    value={chatInputValue}
                                    onChange={(e) => setChatInputValue(e.target.value)}
                                    onSubmit={sendMessage}
                                    theme="dark"
                                    onKeyPress={
                                        (e) => {
                                            if (e.key === 'Enter' && chatInputValue.length > 0) {
                                                sendMessage()
                                            }
                                        }
                                    }
                                />
                            )
                        }
                    </div>
                </div>
            </div >
        </div >
    );
}

export default LayoutMessages