import { NextPage } from "next"
import React from "react"
import { ChannelComponent, IChannel } from "../../components/Channel"
import { HiOutlineChatAlt2 } from 'react-icons/hi'
import { AiOutlineStar } from 'react-icons/ai'
import { getChannels } from "../../helpers/requests/forum"
import { useAuth } from "../../helpers/context/User"

export const Forum: NextPage = () => {
    const [searchValue, setSearchValue] = React.useState('');
    const searchRegex = new RegExp(searchValue, 'i');
    const [channels, setChannels] = React.useState<IChannel[]>([])
    const { token, socket } = useAuth()

    React.useEffect(() => {
        getChannels().then(res => res.json().then(channel => setChannels(channel)))
    }, []);

    React.useEffect(() => {
        if(!socket) return;
        socket.removeListener('channels');
        socket.on('channels', (method: string, channel: any) => {
            if (method === 'POST') {
                setChannels(prev => [...prev, channel])
            }
            else if (method === 'DELETE') {
                setChannels(prev => prev.filter(c => c.id !== channel.id))
            }
            else if (method === 'PATCH') {
                setChannels(prev => prev.map(c => c.id === channel.id ? channel : c))
            }
        });
    }, [socket])

    return (
        <div className="w-full h-full py-5 flex justify-start items-center relative">
            <div className="flex justify-start items-start flex-col h-full w-72 text-sm mx-5 px-3 space-y-2">
                <div className="p-2 rounded-lg text-start flex justify-center items-center space-x-2">
                    <HiOutlineChatAlt2 className="inline-block" />
                    <span className="cursor-pointer hover:font-bold">Toutes les discussions</span>
                </div>
                <div className="p-2 rounded-lg text-start flex justify-center items-center space-x-2">
                    <AiOutlineStar className="inline-block" />
                    <span className="cursor-pointer hover:font-bold">Suivis</span>
                </div>
            </div>
            <div className="w-full h-full space-y-3 flex justify-start flex-col mr-5">
                <div>
                    <input type="text" className="w-full p-3 bg-transparent border rounded-md focus:outline-none" placeholder="Rechercher discussions" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                </div>
                {channels && channels.filter((item) => searchRegex.test(item.title)).map((channel) => (
                    <ChannelComponent
                        {...channel}
                        key={channel.id}
                    />
                ))}
            </div>
        </div>
    )
}

export default Forum