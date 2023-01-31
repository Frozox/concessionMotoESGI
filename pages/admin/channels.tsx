import React from "react"
import { IChannel } from "../../components/Channel"
import { SelectableItemTable } from "../../components/SelectableItemTable"
import { useAuth } from "../../helpers/context/User"
import { getChannels } from "../../helpers/requests/forum"
import LayoutAdmin from "./layout"

const AdminChannels = () => {
    const [channels, setChannels] = React.useState<IChannel[]>([])
    const { socket } = useAuth()

    React.useEffect(() => {
        if (channels.length === 0) {
            getChannels().then(res => res.json().then(channel => setChannels(channel)))
        }
    }, [channels.length])

    React.useEffect(() => {
        if (!socket) return;
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
        <LayoutAdmin>
            <div className="space-y-2">
                {
                    channels.map((channel, index) => (
                        <SelectableItemTable
                            key={index}
                            title={channel.title}
                            members={channel.members}
                            capacity={channel.capacity}
                            id={channel.id}
                            owner={channel.ownerId}
                            createdAt={channel.createdAt}
                            status={channel.open}
                        />
                    ))
                }
            </div>
        </LayoutAdmin>
    )
}

export default AdminChannels