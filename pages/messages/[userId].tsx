import { DirectMessage } from "@prisma/client";
import { useEffect, useState } from "react";
import LayoutMessages from "./layout";
import { useRouter } from "next/router";

const ConversationMessages = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [messages, setMessages] = useState<DirectMessage[]>([]);

    useEffect(() => {
        if (userId) {
            fetch(`/api/users/${userId}/messages`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json()).then(setMessages);
        }
    }, [userId]);

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