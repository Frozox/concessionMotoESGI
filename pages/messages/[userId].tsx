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
    const [canSrcoll, setCanScroll] = useState<boolean>(true);
    const { token, user } = useAuth();

    const handleScroll = (event: any) => {
        if (canSrcoll && token && Math.abs(event.target.scrollTop) >= event.target.scrollHeight - event.target.clientHeight - 10) {
            setCanScroll(false);
            getContactMessages(token, userId as string, { beforeCreatedAt: messages[messages.length - 1].createdAt }).then(res => res.json().then(data => {
                if (res.ok) {
                    if (data.length === 0) return;
                    setMessages([...messages, ...data]);
                    setCanScroll(true);
                }
            }));
        }
    }

    useEffect(() => {
        if (userId && token) {
            getContactMessages(token, userId as string).then(res => res.json().then(data => {
                if (res.ok) {
                    setMessages(data)
                }
            }));
        }
    }, [userId, token]);

    useEffect(() => {
        setCanScroll(true);
    }, [userId]);

    return (
        <LayoutMessages userIdSelected={userId as string}>
            <div className="flex flex-col-reverse justify-start h-full mb-2 space-y-7 overflow-scroll scroll-auto" onScroll={handleScroll}>
                {messages.map(message => (
                    <MessageComponent key={message.id} message={message.content} owner={message.authorId === user?.id} createdAt={message.createdAt} user={{
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

function useCallback(arg0: () => JSX.Element) {
        throw new Error("Function not implemented.");
    }
