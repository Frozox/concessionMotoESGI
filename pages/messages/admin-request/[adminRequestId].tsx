import { adminRequest, adminRequestMessage } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { ChatInput } from "../../../components/ChatInput";
import { MessageComponent } from "../../../components/Message";
import { useAuth } from "../../../helpers/context/User";
import { getAdminRequestById, updateAdminRequestById } from "../../../helpers/requests/adminRequest";
import { getAdminRequestMessages, sendAdminRequestMessages } from "../../../helpers/requests/adminRequestMessages";

const AdminRequest: NextPage = () => {
    type adminRequestMessageWithUser = adminRequestMessage & {
        author: {
            id: string,
            firstName: string,
            lastName: string,
            email: string
        }
    }

    const router = useRouter();
    const { adminRequestId } = router.query as { adminRequestId: string };
    const { token, socket, user, isAdmin } = useAuth();
    const [adminRequest, setAdminRequest] = React.useState(null);
    const [adminRequestMessages, setAdminRequestMessages] = React.useState<adminRequestMessageWithUser[]>([]);
    const [chatInputValue, setChatInputValue] = React.useState<string>('');

    const sendMessage = () => {
        if (token && user) {
            sendAdminRequestMessages(token, adminRequestId, { authorId: user.id, content: chatInputValue })
            setChatInputValue('');
        }
    }

    const handleCloseChat = () => {
        if (token && user && isAdmin) {
            setTimeout(() => {
                updateAdminRequestById(token, adminRequestId, { status: 'closed' })
                    .then(() => {
                        router.push('/admin/help');
                    })
            }, 5000);
        }
    }

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
        getAdminRequestMessages(token, adminRequestId)
            .then((res) => res.json())
            .then(messages => {
                setAdminRequestMessages(messages);
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
        socket.removeListener('admin_request_messages');
        socket.on('admin_request_messages', (method: string, requestMessage: adminRequestMessageWithUser) => {
            console.log(method, requestMessage);
            if (method === "POST") {
                if (requestMessage.requestId !== adminRequestId) return;
                setAdminRequestMessages([requestMessage, ...adminRequestMessages]);
            }
        });
    }, [router, socket, token, adminRequestId, adminRequestMessages])

    return (
        <div className="grid grid-rows-[minmax(70%,90%)_10%] w-full md:h-[75vh] h-5/6 bg-transparent border rounded items-center text-black p-3 focus:outline-none">
            <div className="flex flex-col-reverse justify-start h-full mb-2 space-y-7 overflow-scroll scroll-auto">
                {
                    user && adminRequestMessages.map(message => (
                        <MessageComponent key={message.id} message={message.content} owner={message.author.id === user.id} createdAt={message.createdAt} user={{
                            firstName: message.author.firstName,
                            lastName: message.author.lastName,
                        }}
                            theme="dark"
                        />
                    ))
                }
            </div>
            <div className="flex flex-row w-full justify-between">
                {
                    isAdmin &&
                    <div className="w-full max-w-[300px] space-x-2 m-2 p-3 border rounded-md focus:outline-none text-center bg-gray-200 hover:cursor-pointer items-center justify-center flex flex-row" onClick={handleCloseChat}>
                        <span className="text-gray-800">Cloturer la conversation ⚠️</span>
                    </div>
                }
                <div className="w-full">
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
                </div>
            </div>
        </div>
    )
}
export default AdminRequest