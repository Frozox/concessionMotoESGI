import { Channel } from "@prisma/client"
import { useRouter } from "next/router"

type IChannel = {
    channel: Channel
}

export const ChannelComponent = ({ channel }: IChannel) => {
    const router = useRouter()
    return (
        <div
            key={channel.id}
            className="w-full h-32 bg-white rounded-md grid grid-cols-2 items-center cursor-pointer hover:bg-white/90 text-black p-3"
            onClick={() => router.push(`/forum/${channel.id}`)}
        >
            <div className="row-span-4 h-full grid-row-2">
                <div className="text-lg font-bold items-center">{channel.title}</div>
                <div className="text-sm italic text-gray-600">{channel.createdAt.toDateString()}</div>
            </div>
            <div className="grid-cols-3">
                <div className="row-span-4 flex justify-center items-center">
                    <div className="">/{channel.capacity}</div>
                </div>
                <div className="row-span-4 flex justify-center items-center">
                    <div className="">{channel.status}</div>
                </div>
                <div className="row-span-4 h-full flex justify-end items-end">
                    <span className="p-3 rounded-lg bg-slate-300">Rejoindre</span>
                </div>
            </div>

        </div>
    )

}