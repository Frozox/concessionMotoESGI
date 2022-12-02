import { DirectMessage } from "@prisma/client";
import { useEffect, useState } from "react";
import LayoutMessages from "./layout";
import { useRouter } from "next/router";
import { useAuth } from "../../helpers/context/User";
import { getContactMessages } from "../../helpers/requests/contact";

const ConversationMessages = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const { token } = useAuth();

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
            <div>
                {messages.map((message) => (
                    <div key={message.id}>
                        <p className="text-white">{message.content}</p>
                    </div>
                ))}
            </div>
        </LayoutMessages>
    );
}

export default ConversationMessages