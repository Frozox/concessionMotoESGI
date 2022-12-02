import { DirectMessage } from "@prisma/client";
import { useEffect, useState } from "react";
import LayoutMessages from "./layout";
import { useRouter } from "next/router";
import { useAuth } from "../../helpers/context/User";
import { getContactMessages } from "../../helpers/requests/contact";
import { MessageComponent } from "../../components/Message";

const ConversationMessages = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const { token, user } = useAuth();

    useEffect(() => {
        if (userId && token) {
            getContactMessages(token, userId as string).then(res => res.json().then(data => {
                if (res.ok) {
                    setMessages(data)
                }
            }));
        }
    }, [userId, token]);

    return (
        <LayoutMessages userIdSelected={userId as string}>
            <div className="flex flex-col justify-start h-full mb-2 space-y-7 overflow-scroll">
                {messages.map(message => (
                    <MessageComponent message={message.content} owner={message.authorId === user?.id} createdAt={message.createdAt} user={{
                        firstName: message.authorId,
                        lastName: message.authorId,
                    }}
                        theme="dark"
                    />
                ))}
            </div>
        </LayoutMessages>
    );
}

export default ConversationMessages