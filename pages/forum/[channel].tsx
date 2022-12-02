import { Channel } from "@prisma/client"
import { useRouter } from "next/router"
import React, { Fragment } from "react"
import { CommentComponent } from "../../components/Message"
import { useAuth } from "../../helpers/context/User"
import { getChannelById } from "../../helpers/requests/forum"

export const ChannelPage = () => {
    const router = useRouter()
    const { channel } = router.query
    const { token } = useAuth()

    const [channelData, setChannelData] = React.useState<Channel | null>(null)

    React.useEffect(() => {
        if (channel && token) {
            const request = getChannelById(channel as string, token)
            request.then(res => res.json()).then(res => setChannelData(res))
        }
    }, [channel])

    return (
        <div className="px-36 py-5">
            <div className="bg-white text-gray-700 h-[80vh] rounded-lg p-3 ">
                <div className="h-full w-full flex flex-col justify-between">
                    {channelData && (
                        <div>
                            <h1 className="text-4xl">{channelData?.title}</h1>
                            <span>{new Date(channelData?.createdAt).toLocaleDateString()}</span>
                            <div className="h-full min-h-[30rem] mt-5 border rounded-md p-3 overflow-scroll space-y-2">
                                <CommentComponent />
                            </div>
                        </div>
                    )}
                    <input type='text' placeholder="Mon commentaire ..." className="p-3 border rounded-md focus:outline-none flex  w-full" />
                </div>
            </div>
        </div>
    )
}

export default ChannelPage