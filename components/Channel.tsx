import { Channel, User } from "@prisma/client"
import { useRouter } from "next/router"
import { Fragment } from "react"
import { BsDoorClosed, BsDoorOpen, BsPeople } from 'react-icons/bs'
import { GoPrimitiveDot } from 'react-icons/go'
import { useAuth } from "../helpers/context/User"
import { handleLeaveChannel, handleJoinChannel } from "../helpers/requests/forum"

export type IChannel = Channel & {
    createdAt: string
    _count: {
        members: number
    }
    members: User[]
    oc: () => void
}

export const ChannelComponent = (channel: IChannel) => {
    const router = useRouter()
    const { token, user } = useAuth()

    return (
        <div
            key={channel.id}
            className="w-full h-32 bg-[#ffffff25] border border-gray-300 rounded-md cursor-pointer hover:bg-white/90 text-white p-3 hover:text-gray-800 group items-center flex"
        >
            <div className="flex justify-start items-start w-full h-full" onClick={() => channel.oc()}>
                <div className='flex justify-start flex-col'>
                    <div className="text-lg font-bold items-center min-w-[35rem]">{channel.title}</div>
                    <div className="text-sm italic text-gray-300 group-hover:text-gray-600">{new Date(channel.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'full' })}</div>
                </div>
                <div className="w-full space-x-6 flex justify-start">
                    <div className="flex justify-center items-center space-x-2">
                        <span>
                            {channel._count.members}/{channel.capacity}
                        </span>
                        <BsPeople />
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="">{channel.open ? (
                            <div className="flex space-x-1 items-center">
                                <span>Ouvert</span>
                                <GoPrimitiveDot className='text-green-500' />
                            </div>
                        ) : (
                            <div className="flex space-x-1 items-center">
                                <span>Fermé</span>
                                <GoPrimitiveDot className="text-red-500" />
                            </div>
                        )}</div>
                    </div>
                </div>
            </div>
            <div className="h-full flex justify-end items-end">
                {token ? (
                    channel.open ?
                        channel.members.find((member: User) => member.id === user?.id) ? (
                            <div aria-disabled className="p-3 rounded-lg min-w-[120px] border flex justify-center items-center bg-[#292929] group-hover:text-white hover:bg-red-500" onClick={() => handleLeaveChannel(channel.id, token)}>
                                Quitter
                            </div>
                        ) : (
                            channel._count.members < channel.capacity && (
                                <div className={`p-3 rounded-lg bg-slate-300 min-w-[120px] text-black flex justify-center items-center space-x-1 hover:bg-green-500 hover:text-white`} onClick={() => handleJoinChannel(channel.id, token)}>
                                    <BsDoorOpen className="" />
                                    <span>Rejoindre</span>
                                </div>
                            )
                        )
                        : (
                            <div className={`p-3 rounded-lg bg-slate-300 min-w-[120px] text-black flex justify-center items-center space-x-1 hover:bg-red-500 hover:text-white cursor-not-allowed`}>
                                <BsDoorClosed className="" />
                                <span>Fermé</span>
                            </div>
                        )
                ) : (
                    <div className={`p-3 rounded-lg bg-[#fff]/20 min-w-[120px] text-black flex justify-center items-center space-x-1 cursor-not-allowed group-hover:bg-[#26262625]`}>
                        <span className="text-sm text-white group-hover:text-black">Se connecter</span>
                    </div>
                )}
            </div>
        </div>
    )

}