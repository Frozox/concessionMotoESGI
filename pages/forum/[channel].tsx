import { useRouter } from "next/router"


export const ChannelPage = () => {
    const router = useRouter()
    const { channel } = router.query
    return (
        <div>
            <h1>Channel: {channel}</h1>
        </div>
    )
}

export default ChannelPage