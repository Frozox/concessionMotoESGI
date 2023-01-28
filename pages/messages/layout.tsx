import { adminRequest, User } from "@prisma/client";
import { ContactComponent } from "../../components/Contact"
import { useEffect, useState } from "react";
import { getContacts, sendContactMessage } from "../../helpers/requests/contact";
import { useAuth } from "../../helpers/context/User";
import { getUsers } from "../../helpers/requests/user";
import { ChatInput } from "../../components/ChatInput";
import { cancelAdminRequest, getMyAdminRequests, sendAdminRequest } from "../../helpers/requests/adminRequest";

const LayoutMessages = ({ children, userIdSelected }: { children: JSX.Element, userIdSelected: string | null }) => {
    const [searchValue, setSearchValue] = useState('');
    const searchRegex = new RegExp(searchValue, 'i');
    const [contacts, setContacts] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [chatInputValue, setChatInputValue] = useState<string>('');
    const [adminRequest, setAdminRequest] = useState<adminRequest | null>();
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
            }
        });
    }, [socket, token, user])

    useEffect(() => {
        if (adminRequest) return;
        if (!token) return;
        getMyAdminRequests(token)
            .then(res => res.json()).then(requests => {
                setAdminRequest(requests.find((request: adminRequest) => request.status === "pending"));
            })
    }, [adminRequest, token])

    const handleAdminRequest = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!token) return;
        if (!adminRequest) {
            sendAdminRequest(token);
        }
        else {
            cancelAdminRequest(token).then(res => {
                if (res.ok) {
                    setAdminRequest(null);
                }
            });
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
                                {adminRequest && adminRequest.status === "pending" && (
                                    <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center hover:bg-stone-900 hover:cursor-pointer flex flex-col justify-end" onClick={handleAdminRequest}>En attente de réponse</div>
                                ) ||
                                    <div className="w-full p-3 bg-transparent border rounded-md focus:outline-none text-center hover:bg-stone-900 hover:cursor-pointer flex flex-col justify-end" onClick={handleAdminRequest}>Contacter un conseiller</div>
                                }
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
            </div>
        </div>
    );
}

export default LayoutMessages