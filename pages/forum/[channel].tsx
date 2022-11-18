import { Channel } from "@prisma/client"
import { useRouter } from "next/router"
import React, { Fragment } from "react"
import { useAuth } from "../../helpers/context/User"
import { getChannelById } from "../../helpers/requests/forum"

export const ChannelPage = () => {
    const router = useRouter()
    const { channel } = router.query
    const { auth: { token } } = useAuth()

    const [channelData, setChannelData] = React.useState<Channel | null>(null)

    React.useEffect(() => {
        if (channel && token) {
            const request = getChannelById(channel as string, token)
            request.then(res => res.json()).then(res => setChannelData(res))
        }
    }, [channel])

    return (
        <div className="px-36 py-5">
            <div className="">
                <h1 className="text-4xl">{channelData?.title}</h1>
            </div>
        </div>
    )
}

export default ChannelPage