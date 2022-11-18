import React from "react"
import { IChannel } from "../../components/Channel"
import { SelectableItemTable } from "../../components/SelectableItemTable"
import { getChannels } from "../../helpers/requests/forum"
import { LayoutAdmin } from "./layout"

const AdminChannels = () => {
    const [channels, setChannels] = React.useState<IChannel[]>([])
    React.useEffect(() => {
        if (channels.length === 0) {
            getChannels().then(res => res.json().then(channel => setChannels(channel)))
        }
    }, [channels.length])
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