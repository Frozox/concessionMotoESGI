import { Channel } from "@prisma/client"
import { useRouter } from "next/router"
import React, { Fragment } from "react"
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
            <div className="bg-white text-gray-700 h-[10rem] rounded-lg p-3">
                {channelData && (
                    <Fragment>
                        <h1 className="text-4xl">{channelData?.title}</h1>
                        <span>{new Date(channelData?.createdAt).toLocaleDateString()}</span>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default ChannelPage