import { Channel, ChannelMessage } from "@prisma/client"
import { useRouter } from "next/router"
import React, { Fragment } from "react"
import { ChatInput } from "../../components/ChatInput"
import { CommentComponent } from "../../components/Message"
import { ChannelSkeleton } from "../../components/Skeleton"
import { useAuth } from "../../helpers/context/User"
import { createMessage, getChannelById, getChannelMessages } from "../../helpers/requests/forum"

type MessageCustomProps = ChannelMessage & {
    author: {
        firstName: string
        lastName: string
    }
}

export const ChannelPage = () => {
    const router = useRouter()
    const { channel } = router.query
    const { token, socket } = useAuth()

    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const [channelMessages, setChannelMessages] = React.useState<MessageCustomProps[]>([])
    const [chatInputValue, setChatInputValue] = React.useState<string>('')
    const [dataChannel, setDataChannel] = React.useState<Channel | null>()

    React.useEffect(() => {
        if (channel && token) {
            getChannelById(channel as string, token).then(res => res.json().then(data => {
                if (res.ok) {
                    setDataChannel(data)
                }
            }));
        }
    }, [channel, token]);

    React.useEffect(() => {
        if (dataChannel && token) {
            getChannelMessages(dataChannel.id, token).then(res => res.json().then(data => {
                if (res.ok) {
                    setChannelMessages(data)
                    setIsLoading(false)
                }
            }));
        }
    }, [dataChannel])

    React.useEffect(() => {
        if (!socket) return;
        socket.removeListener('channelMessage');
        socket.on('channelMessage', (method: string, message: any) => {
            if (method === 'POST') {
                setChannelMessages(prev => [message, ...prev])
            }
        });
    }, [socket])

    const sendMessage = () => {
        if (channel && token) {
            createMessage({ content: chatInputValue }, token, channel as string)
            setChatInputValue('')
        }
    }

    return (
        <div className="px-36 py-5">
            {isLoading ? (
                <ChannelSkeleton />
            ) : (
                <div className="bg-white text-gray-700 h-[80vh] rounded-lg p-3 ">
                    <div className="h-full w-full flex flex-col justify-between">
                        {dataChannel && (
                            <div>
                                <h1 className="text-4xl">{dataChannel.title}</h1>
                                <span>{new Date(dataChannel.createdAt as Date).toLocaleDateString()}</span>
                                <div className="flex flex-col-reverse justify-start h-full min-h-[30rem] mt-5 border rounded-md p-3 overflow-scroll space-y-2">
                                    {channelMessages.map(message => (
                                        <Fragment key={message.id}>
                                            <CommentComponent
                                                user={{ firstName: message.author.firstName, lastName: message.author.lastName }}
                                                content={message.content}
                                                createdAt={message.createdAt}
                                            />
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                        <ChatInput
                            placeholder="Mon commentaire..."
                            btnName="Envoyer"
                            value={chatInputValue}
                            onChange={(e) => setChatInputValue(e.target.value)}
                            onSubmit={() => sendMessage()}
                            theme="light"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && chatInputValue.length > 0) {
                                    sendMessage()
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChannelPage