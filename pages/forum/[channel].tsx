import { Channel, ChannelMessage } from "@prisma/client"
import { useRouter } from "next/router"
import React, { Fragment } from "react"
import { ChatInput } from "../../components/ChatInput"
import { CommentComponent } from "../../components/Message"
import { ChannelSkeleton } from "../../components/Skeleton"
import { useAuth } from "../../helpers/context/User"
import { createMessage, getChannelById, getChannelMessages } from "../../helpers/requests/forum"

interface MessageCustomProps extends ChannelMessage {
    author: {
        firstName: string
        lastName: string
    }
}

interface ChannelCustomProps extends Channel {
    messages: MessageCustomProps[]
}

export const ChannelPage = () => {
    const router = useRouter()
    const { channel } = router.query
    const { token } = useAuth()

    const [channelData, setChannelData] = React.useState<ChannelCustomProps | null>(null)
    const [messages, setMessages] = React.useState<string>('')
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const dataChannel = React.useMemo(() => ({
        info: channelData,
    }), [channelData])

    React.useEffect(() => {
        if (channel && token) {
            const requestChannelData = getChannelById(channel as string, token)
            const requestMessages = getChannelMessages(channel as string, token)
            Promise.all([requestChannelData, requestMessages]).then(res => {
                const [channelData, messages] = res
                channelData.json().then(channelData => {
                    messages.json().then(messages => {
                        setChannelData({ ...channelData, messages })
                        setIsLoading(false)
                    })
                })
            })
        }
    }, [channel])

    const handleSubmit = (data: any) => {
        if (channel && token) {
            createMessage(data, token, channel as string)
            setMessages('')
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
                                <h1 className="text-4xl">{dataChannel.info?.title}</h1>
                                <span>{new Date(dataChannel.info?.createdAt as Date).toLocaleDateString()}</span>
                                <div className="h-full min-h-[30rem] mt-5 border rounded-md p-3 overflow-scroll space-y-2">
                                    {
                                        dataChannel.info?.messages.map(message => (
                                            <Fragment key={message.id}>
                                                <CommentComponent
                                                    user={{ firstName: message.author.firstName, lastName: message.author.lastName }}
                                                    content={message.content}
                                                    createdAt={message.createdAt}
                                                />
                                            </Fragment>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                        <ChatInput
                            placeholder="Mon commentaire..."
                            btnName="Envoyer"
                            value={messages}
                            onChange={(e) => setMessages(e.target.value)}
                            onSubmit={() => handleSubmit({ content: messages })}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit({ content: messages })
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