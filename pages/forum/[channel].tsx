import { useRouter } from "next/router"


export const ChannelPage = () => {
    const router = useRouter()
    const { channel } = router.query
    return (
        <div className="px-36 py-5">
            <div className="">
                <h1>Channel: {channel}</h1>
            </div>
        </div>
    )
}

export default ChannelPage