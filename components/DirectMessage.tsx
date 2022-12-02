import { DirectMessage } from "@prisma/client"

export const DirectMessageComponent = (directMessage: DirectMessage) => {
    return (
        <div key={directMessage.id}>
            <span>{directMessage.content}</span>
        </div>
    )
}